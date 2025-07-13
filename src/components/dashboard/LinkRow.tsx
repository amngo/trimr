import {
    ClipboardIcon,
    CheckSquare,
    Square,
    MousePointerClickIcon,
    TrashIcon,
    UsersIcon,
    EllipsisVerticalIcon,
    PencilIcon,
    CheckIcon,
    XIcon,
} from 'lucide-react';
import { useState } from 'react';
import { formatUrl, formatSlug, copyToClipboard } from '@/utils/linkUtils';
import { Link as LinkType } from '@/types';
import { toast, useBulkSelectionStore } from '@/stores';
import { cn } from '@/utils';
import { motion } from 'motion/react';
import { BASE_URL } from '@/constants';
import QRCodeDisplay from './QRCodeDisplay';
import LinkIndicator from './LinkIndicator';
import Link from 'next/link';
import { getBadgeClasses, getLinkBadges } from '@/utils/linkBadges';

interface LinkRowProps {
    link: LinkType;
    onDelete?: (linkId: string) => Promise<void>;
    onToggle?: (linkId: string, enabled: boolean) => Promise<void>;
    onRename?: (linkId: string, name: string) => Promise<void>;
    isDeletionPending?: boolean;
}

export default function LinkRow({
    link,
    onDelete,
    onToggle,
    onRename,
    isDeletionPending = false,
}: LinkRowProps) {
    // const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isToggling, setIsToggling] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(link.name || '');
    // const [showPassword, setShowPassword] = useState(false);

    const { isSelectionMode, isLinkSelected, toggleLink } =
        useBulkSelectionStore();

    const isSelected = isLinkSelected(link.id);

    const handleDelete = async () => {
        if (onDelete) {
            await onDelete(link.id);
        }
        // setShowDeleteConfirm(false);
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
        const success = await copyToClipboard(`${BASE_URL}/${link.slug}`);
        if (success) {
            toast.success('Link copied to clipboard!');
        } else {
            toast.error('Failed to copy link to clipboard');
        }
    };

    const handleRowClick = () => {
        if (isSelectionMode) {
            toggleLink(link.id);
        }
    };

    const handleCheckboxClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        toggleLink(link.id);
    };

    const handleStartRename = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsEditing(true);
        setEditName(link.name || '');
    };

    const handleSaveRename = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onRename) {
            try {
                await onRename(link.id, editName);
                setIsEditing(false);
            } catch (error) {
                console.error('Error renaming link:', error);
            }
        }
    };

    const handleCancelRename = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsEditing(false);
        setEditName(link.name || '');
    };

    const handleNameKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const mockEvent = { stopPropagation: () => {} } as React.MouseEvent;
            handleSaveRename(mockEvent);
        } else if (e.key === 'Escape') {
            e.preventDefault();
            const mockEvent = { stopPropagation: () => {} } as React.MouseEvent;
            handleCancelRename(mockEvent);
        }
    };

    return (
        <motion.li
            initial={false}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
                'group flex flex-col items-center px-4 pt-2 pb-4 rounded relative border border-base-300 bg-base-100 transition-all duration-300',
                isDeletionPending && 'pointer-events-none',
                isSelectionMode && 'cursor-pointer hover:bg-base-200',
                isSelected && 'bg-primary/5 border-primary/30',
            )}
            onClick={handleRowClick}
        >
            <div className="flex flex-col items-center gap-1">
                <div className="flex items-center justify-between w-full h-8">
                    {isEditing ? (
                        <div className="flex items-center gap-1 flex-1 mr-2">
                            <input
                                type="text"
                                value={editName}
                                onChange={(e) => {
                                    const newValue = e.target.value;
                                    if (newValue.length <= 28) {
                                        setEditName(newValue);
                                    }
                                }}
                                onKeyDown={handleNameKeyDown}
                                className="input input-xs w-full"
                                placeholder="Enter link name"
                                maxLength={28}
                                autoFocus
                                onClick={(e) => e.stopPropagation()}
                            />
                            <button
                                onClick={handleSaveRename}
                                className="btn btn-xs btn-square btn-primary"
                                title="Save"
                            >
                                <CheckIcon size={12} />
                            </button>
                            <button
                                onClick={handleCancelRename}
                                className="btn btn-xs btn-square btn-ghost"
                                title="Cancel"
                            >
                                <XIcon size={12} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1 flex-1 mr-2">
                            <h2 className="text-sm font-medium truncate">
                                {link.name || 'Untitled Link'}
                            </h2>
                            {!isSelectionMode && (
                                <button
                                    onClick={handleStartRename}
                                    className="btn btn-xs btn-square btn-ghost opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Rename link"
                                >
                                    <PencilIcon size={12} />
                                </button>
                            )}
                        </div>
                    )}
                    {!isSelectionMode && (
                        <div className="dropdown dropdown-end -mr-2">
                            <div
                                tabIndex={0}
                                role="button"
                                className="btn btn-square m-1 btn-xs btn-ghost"
                            >
                                <EllipsisVerticalIcon size={16} />
                            </div>
                            <ul
                                tabIndex={0}
                                className="dropdown-content menu bg-base-100 rounded-box z-1 w-42 p-2 shadow-sm flex flex-col space-y-1"
                            >
                                <li>
                                    <Link
                                        href={`/stats/${link.slug}`}
                                        className="btn btn-ghost btn-sm"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        View Analytics
                                    </Link>
                                </li>
                                <li>
                                    <button
                                        onClick={handleStartRename}
                                        className="btn btn-ghost btn-sm"
                                    >
                                        <PencilIcon size={12} />
                                        <span>Rename</span>
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleToggle();
                                        }}
                                        disabled={isToggling}
                                        className={cn('btn btn-ghost btn-sm')}
                                        title={
                                            link.enabled
                                                ? 'Disable link'
                                                : 'Enable link'
                                        }
                                    >
                                        {link.enabled
                                            ? 'Disable link'
                                            : 'Enable link'}
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={handleDelete}
                                        className="text-error btn btn-ghost btn-sm"
                                    >
                                        <TrashIcon size={12} />
                                        <span>Delete</span>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}

                    {isSelectionMode && (
                        <div
                            className="flex-shrink-0"
                            onClick={handleCheckboxClick}
                        >
                            {isSelected ? (
                                <CheckSquare
                                    size={20}
                                    className="text-primary"
                                />
                            ) : (
                                <Square
                                    size={20}
                                    className="text-base-content/40 hover:text-base-content/60"
                                />
                            )}
                        </div>
                    )}
                </div>

                <QRCodeDisplay qrCodeUrl={formatSlug(link.slug)} />
                <div className="relative mt-1">
                    <p className="text-xs truncate font-mono text-primary max-w-[125px]">
                        trimr.im/{link.slug}
                    </p>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleCopyLink();
                        }}
                        className="btn btn-ghost btn-square btn-xs absolute -right-7 -top-1"
                        disabled={isSelectionMode}
                    >
                        <ClipboardIcon size={16} />
                    </button>
                </div>

                <div className="tooltip tooltip-bottom">
                    <span className="tooltip-content text-xs">
                        {formatUrl(link.url)}
                    </span>
                    <p className="text-xs truncate font-light w-[200px] text-center cursor-default">
                        {formatUrl(link.url)}
                    </p>
                </div>

                <div className="self-start flex items-center justify-between w-full mt-1">
                    <div className="flex items-center gap-8 border border-base-300 rounded px-2 py-1 text-xs">
                        <div className="flex items-center space-x-1">
                            <UsersIcon size={12} />
                            <span>{link.visitorCount}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <MousePointerClickIcon size={12} />
                            <span>{link.clickCount}</span>
                        </div>
                    </div>

                    {/* Link Status Badges */}
                    <div className="flex items-center space-x-1">
                        {getLinkBadges(link).map((badge, index) => (
                            <span
                                key={`${badge.type}-${index}`}
                                className={cn(
                                    'badge badge-xs',
                                    getBadgeClasses(badge.variant),
                                )}
                            >
                                {badge.text}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
            <LinkIndicator link={link} />
        </motion.li>
    );
}

{
    /* {link.password && (
                            <div className="flex items-center space-x-2">
                                <span className="text-xs text-base-content/60">
                                    Password:
                                </span>
                                <div className="flex items-center space-x-1">
                                    <span className="text-xs font-mono bg-base-200 px-2 py-1 rounded">
                                        {showPassword
                                            ? link.password
                                            : '••••••••'}
                                    </span>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowPassword(!showPassword);
                                        }}
                                        className="text-gray-400 hover:text-gray-600 p-1"
                                        disabled={isSelectionMode}
                                        title={
                                            showPassword
                                                ? 'Hide password'
                                                : 'Show password'
                                        }
                                    >
                                        {showPassword ? (
                                            <EyeOff size={12} />
                                        ) : (
                                            <Eye size={12} />
                                        )}
                                    </button>
                                </div>
                            </div>
                        )} */
}
