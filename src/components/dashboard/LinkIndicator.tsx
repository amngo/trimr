import { cn } from '@/utils';

export default function LinkIndicator({ enabled }: { enabled: boolean }) {
    return (
        <div
            className={cn(
                'absolute w-2 h-full top-0 left-0 transition-colors duration-300',
                enabled ? 'bg-success' : 'bg-error'
            )}
        />
    );
}
