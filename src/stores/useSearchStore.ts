import { create } from 'zustand';

export type SortBy = 'createdAt' | 'clickCount' | 'slug' | 'url';
export type SortOrder = 'asc' | 'desc';
export type FilterStatus = 'all' | 'active' | 'expired' | 'disabled';
export type FilterTimeRange = 'all' | '7d' | '30d' | '90d';

interface SearchState {
    searchTerm: string;
    sortBy: SortBy;
    sortOrder: SortOrder;
    filterStatus: FilterStatus;
    filterTimeRange: FilterTimeRange;
    setSearchTerm: (term: string) => void;
    clearSearch: () => void;
    setSortBy: (sortBy: SortBy) => void;
    setSortOrder: (sortOrder: SortOrder) => void;
    toggleSortOrder: () => void;
    setFilterStatus: (status: FilterStatus) => void;
    setFilterTimeRange: (range: FilterTimeRange) => void;
    resetFilters: () => void;
}

export const useSearchStore = create<SearchState>((set, get) => ({
    searchTerm: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    filterStatus: 'all',
    filterTimeRange: 'all',
    setSearchTerm: (term: string) => set({ searchTerm: term }),
    clearSearch: () => set({ searchTerm: '' }),
    setSortBy: (sortBy: SortBy) => set({ sortBy }),
    setSortOrder: (sortOrder: SortOrder) => set({ sortOrder }),
    toggleSortOrder: () => set({ sortOrder: get().sortOrder === 'asc' ? 'desc' : 'asc' }),
    setFilterStatus: (status: FilterStatus) => set({ filterStatus: status }),
    setFilterTimeRange: (range: FilterTimeRange) => set({ filterTimeRange: range }),
    resetFilters: () => set({
        searchTerm: '',
        sortBy: 'createdAt',
        sortOrder: 'desc',
        filterStatus: 'all',
        filterTimeRange: 'all',
    }),
}));