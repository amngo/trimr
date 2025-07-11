'use client';

interface FormActionsProps {
    isLoading: boolean;
    url: string;
    onCancel: () => void;
}

export default function FormActions({ isLoading, url, onCancel }: FormActionsProps) {
    return (
        <div className="flex items-center justify-end space-x-3 pt-4">
            <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={isLoading}
            >
                Cancel
            </button>
            <button
                type="submit"
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading || !url}
            >
                {isLoading ? 'Creating...' : 'Create New Link'}
            </button>
        </div>
    );
}