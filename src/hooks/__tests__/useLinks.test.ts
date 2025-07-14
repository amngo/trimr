import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
    useLinks,
    useDeleteLink,
    useToggleLink,
    useRenameLink,
} from '../useLinks';
import {
    mockFetch,
    mockFetchError,
    createTestQueryClient,
} from '@/test-utils/test-helpers';
import { createMockLink, createMockLinks } from '@/test-utils/test-factories';
import { Link } from '@/types';
import React, { ReactNode } from 'react';

const createWrapper = (queryClient = createTestQueryClient()) => {
    const TestWrapper = ({ children }: { children: ReactNode }) =>
        React.createElement(
            QueryClientProvider,
            { client: queryClient },
            children,
        );
    TestWrapper.displayName = 'TestWrapper';
    return TestWrapper;
};

describe('useLinks', () => {
    let queryClient: QueryClient;

    beforeEach(() => {
        queryClient = createTestQueryClient();
        jest.clearAllMocks();
    });

    describe('useLinks query', () => {
        it('should fetch links successfully', async () => {
            const mockLinks = createMockLinks(3);
            mockFetch(mockLinks);

            const { result } = renderHook(() => useLinks(), {
                wrapper: createWrapper(queryClient),
            });

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(result.current.data).toEqual(mockLinks);
            expect(fetch).toHaveBeenCalledWith('/api/links');
        });

        it('should handle fetch error', async () => {
            mockFetchError('Network error');

            const { result } = renderHook(() => useLinks(), {
                wrapper: createWrapper(queryClient),
            });

            await waitFor(() => {
                expect(result.current.isError).toBe(true);
            });

            expect(result.current.error).toBeInstanceOf(Error);
        });

        it('should provide loading state', () => {
            mockFetch(createMockLinks(3));

            const { result } = renderHook(() => useLinks(), {
                wrapper: createWrapper(queryClient),
            });

            expect(result.current.isLoading).toBe(true);
            expect(result.current.data).toBeUndefined();
        });

        it('should use cached data when available', async () => {
            const mockLinks = createMockLinks(2);

            // Pre-populate cache
            queryClient.setQueryData(['links'], mockLinks);

            const { result } = renderHook(() => useLinks(), {
                wrapper: createWrapper(queryClient),
            });

            expect(result.current.data).toEqual(mockLinks);
            expect(result.current.isLoading).toBe(false);
        });
    });

    describe('useDeleteLink mutation', () => {
        it('should delete link successfully', async () => {
            mockFetch({ success: true });

            const { result } = renderHook(() => useDeleteLink(), {
                wrapper: createWrapper(queryClient),
            });

            result.current.mutate('link-to-delete');

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(fetch).toHaveBeenCalledWith('/api/links/link-to-delete', {
                method: 'DELETE',
            });
        });

        it('should handle delete error', async () => {
            mockFetchError('Delete failed');

            const { result } = renderHook(() => useDeleteLink(), {
                wrapper: createWrapper(queryClient),
            });

            result.current.mutate('link-to-delete');

            await waitFor(() => {
                expect(result.current.isError).toBe(true);
            });

            expect(result.current.error).toBeInstanceOf(Error);
        });

        it('should optimistically update cache', async () => {
            const mockLinks = createMockLinks(3);
            queryClient.setQueryData(['links'], mockLinks);

            // Mock successful delete
            mockFetch({ success: true });

            const { result } = renderHook(() => useDeleteLink(), {
                wrapper: createWrapper(queryClient),
            });

            result.current.mutate('test-link-1');

            // Wait for optimistic update
            await waitFor(() => {
                const updatedLinks = queryClient.getQueryData([
                    'links',
                ]) as Link[];
                expect(updatedLinks).toHaveLength(2);
                expect(
                    updatedLinks.find((link) => link.id === 'test-link-1'),
                ).toBeUndefined();
            });

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });
        });

        it('should rollback on error', async () => {
            const mockLinks = createMockLinks(3);
            queryClient.setQueryData(['links'], mockLinks);

            // Mock failed delete
            mockFetchError('Server error');

            const { result } = renderHook(() => useDeleteLink(), {
                wrapper: createWrapper(queryClient),
            });

            result.current.mutate('test-link-1');

            await waitFor(() => {
                expect(result.current.isError).toBe(true);
            });

            // Should rollback to original data
            const rolledBackLinks = queryClient.getQueryData([
                'links',
            ]) as Link[];
            expect(rolledBackLinks).toHaveLength(3);
            expect(
                rolledBackLinks.find((link) => link.id === 'test-link-1'),
            ).toBeDefined();
        });
    });

    describe('useToggleLink mutation', () => {
        it('should toggle link enabled state successfully', async () => {
            const updatedLink = createMockLink({
                id: 'link-1',
                enabled: false,
            });
            mockFetch(updatedLink);

            const { result } = renderHook(() => useToggleLink(), {
                wrapper: createWrapper(queryClient),
            });

            result.current.mutate({ linkId: 'link-1', enabled: false });

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(fetch).toHaveBeenCalledWith('/api/links/link-1', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ enabled: false }),
            });
        });

        it('should optimistically update enabled state', async () => {
            const mockLinks = [
                createMockLink({ id: 'link-1', enabled: true }),
                createMockLink({ id: 'link-2', enabled: false }),
            ];
            queryClient.setQueryData(['links'], mockLinks);

            mockFetch(createMockLink({ id: 'link-1', enabled: false }));

            const { result } = renderHook(() => useToggleLink(), {
                wrapper: createWrapper(queryClient),
            });

            result.current.mutate({ linkId: 'link-1', enabled: false });

            // Wait a bit for optimistic update
            await waitFor(() => {
                const updatedLinks = queryClient.getQueryData([
                    'links',
                ]) as Link[];
                const toggledLink = updatedLinks.find(
                    (link) => link.id === 'link-1',
                );
                expect(toggledLink?.enabled).toBe(false);
            });

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });
        });

        it('should handle toggle error with rollback', async () => {
            const mockLinks = [createMockLink({ id: 'link-1', enabled: true })];
            queryClient.setQueryData(['links'], mockLinks);

            mockFetchError('Toggle failed');

            const { result } = renderHook(() => useToggleLink(), {
                wrapper: createWrapper(queryClient),
            });

            result.current.mutate({ linkId: 'link-1', enabled: false });

            await waitFor(() => {
                expect(result.current.isError).toBe(true);
            });

            // Should rollback to original state
            const rolledBackLinks = queryClient.getQueryData([
                'links',
            ]) as Link[];
            const originalLink = rolledBackLinks.find(
                (link) => link.id === 'link-1',
            );
            expect(originalLink?.enabled).toBe(true);
        });
    });

    describe('useRenameLink mutation', () => {
        it('should rename link successfully', async () => {
            const updatedLink = createMockLink({
                id: 'link-1',
                name: 'New Name',
            });
            mockFetch(updatedLink);

            const { result } = renderHook(() => useRenameLink(), {
                wrapper: createWrapper(queryClient),
            });

            result.current.mutate({ linkId: 'link-1', name: 'New Name' });

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(fetch).toHaveBeenCalledWith('/api/links/link-1', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: 'New Name' }),
            });
        });

        it('should optimistically update name', async () => {
            const mockLinks = [
                createMockLink({ id: 'link-1', name: 'Old Name' }),
            ];
            queryClient.setQueryData(['links'], mockLinks);

            mockFetch(createMockLink({ id: 'link-1', name: 'New Name' }));

            const { result } = renderHook(() => useRenameLink(), {
                wrapper: createWrapper(queryClient),
            });

            result.current.mutate({ linkId: 'link-1', name: 'New Name' });

            // Wait for optimistic update
            await waitFor(() => {
                const updatedLinks = queryClient.getQueryData([
                    'links',
                ]) as Link[];
                const renamedLink = updatedLinks.find(
                    (link) => link.id === 'link-1',
                );
                expect(renamedLink?.name).toBe('New Name');
            });

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });
        });

        it('should handle rename error with rollback', async () => {
            const mockLinks = [
                createMockLink({ id: 'link-1', name: 'Original Name' }),
            ];
            queryClient.setQueryData(['links'], mockLinks);

            mockFetchError('Rename failed');

            const { result } = renderHook(() => useRenameLink(), {
                wrapper: createWrapper(queryClient),
            });

            result.current.mutate({ linkId: 'link-1', name: 'New Name' });

            await waitFor(() => {
                expect(result.current.isError).toBe(true);
            });

            // Should rollback to original name
            const rolledBackLinks = queryClient.getQueryData([
                'links',
            ]) as Link[];
            const originalLink = rolledBackLinks.find(
                (link) => link.id === 'link-1',
            );
            expect(originalLink?.name).toBe('Original Name');
        });

        it('should handle empty name gracefully', async () => {
            mockFetch(createMockLink({ id: 'link-1', name: '' }));

            const { result } = renderHook(() => useRenameLink(), {
                wrapper: createWrapper(queryClient),
            });

            result.current.mutate({ linkId: 'link-1', name: '' });

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(fetch).toHaveBeenCalledWith('/api/links/link-1', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: '' }),
            });
        });
    });

    describe('error handling', () => {
        it('should handle 404 errors', async () => {
            global.fetch = jest.fn().mockResolvedValue({
                ok: false,
                status: 404,
                statusText: 'Not Found',
                json: () => Promise.resolve({ error: 'Link not found' }),
            });

            const { result } = renderHook(() => useDeleteLink(), {
                wrapper: createWrapper(queryClient),
            });

            result.current.mutate('non-existent-link');

            await waitFor(() => {
                expect(result.current.isError).toBe(true);
            });

            expect(result.current.error?.message).toContain(
                'Failed to delete link',
            );
        });

        it('should handle network errors', async () => {
            global.fetch = jest
                .fn()
                .mockRejectedValue(new Error('Network error'));

            const { result } = renderHook(() => useLinks(), {
                wrapper: createWrapper(queryClient),
            });

            await waitFor(() => {
                expect(result.current.isError).toBe(true);
            });

            expect(result.current.error?.message).toBe('Network error');
        });
    });

    describe('concurrent mutations', () => {
        it('should handle multiple simultaneous mutations', async () => {
            const mockLinks = createMockLinks(3);
            queryClient.setQueryData(['links'], mockLinks);

            mockFetch({ success: true });

            const { result: deleteResult } = renderHook(() => useDeleteLink(), {
                wrapper: createWrapper(queryClient),
            });

            const { result: toggleResult } = renderHook(() => useToggleLink(), {
                wrapper: createWrapper(queryClient),
            });

            // Trigger both mutations simultaneously
            deleteResult.current.mutate('test-link-1');
            toggleResult.current.mutate({
                linkId: 'test-link-2',
                enabled: false,
            });

            await waitFor(() => {
                expect(deleteResult.current.isSuccess).toBe(true);
                expect(toggleResult.current.isSuccess).toBe(true);
            });

            // Both mutations should have been applied
            const finalLinks = queryClient.getQueryData(['links']) as Link[];
            expect(finalLinks).toHaveLength(2);
            expect(
                finalLinks.find((link) => link.id === 'test-link-1'),
            ).toBeUndefined();
            expect(
                finalLinks.find((link) => link.id === 'test-link-2')?.enabled,
            ).toBe(false);
        });
    });
});
