'use client';

import { useState } from 'react';
import {
    Trash2,
    ToggleLeft,
    ToggleRight,
    CheckSquare,
    Square,
    X,
    AlertTriangle,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Button } from '../../common';
import { useBulkSelectionStore } from '@/stores';

interface BulkActionsProps {
    linkIds: string[];
    onBulkDelete: (linkIds: string[]) => Promise<void>;
    onBulkToggle: (linkIds: string[], enabled: boolean) => Promise<void>;
    isLoading?: boolean;
}

export default function BulkActions({
    linkIds,
    onBulkDelete,
    onBulkToggle,
    isLoading = false,
}: BulkActionsProps) {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const {
        selectedLinkIds,
        isSelectionMode,
        selectAll,
        getSelectedCount,
        hasSelection,
        toggleSelectionMode,
        toggleSelectAll,
        clearSelection,
    } = useBulkSelectionStore();

    const selectedCount = getSelectedCount();
    const selectedArray = Array.from(selectedLinkIds);

    const handleSelectAll = () => {
        toggleSelectAll(linkIds);
    };

    const handleDelete = async () => {
        if (selectedArray.length === 0) return;

        try {
            await onBulkDelete(selectedArray);
            clearSelection();
            setShowDeleteConfirm(false);
        } catch {
            // Error handling is done in the hook
        }
    };

    const handleEnable = async () => {
        if (selectedArray.length === 0) return;

        try {
            await onBulkToggle(selectedArray, true);
            clearSelection();
        } catch {
            // Error handling is done in the hook
        }
    };

    const handleDisable = async () => {
        if (selectedArray.length === 0) return;

        try {
            await onBulkToggle(selectedArray, false);
            clearSelection();
        } catch {
            // Error handling is done in the hook
        }
    };

    if (!isSelectionMode && linkIds.length <= 1) return null;

    if (!isSelectionMode && !hasSelection()) {
        return (
            <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleSelectionMode}
                        className="gap-2"
                    >
                        <CheckSquare size={16} />
                        Select Multiple
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-primary/5 border border-primary/20 rounded-lg p-4 mt-8"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        {/* Select All Checkbox */}
                        <button
                            onClick={handleSelectAll}
                            className="flex items-center space-x-2 text-sm font-medium hover:text-primary"
                        >
                            {selectAll || selectedCount === linkIds.length ? (
                                <CheckSquare
                                    size={18}
                                    className="text-primary"
                                />
                            ) : selectedCount > 0 ? (
                                <div className="w-[18px] h-[18px] border-2 border-primary rounded bg-primary/20 flex items-center justify-center">
                                    <div className="w-2 h-2 bg-primary rounded-sm" />
                                </div>
                            ) : (
                                <Square
                                    size={18}
                                    className="text-base-content/60"
                                />
                            )}
                            <span>
                                {selectedCount > 0
                                    ? `${selectedCount} selected`
                                    : 'Select all'}
                            </span>
                        </button>
                    </div>

                    <div className="flex items-center space-x-2">
                        {/* Bulk Actions */}
                        {selectedCount > 0 && (
                            <>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleEnable}
                                    disabled={isLoading}
                                    className="gap-2"
                                >
                                    <ToggleRight size={16} />
                                    Enable ({selectedCount})
                                </Button>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleDisable}
                                    disabled={isLoading}
                                    className="gap-2"
                                >
                                    <ToggleLeft size={16} />
                                    Disable ({selectedCount})
                                </Button>

                                <div className="relative">
                                    <Button
                                        variant="error"
                                        size="sm"
                                        onClick={() =>
                                            setShowDeleteConfirm(true)
                                        }
                                        disabled={isLoading}
                                        className="gap-2"
                                    >
                                        <Trash2 size={16} />
                                        Delete ({selectedCount})
                                    </Button>

                                    {/* Delete Confirmation Popup */}
                                    {showDeleteConfirm && (
                                        <div className="absolute right-0 top-full mt-2 bg-base-100 border border-base-300 rounded-lg shadow-lg z-10 min-w-[280px]">
                                            <div className="p-4">
                                                <div className="flex items-center space-x-2 mb-3">
                                                    <AlertTriangle
                                                        size={20}
                                                        className="text-error"
                                                    />
                                                    <h4 className="font-medium text-base-content">
                                                        Delete {selectedCount}{' '}
                                                        links?
                                                    </h4>
                                                </div>
                                                <p className="text-sm text-base-content/70 mb-4">
                                                    This action cannot be
                                                    undone. All selected links
                                                    and their analytics data
                                                    will be permanently deleted.
                                                </p>
                                                <div className="flex items-center justify-end space-x-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            setShowDeleteConfirm(
                                                                false,
                                                            )
                                                        }
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        variant="error"
                                                        size="sm"
                                                        onClick={handleDelete}
                                                        disabled={isLoading}
                                                        loading={isLoading}
                                                        className="gap-2"
                                                    >
                                                        <Trash2 size={14} />
                                                        Delete {
                                                            selectedCount
                                                        }{' '}
                                                        Links
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {/* Exit Selection Mode */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearSelection}
                            className="gap-2"
                        >
                            <X size={16} />
                            Cancel
                        </Button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
