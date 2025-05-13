import React from 'react';
import { useTranslation } from 'react-i18next';
import TradeDetailsTable from './TradeDetailsTable';
import type { TradeDetail } from '../../utils/calculationTypes';

// Type pour les résultats des calculs
interface CalculationResults {
  positionSize: number;
  numberOfTrades: number;
  amountPerTrade: number;
  realAmountPerTrade: number; // Montant réel par trade (sans levier)
  averageEntryPrice: number;
  riskTotal: number;
  profitTarget: number;
  totalFees: number;
  riskRewardRatio: number;
  entryPrices: number[];
  variant: 'manual' | 'calculated'; // Mode de calcul utilisé
  tradeDetails?: TradeDetail[]; // Détails de chaque trade individuel
}

interface SimulationResultsProps {
  results: CalculationResults;
  stopLoss: number; // Ajout du stop-loss pour le tableau de détails
  gainTarget: number; // Ajout du gain cible pour le tableau de détails
  makerFee: number; // Ajout des frais maker pour le tableau de détails
  fundingFee: number; // Ajout des frais de financement pour le tableau de détails
  duration: number; // Ajout de la durée pour le tableau de détails
  leverage: number; // Ajout du levier pour le calcul du prix de liquidation
  recovery: boolean; // Ajout du paramètre de récupération
}

const SimulationResults: React.FC<SimulationResultsProps> = ({ 
  results, 
  stopLoss, 
  gainTarget, 
  makerFee, 
  fundingFee, 
  duration,
  leverage,
  recovery
}) => {
  const { t } = useTranslation();
  
  // Afficher uniquement les détails des trades (la partie résumé a été supprimée)
  return (
    <div className="mt-8">
      {results.entryPrices.length > 0 && (
        <TradeDetailsTable 
          entryPrices={results.entryPrices}
          amountPerTrade={results.amountPerTrade}
          realAmountPerTrade={results.realAmountPerTrade}
          stopLoss={stopLoss}
          targetGain={gainTarget}
          makerFee={makerFee}
          fundingFee={fundingFee}
          duration={duration}
          leverage={leverage}
          recovery={recovery}
          tradeDetails={results.tradeDetails}
        />
      )}
    </div>
  );
};

export default SimulationResults; 