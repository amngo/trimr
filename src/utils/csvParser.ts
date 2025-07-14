import { CSVLinkData, ParsedCSVData } from '@/types';
import { logger } from './logger';

// const REQUIRED_HEADERS = ['url'];
// const OPTIONAL_HEADERS = ['customSlug', 'expiration', 'startDate'];

export function parseCSVText(csvText: string): ParsedCSVData {
    const trimmedText = csvText.trim();
    const errors: Array<{ row: number; message: string }> = [];
    const data: CSVLinkData[] = [];

    if (!trimmedText) {
        return {
            data: [],
            errors: [{ row: 0, message: 'CSV file is empty' }],
        };
    }

    const lines = trimmedText.split('\n');

    // Parse headers
    const headers = lines[0]
        .split(',')
        .map((h) => h.trim().replace(/['"]/g, ''));

    // Validate headers
    const hasUrlHeader = headers.some((h) => {
        const normalized = h.toLowerCase();
        return (
            normalized === 'url' ||
            normalized === 'link' ||
            normalized === 'website'
        );
    });
    if (!hasUrlHeader) {
        return {
            data: [],
            errors: [{ row: 1, message: 'CSV must contain a "url" column' }],
        };
    }

    // Create header mapping
    const headerMap = createHeaderMap(headers);

    // Parse data rows
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue; // Skip empty lines

        try {
            const rowData = parseCSVRow(line, headerMap, i + 1);
            if (rowData.errors.length > 0) {
                errors.push(...rowData.errors);
            } else if (rowData.data) {
                data.push(rowData.data);
            }
        } catch (error) {
            logger.error('Error parsing CSV row', error);
            errors.push({
                row: i + 1,
                message: `Failed to parse row: ${error instanceof Error ? error.message : 'Unknown error'}`,
            });
        }
    }

    return { data, errors };
}

function createHeaderMap(headers: string[]): Record<string, number> {
    const map: Record<string, number> = {};

    headers.forEach((header, index) => {
        const normalizedHeader = header.toLowerCase();

        // Map common variations
        if (
            normalizedHeader === 'url' ||
            normalizedHeader === 'link' ||
            normalizedHeader === 'website'
        ) {
            map['url'] = index;
        } else if (
            normalizedHeader === 'name' ||
            normalizedHeader === 'title' ||
            normalizedHeader === 'label'
        ) {
            map['name'] = index;
        } else if (
            normalizedHeader === 'startdate' ||
            normalizedHeader === 'start_date' ||
            normalizedHeader === 'start' ||
            normalizedHeader === 'starting date'
        ) {
            map['startDate'] = index;
        } else if (
            normalizedHeader === 'expiration' ||
            normalizedHeader === 'expires' ||
            normalizedHeader === 'expiry' ||
            normalizedHeader === 'expire_date'
        ) {
            map['expiration'] = index;
        } else if (
            normalizedHeader === 'password' ||
            normalizedHeader === 'pass' ||
            normalizedHeader === 'pwd'
        ) {
            map['password'] = index;
        }
    });

    return map;
}

function parseCSVRow(
    line: string,
    headerMap: Record<string, number>,
    rowNumber: number,
): {
    data?: CSVLinkData;
    errors: Array<{ row: number; message: string }>;
} {
    const errors: Array<{ row: number; message: string }> = [];

    // Simple CSV parsing (handles basic cases)
    const values = parseCSVLine(line);

    // Extract URL (required)
    const urlIndex = headerMap['url'];
    if (urlIndex === undefined || !values[urlIndex]) {
        return {
            errors: [{ row: rowNumber, message: 'URL is required' }],
        };
    }

    const url = values[urlIndex].trim();
    if (!isValidURL(url)) {
        return {
            errors: [{ row: rowNumber, message: `Invalid URL: ${url}` }],
        };
    }

    // Extract optional fields
    const data: CSVLinkData = { url };

    if (headerMap['name'] !== undefined && values[headerMap['name']]) {
        const name = values[headerMap['name']].trim();
        if (name.length <= 28) {
            data.name = name;
        } else {
            errors.push({
                row: rowNumber,
                message: `Name too long (max 28 characters): ${name}`,
            });
        }
    }

    if (
        headerMap['startDate'] !== undefined &&
        values[headerMap['startDate']]
    ) {
        const startDate = values[headerMap['startDate']].trim();
        if (isValidDate(startDate)) {
            data.startDate = startDate;
        } else {
            errors.push({
                row: rowNumber,
                message: `Invalid start date: ${startDate}`,
            });
        }
    }

    if (
        headerMap['expiration'] !== undefined &&
        values[headerMap['expiration']]
    ) {
        const expiration = values[headerMap['expiration']].trim();
        if (isValidDate(expiration)) {
            data.expiration = expiration;
        } else {
            errors.push({
                row: rowNumber,
                message: `Invalid expiration date: ${expiration}`,
            });
        }
    }

    if (headerMap['password'] !== undefined && values[headerMap['password']]) {
        const password = values[headerMap['password']].trim();
        if (password.length >= 1) {
            data.password = password;
        } else {
            errors.push({
                row: rowNumber,
                message: `Password cannot be empty if provided`,
            });
        }
    }

    return { data: errors.length === 0 ? data : undefined, errors };
}

function parseCSVLine(line: string): string[] {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
                // Escaped quote
                current += '"';
                i++; // Skip next quote
            } else {
                // Toggle quote state
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            // End of field
            values.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }

    // Add the last field
    values.push(current.trim());

    return values;
}

function isValidURL(url: string): boolean {
    try {
        // Add protocol if missing
        const urlToTest =
            url.startsWith('http://') || url.startsWith('https://')
                ? url
                : `https://${url}`;
        new URL(urlToTest);
        return true;
    } catch {
        return false;
    }
}

function isValidDate(dateString: string): boolean {
    // Support various date formats
    const date = new Date(dateString);
    return !isNaN(date.getTime()) && date > new Date();
}

export function generateSampleCSV(): string {
    const headers = ['url', 'name', 'starting date', 'expiration', 'password'];
    const sampleData = [
        [
            'https://example.com',
            'Example Website',
            '2024-01-01',
            '2024-12-31',
            'secret123',
        ],
        ['https://google.com', 'Google Search', '', '2024-06-30', ''],
        ['https://github.com', 'GitHub Repository', '2024-02-01', '', 'mypass'],
        ['https://stackoverflow.com', '', '', '', ''],
    ];

    const csvLines = [
        headers.join(','),
        ...sampleData.map((row) =>
            row
                .map((cell) =>
                    cell.includes(',') || cell.includes('"')
                        ? `"${cell.replace(/"/g, '""')}"`
                        : cell,
                )
                .join(','),
        ),
    ];

    return csvLines.join('\n');
}

export function downloadSampleCSV() {
    const csvContent = generateSampleCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'sample-links.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
