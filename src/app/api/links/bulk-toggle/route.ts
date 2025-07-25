'use server';

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-utils';
import { db } from '@/lib/db';
import { logger } from '@/utils/logger';

export async function POST(request: NextRequest) {
    try {
        // Check authentication
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized', message: 'Please log in to toggle links' },
                { status: 401 }
            );
        }

        // Parse request body
        const body = await request.json();
        const { linkIds, enabled } = body as { linkIds: string[]; enabled: boolean };

        // Validate input
        if (!Array.isArray(linkIds) || linkIds.length === 0) {
            return NextResponse.json(
                { error: 'Invalid input', message: 'linkIds must be a non-empty array' },
                { status: 400 }
            );
        }

        if (typeof enabled !== 'boolean') {
            return NextResponse.json(
                { error: 'Invalid input', message: 'enabled must be a boolean value' },
                { status: 400 }
            );
        }

        if (linkIds.length > 100) {
            return NextResponse.json(
                { error: 'Too many links', message: 'Cannot toggle more than 100 links at once' },
                { status: 400 }
            );
        }

        // Validate link IDs format
        const validLinkIds = linkIds.filter(id => typeof id === 'string' && id.length > 0);
        if (validLinkIds.length !== linkIds.length) {
            return NextResponse.json(
                { error: 'Invalid link IDs', message: 'All link IDs must be valid strings' },
                { status: 400 }
            );
        }

        logger.info(`User ${user.id} attempting to ${enabled ? 'enable' : 'disable'} ${validLinkIds.length} links`);

        // Update links belonging to the authenticated user
        await db.link.updateMany({
            where: {
                userId: user.id,
                id: { in: validLinkIds }
            },
            data: { 
                enabled, 
                updatedAt: new Date() 
            }
        });

        // Get updated data
        const finalUpdatedLinks = await db.link.findMany({
            where: {
                userId: user.id,
                id: { in: validLinkIds }
            },
            select: { id: true, slug: true, enabled: true }
        });

        logger.info(`Successfully ${enabled ? 'enabled' : 'disabled'} ${finalUpdatedLinks.length} links for user ${user.id}`);

        return NextResponse.json({
            success: true,
            message: `Successfully ${enabled ? 'enabled' : 'disabled'} ${finalUpdatedLinks.length} link${finalUpdatedLinks.length === 1 ? '' : 's'}`,
            updatedCount: finalUpdatedLinks.length,
            updatedLinks: finalUpdatedLinks.map(link => ({ 
                id: link.id, 
                slug: link.slug, 
                enabled: link.enabled 
            }))
        });

    } catch (error) {
        logger.error('Error in bulk toggle API:', error);
        
        return NextResponse.json(
            { error: 'Internal server error', message: 'Failed to toggle links' },
            { status: 500 }
        );
    }
}