import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-utils';
import { db } from '@/lib/db';
import { logger } from '@/utils/logger';

/**
 * @swagger
 * /api/analytics/overview:
 *   get:
 *     summary: Get analytics overview
 *     description: Retrieve comprehensive analytics data for the authenticated user's links
 *     tags:
 *       - Analytics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved analytics overview
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AnalyticsOverview'
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function GET() {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 },
            );
        }

        const [links, recentClicks] = await Promise.all([
            // Get all user links with aggregated stats
            db.link.findMany({
                where: { userId: user.id },
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    url: true,
                    clickCount: true,
                    visitorCount: true,
                    enabled: true,
                    createdAt: true,
                    expiresAt: true,
                    startsAt: true,
                    _count: {
                        select: {
                            clicks: true,
                        },
                    },
                },
                orderBy: { clickCount: 'desc' },
            }),

            // Get recent clicks across all user links for time series data
            db.click.findMany({
                where: {
                    link: {
                        userId: user.id,
                    },
                },
                select: {
                    id: true,
                    timestamp: true,
                    country: true,
                    linkId: true,
                    link: {
                        select: {
                            name: true,
                            slug: true,
                        },
                    },
                },
                orderBy: { timestamp: 'desc' },
                take: 1000, // Limit for performance
            }),
        ]);

        // Calculate overview statistics
        const totalLinks = links.length;
        const activeLinks = links.filter((link) => link.enabled).length;
        const inactiveLinks = totalLinks - activeLinks;
        const totalClicks = links.reduce(
            (sum, link) => sum + link.clickCount,
            0,
        );
        const totalVisitors = links.reduce(
            (sum, link) => sum + link.visitorCount,
            0,
        );

        // Expired links
        const now = new Date();
        const expiredLinks = links.filter(
            (link) => link.expiresAt && link.expiresAt < now,
        ).length;

        // Links not started yet
        const pendingLinks = links.filter(
            (link) => link.startsAt && link.startsAt > now,
        ).length;

        // Top performing links
        const topLinks = links
            .filter((link) => link.clickCount > 0)
            .slice(0, 10)
            .map((link) => ({
                id: link.id,
                name: link.name,
                slug: link.slug,
                url: link.url,
                clicks: link.clickCount,
                visitors: link.visitorCount,
                ctr:
                    link.visitorCount > 0
                        ? (link.clickCount / link.visitorCount).toFixed(2)
                        : '0',
            }));

        // Country distribution
        const countryStats = recentClicks
            .filter((click) => click.country)
            .reduce(
                (acc, click) => {
                    const country = click.country!;
                    acc[country] = (acc[country] || 0) + 1;
                    return acc;
                },
                {} as Record<string, number>,
            );

        const topCountries = Object.entries(countryStats)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10)
            .map(([country, clicks]) => ({
                country,
                clicks,
                percentage: ((clicks / recentClicks.length) * 100).toFixed(1),
            }));

        // Daily activity for last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentClicksFiltered = recentClicks.filter(
            (click) => click.timestamp >= thirtyDaysAgo,
        );

        const dailyActivity = [];
        for (let i = 29; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            const dayClicks = recentClicksFiltered.filter((click) => {
                const clickDate = click.timestamp.toISOString().split('T')[0];
                return clickDate === dateStr;
            }).length;

            dailyActivity.push({
                date: dateStr,
                clicks: dayClicks,
            });
        }

        // Recent activity
        const recentActivity = recentClicks.slice(0, 50).map((click) => ({
            id: click.id,
            timestamp: click.timestamp,
            country: click.country,
            linkName: click.link.name,
            linkSlug: click.link.slug,
        }));

        const overview = {
            summary: {
                totalLinks,
                activeLinks,
                inactiveLinks,
                expiredLinks,
                pendingLinks,
                totalClicks,
                totalVisitors,
                averageClicksPerLink:
                    totalLinks > 0
                        ? (totalClicks / totalLinks).toFixed(1)
                        : '0',
            },
            topLinks,
            topCountries,
            dailyActivity,
            recentActivity,
        };

        return NextResponse.json(overview);
    } catch (error) {
        logger.error('Analytics overview error', error);
        return NextResponse.json(
            { error: 'Failed to fetch analytics overview' },
            { status: 500 },
        );
    }
}
