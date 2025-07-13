import { NextRequest } from 'next/server';
import { GET, POST } from '../route';
import { db } from '@/lib/db';
import { createLink } from '@/app/actions';
import { getCurrentUser } from '@/lib/auth-utils';
import { handleApiError, createApiResponse } from '@/lib/api-utils';

// Mock NextResponse
jest.mock('next/server', () => ({
    ...jest.requireActual('next/server'),
    NextResponse: {
        json: (data: unknown, init?: { status?: number }) => ({
            json: async () => data,
            status: init?.status || 200,
        }),
    },
}));

// Mock dependencies
jest.mock('@/lib/db', () => ({
    db: {
        link: {
            findMany: jest.fn(),
        },
    },
}));

jest.mock('@/app/actions', () => ({
    createLink: jest.fn(),
}));

jest.mock('@/lib/auth-utils', () => ({
    getCurrentUser: jest.fn(),
}));

// Mock the new api-utils
jest.mock('@/lib/api-utils', () => ({
    handleApiError: jest.fn(),
    createApiResponse: jest.fn(),
    HttpError: jest.fn().mockImplementation((message: string, statusCode?: number, code?: string) => {
        const error = new Error(message) as Error & { statusCode?: number; code?: string };
        error.statusCode = statusCode;
        error.code = code;
        return error;
    }),
}));

// Mock console.error to avoid noise in tests
const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

describe('/api/links', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        
        // Setup default mock implementations
        (createApiResponse as jest.Mock).mockImplementation((data, status = 200) => ({
            json: async () => data,
            status,
        }));
        
        (handleApiError as jest.Mock).mockImplementation((error) => {
            if (error.statusCode === 401) {
                return {
                    json: async () => ({ error: error.message, code: error.code }),
                    status: 401,
                };
            }
            return {
                json: async () => ({ error: 'An unexpected error occurred' }),
                status: 500,
            };
        });
    });

    afterAll(() => {
        consoleSpy.mockRestore();
    });

    describe('GET', () => {
        it('should return links for authenticated user', async () => {
            const mockUser = { id: 'user123' };
            const mockLinks = [
                {
                    id: '1',
                    slug: 'test1',
                    url: 'https://example.com',
                    userId: 'user123',
                },
                {
                    id: '2',
                    slug: 'test2',
                    url: 'https://google.com',
                    userId: 'user123',
                },
            ];

            (getCurrentUser as jest.Mock).mockResolvedValue(mockUser);
            (db.link.findMany as jest.Mock).mockResolvedValue(mockLinks);

            const response = await GET();
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toEqual(mockLinks);
            expect(db.link.findMany).toHaveBeenCalledWith({
                where: { userId: 'user123' },
                orderBy: { createdAt: 'desc' },
                take: 50,
            });
        });

        it('should return 401 for unauthenticated user', async () => {
            (getCurrentUser as jest.Mock).mockResolvedValue(null);

            const response = await GET();
            const data = await response.json();

            expect(response.status).toBe(401);
            expect(data).toEqual({ error: 'Authentication required', code: 'UNAUTHORIZED' });
            expect(db.link.findMany).not.toHaveBeenCalled();
        });

        it('should handle database errors', async () => {
            const mockUser = { id: 'user123' };
            (getCurrentUser as jest.Mock).mockResolvedValue(mockUser);
            (db.link.findMany as jest.Mock).mockRejectedValue(
                new Error('Database error')
            );

            const response = await GET();
            const data = await response.json();

            expect(response.status).toBe(500);
            expect(data).toEqual({ error: 'An unexpected error occurred' });
            expect(handleApiError).toHaveBeenCalledWith(
                expect.any(Error),
                'GET /api/links'
            );
        });

        it('should handle auth errors', async () => {
            (getCurrentUser as jest.Mock).mockRejectedValue(
                new Error('Auth error')
            );

            const response = await GET();
            const data = await response.json();

            expect(response.status).toBe(500);
            expect(data).toEqual({ error: 'An unexpected error occurred' });
        });
    });

    describe('POST', () => {
        it('should create a new link successfully', async () => {
            const mockResult = {
                id: '123',
                slug: 'test-link',
                url: 'https://example.com',
                success: true,
            };

            (createLink as jest.Mock).mockResolvedValue(mockResult);

            const formData = new FormData();
            formData.append('url', 'https://example.com');
            formData.append('slug', 'test-link');

            const request = new NextRequest('http://localhost:3000/api/links', {
                method: 'POST',
                body: formData,
            });

            const response = await POST(request);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toEqual(mockResult);
            expect(createLink).toHaveBeenCalledWith(expect.any(FormData));
        });

        it('should return 400 for createLink errors', async () => {
            const mockResult = {
                error: 'Invalid URL provided',
            };

            (createLink as jest.Mock).mockResolvedValue(mockResult);
            
            // Update handleApiError mock for this specific test
            (handleApiError as jest.Mock).mockImplementationOnce((error) => ({
                json: async () => ({ error: error.message, code: error.code }),
                status: 400,
            }));

            const formData = new FormData();
            formData.append('url', 'invalid-url');

            const request = new NextRequest('http://localhost:3000/api/links', {
                method: 'POST',
                body: formData,
            });

            const response = await POST(request);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data).toEqual({ error: 'Invalid URL provided', code: 'VALIDATION_ERROR' });
        });

        it('should handle createLink exceptions', async () => {
            (createLink as jest.Mock).mockRejectedValue(
                new Error('Server error')
            );

            const formData = new FormData();
            formData.append('url', 'https://example.com');

            const request = new NextRequest('http://localhost:3000/api/links', {
                method: 'POST',
                body: formData,
            });

            const response = await POST(request);
            const data = await response.json();

            expect(response.status).toBe(500);
            expect(data).toEqual({ error: 'An unexpected error occurred' });
            expect(handleApiError).toHaveBeenCalledWith(
                expect.any(Error),
                'POST /api/links'
            );
        });

        it('should handle malformed request body', async () => {
            const request = new NextRequest('http://localhost:3000/api/links', {
                method: 'POST',
                body: 'invalid-body',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const response = await POST(request);
            const data = await response.json();

            expect(response.status).toBe(500);
            expect(data).toEqual({ error: 'An unexpected error occurred' });
        });
    });
});
