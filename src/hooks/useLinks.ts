import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from '@/types';

interface CreateLinkData {
    url: string;
    customSlug?: string;
    expiration?: string;
}

interface CreateLinkResponse {
    success?: boolean;
    slug?: string;
    url?: string;
    error?: string;
}

interface DeleteLinkResponse {
    success?: boolean;
    error?: string;
}

async function fetchLinks(): Promise<Link[]> {
    const response = await fetch('/api/links');
    if (!response.ok) {
        throw new Error('Failed to fetch links');
    }
    return response.json();
}

async function createLink(data: CreateLinkData): Promise<CreateLinkResponse> {
    const formData = new FormData();
    formData.append('url', data.url);
    if (data.customSlug) formData.append('customSlug', data.customSlug);
    if (data.expiration) formData.append('expiration', data.expiration);

    const response = await fetch('/api/links', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Failed to create link');
    }

    return response.json();
}

async function deleteLink(linkId: string): Promise<DeleteLinkResponse> {
    const response = await fetch(`/api/links/${linkId}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error('Failed to delete link');
    }

    return response.json();
}

export function useLinks() {
    return useQuery({
        queryKey: ['links'],
        queryFn: fetchLinks,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

export function useCreateLink() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createLink,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['links'] });
        },
    });
}

export function useDeleteLink() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteLink,
        onMutate: async (linkId: string) => {
            await queryClient.cancelQueries({ queryKey: ['links'] });
            
            const previousLinks = queryClient.getQueryData<Link[]>(['links']);
            
            queryClient.setQueryData<Link[]>(['links'], (old) =>
                old?.filter((link) => link.id !== linkId) ?? []
            );
            
            return { previousLinks };
        },
        onError: (err, linkId, context) => {
            if (context?.previousLinks) {
                queryClient.setQueryData(['links'], context.previousLinks);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['links'] });
        },
    });
}