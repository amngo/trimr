import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from '@/types';
import { toast } from '@/stores';

interface CreateLinkData {
    url: string;
    name?: string;
    customSlug?: string;
    expiration?: string; // Optional expiration date for the link
    startingDate?: string; // Optional starting date for when the link will be active
    password?: string; // Optional password for the link
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

interface ToggleLinkResponse {
    success?: boolean;
    enabled?: boolean;
    error?: string;
}

interface RenameLinkResponse {
    success?: boolean;
    name?: string | null;
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
    if (data.name) formData.append('name', data.name);
    if (data.customSlug) formData.append('customSlug', data.customSlug);
    if (data.expiration) formData.append('expiration', data.expiration);
    if (data.startingDate) formData.append('startingDate', data.startingDate);
    if (data.password) formData.append('password', data.password);

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

async function toggleLink(
    linkId: string,
    enabled: boolean,
): Promise<ToggleLinkResponse> {
    const response = await fetch(`/api/links/${linkId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ enabled }),
    });

    if (!response.ok) {
        throw new Error('Failed to toggle link');
    }

    return response.json();
}

async function renameLink(
    linkId: string,
    name: string,
): Promise<RenameLinkResponse> {
    const response = await fetch(`/api/links/${linkId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
    });

    if (!response.ok) {
        throw new Error('Failed to rename link');
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
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['links'] });
            if (data.success) {
                toast.success('Link created successfully!');
            }
        },
        onError: () => {
            toast.error('Failed to create link. Please try again.');
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

            queryClient.setQueryData<Link[]>(
                ['links'],
                (old) => old?.filter((link) => link.id !== linkId) ?? [],
            );

            return { previousLinks };
        },
        onSuccess: () => {
            toast.success('Link deleted successfully!');
        },
        onError: (err, linkId, context) => {
            if (context?.previousLinks) {
                queryClient.setQueryData(['links'], context.previousLinks);
            }
            toast.error('Failed to delete link. Please try again.');
        },
    });
}

export function useToggleLink() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            linkId,
            enabled,
        }: {
            linkId: string;
            enabled: boolean;
        }) => toggleLink(linkId, enabled),
        onMutate: async ({ linkId, enabled }) => {
            await queryClient.cancelQueries({ queryKey: ['links'] });

            const previousLinks = queryClient.getQueryData<Link[]>(['links']);

            queryClient.setQueryData<Link[]>(
                ['links'],
                (old) =>
                    old?.map((link) =>
                        link.id === linkId ? { ...link, enabled } : link,
                    ) ?? [],
            );

            return { previousLinks };
        },
        onSuccess: (data, variables) => {
            const action = variables.enabled ? 'enabled' : 'disabled';
            toast.success(`Link ${action} successfully!`);
        },
        onError: (err, variables, context) => {
            if (context?.previousLinks) {
                queryClient.setQueryData(['links'], context.previousLinks);
            }
            const action = variables.enabled ? 'enable' : 'disable';
            toast.error(`Failed to ${action} link. Please try again.`);
        },
    });
}

export function useRenameLink() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ linkId, name }: { linkId: string; name: string }) =>
            renameLink(linkId, name),
        onMutate: async ({ linkId, name }) => {
            await queryClient.cancelQueries({ queryKey: ['links'] });

            const previousLinks = queryClient.getQueryData<Link[]>(['links']);

            queryClient.setQueryData<Link[]>(
                ['links'],
                (old) =>
                    old?.map((link) =>
                        link.id === linkId
                            ? { ...link, name: name || null }
                            : link,
                    ) ?? [],
            );

            return { previousLinks };
        },
        onSuccess: () => {
            toast.success('Link renamed successfully!');
        },
        onError: (err, variables, context) => {
            if (context?.previousLinks) {
                queryClient.setQueryData(['links'], context.previousLinks);
            }
            toast.error('Failed to rename link. Please try again.');
        },
    });
}
