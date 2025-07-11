import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import QueryProvider from '@/providers/QueryProvider';
import FadeTransition from '@/components/FadeTransition';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Link Shortener',
    description: 'A simple and fast URL shortener',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <QueryProvider>
                    <div className="min-h-screen bg-base-200">
                        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                            <FadeTransition>
                                {children}
                            </FadeTransition>
                        </main>
                    </div>
                </QueryProvider>
            </body>
        </html>
    );
}
