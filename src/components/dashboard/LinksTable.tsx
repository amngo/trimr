import { Link } from '@/types';
import EmptyState from './EmptyState';
import LinkRow from './LinkRow';

interface LinksTableProps {
    links: Link[];
    onCreateLink: () => void;
    onDeleteLink?: (linkId: string) => Promise<void>;
    isLoading?: boolean;
}

export default function LinksTable({ links, onCreateLink, onDeleteLink, isLoading }: LinksTableProps) {
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
                <ul className="flex flex-col gap-2">
                    {links.map((link) => (
                        <LinkRow key={link.id} link={link} onDelete={onDeleteLink} />
                    ))}
                </ul>
            )}
        </div>
    );
}
