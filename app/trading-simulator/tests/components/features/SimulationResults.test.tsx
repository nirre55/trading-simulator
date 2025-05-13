import React from 'react';
import { describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import SimulationResults from '../../../src/components/features/SimulationResults';

// Mock pour TradeDetailsTable
vi.mock('../../../src/components/features/TradeDetailsTable', () => ({
  default: (props: any) => <div data-testid="trade-details-table">{JSON.stringify(props)}</div>
}));

// Mock pour useTranslation
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key })
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

  test('ne rend plus les valeurs des résultats après modification', () => {
    render(
      <SimulationResults 
        results={mockResults} 
        stopLoss={10}
        gainTarget={20}
        makerFee={0.1}
        fundingFee={0.01}
        duration={1}
        leverage={10}
        recovery={false}
      />
    );
    
    // Vérifier que les valeurs des résultats ne sont plus affichées
    expect(screen.queryByText('$5000.00')).toBeNull();
    expect(screen.queryByText('$1666.67')).toBeNull();
    expect(screen.queryByText('$16260.00')).toBeNull();
  });

  test('rend TradeDetailsTable quand entryPrices existe', () => {
    render(
      <SimulationResults 
        results={mockResults} 
        stopLoss={10}
        gainTarget={20}
        makerFee={0.1}
        fundingFee={0.01}
        duration={1}
        leverage={10}
        recovery={false}
      />
    );
    
    // Vérifier que le tableau de détails est affiché
    expect(screen.getByTestId('trade-details-table')).toBeDefined();
    
    // Vérifier que les bonnes propriétés sont passées au tableau de détails
    const tableProps = JSON.parse(screen.getByTestId('trade-details-table').textContent || '{}');
    expect(tableProps.entryPrices).toEqual(mockResults.entryPrices);
    expect(tableProps.amountPerTrade).toEqual(mockResults.amountPerTrade);
    expect(tableProps.stopLoss).toEqual(10);
  });

  test('ne rend pas TradeDetailsTable quand entryPrices est vide', () => {
    const emptyResults = {
      ...mockResults,
      entryPrices: []
    };
    
    render(
      <SimulationResults 
        results={emptyResults} 
        stopLoss={10}
        gainTarget={20}
        makerFee={0.1}
        fundingFee={0.01}
        duration={1}
        leverage={10}
        recovery={false}
      />
    );
    
    // Vérifier que le tableau de détails n'est pas affiché
    expect(screen.queryByTestId('trade-details-table')).toBeNull();
  });
}); 