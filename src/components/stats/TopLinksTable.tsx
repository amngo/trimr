'use client';

import { ChartBarIcon, ExternalLinkIcon } from 'lucide-react';
import Link from 'next/link';

interface TopLink {
    id: string;
    name: string;
    slug: string;
    url: string;
    clicks: number;
    visitors: number;
    ctr: string;
}

interface TopLinksTableProps {
    links: TopLink[];
}

export function TopLinksTable({ links }: TopLinksTableProps) {
    if (links.length === 0) {
        return (
            <div className="card bg-base-100 border border-base-300">
                <div className="card-body">
                    <h2 className="card-title">Top Performing Links</h2>
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
                                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                            />
                        </svg>
                        <p>No clicks recorded yet</p>
                        <p className="text-sm">
                            Create some links and start sharing them to see
                            analytics here
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="card bg-base-100 border border-base-300">
            <div className="card-body">
                <h2 className="card-title mb-4">Top Performing Links</h2>
                <div className="overflow-x-auto">
                    <table className="table table-zebra">
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Link</th>
                                <th>Destination</th>
                                <th>Clicks</th>
                                <th>Visitors</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {links.map((link, index) => (
                                <tr key={link.id}>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <span className="badge badge-neutral">
                                                #{index + 1}
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex flex-col">
                                            <div className="font-semibold text-base-content">
                                                {link.name}
                                            </div>
                                            <div className="text-sm text-base-content/60">
                                                /{link.slug}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="text-sm text-base-content/80 max-w-xs truncate">
                                            {link.url}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold">
                                                {link.clicks.toLocaleString()}
                                            </span>
                                            <div className="badge badge-success badge-sm">
                                                {link.clicks > 0
                                                    ? '100%'
                                                    : '0%'}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="font-semibold">
                                            {link.visitors.toLocaleString()}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex gap-2">
                                            <Link
                                                href={`/stats/${link.slug}`}
                                                className="btn btn-sm btn-ghost"
                                            >
                                                <ChartBarIcon size={16} />
                                                Details
                                            </Link>
                                            <a
                                                href={`/${link.slug}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-sm btn-ghost"
                                            >
                                                <ExternalLinkIcon size={16} />
                                                Visit
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
