'use client';
import { useMemo, useState } from 'react';
import { AppLayout } from '@/components/common';
import {
    SearchAndFilters,
    LinksTable,
    LinksSummary,
    BulkActions,
} from '@/components/features/links';
import { Link } from '@/types';
import { useSearchStore } from '@/stores';
import { logger } from '@/utils';
import {
    filterAndSortLinks,
    getFilteredLinksCount,
} from '@/utils/filterAndSort';
import { DashboardHeader } from '@/components/features/links';

interface ExampleDashboardClientProps {
    initialLinks: Link[];
}

export default function ExampleDashboardClient({
    initialLinks,
}: ExampleDashboardClientProps) {
    const { searchTerm, sortBy, sortOrder, filterStatus, filterTimeRange } =
        useSearchStore();
    const [links, setLinks] = useState<Link[]>(initialLinks);
    const [isLoading, setIsLoading] = useState(false);

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
            setIsLoading(true);
            // Simulate API call delay
            await new Promise((resolve) => setTimeout(resolve, 500));
            setLinks((prev) => prev.filter((link) => link.id !== linkId));
            logger.info('Mock link deleted', { linkId });
        } catch (error) {
            logger.error('Error deleting link', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleLink = async (linkId: string, enabled: boolean) => {
        try {
            setIsLoading(true);
            // Simulate API call delay
            await new Promise((resolve) => setTimeout(resolve, 300));
            setLinks((prev) =>
                prev.map((link) =>
                    link.id === linkId ? { ...link, enabled } : link,
                ),
            );
            logger.info('Mock link toggled', { linkId, enabled });
        } catch (error) {
            logger.error('Error toggling link', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRenameLink = async (linkId: string, name: string) => {
        try {
            setIsLoading(true);
            // Simulate API call delay
            await new Promise((resolve) => setTimeout(resolve, 300));
            setLinks((prev) =>
                prev.map((link) =>
                    link.id === linkId ? { ...link, name } : link,
                ),
            );
            logger.info('Mock link renamed', { linkId, name });
        } catch (error) {
            logger.error('Error renaming link', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBulkDelete = async (linkIds: string[]) => {
        try {
            setIsLoading(true);
            // Simulate API call delay
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setLinks((prev) =>
                prev.filter((link) => !linkIds.includes(link.id)),
            );
            logger.info('Mock bulk delete', { linkIds });
        } catch (error) {
            logger.error('Error bulk deleting links', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBulkToggle = async (linkIds: string[], enabled: boolean) => {
        try {
            setIsLoading(true);
            // Simulate API call delay
            await new Promise((resolve) => setTimeout(resolve, 800));
            setLinks((prev) =>
                prev.map((link) =>
                    linkIds.includes(link.id) ? { ...link, enabled } : link,
                ),
            );
            logger.info('Mock bulk toggle', { linkIds, enabled });
        } catch (error) {
            logger.error('Error bulk toggling links', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateLink = () => {
        // Mock create link - just show a message
        logger.info('Mock create link clicked - this is just a demo');
        alert('This is a demo page. Link creation is not functional here.');
    };

    return (
        <AppLayout>
            <DashboardHeader />
            {/* <div className="mb-4 bg-info text-info-content p-4 rounded-box">
                <h2 className="font-semibold mb-2">📖 Example Dashboard</h2>
                <p className="text-sm">
                    This is a demonstration of the dashboard with mock data.
                    All actions are simulated and won&apos;t affect real data.
                </p>
            </div> */}

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
                isLoading={isLoading}
            />

            <LinksTable
                links={filteredAndSortedLinks}
                onCreateLink={handleCreateLink}
                onDeleteLink={handleDeleteLink}
                onToggleLink={handleToggleLink}
                onRenameLink={handleRenameLink}
                isLoading={isLoading}
                deletingLinkId={undefined}
            />
        </AppLayout>
    );
}
