import React from 'react';
import { describe, expect, test, vi, beforeAll } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import TradeDetailsTable from '../../../src/components/features/TradeDetailsTable';

// Mock pour useTranslation
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key // Retourne simplement la clé pour faciliter les tests
  })
}));

// Mock pour window.matchMedia
beforeAll(() => {
  // Mock pour matchMedia - simuler desktop pour les tests
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false, // Simulate desktop mode
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

describe('TradeDetailsTable Component', () => {
  const defaultProps = {
    entryPrices: [20000, 18000, 16200],
    amountPerTrade: 5000, // Montant avec levier
    realAmountPerTrade: 500, // Montant réel sans levier (ajouté)
    stopLoss: 15000,
    targetGain: 50, // Gain cible en pourcentage
    makerFee: 0.1,
    fundingFee: 0.01,
    duration: 1,
    leverage: 10,
    recovery: false // Paramètre de récupération (ajouté)
  };

  test('renders the table with correct columns', () => {
    const { container } = render(<TradeDetailsTable {...defaultProps} />);
    
    // Cibler spécifiquement la table dans la vue desktop
    const desktopView = container.querySelector('.hidden.md\\:block');
    expect(desktopView).not.toBeNull();
    
    // Vérifier l'existence des colonnes dans l'en-tête de la table
    const headerCells = within(desktopView as HTMLElement).getAllByRole('columnheader');
    expect(headerCells.length).toBe(11); // 11 colonnes au total
    
    // Vérifier quelques colonnes spécifiques
    expect(headerCells[0].textContent).toBe('tradeTable.tradeNumber');
    expect(headerCells[1].textContent).toBe('tradeTable.entryPrice');
    expect(headerCells[7].textContent).toBe('tradeTable.profit');
  });

  test('renders correct number of rows based on entryPrices', () => {
    const { container } = render(<TradeDetailsTable {...defaultProps} />);
    
    // Cibler spécifiquement la table dans la vue desktop
    const desktopView = container.querySelector('.hidden.md\\:block');
    expect(desktopView).not.toBeNull();
    
    // Vérifier le nombre de lignes dans le tbody
    const rows = within(desktopView as HTMLElement).getAllByRole('row');
    expect(rows.length).toBe(4); // 3 lignes de données + 1 ligne d'en-tête
  });

  test('displays correct entry prices in desktop view', () => {
    const { container } = render(<TradeDetailsTable {...defaultProps} />);
    
    // Cibler spécifiquement la table dans la vue desktop
    const desktopView = container.querySelector('.hidden.md\\:block');
    expect(desktopView).not.toBeNull();
    
    // Récupérer les cellules du tableau
    const cells = within(desktopView as HTMLElement).getAllByRole('cell');
    
    // Vérifier les prix d'entrée dans les cellules
    const entryPriceCells = cells.filter(cell => cell.textContent?.includes('$20000.00'));
    expect(entryPriceCells.length).toBe(1);
    
    const liquidationPriceCells = cells.filter(cell => cell.textContent?.includes('$18000.00'));
    expect(liquidationPriceCells.length).toBe(2);
  });

  test('displays correct profit values in desktop view', () => {
    const { container } = render(<TradeDetailsTable {...defaultProps} />);
    
    // Cibler spécifiquement la table dans la vue desktop
    const desktopView = container.querySelector('.hidden.md\\:block');
    expect(desktopView).not.toBeNull();
    
    // Le profit pour chaque trade est amountPerTrade * (targetGain / 100)
    // 5000 * (50 / 100) = 2500
    const cells = within(desktopView as HTMLElement).getAllByRole('cell');
    const profitCells = cells.filter(cell => cell.textContent?.includes('$2500.00'));
    expect(profitCells.length).toBeGreaterThan(0);
  });

  test('calculates and displays liquidation prices correctly in desktop view', () => {
    const { container } = render(<TradeDetailsTable {...defaultProps} />);
    
    // Cibler spécifiquement la table dans la vue desktop
    const desktopView = container.querySelector('.hidden.md\\:block');
    expect(desktopView).not.toBeNull();
    
    // Vérifier les prix de liquidation (10% en dessous du prix d'entrée) dans les cellules
    const cells = within(desktopView as HTMLElement).getAllByRole('cell');
    
    // 20000 * 0.9 = 18000
    // 18000 * 0.9 = 16200
    // 16200 * 0.9 = 14580
    const price18000Cells = cells.filter(cell => cell.textContent?.includes('$18000.00'));
    expect(price18000Cells.length).toBe(2);
    
    const price16200Cells = cells.filter(cell => cell.textContent?.includes('$16200.00'));
    expect(price16200Cells.length).toBe(2);
    
    const price14580Cells = cells.filter(cell => cell.textContent?.includes('$14580.00'));
    expect(price14580Cells.length).toBe(1);
  });
}); 