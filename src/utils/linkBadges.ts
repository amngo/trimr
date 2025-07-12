import { Link } from '@/types';

export interface LinkBadge {
    type: 'password' | 'starts-in' | 'expires-in' | 'expired' | 'not-started';
    text: string;
    variant: 'primary' | 'warning' | 'error' | 'info' | 'success';
}

function formatTimeRemaining(futureDate: Date, now: Date, prefix: string): string {
    const diffMs = futureDate.getTime() - now.getTime();
    
    const minutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (days >= 1) {
        return days === 1 ? `${prefix} 1 day` : `${prefix} ${days} days`;
    } else if (hours >= 1) {
        return hours === 1 ? `${prefix} 1 hour` : `${prefix} ${hours} hours`;
    } else if (minutes >= 1) {
        return minutes === 1 ? `${prefix} 1 minute` : `${prefix} ${minutes} minutes`;
    } else {
        return `${prefix} less than a minute`;
    }
}

export function getLinkBadges(link: Link): LinkBadge[] {
    const badges: LinkBadge[] = [];
    const now = new Date();

    // Password protection badge
    if (link.password) {
        badges.push({
            type: 'password',
            text: 'Protected',
            variant: 'primary'
        });
    }

    // Start date badges
    if (link.startsAt) {
        const startDate = new Date(link.startsAt);
        if (startDate > now) {
            badges.push({
                type: 'starts-in',
                text: formatTimeRemaining(startDate, now, 'Starts in'),
                variant: 'info'
            });
        }
    }

    // Expiration badges
    if (link.expiresAt) {
        const expirationDate = new Date(link.expiresAt);
        if (expirationDate <= now) {
            badges.push({
                type: 'expired',
                text: 'Expired',
                variant: 'error'
            });
        } else {
            const diffMs = expirationDate.getTime() - now.getTime();
            const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            
            // Show expiration badge if expiring within 30 days
            if (days <= 30) {
                const variant = days <= 7 ? 'warning' : 'info';
                badges.push({
                    type: 'expires-in',
                    text: formatTimeRemaining(expirationDate, now, 'Expires in'),
                    variant
                });
            }
        }
    }

    return badges;
}

export function getBadgeClasses(variant: LinkBadge['variant']): string {
    switch (variant) {
        case 'primary':
            return 'badge-primary';
        case 'warning':
            return 'badge-warning';
        case 'error':
            return 'badge-error';
        case 'info':
            return 'badge-info';
        case 'success':
            return 'badge-success';
        default:
            return 'badge-neutral';
    }
}