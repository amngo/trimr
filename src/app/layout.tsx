import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import QueryProvider from '@/providers/QueryProvider';
import { ErrorBoundary, Modals, ToastContainer } from '@/components/common';
import { Analytics } from '@vercel/analytics/next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'trimr',
    description: 'A simple and fast URL shortener',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" data-theme="dark">
            <body className={inter.className}>
                <QueryProvider>
                    <div className="min-h-screen bg-base-200">
                        <main className="mx-auto">
                            <ErrorBoundary>{children}</ErrorBoundary>
                        </main>
                        <ToastContainer />
                    </div>
                    <Modals />
                </QueryProvider>
                <Analytics />
            </body>
        </html>
    );
}
