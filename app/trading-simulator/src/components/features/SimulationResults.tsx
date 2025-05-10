import React from 'react';
import { useTranslation } from 'react-i18next';
import TradeDetailsTable from './TradeDetailsTable';

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
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-3">{t('sections.results')}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('results.positionSize')}</p>
          <p className="text-xl font-bold">${results.positionSize.toFixed(2)}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('results.numberOfTrades')}</p>
          <p className="text-xl font-bold">{results.numberOfTrades}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('results.amountPerTrade')}</p>
          <p className="text-xl font-bold">${results.amountPerTrade.toFixed(2)}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('results.realAmountPerTrade')}</p>
          <p className="text-xl font-bold">${results.realAmountPerTrade.toFixed(2)}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('results.averageEntryPrice')}</p>
          <p className="text-xl font-bold">${results.averageEntryPrice.toFixed(2)}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('results.riskTotal')}</p>
          <p className="text-xl font-bold">${results.riskTotal.toFixed(2)}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('results.profitTarget')}</p>
          <p className="text-xl font-bold">${results.profitTarget.toFixed(2)}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('results.totalFees')}</p>
          <p className="text-xl font-bold">${results.totalFees.toFixed(2)}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('results.riskRewardRatio')}</p>
          <p className="text-xl font-bold">{results.riskRewardRatio.toFixed(2)}</p>
        </div>
      </div>
      
      {/* Afficher les détails des trades dans les deux modes */}
      {results.entryPrices.length > 0 && (
        <TradeDetailsTable 
          entryPrices={results.entryPrices}
          amountPerTrade={results.realAmountPerTrade}
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