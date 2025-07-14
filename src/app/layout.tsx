import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import QueryProvider from '@/providers/QueryProvider';
import FadeTransition from '@/components/transitions/FadeTransition';
import { ErrorBoundary, Modals, ToastContainer } from '@/components/ui';

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
                        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                            <ErrorBoundary>
                                <FadeTransition>{children}</FadeTransition>
                            </ErrorBoundary>
                        </main>
                        <ToastContainer />
                    </div>
                    <Modals />
                </QueryProvider>
            </body>
        </html>
    );
}
