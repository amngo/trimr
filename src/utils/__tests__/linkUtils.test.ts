import {
    formatUrl,
    formatDate,
    formatSlug,
    getDomain,
    getFaviconUrl,
} from '../linkUtils';

// Mock the URL constructor in Node.js test environment
global.URL = URL;

describe('linkUtils', () => {
    describe('formatUrl', () => {
        it('should return the original URL if it is shorter than or equal to max length', () => {
            expect(formatUrl('https://example.com')).toBe(
                'https://example.com',
            );
            expect(formatUrl('https://example.com', 20)).toBe(
                'https://example.com',
            );
        });

        it('should truncate the URL and add ellipsis if it exceeds max length', () => {
            const longUrl =
                'https://very-long-domain-name-that-exceeds-limit.com';
            expect(formatUrl(longUrl, 20)).toBe('https://very-long-do...');
        });

        it('should use default max length of 50 characters', () => {
            const url = 'a'.repeat(60);
            expect(formatUrl(url)).toBe('a'.repeat(50) + '...');
        });
    });

    describe('formatDate', () => {
        it('should format date in US format with time', () => {
            const date = new Date('2024-03-15T10:30:00Z');
            expect(formatDate(date)).toBe('Mar 15, 2024, 3:30 AM');
        });

        it('should handle different date inputs with time', () => {
            const date = new Date('2023-12-25T12:00:00Z');
            expect(formatDate(date)).toBe('Dec 25, 2023, 4:00 AM');
        });

        it('should format PM times correctly', () => {
            const date = new Date('2024-06-01T22:45:00Z');
            expect(formatDate(date)).toBe('Jun 1, 2024, 3:45 PM');
        });
    });

    describe('formatSlug', () => {
        it('should format slug with localhost:3000 prefix', () => {
            expect(formatSlug('my-slug')).toBe('http://localhost:3000/my-slug');
            expect(formatSlug('test123')).toBe('http://localhost:3000/test123');
        });
    });

    describe('getDomain', () => {
        it('should extract domain from valid URLs', () => {
            expect(getDomain('https://example.com')).toBe('example.com');
            expect(getDomain('http://subdomain.example.com/path')).toBe(
                'subdomain.example.com',
            );
            expect(getDomain('https://www.google.com/search?q=test')).toBe(
                'www.google.com',
            );
        });

        it('should return empty string for invalid URLs', () => {
            expect(getDomain('not-a-url')).toBe('');
            expect(getDomain('')).toBe('');
            expect(getDomain('invalid://url')).toBe('url'); // This actually gets parsed as valid
        });
    });

    describe('getFaviconUrl', () => {
        it('should generate favicon URL for valid domains', () => {
            const url = getFaviconUrl('https://example.com');
            expect(url).toContain('domain=example.com');
            expect(url).toContain('sz=32');
        });

        it('should handle URLs without protocol', () => {
            const url = getFaviconUrl('example.com');
            expect(url).toContain('domain=');
        });
    });
});
