import Link from 'next/link';

export default function StatsHeader() {
    return (
        <div className="bg-card border-gray-200 pt-4 pb-8">
            <div className="breadcrumbs text-sm mb-4">
                <ul>
                    <li>
                        <Link href="/">Home</Link>
                    </li>
                    <li>
                        <Link href="/dashboard">Stats</Link>
                    </li>
                </ul>
            </div>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-foreground">
                        Analytics Overview
                    </h1>
                    <p className="text-sm">
                        Comprehensive overview of all your links&apos;
                        performance
                    </p>
                </div>
            </div>
        </div>
    );
}
