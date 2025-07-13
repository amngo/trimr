import Link from 'next/link';

export default function DashboardHeader() {
    return (
        <div className="bg-card border-gray-200 py-4">
            <div className="breadcrumbs text-sm mb-4">
                <ul>
                    <li>
                        <Link href="/">Home</Link>
                    </li>
                    <li>
                        <Link href="/dashboard">Dashboard</Link>
                    </li>
                </ul>
            </div>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-foreground">
                        Your Links
                    </h1>
                    <p className="text-sm">
                        Manage your shortened links and track their performance.
                    </p>
                </div>
            </div>
        </div>
    );
}
