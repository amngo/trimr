'use client';
import { useRef, useEffect } from 'react';
import { useCreateLink } from '@/hooks/useLinks';
import { useFormStore } from '@/stores';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { AnimatePresence, motion } from 'motion/react';
import URLInput from './URLInput';
import SlugInput from './SlugInput';
import ExpirationSelect from './ExpirationSelect';
import FormMessages from './FormMessages';
import FormActions from './FormActions';
import StartingDateInput from './StartingDateInput';

interface CreateLinkModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateLinkModal({
    isOpen,
    onClose,
}: CreateLinkModalProps) {
    const createLink = useCreateLink();
    const {
        url,
        customSlug,
        expiration,
        startingDate,
        result,
        setUrl,
        setCustomSlug,
        setExpiration,
        setStartingDate,
        setResult,
        resetForm,
    } = useFormStore();
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (!isOpen) {
            resetForm();
        }
    }, [isOpen, resetForm]);

    if (!isOpen) return null;

    const handleSubmit = async (formData: FormData) => {
        setResult(null);

        try {
            const response = await createLink.mutateAsync({
                url: formData.get('url') as string,
                customSlug: formData.get('customSlug') as string || undefined,
                expiration: formData.get('expiration') as string || undefined,
            });
            
            if (response?.error) {
                setResult({ error: response.error });
            } else if (response?.success) {
                setResult({ slug: response.slug, url: response.url });
            }
        } catch (error) {
            console.error('Error creating link:', error);
            setResult({ error: 'An unexpected error occurred' });
        } finally {
            handleClose();
        }
    };

    const handleClose = () => {
        onClose();
        resetForm();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <Dialog
                    static
                    open={isOpen}
                    onClose={handleClose}
                    className="relative z-50"
                >
                    <motion.div
                        key="modal-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/30"
                    />
                    <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                        <DialogPanel
                            key="modal-panel"
                            as={motion.div}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="space-y-4 bg-base-100 border border-base-300 p-8 rounded shadow"
                        >
                            <DialogTitle className="font-bold">
                                Create New Link
                            </DialogTitle>
                            <FormMessages result={result} />
                            <form
                                ref={formRef}
                                action={handleSubmit}
                                className="space-y-2"
                            >
                                <URLInput
                                    value={url}
                                    onChange={setUrl}
                                    disabled={createLink.isPending}
                                />

                                <SlugInput
                                    value={customSlug}
                                    onChange={setCustomSlug}
                                    disabled={createLink.isPending}
                                />

                                <StartingDateInput
                                    value={startingDate}
                                    onChange={setStartingDate}
                                    disabled={createLink.isPending}
                                />

                                <ExpirationSelect
                                    value={expiration}
                                    onChange={setExpiration}
                                    disabled={createLink.isPending}
                                />

                                <FormActions
                                    isLoading={createLink.isPending}
                                    url={url}
                                    onCancel={handleClose}
                                />
                            </form>
                        </DialogPanel>
                    </div>
                </Dialog>
            )}
        </AnimatePresence>
    );
}
