'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Link as LinkIcon, X, Home, Activity } from 'lucide-react';
import { useSidebarStore } from '@/stores';
import AuthButton from './AuthButton';

interface SidebarProps {
    className?: string;
}

export default function Sidebar({ className = '' }: SidebarProps) {
    const pathname = usePathname();
    const { isOpen, isMobile, setSidebarOpen, setIsMobile } = useSidebarStore();

    const navigationItems = [
        {
            name: 'Dashboard',
            href: '/dashboard',
            icon: Home,
            description: 'Manage your links',
        },
        {
            name: 'Analytics',
            href: '/stats',
            icon: BarChart3,
            description: 'View detailed analytics',
        },
    ];

    // Handle responsive behavior
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 1024; // lg breakpoint
            setIsMobile(mobile);
            // Don't auto-close on mobile - let user control it
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [setIsMobile]);

    // Close sidebar when clicking outside on mobile
    useEffect(() => {
        if (!isMobile) return;

        const handleOutsideClick = (e: MouseEvent) => {
            const sidebar = document.getElementById('sidebar');
            if (sidebar && !sidebar.contains(e.target as Node) && isOpen) {
                setSidebarOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleOutsideClick);
        }

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [isOpen, isMobile, setSidebarOpen]);

    const isActiveRoute = (href: string) => {
        if (href === '/dashboard') {
            return pathname === '/dashboard';
        }
        return pathname.startsWith(href);
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Mobile backdrop */}
            {isMobile && isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                id="sidebar"
                className={`
          sticky top-0 left-0 z-50 h-screen bg-base-100 border-r border-base-300
          transition-transform duration-300 ease-in-out
          ${isMobile ? 'w-80' : 'min-w-[250px]'}
          ${!isOpen && isMobile ? '-translate-x-full' : 'translate-x-0'} lg:translate-x-0
          ${className}
        `}
            >
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-6 bg-base-200 border-b border-base-300 h-[75px]">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                <LinkIcon className="w-5 h-5 text-primary-content" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-base-content">
                                    trimr
                                </h2>
                                <p className="text-xs text-base-content/60">
                                    URL Shortener
                                </p>
                            </div>
                        </div>

                        {/* Close button for mobile */}
                        {isMobile && (
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="btn btn-ghost btn-sm"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 flex flex-col justify-between">
                        <div className="space-y-2">
                            {navigationItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = isActiveRoute(item.href);

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() =>
                                            isMobile && setSidebarOpen(false)
                                        }
                                        className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                      hover:bg-base-200
                      ${
                          isActive
                              ? 'bg-primary text-primary-content shadow-md'
                              : 'text-base-content hover:text-primary'
                      }
                    `}
                                    >
                                        <Icon className="w-5 h-5 flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium truncate">
                                                {item.name}
                                            </div>
                                            <div
                                                className={`text-xs truncate ${isActive ? 'text-primary-content/80' : 'text-base-content/60'}`}
                                            >
                                                {item.description}
                                            </div>
                                        </div>
                                        {isActive && (
                                            <div className="w-2 h-2 bg-primary-content rounded-full" />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                        <AuthButton />
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-base-300">
                        <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                            <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                                <Activity className="w-4 h-4 text-success-content" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-base-content">
                                    Status
                                </div>
                                <div className="text-xs text-success">
                                    All systems online
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
