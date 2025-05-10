import { describe, expect, test } from 'vitest';
import { calculateManualResults } from '../src/utils/manualCalculations';
import type { InputParameters } from '../src/utils/types';

describe('manualCalculations', () => {
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

  describe('calculateManualResults', () => {
    test('devrait calculer correctement avec plusieurs prix d\'entrée', () => {
      const params: InputParameters = {
        ...baseParams,
        entryPrices: [20000, 18000],
        numberOfTrades: 2,
      };

      const results = calculateManualResults(params);

      // Vérification des résultats
      expect(results.positionSize).toBe(5000); // 1000 * 5
      expect(results.numberOfTrades).toBe(2);
      expect(results.amountPerTrade).toBe(2500); // 5000 / 2
      expect(results.averageEntryPrice).toBe(19000); // (20000 + 18000) / 2
      
      // Vérification du risque total
      // Pour 20000: (20000-15000) * (2500/20000) = 625
      // Pour 18000: (18000-15000) * (2500/18000) = 416.67
      // Total: 1041.67
      expect(results.riskTotal).toBeCloseTo(1041.67, 1);
      
      // Vérification du profit cible
      // Prix cible = 19000 * 1.5 = 28500
      // Pour 20000: (28500-20000) * (2500/20000) = 1062.5
      // Pour 18000: (28500-18000) * (2500/18000) = 1458.33
      // Total: 2520.83
      expect(results.profitTarget).toBeCloseTo(2520.83, 1);
      
      // Frais totaux
      // Maker: 2 * (2500 * 0.001) * 2 = 10
      // Funding: 2 * (2500 * 0.0001 * 1) = 0.5
      // Total: 10.5
      expect(results.totalFees).toBeCloseTo(10.5, 1);
      
      // Ratio risque/récompense = 2520.83 / 1041.67 ≈ 2.42
      expect(results.riskRewardRatio).toBeCloseTo(2.42, 1);
      
      // Vérification du variant
      expect(results.variant).toBe('manual');
      
      // Vérification des prix d'entrée retournés
      expect(results.entryPrices).toEqual([20000, 18000]);
    });

    test('devrait retourner des valeurs par défaut pour un tableau de prix d\'entrée vide', () => {
      const params: InputParameters = {
        ...baseParams,
        entryPrices: [],
      };

      const results = calculateManualResults(params);

      expect(results.positionSize).toBe(0);
      expect(results.numberOfTrades).toBe(0);
      expect(results.amountPerTrade).toBe(0);
      expect(results.averageEntryPrice).toBe(0);
      expect(results.riskTotal).toBe(0);
      expect(results.profitTarget).toBe(0);
      expect(results.totalFees).toBe(0);
      expect(results.riskRewardRatio).toBe(0);
      expect(results.entryPrices).toEqual([]);
      expect(results.variant).toBe('manual');
    });

    test('devrait calculer correctement avec des prix d\'entrée proches du stop-loss', () => {
      const params: InputParameters = {
        ...baseParams,
        entryPrices: [16000, 15500],
        numberOfTrades: 2,
      };

      const results = calculateManualResults(params);

      // Le risque sera plus faible car les prix sont proches du stop-loss
      // Pour 16000: (16000-15000) * (2500/16000) = 156.25
      // Pour 15500: (15500-15000) * (2500/15500) = 80.65
      // Total: 236.9
      expect(results.riskTotal).toBeCloseTo(236.9, 1);
      expect(results.variant).toBe('manual');
    });

    test('devrait calculer correctement avec des prix d\'entrée sous le stop-loss', () => {
      const params: InputParameters = {
        ...baseParams,
        entryPrices: [20000, 14000], // Le deuxième prix est sous le stop-loss
        numberOfTrades: 2,
      };

      const results = calculateManualResults(params);

      // Risque devrait être négatif pour le deuxième prix
      // Pour 20000: (20000-15000) * (2500/20000) = 625
      // Pour 14000: (14000-15000) * (2500/14000) = -178.57
      // Total: 446.43
      expect(results.riskTotal).toBeCloseTo(446.43, 1);
      expect(results.variant).toBe('manual');
    });

    test('devrait gérer les très petites valeurs correctement', () => {
      const params: InputParameters = {
        ...baseParams,
        balance: 0.001,
        leverage: 1,
        stopLoss: 0.00001,
        entryPrices: [0.0001],
        numberOfTrades: 1,
      };

      const results = calculateManualResults(params);
      
      expect(results.positionSize).toBe(0.001);
      expect(results.variant).toBe('manual');
    });

    test('devrait gérer les très grandes valeurs correctement', () => {
      const params: InputParameters = {
        ...baseParams,
        balance: 1000000,
        leverage: 100,
        stopLoss: 1000,
        entryPrices: [100000],
        numberOfTrades: 1,
      };

      const results = calculateManualResults(params);
      
      expect(results.positionSize).toBe(100000000);
      expect(results.variant).toBe('manual');
    });
  });
}); 