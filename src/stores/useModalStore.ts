import { create } from 'zustand';

interface ModalState {
    isCreateLinkModalOpen: boolean;
    openCreateLinkModal: () => void;
    closeCreateLinkModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
    isCreateLinkModalOpen: false,
    openCreateLinkModal: () => set({ isCreateLinkModalOpen: true }),
    closeCreateLinkModal: () => set({ isCreateLinkModalOpen: false }),
}));