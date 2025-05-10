// src/utils/calculations.ts
import type { InputParameters } from './types';
import type { CalculationResults } from './calculationTypes';
import { calculateManualResults } from './manualCalculations';
import { calculateCalculatedResults } from './calculatedCalculations';

/**
 * Fonction principale pour calculer les résultats en fonction des paramètres d'entrée et du mode choisi
 * @param params Les paramètres d'entrée fournis par l'utilisateur
 * @param variant Le mode de calcul ('manual' ou 'calculated')
 * @returns Les résultats des calculs
 */
export const calculateResults = (
  params: InputParameters,
  variant: 'manual' | 'calculated'
): CalculationResults => {
  if (variant === 'manual') {
    return calculateManualResults(params);
  } else {
    return calculateCalculatedResults(params);
  }
};

// Réexporter CalculationResults pour les imports existants
export type { CalculationResults };