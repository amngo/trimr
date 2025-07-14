import { formatUrl, isValidUrl, normalizeUrl } from '../utils';

// Mock nanoid to avoid ES module issues in Jest
jest.mock('nanoid', () => ({
    nanoid: jest.fn(() => 'test-id-12345'),
}));

describe('lib/utils', () => {
    describe('formatUrl', () => {
        it('should add https:// to URLs without protocol', () => {
            expect(formatUrl('example.com')).toBe('https://example.com');
            expect(formatUrl('www.google.com')).toBe('https://www.google.com');
            expect(formatUrl('subdomain.domain.org')).toBe(
                'https://subdomain.domain.org',
            );
        });

        it('should not modify URLs that already have http://', () => {
            expect(formatUrl('http://example.com')).toBe('http://example.com');
            expect(formatUrl('http://www.google.com/path')).toBe(
                'http://www.google.com/path',
            );
        });

        it('should not modify URLs that already have https://', () => {
            expect(formatUrl('https://example.com')).toBe(
                'https://example.com',
            );
            expect(formatUrl('https://www.google.com/path')).toBe(
                'https://www.google.com/path',
            );
        });

        it('should handle URLs with paths and query parameters', () => {
            expect(formatUrl('example.com/path?query=value')).toBe(
                'https://example.com/path?query=value',
            );
            expect(formatUrl('api.service.com/v1/endpoint')).toBe(
                'https://api.service.com/v1/endpoint',
            );
        });
    });

    describe('isValidUrl', () => {
        it('should validate correct URLs', () => {
            expect(isValidUrl('https://example.com')).toBe(true);
            expect(isValidUrl('http://example.com')).toBe(true);
            expect(
                isValidUrl('https://subdomain.example.com/path?query=value'),
            ).toBe(true);
        });

        it('should reject invalid URLs', () => {
            expect(isValidUrl('not-a-url')).toBe(false);
            expect(isValidUrl('')).toBe(false);
            expect(isValidUrl('javascript:alert("xss")')).toBe(false);
        });
    });

    describe('normalizeUrl', () => {
        it('should remove trailing slash', () => {
            expect(normalizeUrl('https://example.com/')).toBe(
                'https://example.com',
            );
            expect(normalizeUrl('https://example.com/path/')).toBe(
                'https://example.com/path',
            );
        });

        it('should not modify URLs without trailing slash', () => {
            expect(normalizeUrl('https://example.com')).toBe(
                'https://example.com',
            );
            expect(normalizeUrl('https://example.com/path')).toBe(
                'https://example.com/path',
            );
        });

        it('should return original URL if invalid', () => {
            const invalidUrl = 'not-a-url';
            expect(normalizeUrl(invalidUrl)).toBe(invalidUrl);
        });
    });
});
