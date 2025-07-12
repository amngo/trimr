import {
    ClipboardIcon,
    ExternalLinkIcon,
    MousePointerClickIcon,
    UsersIcon,
    TrashIcon,
    ChartBarIcon,
    ToggleLeft,
    ToggleRight,
    PowerIcon,
} from 'lucide-react';
import { useState } from 'react';
import LinkIcon from './LinkIcon';
import {
    formatUrl,
    formatSlug,
    formatDate,
    copyToClipboard,
} from '@/utils/linkUtils';
import LinkIndicator from './LinkIndicator';
import { Link as LinkType } from '@/types';
import Link from 'next/link';
import { toast } from '@/stores';
import { cn } from '@/utils';

interface LinkRowProps {
    link: LinkType;
    onDelete?: (linkId: string) => Promise<void>;
    onToggle?: (linkId: string, enabled: boolean) => Promise<void>;
    isDeletionPending?: boolean;
}

export default function LinkRow({ link, onDelete, onToggle, isDeletionPending = false }: LinkRowProps) {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isToggling, setIsToggling] = useState(false);

    const handleDelete = async () => {
        if (onDelete) {
            await onDelete(link.id);
        }
        setShowDeleteConfirm(false);
    };

    const handleToggle = async () => {
        if (onToggle && !isToggling) {
            setIsToggling(true);
            try {
                await onToggle(link.id, !link.enabled);
            } finally {
                setIsToggling(false);
            }
        }
    };

    const handleCopyLink = async () => {
        const success = await copyToClipboard(
            `${process.env.NEXT_PUBLIC_BASE_URL}/${link.slug}`
        );
        if (success) {
            toast.success('Link copied to clipboard!');
        } else {
            toast.error('Failed to copy link to clipboard');
        }
    };
    return (
        <li className={cn(
            'flex items-center px-6 py-4 rounded relative border border-base-300 bg-base-100 transition-opacity duration-300',
            isDeletionPending ? 'opacity-50 pointer-events-none' : 'opacity-100'
        )}>
            <LinkIndicator enabled={link.enabled} />

            <div className="flex items-center space-x-3 flex-1 min-w-0">
                <LinkIcon url={link.url} />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium truncate">
                            {formatSlug(link.slug)}
                        </p>
                        <button
                            onClick={handleCopyLink}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <ClipboardIcon size={16} />
                        </button>
                        <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <ExternalLinkIcon size={16} />
                        </a>
                    </div>
                    <p className="text-xs truncate font-light">
                        {formatUrl(link.url)}
                    </p>
                </div>
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                    <UsersIcon size={16} />
                    <span>100 Visitors</span>
                </div>
                <div className="flex items-center space-x-1">
                    <MousePointerClickIcon size={16} />
                    <span>{link.clickCount} Clicks</span>
                </div>
                <div className="text-gray-500 min-w-0">
                    {formatDate(link.createdAt)}
                </div>
                <div className="relative">
                    <button
                        onClick={handleToggle}
                        disabled={isToggling}
                        className={cn(
                            'btn btn-square btn-soft btn-sm',
                            isToggling && 'loading'
                        )}
                        title={link.enabled ? 'Disable link' : 'Enable link'}
                    >
                        <PowerIcon size={16} />
                    </button>

                    <Link
                        href={`/stats/${link.slug}`}
                        className="btn btn-square btn-soft btn-sm ml-2 btn-primary"
                    >
                        <ChartBarIcon size={16} />
                    </Link>
                    <button
                        onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
                        className="btn btn-square btn-soft btn-sm ml-2 btn-error"
                    >
                        <TrashIcon size={16} />
                    </button>
                    {showDeleteConfirm && (
                        <div className="absolute right-0 top-8 bg-card border rounded z-10 min-w-[150px] bg-base-200 border-base-300">
                            <div className="p-2">
                                <p className="text-sm mb-2">
                                    Delete this link?
                                </p>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={handleDelete}
                                        className="flex items-center space-x-1 px-2 py-1 text-xs text-error hover:bg-base-100 rounded"
                                    >
                                        <TrashIcon size={12} />
                                        <span>Delete</span>
                                    </button>
                                    <button
                                        onClick={() =>
                                            setShowDeleteConfirm(false)
                                        }
                                        className="px-2 py-1 text-xs hover:bg-base-100 rounded"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </li>
    );
}
