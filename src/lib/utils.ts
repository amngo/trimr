import { nanoid } from 'nanoid';

export function generateSlug(): string {
    return nanoid(8);
}

export function isValidUrl(url: string): boolean {
    try {
        const parsedUrl = new URL(url);
        // Only allow http and https protocols for security
        return (
            parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:'
        );
    } catch {
        return false;
    }
}

export function formatUrl(url: string): string {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return `https://${url}`;
    }
    return url;
}

export async function getCountryFromIp(ip: string): Promise<string | null> {
    try {
        const response = await fetch(`https://ipapi.co/${ip}/country_name/`);
        if (response.ok) {
            const country = await response.text();
            return country.trim();
        }
    } catch (error) {
        console.error('Error fetching country:', error);
    }
    return null;
}

export function normalizeUrl(url: string): string {
    try {
        const parsedUrl = new URL(url);
        return parsedUrl.href.replace(/\/$/, ''); // Remove trailing slash
    } catch {
        return url; // Return original if invalid
    }
}
