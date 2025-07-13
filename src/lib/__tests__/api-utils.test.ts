import { NextResponse } from 'next/server';
import { handleApiError, createApiResponse, createErrorResponse, HttpError } from '../api-utils';

// Mock logger
jest.mock('@/utils/logger', () => ({
    logger: {
        error: jest.fn(),
    },
}));

// Mock NextResponse
jest.mock('next/server', () => ({
    NextResponse: {
        json: jest.fn((data, init) => ({
            json: async () => data,
            status: init?.status || 200,
            data,
        })),
    },
}));

describe('api-utils', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('HttpError', () => {
        it('should create HttpError with message and status code', () => {
            const error = new HttpError('Test error', 400, 'TEST_CODE');
            
            expect(error.message).toBe('Test error');
            expect(error.statusCode).toBe(400);
            expect(error.code).toBe('TEST_CODE');
            expect(error.name).toBe('HttpError');
        });

        it('should default to status 500 when not provided', () => {
            const error = new HttpError('Test error');
            
            expect(error.statusCode).toBe(500);
            expect(error.code).toBeUndefined();
        });
    });

    describe('handleApiError', () => {
        it('should handle HttpError correctly', () => {
            const httpError = new HttpError('Custom error', 400, 'CUSTOM_CODE');
            
            handleApiError(httpError, 'test-context');
            
            expect(NextResponse.json).toHaveBeenCalledWith(
                { error: 'Custom error', code: 'CUSTOM_CODE' },
                { status: 400 }
            );
        });

        it('should handle regular Error correctly', () => {
            const regularError = new Error('Regular error');
            
            handleApiError(regularError, 'test-context');
            
            expect(NextResponse.json).toHaveBeenCalledWith(
                { error: 'An unexpected error occurred' },
                { status: 500 }
            );
        });

        it('should handle unknown error types', () => {
            const unknownError = 'string error';
            
            handleApiError(unknownError, 'test-context');
            
            expect(NextResponse.json).toHaveBeenCalledWith(
                { error: 'An unexpected error occurred' },
                { status: 500 }
            );
        });

        it('should work without context', () => {
            const error = new Error('Test error');
            
            expect(() => handleApiError(error)).not.toThrow();
        });
    });

    describe('createApiResponse', () => {
        it('should create successful response with default status 200', () => {
            const data = { success: true };
            
            createApiResponse(data);
            
            expect(NextResponse.json).toHaveBeenCalledWith(data, { status: 200 });
        });

        it('should create response with custom status', () => {
            const data = { created: true };
            
            createApiResponse(data, 201);
            
            expect(NextResponse.json).toHaveBeenCalledWith(data, { status: 201 });
        });
    });

    describe('createErrorResponse', () => {
        it('should create error response with default status 400', () => {
            createErrorResponse('Test error');
            
            expect(NextResponse.json).toHaveBeenCalledWith(
                { error: 'Test error', code: undefined },
                { status: 400 }
            );
        });

        it('should create error response with custom status and code', () => {
            createErrorResponse('Test error', 422, 'VALIDATION_ERROR');
            
            expect(NextResponse.json).toHaveBeenCalledWith(
                { error: 'Test error', code: 'VALIDATION_ERROR' },
                { status: 422 }
            );
        });
    });
});