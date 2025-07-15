'use client';
import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { FadeTransition } from '../transitions';

interface AppLayoutProps {
    children: ReactNode;
    showHeader?: boolean;
}

export default function AppLayout({ children }: AppLayoutProps) {
    return (
        <div className="min-h-screen flex">
            <Sidebar />

            <div className="flex flex-col h-full w-full">
                <Header />
                <FadeTransition>
                    <div className="p-4 flex flex-col">{children}</div>
                </FadeTransition>
            </div>
        </div>
    );
}
