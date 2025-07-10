import { LinkIcon } from 'lucide-react';

interface EmptyStateProps {
    onCreateLink: () => void;
}

export default function EmptyState({ onCreateLink }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center py-12">
            <LinkIcon size={48} className="text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No links</h3>
            <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new link.
            </p>
            <div className="mt-6">
                <button
                    onClick={onCreateLink}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded text-white bg-black hover:bg-gray-800"
                >
                    Create New Link
                </button>
            </div>
        </div>
    );
}
