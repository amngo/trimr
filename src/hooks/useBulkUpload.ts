import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { 
    CSVLinkData, 
    BulkUploadProgress, 
    BulkUploadResult,
    BulkUploadError
} from '@/types';
import { toast } from '@/stores';
import { logger } from '@/utils';

interface UseBulkUploadOptions {
    onProgress?: (progress: BulkUploadProgress) => void;
    onComplete?: (result: BulkUploadResult) => void;
    batchSize?: number;
}

export function useBulkUpload({
    onProgress,
    onComplete,
    batchSize = 5
}: UseBulkUploadOptions = {}) {
    const [progress, setProgress] = useState<BulkUploadProgress>({
        total: 0,
        processed: 0,
        successful: 0,
        failed: 0,
        isProcessing: false
    });
    const [isUploading, setIsUploading] = useState(false);
    const queryClient = useQueryClient();

    const updateProgress = useCallback((update: Partial<BulkUploadProgress> | ((prev: BulkUploadProgress) => Partial<BulkUploadProgress>)) => {
        setProgress(prev => {
            const updateObj = typeof update === 'function' ? update(prev) : update;
            const newProgress = { ...prev, ...updateObj };
            onProgress?.(newProgress);
            return newProgress;
        });
    }, [onProgress]);

    const bulkUpload = useCallback(async (links: CSVLinkData[]) => {
        if (links.length === 0) {
            toast.error('No valid links to upload');
            return;
        }

        setIsUploading(true);
        updateProgress({
            total: links.length,
            processed: 0,
            successful: 0,
            failed: 0,
            isProcessing: true
        });

        try {
            // For smaller uploads, use the bulk endpoint
            if (links.length <= 100) {
                updateProgress({ currentUrl: 'Processing batch...' });
                
                const response = await fetch('/api/links/bulk', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ links }),
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.error || 'Bulk upload failed');
                }

                const result: BulkUploadResult = await response.json();
                
                updateProgress({
                    processed: result.total,
                    successful: result.successful,
                    failed: result.failed
                });

                // Show completion toast
                if (result.successful > 0 && result.failed === 0) {
                    toast.success(`Successfully created ${result.successful} links!`);
                } else if (result.successful > 0 && result.failed > 0) {
                    toast.warning(`Created ${result.successful} links, ${result.failed} failed`);
                } else {
                    toast.error('All uploads failed. Please check your CSV data.');
                }

                // Refresh the links list
                queryClient.invalidateQueries({ queryKey: ['links'] });
                
                onComplete?.(result);
            } else {
                // For larger uploads, process in batches using individual API calls
                const errors: BulkUploadError[] = [];
                const successful: Array<{ url: string; slug: string }> = [];
                let processed = 0;

                // Process links in batches to avoid overwhelming the server
                for (let i = 0; i < links.length; i += batchSize) {
                    const batch = links.slice(i, i + batchSize);
                    
                    // Process batch concurrently
                    const batchPromises = batch.map(async (linkData, batchIndex) => {
                        const globalIndex = i + batchIndex;
                        
                        try {
                            updateProgress({ 
                                currentUrl: linkData.url,
                                processed: processed 
                            });

                            const result = await createSingleLink(linkData);
                            
                            if (result.success && result.slug) {
                                successful.push({
                                    url: linkData.url,
                                    slug: result.slug
                                });
                                updateProgress(prev => ({
                                    ...prev,
                                    successful: prev.successful + 1,
                                    processed: prev.processed + 1
                                }));
                            } else {
                                errors.push({
                                    row: globalIndex + 1,
                                    url: linkData.url,
                                    error: result.error || 'Unknown error occurred'
                                });
                                updateProgress(prev => ({
                                    ...prev,
                                    failed: prev.failed + 1,
                                    processed: prev.processed + 1
                                }));
                            }
                            
                            processed++;
                        } catch (error) {
                            logger.error('Bulk upload error for link', error);
                            errors.push({
                                row: globalIndex + 1,
                                url: linkData.url,
                                error: error instanceof Error ? error.message : 'Network error'
                            });
                            updateProgress(prev => ({
                                ...prev,
                                failed: prev.failed + 1,
                                processed: prev.processed + 1
                            }));
                            processed++;
                        }
                    });

                    // Wait for batch to complete before processing next batch
                    await Promise.all(batchPromises);
                    
                    // Small delay between batches to be nice to the server
                    if (i + batchSize < links.length) {
                        await new Promise(resolve => setTimeout(resolve, 100));
                    }
                }

                // Final result
                const result: BulkUploadResult = {
                    success: successful.length > 0,
                    total: links.length,
                    successful: successful.length,
                    failed: errors.length,
                    errors: errors.length > 0 ? errors : undefined
                };

                // Show completion toast
                if (result.successful > 0 && result.failed === 0) {
                    toast.success(`Successfully created ${result.successful} links!`);
                } else if (result.successful > 0 && result.failed > 0) {
                    toast.warning(`Created ${result.successful} links, ${result.failed} failed`);
                } else {
                    toast.error('All uploads failed. Please check your CSV data.');
                }

                // Refresh the links list
                queryClient.invalidateQueries({ queryKey: ['links'] });
                
                onComplete?.(result);
            }

        } catch (error) {
            logger.error('Bulk upload failed', error);
            toast.error('Bulk upload failed. Please try again.');
        } finally {
            updateProgress({ 
                isProcessing: false,
                currentUrl: undefined 
            });
            setIsUploading(false);
        }
    }, [batchSize, updateProgress, onComplete, queryClient]);

    return {
        bulkUpload,
        progress,
        isUploading
    };
}

async function createSingleLink(linkData: CSVLinkData): Promise<{
    success: boolean;
    slug?: string;
    error?: string;
}> {
    try {
        const formData = new FormData();
        formData.append('url', linkData.url);
        
        if (linkData.customSlug) {
            formData.append('customSlug', linkData.customSlug);
        }
        
        if (linkData.expiration) {
            formData.append('expiration', linkData.expiration);
        }

        if (linkData.startDate) {
            formData.append('startDate', linkData.startDate);
        }

        const response = await fetch('/api/links', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return {
                success: false,
                error: errorData.error || `HTTP ${response.status}: ${response.statusText}`
            };
        }

        const result = await response.json();
        
        if (result.success && result.slug) {
            return {
                success: true,
                slug: result.slug
            };
        } else {
            return {
                success: false,
                error: result.error || 'Unknown error'
            };
        }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Network error'
        };
    }
}