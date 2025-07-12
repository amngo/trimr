import { logger } from './logger';
import { BASE_URL, FAVICON_SERVICE_URL } from '@/constants';

export function formatUrl(url: string, maxLength: number = 50) {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
}

export function formatDate(date: Date) {
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(new Date(date));
}

export function formatSlug(slug: string) {
    return `${BASE_URL}/${slug}`;
}

export async function copyToClipboard(text: string) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        logger.error('Failed to copy to clipboard', error);
        return false;
    }
}

// Extract domain from URL
export function getDomain(url: string) {
    try {
        return new URL(url).hostname;
    } catch {
        return '';
    }
}

// Get favicon URL
export function getFaviconUrl(url: string) {
    const domain = getDomain(url);
    return `${FAVICON_SERVICE_URL}?domain=${domain}&sz=32`;
}
