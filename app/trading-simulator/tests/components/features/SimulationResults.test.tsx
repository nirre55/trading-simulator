import React from 'react';
import { describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import SimulationResults from '../src/components/features/SimulationResults';

// Mock pour TradeDetailsTable
vi.mock('../src/components/features/TradeDetailsTable', () => ({
  default: (props: any) => <div data-testid="trade-details-table">{JSON.stringify(props)}</div>
}));

// Mock pour useTranslation
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key // Retourne simplement la clé pour faciliter les tests
  })
}));

describe('SimulationResults Component', () => {
  const mockResults = {
    positionSize: 5000,
    numberOfTrades: 3,
    amountPerTrade: 1666.67,
    realAmountPerTrade: 333.33,
    averageEntryPrice: 16260,
    riskTotal: 388.89,
    profitTarget: 2500,
    totalFees: 5,
    riskRewardRatio: 6.43,
    entryPrices: [18000, 16200, 14580],
    variant: 'calculated' as const
  };

  test('renders all result values correctly', () => {
    render(
      <SimulationResults 
        results={mockResults} 
        stopLoss={10}
        gainTarget={20}
        makerFee={0.1}
        fundingFee={0.01}
        duration={1}
        leverage={10}
      />
    );
    
    // Vérifier que les valeurs sont correctement affichées
    expect(screen.getByText('$5000.00')).toBeDefined();
    expect(screen.getByText('3')).toBeDefined();
    expect(screen.getByText('$1666.67')).toBeDefined();
    expect(screen.getByText('$333.33')).toBeDefined();
    expect(screen.getByText('$16260.00')).toBeDefined();
    expect(screen.getByText('$388.89')).toBeDefined();
    expect(screen.getByText('$2500.00')).toBeDefined();
    expect(screen.getByText('$5.00')).toBeDefined();
    expect(screen.getByText('6.43')).toBeDefined();
  });

  test('renders TradeDetailsTable when entryPrices exist', () => {
    render(
      <SimulationResults 
        results={mockResults} 
        stopLoss={10}
        gainTarget={20}
        makerFee={0.1}
        fundingFee={0.01}
        duration={1}
        leverage={10}
      />
    );
    
    // Vérifier que le tableau de détails est affiché
    expect(screen.getByTestId('trade-details-table')).toBeDefined();
  });

  test('does not render TradeDetailsTable when entryPrices is empty', () => {
    const resultsWithoutEntryPrices = {
      ...mockResults,
      entryPrices: []
    };
    
    render(
      <SimulationResults 
        results={resultsWithoutEntryPrices} 
        stopLoss={10}
        gainTarget={20}
        makerFee={0.1}
        fundingFee={0.01}
        duration={1}
        leverage={10}
      />
    );
    
    // Vérifier que le tableau de détails n'est pas affiché
    expect(screen.queryByTestId('trade-details-table')).toBeNull();
  });
}); 