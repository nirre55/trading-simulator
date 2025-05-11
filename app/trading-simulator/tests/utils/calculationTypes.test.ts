import { describe, expect, test } from 'vitest';
import {
  defaultResults,
  calculateAverageEntryPrice,
  calculateRiskTotal,
  calculateProfitTarget,
  calculateTotalFees,
  calculateRiskRewardRatio,
  calculateFeesPerTrade,
  calculateProfitWithoutRecovery,
  calculateProfitWithRecovery,
  calculateTargetPrice,
  calculateAdjustedGainTarget,
  calculateTradeDetails
} from '../../src/utils/calculationTypes';

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
      expect(results.tradeDetails).toEqual([]);
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
      expect(results.tradeDetails).toEqual([]);
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

  // Tests pour les nouvelles fonctions
  describe('calculateFeesPerTrade', () => {
    test('devrait calculer correctement les frais par trade', () => {
      // Maker: (2500 * 0.001) * 2 = 5
      // Funding: (2500 * 0.0001 * 1) = 0.25
      // Total: 5.25
      const feesPerTrade = calculateFeesPerTrade(2500, 0.1, 0.01, 1);
      expect(feesPerTrade).toBeCloseTo(5.25, 2);
    });
  });

  describe('calculateProfitWithoutRecovery', () => {
    test('devrait calculer correctement le profit sans récupération', () => {
      // Profit = 2500 * (50 / 100) = 1250
      const profit = calculateProfitWithoutRecovery(2500, 50);
      expect(profit).toBe(1250);
    });

    test('devrait retourner 0 pour un gain cible de 0', () => {
      expect(calculateProfitWithoutRecovery(2500, 0)).toBe(0);
    });
  });

  describe('calculateProfitWithRecovery', () => {
    test('devrait calculer correctement le profit pour le premier trade', () => {
      // Profit pour premier trade (index 0) = 2500 * (50 / 100) = 1250
      const profit = calculateProfitWithRecovery(2500, 50, 500, 0);
      expect(profit).toBe(1250);
    });

    test('devrait calculer correctement le profit avec récupération pour les trades suivants', () => {
      // Profit pour deuxième trade (index 1) = 2500 * (50 / 100) + 500 * 1 = 1250 + 500 = 1750
      const profit1 = calculateProfitWithRecovery(2500, 50, 500, 1);
      expect(profit1).toBe(1750);

      // Profit pour troisième trade (index 2) = 2500 * (50 / 100) + 500 * 2 = 1250 + 1000 = 2250
      const profit2 = calculateProfitWithRecovery(2500, 50, 500, 2);
      expect(profit2).toBe(2250);
    });
  });

  describe('calculateTargetPrice', () => {
    test('devrait calculer correctement le prix de sortie', () => {
      // targetPrice = 100 + (1250 * 100 / 2500) = 100 + 50 = 150
      const targetPrice = calculateTargetPrice(100, 1250, 2500);
      expect(targetPrice).toBe(150);
    });

    test('devrait gérer une division par zéro', () => {
      // Si le montant total est 0, le prix de sortie devrait être égal au prix d'entrée
      const targetPrice = calculateTargetPrice(100, 1250, 0);
      expect(targetPrice).toBe(100);
    });
  });

  describe('calculateAdjustedGainTarget', () => {
    test('devrait calculer correctement le gain cible ajusté', () => {
      // adjustedGainTarget = ((150 - 100) / 100) * 100 = 50%
      const adjustedGainTarget = calculateAdjustedGainTarget(150, 100);
      expect(adjustedGainTarget).toBe(50);
    });

    test('devrait gérer une division par zéro', () => {
      // Si le prix d'entrée est 0, le résultat devrait être 0
      const adjustedGainTarget = calculateAdjustedGainTarget(150, 0);
      expect(adjustedGainTarget).toBe(0);
    });
  });

  describe('calculateTradeDetails', () => {
    test('devrait calculer correctement les détails des trades sans récupération', () => {
      const entryPrices = [100, 90, 80];
      const details = calculateTradeDetails(
        entryPrices,
        50, // stopLoss
        10, // leverage
        1000, // amountPerTrade
        100, // realAmountPerTrade
        100, // gainTarget
        0.1, // makerFee
        0.01, // fundingFee
        5, // duration
        false // recovery
      );

      expect(details.length).toBe(3);
      
      // Vérification du premier trade
      expect(details[0].tradeNumber).toBe(1);
      expect(details[0].entryPrice).toBe(100);
      expect(details[0].liquidationPrice).toBe(90);
      expect(details[0].targetPrice).toBe(200); // 100 + (1000 * 100 / 1000)
      expect(details[0].profit).toBe(1000); // 1000 * (100 / 100)
      expect(details[0].loss).toBe(100);
      expect(details[0].adjustedGainTarget).toBe(100); // ((200 - 100) / 100) * 100
      expect(details[0].riskRewardRatio).toBe(10); // 1000 / 100
    });

    test('devrait calculer correctement les détails des trades avec récupération', () => {
      const entryPrices = [100, 90, 80];
      const details = calculateTradeDetails(
        entryPrices,
        50, // stopLoss
        10, // leverage
        1000, // amountPerTrade
        100, // realAmountPerTrade
        100, // gainTarget
        0.1, // makerFee
        0.01, // fundingFee
        5, // duration
        true // recovery
      );

      expect(details.length).toBe(3);
      
      // Vérification du premier trade (sans récupération)
      expect(details[0].profit).toBe(1000); // 1000 * (100 / 100)
      expect(details[0].targetPrice).toBe(200); // 100 + (1000 * 100 / 1000)
      
      // Vérification du deuxième trade (avec récupération d'un trade)
      expect(details[1].profit).toBe(1100); // 1000 * (100 / 100) + 100 * 1
      expect(details[1].targetPrice).toBe(189); // 90 + (1100 * 90 / 1000) = 90 + 99
      
      // Vérification du troisième trade (avec récupération de deux trades)
      expect(details[2].profit).toBe(1200); // 1000 * (100 / 100) + 100 * 2
      expect(details[2].targetPrice).toBe(176); // 80 + (1200 * 80 / 1000) = 80 + 96
    });
  });
}); 