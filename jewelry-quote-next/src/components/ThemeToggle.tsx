"use client";

import React from 'react';
import { useTheme } from './ThemeProvider';
import { Moon, Sun } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="secondary"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            style={{ padding: '10px' }}
        >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </button>
    );
};
