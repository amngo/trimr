import { Sun, Moon } from 'lucide-react';
import { useUIStore } from '@/stores';
import { useEffect } from 'react';

export default function ThemeToggle() {
    const { theme, toggleTheme } = useUIStore();

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    return (
        <button
            onClick={toggleTheme}
            className="btn btn-circle"
            aria-label="Toggle theme"
        >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
    );
}
