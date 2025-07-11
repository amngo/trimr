import { Sun, Moon } from 'lucide-react';
import { useUIStore } from '@/stores';

export default function ThemeToggle() {
    const { theme, toggleTheme } = useUIStore();

    return (
        <button
            onClick={toggleTheme}
            className="btn btn-ghost btn-circle"
            aria-label="Toggle theme"
        >
            {theme === 'light' ? (
                <Moon size={20} />
            ) : (
                <Sun size={20} />
            )}
        </button>
    );
}