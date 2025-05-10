// src/utils/types.ts
export interface InputParameters {
    balance: number;
    leverage: number;
    stopLoss: number;
    gainTarget: number;
    makerFee: number;
    takerFee: number;
    fundingFee: number;
    duration: number;
    recovery: boolean;
    symbol: string;
    // Variante 1
    numberOfTrades?: number;
    entryPrices?: number[];
    // Variante 2
    initialEntryPrice?: number;
    dropPercentage?: number;
    // Gardons dropPercentages pour la compatibilité avec les tests existants
    dropPercentages?: number[];
  }