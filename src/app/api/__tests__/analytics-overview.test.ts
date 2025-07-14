/**
 * @jest-environment node
 */

import { GET } from '../analytics/overview/route';
import { getCurrentUser } from '@/lib/auth-utils';
import { db } from '@/lib/db';
import {
    createMockLink,
    createMockClick,
    createMockUser,
} from '@/test-utils/test-factories';
import { Link } from '@/types';

interface MockClick {
    id: string;
    linkId: string;
    timestamp: Date;
    ipAddress: string;
    userAgent: string;
    country: string;
    link?: { name: string; slug: string };
}

interface DailyActivity {
    date: string;
    clicks: number;
}

// Mock dependencies
jest.mock('@/lib/auth-utils');
jest.mock('@/lib/auth', () => ({
    auth: {
        api: {
            getSession: jest.fn(),
        },
    },
}));

jest.mock('@/lib/db', () => ({
    db: {
        link: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
        click: {
            findMany: jest.fn(),
            create: jest.fn(),
        },
    },
}));

const mockGetCurrentUser = getCurrentUser as jest.MockedFunction<
    typeof getCurrentUser
>;
const mockDb = db as jest.Mocked<typeof db>;

describe('/api/analytics/overview', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET', () => {
        it('should return 401 when user is not authenticated', async () => {
            mockGetCurrentUser.mockResolvedValue(null);

            const response = await GET();
            const data = await response.json();

            expect(response.status).toBe(401);
            expect(data.error).toBe('Unauthorized');
        });

        it('should return analytics overview for authenticated user', async () => {
            const mockUser = createMockUser();
            const mockLinks = [
                createMockLink({
                    id: 'link-1',
                    userId: mockUser.id,
                    enabled: true,
                    clickCount: 10,
                    visitorCount: 8,
                }),
                createMockLink({
                    id: 'link-2',
                    userId: mockUser.id,
                    enabled: false,
                    clickCount: 5,
                    visitorCount: 4,
                }),
                createMockLink({
                    id: 'link-3',
                    userId: mockUser.id,
                    enabled: true,
                    clickCount: 0,
                    visitorCount: 0,
                    expiresAt: new Date('2023-01-01'), // Expired
                }),
            ];

            const mockClicks = [
                createMockClick({
                    linkId: 'link-1',
                    country: 'United States',
                    timestamp: new Date('2024-01-15'),
                }),
                createMockClick({
                    linkId: 'link-1',
                    country: 'Canada',
                    timestamp: new Date('2024-01-14'),
                }),
                createMockClick({
                    linkId: 'link-2',
                    country: 'United States',
                    timestamp: new Date('2024-01-13'),
                }),
            ];

            mockGetCurrentUser.mockResolvedValue(mockUser);
            (mockDb.link.findMany as jest.Mock).mockResolvedValue(
                mockLinks as Link[],
            );
            (mockDb.click.findMany as jest.Mock).mockResolvedValue(
                mockClicks.map((click) => ({
                    ...click,
                    link: { name: 'Test Link', slug: 'test-slug' },
                })) as MockClick[],
            );

            const response = await GET();
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.summary).toEqual({
                totalLinks: 3,
                activeLinks: 2,
                inactiveLinks: 1,
                expiredLinks: 1,
                pendingLinks: 0,
                totalClicks: 15,
                totalVisitors: 12,
                averageClicksPerLink: '5.0',
            });
        });

        it('should calculate top performing links correctly', async () => {
            const mockUser = createMockUser();
            const mockLinks = [
                createMockLink({
                    id: 'link-1',
                    name: 'Best Link',
                    slug: 'best-link',
                    clickCount: 100,
                    visitorCount: 80,
                }),
                createMockLink({
                    id: 'link-2',
                    name: 'Good Link',
                    slug: 'good-link',
                    clickCount: 50,
                    visitorCount: 40,
                }),
                createMockLink({
                    id: 'link-3',
                    name: 'No Traffic',
                    slug: 'no-traffic',
                    clickCount: 0,
                    visitorCount: 0,
                }),
            ];

            mockGetCurrentUser.mockResolvedValue(mockUser);
            (mockDb.link.findMany as jest.Mock).mockResolvedValue(
                mockLinks as Link[],
            );
            (mockDb.click.findMany as jest.Mock).mockResolvedValue([]);

            const response = await GET();
            const data = await response.json();

            expect(data.topLinks).toHaveLength(2); // Only links with clicks
            expect(data.topLinks[0]).toMatchObject({
                name: 'Best Link',
                slug: 'best-link',
                clicks: 100,
                visitors: 80,
            });
            expect(data.topLinks[1]).toMatchObject({
                name: 'Good Link',
                slug: 'good-link',
                clicks: 50,
                visitors: 40,
            });
        });

        it('should calculate country distribution correctly', async () => {
            const mockUser = createMockUser();
            const mockClicks = [
                createMockClick({ country: 'United States' }),
                createMockClick({ country: 'United States' }),
                createMockClick({ country: 'Canada' }),
                createMockClick({ country: 'United Kingdom' }),
                createMockClick({ country: null }), // Should be filtered out
            ];

            mockGetCurrentUser.mockResolvedValue(mockUser);
            (mockDb.link.findMany as jest.Mock).mockResolvedValue([]);
            (mockDb.click.findMany as jest.Mock).mockResolvedValue(
                mockClicks.map((click) => ({
                    ...click,
                    link: { name: 'Test', slug: 'test' },
                })) as MockClick[],
            );

            const response = await GET();
            const data = await response.json();

            expect(data.topCountries).toEqual([
                { country: 'United States', clicks: 2, percentage: '40.0' },
                { country: 'Canada', clicks: 1, percentage: '20.0' },
                { country: 'United Kingdom', clicks: 1, percentage: '20.0' },
            ]);
        });

        it('should generate daily activity for last 30 days', async () => {
            const mockUser = createMockUser();
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            const twoDaysAgo = new Date(today);
            twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

            const mockClicks = [
                createMockClick({ timestamp: today }),
                createMockClick({ timestamp: today }),
                createMockClick({ timestamp: yesterday }),
                createMockClick({ timestamp: twoDaysAgo }),
            ];

            mockGetCurrentUser.mockResolvedValue(mockUser);
            (mockDb.link.findMany as jest.Mock).mockResolvedValue([]);
            (mockDb.click.findMany as jest.Mock).mockResolvedValue(
                mockClicks.map((click) => ({
                    ...click,
                    link: { name: 'Test', slug: 'test' },
                })) as MockClick[],
            );

            const response = await GET();
            const data = await response.json();

            expect(data.dailyActivity).toHaveLength(30);

            // Today should have 2 clicks
            const todayData = data.dailyActivity.find(
                (day: DailyActivity) =>
                    day.date === today.toISOString().split('T')[0],
            );
            expect(todayData?.clicks).toBe(2);

            // Yesterday should have 1 click
            const yesterdayData = data.dailyActivity.find(
                (day: DailyActivity) =>
                    day.date === yesterday.toISOString().split('T')[0],
            );
            expect(yesterdayData?.clicks).toBe(1);
        });

        it('should return recent activity with correct format', async () => {
            const mockUser = createMockUser();
            const mockClicks = Array.from({ length: 10 }, (_, i) =>
                createMockClick({
                    id: `click-${i}`,
                    timestamp: new Date(Date.now() - i * 60000), // Each click 1 minute apart
                    country: 'United States',
                }),
            );

            mockGetCurrentUser.mockResolvedValue(mockUser);
            (mockDb.link.findMany as jest.Mock).mockResolvedValue([]);
            (mockDb.click.findMany as jest.Mock).mockResolvedValue(
                mockClicks.map((click) => ({
                    ...click,
                    link: { name: 'Test Link', slug: 'test-link' },
                })) as MockClick[],
            );

            const response = await GET();
            const data = await response.json();

            expect(data.recentActivity).toHaveLength(10);
            expect(data.recentActivity[0]).toMatchObject({
                id: 'click-0',
                country: 'United States',
                linkName: 'Test Link',
                linkSlug: 'test-link',
            });
        });

        it('should handle expired and pending links correctly', async () => {
            const mockUser = createMockUser();
            const now = new Date();
            const pastDate = new Date(now.getTime() - 24 * 60 * 60 * 1000); // Yesterday
            const futureDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Tomorrow

            const mockLinks = [
                createMockLink({
                    enabled: true,
                    expiresAt: pastDate, // Expired
                }),
                createMockLink({
                    enabled: true,
                    startsAt: futureDate, // Pending
                }),
                createMockLink({
                    enabled: true, // Active
                }),
            ];

            mockGetCurrentUser.mockResolvedValue(mockUser);
            (mockDb.link.findMany as jest.Mock).mockResolvedValue(
                mockLinks as Link[],
            );
            (mockDb.click.findMany as jest.Mock).mockResolvedValue([]);

            const response = await GET();
            const data = await response.json();

            expect(data.summary.expiredLinks).toBe(1);
            expect(data.summary.pendingLinks).toBe(1);
            expect(data.summary.activeLinks).toBe(3); // All enabled links count as active for this metric
        });

        it('should handle empty data gracefully', async () => {
            const mockUser = createMockUser();

            mockGetCurrentUser.mockResolvedValue(mockUser);
            (mockDb.link.findMany as jest.Mock).mockResolvedValue([]);
            (mockDb.click.findMany as jest.Mock).mockResolvedValue([]);

            const response = await GET();
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.summary).toEqual({
                totalLinks: 0,
                activeLinks: 0,
                inactiveLinks: 0,
                expiredLinks: 0,
                pendingLinks: 0,
                totalClicks: 0,
                totalVisitors: 0,
                averageClicksPerLink: '0',
            });
            expect(data.topLinks).toEqual([]);
            expect(data.topCountries).toEqual([]);
            expect(data.dailyActivity).toHaveLength(30);
            expect(data.recentActivity).toEqual([]);
        });

        it('should handle database errors', async () => {
            const mockUser = createMockUser();
            mockGetCurrentUser.mockResolvedValue(mockUser);
            (mockDb.link.findMany as jest.Mock).mockRejectedValue(
                new Error('Database error'),
            );

            const response = await GET();
            const data = await response.json();

            expect(response.status).toBe(500);
            expect(data.error).toBe('Failed to fetch analytics overview');
        });

        it('should filter links by user ID correctly', async () => {
            const mockUser = createMockUser({ id: 'user-1' });
            mockGetCurrentUser.mockResolvedValue(mockUser);

            const mockLinks = [
                createMockLink({ userId: 'user-1' }),
                createMockLink({ userId: 'user-2' }), // Should be filtered out
            ];

            (mockDb.link.findMany as jest.Mock).mockResolvedValue(
                mockLinks.slice(0, 1) as Link[],
            ); // DB should only return user's links
            (mockDb.click.findMany as jest.Mock).mockResolvedValue([]);

            await GET();

            expect(mockDb.link.findMany).toHaveBeenCalledWith({
                where: { userId: 'user-1' },
                select: expect.any(Object),
                orderBy: { clickCount: 'desc' },
            });

            expect(mockDb.click.findMany).toHaveBeenCalledWith({
                where: {
                    link: {
                        userId: 'user-1',
                    },
                },
                select: expect.any(Object),
                orderBy: { timestamp: 'desc' },
                take: 1000,
            });
        });
    });
});
