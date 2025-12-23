/**
 * ThemeContext
 * React Context for managing theme state and persistence
 */

import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { ThemeName } from '../types/theme.types';
import { themes, DEFAULT_THEME } from '../types/theme.types';

interface ThemeContextType {
  currentTheme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'movie-collection-theme';

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [currentTheme, setCurrentTheme] = useState<ThemeName>(() => {
    // Load theme from localStorage on mount
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme && savedTheme in themes) {
      return savedTheme as ThemeName;
    }
    return DEFAULT_THEME;
  });

  useEffect(() => {
    // Apply theme CSS variables to document root
    const theme = themes[currentTheme];
    const root = document.documentElement;

    root.style.setProperty('--bg-gradient-1', theme.bgGradient1);
    root.style.setProperty('--bg-gradient-2', theme.bgGradient2);
    root.style.setProperty('--bg-gradient-3', theme.bgGradient3);
    root.style.setProperty('--primary-gradient-1', theme.primaryGradient1);
    root.style.setProperty('--primary-gradient-2', theme.primaryGradient2);
    root.style.setProperty('--accent-color', theme.accentColor);

    // Save theme to localStorage
    localStorage.setItem(THEME_STORAGE_KEY, currentTheme);
  }, [currentTheme]);

  const setTheme = (theme: ThemeName) => {
    setCurrentTheme(theme);
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * useTheme Hook
 * Custom hook to access theme context
 */
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
