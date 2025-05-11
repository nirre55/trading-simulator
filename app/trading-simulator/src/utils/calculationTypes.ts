// Nous n'avons pas besoin d'importer InputParameters ici
// import type { InputParameters } from './types';

// Interface pour les résultats des calculs
export interface CalculationResults {
  positionSize: number; // Taille Totale de la Position ($)
  numberOfTrades: number; // Nombre de Trades
  amountPerTrade: number; // Montant par Trade ($)
  realAmountPerTrade: number; // Montant réel par Trade (sans levier) ($)
  averageEntryPrice: number; // Prix Moyen d'Entrée ($)
  riskTotal: number; // Risque Total ($)
  profitTarget: number; // Profit Cible ($)
  totalFees: number; // Coût Total des Frais ($)
  riskRewardRatio: number; // Ratio Risque/Récompense
  entryPrices: number[]; // Liste des Prix d'Entrée ($)
  variant: 'manual' | 'calculated'; // Mode de calcul utilisé
  tradeDetails?: TradeDetail[]; // Détails de chaque trade individuel
}

// Interface pour les détails d'un trade individuel
export interface TradeDetail {
  tradeNumber: number; // Numéro du trade
  entryPrice: number; // Prix d'entrée
  liquidationPrice: number; // Prix de liquidation
  targetPrice: number; // Prix de sortie
  profit: number; // Profit potentiel
  loss: number; // Perte potentielle
  fees: number; // Frais
  riskRewardRatio: number; // Ratio risque/récompense
  adjustedGainTarget: number; // Gain cible ajusté en pourcentage
}

// Valeurs par défaut pour les résultats quand aucune donnée valide n'est fournie
export const defaultResults = (variant: 'manual' | 'calculated'): CalculationResults => ({
  positionSize: 0,
  numberOfTrades: 0,
  amountPerTrade: 0,
  realAmountPerTrade: 0,
  averageEntryPrice: 0,
  riskTotal: 0,
  profitTarget: 0,
  totalFees: 0,
  riskRewardRatio: 0,
  entryPrices: [],
  variant,
  tradeDetails: []
});

// Fonction pour calculer le prix moyen d'entrée
export const calculateAverageEntryPrice = (prices: number[]): number => {
  if (prices.length === 0) return 0;
  return prices.reduce((sum, price) => sum + price, 0) / prices.length;
};

// Fonction pour calculer le risque total
export const calculateRiskTotal = (
  entryPrices: number[], 
  stopLoss: number, 
  amountPerTrade: number
): number => {
  return entryPrices.reduce((sum, price) => {
    const loss = (price - stopLoss) * (amountPerTrade / price);
    return sum + loss;
  }, 0);
};

// Fonction pour calculer le profit cible
export const calculateProfitTarget = (
  entryPrices: number[], 
  averageEntryPrice: number, 
  gainTarget: number, 
  amountPerTrade: number
): number => {
  const targetPrice = averageEntryPrice * (1 + gainTarget / 100);
  return entryPrices.reduce((sum, price) => {
    const gain = (targetPrice - price) * (amountPerTrade / price);
    return sum + gain;
  }, 0);
};

// Fonction pour calculer le coût total des frais
export const calculateTotalFees = (
  numberOfTrades: number, 
  amountPerTrade: number, 
  makerFee: number, 
  fundingFee: number, 
  duration: number
): number => {
  const makerCost = numberOfTrades * (amountPerTrade * (makerFee / 100)) * 2; // Ouverture + Fermeture
  const fundingCost = numberOfTrades * (amountPerTrade * (fundingFee / 100) * duration);
  return makerCost + fundingCost;
};

// Fonction pour calculer le ratio risque/récompense
export const calculateRiskRewardRatio = (
  riskTotal: number, 
  profitTarget: number
): number => {
  return riskTotal > 0 ? profitTarget / riskTotal : 0;
};

// Fonction pour calculer les frais par trade
export const calculateFeesPerTrade = (
  amountPerTrade: number,
  makerFee: number,
  fundingFee: number,
  duration: number
): number => {
  const makerFeePerTrade = amountPerTrade * (makerFee / 100) * 2; // Ouverture + Fermeture
  const fundingFeePerTrade = amountPerTrade * (fundingFee / 100) * duration;
  return makerFeePerTrade + fundingFeePerTrade;
};

// Fonction pour calculer le profit potentiel sans récupération de perte
export const calculateProfitWithoutRecovery = (
  tradeAmount: number,
  gainTarget: number
): number => {
  return tradeAmount * (gainTarget / 100);
};

// Fonction pour calculer le profit potentiel avec récupération de perte
export const calculateProfitWithRecovery = (
  tradeAmount: number,
  gainTarget: number,
  baseTradeAmount: number,
  tradeIndex: number
): number => {
  // Trade 1 : profit = tradeAmount * (gainTarget / 100)
  // Trade n (n ≥ 2) : profit = tradeAmount * (gainTarget / 100) + baseTradeAmount * (n - 1)
  if (tradeIndex === 0) {
    return tradeAmount * (gainTarget / 100);
  } else {
    return tradeAmount * (gainTarget / 100) + baseTradeAmount * tradeIndex;
  }
};

// Fonction pour calculer le prix de sortie
export const calculateTargetPrice = (
  entryPrice: number,
  profit: number,
  tradeAmount: number
): number => {
  if (tradeAmount === 0) return entryPrice; // Éviter la division par zéro
  return entryPrice + (profit * entryPrice / tradeAmount);
};

// Fonction pour calculer le gain cible ajusté
export const calculateAdjustedGainTarget = (
  targetPrice: number,
  entryPrice: number
): number => {
  if (entryPrice === 0) return 0; // Éviter la division par zéro
  return ((targetPrice - entryPrice) / entryPrice) * 100;
};

// Fonction pour calculer les détails de chaque trade
export const calculateTradeDetails = (
  entryPrices: number[],
  _stopLoss: number, // Préfixé avec underscore pour indiquer qu'il n'est pas utilisé
  leverage: number,
  amountPerTrade: number,
  realAmountPerTrade: number,
  gainTarget: number,
  makerFee: number,
  fundingFee: number,
  duration: number,
  recovery: boolean
): TradeDetail[] => {
  return entryPrices.map((entryPrice, index) => {
    // Calcul du prix de liquidation
    const liquidationPrice = entryPrice * (1 - 1/leverage);
    
    // Calcul de la perte par trade
    const loss = realAmountPerTrade;
    
    // Calcul des frais par trade
    const fees = calculateFeesPerTrade(amountPerTrade, makerFee, fundingFee, duration);
    
    // Calcul du profit et du prix de sortie en fonction du mode de récupération
    let profit: number;
    let targetPrice: number;
    
    if (recovery) {
      // Avec récupération de perte
      profit = calculateProfitWithRecovery(amountPerTrade, gainTarget, realAmountPerTrade, index);
      targetPrice = calculateTargetPrice(entryPrice, profit, amountPerTrade);
    } else {
      // Sans récupération de perte
      profit = calculateProfitWithoutRecovery(amountPerTrade, gainTarget);
      targetPrice = calculateTargetPrice(entryPrice, profit, amountPerTrade);
    }
    
    // Calcul du gain cible ajusté
    const adjustedGainTarget = calculateAdjustedGainTarget(targetPrice, entryPrice);
    
    // Calcul du ratio risque/récompense
    const riskRewardRatio = profit / loss;
    
    return {
      tradeNumber: index + 1,
      entryPrice,
      liquidationPrice,
      targetPrice,
      profit,
      loss,
      fees,
      riskRewardRatio,
      adjustedGainTarget
    };
  });
}; 