export default function LinkIndicator({ enabled }: { enabled: boolean }) {
    if (enabled) {
        return (
            <div className="absolute w-2 h-full top-0 left-0 bg-green-400" />
        );
    }
    return <div className="absolute w-2 h-full top-0 left-0 bg-red-400" />;
}
