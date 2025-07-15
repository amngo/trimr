import { render, screen } from '@testing-library/react';
import ErrorBoundary from '../common/ErrorBoundary';

// Mock console.error to avoid noise in tests
const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

// Component that throws an error for testing
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
    if (shouldThrow) {
        throw new Error('Test error');
    }
    return <div>No error</div>;
};

describe('ErrorBoundary', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterAll(() => {
        consoleSpy.mockRestore();
    });

    it('should render children when there is no error', () => {
        render(
            <ErrorBoundary>
                <ThrowError shouldThrow={false} />
            </ErrorBoundary>,
        );

        expect(screen.getByText('No error')).toBeInTheDocument();
    });

    it('should render error UI when there is an error', () => {
        render(
            <ErrorBoundary>
                <ThrowError shouldThrow={true} />
            </ErrorBoundary>,
        );

        expect(screen.getByText('Something went wrong')).toBeInTheDocument();
        expect(
            screen.getByText(/We encountered an unexpected error/),
        ).toBeInTheDocument();
    });

    it('should render custom fallback when provided', () => {
        const customFallback = <div>Custom Error UI</div>;

        render(
            <ErrorBoundary fallback={customFallback}>
                <ThrowError shouldThrow={true} />
            </ErrorBoundary>,
        );

        expect(screen.getByText('Custom Error UI')).toBeInTheDocument();
        expect(
            screen.queryByText('Something went wrong'),
        ).not.toBeInTheDocument();
    });

    it('should call onError when error occurs', () => {
        const mockOnError = jest.fn();

        render(
            <ErrorBoundary onError={mockOnError}>
                <ThrowError shouldThrow={true} />
            </ErrorBoundary>,
        );

        expect(mockOnError).toHaveBeenCalledWith(
            expect.any(Error),
            expect.any(Object),
        );
    });

    it('should have Try Again and Refresh Page buttons', () => {
        render(
            <ErrorBoundary>
                <ThrowError shouldThrow={true} />
            </ErrorBoundary>,
        );

        expect(screen.getByText('Try Again')).toBeInTheDocument();
        expect(screen.getByText('Refresh Page')).toBeInTheDocument();
    });

    it('should show error details in development mode', () => {
        const originalEnv = process.env.NODE_ENV;
        Object.defineProperty(process.env, 'NODE_ENV', {
            value: 'development',
            configurable: true,
        });

        render(
            <ErrorBoundary>
                <ThrowError shouldThrow={true} />
            </ErrorBoundary>,
        );

        expect(screen.getByText('Error Details')).toBeInTheDocument();

        Object.defineProperty(process.env, 'NODE_ENV', {
            value: originalEnv,
            configurable: true,
        });
    });
});
