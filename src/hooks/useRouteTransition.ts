'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function useRouteTransition() {
    const pathname = usePathname();
    const router = useRouter();
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [previousPath, setPreviousPath] = useState<string | null>(null);

    useEffect(() => {
        if (previousPath !== null && previousPath !== pathname) {
            setIsTransitioning(true);
            const timer = setTimeout(() => {
                setIsTransitioning(false);
            }, 400);

            return () => clearTimeout(timer);
        }
        setPreviousPath(pathname);
    }, [pathname, previousPath]);

    const navigateWithTransition = (href: string) => {
        setIsTransitioning(true);
        router.push(href);
    };

    return {
        isTransitioning,
        navigateWithTransition,
        currentPath: pathname,
    };
}