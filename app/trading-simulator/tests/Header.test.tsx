import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Header from '../src/components/layout/Header';

// Mocker i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      // Simuler les traductions
      const translations: Record<string, string> = {
        'app.title': 'Trading Simulator'
      };
      return translations[key] || key;
    },
    i18n: {
      changeLanguage: vi.fn(),
      language: 'en',
    },
  }),
}));

// Moquer LanguageSelector
vi.mock('../src/components/ui', () => ({
  LanguageSelector: () => <div data-testid="language-selector">Language Selector</div>,
}));

// Moquer ThemeToggle
vi.mock('../src/components/features', () => ({
  ThemeToggle: () => <div data-testid="theme-toggle">Theme Toggle</div>,
}));

describe('Header Component', () => {
  it('renders header with title', () => {
    render(<Header />);
    
    // Vérifier que le titre est présent
    expect(screen.getByText('Trading Simulator')).toBeDefined();
  });

  it('includes language selector', () => {
    render(<Header />);
    
    // Vérifier que le sélecteur de langue est présent
    expect(screen.getByTestId('language-selector')).toBeDefined();
  });

  it('includes theme toggle', () => {
    render(<Header />);
    
    // Vérifier que le toggle de thème est présent
    expect(screen.getByTestId('theme-toggle')).toBeDefined();
  });
}); 