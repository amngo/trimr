'use client';
import { useState, useRef, useEffect } from 'react';
import { createLink } from '@/app/actions';
import QRCode from 'qrcode';
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
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<{
        slug?: string;
        url?: string;
        error?: string;
    } | null>(null);
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [url, setUrl] = useState('');
    const [customSlug, setCustomSlug] = useState('');
    const [expiration, setExpiration] = useState('never');
    const [startingDate, setStartingDate] = useState('');
    const formRef = useRef<HTMLFormElement>(null);

    const shortUrl = result?.slug
        ? `trimr.in/${result.slug}`
        : customSlug
        ? `trimr.in/${customSlug}`
        : 'trimr.in/selcan';

    useEffect(() => {
        if (shortUrl) {
            QRCode.toDataURL(
                shortUrl,
                { width: 120, margin: 1 },
                (err, url) => {
                    if (!err) {
                        setQrCodeUrl(url);
                    }
                }
            );
        }
    }, [shortUrl]);

    if (!isOpen) return null;

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true);
        setResult(null);

        try {
            const response = await createLink(formData);
            if (response?.error) {
                setResult({ error: response.error });
            } else if (response?.success) {
                setResult({ slug: response.slug, url: response.url });
            }
        } catch (error) {
            console.error('Error creating link:', error);
            setResult({ error: 'An unexpected error occurred' });
        } finally {
            setIsLoading(false);
            handleClose();
        }
    };

    const handleClose = () => {
        onClose();
        setUrl('');
        setCustomSlug('');
        setExpiration('never');
        setResult(null);
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
                                    disabled={isLoading}
                                />

                                <SlugInput
                                    value={customSlug}
                                    onChange={setCustomSlug}
                                    disabled={isLoading}
                                />

                                <StartingDateInput
                                    value={startingDate}
                                    onChange={setStartingDate}
                                    disabled={isLoading}
                                />

                                <ExpirationSelect
                                    value={expiration}
                                    onChange={setExpiration}
                                    disabled={isLoading}
                                />

                                <FormActions
                                    isLoading={isLoading}
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
