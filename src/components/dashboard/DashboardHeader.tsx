import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui';

interface DashboardHeaderProps {
    onCreateLink: () => void;
    onBulkUpload: () => void;
}

export default function DashboardHeader({
    onCreateLink,
}: // onBulkUpload,
DashboardHeaderProps) {
    return (
        <div className="bg-card border-gray-200 pb-4">
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
                <div className="flex items-center gap-2">
                    {/* <ThemeToggle /> */}
                    {/* <Button
                        variant="outline"
                        onClick={onBulkUpload}
                        className="gap-2"
                    >
                        <Upload size={16} />
                        Bulk Upload
                    </Button> */}
                    <Button
                        variant="primary"
                        onClick={onCreateLink}
                        className="gap-2"
                    >
                        <Plus size={16} />
                        Create Link
                    </Button>
                </div>
            </div>
        </div>
    );
}
