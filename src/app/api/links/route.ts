import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createLink } from '@/app/actions';
import { getCurrentUser } from '@/lib/auth-utils';

export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        const links = await db.link.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });

        return NextResponse.json(links);
    } catch (error) {
        console.error('Error fetching links:', error);
        return NextResponse.json(
            { error: 'Failed to fetch links' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const result = await createLink(formData);

        if (result.error) {
            return NextResponse.json({ error: result.error }, { status: 400 });
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error creating link:', error);
        return NextResponse.json(
            { error: 'Failed to create link' },
            { status: 500 }
        );
    }
}