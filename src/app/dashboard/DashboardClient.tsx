'use client';

import { useState } from 'react';
import CreateLinkModal from '@/components/dashboard/CreateLinkModal';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import SearchAndFilters from '@/components/dashboard/SearchAndFilters';
import LinksTable from '@/components/dashboard/LinksTable';
import { Link } from '@/types';
import { deleteLink } from '@/app/actions';

interface DashboardClientProps {
    initialLinks: Link[];
}

export default function DashboardClient({
    initialLinks,
}: DashboardClientProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [links, setLinks] = useState<Link[]>(initialLinks);

    const handleDeleteLink = async (linkId: string) => {
        // Optimistic update
        setLinks(links.filter((link) => link.id !== linkId));

        try {
            const result = await deleteLink(linkId);
            if (!result.success) {
                // Revert optimistic update on failure
                setLinks(links);
                console.error('Failed to delete link:', result.error);
            }
        } catch (error) {
            // Revert optimistic update on error
            setLinks(links);
            console.error('Error deleting link:', error);
        }
    };

    return (
        <>
            <div className="flex flex-col h-full">
                <DashboardHeader onCreateLink={() => setIsModalOpen(true)} />
                <SearchAndFilters />
                <LinksTable
                    links={links}
                    onCreateLink={() => setIsModalOpen(true)}
                    onDeleteLink={handleDeleteLink}
                />
            </div>

            <CreateLinkModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}
