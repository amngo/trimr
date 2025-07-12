import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useBulkDelete, useBulkToggle } from '../useBulkOperations';
import { toast } from '@/stores';

// Mock dependencies
jest.mock('@/stores', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

jest.mock('@/utils/logger', () => ({
    logger: {
        info: jest.fn(),
        error: jest.fn(),
    },
}));

// Mock fetch
global.fetch = jest.fn();

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    });

    // eslint-disable-next-line react/display-name
    return ({ children }: { children: React.ReactNode }) =>
        React.createElement(QueryClientProvider, { client: queryClient }, children);
};

describe('useBulkOperations', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (fetch as jest.Mock).mockClear();
    });

    describe('useBulkDelete', () => {
        it('should successfully delete links', async () => {
            const mockResponse = {
                success: true,
                message: 'Successfully deleted 2 links',
                deletedCount: 2,
                deletedLinks: [
                    { id: '1', slug: 'test1' },
                    { id: '2', slug: 'test2' },
                ],
            };

            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse,
            });

            const wrapper = createWrapper();
            const { result } = renderHook(() => useBulkDelete(), { wrapper });

            result.current.mutate(['1', '2']);

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(fetch).toHaveBeenCalledWith('/api/links/bulk-delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ linkIds: ['1', '2'] }),
            });

            expect(toast.success).toHaveBeenCalledWith('Successfully deleted 2 links');
        });

        it('should handle delete errors', async () => {
            const errorMessage = 'Failed to delete links';
            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: false,
                json: async () => ({ message: errorMessage }),
            });

            const wrapper = createWrapper();
            const { result } = renderHook(() => useBulkDelete(), { wrapper });

            result.current.mutate(['1', '2']);

            await waitFor(() => {
                expect(result.current.isError).toBe(true);
            });

            expect(toast.error).toHaveBeenCalledWith(errorMessage);
        });

        it('should handle network errors', async () => {
            (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

            const wrapper = createWrapper();
            const { result } = renderHook(() => useBulkDelete(), { wrapper });

            result.current.mutate(['1', '2']);

            await waitFor(() => {
                expect(result.current.isError).toBe(true);
            });

            expect(toast.error).toHaveBeenCalledWith('Network error');
        });
    });

    describe('useBulkToggle', () => {
        it('should successfully toggle links to enabled', async () => {
            const mockResponse = {
                success: true,
                message: 'Successfully enabled 2 links',
                updatedCount: 2,
                updatedLinks: [
                    { id: '1', slug: 'test1', enabled: true },
                    { id: '2', slug: 'test2', enabled: true },
                ],
            };

            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse,
            });

            const wrapper = createWrapper();
            const { result } = renderHook(() => useBulkToggle(), { wrapper });

            result.current.mutate({ linkIds: ['1', '2'], enabled: true });

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(fetch).toHaveBeenCalledWith('/api/links/bulk-toggle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ linkIds: ['1', '2'], enabled: true }),
            });

            expect(toast.success).toHaveBeenCalledWith('Successfully enabled 2 links');
        });

        it('should successfully toggle links to disabled', async () => {
            const mockResponse = {
                success: true,
                message: 'Successfully disabled 2 links',
                updatedCount: 2,
                updatedLinks: [
                    { id: '1', slug: 'test1', enabled: false },
                    { id: '2', slug: 'test2', enabled: false },
                ],
            };

            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse,
            });

            const wrapper = createWrapper();
            const { result } = renderHook(() => useBulkToggle(), { wrapper });

            result.current.mutate({ linkIds: ['1', '2'], enabled: false });

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(fetch).toHaveBeenCalledWith('/api/links/bulk-toggle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ linkIds: ['1', '2'], enabled: false }),
            });

            expect(toast.success).toHaveBeenCalledWith('Successfully disabled 2 links');
        });

        it('should handle toggle errors', async () => {
            const errorMessage = 'Failed to toggle links';
            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: false,
                json: async () => ({ message: errorMessage }),
            });

            const wrapper = createWrapper();
            const { result } = renderHook(() => useBulkToggle(), { wrapper });

            result.current.mutate({ linkIds: ['1', '2'], enabled: true });

            await waitFor(() => {
                expect(result.current.isError).toBe(true);
            });

            expect(toast.error).toHaveBeenCalledWith(errorMessage);
        });

        it('should handle network errors', async () => {
            (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

            const wrapper = createWrapper();
            const { result } = renderHook(() => useBulkToggle(), { wrapper });

            result.current.mutate({ linkIds: ['1', '2'], enabled: true });

            await waitFor(() => {
                expect(result.current.isError).toBe(true);
            });

            expect(toast.error).toHaveBeenCalledWith('Network error');
        });
    });
});