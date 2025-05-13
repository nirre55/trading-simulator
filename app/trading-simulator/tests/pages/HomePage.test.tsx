import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, expect, test, vi } from 'vitest';
import { HomePage } from '../../src/pages';

// Mock pour react-router-dom
vi.mock('react-router-dom', () => ({
  Link: ({ children, to, className }: { children: React.ReactNode, to: string, className: string }) => (
    <a href={to} className={className} data-testid={`link-to-${to}`}>{children}</a>
  )
}));

// Mock pour i18next
vi.mock('react-i18next', () => {
  const useTranslation = () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'app.title': 'Simulateur de Trading',
        'tabs.manual': 'Points d\'entrée manuels',
        'tabs.calculated': 'Points d\'entrée calculés',
        'home.manualDescription': 'Définir manuellement les prix d\'entrée pour votre stratégie',
        'home.calculatedDescription': 'Calculer les prix d\'entrée selon les pourcentages de baisse'
      };
      return translations[key] || key;
    }
  });
  
  return { useTranslation };
});

describe('HomePage Component', () => {
  test('affiche le titre de l\'application', () => {
    render(<HomePage />);
    
    expect(screen.getByText('Simulateur de Trading')).toBeInTheDocument();
  });
  
  test('contient des liens vers les pages de points d\'entrée', () => {
    render(<HomePage />);
    
    expect(screen.getByTestId('link-to-/manual')).toBeInTheDocument();
    expect(screen.getByTestId('link-to-/calculated')).toBeInTheDocument();
  });
  
  test('affiche les descriptions des fonctionnalités', () => {
    render(<HomePage />);
    
    expect(screen.getByText('Définir manuellement les prix d\'entrée pour votre stratégie')).toBeInTheDocument();
    expect(screen.getByText('Calculer les prix d\'entrée selon les pourcentages de baisse')).toBeInTheDocument();
  });
  
  test('a un design en grille responsive', () => {
    const { container } = render(<HomePage />);
    
    // Vérifier que le conteneur principal utilise les classes appropriées
    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass('max-w-6xl');
    expect(mainDiv).toHaveClass('mx-auto');

    // Vérifier que les liens sont disposés en grille
    const grid = screen.getByTestId('link-to-/manual').parentElement;
    expect(grid).toHaveClass('grid');
    expect(grid).toHaveClass('grid-cols-1');
    expect(grid).toHaveClass('md:grid-cols-2');
  });
}); 