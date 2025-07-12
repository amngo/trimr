'use client';

interface FormActionsProps {
    isLoading: boolean;
    url: string;
    onCancel: () => void;
}

export default function FormActions({
    isLoading,
    url,
    onCancel,
}: FormActionsProps) {
    return (
        <div className="flex items-center justify-end space-x-3 pt-4">
            <button
                onClick={onCancel}
                className="btn btn-ghost"
                disabled={isLoading}
            >
                Cancel
            </button>
            <button
                type="submit"
                className="btn btn-neutral"
                disabled={isLoading || !url}
            >
                {isLoading ? 'Creating...' : 'Create New Link'}
            </button>
        </div>
    );
}
