'use client';

import { motion, AnimatePresence } from 'motion/react';

interface LoadingOverlayProps {
    isVisible: boolean;
}

export default function LoadingOverlay({ isVisible }: LoadingOverlayProps) {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 bg-base-200/70 backdrop-blur-sm z-50 flex items-center justify-center"
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.2, delay: 0.1 }}
                        className="bg-base-100 rounded-lg p-8 shadow-lg"
                    >
                        <div className="flex items-center space-x-3">
                            <div className="loading loading-spinner loading-md text-primary"></div>
                            <span className="text-base-content">Loading...</span>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}