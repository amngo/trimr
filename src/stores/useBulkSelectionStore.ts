import { create } from 'zustand';

interface BulkSelectionState {
    selectedLinkIds: Set<string>;
    isSelectionMode: boolean;
    selectAll: boolean;
    
    // Actions
    toggleSelectionMode: () => void;
    selectLink: (linkId: string) => void;
    deselectLink: (linkId: string) => void;
    toggleLink: (linkId: string) => void;
    selectAllLinks: (linkIds: string[]) => void;
    deselectAllLinks: () => void;
    toggleSelectAll: (linkIds: string[]) => void;
    clearSelection: () => void;
    
    // Computed getters
    getSelectedCount: () => number;
    isLinkSelected: (linkId: string) => boolean;
    hasSelection: () => boolean;
}

export const useBulkSelectionStore = create<BulkSelectionState>((set, get) => ({
    selectedLinkIds: new Set<string>(),
    isSelectionMode: false,
    selectAll: false,
    
    toggleSelectionMode: () => {
        const { isSelectionMode } = get();
        set({ 
            isSelectionMode: !isSelectionMode,
            selectedLinkIds: new Set(),
            selectAll: false
        });
    },
    
    selectLink: (linkId: string) => {
        const { selectedLinkIds } = get();
        const newSelected = new Set(selectedLinkIds);
        newSelected.add(linkId);
        set({ selectedLinkIds: newSelected });
    },
    
    deselectLink: (linkId: string) => {
        const { selectedLinkIds } = get();
        const newSelected = new Set(selectedLinkIds);
        newSelected.delete(linkId);
        set({ 
            selectedLinkIds: newSelected,
            selectAll: false
        });
    },
    
    toggleLink: (linkId: string) => {
        const { selectedLinkIds } = get();
        if (selectedLinkIds.has(linkId)) {
            get().deselectLink(linkId);
        } else {
            get().selectLink(linkId);
        }
    },
    
    selectAllLinks: (linkIds: string[]) => {
        set({ 
            selectedLinkIds: new Set(linkIds),
            selectAll: true
        });
    },
    
    deselectAllLinks: () => {
        set({ 
            selectedLinkIds: new Set(),
            selectAll: false
        });
    },
    
    toggleSelectAll: (linkIds: string[]) => {
        const { selectAll } = get();
        if (selectAll) {
            get().deselectAllLinks();
        } else {
            get().selectAllLinks(linkIds);
        }
    },
    
    clearSelection: () => {
        set({ 
            selectedLinkIds: new Set(),
            selectAll: false,
            isSelectionMode: false
        });
    },
    
    // Computed getters
    getSelectedCount: () => {
        return get().selectedLinkIds.size;
    },
    
    isLinkSelected: (linkId: string) => {
        return get().selectedLinkIds.has(linkId);
    },
    
    hasSelection: () => {
        return get().selectedLinkIds.size > 0;
    },
}));