import { Link, LinkStatus } from '@/types';
import { cn } from '@/utils';

function getLinkStatus(link: Link): LinkStatus {
    const now = new Date();
    if (!link.enabled) return 'disabled';
    if (link.expiresAt && new Date(link.expiresAt) < now) return 'expired';
    if (link.startsAt && new Date(link.startsAt) > now) return 'inactive';
    return 'active';
}

export default function LinkIndicator({ link }: { link: Link }) {
    const status = getLinkStatus(link);
    return (
        <div
            className={cn(
                'absolute w-full h-2 bottom-0 left-0 transition-colors duration-300',
                status === 'active' && 'bg-green-400',
                status === 'inactive' && 'bg-blue-400',
                status === 'expired' && 'bg-gray-400',
                status === 'disabled' && 'bg-red-400',
            )}
        />
    );
}
