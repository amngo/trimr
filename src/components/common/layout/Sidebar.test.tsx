import { render, screen, fireEvent, waitFor } from '@/test-utils/test-utils';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import { useSidebarStore } from '@/stores';
import { mockLocalStorage } from '@/test-utils/test-helpers';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
    usePathname: jest.fn(),
}));

// Mock the sidebar store
jest.mock('@/stores', () => ({
    useSidebarStore: jest.fn(),
}));

// Mock auth-client
jest.mock('@/lib/auth-client', () => ({
    useSession: jest.fn(() => ({
        data: null,
        isPending: false,
        error: null,
    })),
    signIn: { email: jest.fn(), github: jest.fn(), google: jest.fn() },
    signUp: { email: jest.fn() },
    signOut: jest.fn(),
}));

const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;
const mockUseSidebarStore = useSidebarStore as jest.MockedFunction<
    typeof useSidebarStore
>;

describe('Sidebar', () => {
    const defaultStoreState = {
        isOpen: true,
        isMobile: false,
        setSidebarOpen: jest.fn(),
        setIsMobile: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockUsePathname.mockReturnValue('/dashboard');
        mockUseSidebarStore.mockReturnValue(defaultStoreState);
        mockLocalStorage();

        // Mock window.innerWidth
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: 1024,
        });

        // Mock ResizeObserver
        global.ResizeObserver = jest.fn().mockImplementation(() => ({
            observe: jest.fn(),
            unobserve: jest.fn(),
            disconnect: jest.fn(),
        }));
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should render sidebar when isOpen is true', () => {
        render(<Sidebar />);

        expect(screen.getByText('trimr')).toBeInTheDocument();
        expect(screen.getByText('URL Shortener')).toBeInTheDocument();
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Analytics')).toBeInTheDocument();
    });

    it('should not render sidebar when isOpen is false', () => {
        mockUseSidebarStore.mockReturnValue({
            ...defaultStoreState,
            isOpen: false,
        });

        render(<Sidebar />);

        expect(screen.queryByText('trimr')).not.toBeInTheDocument();
    });

    it('should highlight active route correctly', () => {
        mockUsePathname.mockReturnValue('/dashboard');
        render(<Sidebar />);

        const dashboardLink = screen.getByText('Dashboard').closest('a');
        const analyticsLink = screen.getByText('Analytics').closest('a');

        expect(dashboardLink).toHaveClass('bg-primary');
        expect(analyticsLink).not.toHaveClass('bg-primary');
    });

    it('should highlight analytics route when on stats page', () => {
        mockUsePathname.mockReturnValue('/stats');
        render(<Sidebar />);

        const dashboardLink = screen.getByText('Dashboard').closest('a');
        const analyticsLink = screen.getByText('Analytics').closest('a');

        expect(analyticsLink).toHaveClass('bg-primary');
        expect(dashboardLink).not.toHaveClass('bg-primary');
    });

    it('should show mobile close button when isMobile is true', () => {
        mockUseSidebarStore.mockReturnValue({
            ...defaultStoreState,
            isMobile: true,
        });

        render(<Sidebar />);

        const closeButton = screen.getByRole('button');
        expect(closeButton).toBeInTheDocument();
    });

    it('should not show mobile close button when isMobile is false', () => {
        render(<Sidebar />);

        // Only AuthButton should be present (as a link), not the close button
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
        expect(
            screen.getByRole('link', { name: /sign in/i }),
        ).toBeInTheDocument();
    });

    it('should call setSidebarOpen(false) when close button is clicked', () => {
        const mockSetSidebarOpen = jest.fn();
        mockUseSidebarStore.mockReturnValue({
            ...defaultStoreState,
            isMobile: true,
            setSidebarOpen: mockSetSidebarOpen,
        });

        render(<Sidebar />);

        const closeButton = screen.getByRole('button');
        fireEvent.click(closeButton);

        expect(mockSetSidebarOpen).toHaveBeenCalledWith(false);
    });

    it('should show mobile backdrop when mobile and open', () => {
        mockUseSidebarStore.mockReturnValue({
            ...defaultStoreState,
            isMobile: true,
        });

        const { container } = render(<Sidebar />);

        const backdrop = container.querySelector(
            '.fixed.inset-0.bg-black.bg-opacity-50',
        );
        expect(backdrop).toBeInTheDocument();
    });

    it('should close sidebar when backdrop is clicked', () => {
        const mockSetSidebarOpen = jest.fn();
        mockUseSidebarStore.mockReturnValue({
            ...defaultStoreState,
            isMobile: true,
            setSidebarOpen: mockSetSidebarOpen,
        });

        const { container } = render(<Sidebar />);

        const backdrop = container.querySelector(
            '.fixed.inset-0.bg-black.bg-opacity-50',
        );
        fireEvent.click(backdrop!);

        expect(mockSetSidebarOpen).toHaveBeenCalledWith(false);
    });

    it('should close sidebar when navigation link is clicked on mobile', () => {
        const mockSetSidebarOpen = jest.fn();
        mockUseSidebarStore.mockReturnValue({
            ...defaultStoreState,
            isMobile: true,
            setSidebarOpen: mockSetSidebarOpen,
        });

        render(<Sidebar />);

        const analyticsLink = screen.getByText('Analytics');
        fireEvent.click(analyticsLink);

        expect(mockSetSidebarOpen).toHaveBeenCalledWith(false);
    });

    it('should not close sidebar when navigation link is clicked on desktop', () => {
        const mockSetSidebarOpen = jest.fn();
        mockUseSidebarStore.mockReturnValue({
            ...defaultStoreState,
            isMobile: false,
            setSidebarOpen: mockSetSidebarOpen,
        });

        render(<Sidebar />);

        const analyticsLink = screen.getByText('Analytics');
        fireEvent.click(analyticsLink);

        expect(mockSetSidebarOpen).not.toHaveBeenCalled();
    });

    it('should handle window resize events', async () => {
        const mockSetIsMobile = jest.fn();
        mockUseSidebarStore.mockReturnValue({
            ...defaultStoreState,
            setIsMobile: mockSetIsMobile,
        });

        render(<Sidebar />);

        // Simulate mobile resize
        Object.defineProperty(window, 'innerWidth', { value: 800 });
        fireEvent(window, new Event('resize'));

        await waitFor(() => {
            expect(mockSetIsMobile).toHaveBeenCalledWith(true);
        });

        // Simulate desktop resize
        Object.defineProperty(window, 'innerWidth', { value: 1200 });
        fireEvent(window, new Event('resize'));

        await waitFor(() => {
            expect(mockSetIsMobile).toHaveBeenCalledWith(false);
        });
    });

    it('should close sidebar when clicking outside on mobile', () => {
        const mockSetSidebarOpen = jest.fn();
        mockUseSidebarStore.mockReturnValue({
            ...defaultStoreState,
            isMobile: true,
            setSidebarOpen: mockSetSidebarOpen,
        });

        render(<Sidebar />);

        // Simulate click outside sidebar
        fireEvent.mouseDown(document.body);

        expect(mockSetSidebarOpen).toHaveBeenCalledWith(false);
    });

    it('should not close sidebar when clicking inside on mobile', () => {
        const mockSetSidebarOpen = jest.fn();
        mockUseSidebarStore.mockReturnValue({
            ...defaultStoreState,
            isMobile: true,
            setSidebarOpen: mockSetSidebarOpen,
        });

        render(<Sidebar />);

        const sidebar = screen.getByText('trimr').closest('aside');
        fireEvent.mouseDown(sidebar!);

        expect(mockSetSidebarOpen).not.toHaveBeenCalled();
    });

    it('should apply correct CSS classes for mobile', () => {
        mockUseSidebarStore.mockReturnValue({
            ...defaultStoreState,
            isMobile: true,
        });

        const { container } = render(<Sidebar />);

        const sidebar = container.querySelector('#sidebar');
        expect(sidebar).toHaveClass('w-80'); // Mobile width
    });

    it('should apply correct CSS classes for desktop', () => {
        const { container } = render(<Sidebar />);

        const sidebar = container.querySelector('#sidebar');
        expect(sidebar).toHaveClass('min-w-[250px]'); // Desktop width
    });

    it('should show active indicator for current route', () => {
        mockUsePathname.mockReturnValue('/dashboard');
        render(<Sidebar />);

        const dashboardLink = screen.getByText('Dashboard').closest('a');
        const activeIndicator = dashboardLink?.querySelector(
            '.w-2.h-2.bg-primary-content.rounded-full',
        );

        expect(activeIndicator).toBeInTheDocument();
    });

    it('should not show active indicator for inactive routes', () => {
        mockUsePathname.mockReturnValue('/dashboard');
        render(<Sidebar />);

        const analyticsLink = screen.getByText('Analytics').closest('a');
        const activeIndicator = analyticsLink?.querySelector(
            '.w-2.h-2.bg-primary-content.rounded-full',
        );

        expect(activeIndicator).not.toBeInTheDocument();
    });

    it('should show system status', () => {
        render(<Sidebar />);

        expect(screen.getByText('Status')).toBeInTheDocument();
        expect(screen.getByText('All systems online')).toBeInTheDocument();
    });

    it('should have proper navigation link structure', () => {
        render(<Sidebar />);

        const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
        const analyticsLink = screen.getByRole('link', { name: /analytics/i });

        expect(dashboardLink).toHaveAttribute('href', '/dashboard');
        expect(analyticsLink).toHaveAttribute('href', '/stats');
    });

    it('should cleanup event listeners on unmount', () => {
        const removeEventListenerSpy = jest.spyOn(
            window,
            'removeEventListener',
        );
        const { unmount } = render(<Sidebar />);

        unmount();

        expect(removeEventListenerSpy).toHaveBeenCalledWith(
            'resize',
            expect.any(Function),
        );
    });

    it('should apply custom className when provided', () => {
        const { container } = render(<Sidebar className="custom-class" />);

        const sidebar = container.querySelector('#sidebar');
        expect(sidebar).toHaveClass('custom-class');
    });

    describe('route detection', () => {
        it('should detect dashboard route exactly', () => {
            mockUsePathname.mockReturnValue('/dashboard');
            render(<Sidebar />);

            const dashboardLink = screen.getByText('Dashboard').closest('a');
            expect(dashboardLink).toHaveClass('bg-primary');
        });

        it('should not highlight dashboard for sub-routes', () => {
            mockUsePathname.mockReturnValue('/dashboard/settings');
            render(<Sidebar />);

            const dashboardLink = screen.getByText('Dashboard').closest('a');
            expect(dashboardLink).not.toHaveClass('bg-primary');
        });

        it('should highlight analytics for stats sub-routes', () => {
            mockUsePathname.mockReturnValue('/stats/detailed');
            render(<Sidebar />);

            const analyticsLink = screen.getByText('Analytics').closest('a');
            expect(analyticsLink).toHaveClass('bg-primary');
        });
    });
});
