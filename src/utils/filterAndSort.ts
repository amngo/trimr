import { Link } from '@/types';
import type { SortBy, SortOrder, FilterStatus, FilterTimeRange } from '@/stores/useSearchStore';

export function filterAndSortLinks(
    links: Link[],
    searchTerm: string,
    sortBy: SortBy,
    sortOrder: SortOrder,
    filterStatus: FilterStatus,
    filterTimeRange: FilterTimeRange
): Link[] {
    let filteredLinks = [...links];

    // Apply search filter
    if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        filteredLinks = filteredLinks.filter(link => 
            link.url.toLowerCase().includes(searchLower) ||
            link.slug.toLowerCase().includes(searchLower)
        );
    }

    // Apply status filter
    if (filterStatus !== 'all') {
        const now = new Date();
        filteredLinks = filteredLinks.filter(link => {
            switch (filterStatus) {
                case 'active':
                    return link.enabled && 
                           (!link.expiresAt || link.expiresAt > now) &&
                           (!link.startsAt || link.startsAt <= now);
                case 'expired':
                    return link.expiresAt && link.expiresAt <= now;
                case 'disabled':
                    return !link.enabled;
                default:
                    return true;
            }
        });
    }

    // Apply time range filter
    if (filterTimeRange !== 'all') {
        const now = new Date();
        const cutoffDate = new Date();
        
        switch (filterTimeRange) {
            case '7d':
                cutoffDate.setDate(now.getDate() - 7);
                break;
            case '30d':
                cutoffDate.setDate(now.getDate() - 30);
                break;
            case '90d':
                cutoffDate.setDate(now.getDate() - 90);
                break;
        }
        
        filteredLinks = filteredLinks.filter(link => 
            new Date(link.createdAt) >= cutoffDate
        );
    }

    // Apply sorting
    filteredLinks.sort((a, b) => {
        let aValue: string | number | Date;
        let bValue: string | number | Date;

        switch (sortBy) {
            case 'createdAt':
                aValue = new Date(a.createdAt);
                bValue = new Date(b.createdAt);
                break;
            case 'clickCount':
                aValue = a.clickCount;
                bValue = b.clickCount;
                break;
            case 'visitorCount':
                aValue = a.visitorCount;
                bValue = b.visitorCount;
                break;
            case 'slug':
                aValue = a.slug.toLowerCase();
                bValue = b.slug.toLowerCase();
                break;
            case 'url':
                aValue = a.url.toLowerCase();
                bValue = b.url.toLowerCase();
                break;
            default:
                aValue = a.createdAt;
                bValue = b.createdAt;
        }

        let comparison = 0;
        if (aValue < bValue) {
            comparison = -1;
        } else if (aValue > bValue) {
            comparison = 1;
        }

        return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filteredLinks;
}

export function getFilteredLinksCount(
    links: Link[],
    searchTerm: string,
    filterStatus: FilterStatus,
    filterTimeRange: FilterTimeRange
): {
    total: number;
    active: number;
    expired: number;
    disabled: number;
} {
    const now = new Date();
    
    let filteredLinks = links;
    
    // Apply search filter
    if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        filteredLinks = filteredLinks.filter(link => 
            link.url.toLowerCase().includes(searchLower) ||
            link.slug.toLowerCase().includes(searchLower)
        );
    }

    // Apply time range filter
    if (filterTimeRange !== 'all') {
        const cutoffDate = new Date();
        
        switch (filterTimeRange) {
            case '7d':
                cutoffDate.setDate(now.getDate() - 7);
                break;
            case '30d':
                cutoffDate.setDate(now.getDate() - 30);
                break;
            case '90d':
                cutoffDate.setDate(now.getDate() - 90);
                break;
        }
        
        filteredLinks = filteredLinks.filter(link => 
            new Date(link.createdAt) >= cutoffDate
        );
    }

    const active = filteredLinks.filter(link => 
        link.enabled && 
        (!link.expiresAt || link.expiresAt > now) &&
        (!link.startsAt || link.startsAt <= now)
    ).length;

    const expired = filteredLinks.filter(link => 
        link.expiresAt && link.expiresAt <= now
    ).length;

    const disabled = filteredLinks.filter(link => 
        !link.enabled
    ).length;

    return {
        total: filteredLinks.length,
        active,
        expired,
        disabled,
    };
}