import { auth } from '@/lib/auth';

/**
 * @swagger
 * /api/auth/{...all}:
 *   get:
 *     summary: Authentication endpoints
 *     description: Handle authentication-related GET requests (login, logout, callback, etc.)
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: path
 *         name: all
 *         required: true
 *         schema:
 *           type: string
 *         description: Authentication action (login, logout, callback, etc.)
 *     responses:
 *       200:
 *         description: Authentication action completed successfully
 *       302:
 *         description: Redirect to appropriate page
 *       401:
 *         description: Authentication failed
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
 *   post:
 *     summary: Authentication endpoints
 *     description: Handle authentication-related POST requests (login, registration, etc.)
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: path
 *         name: all
 *         required: true
 *         schema:
 *           type: string
 *         description: Authentication action (login, register, etc.)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User email address
 *               password:
 *                 type: string
 *                 description: User password
 *               name:
 *                 type: string
 *                 description: User name (for registration)
 *     responses:
 *       200:
 *         description: Authentication successful
 *       400:
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Authentication failed
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
export const GET = auth.handler;
export const POST = auth.handler;
