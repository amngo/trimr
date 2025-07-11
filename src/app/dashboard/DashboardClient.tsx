'use client';

import { useMemo } from 'react';
import CreateLinkModal from '@/components/dashboard/CreateLinkModal';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import SearchAndFilters from '@/components/dashboard/SearchAndFilters';
import LinksTable from '@/components/dashboard/LinksTable';
import { Link } from '@/types';
import { useLinks, useDeleteLink } from '@/hooks/useLinks';
import { useModalStore, useSearchStore } from '@/stores';

interface DashboardClientProps {
    initialLinks: Link[];
}

export default function DashboardClient({
    initialLinks,
}: DashboardClientProps) {
    const { isCreateLinkModalOpen, openCreateLinkModal, closeCreateLinkModal } = useModalStore();
    const { searchTerm } = useSearchStore();
    const { data: links = initialLinks, isLoading, error } = useLinks();
    const deleteLink = useDeleteLink();

    const filteredLinks = useMemo(() => {
        if (!searchTerm) return links;
        return links.filter(link => 
            link.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
            link.slug.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [links, searchTerm]);

    const handleDeleteLink = async (linkId: string) => {
        try {
            await deleteLink.mutateAsync(linkId);
        } catch (error) {
            console.error('Error deleting link:', error);
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
                        {error instanceof Error ? error.message : 'An unexpected error occurred'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col h-full">
                <DashboardHeader onCreateLink={openCreateLinkModal} />
                <SearchAndFilters />
                <LinksTable
                    links={filteredLinks}
                    onCreateLink={openCreateLinkModal}
                    onDeleteLink={handleDeleteLink}
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
