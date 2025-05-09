import React from 'react';
import { describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Header from '../src/components/layout/Header';

// Simulation des traductions
const translations: Record<string, Record<string, string>> = {
  fr: {},
  en: {}
};

// Mock pour i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key, // Retourne simplement la clé
    i18n: {
      language: 'fr',
      changeLanguage: vi.fn()
    }
  })
}));

// Mock pour le sélecteur de langue
vi.mock('../src/components/ui/LanguageSelector', () => ({
  default: () => <div data-testid="language-selector">Language Selector</div>
}));

// Mock pour le toggle du thème
vi.mock('../src/components/features/ThemeToggle', () => ({
  default: () => <div data-testid="theme-toggle">Theme Toggle</div>
}));

describe('Header Component', () => {
  test('renders header with title', () => {
    render(<Header />);
    
    // Vérifier que le titre est présent
    expect(screen.getByText('Trading Simulator')).toBeDefined();
  });

  test('includes language selector', () => {
    render(<Header />);
    
    // Vérifier que le sélecteur de langue est présent
    expect(screen.getByTestId('language-selector')).toBeDefined();
  });

  test('includes theme toggle', () => {
    render(<Header />);
    
    // Vérifier que le toggle de thème est présent
    expect(screen.getByTestId('theme-toggle')).toBeDefined();
  });
}); 