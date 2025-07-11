import { create } from 'zustand';

interface SearchState {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    clearSearch: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
    searchTerm: '',
    setSearchTerm: (term: string) => set({ searchTerm: term }),
    clearSearch: () => set({ searchTerm: '' }),
}));