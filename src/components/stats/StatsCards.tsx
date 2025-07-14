'use client';

import { ClockIcon, EyeIcon, LinkIcon, UsersIcon } from 'lucide-react';

interface StatsSummary {
    totalLinks: number;
    activeLinks: number;
    inactiveLinks: number;
    expiredLinks: number;
    pendingLinks: number;
    totalClicks: number;
    totalVisitors: number;
    averageClicksPerLink: string;
}

interface StatsCardsProps {
    summary: StatsSummary;
}

export function StatsCards({ summary }: StatsCardsProps) {
    return (
        <div className="stats border border-base-300 w-full">
            <div className="stat bg-base-100">
                <LinkIcon className="stat-figure text-primary" />
                <div className="stat-title">Total Links</div>
                <div className="stat-value text-primary">
                    {summary.totalLinks}
                </div>
                <div className="stat-desc">
                    {summary.activeLinks} active, {summary.inactiveLinks}{' '}
                    inactive
                </div>
            </div>

            <div className="stat bg-base-100">
                <EyeIcon className="stat-figure text-success" />
                <div className="stat-title">Total Clicks</div>
                <div className="stat-value text-success">
                    {summary.totalClicks.toLocaleString()}
                </div>
                <div className="stat-desc">
                    Avg {summary.averageClicksPerLink} per link
                </div>
            </div>

            <div className="stat bg-base-100">
                <UsersIcon className="stat-figure text-info" />

                <div className="stat-title">Unique Visitors</div>
                <div className="stat-value text-info">
                    {summary.totalVisitors.toLocaleString()}
                </div>
                <div className="stat-desc">
                    {summary.totalVisitors > 0
                        ? (summary.totalClicks / summary.totalVisitors).toFixed(
                              1,
                          ) + ' clicks/visitor'
                        : 'No visitors yet'}
                </div>
            </div>

            <div className="stat bg-base-100">
                <ClockIcon className="stat-figure text-warning" />
                <div className="stat-title">Status</div>
                <div className="stat-value text-warning">
                    {summary.expiredLinks + summary.pendingLinks}
                </div>
                <div className="stat-desc">
                    {summary.expiredLinks} expired, {summary.pendingLinks}{' '}
                    pending
                </div>
            </div>
        </div>
    );
}
