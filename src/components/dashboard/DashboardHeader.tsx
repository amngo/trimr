interface DashboardHeaderProps {
    onCreateLink: () => void;
}

export default function DashboardHeader({
    onCreateLink,
}: DashboardHeaderProps) {
    return (
        <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Your Links
                    </h1>
                    <p className="text-sm text-gray-600">
                        Manage your shortened links and track their performance.
                    </p>
                </div>
                <button
                    onClick={onCreateLink}
                    className="bg-black text-white px-4 py-2 rounded text-sm font-medium"
                >
                    Create New Link
                </button>
            </div>
        </div>
    );
}
