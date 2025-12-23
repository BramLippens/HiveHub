/**
 * Theme Types
 * TypeScript interfaces for theme configuration
 */

export interface ThemeColors {
  name: string;
  bgGradient1: string;
  bgGradient2: string;
  bgGradient3: string;
  primaryGradient1: string;
  primaryGradient2: string;
  accentColor: string;
}

export type ThemeName =
  | 'purple-twilight'
  | 'ocean-blue'
  | 'forest-green'
  | 'sunset-orange'
  | 'rose-pink';

export const themes: Record<ThemeName, ThemeColors> = {
  'purple-twilight': {
    name: 'Purple Twilight',
    bgGradient1: '#0f0c29',
    bgGradient2: '#302b63',
    bgGradient3: '#24243e',
    primaryGradient1: '#667eea',
    primaryGradient2: '#764ba2',
    accentColor: '#667eea',
  },
  'ocean-blue': {
    name: 'Ocean Blue',
    bgGradient1: '#0a192f',
    bgGradient2: '#1e3a5f',
    bgGradient3: '#0f2744',
    primaryGradient1: '#3b82f6',
    primaryGradient2: '#1e40af',
    accentColor: '#3b82f6',
  },
  'forest-green': {
    name: 'Forest Green',
    bgGradient1: '#0d1b0e',
    bgGradient2: '#1a3d1f',
    bgGradient3: '#142817',
    primaryGradient1: '#10b981',
    primaryGradient2: '#047857',
    accentColor: '#10b981',
  },
  'sunset-orange': {
    name: 'Sunset Orange',
    bgGradient1: '#1a0e0a',
    bgGradient2: '#4a2515',
    bgGradient3: '#2d1810',
    primaryGradient1: '#f97316',
    primaryGradient2: '#ea580c',
    accentColor: '#f97316',
  },
  'rose-pink': {
    name: 'Rose Pink',
    bgGradient1: '#1a0a14',
    bgGradient2: '#4a1533',
    bgGradient3: '#2d1020',
    primaryGradient1: '#ec4899',
    primaryGradient2: '#be185d',
    accentColor: '#ec4899',
  },
};

export const DEFAULT_THEME: ThemeName = 'purple-twilight';
