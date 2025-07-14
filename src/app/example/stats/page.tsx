import { Suspense } from 'react';
import { ExampleStatsOverview } from './ExampleStatsOverview';
import AppLayout from '@/components/layout/AppLayout';
import StatsHeader from '@/components/stats/StatsHeader';

export default function ExampleStatsPage() {
    return (
        <AppLayout>
            <StatsHeader />
            {/* <div className="mb-4 bg-info text-info-content p-4 rounded-box">
                <h2 className="font-semibold mb-2">📊 Example Analytics</h2>
                <p className="text-sm">
                    This is a demonstration of the analytics page with mock data.
                    All charts and statistics are simulated for demonstration purposes.
                </p>
            </div> */}

            <Suspense
                fallback={
                    <div className="flex items-center justify-center py-12">
                        <span className="loading loading-spinner loading-lg"></span>
                    </div>
                }
            >
                <ExampleStatsOverview />
            </Suspense>
        </AppLayout>
    );
}
