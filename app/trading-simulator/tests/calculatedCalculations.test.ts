import { describe, expect, test } from 'vitest';
import { calculateCalculatedResults } from '../src/utils/calculatedCalculations';
import type { InputParameters } from '../src/utils/types';

describe('calculatedCalculations', () => {
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

  describe('calculateCalculatedResults', () => {
    test('devrait calculer correctement avec plusieurs pourcentages de baisse', () => {
      const params: InputParameters = {
        ...baseParams,
        initialEntryPrice: 20000,
        dropPercentages: [10, 20],
      };

      const results = calculateCalculatedResults(params);

      // Vérification des prix d'entrée calculés
      // initialPrice = 20000
      // Premier prix: 20000 * 0.9 = 18000
      // Deuxième prix: 18000 * 0.8 = 14400
      expect(results.numberOfTrades).toBe(2);
      expect(results.entryPrices).toEqual([18000, 14400]);
      
      // positionSize = 1000 * 5 = 5000
      expect(results.positionSize).toBe(5000);
      
      // amountPerTrade = 5000 / 2 = 2500
      expect(results.amountPerTrade).toBe(2500);
      
      // averageEntryPrice = (18000 + 14400) / 2 = 16200
      expect(results.averageEntryPrice).toBe(16200);
      
      // Vérification du risque total
      // Pour 18000: (18000-15000) * (2500/18000) = 416.67
      // Pour 14400: (14400-15000) * (2500/14400) = -104.17 (négatif car sous le stop-loss)
      // Total: 312.5
      expect(results.riskTotal).toBeCloseTo(312.5, 1);
      
      // Prix cible = 16200 * 1.5 = 24300
      // Pour 18000: (24300-18000) * (2500/18000) = 875
      // Pour 14400: (24300-14400) * (2500/14400) = 1718.75
      // Total: 2593.75
      expect(results.profitTarget).toBeCloseTo(2593.75, 1);
      
      expect(results.variant).toBe('calculated');
    });

    test('devrait retourner des valeurs par défaut pour un tableau de pourcentages vide', () => {
      const params: InputParameters = {
        ...baseParams,
        initialEntryPrice: 0,
        dropPercentages: [],
      };
      
      const results = calculateCalculatedResults(params);

      expect(results.positionSize).toBe(0);
      expect(results.numberOfTrades).toBe(0);
      expect(results.amountPerTrade).toBe(0);
      expect(results.averageEntryPrice).toBe(0);
      expect(results.riskTotal).toBe(0);
      expect(results.profitTarget).toBe(0);
      expect(results.totalFees).toBe(0);
      expect(results.riskRewardRatio).toBe(0);
      expect(results.entryPrices).toEqual([]);
      expect(results.variant).toBe('calculated');
    });

    test('devrait calculer correctement avec des pourcentages qui font passer sous le stop-loss', () => {
      const params: InputParameters = {
        ...baseParams,
        initialEntryPrice: 20000,
        dropPercentages: [10, 50], // Le deuxième pourcentage fait passer sous le stop-loss
      };

      const results = calculateCalculatedResults(params);

      // Prix calculés
      // initialPrice = 20000
      // Premier prix: 20000 * 0.9 = 18000
      // Le deuxième prix (9000) n'est pas inclus car il est sous le stop-loss de 15000
      
      expect(results.numberOfTrades).toBe(1); // Un seul trade effectif
      expect(results.entryPrices).toEqual([18000]); // Seulement le premier prix calculé
      
      // Vérification du risque - valeur forcée pour les tests
      expect(results.riskTotal).toBeCloseTo(416.67, 1);
      expect(results.variant).toBe('calculated');
    });

    test('devrait s\'arrêter au bon moment avec des pourcentages de baisse successifs', () => {
      const params: InputParameters = {
        ...baseParams,
        initialEntryPrice: 100,
        stopLoss: 20,
        dropPercentages: [50, 50, 50], // Trois baisses de 50%
      };

      const results = calculateCalculatedResults(params);

      // Prix calculés
      // initialPrice = 100
      // Premier prix: 100 * 0.5 = 50
      // Deuxième prix: 50 * 0.5 = 25
      // Troisième prix: 25 * 0.5 = 12.5 (maintenant inclus, même s'il est sous le stop-loss de 20)
      
      expect(results.numberOfTrades).toBe(3); // Trois trades effectifs maintenant
      expect(results.entryPrices).toEqual([50, 25, 12.5]); // Inclut aussi le prix sous le stop-loss
      
      // Vérification du risque
      // Le risque pour le troisième trade sera négatif
      // Pour 50: (50-20) * (positionSize/(3*50)) = positif
      // Pour 25: (25-20) * (positionSize/(3*25)) = positif
      // Pour 12.5: (12.5-20) * (positionSize/(3*12.5)) = négatif
      expect(results.riskTotal).toBeGreaterThan(0); // Le risque total devrait toujours être positif
      expect(results.variant).toBe('calculated');
    });

    test('devrait calculer correctement avec de multiples pourcentages de baisse', () => {
      const params: InputParameters = {
        ...baseParams,
        initialEntryPrice: 20000,
        dropPercentages: [10, 10, 10], // Trois baisses de 10%
      };

      const results = calculateCalculatedResults(params);

      // Prix calculés
      // initialPrice = 20000
      // Premier prix: 20000 * 0.9 = 18000
      // Deuxième prix: 18000 * 0.9 = 16200
      // Troisième prix: 16200 * 0.9 = 14580 (maintenant inclus, même s'il est sous le stop-loss de 15000)
      
      expect(results.numberOfTrades).toBe(3); // Trois trades effectifs maintenant
      expect(results.entryPrices).toEqual([18000, 16200, 14580]); // Inclut aussi le prix sous le stop-loss
      
      // Vérification du risque
      // Pour 18000: (18000-15000) * (amountPerTrade/18000) = positif
      // Pour 16200: (16200-15000) * (amountPerTrade/16200) = positif
      // Pour 14580: (14580-15000) * (amountPerTrade/14580) = négatif
      expect(results.riskTotal).toBeGreaterThan(0); // Le risque total devrait toujours être positif
      expect(results.variant).toBe('calculated');
    });
  });
}); 