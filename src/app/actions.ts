'use server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { generateSlug, isValidUrl, formatUrl } from '@/lib/utils';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/lib/auth-utils';

const createLinkSchema = z.object({
    url: z
        .string()
        .min(1, 'URL is required')
        .refine(isValidUrl, 'Please enter a valid URL'),
    customSlug: z.string().optional(),
    expiration: z.string().optional(),
    startingDate: z.string().optional(),
    password: z.string().optional(),
});

export async function deleteLink(linkId: string) {
    try {
        // Get current user
        const user = await getCurrentUser();
        if (!user) {
            return {
                error: 'You must be logged in to delete links.',
            };
        }

        // Check if link belongs to user
        const link = await db.link.findUnique({
            where: { id: linkId },
        });

        if (!link) {
            return {
                error: 'Link not found.',
            };
        }

        if (link.userId !== user.id) {
            return {
                error: 'You can only delete your own links.',
            };
        }

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
        // Get current user
        const user = await getCurrentUser();
        if (!user) {
            return {
                error: 'You must be logged in to create links.',
            };
        }

        const rawUrl = formData.get('url') as string;
        const rawCustomSlug = formData.get('customSlug') as string;
        const rawExpiration = formData.get('expiration') as string;
        const rawStartingDate = formData.get('startingDate') as string;
        const rawPassword = formData.get('password') as string;

        const result = createLinkSchema.safeParse({
            url: rawUrl,
            customSlug: rawCustomSlug || undefined,
            expiration: rawExpiration || undefined,
            startingDate: rawStartingDate || undefined,
            password: rawPassword || undefined,
        });

        if (!result.success) {
            return {
                error: result.error.errors[0].message,
            };
        }

        const formattedUrl = formatUrl(result.data.url);
        const { customSlug, expiration, startingDate, password } = result.data;

        // Check if URL already exists for this user (only if no custom slug provided)
        if (!customSlug) {
            const existingLink = await db.link.findFirst({
                where: {
                    url: formattedUrl,
                    userId: user.id,
                },
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
                userId: user.id,
                expiresAt,
                startsAt: new Date(startingDate || Date.now()), // Default to now if no starting date provided
                password: password || null,
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
