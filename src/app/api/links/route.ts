import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { createLink } from '@/app/actions';
import { getCurrentUser } from '@/lib/auth-utils';
import { handleApiError, createApiResponse, HttpError } from '@/lib/api-utils';

/**
 * @swagger
 * /api/links:
 *   get:
 *     summary: Get user's links
 *     description: Retrieve all links for the authenticated user
 *     tags:
 *       - Links
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved links
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Link'
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

/**
 * @swagger
 * /api/links:
 *   post:
 *     summary: Create a new link
 *     description: Create a new shortened link for the authenticated user
 *     tags:
 *       - Links
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Display name for the link
 *               url:
 *                 type: string
 *                 format: uri
 *                 description: Original URL to redirect to
 *               slug:
 *                 type: string
 *                 description: Custom slug for the short link (optional)
 *               enabled:
 *                 type: boolean
 *                 description: Whether the link is active
 *               expiresAt:
 *                 type: string
 *                 format: date-time
 *                 description: When the link expires (optional)
 *               startsAt:
 *                 type: string
 *                 format: date-time
 *                 description: When the link becomes active (optional)
 *             required:
 *               - name
 *               - url
 *     responses:
 *       201:
 *         description: Link created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Link'
 *       400:
 *         description: Validation error
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
