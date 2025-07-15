'use server';

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-utils';
import { db } from '@/lib/db';
import { logger } from '@/utils/logger';

/**
 * @swagger
 * /api/links/bulk-delete:
 *   post:
 *     summary: Bulk delete links
 *     description: Delete multiple links at once for the authenticated user
 *     tags:
 *       - Links
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               linkIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of link IDs to delete
 *                 maxItems: 100
 *                 minItems: 1
 *             required:
 *               - linkIds
 *     responses:
 *       200:
 *         description: Links deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Successfully deleted 5 links"
 *                 deletedCount:
 *                   type: integer
 *                   example: 5
 *                 deletedLinks:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       slug:
 *                         type: string
 *       400:
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
export async function POST(request: NextRequest) {
    try {
        // Check authentication
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json(
                {
                    error: 'Unauthorized',
                    message: 'Please log in to delete links',
                },
                { status: 401 },
            );
        }

        // Parse request body
        const body = await request.json();
        const { linkIds } = body as { linkIds: string[] };

        // Validate input
        if (!Array.isArray(linkIds) || linkIds.length === 0) {
            return NextResponse.json(
                {
                    error: 'Invalid input',
                    message: 'linkIds must be a non-empty array',
                },
                { status: 400 },
            );
        }

        if (linkIds.length > 100) {
            return NextResponse.json(
                {
                    error: 'Too many links',
                    message: 'Cannot delete more than 100 links at once',
                },
                { status: 400 },
            );
        }

        // Validate link IDs format
        const validLinkIds = linkIds.filter(
            (id) => typeof id === 'string' && id.length > 0,
        );
        if (validLinkIds.length !== linkIds.length) {
            return NextResponse.json(
                {
                    error: 'Invalid link IDs',
                    message: 'All link IDs must be valid strings',
                },
                { status: 400 },
            );
        }

        logger.info(
            `User ${user.id} attempting to delete ${validLinkIds.length} links`,
        );

        // Delete links belonging to the authenticated user
        const deletedLinks = await db.link.findMany({
            where: {
                userId: user.id,
                id: { in: validLinkIds },
            },
            select: { id: true, slug: true },
        });

        await db.link.deleteMany({
            where: {
                userId: user.id,
                id: { in: validLinkIds },
            },
        });

        logger.info(
            `Successfully deleted ${deletedLinks.length} links for user ${user.id}`,
        );

        return NextResponse.json({
            success: true,
            message: `Successfully deleted ${deletedLinks.length} link${deletedLinks.length === 1 ? '' : 's'}`,
            deletedCount: deletedLinks.length,
            deletedLinks: deletedLinks.map((link) => ({
                id: link.id,
                slug: link.slug,
            })),
        });
    } catch (error) {
        logger.error('Error in bulk delete API:', error);

        return NextResponse.json(
            {
                error: 'Internal server error',
                message: 'Failed to delete links',
            },
            { status: 500 },
        );
    }
}
