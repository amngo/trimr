import { NextRequest, NextResponse } from 'next/server';
import { deleteLink } from '@/app/actions';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth-utils';
import { z } from 'zod';
import { logger } from '@/utils/logger';

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;
        const result = await deleteLink(id);

        if (result.error) {
            return NextResponse.json({ error: result.error }, { status: 400 });
        }

        return NextResponse.json(result);
    } catch (error) {
        logger.error('Error deleting link', error);
        return NextResponse.json(
            { error: 'Failed to delete link' },
            { status: 500 },
        );
    }
}

const updateLinkSchema = z.object({
    enabled: z.boolean().optional(),
    name: z
        .string()
        .max(28, 'Link name must be 28 characters or less')
        .optional(),
});

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;
        const body = await request.json();

        // Validate the request body
        const result = updateLinkSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { error: result.error.errors[0].message },
                { status: 400 },
            );
        }

        const { enabled, name } = result.data;

        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 },
            );
        }

        // Check if user owns this link
        const link = await db.link.findUnique({
            where: { id },
            select: { userId: true },
        });

        if (!link) {
            return NextResponse.json(
                { error: 'Link not found' },
                { status: 404 },
            );
        }

        if (link.userId !== user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Prepare update data - only include fields that are provided
        const updateData: { enabled?: boolean; name?: string | null } = {};
        if (enabled !== undefined) {
            updateData.enabled = enabled;
        }
        if (name !== undefined) {
            updateData.name = name || null;
        }

        // Update the link
        const updatedLink = await db.link.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json({
            success: true,
            enabled: updatedLink.enabled,
            name: updatedLink.name,
        });
    } catch (error) {
        logger.error('Error updating link', error);
        return NextResponse.json(
            { error: 'Failed to update link' },
            { status: 500 },
        );
    }
}
