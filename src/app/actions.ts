'use server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { generateSlug, isValidUrl, formatUrl } from '@/lib/utils';
import { revalidatePath } from 'next/cache';

const createLinkSchema = z.object({
    url: z
        .string()
        .min(1, 'URL is required')
        .refine(isValidUrl, 'Please enter a valid URL'),
    customSlug: z.string().optional(),
    expiration: z.string().optional(),
});

export async function deleteLink(linkId: string) {
    try {
        await db.link.delete({
            where: { id: linkId },
        });
        await db.click.deleteMany({
            where: { linkId },
        });

        revalidatePath('/dashboard');

        return { success: true };
    } catch (error) {
        console.error('Error deleting link:', error);
        return {
            error: 'Failed to delete link. Please try again.',
        };
    }
}

export async function createLink(formData: FormData) {
    try {
        const rawUrl = formData.get('url') as string;
        const rawCustomSlug = formData.get('customSlug') as string;
        const rawExpiration = formData.get('expiration') as string;

        const result = createLinkSchema.safeParse({
            url: rawUrl,
            customSlug: rawCustomSlug || undefined,
            expiration: rawExpiration || undefined,
        });

        if (!result.success) {
            return {
                error: result.error.errors[0].message,
            };
        }

        const formattedUrl = formatUrl(result.data.url);
        const { customSlug, expiration } = result.data;

        // Check if URL already exists (only if no custom slug provided)
        if (!customSlug) {
            const existingLink = await db.link.findFirst({
                where: { url: formattedUrl },
            });

            if (existingLink) {
                return {
                    success: true,
                    slug: existingLink.slug,
                    url: formattedUrl,
                };
            }
        }

        // Generate or validate slug
        let slug: string;

        if (customSlug) {
            // Validate custom slug
            if (!/^[a-zA-Z0-9_-]+$/.test(customSlug)) {
                return {
                    error: 'Custom slug can only contain letters, numbers, hyphens, and underscores.',
                };
            }

            // Check if custom slug is available
            const existingSlug = await db.link.findUnique({
                where: { slug: customSlug },
            });

            if (existingSlug) {
                return {
                    error: 'This custom slug is already taken. Please choose another one.',
                };
            }

            slug = customSlug;
        } else {
            // Generate unique slug
            slug = generateSlug();
            let attempts = 0;

            while (attempts < 10) {
                const existingSlug = await db.link.findUnique({
                    where: { slug },
                });

                if (!existingSlug) {
                    break;
                }

                slug = generateSlug();
                attempts++;
            }

            if (attempts >= 10) {
                return {
                    error: 'Failed to generate unique slug. Please try again.',
                };
            }
        }

        // Calculate expiration date
        let expiresAt: Date | null = null;
        if (expiration && expiration !== 'never') {
            const now = new Date();
            switch (expiration) {
                case '1h':
                    expiresAt = new Date(now.getTime() + 60 * 60 * 1000);
                    break;
                case '24h':
                    expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
                    break;
                case '7d':
                    expiresAt = new Date(
                        now.getTime() + 7 * 24 * 60 * 60 * 1000
                    );
                    break;
                case '30d':
                    expiresAt = new Date(
                        now.getTime() + 30 * 24 * 60 * 60 * 1000
                    );
                    break;
            }
        }

        // Create the link
        const link = await db.link.create({
            data: {
                slug,
                url: formattedUrl,
                expiresAt,
            },
        });

        revalidatePath('/dashboard');

        return {
            success: true,
            slug: link.slug,
            url: formattedUrl,
        };
    } catch (error) {
        console.error('Error creating link:', error);
        return {
            error: 'An unexpected error occurred. Please try again.',
        };
    }
}
