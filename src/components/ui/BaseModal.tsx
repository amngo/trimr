'use client';

import { ReactNode } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui';

interface BaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
};

export default function BaseModal({
    isOpen,
    onClose,
    title,
    children,
    maxWidth = '2xl',
}: BaseModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <Dialog
                    static
                    open={isOpen}
                    onClose={onClose}
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
                                className={`w-full ${maxWidthClasses[maxWidth]} transform overflow-hidden rounded bg-base-100 p-8 shadow`}
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <DialogTitle className="text-2xl font-bold leading-6 text-base-content">
                                        {title}
                                    </DialogTitle>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        shape="square"
                                        onClick={onClose}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                                {children}
                            </DialogPanel>
                        </div>
                    </div>
                </Dialog>
            )}
        </AnimatePresence>
    );
}