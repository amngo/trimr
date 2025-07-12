import { create } from 'zustand';

interface ModalState {
    isCreateLinkModalOpen: boolean;
    openCreateLinkModal: () => void;
    closeCreateLinkModal: () => void;
    isBulkUploadModalOpen: boolean;
    openBulkUploadModal: () => void;
    closeBulkUploadModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
    isCreateLinkModalOpen: false,
    openCreateLinkModal: () => set({ isCreateLinkModalOpen: true }),
    closeCreateLinkModal: () => set({ isCreateLinkModalOpen: false }),
    isBulkUploadModalOpen: false,
    openBulkUploadModal: () => set({ isBulkUploadModalOpen: true }),
    closeBulkUploadModal: () => set({ isBulkUploadModalOpen: false }),
}));