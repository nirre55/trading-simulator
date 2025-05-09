// tests/LanguageSelector.test.tsx
import React from 'react';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import LanguageSelector from '../src/components/ui/LanguageSelector';

// Mock pour i18next et récupération du mock pour les tests
const mockChangeLanguage = vi.fn();
const mockI18n = { language: 'fr', changeLanguage: mockChangeLanguage };

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: mockI18n
  })
}));

// Mock pour localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn()
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('LanguageSelector Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders FR and EN buttons', () => {
    render(<LanguageSelector />);
    
    expect(screen.getByText('FR')).toBeDefined();
    expect(screen.getByText('EN')).toBeDefined();
  });

  test('FR button has active style when language is fr', () => {
    const { container } = render(<LanguageSelector />);
    
    const frButton = screen.getByText('FR');
    const enButton = screen.getByText('EN');
    
    // On vérifie que le bouton FR a une classe qui contient bg-blue-500
    expect(frButton.className).toContain('bg-blue-500');
    // On vérifie que le bouton EN n'a pas cette classe
    expect(enButton.className).not.toContain('bg-blue-500');
  });

  test('calls changeLanguage and sets localStorage when language button is clicked', () => {
    render(<LanguageSelector />);
    
    const enButton = screen.getByText('EN');
    fireEvent.click(enButton);
    
    // Vérifier que la fonction changeLanguage est appelée avec 'en'
    expect(mockChangeLanguage).toHaveBeenCalledWith('en');
    
    // Vérifier que localStorage.setItem est appelé avec 'i18nextLng' et 'en'
    expect(localStorageMock.setItem).toHaveBeenCalledWith('i18nextLng', 'en');
  });
}); 