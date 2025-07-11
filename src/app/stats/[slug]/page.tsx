import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth-utils';
import { Eye, Globe, Calendar, TrendingUp, Users, Clock } from 'lucide-react';

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function StatsPage({ params }: PageProps) {
    const { slug } = await params;
    
    // Check if user is authenticated
    const user = await getCurrentUser();
    if (!user) {
        notFound();
    }

    const link = await db.link.findUnique({
        where: { slug },
        include: {
            clicks: {
                orderBy: { timestamp: 'desc' },
                take: 100, // Only get the last 100 clicks for performance
            },
        },
    });

    if (!link) {
        notFound();
    }

    // Check if user owns this link
    if (link.userId !== user.id) {
        notFound();
    }

    // Calculate stats - use clickCount for total (efficient), clicks array for detailed analytics
    const totalClicks = link.clickCount;
    const uniqueCountries = new Set(
        link.clicks.map((click) => click.country).filter(Boolean)
    ).size;
    const recentClicks = link.clicks.slice(0, 10);

    // Country stats
    const countryStats = link.clicks.reduce((acc, click) => {
        if (click.country) {
            acc[click.country] = (acc[click.country] || 0) + 1;
        }
        return acc;
    }, {} as Record<string, number>);

    const topCountries = Object.entries(countryStats)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);

    // Daily stats (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toDateString();
    }).reverse();

    const dailyStats = last7Days.map((date) => {
        const dayClicks = link.clicks.filter(
            (click) => click.timestamp.toDateString() === date
        ).length;
        return {
            date: new Date(date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
            }),
            clicks: dayClicks,
        };
    });

    return (
        <div className="container mx-auto max-w-7xl">
            {/* Header */}
            <div className="mb-8">
                <div className="breadcrumbs text-sm mb-4">
                    <ul>
                        <li>
                            <Link href="/">Home</Link>
                        </li>
                        <li>
                            <Link href="/dashboard">Dashboard</Link>
                        </li>
                        <li>Analytics</li>
                    </ul>
                </div>
                <h1 className="text-4xl font-bold mb-2">
                    Analytics for <span className="text-primary">/{slug}</span>
                </h1>
                <p className="text-base-content/70 break-all text-lg">
                    {link.url}
                </p>
            </div>

            {/* Overview Stats */}
            <div className="stats stats-vertical lg:stats-horizontal shadow w-full mb-8 bg-base-100">
                <div className="stat">
                    <div className="stat-figure text-primary">
                        <Eye size={32} />
                    </div>
                    <div className="stat-title">Total Clicks</div>
                    <div className="stat-value text-primary">{totalClicks}</div>
                    <div className="stat-desc">All time views</div>
                </div>

                <div className="stat">
                    <div className="stat-figure text-secondary">
                        <Globe size={32} />
                    </div>
                    <div className="stat-title">Countries</div>
                    <div className="stat-value text-secondary">
                        {uniqueCountries}
                    </div>
                    <div className="stat-desc">Unique locations</div>
                </div>

                <div className="stat">
                    <div className="stat-figure text-accent">
                        <Calendar size={32} />
                    </div>
                    <div className="stat-title">Created</div>
                    <div className="stat-value text-accent text-2xl">
                        {link.createdAt.toLocaleDateString()}
                    </div>
                    <div className="stat-desc">
                        {Math.floor(
                            (Date.now() - link.createdAt.getTime()) /
                                (1000 * 60 * 60 * 24)
                        )}{' '}
                        days ago
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Daily Activity */}
                <div className="card bg-base-100 shadow-lg">
                    <div className="card-body">
                        <h2 className="card-title text-2xl mb-4">
                            <TrendingUp className="w-6 h-6" />
                            Daily Activity
                        </h2>
                        <p className="text-base-content/70 mb-4">Last 7 days</p>
                        <div className="space-y-4">
                            {dailyStats.map((day, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between"
                                >
                                    <span className="text-sm font-medium w-16">
                                        {day.date}
                                    </span>
                                    <div className="flex items-center space-x-3 flex-1">
                                        <progress
                                            className="progress progress-primary w-full"
                                            value={day.clicks}
                                            max={
                                                Math.max(
                                                    ...dailyStats.map(
                                                        (d) => d.clicks
                                                    )
                                                ) || 1
                                            }
                                        />
                                        <span className="text-sm font-bold w-8 text-right badge badge-primary">
                                            {day.clicks}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Top Countries */}
                <div className="card bg-base-100 shadow-lg">
                    <div className="card-body">
                        <h2 className="card-title text-2xl mb-4">
                            <Globe className="w-6 h-6" />
                            Top Countries
                        </h2>
                        {topCountries.length > 0 ? (
                            <div className="space-y-4">
                                {topCountries.map(([country, count], index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <div
                                                className={`badge badge-lg ${
                                                    index === 0
                                                        ? 'badge-primary'
                                                        : index === 1
                                                        ? 'badge-secondary'
                                                        : index === 2
                                                        ? 'badge-accent'
                                                        : 'badge-neutral'
                                                }`}
                                            >
                                                {index + 1}
                                            </div>
                                            <span className="font-medium">
                                                {country}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <progress
                                                className="progress progress-secondary w-20"
                                                value={count}
                                                max={totalClicks || 1}
                                            />
                                            <span className="text-sm font-bold w-8 text-right badge badge-secondary">
                                                {count}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Users className="w-12 h-12 mx-auto text-base-content/30 mb-4" />
                                <p className="text-base-content/70">
                                    No country data available yet
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Clicks */}
            <div className="card bg-base-100 shadow-lg mt-8">
                <div className="card-body">
                    <h2 className="card-title text-2xl mb-4">
                        <Clock className="w-6 h-6" />
                        Recent Clicks
                    </h2>
                    {recentClicks.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="table table-zebra">
                                <thead>
                                    <tr>
                                        <th className="text-left">Time</th>
                                        <th className="text-left">Country</th>
                                        <th className="text-left">
                                            User Agent
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentClicks.map((click, index) => (
                                        <tr key={index} className="hover">
                                            <td className="font-mono text-sm">
                                                {click.timestamp.toLocaleString()}
                                            </td>
                                            <td>
                                                <div className="flex items-center space-x-2">
                                                    <span className="badge badge-outline">
                                                        {click.country ||
                                                            'Unknown'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="max-w-xs">
                                                <div
                                                    className="truncate text-sm"
                                                    title={
                                                        click.userAgent ||
                                                        'Unknown'
                                                    }
                                                >
                                                    {click.userAgent ||
                                                        'Unknown'}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Clock className="w-12 h-12 mx-auto text-base-content/30 mb-4" />
                            <p className="text-base-content/70 mb-4">
                                No clicks yet
                            </p>
                            <p className="text-sm text-base-content/50">
                                Share your link to start tracking clicks!
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="mt-8 text-center">
                <Link href="/dashboard" className="btn btn-outline">
                    Back to Dashboard
                </Link>
            </div>
        </div>
    );
}
