import { calculateResults } from '../../src/utils/calculations';
import type { InputParameters } from '../../src/utils/types';
import { describe, expect, test } from 'vitest';

describe('calculateResults (fonction principale)', () => {
  // Paramètres de base pour les tests
  const baseParams: InputParameters = {
    balance: 1000,
    leverage: 5,
    stopLoss: 15000,
    gainTarget: 50,
    makerFee: 0.1,
    takerFee: 0.2,
    fundingFee: 0.01,
    duration: 1,
    recovery: false,
    symbol: 'BTC/USDT',
    numberOfTrades: 0,
    entryPrices: [],
    initialEntryPrice: 0,
    dropPercentages: [],
  };

  describe('Délégation Mode Manuel', () => {
    test('devrait déléguer correctement en mode manuel', () => {
      const params: InputParameters = {
        ...baseParams,
        entryPrices: [20000, 18000],
        numberOfTrades: 2,
      };

      const results = calculateResults(params, 'manual');

      // Vérification que les calculs sont bien délégués au module manuel
      expect(results.variant).toBe('manual');
      expect(results.numberOfTrades).toBe(2);
      expect(results.entryPrices).toEqual([20000, 18000]);
    });
  });

  describe('Délégation Mode Calculé', () => {
    test('devrait déléguer correctement en mode calculé', () => {
      const params: InputParameters = {
        ...baseParams,
        initialEntryPrice: 20000,
        dropPercentages: [10, 20],
      };

      const results = calculateResults(params, 'calculated');

      // Vérification que les calculs sont bien délégués au module calculé
      expect(results.variant).toBe('calculated');
      expect(results.numberOfTrades).toBe(2);
      expect(results.entryPrices).toEqual([18000, 14400]);
    });
  });

  describe('Récupération de Perte', () => {
    test('devrait gérer correctement le paramètre recovery', () => {
      const params: InputParameters = {
        ...baseParams,
        entryPrices: [100, 90, 80],
        numberOfTrades: 3,
        recovery: true,
        balance: 1000,
        leverage: 10,
        gainTarget: 100
      };

      const results = calculateResults(params, 'manual');

      // Vérifie que les détails des trades sont calculés avec récupération
      expect(results.tradeDetails).toBeDefined();
      if (results.tradeDetails) {
        // Premier trade: pas de récupération
        expect(results.tradeDetails[0].profit).toBeCloseTo(3333.33, 1); // amountPerTrade * (gainTarget / 100)
        
        // Deuxième trade: récupération de la perte du premier trade
        expect(results.tradeDetails[1].profit).toBeCloseTo(3666.66, 1); // 3333.33 + 333.33
        
        // Troisième trade: récupération des pertes des deux premiers trades
        expect(results.tradeDetails[2].profit).toBeCloseTo(3999.99, 1); // 3333.33 + 333.33 * 2
      }
    });
  });
}); 