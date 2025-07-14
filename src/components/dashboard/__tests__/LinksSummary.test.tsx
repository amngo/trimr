import { render, screen } from '@/test-utils/test-utils';
import LinksSummary from '../LinksSummary';

describe('LinksSummary', () => {
    const defaultProps = {
        total: 10,
        active: 7,
        inactive: 2,
        expired: 1,
        disabled: 0,
        isLoading: false,
    };

    it('should render all stats with correct values', () => {
        render(<LinksSummary {...defaultProps} />);

        expect(screen.getByText('Total Links')).toBeInTheDocument();
        expect(screen.getByText('10')).toBeInTheDocument();

        expect(screen.getByText('Active')).toBeInTheDocument();
        expect(screen.getByText('7')).toBeInTheDocument();

        expect(screen.getByText('Inactive')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();

        expect(screen.getByText('Expired')).toBeInTheDocument();
        expect(screen.getByText('1')).toBeInTheDocument();

        expect(screen.getByText('Disabled')).toBeInTheDocument();
        expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('should show loading state when isLoading is true', () => {
        render(<LinksSummary {...defaultProps} isLoading={true} />);

        // Should show loading dots instead of actual values
        const loadingElements = screen.getAllByText('...');
        expect(loadingElements.length).toBeGreaterThan(0);
    });

    it('should apply correct color classes for each stat type', () => {
        render(<LinksSummary {...defaultProps} />);

        // Check for color classes
        const activeValue = screen.getByText('7');
        expect(activeValue).toHaveClass('text-green-500');

        const inactiveValue = screen.getByText('2');
        expect(inactiveValue).toHaveClass('text-blue-500');

        const expiredValue = screen.getByText('1');
        expect(expiredValue).toHaveClass('text-gray-500');

        const disabledValue = screen.getByText('0');
        expect(disabledValue).toHaveClass('text-red-500');
    });

    it('should handle zero values correctly', () => {
        const zeroProps = {
            total: 0,
            active: 0,
            inactive: 0,
            expired: 0,
            disabled: 0,
            isLoading: false,
        };

        render(<LinksSummary {...zeroProps} />);

        expect(screen.getByText('Total Links')).toBeInTheDocument();
        expect(screen.getAllByText('0')).toHaveLength(5);
    });

    it('should handle large numbers correctly', () => {
        const largeProps = {
            total: 999999,
            active: 888888,
            inactive: 77777,
            expired: 6666,
            disabled: 555,
            isLoading: false,
        };

        render(<LinksSummary {...largeProps} />);

        expect(screen.getByText('999999')).toBeInTheDocument();
        expect(screen.getByText('888888')).toBeInTheDocument();
        expect(screen.getByText('77777')).toBeInTheDocument();
        expect(screen.getByText('6666')).toBeInTheDocument();
        expect(screen.getByText('555')).toBeInTheDocument();
    });

    it('should have proper responsive layout classes', () => {
        const { container } = render(<LinksSummary {...defaultProps} />);

        const statsContainer = container.querySelector('.stats');
        expect(statsContainer).toHaveClass('stats-vertical');
    });

    it('should maintain consistent layout during loading state', () => {
        const { container: normalContainer } = render(
            <LinksSummary {...defaultProps} />,
        );
        const { container: loadingContainer } = render(
            <LinksSummary {...defaultProps} isLoading={true} />,
        );

        // Structure should be the same
        const normalStats = normalContainer.querySelectorAll('.stat');
        const loadingStats = loadingContainer.querySelectorAll('.stat');

        expect(normalStats.length).toBe(loadingStats.length);
    });

    it('should render with proper semantic structure', () => {
        render(<LinksSummary {...defaultProps} />);

        // Should have proper stat structure
        const stats = screen.getAllByText(
            /Total Links|Active|Inactive|Expired|Disabled/,
        );
        expect(stats).toHaveLength(5);
    });
});
