'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/utils';

interface TransitionLinkProps {
    href: string;
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

export default function TransitionLink({
    href,
    children,
    className,
    onClick,
}: TransitionLinkProps) {
    const router = useRouter();
    const [isTransitioning, setIsTransitioning] = useState(false);

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        
        if (onClick) {
            onClick();
        }

        setIsTransitioning(true);
        
        // Small delay to allow for fade out animation
        setTimeout(() => {
            router.push(href);
            setIsTransitioning(false);
        }, 150);
    };

    return (
        <Link
            href={href}
            onClick={handleClick}
            className={cn(
                'transition-opacity duration-150',
                isTransitioning ? 'opacity-50' : 'opacity-100',
                className
            )}
        >
            {children}
        </Link>
    );
}