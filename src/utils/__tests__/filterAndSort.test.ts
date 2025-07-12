import { filterAndSortLinks, getFilteredLinksCount } from '../filterAndSort';
import { Link } from '@/types';

const mockLinks: Link[] = [
    {
        id: '1',
        slug: 'example',
        url: 'https://example.com',
        clickCount: 10,
        visitorCount: 7,
        enabled: true,
        createdAt: new Date('2024-01-01'),
        expiresAt: new Date('2025-12-01'), // future expiry
        startsAt: null,
        userId: 'user1'
    },
    {
        id: '2',
        slug: 'google',
        url: 'https://google.com',
        clickCount: 5,
        visitorCount: 3,
        enabled: false,
        createdAt: new Date('2024-02-01'),
        expiresAt: null,
        startsAt: null,
        userId: 'user1'
    },
    {
        id: '3',
        slug: 'expired',
        url: 'https://expired.com',
        clickCount: 20,
        visitorCount: 15,
        enabled: true,
        createdAt: new Date('2024-03-01'),
        expiresAt: new Date('2023-01-01'), // expired
        startsAt: null,
        userId: 'user1'
    },
    {
        id: '4',
        slug: 'future',
        url: 'https://future.com',
        clickCount: 0,
        visitorCount: 0,
        enabled: true,
        createdAt: new Date('2024-04-01'),
        expiresAt: null,
        startsAt: new Date('2025-12-01'), // future start
        userId: 'user1'
    }
];

describe('filterAndSort', () => {
    describe('filterAndSortLinks', () => {
        it('should return all links when no filters applied', () => {
            const result = filterAndSortLinks(mockLinks, '', 'createdAt', 'desc', 'all', 'all');
            expect(result).toHaveLength(4);
        });

        it('should filter by search term in URL', () => {
            const result = filterAndSortLinks(mockLinks, 'google', 'createdAt', 'desc', 'all', 'all');
            expect(result).toHaveLength(1);
            expect(result[0].url).toBe('https://google.com');
        });

        it('should filter by search term in slug', () => {
            const result = filterAndSortLinks(mockLinks, 'example', 'createdAt', 'desc', 'all', 'all');
            expect(result).toHaveLength(1);
            expect(result[0].slug).toBe('example');
        });

        it('should filter by active status', () => {
            const result = filterAndSortLinks(mockLinks, '', 'createdAt', 'desc', 'active', 'all');
            expect(result).toHaveLength(1); // only 'example' is active (future hasn't started yet)
            expect(result[0].slug).toBe('example');
        });

        it('should filter by expired status', () => {
            const result = filterAndSortLinks(mockLinks, '', 'createdAt', 'desc', 'expired', 'all');
            expect(result).toHaveLength(1); // only 'expired' link is expired
            expect(result[0].slug).toBe('expired');
        });

        it('should filter by disabled status', () => {
            const result = filterAndSortLinks(mockLinks, '', 'createdAt', 'desc', 'disabled', 'all');
            expect(result).toHaveLength(1);
            expect(result[0].slug).toBe('google');
        });

        it('should sort by creation date descending', () => {
            const result = filterAndSortLinks(mockLinks, '', 'createdAt', 'desc', 'all', 'all');
            expect(result[0].createdAt.getTime()).toBeGreaterThan(result[1].createdAt.getTime());
        });

        it('should sort by creation date ascending', () => {
            const result = filterAndSortLinks(mockLinks, '', 'createdAt', 'asc', 'all', 'all');
            expect(result[0].createdAt.getTime()).toBeLessThan(result[1].createdAt.getTime());
        });

        it('should sort by click count', () => {
            const result = filterAndSortLinks(mockLinks, '', 'clickCount', 'desc', 'all', 'all');
            expect(result[0].clickCount).toBe(20);
            expect(result[1].clickCount).toBe(10);
        });

        it('should sort by visitor count', () => {
            const result = filterAndSortLinks(mockLinks, '', 'visitorCount', 'desc', 'all', 'all');
            expect(result[0].visitorCount).toBe(15);
            expect(result[1].visitorCount).toBe(7);
        });

        it('should sort by slug alphabetically', () => {
            const result = filterAndSortLinks(mockLinks, '', 'slug', 'asc', 'all', 'all');
            expect(result[0].slug).toBe('example');
            expect(result[1].slug).toBe('expired');
        });

        it('should sort by URL alphabetically', () => {
            const result = filterAndSortLinks(mockLinks, '', 'url', 'asc', 'all', 'all');
            expect(result[0].url).toBe('https://example.com');
        });

        it('should combine search and status filters', () => {
            const result = filterAndSortLinks(mockLinks, 'google', 'createdAt', 'desc', 'disabled', 'all');
            expect(result).toHaveLength(1);
            expect(result[0].slug).toBe('google');
        });

        it('should filter by time range', () => {
            const recentLinks = [
                { ...mockLinks[0], createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) }, // 5 days ago
                { ...mockLinks[1], createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) }, // 10 days ago
                { ...mockLinks[2], createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000) }, // 40 days ago
            ];

            const result7d = filterAndSortLinks(recentLinks, '', 'createdAt', 'desc', 'all', '7d');
            expect(result7d).toHaveLength(1);

            const result30d = filterAndSortLinks(recentLinks, '', 'createdAt', 'desc', 'all', '30d');
            expect(result30d).toHaveLength(2);
        });
    });

    describe('getFilteredLinksCount', () => {
        it('should count all link statuses correctly', () => {
            const counts = getFilteredLinksCount(mockLinks, '', 'all', 'all');
            
            expect(counts.total).toBe(4);
            expect(counts.active).toBe(1); // only 'example' is truly active
            expect(counts.expired).toBe(1); // 'expired' link
            expect(counts.disabled).toBe(1); // 'google' link
        });

        it('should count with search filter applied', () => {
            const counts = getFilteredLinksCount(mockLinks, 'google', 'all', 'all');
            
            expect(counts.total).toBe(1);
            expect(counts.active).toBe(0);
            expect(counts.disabled).toBe(1);
        });

        it('should count with time range filter', () => {
            const recentLinks = [
                { ...mockLinks[0], createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
                { ...mockLinks[1], createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000) },
            ];

            const counts = getFilteredLinksCount(recentLinks, '', 'all', '7d');
            expect(counts.total).toBe(1);
        });
    });
});