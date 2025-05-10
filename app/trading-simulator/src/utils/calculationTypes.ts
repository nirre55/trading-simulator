import type { InputParameters } from './types';

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
  variant
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