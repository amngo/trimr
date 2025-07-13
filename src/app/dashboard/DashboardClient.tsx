'use client';
import { useMemo } from 'react';
import CreateLinkModal from '@/components/dashboard/CreateLinkModal';
import BulkUploadModal from '@/components/dashboard/BulkUploadModal';
import SearchAndFilters from '@/components/dashboard/SearchAndFilters';
import LinksTable from '@/components/dashboard/LinksTable';
import LinksSummary from '@/components/dashboard/LinksSummary';
import BulkActions from '@/components/dashboard/BulkActions';
import { Link } from '@/types';
import {
    useLinks,
    useDeleteLink,
    useToggleLink,
    useRenameLink,
} from '@/hooks/useLinks';
import { useBulkDelete, useBulkToggle } from '@/hooks/useBulkOperations';
import { useModalStore, useSearchStore } from '@/stores';
import { logger } from '@/utils';
import {
    filterAndSortLinks,
    getFilteredLinksCount,
} from '@/utils/filterAndSort';
import Header from '@/components/ui/Header';
import { DashboardHeader } from '@/components';

interface DashboardClientProps {
    initialLinks: Link[];
}

export default function DashboardClient({
    initialLinks,
}: DashboardClientProps) {
    const {
        isCreateLinkModalOpen,
        openCreateLinkModal,
        closeCreateLinkModal,
        isBulkUploadModalOpen,
        closeBulkUploadModal,
    } = useModalStore();
    const { searchTerm, sortBy, sortOrder, filterStatus, filterTimeRange } =
        useSearchStore();
    const { data: links = initialLinks, isLoading, error } = useLinks();
    const deleteLink = useDeleteLink();
    const toggleLink = useToggleLink();
    const renameLink = useRenameLink();
    const bulkDelete = useBulkDelete();
    const bulkToggle = useBulkToggle();

    const filteredAndSortedLinks = useMemo(() => {
        return filterAndSortLinks(
            links,
            searchTerm,
            sortBy,
            sortOrder,
            filterStatus,
            filterTimeRange,
        );
    }, [links, searchTerm, sortBy, sortOrder, filterStatus, filterTimeRange]);

    const linkCounts = useMemo(() => {
        return getFilteredLinksCount(
            links,
            searchTerm,
            filterStatus,
            filterTimeRange,
        );
    }, [links, searchTerm, filterStatus, filterTimeRange]);

    const handleDeleteLink = async (linkId: string) => {
        try {
            await deleteLink.mutateAsync(linkId);
        } catch (error) {
            logger.error('Error deleting link', error);
        }
    };

    const handleToggleLink = async (linkId: string, enabled: boolean) => {
        try {
            await toggleLink.mutateAsync({ linkId, enabled });
        } catch (error) {
            logger.error('Error toggling link', error);
        }
    };

    const handleRenameLink = async (linkId: string, name: string) => {
        try {
            await renameLink.mutateAsync({ linkId, name });
        } catch (error) {
            logger.error('Error renaming link', error);
        }
    };

    const handleBulkDelete = async (linkIds: string[]) => {
        try {
            await bulkDelete.mutateAsync(linkIds);
        } catch (error) {
            logger.error('Error bulk deleting links', error);
        }
    };

    const handleBulkToggle = async (linkIds: string[], enabled: boolean) => {
        try {
            await bulkToggle.mutateAsync({ linkIds, enabled });
        } catch (error) {
            logger.error('Error bulk toggling links', error);
        }
    };

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                        Error loading links
                    </h2>
                    <p className="text-gray-600">
                        {error instanceof Error
                            ? error.message
                            : 'An unexpected error occurred'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col h-full">
                <Header />
                <DashboardHeader />

                <LinksSummary
                    total={linkCounts.total}
                    active={linkCounts.active}
                    inactive={linkCounts.inactive}
                    expired={linkCounts.expired}
                    disabled={linkCounts.disabled}
                    isLoading={isLoading}
                />
                <SearchAndFilters />

                <BulkActions
                    linkIds={filteredAndSortedLinks.map((link) => link.id)}
                    onBulkDelete={handleBulkDelete}
                    onBulkToggle={handleBulkToggle}
                    isLoading={bulkDelete.isPending || bulkToggle.isPending}
                />

                <LinksTable
                    links={filteredAndSortedLinks}
                    onCreateLink={openCreateLinkModal}
                    onDeleteLink={handleDeleteLink}
                    onToggleLink={handleToggleLink}
                    onRenameLink={handleRenameLink}
                    isLoading={isLoading}
                    deletingLinkId={
                        deleteLink.isPending ? deleteLink.variables : undefined
                    }
                />
            </div>

            <CreateLinkModal
                isOpen={isCreateLinkModalOpen}
                onClose={closeCreateLinkModal}
            />

            <BulkUploadModal
                isOpen={isBulkUploadModalOpen}
                onClose={closeBulkUploadModal}
            />
        </>
    );
}
