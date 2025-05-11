import React from 'react';
import { describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../src/App';

// Mock des composants
vi.mock('../src/components/forms', () => ({
  FormSection: () => <div data-testid="form-section-mock">FormSection Mock</div>,
}));

vi.mock('../src/components/features', () => ({
  ThemeToggle: () => <div data-testid="theme-toggle-mock">ThemeToggle Mock</div>,
}));

vi.mock('../src/components/layout', () => ({
  Header: () => <div data-testid="header-mock">Header Mock</div>,
}));

// Mock react-toastify
vi.mock('react-toastify', () => ({
  ToastContainer: () => <div data-testid="toast-container-mock">ToastContainer Mock</div>,
}));

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('App Component', () => {
  test('rend tous les composants principaux', () => {
    render(<App />);
    
    // Vérifier que tous les composants principaux sont rendus
    expect(screen.getByTestId('header-mock')).toBeInTheDocument();
    expect(screen.getByTestId('form-section-mock')).toBeInTheDocument();
    expect(screen.getByTestId('toast-container-mock')).toBeInTheDocument();
  });

  test('utilise la classe min-h-screen pour le conteneur principal', () => {
    const { container } = render(<App />);
    const mainDiv = container.firstChild as HTMLElement;
    
    expect(mainDiv).toHaveClass('min-h-screen');
    expect(mainDiv).toHaveClass('bg-white');
    expect(mainDiv).toHaveClass('dark:bg-gray-900');
  });
}); 