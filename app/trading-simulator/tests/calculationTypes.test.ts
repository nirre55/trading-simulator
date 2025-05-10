import { describe, expect, test } from 'vitest';
import {
  defaultResults,
  calculateAverageEntryPrice,
  calculateRiskTotal,
  calculateProfitTarget,
  calculateTotalFees,
  calculateRiskRewardRatio
} from '../src/utils/calculationTypes';

describe('calculationTypes', () => {
  describe('defaultResults', () => {
    test('devrait retourner des valeurs par défaut pour le mode manuel', () => {
      const results = defaultResults('manual');
      
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

    test('devrait retourner des valeurs par défaut pour le mode calculé', () => {
      const results = defaultResults('calculated');
      
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
  });

  describe('calculateAverageEntryPrice', () => {
    test('devrait calculer correctement le prix moyen d\'entrée', () => {
      expect(calculateAverageEntryPrice([20000, 18000])).toBe(19000);
      expect(calculateAverageEntryPrice([100, 200, 300])).toBe(200);
    });

    test('devrait retourner 0 pour un tableau vide', () => {
      expect(calculateAverageEntryPrice([])).toBe(0);
    });
  });

  describe('calculateRiskTotal', () => {
    test('devrait calculer correctement le risque total', () => {
      // Pour 20000: (20000-15000) * (2500/20000) = 625
      // Pour 18000: (18000-15000) * (2500/18000) = 416.67
      // Total: 1041.67
      const riskTotal = calculateRiskTotal([20000, 18000], 15000, 2500);
      expect(riskTotal).toBeCloseTo(1041.67, 1);
    });

    test('devrait gérer correctement les prix sous le stop-loss', () => {
      // Pour 20000: (20000-15000) * (2500/20000) = 625
      // Pour 14000: (14000-15000) * (2500/14000) = -178.57
      // Total: 446.43
      const riskTotal = calculateRiskTotal([20000, 14000], 15000, 2500);
      expect(riskTotal).toBeCloseTo(446.43, 1);
    });

    test('devrait retourner 0 pour un tableau vide', () => {
      expect(calculateRiskTotal([], 15000, 2500)).toBe(0);
    });
  });

  describe('calculateProfitTarget', () => {
    test('devrait calculer correctement le profit cible', () => {
      // Prix cible = 19000 * 1.5 = 28500
      // Pour 20000: (28500-20000) * (2500/20000) = 1062.5
      // Pour 18000: (28500-18000) * (2500/18000) = 1458.33
      // Total: 2520.83
      const profitTarget = calculateProfitTarget([20000, 18000], 19000, 50, 2500);
      expect(profitTarget).toBeCloseTo(2520.83, 1);
    });

    test('devrait retourner 0 pour un tableau vide', () => {
      expect(calculateProfitTarget([], 19000, 50, 2500)).toBe(0);
    });
  });

  describe('calculateTotalFees', () => {
    test('devrait calculer correctement les frais totaux', () => {
      // Maker: 2 * (2500 * 0.001) * 2 = 10
      // Funding: 2 * (2500 * 0.0001 * 1) = 0.5
      // Total: 10.5
      const totalFees = calculateTotalFees(2, 2500, 0.1, 0.01, 1);
      expect(totalFees).toBeCloseTo(10.5, 1);
    });

    test('devrait retourner 0 quand numberOfTrades est 0', () => {
      expect(calculateTotalFees(0, 2500, 0.1, 0.01, 1)).toBe(0);
    });
  });

  describe('calculateRiskRewardRatio', () => {
    test('devrait calculer correctement le ratio risque/récompense', () => {
      expect(calculateRiskRewardRatio(1000, 2000)).toBe(2);
      expect(calculateRiskRewardRatio(500, 1250)).toBe(2.5);
    });

    test('devrait retourner 0 quand riskTotal est 0', () => {
      expect(calculateRiskRewardRatio(0, 2000)).toBe(0);
    });

    test('devrait retourner 0 quand riskTotal est négatif', () => {
      expect(calculateRiskRewardRatio(-100, 2000)).toBe(0);
    });
  });
}); 