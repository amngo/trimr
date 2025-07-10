import {
    ClipboardIcon,
    EllipsisVerticalIcon,
    ExternalLinkIcon,
    MousePointerClickIcon,
    UsersIcon,
    TrashIcon,
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
import { Link } from '@/types';

interface LinkRowProps {
    link: Link;
    onDelete?: (linkId: string) => Promise<void>;
}

export default function LinkRow({ link, onDelete }: LinkRowProps) {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleDelete = async () => {
        if (onDelete) {
            await onDelete(link.id);
        }
        setShowDeleteConfirm(false);
    };
    return (
        <div className="flex items-center px-6 py-4 hover:bg-gray-100 bg-white border border-gray-200 rounded relative">
            <LinkIndicator enabled={link.enabled} />

            <div className="flex items-center space-x-3 flex-1 min-w-0">
                <LinkIcon url={link.url} />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900 truncate">
                            {formatSlug(link.slug)}
                        </p>
                        <button
                            onClick={() =>
                                copyToClipboard(
                                    `${process.env.NEXT_PUBLIC_BASE_URL}/${link.slug}`
                                )
                            }
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
                    <p className="text-xs text-gray-500 truncate font-light">
                        {formatUrl(link.url)}
                    </p>
                </div>
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                    <UsersIcon size={16} />
                    <span>
                        {Math.floor(Math.random() * 1000) + 100} Visitors
                    </span>
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
                        onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
                        className="size-8 border border-gray-200 rounded bg-white flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <EllipsisVerticalIcon size={16} />
                    </button>

                    {showDeleteConfirm && (
                        <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[150px]">
                            <div className="p-2">
                                <p className="text-sm text-gray-600 mb-2">
                                    Delete this link?
                                </p>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={handleDelete}
                                        className="flex items-center space-x-1 px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded"
                                    >
                                        <TrashIcon size={12} />
                                        <span>Delete</span>
                                    </button>
                                    <button
                                        onClick={() =>
                                            setShowDeleteConfirm(false)
                                        }
                                        className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-50 rounded"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
