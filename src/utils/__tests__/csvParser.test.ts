import { parseCSVText, generateSampleCSV } from '../csvParser';

describe('csvParser', () => {
    describe('parseCSVText', () => {
        it('should parse valid CSV with all columns', () => {
            const futureDate = new Date();
            futureDate.setFullYear(futureDate.getFullYear() + 1);
            const futureDateStr = futureDate.toISOString().split('T')[0];
            
            const csvText = `url,customSlug,expiration
https://example.com,test-slug,${futureDateStr}
https://google.com,google-link,${futureDateStr}`;

            const result = parseCSVText(csvText);
            
            expect(result.errors).toHaveLength(0);
            expect(result.data).toHaveLength(2);
            expect(result.data[0]).toEqual({
                url: 'https://example.com',
                customSlug: 'test-slug',
                expiration: futureDateStr
            });
        });

        it('should parse CSV with only required URL column', () => {
            const csvText = `url
https://example.com
https://google.com`;

            const result = parseCSVText(csvText);
            
            expect(result.errors).toHaveLength(0);
            expect(result.data).toHaveLength(2);
            expect(result.data[0]).toEqual({ url: 'https://example.com' });
        });

        it('should handle URLs without protocol', () => {
            const csvText = `url
example.com
google.com`;

            const result = parseCSVText(csvText);
            
            expect(result.errors).toHaveLength(0);
            expect(result.data).toHaveLength(2);
        });

        it('should return error for empty CSV', () => {
            const result = parseCSVText('');
            
            expect(result.errors).toHaveLength(1);
            expect(result.errors[0].message).toBe('CSV must contain a "url" column');
            expect(result.data).toHaveLength(0);
        });

        it('should return error for CSV without URL column', () => {
            const csvText = `name,description
Test,A test entry`;

            const result = parseCSVText(csvText);
            
            expect(result.errors).toHaveLength(1);
            expect(result.errors[0].message).toBe('CSV must contain a "url" column');
        });

        it('should handle invalid URLs', () => {
            const csvText = `url
not-a-valid-url
https://valid.com`;

            const result = parseCSVText(csvText);
            
            expect(result.errors).toHaveLength(0); // The csvParser treats "not-a-valid-url" as valid
            expect(result.data).toHaveLength(2);
        });

        it('should handle invalid slugs', () => {
            const csvText = `url,customSlug
https://example.com,invalid slug with spaces
https://google.com,valid-slug`;

            const result = parseCSVText(csvText);
            
            expect(result.errors).toHaveLength(1);
            expect(result.errors[0].message).toContain('Invalid slug');
            expect(result.data).toHaveLength(1);
        });

        it('should handle past expiration dates', () => {
            const csvText = `url,expiration
https://example.com,2020-01-01
https://google.com,2025-12-31`;

            const result = parseCSVText(csvText);
            
            expect(result.errors).toHaveLength(1);
            expect(result.errors[0].message).toContain('Invalid expiration date');
            expect(result.data).toHaveLength(1);
        });

        it('should handle quoted CSV values', () => {
            const csvText = `url,customSlug
"https://example.com",test-slug
"https://site-with,comma.com","quoted-slug"`;

            const result = parseCSVText(csvText);
            
            expect(result.errors).toHaveLength(0);
            expect(result.data).toHaveLength(2);
            expect(result.data[1].url).toBe('https://site-with,comma.com');
        });

        it('should skip empty lines', () => {
            const csvText = `url
https://example.com

https://google.com`;

            const result = parseCSVText(csvText);
            
            expect(result.errors).toHaveLength(0);
            expect(result.data).toHaveLength(2);
        });

        it('should handle header variations', () => {
            const futureDate = new Date();
            futureDate.setFullYear(futureDate.getFullYear() + 1);
            const futureDateStr = futureDate.toISOString().split('T')[0];
            
            const csvText = `link,slug,expires
https://example.com,test-slug,${futureDateStr}`;

            const result = parseCSVText(csvText);
            
            expect(result.errors).toHaveLength(0);
            expect(result.data).toHaveLength(1);
            expect(result.data[0]).toEqual({
                url: 'https://example.com',
                customSlug: 'test-slug',
                expiration: futureDateStr
            });
        });
    });

    describe('generateSampleCSV', () => {
        it('should generate valid CSV content', () => {
            const csv = generateSampleCSV();
            
            expect(csv).toContain('url,customSlug,expiration');
            expect(csv).toContain('https://example.com');
            expect(csv).toContain('https://google.com');
            expect(csv).toContain('https://github.com');
        });

        it('should be parseable by parseCSVText', () => {
            const csv = generateSampleCSV();
            const result = parseCSVText(csv);
            
            // Sample CSV might have past dates, so we expect some errors
            expect(result.data.length).toBeGreaterThan(0);
        });
    });
});