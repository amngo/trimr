import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { logger } from '@/utils/logger';

export async function POST(request: NextRequest) {
    try {
        const { id, password } = await request.json();

        if (!password) {
            return NextResponse.json(
                { error: 'Password is required' },
                { status: 400 },
            );
        }

        // Find the link
        const link = await db.link.findUnique({
            where: { slug: id },
            select: { id: true, password: true, enabled: true },
        });

        if (!link) {
            return NextResponse.json(
                { error: 'Link not found' },
                { status: 404 },
            );
        }

        if (!link.enabled) {
            return NextResponse.json(
                { error: 'Link is disabled' },
                { status: 403 },
            );
        }

        if (!link.password) {
            return NextResponse.json(
                { error: 'This link is not password protected' },
                { status: 400 },
            );
        }

        // Check password (simple string comparison for now)
        if (password !== link.password) {
            return NextResponse.json(
                { error: 'Incorrect password' },
                { status: 401 },
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        logger.error('Error verifying password', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 },
        );
    }
}
