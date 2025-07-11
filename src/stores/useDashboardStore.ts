import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DashboardState {
    viewMode: 'grid' | 'list';
    sortBy: 'created' | 'clicks' | 'name';
    sortOrder: 'asc' | 'desc';
    setViewMode: (mode: 'grid' | 'list') => void;
    setSortBy: (sort: 'created' | 'clicks' | 'name') => void;
    setSortOrder: (order: 'asc' | 'desc') => void;
    toggleSortOrder: () => void;
}

export const useDashboardStore = create<DashboardState>()(
    persist(
        (set, get) => ({
            viewMode: 'list',
            sortBy: 'created',
            sortOrder: 'desc',
            setViewMode: (mode) => set({ viewMode: mode }),
            setSortBy: (sort) => set({ sortBy: sort }),
            setSortOrder: (order) => set({ sortOrder: order }),
            toggleSortOrder: () => set({ sortOrder: get().sortOrder === 'asc' ? 'desc' : 'asc' }),
        }),
        {
            name: 'dashboard-settings',
        }
    )
);