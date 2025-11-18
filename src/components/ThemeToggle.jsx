import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = React.memo(() => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-2 text-zinc-400 hover:text-white transition-colors"
            aria-label="Toggle theme"
        >
            {theme === 'dark' ? (
                <i className="ri-sun-line text-2xl"></i>
            ) : (
                <i className="ri-moon-line text-2xl"></i>
            )}
        </button>
    );
});

ThemeToggle.displayName = 'ThemeToggle';

export default ThemeToggle;

