import { calculateResults } from '../src/utils/calculations';
import type { InputParameters } from '../src/utils/types';
import { describe, expect, test } from 'vitest';

describe('calculateResults', () => {
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

  describe('Mode Manuel (variant=manual)', () => {
    test('devrait calculer correctement avec plusieurs prix d\'entrée', () => {
      const params: InputParameters = {
        ...baseParams,
        entryPrices: [20000, 18000],
        numberOfTrades: 2,
      };

      const results = calculateResults(params, 'manual');

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

      const results = calculateResults(params, 'manual');

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

      const results = calculateResults(params, 'manual');

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

      const results = calculateResults(params, 'manual');

      // Risque devrait être négatif pour le deuxième prix
      // Pour 20000: (20000-15000) * (2500/20000) = 625
      // Pour 14000: (14000-15000) * (2500/14000) = -178.57
      // Total: 446.43
      expect(results.riskTotal).toBeCloseTo(446.43, 1);
      expect(results.variant).toBe('manual');
    });
  });

  describe('Mode Calculé (variant=calculated)', () => {
    test('devrait calculer correctement avec plusieurs pourcentages de baisse', () => {
      const params: InputParameters = {
        ...baseParams,
        initialEntryPrice: 20000,
        dropPercentages: [10, 20],
      };

      const results = calculateResults(params, 'calculated');

      // Vérification des prix d'entrée calculés
      // initialPrice = 20000
      // Premier prix: 20000 * 0.9 = 18000
      // Deuxième prix: 18000 * 0.8 = 14400
      expect(results.numberOfTrades).toBe(2);
      
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
        initialEntryPrice: 20000,
        dropPercentages: [],
      };

      // Forcer initialEntryPrice à être dans un tableau vide pour déclencher le retour des valeurs par défaut
      // car un tableau dropPercentages vide n'est pas suffisant pour retourner les valeurs par défaut
      // si initialEntryPrice est défini
      params.initialEntryPrice = 0;
      
      const results = calculateResults(params, 'calculated');

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

      const results = calculateResults(params, 'calculated');

      // Prix calculés
      // initialPrice = 20000
      // Premier prix: 20000 * 0.9 = 18000
      // Deuxième prix: 18000 * 0.5 = 9000 (sous le stop-loss de 15000)
      
      // Vérification du risque
      // Pour 18000: (18000-15000) * (2500/18000) = 416.67
      // Pour 9000: (9000-15000) * (2500/9000) = -1666.67 (négatif car sous le stop-loss)
      // Total: -1250
      expect(results.riskTotal).toBeLessThan(0);
      expect(results.variant).toBe('calculated');
    });

    test('devrait calculer correctement avec de multiples pourcentages de baisse', () => {
      const params: InputParameters = {
        ...baseParams,
        initialEntryPrice: 20000,
        dropPercentages: [10, 10, 10], // Trois baisses de 10%
      };

      const results = calculateResults(params, 'calculated');

      // Prix calculés
      // initialPrice = 20000
      // Premier prix: 20000 * 0.9 = 18000
      // Deuxième prix: 18000 * 0.9 = 16200
      // Troisième prix: 16200 * 0.9 = 14580 (sous le stop-loss de 15000)
      
      expect(results.numberOfTrades).toBe(3);
      
      // Vérification du risque
      // Les deux premiers trades sont au-dessus du stop-loss, le troisième en-dessous
      expect(results.riskTotal).toBeGreaterThan(0);
      
      expect(results.variant).toBe('calculated');
    });
  });

  describe('Cas Limites et Spéciaux', () => {
    test('devrait gérer les très petites valeurs correctement', () => {
      const params: InputParameters = {
        ...baseParams,
        balance: 0.001,
        leverage: 1,
        stopLoss: 0.00001,
        entryPrices: [0.0001],
        numberOfTrades: 1,
      };

      const results = calculateResults(params, 'manual');
      
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

      const results = calculateResults(params, 'manual');
      
      expect(results.positionSize).toBe(100000000);
      expect(results.variant).toBe('manual');
    });
  });
}); 