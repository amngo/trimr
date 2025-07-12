import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import QueryProvider from '@/providers/QueryProvider';
import FadeTransition from '@/components/transitions/FadeTransition';
import AuthButton from '@/components/ui/AuthButton';
import ToastContainer from '@/components/ui/ToastContainer';

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
        <html lang="en">
            <body className={inter.className}>
                <QueryProvider>
                    <div className="min-h-screen bg-base-200">
                        <header className="bg-base-100 border-b border-base-300">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <div className="flex justify-between items-center py-2">
                                    <h1 className="text-xl font-semibold">
                                        trimr
                                    </h1>
                                    <AuthButton />
                                </div>
                            </div>
                        </header>
                        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                            <FadeTransition>{children}</FadeTransition>
                        </main>
                        <ToastContainer />
                    </div>
                </QueryProvider>
            </body>
        </html>
    );
}
