import React from 'react';
import { describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../../src/App';

// Mock React Router
vi.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <div data-testid="router-mock">{children}</div>,
  Routes: ({ children }: { children: React.ReactNode }) => <div data-testid="routes-mock">{children}</div>,
  Route: () => <div data-testid="route-mock">Route Mock</div>,
  Navigate: () => <div data-testid="navigate-mock">Navigate Mock</div>,
}));

// Mock des composants
vi.mock('../../src/components/forms', () => ({
  FormSection: () => <div data-testid="form-section-mock">FormSection Mock</div>,
}));

vi.mock('../../src/components/features', () => ({
  ThemeToggle: () => <div data-testid="theme-toggle-mock">ThemeToggle Mock</div>,
}));

vi.mock('../../src/components/layout', () => ({
  Header: () => <div data-testid="header-mock">Header Mock</div>,
  Navigation: () => <div data-testid="navigation-mock">Navigation Mock</div>,
}));

// Mock des pages
vi.mock('../../src/pages', () => ({
  HomePage: () => <div data-testid="home-page-mock">HomePage Mock</div>,
  ManualEntryPage: () => <div data-testid="manual-entry-page-mock">ManualEntryPage Mock</div>,
  CalculatedEntryPage: () => <div data-testid="calculated-entry-page-mock">CalculatedEntryPage Mock</div>,
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
    expect(screen.getByTestId('navigation-mock')).toBeInTheDocument();
    expect(screen.getByTestId('router-mock')).toBeInTheDocument();
    expect(screen.getByTestId('routes-mock')).toBeInTheDocument();
    expect(screen.getByTestId('toast-container-mock')).toBeInTheDocument();
  });

  test('utilise la classe min-h-screen pour le conteneur principal', () => {
    render(<App />);
    
    // Le premier enfant du router est le div principal
    const mainDiv = screen.getByTestId('router-mock').firstChild as HTMLElement;
    
    expect(mainDiv).toHaveClass('min-h-screen');
    expect(mainDiv).toHaveClass('bg-white');
    expect(mainDiv).toHaveClass('dark:bg-gray-900');
  });
}); 