'use client';

import { useState, useEffect } from 'react';
import { StatsCards } from '@/components/stats/StatsCards';
import { TopLinksTable } from '@/components/stats/TopLinksTable';
import { CountryDistribution } from '@/components/stats/CountryDistribution';
import { ActivityChart } from '@/components/stats/ActivityChart';
import { RecentActivity } from '@/components/stats/RecentActivity';

interface ExampleOverviewData {
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

export function ExampleStatsOverview() {
    const [data, setData] = useState<ExampleOverviewData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading delay
        const timer = setTimeout(() => {
            // Generate comprehensive mock data
            const mockData: ExampleOverviewData = {
                summary: {
                    totalLinks: 42,
                    activeLinks: 35,
                    inactiveLinks: 5,
                    expiredLinks: 2,
                    pendingLinks: 3,
                    totalClicks: 15487,
                    totalVisitors: 9234,
                    averageClicksPerLink: '369.2',
                },
                topLinks: [
                    {
                        id: 'example-1',
                        name: 'Product Landing Page',
                        slug: 'product-landing',
                        url: 'https://example.com/product',
                        clicks: 2847,
                        visitors: 1923,
                        ctr: '67.5%',
                    },
                    {
                        id: 'example-2',
                        name: 'Blog Post: Getting Started',
                        slug: 'blog-getting-started',
                        url: 'https://example.com/blog/getting-started',
                        clicks: 1956,
                        visitors: 1456,
                        ctr: '74.4%',
                    },
                    {
                        id: 'example-3',
                        name: 'Documentation Hub',
                        slug: 'docs-hub',
                        url: 'https://example.com/docs',
                        clicks: 1543,
                        visitors: 1102,
                        ctr: '71.4%',
                    },
                    {
                        id: 'example-4',
                        name: 'Contact Form',
                        slug: 'contact',
                        url: 'https://example.com/contact',
                        clicks: 876,
                        visitors: 654,
                        ctr: '74.7%',
                    },
                    {
                        id: 'example-5',
                        name: 'Pricing Page',
                        slug: 'pricing',
                        url: 'https://example.com/pricing',
                        clicks: 734,
                        visitors: 523,
                        ctr: '71.3%',
                    },
                ],
                topCountries: [
                    {
                        country: 'United States',
                        clicks: 4847,
                        percentage: '31.3',
                    },
                    {
                        country: 'United Kingdom',
                        clicks: 2134,
                        percentage: '13.8',
                    },
                    { country: 'Canada', clicks: 1876, percentage: '12.1' },
                    { country: 'Germany', clicks: 1543, percentage: '10.0' },
                    { country: 'France', clicks: 1234, percentage: '8.0' },
                    { country: 'Australia', clicks: 987, percentage: '6.4' },
                    { country: 'Netherlands', clicks: 876, percentage: '5.7' },
                    { country: 'Sweden', clicks: 765, percentage: '4.9' },
                    { country: 'Japan', clicks: 654, percentage: '4.2' },
                    { country: 'Other', clicks: 571, percentage: '3.7' },
                ],
                dailyActivity: Array.from({ length: 30 }, (_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() - (29 - i));
                    return {
                        date: date.toISOString().split('T')[0],
                        clicks: Math.floor(Math.random() * 800) + 200, // Random clicks between 200-1000
                    };
                }),
                recentActivity: Array.from({ length: 20 }, (_, i) => ({
                    id: `activity-${i}`,
                    timestamp: new Date(Date.now() - i * 15 * 60 * 1000), // Every 15 minutes
                    country: [
                        'United States',
                        'United Kingdom',
                        'Canada',
                        'Germany',
                        'France',
                        'Australia',
                        null,
                    ][i % 7],
                    linkName: [
                        'Product Landing Page',
                        'Blog Post: Getting Started',
                        'Documentation Hub',
                        'Contact Form',
                        'Pricing Page',
                        'About Us',
                        'Features Overview',
                    ][i % 7],
                    linkSlug: [
                        'product-landing',
                        'blog-getting-started',
                        'docs-hub',
                        'contact',
                        'pricing',
                        'about',
                        'features',
                    ][i % 7],
                })),
            };

            setData(mockData);
            setIsLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <div className="space-y-4">
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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

    if (!data) {
        return (
            <div className="alert alert-error">
                <span>Failed to load example analytics data.</span>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <StatsCards summary={data.summary} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <ActivityChart dailyActivity={data.dailyActivity} />
                <CountryDistribution countries={data.topCountries} />
            </div>

            <TopLinksTable links={data.topLinks} />
            <RecentActivity activities={data.recentActivity} />
        </div>
    );
}
