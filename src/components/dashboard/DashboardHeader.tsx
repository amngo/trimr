interface DashboardHeaderProps {
    onCreateLink: () => void;
}

export default function DashboardHeader({
    onCreateLink,
}: DashboardHeaderProps) {
    return (
        <div className="bg-card border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-foreground">
                        Your Links
                    </h1>
                    <p className="text-sm">
                        Manage your shortened links and track their performance.
                    </p>
                </div>
                <button onClick={onCreateLink} className="btn btn-neutral">
                    Create New Link
                </button>
            </div>
        </div>
    );
}
