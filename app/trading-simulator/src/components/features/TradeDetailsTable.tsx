import React from 'react';
import { useTranslation } from 'react-i18next';

interface TradeDetailsProps {
  entryPrices: number[];
  amountPerTrade: number; // C'est maintenant le montant réel (sans levier)
  stopLoss: number;
  targetGain: number;
  averageEntryPrice: number;
  makerFee: number;
  fundingFee: number;
  duration: number;
  leverage: number;
}

const TradeDetailsTable: React.FC<TradeDetailsProps> = ({
  entryPrices,
  amountPerTrade, // Montant réel sans levier
  stopLoss,
  targetGain,
  averageEntryPrice,
  makerFee,
  fundingFee,
  duration,
  leverage
}) => {
  const { t } = useTranslation();
  
  // Prix cible basé sur le gain cible et le prix moyen d'entrée
  const targetPrice = averageEntryPrice * (1 + targetGain / 100);

  // Calcul du montant avec levier pour chaque trade
  const leveragedAmountPerTrade = amountPerTrade * leverage;
  
  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-3">{t('sections.tradesDetail')}</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-slate-800 rounded-lg overflow-hidden shadow">
          <thead className="bg-gray-200 dark:bg-slate-700">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                {t('tradeTable.tradeNumber')}
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                {t('tradeTable.entryPrice')}
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                {t('tradeTable.realAmount')}
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                {t('tradeTable.leveragedAmount')}
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                {t('tradeTable.cryptoAmount')}
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                {t('tradeTable.liquidationPrice')}
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                {t('tradeTable.exitPrice')}
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                {t('tradeTable.profit')}
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                {t('tradeTable.fees')}
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                {t('tradeTable.riskRewardRatio')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-slate-600">
            {entryPrices.map((price, index) => {
              // Utiliser le montant avec levier pour le calcul de la quantité crypto
              const cryptoAmount = leveragedAmountPerTrade / price;
              
              // Calcul du prix de sortie pour ce trade (basé sur le prix d'entrée et le gain cible)
              const exitPrice = price * (1 + targetGain / 100);
              
              // Calcul du profit potentiel pour ce trade (basé sur le montant avec levier)
              const profit = leveragedAmountPerTrade * (targetGain / 100);
              
              // Calcul du risque (perte) potentiel pour ce trade
              const risk = (price - stopLoss) * cryptoAmount;
              
              // Calcul du ratio risque/récompense pour ce trade
              const riskRewardRatio = risk > 0 ? profit / risk : 0;
              
              // Calcul des frais pour ce trade (maker pour ouverture et fermeture + frais de financement)
              // Utiliser le montant avec levier pour le calcul des frais
              const fees = (leveragedAmountPerTrade * (makerFee / 100) * 2) + 
                           (leveragedAmountPerTrade * (fundingFee / 100) * duration);
              
              // Calcul du prix de liquidation selon la formule: liquidationPrice = entryPrice * (1 - 1/leverage)
              const liquidationPrice = price * (1 - 1/leverage);
              
              return (
                <tr key={index} className="hover:bg-gray-100 dark:hover:bg-slate-700">
                  <td className="px-4 py-2 whitespace-nowrap">{index + 1}</td>
                  <td className="px-4 py-2 whitespace-nowrap">${price.toFixed(2)}</td>
                  <td className="px-4 py-2 whitespace-nowrap">${amountPerTrade.toFixed(2)}</td>
                  <td className="px-4 py-2 whitespace-nowrap">${leveragedAmountPerTrade.toFixed(2)}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{cryptoAmount.toFixed(6)}</td>
                  <td className="px-4 py-2 whitespace-nowrap">${liquidationPrice.toFixed(2)}</td>
                  <td className="px-4 py-2 whitespace-nowrap">${exitPrice.toFixed(2)}</td>
                  <td className="px-4 py-2 whitespace-nowrap">${profit.toFixed(2)}</td>
                  <td className="px-4 py-2 whitespace-nowrap">${fees.toFixed(2)}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{riskRewardRatio.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TradeDetailsTable; 