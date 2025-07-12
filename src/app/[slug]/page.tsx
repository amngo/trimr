import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { db } from '@/lib/db';
import { getCountryFromIp } from '@/lib/utils';
import { AlertTriangle } from 'lucide-react';

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function RedirectPage({ params }: PageProps) {
    const { slug } = await params;

    // Find the link
    const link = await db.link.findUnique({
        where: { slug },
    });

    console.log(link);

    const now = new Date();

    // Check if link exists
    if (!link) {
        return (
            <div className="container mx-auto max-w-4xl">
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                    <div className="mb-8">
                        <AlertTriangle
                            size={64}
                            className="text-warning mx-auto mb-4"
                        />
                        <h1 className="text-4xl font-bold text-base-content mb-4">
                            Link Not Found
                        </h1>
                        <p className="text-lg text-base-content/70 mb-2">
                            The link{' '}
                            <span className="font-mono text-primary">
                                /{slug}
                            </span>{' '}
                            does not exist.
                        </p>
                        <p className="text-base-content/60">
                            It may have been deleted or you may have entered an
                            incorrect URL.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Check if link is disabled
    if (!link.enabled) {
        return (
            <div className="container mx-auto max-w-4xl">
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                    <div className="mb-8">
                        <AlertTriangle
                            size={64}
                            className="text-warning mx-auto mb-4"
                        />
                        <h1 className="text-4xl font-bold text-base-content mb-4">
                            Link Disabled
                        </h1>
                        <p className="text-lg text-base-content/70 mb-2">
                            The link{' '}
                            <span className="font-mono text-primary">
                                /{slug}
                            </span>{' '}
                            has been disabled.
                        </p>
                        <p className="text-base-content/60">
                            This link is no longer accessible.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Check if link has expired
    if (link.expiresAt && link.expiresAt < now) {
        return (
            <div className="container mx-auto max-w-4xl">
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                    <div className="mb-8">
                        <AlertTriangle
                            size={64}
                            className="text-warning mx-auto mb-4"
                        />
                        <h1 className="text-4xl font-bold text-base-content mb-4">
                            Link Expired
                        </h1>
                        <p className="text-lg text-base-content/70 mb-2">
                            The link{' '}
                            <span className="font-mono text-primary">
                                /{slug}
                            </span>{' '}
                            has expired.
                        </p>
                        <p className="text-base-content/60">
                            This link expired on{' '}
                            {link.expiresAt.toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                            .
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Check if link hasn't started yet
    if (link.startsAt && link.startsAt > now) {
        return (
            <div className="container mx-auto max-w-4xl">
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                    <div className="mb-8">
                        <AlertTriangle
                            size={64}
                            className="text-info mx-auto mb-4"
                        />
                        <h1 className="text-4xl font-bold text-base-content mb-4">
                            Link Not Available Yet
                        </h1>
                        <p className="text-lg text-base-content/70 mb-2">
                            The link{' '}
                            <span className="font-mono text-primary">
                                /{slug}
                            </span>{' '}
                            is not available yet.
                        </p>
                        <p className="text-base-content/60">
                            This link will be available starting{' '}
                            {link.startsAt.toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit',
                            })}
                            .
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Track the click
    try {
        const headersList = await headers();
        const userAgent = headersList.get('user-agent') || '';
        const forwardedFor = headersList.get('x-forwarded-for');
        const realIp = headersList.get('x-real-ip');

        // Get IP address (prioritize x-forwarded-for, then x-real-ip, fallback to localhost)
        let ipAddress = 'unknown';
        if (forwardedFor) {
            ipAddress = forwardedFor.split(',')[0].trim();
        } else if (realIp) {
            ipAddress = realIp;
        }

        // Get country from IP (only if not localhost)
        let country = null;
        if (
            ipAddress !== 'unknown' &&
            ipAddress !== '127.0.0.1' &&
            ipAddress !== 'localhost'
        ) {
            country = await getCountryFromIp(ipAddress);
        }

        // Check if this IP has visited this link before (for visitor count)
        const existingClick = await db.click.findFirst({
            where: {
                linkId: link.id,
                ipAddress,
            },
        });

        const isNewVisitor = !existingClick;

        // Save the click analytics and increment counters
        await db.$transaction([
            db.click.create({
                data: {
                    linkId: link.id,
                    ipAddress,
                    userAgent,
                    country,
                },
            }),
            db.link.update({
                where: { id: link.id },
                data: {
                    clickCount: {
                        increment: 1,
                    },
                    ...(isNewVisitor && {
                        visitorCount: {
                            increment: 1,
                        },
                    }),
                },
            }),
        ]);
    } catch (error) {
        console.error('Error tracking click:', error);
        // Don't block redirect if analytics fail
    }

    // Redirect to the original URL
    redirect(link.url);
}
