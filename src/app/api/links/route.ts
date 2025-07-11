import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createLink } from '@/app/actions';

export async function GET() {
    try {
        const links = await db.link.findMany({
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