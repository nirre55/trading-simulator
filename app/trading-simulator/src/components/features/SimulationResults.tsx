import React from 'react';
import { useTranslation } from 'react-i18next';

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
}

interface SimulationResultsProps {
  results: CalculationResults;
}

const SimulationResults: React.FC<SimulationResultsProps> = ({ results }) => {
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
    </div>
  );
};

export default SimulationResults; 