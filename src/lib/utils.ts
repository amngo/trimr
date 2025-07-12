import { nanoid } from 'nanoid';

export function generateSlug(): string {
    return nanoid(8);
}

export function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
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
    } catch (error) {
        console.error('Invalid URL:', url, error);
        return url; // Return original if invalid
    }
}
