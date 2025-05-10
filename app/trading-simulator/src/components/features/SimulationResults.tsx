import React from 'react';
import { useTranslation } from 'react-i18next';
import TradeDetailsTable from './TradeDetailsTable';

// Type pour les résultats des calculs
interface CalculationResults {
  positionSize: number;
  numberOfTrades: number;
  amountPerTrade: number;
  averageEntryPrice: number;
  riskTotal: number;
  profitTarget: number;
  totalFees: number;
  riskRewardRatio: number;
  entryPrices: number[];
  variant: 'manual' | 'calculated'; // Mode de calcul utilisé
}

interface SimulationResultsProps {
  results: CalculationResults;
  stopLoss: number; // Ajout du stop-loss pour le tableau de détails
  gainTarget: number; // Ajout du gain cible pour le tableau de détails
  makerFee: number; // Ajout des frais maker pour le tableau de détails
  fundingFee: number; // Ajout des frais de financement pour le tableau de détails
  duration: number; // Ajout de la durée pour le tableau de détails
  leverage: number; // Ajout du levier pour le calcul du prix de liquidation
}

const SimulationResults: React.FC<SimulationResultsProps> = ({ 
  results, 
  stopLoss, 
  gainTarget, 
  makerFee, 
  fundingFee, 
  duration,
  leverage
}) => {
  const { t } = useTranslation();
  
  return (
    <div className="mt-6 p-4 bg-gray-100 dark:bg-slate-800 rounded-lg">
      <h3 className="text-lg font-semibold mb-3">{t('sections.results')}</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p>
            <span className="font-bold">{t('results.positionSize')}:</span> ${results.positionSize.toFixed(2)}
          </p>
          <p>
            <span className="font-bold">{t('results.amountPerTrade')}:</span> ${results.amountPerTrade.toFixed(2)}
          </p>
          <p>
            <span className="font-bold">{t('results.averageEntryPrice')}:</span> ${results.averageEntryPrice.toFixed(2)}
          </p>
          <p>
            <span className="font-bold">{t('results.numberOfTrades')}:</span> {results.numberOfTrades}
          </p>
        </div>
        <div>
          <p>
            <span className="font-bold">{t('results.riskTotal')}:</span> ${results.riskTotal.toFixed(2)}
          </p>
          <p>
            <span className="font-bold">{t('results.profitTarget')}:</span> ${results.profitTarget.toFixed(2)}
          </p>
          <p>
            <span className="font-bold">{t('results.totalFees')}:</span> ${results.totalFees.toFixed(2)}
          </p>
          <p>
            <span className="font-bold">{t('results.riskRewardRatio')}:</span> {results.riskRewardRatio.toFixed(2)}
          </p>
        </div>
      </div>
      
      {/* Afficher les détails des trades uniquement en mode manuel */}
      {results.variant === 'manual' && results.entryPrices.length > 0 && (
        <TradeDetailsTable 
          entryPrices={results.entryPrices}
          amountPerTrade={results.amountPerTrade}
          stopLoss={stopLoss}
          targetGain={gainTarget}
          averageEntryPrice={results.averageEntryPrice}
          makerFee={makerFee}
          fundingFee={fundingFee}
          duration={duration}
          leverage={leverage}
        />
      )}
    </div>
  );
};

export default SimulationResults; 