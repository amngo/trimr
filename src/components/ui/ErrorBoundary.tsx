'use client';

import { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Button from './Button';

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
}

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export default class ErrorBoundary extends Component<
    ErrorBoundaryProps,
    ErrorBoundaryState
> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.props.onError?.(error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: undefined });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-[400px] flex items-center justify-center p-8">
                    <div className="text-center max-w-md">
                        <div className="flex justify-center mb-4">
                            <AlertTriangle className="w-16 h-16 text-error" />
                        </div>
                        <h2 className="text-2xl font-bold text-base-content mb-2">
                            Something went wrong
                        </h2>
                        <p className="text-base-content/70 mb-6">
                            We encountered an unexpected error. Please try refreshing the page.
                        </p>
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="mb-6 text-left">
                                <summary className="cursor-pointer text-sm font-medium">
                                    Error Details
                                </summary>
                                <pre className="mt-2 p-4 bg-base-200 rounded text-xs overflow-auto">
                                    {this.state.error.message}
                                    {this.state.error.stack && (
                                        <>
                                            {'\n\n'}
                                            {this.state.error.stack}
                                        </>
                                    )}
                                </pre>
                            </details>
                        )}
                        <div className="flex justify-center gap-3">
                            <Button onClick={() => window.location.reload()}>
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Refresh Page
                            </Button>
                            <Button variant="ghost" onClick={this.handleReset}>
                                Try Again
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}