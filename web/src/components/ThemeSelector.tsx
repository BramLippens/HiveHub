/**
 * ThemeSelector Component
 * Dropdown component for selecting color themes
 */

import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import type { ThemeName } from '../types/theme.types';
import { themes } from '../types/theme.types';
import './ThemeSelector.css';

export function ThemeSelector() {
  const { currentTheme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  // Close dropdown on Escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen]);

  const handleThemeSelect = (themeName: ThemeName) => {
    setTheme(themeName);
    setIsOpen(false);
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const currentThemeData = themes[currentTheme];

  return (
    <div className="theme-selector" ref={dropdownRef}>
      <button
        className="theme-selector-button"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Select color theme"
      >
        <div
          className="theme-color-indicator"
          style={{
            background: `linear-gradient(135deg, ${currentThemeData.primaryGradient1} 0%, ${currentThemeData.primaryGradient2} 100%)`,
          }}
          aria-hidden="true"
        />
        <span className="theme-selector-label">{currentThemeData.name}</span>
        <svg
          className={`theme-selector-arrow ${isOpen ? 'open' : ''}`}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M2 4L6 8L10 4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="theme-dropdown" role="menu">
          {Object.entries(themes).map(([themeName, themeData]) => (
            <button
              key={themeName}
              className={`theme-option ${currentTheme === themeName ? 'active' : ''}`}
              onClick={() => handleThemeSelect(themeName as ThemeName)}
              role="menuitem"
              aria-label={`Select ${themeData.name} theme`}
            >
              <div
                className="theme-option-preview"
                style={{
                  background: `linear-gradient(135deg, ${themeData.primaryGradient1} 0%, ${themeData.primaryGradient2} 100%)`,
                }}
                aria-hidden="true"
              />
              <span className="theme-option-name">{themeData.name}</span>
              {currentTheme === themeName && (
                <svg
                  className="theme-option-check"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M13 4L6 11L3 8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
