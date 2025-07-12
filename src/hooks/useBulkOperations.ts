'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/stores';
import { logger } from '@/utils/logger';

interface BulkDeleteResponse {
    success: boolean;
    message: string;
    deletedCount: number;
    deletedLinks: Array<{ id: string; slug: string }>;
}

interface BulkToggleResponse {
    success: boolean;
    message: string;
    updatedCount: number;
    updatedLinks: Array<{ id: string; slug: string; enabled: boolean }>;
}

export function useBulkDelete() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (linkIds: string[]): Promise<BulkDeleteResponse> => {
            logger.info(`Bulk deleting ${linkIds.length} links`);
            
            const response = await fetch('/api/links/bulk-delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ linkIds }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete links');
            }

            return response.json();
        },
        onSuccess: (data) => {
            // Invalidate links queries to refetch data
            queryClient.invalidateQueries({ queryKey: ['links'] });
            
            toast.success(data.message);
            logger.info(`Successfully deleted ${data.deletedCount} links`);
        },
        onError: (error) => {
            const message = error instanceof Error ? error.message : 'Failed to delete links';
            toast.error(message);
            logger.error('Bulk delete failed:', error);
        },
    });
}

export function useBulkToggle() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ linkIds, enabled }: { linkIds: string[]; enabled: boolean }): Promise<BulkToggleResponse> => {
            logger.info(`Bulk ${enabled ? 'enabling' : 'disabling'} ${linkIds.length} links`);
            
            const response = await fetch('/api/links/bulk-toggle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ linkIds, enabled }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to toggle links');
            }

            return response.json();
        },
        onSuccess: (data) => {
            // Invalidate links queries to refetch data
            queryClient.invalidateQueries({ queryKey: ['links'] });
            
            toast.success(data.message);
            logger.info(`Successfully updated ${data.updatedCount} links`);
        },
        onError: (error) => {
            const message = error instanceof Error ? error.message : 'Failed to toggle links';
            toast.error(message);
            logger.error('Bulk toggle failed:', error);
        },
    });
}