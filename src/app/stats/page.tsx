import { Suspense } from 'react';
import { getCurrentUser } from '@/lib/auth-utils';
import { redirect } from 'next/navigation';
import { StatsOverview } from '@/components/stats/StatsOverview';
import Header from '@/components/ui/Header';
import StatsHeader from '@/components/stats/StatsHeader';

export default async function StatsPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect('/auth');
    }

    return (
        <div className="min-h-screen bg-base-200">
            <Header />
            <StatsHeader />

            <Suspense
                fallback={
                    <div className="flex items-center justify-center py-12">
                        <span className="loading loading-spinner loading-lg"></span>
                    </div>
                }
            >
                <StatsOverview userId={user.id} />
            </Suspense>
        </div>
    );
}
