import React from 'react';
import { describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import TradeDetailsTable from '../../../src/components/features/TradeDetailsTable';

// Mock pour useTranslation
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key // Retourne simplement la clé pour faciliter les tests
  })
}));

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
    render(<TradeDetailsTable {...defaultProps} />);
    
    // Vérifier que les titres de colonnes sont présents en utilisant les clés réelles du composant
    expect(screen.getByText('tradeTable.tradeNumber')).toBeDefined();
    expect(screen.getByText('tradeTable.entryPrice')).toBeDefined();
    expect(screen.getByText('tradeTable.realAmount')).toBeDefined();
    expect(screen.getByText('tradeTable.leveragedAmount')).toBeDefined();
    expect(screen.getByText('tradeTable.cryptoAmount')).toBeDefined();
    expect(screen.getByText('tradeTable.liquidationPrice')).toBeDefined();
    expect(screen.getByText('tradeTable.exitPrice')).toBeDefined();
    expect(screen.getByText('tradeTable.profit')).toBeDefined();
    expect(screen.getByText('tradeTable.adjustedGain')).toBeDefined();
    expect(screen.getByText('tradeTable.fees')).toBeDefined();
    expect(screen.getByText('tradeTable.riskRewardRatio')).toBeDefined();
  });

  test('renders correct number of rows based on entryPrices', () => {
    render(<TradeDetailsTable {...defaultProps} />);
    
    // 3 prix d'entrée + 1 ligne d'en-tête
    const rows = screen.getAllByRole('row');
    expect(rows.length).toBe(4);
  });

  test('displays correct entry prices', () => {
    render(<TradeDetailsTable {...defaultProps} />);
    
    // Vérifier que les prix d'entrée sont affichés correctement
    // Note: Ces valeurs peuvent apparaître plusieurs fois dans le tableau
    expect(screen.getAllByText(/\$20000.00/)).toHaveLength(1);
    expect(screen.getAllByText(/\$18000.00/)).toHaveLength(2); // Apparaît comme prix d'entrée et comme prix de liquidation
    expect(screen.getAllByText(/\$16200.00/)).toHaveLength(2); // Apparaît comme prix d'entrée et comme prix de liquidation
  });

  test('displays correct profit values', () => {
    render(<TradeDetailsTable {...defaultProps} />);
    
    // Le profit pour chaque trade est amountPerTrade * (targetGain / 100)
    // 5000 * (50 / 100) = 2500
    const profitValue = screen.getAllByText(/\$2500.00/);
    expect(profitValue.length).toBeGreaterThan(0);
  });

  test('calculates and displays liquidation prices correctly', () => {
    render(<TradeDetailsTable {...defaultProps} />);
    
    // Vérifier les prix de liquidation (10% en dessous du prix d'entrée)
    // 20000 * 0.9 = 18000
    // 18000 * 0.9 = 16200
    // 16200 * 0.9 = 14580
    expect(screen.getAllByText(/\$18000.00/)).toHaveLength(2); // Apparaît comme prix d'entrée et comme prix de liquidation
    expect(screen.getAllByText(/\$16200.00/)).toHaveLength(2); // Apparaît comme prix d'entrée et comme prix de liquidation
    expect(screen.getAllByText(/\$14580.00/)).toHaveLength(1); // Apparaît uniquement comme prix de liquidation
  });
}); 