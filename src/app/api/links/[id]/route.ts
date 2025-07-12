import { NextRequest, NextResponse } from 'next/server';
import { deleteLink } from '@/app/actions';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth-utils';

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const result = await deleteLink(id);

        if (result.error) {
            return NextResponse.json({ error: result.error }, { status: 400 });
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error deleting link:', error);
        return NextResponse.json(
            { error: 'Failed to delete link' },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { enabled } = await request.json();

        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check if user owns this link
        const link = await db.link.findUnique({
            where: { id },
            select: { userId: true }
        });

        if (!link) {
            return NextResponse.json({ error: 'Link not found' }, { status: 404 });
        }

        if (link.userId !== user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Update the link
        const updatedLink = await db.link.update({
            where: { id },
            data: { enabled },
        });

        return NextResponse.json({ success: true, enabled: updatedLink.enabled });
    } catch (error) {
        console.error('Error updating link:', error);
        return NextResponse.json(
            { error: 'Failed to update link' },
            { status: 500 }
        );
    }
}