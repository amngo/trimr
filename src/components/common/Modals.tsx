'use client';

import { CreateLinkModal, BulkUploadModal } from '../features/links';
import { useModalStore } from '@/stores';

export default function Modals() {
    const {
        isCreateLinkModalOpen,
        closeCreateLinkModal,
        isBulkUploadModalOpen,
        closeBulkUploadModal,
    } = useModalStore();
    return (
        <>
            <CreateLinkModal
                isOpen={isCreateLinkModalOpen}
                onClose={closeCreateLinkModal}
            />

            <BulkUploadModal
                isOpen={isBulkUploadModalOpen}
                onClose={closeBulkUploadModal}
            />
        </>
    );
}
