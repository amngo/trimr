'use client';

import { useMemo } from 'react';
import CreateLinkModal from '@/components/dashboard/CreateLinkModal';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import SearchAndFilters from '@/components/dashboard/SearchAndFilters';
import LinksTable from '@/components/dashboard/LinksTable';
import LinksSummary from '@/components/dashboard/LinksSummary';
import { Link } from '@/types';
import { useLinks, useDeleteLink, useToggleLink } from '@/hooks/useLinks';
import { useModalStore, useSearchStore } from '@/stores';
import {
    filterAndSortLinks,
    getFilteredLinksCount,
} from '@/utils/filterAndSort';

interface DashboardClientProps {
    initialLinks: Link[];
}

export default function DashboardClient({
    initialLinks,
}: DashboardClientProps) {
    const { isCreateLinkModalOpen, openCreateLinkModal, closeCreateLinkModal } =
        useModalStore();
    const { searchTerm, sortBy, sortOrder, filterStatus, filterTimeRange } =
        useSearchStore();
    const { data: links = initialLinks, isLoading, error } = useLinks();
    const deleteLink = useDeleteLink();
    const toggleLink = useToggleLink();

    const filteredAndSortedLinks = useMemo(() => {
        return filterAndSortLinks(
            links,
            searchTerm,
            sortBy,
            sortOrder,
            filterStatus,
            filterTimeRange
        );
    }, [links, searchTerm, sortBy, sortOrder, filterStatus, filterTimeRange]);

    const linkCounts = useMemo(() => {
        return getFilteredLinksCount(
            links,
            searchTerm,
            filterStatus,
            filterTimeRange
        );
    }, [links, searchTerm, filterStatus, filterTimeRange]);

    const handleDeleteLink = async (linkId: string) => {
        try {
            await deleteLink.mutateAsync(linkId);
        } catch (error) {
            console.error('Error deleting link:', error);
        }
    };

    const handleToggleLink = async (linkId: string, enabled: boolean) => {
        try {
            await toggleLink.mutateAsync({ linkId, enabled });
        } catch (error) {
            console.error('Error toggling link:', error);
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
                <DashboardHeader onCreateLink={openCreateLinkModal} />
                <LinksSummary
                    total={linkCounts.total}
                    active={linkCounts.active}
                    expired={linkCounts.expired}
                    disabled={linkCounts.disabled}
                    isLoading={isLoading}
                />
                <SearchAndFilters />

                <LinksTable
                    links={filteredAndSortedLinks}
                    onCreateLink={openCreateLinkModal}
                    onDeleteLink={handleDeleteLink}
                    onToggleLink={handleToggleLink}
                    isLoading={isLoading || deleteLink.isPending}
                />
            </div>

            <CreateLinkModal
                isOpen={isCreateLinkModalOpen}
                onClose={closeCreateLinkModal}
            />
        </>
    );
}
