import { render, screen } from '@/test-utils/test-utils';
import { StatsCards } from '../StatsCards';

describe('StatsCards', () => {
    const defaultSummary = {
        totalLinks: 10,
        activeLinks: 8,
        inactiveLinks: 2,
        expiredLinks: 1,
        pendingLinks: 0,
        totalClicks: 150,
        totalVisitors: 100,
        averageClicksPerLink: '15.0',
    };

    it('should render all stats cards with correct data', () => {
        render(<StatsCards summary={defaultSummary} />);

        // Total Links card
        expect(screen.getByText('Total Links')).toBeInTheDocument();
        expect(screen.getByText('10')).toBeInTheDocument();
        expect(screen.getByText('8 active, 2 inactive')).toBeInTheDocument();

        // Total Clicks card
        expect(screen.getByText('Total Clicks')).toBeInTheDocument();
        expect(screen.getByText('150')).toBeInTheDocument();
        expect(screen.getByText('Avg 15.0 per link')).toBeInTheDocument();

        // Unique Visitors card
        expect(screen.getByText('Unique Visitors')).toBeInTheDocument();
        expect(screen.getByText('100')).toBeInTheDocument();
        expect(screen.getByText('1.5 clicks/visitor')).toBeInTheDocument();

        // Status card
        expect(screen.getByText('Status')).toBeInTheDocument();
        expect(screen.getByText('1')).toBeInTheDocument(); // expired + pending
        expect(screen.getByText('1 expired, 0 pending')).toBeInTheDocument();
    });

    it('should format large numbers with commas', () => {
        const summaryWithLargeNumbers = {
            ...defaultSummary,
            totalClicks: 1234567,
            totalVisitors: 987654,
        };

        render(<StatsCards summary={summaryWithLargeNumbers} />);

        expect(screen.getByText('1,234,567')).toBeInTheDocument();
        expect(screen.getByText('987,654')).toBeInTheDocument();
    });

    it('should handle zero values correctly', () => {
        const zeroSummary = {
            totalLinks: 0,
            activeLinks: 0,
            inactiveLinks: 0,
            expiredLinks: 0,
            pendingLinks: 0,
            totalClicks: 0,
            totalVisitors: 0,
            averageClicksPerLink: '0',
        };

        render(<StatsCards summary={zeroSummary} />);

        expect(screen.getByText('0 active, 0 inactive')).toBeInTheDocument();
        expect(screen.getByText('Avg 0 per link')).toBeInTheDocument();
        expect(screen.getByText('No visitors yet')).toBeInTheDocument();
        expect(screen.getByText('0 expired, 0 pending')).toBeInTheDocument();
    });

    it('should calculate clicks per visitor correctly', () => {
        const summary = {
            ...defaultSummary,
            totalClicks: 300,
            totalVisitors: 100,
        };

        render(<StatsCards summary={summary} />);

        expect(screen.getByText('3.0 clicks/visitor')).toBeInTheDocument();
    });

    it('should handle case when visitors is zero', () => {
        const summary = {
            ...defaultSummary,
            totalClicks: 50,
            totalVisitors: 0,
        };

        render(<StatsCards summary={summary} />);

        expect(screen.getByText('No visitors yet')).toBeInTheDocument();
    });

    it('should display correct status counts', () => {
        const summary = {
            ...defaultSummary,
            expiredLinks: 3,
            pendingLinks: 2,
        };

        render(<StatsCards summary={summary} />);

        expect(screen.getByText('5')).toBeInTheDocument(); // 3 + 2
        expect(screen.getByText('3 expired, 2 pending')).toBeInTheDocument();
    });

    it('should render with proper CSS classes for styling', () => {
        render(<StatsCards summary={defaultSummary} />);

        const statsContainer = screen
            .getByText('Total Links')
            .closest('.stats');
        expect(statsContainer).toHaveClass('border');

        // Check for individual stat styling
        const totalLinksIcon = screen
            .getByText('Total Links')
            .closest('.stat')
            ?.querySelector('.stat-figure');
        expect(totalLinksIcon).toHaveClass('text-primary');

        const totalClicksIcon = screen
            .getByText('Total Clicks')
            .closest('.stat')
            ?.querySelector('.stat-figure');
        expect(totalClicksIcon).toHaveClass('text-success');

        const visitorsIcon = screen
            .getByText('Unique Visitors')
            .closest('.stat')
            ?.querySelector('.stat-figure');
        expect(visitorsIcon).toHaveClass('text-info');

        const statusIcon = screen
            .getByText('Status')
            .closest('.stat')
            ?.querySelector('.stat-figure');
        expect(statusIcon).toHaveClass('text-warning');
    });

    it('should have proper accessibility attributes', () => {
        render(<StatsCards summary={defaultSummary} />);

        // Icons should be decorative with aria-hidden
        const icons = document.querySelectorAll('svg[aria-hidden="true"]');
        expect(icons.length).toBeGreaterThan(0);

        // All stats should have appropriate text content for screen readers
        expect(screen.getByText('Total Links')).toBeInTheDocument();
        expect(screen.getByText('Total Clicks')).toBeInTheDocument();
        expect(screen.getByText('Unique Visitors')).toBeInTheDocument();
    });

    it('should handle decimal values in averageClicksPerLink', () => {
        const summary = {
            ...defaultSummary,
            averageClicksPerLink: '12.7',
        };

        render(<StatsCards summary={summary} />);

        expect(screen.getByText('Avg 12.7 per link')).toBeInTheDocument();
    });

    it('should display single vs plural forms correctly', () => {
        const singleValueSummary = {
            totalLinks: 1,
            activeLinks: 1,
            inactiveLinks: 0,
            expiredLinks: 1,
            pendingLinks: 0,
            totalClicks: 1,
            totalVisitors: 1,
            averageClicksPerLink: '1.0',
        };

        render(<StatsCards summary={singleValueSummary} />);

        expect(screen.getByText('1 active, 0 inactive')).toBeInTheDocument();
        expect(screen.getByText('1.0 clicks/visitor')).toBeInTheDocument();
        expect(screen.getByText('1 expired, 0 pending')).toBeInTheDocument();
    });

    it('should maintain consistent layout with different data sizes', () => {
        const { rerender } = render(<StatsCards summary={defaultSummary} />);

        // Test with much larger numbers
        const largeNumbersSummary = {
            totalLinks: 999999,
            activeLinks: 888888,
            inactiveLinks: 111111,
            expiredLinks: 5555,
            pendingLinks: 4444,
            totalClicks: 9876543210,
            totalVisitors: 1234567890,
            averageClicksPerLink: '9876.5',
        };

        rerender(<StatsCards summary={largeNumbersSummary} />);

        // Should still render without layout issues
        expect(screen.getByText('Total Links')).toBeInTheDocument();
        expect(screen.getByText('999999')).toBeInTheDocument(); // Total Links doesn't format with commas
        expect(screen.getByText('9,876,543,210')).toBeInTheDocument(); // Total Clicks does format with commas
        expect(screen.getByText('1,234,567,890')).toBeInTheDocument(); // Unique Visitors does format with commas
    });
});
