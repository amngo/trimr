import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-utils';
import { db } from '@/lib/db';
import { nanoid } from 'nanoid';
import { normalizeUrl, isValidUrl } from '@/lib/utils';
import { logger } from '@/utils';
import { BulkUploadResult, CSVLinkData } from '@/types';

export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { links } = body as { links: CSVLinkData[] };

        if (!Array.isArray(links) || links.length === 0) {
            return NextResponse.json(
                { error: 'Invalid request: links array is required' },
                { status: 400 }
            );
        }

        if (links.length > 1000) {
            return NextResponse.json(
                { error: 'Maximum 1000 links allowed per bulk upload' },
                { status: 400 }
            );
        }

        const results: BulkUploadResult = {
            success: false,
            total: links.length,
            successful: 0,
            failed: 0,
            errors: [],
            links: []
        };

        // Process each link
        for (let i = 0; i < links.length; i++) {
            const linkData = links[i];
            
            try {
                // Validate URL
                if (!linkData.url || !isValidUrl(linkData.url)) {
                    results.failed++;
                    results.errors?.push({
                        row: i + 1,
                        url: linkData.url || 'missing',
                        error: 'Invalid URL'
                    });
                    results.links?.push({
                        url: linkData.url || 'missing',
                        slug: '',
                        success: false,
                        error: 'Invalid URL'
                    });
                    continue;
                }

                const normalizedUrl = normalizeUrl(linkData.url);

                // Generate or validate slug
                let slug = linkData.customSlug || nanoid(8);
                
                if (linkData.customSlug) {
                    // Validate custom slug
                    if (!/^[a-zA-Z0-9_-]{3,50}$/.test(linkData.customSlug)) {
                        results.failed++;
                        results.errors?.push({
                            row: i + 1,
                            url: linkData.url,
                            error: 'Invalid custom slug format'
                        });
                        results.links?.push({
                            url: linkData.url,
                            slug: '',
                            success: false,
                            error: 'Invalid custom slug format'
                        });
                        continue;
                    }

                    // Check if slug already exists
                    const existingLink = await db.link.findUnique({
                        where: { slug: linkData.customSlug }
                    });

                    if (existingLink) {
                        results.failed++;
                        results.errors?.push({
                            row: i + 1,
                            url: linkData.url,
                            error: 'Slug already exists'
                        });
                        results.links?.push({
                            url: linkData.url,
                            slug: '',
                            success: false,
                            error: 'Slug already exists'
                        });
                        continue;
                    }
                }

                // Parse dates if provided
                let expiresAt: Date | null = null;
                let startsAt: Date | null = null;

                if (linkData.expiration) {
                    const expDate = new Date(linkData.expiration);
                    if (isNaN(expDate.getTime()) || expDate <= new Date()) {
                        results.failed++;
                        results.errors?.push({
                            row: i + 1,
                            url: linkData.url,
                            error: 'Invalid expiration date'
                        });
                        results.links?.push({
                            url: linkData.url,
                            slug: '',
                            success: false,
                            error: 'Invalid expiration date'
                        });
                        continue;
                    }
                    expiresAt = expDate;
                }

                if (linkData.startDate) {
                    const startDate = new Date(linkData.startDate);
                    if (isNaN(startDate.getTime())) {
                        results.failed++;
                        results.errors?.push({
                            row: i + 1,
                            url: linkData.url,
                            error: 'Invalid start date'
                        });
                        results.links?.push({
                            url: linkData.url,
                            slug: '',
                            success: false,
                            error: 'Invalid start date'
                        });
                        continue;
                    }
                    startsAt = startDate;
                }

                // Ensure slug is unique (for auto-generated slugs)
                if (!linkData.customSlug) {
                    let attempts = 0;
                    while (attempts < 10) {
                        const existingLink = await db.link.findUnique({
                            where: { slug }
                        });
                        
                        if (!existingLink) break;
                        
                        slug = nanoid(8);
                        attempts++;
                    }

                    if (attempts >= 10) {
                        results.failed++;
                        results.errors?.push({
                            row: i + 1,
                            url: linkData.url,
                            error: 'Failed to generate unique slug'
                        });
                        results.links?.push({
                            url: linkData.url,
                            slug: '',
                            success: false,
                            error: 'Failed to generate unique slug'
                        });
                        continue;
                    }
                }

                // Create the link
                const link = await db.link.create({
                    data: {
                        slug,
                        url: normalizedUrl,
                        userId: user.id,
                        expiresAt,
                        startsAt
                    }
                });

                results.successful++;
                results.links?.push({
                    url: linkData.url,
                    slug: link.slug,
                    success: true
                });

            } catch (error) {
                logger.error('Error creating bulk link', error);
                results.failed++;
                results.errors?.push({
                    row: i + 1,
                    url: linkData.url,
                    error: error instanceof Error ? error.message : 'Unknown error'
                });
                results.links?.push({
                    url: linkData.url,
                    slug: '',
                    success: false,
                    error: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        }

        results.success = results.successful > 0;

        return NextResponse.json(results, { 
            status: results.successful > 0 ? 200 : 400 
        });

    } catch (error) {
        logger.error('Bulk upload endpoint error', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}