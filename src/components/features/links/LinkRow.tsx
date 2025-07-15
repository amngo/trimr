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
    ChartBarIcon,
    PowerIcon,
    DownloadIcon,
    KeyRoundIcon,
    InfoIcon,
} from 'lucide-react';
import { useState } from 'react';
import {
    formatUrl,
    formatSlug,
    copyToClipboard,
    downloadQRCode,
    formatDate,
} from '@/utils/linkUtils';
import { Link as LinkType } from '@/types';
import { toast, useBulkSelectionStore } from '@/stores';
import { cn } from '@/utils';
import { motion } from 'motion/react';
import { logger } from '@/utils/logger';
import { BASE_URL } from '@/constants';
import QRCodeDisplay from './QRCodeDisplay';
import LinkIndicator from './LinkIndicator';
import Link from 'next/link';

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

    const handleCopyPassword = async () => {
        if (link.password) {
            const success = await copyToClipboard(link.password);
            if (success) {
                toast.success('Password copied to clipboard!');
            } else {
                toast.error('Failed to copy password to clipboard');
            }
        } else {
            toast.error('No password set for this link');
        }
    };

    const handleDownloadQRCode = (e: React.MouseEvent) => {
        e.stopPropagation();
        const filename = `qr-code-${link.slug}`;
        downloadQRCode(link.id, filename);
        toast.success('QR code downloaded!');
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
                logger.error('Error renaming link', error);
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
            const mockEvent = {
                stopPropagation: () => {},
            } as React.MouseEvent;
            handleSaveRename(mockEvent);
        } else if (e.key === 'Escape') {
            e.preventDefault();
            const mockEvent = {
                stopPropagation: () => {},
            } as React.MouseEvent;
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
                                className="dropdown-content menu bg-base-100 rounded-box z-1 w-[180px] p-2 shadow-sm flex flex-col space-y-1"
                            >
                                <li>
                                    <Link
                                        href={`/stats/${link.slug}`}
                                        className="btn btn-ghost btn-sm justify-start"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <ChartBarIcon size={12} />
                                        <span className="ml-2">
                                            View Analytics
                                        </span>
                                    </Link>
                                </li>
                                <li>
                                    <button
                                        onClick={handleStartRename}
                                        className="btn btn-ghost btn-sm justify-start"
                                    >
                                        <PencilIcon size={12} />
                                        <span className="ml-2">Rename</span>
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={handleDownloadQRCode}
                                        className="btn btn-ghost btn-sm justify-start"
                                    >
                                        <DownloadIcon size={12} />
                                        <span className="ml-2">
                                            Download QR
                                        </span>
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleToggle();
                                        }}
                                        disabled={isToggling}
                                        className={cn(
                                            'btn btn-ghost btn-sm justify-start',
                                        )}
                                        title={
                                            link.enabled
                                                ? 'Disable link'
                                                : 'Enable link'
                                        }
                                    >
                                        <PowerIcon size={12} />
                                        <span className="ml-2">
                                            {link.enabled
                                                ? 'Disable link'
                                                : 'Enable link'}
                                        </span>
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={handleDelete}
                                        className="text-error btn btn-ghost btn-sm justify-start"
                                    >
                                        <TrashIcon size={12} />
                                        <span className="ml-2">Delete</span>
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

                <QRCodeDisplay id={link.id} qrCodeUrl={formatSlug(link.slug)} />
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
                    <div className="flex items-center gap-12 border border-base-300 rounded px-2 py-1 text-xs">
                        <div className="flex items-center space-x-1">
                            <UsersIcon size={12} />
                            <span>{link.visitorCount}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <MousePointerClickIcon size={12} />
                            <span>{link.clickCount}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {link.password && (
                            <button
                                onClick={handleCopyPassword}
                                className="tooltip tooltip-left w-[26px] h-[26px] flex items-center justify-center"
                            >
                                <div className="tooltip-content">
                                    <div className="font-mono">{`Password: ${link.password}`}</div>
                                    <div className="text-xs italic">
                                        Click to copy
                                    </div>
                                </div>
                                <KeyRoundIcon size={16} />
                            </button>
                        )}
                        <div className="tooltip tooltip-left w-[26px] h-[26px] flex items-center justify-center">
                            <div className="tooltip-content flex flex-col items-start">
                                {link.createdAt && (
                                    <div className="text-xs">
                                        Created at: {formatDate(link.createdAt)}
                                    </div>
                                )}
                                {link.startsAt && (
                                    <div className="text-xs">
                                        Starts at: {formatDate(link.startsAt)}
                                    </div>
                                )}
                                {link.expiresAt && (
                                    <div className="text-xs">
                                        Expires at: {formatDate(link.expiresAt)}
                                    </div>
                                )}
                            </div>
                            <InfoIcon size={16} />
                        </div>
                    </div>
                </div>
            </div>
            <LinkIndicator link={link} />
        </motion.li>
    );
}
