'use client';

import { useQuery } from '@tanstack/react-query';
import { StatsCards } from './StatsCards';
import { TopLinksTable } from './TopLinksTable';
import { CountryDistribution } from './CountryDistribution';
import { ActivityChart } from './ActivityChart';
import { RecentActivity } from './RecentActivity';

interface OverviewData {
    summary: {
        totalLinks: number;
        activeLinks: number;
        inactiveLinks: number;
        expiredLinks: number;
        pendingLinks: number;
        totalClicks: number;
        totalVisitors: number;
        averageClicksPerLink: string;
    };
    topLinks: Array<{
        id: string;
        name: string;
        slug: string;
        url: string;
        clicks: number;
        visitors: number;
        ctr: string;
    }>;
    topCountries: Array<{
        country: string;
        clicks: number;
        percentage: string;
    }>;
    dailyActivity: Array<{
        date: string;
        clicks: number;
    }>;
    recentActivity: Array<{
        id: string;
        timestamp: Date;
        country: string | null;
        linkName: string;
        linkSlug: string;
    }>;
}

async function fetchOverview(): Promise<OverviewData> {
    const response = await fetch('/api/analytics/overview');
    if (!response.ok) {
        throw new Error('Failed to fetch analytics overview');
    }
    const data = await response.json();

    // Convert timestamp strings back to Date objects
    data.recentActivity = data.recentActivity.map(
        (activity: { timestamp: string; [key: string]: unknown }) => ({
            ...activity,
            timestamp: new Date(activity.timestamp),
        }),
    );

    return data;
}

interface StatsOverviewProps {
    userId: string;
}

export function StatsOverview({ userId }: StatsOverviewProps) {
    const { data, isLoading, error } = useQuery({
        queryKey: ['analytics-overview', userId],
        queryFn: fetchOverview,
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
    });

    if (isLoading) {
        return (
            <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="stat bg-base-200 rounded-box">
                            <div className="stat-title">
                                <div className="skeleton h-4 w-20"></div>
                            </div>
                            <div className="stat-value">
                                <div className="skeleton h-8 w-16"></div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="card bg-base-200 shadow-sm">
                        <div className="card-body">
                            <div className="skeleton h-6 w-32 mb-4"></div>
                            <div className="skeleton h-64 w-full"></div>
                        </div>
                    </div>
                    <div className="card bg-base-200 shadow-sm">
                        <div className="card-body">
                            <div className="skeleton h-6 w-32 mb-4"></div>
                            <div className="skeleton h-64 w-full"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-error">
                <span>Failed to load analytics data. Please try again.</span>
            </div>
        );
    }

    if (!data) {
        return null;
    }

    return (
        <div className="space-y-8">
            <StatsCards summary={data.summary} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ActivityChart dailyActivity={data.dailyActivity} />
                <CountryDistribution countries={data.topCountries} />
            </div>

            <TopLinksTable links={data.topLinks} />
            <RecentActivity activities={data.recentActivity} />
        </div>
    );
}
