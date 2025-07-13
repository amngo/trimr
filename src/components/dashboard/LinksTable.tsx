import { Link } from '@/types';
import EmptyState from './EmptyState';
import LinkRow from './LinkRow';
import { AnimatePresence } from 'motion/react';

interface LinksTableProps {
    links: Link[];
    onCreateLink: () => void;
    onDeleteLink?: (linkId: string) => Promise<void>;
    onToggleLink?: (linkId: string, enabled: boolean) => Promise<void>;
    isLoading?: boolean;
    deletingLinkId?: string;
}

export default function LinksTable({
    links,
    onCreateLink,
    onDeleteLink,
    onToggleLink,
    isLoading,
    deletingLinkId,
}: LinksTableProps) {
    if (isLoading) {
        return (
            <div className="flex-1 mt-4">
                <div className="flex items-center justify-center h-64">
                    <div className="loading loading-spinner loading-lg"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 mt-4">
            {links.length === 0 ? (
                <EmptyState onCreateLink={onCreateLink} />
            ) : (
                <ul className="grid grid-cols-4 gap-4">
                    <AnimatePresence initial={false}>
                        {links.map((link) => (
                            <LinkRow
                                key={link.id}
                                link={link}
                                onDelete={onDeleteLink}
                                onToggle={onToggleLink}
                                isDeletionPending={deletingLinkId === link.id}
                            />
                        ))}
                    </AnimatePresence>
                </ul>
            )}
        </div>
    );
}
