import { NextResponse } from 'next/server';
import { logger } from '@/utils/logger';

export interface ApiError {
    message: string;
    code?: string;
    statusCode: number;
}

export class HttpError extends Error {
    statusCode: number;
    code?: string;

    constructor(message: string, statusCode: number = 500, code?: string) {
        super(message);
        this.name = 'HttpError';
        this.statusCode = statusCode;
        this.code = code;
    }
}

export function handleApiError(error: unknown, context?: string): NextResponse {
    // Log the error with context
    const logContext = context ? `[${context}]` : '[API]';
    
    if (error instanceof HttpError) {
        logger.error(`${logContext} HTTP Error:`, {
            message: error.message,
            statusCode: error.statusCode,
            code: error.code,
            stack: error.stack,
        });
        
        return NextResponse.json(
            { error: error.message, code: error.code },
            { status: error.statusCode }
        );
    }
    
    if (error instanceof Error) {
        logger.error(`${logContext} Unexpected error:`, {
            message: error.message,
            stack: error.stack,
        });
        
        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
    
    // Handle unknown error types
    logger.error(`${logContext} Unknown error:`, { error });
    
    return NextResponse.json(
        { error: 'An unexpected error occurred' },
        { status: 500 }
    );
}

export function createApiResponse<T>(
    data: T,
    status: number = 200
): NextResponse<T> {
    return NextResponse.json(data, { status });
}

export function createErrorResponse(
    message: string,
    status: number = 400,
    code?: string
): NextResponse {
    return NextResponse.json(
        { error: message, code },
        { status }
    );
}