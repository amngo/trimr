'use client';

import { motion } from 'motion/react';
import { usePathname } from 'next/navigation';

interface FadeTransitionProps {
    children: React.ReactNode;
}

export default function FadeTransition({ children }: FadeTransitionProps) {
    const pathname = usePathname();

    return (
        <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{
                duration: 0.3,
                ease: [0.25, 0.1, 0.25, 1],
            }}
            className="w-full"
        >
            {children}
        </motion.div>
    );
}