'use client';

import { getFaviconUrl } from '@/utils/linkUtils';
import { CircleQuestionMarkIcon } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/utils';

interface LinkIconProps {
    url: string;
    className?: string;
}

export default function LinkIcon({
    url,
    className = 'w-5 h-5',
}: LinkIconProps) {
    const [imageError, setImageError] = useState(false);

    if (imageError) {
        return (
            <div className="border border-gray-200 rounded p-2 bg-white">
                <CircleQuestionMarkIcon className={cn(className)} />
            </div>
        );
    }

    return (
        <div className="rounded p-2 bg-white">
            <img
                src={getFaviconUrl(url)}
                alt="Site icon"
                className={cn(className)}
                onError={() => setImageError(true)}
            />
        </div>
    );
}
