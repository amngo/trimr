import { Suspense } from 'react';
import { getCurrentUser } from '@/lib/auth-utils';
import { StatsOverview, StatsHeader } from '@/components/features/analytics';
import { AppLayout } from '@/components/common';

export default async function StatsPage() {
    const user = await getCurrentUser();

    if (!user) {
        return null;
    }

    return (
        <AppLayout>
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
        </AppLayout>
    );
}
