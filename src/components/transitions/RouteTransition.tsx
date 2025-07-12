'use client';

import { motion, AnimatePresence } from 'motion/react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface RouteTransitionProps {
    children: React.ReactNode;
}


const loadingVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
};

export default function RouteTransition({ children }: RouteTransitionProps) {
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(false);
    const [displayChildren, setDisplayChildren] = useState(children);

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setDisplayChildren(children);
            setIsLoading(false);
        }, 100);

        return () => clearTimeout(timer);
    }, [children, pathname]);

    return (
        <div className="relative w-full min-h-screen">
            <AnimatePresence mode="wait">
                {isLoading ? (
                    <motion.div
                        key="loading"
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        variants={loadingVariants}
                        className="absolute inset-0 flex items-center justify-center bg-base-200/50 backdrop-blur-sm z-50"
                    >
                        <div className="loading loading-spinner loading-lg text-primary"></div>
                    </motion.div>
                ) : (
                    <motion.div
                        key={pathname}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{
                            duration: 0.4,
                            ease: [0.25, 0.1, 0.25, 1],
                        }}
                        className="w-full"
                    >
                        {displayChildren}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}