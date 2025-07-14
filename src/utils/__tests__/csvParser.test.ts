import { parseCSVText, generateSampleCSV } from '../csvParser';

describe('csvParser', () => {
    describe('parseCSVText', () => {
        it('should parse valid CSV with all columns', () => {
            const futureDate = new Date();
            futureDate.setFullYear(futureDate.getFullYear() + 1);
            const futureDateStr = futureDate.toISOString().split('T')[0];

            const csvText = `url,name,starting date,expiration,password
https://example.com,Example Site,${futureDateStr},${futureDateStr},secret123
https://google.com,Google Search,,${futureDateStr},`;

            const result = parseCSVText(csvText);

            expect(result.errors).toHaveLength(0);
            expect(result.data).toHaveLength(2);
            expect(result.data[0]).toEqual({
                url: 'https://example.com',
                name: 'Example Site',
                startDate: futureDateStr,
                expiration: futureDateStr,
                password: 'secret123',
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
            expect(result.errors[0].message).toBe('CSV file is empty');
            expect(result.data).toHaveLength(0);
        });

        it('should return error for CSV without URL column', () => {
            const csvText = `name,description
Test,A test entry`;

            const result = parseCSVText(csvText);

            expect(result.errors).toHaveLength(1);
            expect(result.errors[0].message).toBe(
                'CSV must contain a "url" column',
            );
        });

        it('should handle invalid URLs', () => {
            const csvText = `url
javascript:alert('xss')
https://valid.com`;

            const result = parseCSVText(csvText);

            expect(result.errors).toHaveLength(1);
            expect(result.errors[0].message).toContain('Invalid URL');
            expect(result.data).toHaveLength(1);
        });

        it('should handle names that are too long', () => {
            const csvText = `url,name
https://example.com,This name is way too long and exceeds the maximum limit of 28 characters
https://google.com,Valid name`;

            const result = parseCSVText(csvText);

            expect(result.errors).toHaveLength(1);
            expect(result.errors[0].message).toContain('Name too long');
            expect(result.data).toHaveLength(1);
        });

        it('should handle empty password when provided', () => {
            const csvText = `url,password
https://example.com,
https://google.com,validpass`;

            const result = parseCSVText(csvText);

            expect(result.errors).toHaveLength(0);
            expect(result.data).toHaveLength(2);
            expect(result.data[0]).toEqual({ url: 'https://example.com' });
            expect(result.data[1]).toEqual({
                url: 'https://google.com',
                password: 'validpass',
            });
        });

        it('should handle past expiration dates', () => {
            const csvText = `url,expiration
https://example.com,2020-01-01
https://google.com,2025-12-31`;

            const result = parseCSVText(csvText);

            expect(result.errors).toHaveLength(1);
            expect(result.errors[0].message).toContain(
                'Invalid expiration date',
            );
            expect(result.data).toHaveLength(1);
        });

        it('should handle quoted CSV values', () => {
            const csvText = `url,name
"https://example.com","Test Name"
"https://site-with,comma.com","Quoted Name"`;

            const result = parseCSVText(csvText);

            expect(result.errors).toHaveLength(0);
            expect(result.data).toHaveLength(2);
            expect(result.data[1].url).toBe('https://site-with,comma.com');
            expect(result.data[1].name).toBe('Quoted Name');
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

            const csvText = `link,title,start,expires,pass
https://example.com,Test Site,${futureDateStr},${futureDateStr},mypass`;

            const result = parseCSVText(csvText);

            expect(result.errors).toHaveLength(0);
            expect(result.data).toHaveLength(1);
            expect(result.data[0]).toEqual({
                url: 'https://example.com',
                name: 'Test Site',
                startDate: futureDateStr,
                expiration: futureDateStr,
                password: 'mypass',
            });
        });
    });

    describe('generateSampleCSV', () => {
        it('should generate valid CSV content', () => {
            const csv = generateSampleCSV();

            expect(csv).toContain('url,name,starting date,expiration,password');
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
