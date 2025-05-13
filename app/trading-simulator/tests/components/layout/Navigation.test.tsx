import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, expect, test, vi } from 'vitest';
import { Navigation } from '../../../src/components/layout';

// Mock pour react-router-dom
vi.mock('react-router-dom', () => ({
  Link: ({ children, to, className }: { children: React.ReactNode, to: string, className: string }) => (
    <a href={to} className={className} data-testid={`link-to-${to}`}>{children}</a>
  ),
  useLocation: () => ({ pathname: '/manual' })
}));

// Mock pour i18next
vi.mock('react-i18next', () => {
  const useTranslation = () => ({
    t: (key: string) => key === 'navigation.manual' ? 'Points d\'entrée manuels' : 
                         key === 'navigation.calculated' ? 'Points d\'entrée calculés' : key
  });
  
  return { useTranslation };
});

describe('Navigation Component', () => {
  test('rend tous les liens de navigation', () => {
    render(<Navigation />);
    
    // Vérifier que les liens sont présents
    expect(screen.getByTestId('link-to-/manual')).toBeInTheDocument();
    expect(screen.getByTestId('link-to-/calculated')).toBeInTheDocument();
  });
  
  test('applique la classe active au lien actif', () => {
    render(<Navigation />);
    
    // Vérifier que le lien actif (/manual) a la classe bg-blue-600
    const manualLink = screen.getByTestId('link-to-/manual');
    expect(manualLink).toHaveClass('bg-blue-600');
    
    // Vérifier que l'autre lien n'a pas la classe active
    const calculatedLink = screen.getByTestId('link-to-/calculated');
    expect(calculatedLink).not.toHaveClass('bg-blue-600');
  });
  
  test('traduit correctement les libellés des liens', () => {
    render(<Navigation />);
    
    expect(screen.getByText('Points d\'entrée manuels')).toBeInTheDocument();
    expect(screen.getByText('Points d\'entrée calculés')).toBeInTheDocument();
  });
  
  test('accepte des éléments de navigation personnalisés', () => {
    const customItems = [
      { path: '/test1', label: 'test.label1' },
      { path: '/test2', label: 'test.label2' }
    ];
    
    render(<Navigation items={customItems} />);
    
    // Vérifier que les liens personnalisés sont présents
    expect(screen.getByTestId('link-to-/test1')).toBeInTheDocument();
    expect(screen.getByTestId('link-to-/test2')).toBeInTheDocument();
  });
}); 