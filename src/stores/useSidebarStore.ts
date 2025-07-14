'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SidebarState {
    isOpen: boolean;
    isMobile: boolean;
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
    setIsMobile: (mobile: boolean) => void;
}

export const useSidebarStore = create<SidebarState>()(
    persist(
        (set) => ({
            isOpen: true,
            isMobile: false,
            toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
            setSidebarOpen: (open: boolean) => set({ isOpen: open }),
            setIsMobile: (mobile: boolean) => set({ isMobile: mobile }),
        }),
        {
            name: 'sidebar-storage',
            partialize: (state) => ({ isOpen: state.isOpen }),
        },
    ),
);
