import { LinkIcon } from 'lucide-react';

interface EmptyStateProps {
    onCreateLink: () => void;
}

export default function EmptyState({ onCreateLink }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center py-12">
            <LinkIcon size={48} className="text-base-content/50" />
            <h3 className="mt-2 text-sm font-medium text-base-content/70">
                No links
            </h3>
            <p className="mt-1 text-sm">Get started by creating a new link.</p>
            <button onClick={onCreateLink} className="mt-6 btn btn-neutral">
                Create New Link
            </button>
        </div>
    );
}
