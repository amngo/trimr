import { Link } from '@/types';

// Test data factories for consistent mock data
export const createMockLink = (overrides: Partial<Link> = {}): Link => ({
    id: 'test-link-id',
    slug: 'test-slug',
    url: 'https://example.com',
    name: 'Test Link',
    userId: 'test-user-id',
    clickCount: 0,
    visitorCount: 0,
    enabled: true,
    expiresAt: null,
    startsAt: null,
    password: null,
    createdAt: new Date('2024-01-01'),
    ...overrides,
});

export const createMockLinks = (
    count: number,
    baseOverrides: Partial<Link> = {},
): Link[] => {
    return Array.from({ length: count }, (_, i) =>
        createMockLink({
            id: `test-link-${i}`,
            slug: `test-slug-${i}`,
            name: `Test Link ${i}`,
            clickCount: i * 10,
            visitorCount: i * 5,
            ...baseOverrides,
        }),
    );
};

export const createMockUser = (overrides = {}) => ({
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
    emailVerified: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    ...overrides,
});

export const createMockClick = (overrides = {}) => ({
    id: 'test-click-id',
    linkId: 'test-link-id',
    timestamp: new Date(),
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0 (test browser)',
    country: 'United States',
    ...overrides,
});

export const createMockAnalyticsOverview = (overrides = {}) => ({
    summary: {
        totalLinks: 10,
        activeLinks: 8,
        inactiveLinks: 2,
        expiredLinks: 0,
        pendingLinks: 0,
        totalClicks: 150,
        totalVisitors: 100,
        averageClicksPerLink: '15.0',
        ...(overrides as { summary?: Record<string, unknown> }).summary,
    },
    topLinks: createMockLinks(5),
    topCountries: [
        { country: 'United States', clicks: 50, percentage: '50.0' },
        { country: 'Canada', clicks: 30, percentage: '30.0' },
        { country: 'United Kingdom', clicks: 20, percentage: '20.0' },
    ],
    dailyActivity: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
        clicks: Math.floor(Math.random() * 20),
    })),
    recentActivity: Array.from({ length: 10 }, (_, i) => ({
        id: `activity-${i}`,
        timestamp: new Date(Date.now() - i * 60 * 60 * 1000),
        country: 'United States',
        linkName: `Test Link ${i}`,
        linkSlug: `test-slug-${i}`,
    })),
    ...overrides,
});

export const createMockCSVData = (count: number = 3) => {
    const header = 'name,url,slug,password,expiresAt\n';
    const rows = Array.from(
        { length: count },
        (_, i) => `Test Link ${i},https://example${i}.com,test-slug-${i},,`,
    ).join('\n');
    return header + rows;
};

export const createMockFile = (
    content: string,
    filename: string = 'test.csv',
    type: string = 'text/csv',
) => {
    const blob = new Blob([content], { type });
    const file = new File([blob], filename, { type });
    return file;
};
