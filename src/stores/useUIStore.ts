import { create } from 'zustand';

interface UIState {
    sidebarOpen: boolean;
    theme: 'light' | 'dark';
    setSidebarOpen: (open: boolean) => void;
    toggleSidebar: () => void;
    setTheme: (theme: 'light' | 'dark') => void;
    toggleTheme: () => void;
}

export const useUIStore = create<UIState>((set, get) => ({
    sidebarOpen: false,
    theme: 'dark',
    setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
    toggleSidebar: () => set({ sidebarOpen: !get().sidebarOpen }),
    setTheme: (theme: 'light' | 'dark') => set({ theme }),
    toggleTheme: () =>
        set({ theme: get().theme === 'light' ? 'dark' : 'light' }),
}));
