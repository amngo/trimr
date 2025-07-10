import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { db } from '@/lib/db';
import { getCountryFromIp } from '@/lib/utils';

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

    if (!link || (link.expiresAt && link.expiresAt < new Date())) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                            className="w-8 h-8 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                            />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        {!link ? 'Link Not Found' : 'Link Expired'}
                    </h1>
                    <p className="text-gray-600 mb-4">
                        {!link
                            ? "The short link you're looking for doesn't exist or has been removed."
                            : 'This link has expired and is no longer available.'}
                    </p>
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

        // Save the click analytics and increment click count
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
