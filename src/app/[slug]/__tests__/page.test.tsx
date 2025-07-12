import { render, screen } from '@testing-library/react';
import { redirect } from 'next/navigation';
import RedirectPage from '../page';
import { db } from '@/lib/db';

// Mock dependencies
jest.mock('next/navigation', () => ({
    redirect: jest.fn(),
}));

jest.mock('next/headers', () => ({
    headers: jest.fn(() => Promise.resolve(new Map([
        ['user-agent', 'Mozilla/5.0 Test Browser'],
        ['x-forwarded-for', '192.168.1.1'],
    ]))),
}));

jest.mock('@/lib/db', () => ({
    db: {
        link: {
            findUnique: jest.fn(),
            update: jest.fn(),
        },
        click: {
            findFirst: jest.fn(),
            create: jest.fn(),
        },
        $transaction: jest.fn(),
    },
}));

jest.mock('@/lib/utils', () => ({
    getCountryFromIp: jest.fn(() => Promise.resolve('US')),
}));

describe('RedirectPage', () => {
    const mockParams = Promise.resolve({ slug: 'test-slug' });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should show "Link Not Found" when link does not exist', async () => {
        (db.link.findUnique as jest.Mock).mockResolvedValue(null);

        const result = await RedirectPage({ params: mockParams });
        render(result as React.ReactElement);

        expect(screen.getByText('Link Not Found')).toBeInTheDocument();
        expect(screen.getByText('/test-slug')).toBeInTheDocument();
        expect(screen.getByText(/does not exist/)).toBeInTheDocument();
    });

    it('should show "Link Disabled" when link is disabled', async () => {
        const mockLink = {
            id: '1',
            slug: 'test-slug',
            url: 'https://example.com',
            enabled: false,
            expiresAt: null,
            startsAt: null,
        };

        (db.link.findUnique as jest.Mock).mockResolvedValue(mockLink);

        const result = await RedirectPage({ params: mockParams });
        render(result as React.ReactElement);

        expect(screen.getByText('Link Disabled')).toBeInTheDocument();
        expect(screen.getByText('http://localhost:3000/test-slug')).toBeInTheDocument();
        expect(screen.getByText(/has been disabled/)).toBeInTheDocument();
    });

    it('should show "Link Expired" when link has expired', async () => {
        const pastDate = new Date('2023-01-01T12:00:00Z');
        const mockLink = {
            id: '1',
            slug: 'test-slug',
            url: 'https://example.com',
            enabled: true,
            expiresAt: pastDate,
            startsAt: null,
        };

        (db.link.findUnique as jest.Mock).mockResolvedValue(mockLink);

        const result = await RedirectPage({ params: mockParams });
        render(result as React.ReactElement);

        expect(screen.getByText('Link Expired')).toBeInTheDocument();
        expect(screen.getByText('http://localhost:3000/test-slug')).toBeInTheDocument();
        expect(screen.getByText(/has expired/)).toBeInTheDocument();
        expect(screen.getByText(/January 1, 2023/)).toBeInTheDocument();
    });

    it('should show "Link Not Available Yet" when start date is in the future', async () => {
        const futureDate = new Date('2025-12-31T10:30:00Z');
        const mockLink = {
            id: '1',
            slug: 'test-slug',
            url: 'https://example.com',
            enabled: true,
            expiresAt: null,
            startsAt: futureDate,
        };

        (db.link.findUnique as jest.Mock).mockResolvedValue(mockLink);

        const result = await RedirectPage({ params: mockParams });
        render(result as React.ReactElement);

        expect(screen.getByText('Link Not Available Yet')).toBeInTheDocument();
        expect(screen.getByText('http://localhost:3000/test-slug')).toBeInTheDocument();
        expect(screen.getByText(/is not available yet/)).toBeInTheDocument();
        expect(screen.getByText(/December 31, 2025/)).toBeInTheDocument();
    });

    it('should redirect to URL when link is valid and available', async () => {
        const mockLink = {
            id: '1',
            slug: 'test-slug',
            url: 'https://example.com',
            enabled: true,
            expiresAt: null,
            startsAt: null,
        };

        (db.link.findUnique as jest.Mock).mockResolvedValue(mockLink);
        (db.click.findFirst as jest.Mock).mockResolvedValue(null); // New visitor
        (db.$transaction as jest.Mock).mockResolvedValue([]);

        await RedirectPage({ params: mockParams });

        expect(redirect).toHaveBeenCalledWith('https://example.com');
    });

    it('should redirect when link has past start date', async () => {
        const pastDate = new Date('2023-01-01');
        const mockLink = {
            id: '1',
            slug: 'test-slug',
            url: 'https://example.com',
            enabled: true,
            expiresAt: null,
            startsAt: pastDate,
        };

        (db.link.findUnique as jest.Mock).mockResolvedValue(mockLink);
        (db.click.findFirst as jest.Mock).mockResolvedValue(null);
        (db.$transaction as jest.Mock).mockResolvedValue([]);

        await RedirectPage({ params: mockParams });

        expect(redirect).toHaveBeenCalledWith('https://example.com');
    });

    it('should redirect when link has future expiry date', async () => {
        const futureDate = new Date('2025-12-31');
        const mockLink = {
            id: '1',
            slug: 'test-slug',
            url: 'https://example.com',
            enabled: true,
            expiresAt: futureDate,
            startsAt: null,
        };

        (db.link.findUnique as jest.Mock).mockResolvedValue(mockLink);
        (db.click.findFirst as jest.Mock).mockResolvedValue(null);
        (db.$transaction as jest.Mock).mockResolvedValue([]);

        await RedirectPage({ params: mockParams });

        expect(redirect).toHaveBeenCalledWith('https://example.com');
    });

    it('should track analytics for valid redirects', async () => {
        const mockLink = {
            id: '1',
            slug: 'test-slug',
            url: 'https://example.com',
            enabled: true,
            expiresAt: null,
            startsAt: null,
        };

        (db.link.findUnique as jest.Mock).mockResolvedValue(mockLink);
        (db.click.findFirst as jest.Mock).mockResolvedValue(null); // New visitor
        (db.$transaction as jest.Mock).mockResolvedValue([{}, {}]);

        await RedirectPage({ params: mockParams });

        expect(db.click.findFirst).toHaveBeenCalledWith({
            where: {
                linkId: '1',
                ipAddress: '192.168.1.1',
            },
        });
        expect(db.$transaction).toHaveBeenCalled();
        expect(redirect).toHaveBeenCalledWith('https://example.com');
    });

    it('should redirect to password page when link is password protected', async () => {
        const mockLink = {
            id: '1',
            slug: 'test-slug',
            url: 'https://example.com',
            enabled: true,
            expiresAt: null,
            startsAt: null,
            password: 'secret123',
        };

        (db.link.findUnique as jest.Mock).mockResolvedValue(mockLink);

        await RedirectPage({ params: mockParams });

        expect(redirect).toHaveBeenCalledWith('/test-slug/password');
    });

    it('should redirect to URL when password is verified', async () => {
        const mockLink = {
            id: '1',
            slug: 'test-slug',
            url: 'https://example.com',
            enabled: true,
            expiresAt: null,
            startsAt: null,
            password: 'secret123',
        };

        // Mock headers to simulate password verification
        const mockHeaders = jest.fn(() => Promise.resolve(new Map([
            ['user-agent', 'Mozilla/5.0 Test Browser'],
            ['x-forwarded-for', '192.168.1.1'],
            ['x-password-verified', 'true'],
        ])));

        jest.doMock('next/headers', () => ({
            headers: mockHeaders,
        }));

        (db.link.findUnique as jest.Mock).mockResolvedValue(mockLink);
        (db.click.findFirst as jest.Mock).mockResolvedValue(null);
        (db.$transaction as jest.Mock).mockResolvedValue([]);

        await RedirectPage({ params: mockParams });

        expect(redirect).toHaveBeenCalledWith('https://example.com');
    });

    it('should redirect to URL when link has no password', async () => {
        const mockLink = {
            id: '1',
            slug: 'test-slug',
            url: 'https://example.com',
            enabled: true,
            expiresAt: null,
            startsAt: null,
            password: null,
        };

        (db.link.findUnique as jest.Mock).mockResolvedValue(mockLink);
        (db.click.findFirst as jest.Mock).mockResolvedValue(null);
        (db.$transaction as jest.Mock).mockResolvedValue([]);

        await RedirectPage({ params: mockParams });

        expect(redirect).toHaveBeenCalledWith('https://example.com');
    });

    it('should handle analytics errors gracefully', async () => {
        const mockLink = {
            id: '1',
            slug: 'test-slug',
            url: 'https://example.com',
            enabled: true,
            expiresAt: null,
            startsAt: null,
            password: null,
        };

        (db.link.findUnique as jest.Mock).mockResolvedValue(mockLink);
        (db.click.findFirst as jest.Mock).mockRejectedValue(new Error('DB Error'));

        await RedirectPage({ params: mockParams });

        // Should still redirect even if analytics fail
        expect(redirect).toHaveBeenCalledWith('https://example.com');
    });
});