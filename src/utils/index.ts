import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
export * from './filterAndSort';
export * from './linkUtils';
export * from './logger';

export function cn(...args: ClassValue[]) {
    return twMerge(clsx(args));
}
