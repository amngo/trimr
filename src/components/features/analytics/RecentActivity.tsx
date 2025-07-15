'use client';

import { ChartBarIcon } from 'lucide-react';
import Link from 'next/link';

interface RecentActivityItem {
    id: string;
    timestamp: Date;
    country: string | null;
    linkName: string;
    linkSlug: string;
}

interface RecentActivityProps {
    activities: RecentActivityItem[];
}

const getCountryFlag = (country: string | null): string => {
    if (!country) return '🌍';

    const countryFlags: Record<string, string> = {
        'United States': '🇺🇸',
        Canada: '🇨🇦',
        'United Kingdom': '🇬🇧',
        Germany: '🇩🇪',
        France: '🇫🇷',
        Spain: '🇪🇸',
        Italy: '🇮🇹',
        Netherlands: '🇳🇱',
        Sweden: '🇸🇪',
        Norway: '🇳🇴',
        Denmark: '🇩🇰',
        Finland: '🇫🇮',
        Australia: '🇦🇺',
        Japan: '🇯🇵',
        'South Korea': '🇰🇷',
        China: '🇨🇳',
        India: '🇮🇳',
        Brazil: '🇧🇷',
        Mexico: '🇲🇽',
        Argentina: '🇦🇷',
        Russia: '🇷🇺',
        Poland: '🇵🇱',
    };

    return countryFlags[country] || '🌍';
};

const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
        return `${diffInSeconds}s ago`;
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes}m ago`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours}h ago`;
    } else {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days}d ago`;
    }
};

export function RecentActivity({ activities }: RecentActivityProps) {
    if (activities.length === 0) {
        return (
            <div className="card bg-base-100 border border-base-300">
                <div className="card-body">
                    <h2 className="card-title">Recent Activity</h2>
                    <div className="text-center py-8 text-base-content/60">
                        <svg
                            className="w-16 h-16 mx-auto mb-4 opacity-50"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <p>No recent activity</p>
                        <p className="text-sm">
                            Recent clicks on your links will appear here
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="card bg-base-100 border border-base-300">
            <div className="card-body">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="card-title">Recent Activity</h2>
                    <div className="text-sm text-base-content/60">
                        Last {activities.length} clicks
                    </div>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                    {activities.map((activity) => (
                        <div
                            key={activity.id}
                            className="flex items-center justify-between p-3 bg-base-300 rounded-lg hover:bg-base-300/80 transition-colors"
                        >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="flex-shrink-0">
                                    <span className="text-lg">
                                        {getCountryFlag(activity.country)}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-base-content truncate">
                                            {activity.linkName}
                                        </span>
                                        <Link
                                            href={`/stats/${activity.linkSlug}`}
                                            className="text-primary hover:text-primary-focus text-sm font-medium"
                                        >
                                            /{activity.linkSlug}
                                        </Link>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-base-content/60">
                                        <span>
                                            {activity.country || 'Unknown'}
                                        </span>
                                        <span>•</span>
                                        <span>
                                            {formatTimeAgo(activity.timestamp)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-shrink-0">
                                <Link
                                    href={`/stats/${activity.linkSlug}`}
                                    className="btn btn-sm btn-ghost"
                                >
                                    <ChartBarIcon size={16} />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {activities.length >= 50 && (
                    <div className="text-center mt-4">
                        <div className="text-sm text-base-content/60">
                            Showing latest 50 activities
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
