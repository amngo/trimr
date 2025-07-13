import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { createLink } from '@/app/actions';
import { getCurrentUser } from '@/lib/auth-utils';
import { handleApiError, createApiResponse, HttpError } from '@/lib/api-utils';

export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!user) {
            throw new HttpError('Authentication required', 401, 'UNAUTHORIZED');
        }

        const links = await db.link.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });

        return createApiResponse(links);
    } catch (error) {
        return handleApiError(error, 'GET /api/links');
    }
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const result = await createLink(formData);

        if (result.error) {
            throw new HttpError(result.error, 400, 'VALIDATION_ERROR');
        }

        return createApiResponse(result);
    } catch (error) {
        return handleApiError(error, 'POST /api/links');
    }
}