// src/utils/calculations.ts
import type { InputParameters } from './types';

interface CalculationResults {
  positionSize: number; // Taille Totale de la Position ($)
  numberOfTrades: number; // Nombre de Trades
  amountPerTrade: number; // Montant par Trade ($)
  averageEntryPrice: number; // Prix Moyen d'Entrée ($)
  riskTotal: number; // Risque Total ($)
  profitTarget: number; // Profit Cible ($)
  totalFees: number; // Coût Total des Frais ($)
  riskRewardRatio: number; // Ratio Risque/Récompense
  entryPrices: number[]; // Liste des Prix d'Entrée ($)
  variant: 'manual' | 'calculated'; // Mode de calcul utilisé
}

export const calculateResults = (
  params: InputParameters,
  variant: 'manual' | 'calculated'
): CalculationResults => {
  // Étape 1 : Calculer les Prix d'Entrée
  let entryPrices: number[] = [];
  let numberOfTrades = params.numberOfTrades || 0;

  if (variant === 'manual') {
    // Mode manuel : utiliser directement les prix d'entrée fournis
    entryPrices = [...(params.entryPrices || [])];
    numberOfTrades = entryPrices.length;
  } else {
    // Mode calculé : générer les prix d'entrée à partir du prix initial et des pourcentages de baisse
    // Le premier prix est le prix initial
    const initialPrice = params.initialEntryPrice || 0;
    
    // Si le prix initial est 0 ou les pourcentages sont vides, retourner des valeurs par défaut
    if (initialPrice === 0 || (params.dropPercentages && params.dropPercentages.length === 0)) {
      return {
        positionSize: 0,
        numberOfTrades: 0,
        amountPerTrade: 0,
        averageEntryPrice: 0,
        riskTotal: 0,
        profitTarget: 0,
        totalFees: 0,
        riskRewardRatio: 0,
        entryPrices: [],
        variant
      };
    }
    
    // On génère ensuite les prix suivants en appliquant les pourcentages de baisse
    let lastPrice = initialPrice;
    entryPrices.push(lastPrice);
    
    // Pour chaque pourcentage, on calcule le nouveau prix
    (params.dropPercentages || []).forEach((dropPercentage) => {
      lastPrice = lastPrice * (1 - dropPercentage / 100);
      entryPrices.push(lastPrice);
    });
    
    // Le nombre de trades est égal au nombre de pourcentages
    numberOfTrades = params.dropPercentages?.length || 0;
  }

  // Vérifier si entryPrices est vide
  if (entryPrices.length === 0) {
    return {
      positionSize: 0,
      numberOfTrades: 0,
      amountPerTrade: 0,
      averageEntryPrice: 0,
      riskTotal: 0,
      profitTarget: 0,
      totalFees: 0,
      riskRewardRatio: 0,
      entryPrices: [],
      variant
    };
  }

  // Étape 2 : Calculs Communs
  const positionSize = params.balance * params.leverage;
  const amountPerTrade = positionSize / numberOfTrades;
  
  // Calculer le prix moyen d'entrée (sans inclure le prix initial en mode calculé)
  const pricesForAverage = variant === 'calculated' 
    ? entryPrices.slice(1) // Exclure le prix initial
    : entryPrices;
    
  const averageEntryPrice = pricesForAverage.length > 0
    ? pricesForAverage.reduce((sum, price) => sum + price, 0) / pricesForAverage.length
    : 0;

  // Risque Total - uniquement sur les prix d'entrée effectifs (pas le prix initial en mode calculé)
  const tradePrices = variant === 'calculated' 
    ? entryPrices.slice(1) // Exclure le prix initial
    : entryPrices;
    
  const riskTotal = tradePrices.reduce((sum, price) => {
    const loss = (price - params.stopLoss) * (amountPerTrade / price);
    return sum + loss;
  }, 0);

  // Profit Cible
  const targetPrice = averageEntryPrice * (1 + params.gainTarget / 100);
  const profitTarget = tradePrices.reduce((sum, price) => {
    const gain = (targetPrice - price) * (amountPerTrade / price);
    return sum + gain;
  }, 0);

  // Coût Total des Frais
  const makerCost = numberOfTrades * (amountPerTrade * (params.makerFee / 100)) * 2; // Ouverture + Fermeture
  const takerCost = 0; // Hypothèse : Maker utilisé
  const fundingCost =
    numberOfTrades * (amountPerTrade * (params.fundingFee / 100) * params.duration);
  const totalFees = makerCost + takerCost + fundingCost;

  // Ratio Risque/Récompense
  const riskRewardRatio = riskTotal > 0 ? profitTarget / riskTotal : 0;

  return {
    positionSize,
    numberOfTrades,
    amountPerTrade,
    averageEntryPrice,
    riskTotal,
    profitTarget,
    totalFees,
    riskRewardRatio,
    entryPrices: tradePrices, // Retourner seulement les prix d'entrée effectifs
    variant
  };
};