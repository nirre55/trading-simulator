import type { InputParameters } from './types';
import type { CalculationResults } from './calculationTypes';
import { 
  defaultResults, 
  calculateAverageEntryPrice,
  calculateRiskTotal,
  calculateProfitTarget,
  calculateTotalFees,
  calculateRiskRewardRatio,
  calculateTradeDetails
} from './calculationTypes';

/**
 * Calcule les résultats pour le mode manuel (entrées manuelles)
 * @param params Les paramètres d'entrée fournis par l'utilisateur
 * @returns Les résultats des calculs
 */
export const calculateManualResults = (params: InputParameters): CalculationResults => {
  // Mode manuel : utiliser directement les prix d'entrée fournis
  const entryPrices = [...(params.entryPrices || [])];
  const numberOfTrades = entryPrices.length;

  // Si aucun prix d'entrée, retourner les valeurs par défaut
  if (entryPrices.length === 0) {
    return defaultResults('manual');
  }

  // Étape 2 : Calculs Communs
  const positionSize = params.balance * params.leverage;
  const amountPerTrade = positionSize / numberOfTrades;
  const realAmountPerTrade = params.balance / numberOfTrades; // Montant réel sans levier
  
  // Calculer le prix moyen d'entrée
  const averageEntryPrice = calculateAverageEntryPrice(entryPrices);

  // Calcul du risque total
  const riskTotal = calculateRiskTotal(entryPrices, params.stopLoss, amountPerTrade);

  // Profit Cible
  const profitTarget = calculateProfitTarget(
    entryPrices, 
    averageEntryPrice, 
    params.gainTarget, 
    amountPerTrade
  );

  // Coût Total des Frais
  const totalFees = calculateTotalFees(
    numberOfTrades, 
    amountPerTrade, 
    params.makerFee, 
    params.fundingFee, 
    params.duration
  );

  // Ratio Risque/Récompense
  const riskRewardRatio = calculateRiskRewardRatio(riskTotal, profitTarget);
  
  // Calcul des détails de chaque trade
  const tradeDetails = calculateTradeDetails(
    entryPrices,
    params.stopLoss,
    params.leverage,
    amountPerTrade,
    realAmountPerTrade,
    params.gainTarget,
    params.makerFee,
    params.fundingFee,
    params.duration,
    params.recovery
  );

  return {
    positionSize,
    numberOfTrades,
    amountPerTrade,
    realAmountPerTrade,
    averageEntryPrice,
    riskTotal,
    profitTarget,
    totalFees,
    riskRewardRatio,
    entryPrices,
    variant: 'manual',
    tradeDetails
  };
}; 