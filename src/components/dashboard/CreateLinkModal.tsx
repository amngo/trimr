'use client';
import { useRef, useEffect } from 'react';
import { useCreateLink } from '@/hooks/useLinks';
import { useFormStore } from '@/stores';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { AnimatePresence, motion } from 'motion/react';
import URLInput from '../forms/URLInput';
import SlugInput from '../forms/SlugInput';
import ExpirationSelect from '../forms/ExpirationSelect';
import FormMessages from './FormMessages';
import FormActions from './FormActions';
import StartingDateInput from '../forms/StartingDateInput';
import Button from '../ui/Button';
import { X } from 'lucide-react';

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

    const handleSubmit = async (formData: FormData) => {
        setResult(null);

        try {
            const response = await createLink.mutateAsync({
                url: formData.get('url') as string,
                customSlug: (formData.get('customSlug') as string) || undefined,
                startingDate:
                    (formData.get('startingDate') as string) || undefined,
                expiration: (formData.get('expiration') as string) || undefined,
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
        resetForm();
        onClose();
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
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/25"
                    />
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <DialogPanel
                                as={motion.div}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="w-full max-w-2xl transform overflow-hidden rounded bg-base-100 p-8 shadow"
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <DialogTitle className="text-2xl font-bold leading-6 text-base-content">
                                        Create New Link
                                    </DialogTitle>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        shape="square"
                                        onClick={handleClose}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>

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
                    </div>
                </Dialog>
            )}
        </AnimatePresence>
    );
}
