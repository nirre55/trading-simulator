import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { TradeDetail } from '../../utils/calculationTypes';

interface TradeDetailsProps {
  entryPrices: number[];
  amountPerTrade: number; // Montant avec levier
  realAmountPerTrade: number; // Montant réel sans levier
  stopLoss: number;
  targetGain: number;
  makerFee: number;
  fundingFee: number;
  duration: number;
  leverage: number;
  recovery: boolean;
  tradeDetails?: TradeDetail[];
}

// Hook personnalisé pour les médias queries
const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Défaut à false côté serveur, sera corrigé côté client
    const media = window.matchMedia(query);
    
    // Définir l'état initial
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    
    // Callback pour mettre à jour l'état
    const listener = () => {
      setMatches(media.matches);
    };
    
    // Écouter les changements
    media.addEventListener('change', listener);
    
    // Nettoyage
    return () => {
      media.removeEventListener('change', listener);
    };
  }, [matches, query]);

  return matches;
};

const TradeDetailsTable: React.FC<TradeDetailsProps> = ({
  entryPrices,
  amountPerTrade,
  realAmountPerTrade,
  stopLoss,
  targetGain,
  makerFee,
  fundingFee,
  duration,
  leverage,
  recovery,
  tradeDetails
}) => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery('(max-width: 767px)');
  
  // Rendu mobile en cartes
  const renderMobileCards = () => {
    if (tradeDetails) {
      return tradeDetails.map((trade, index) => {
        const cryptoAmount = amountPerTrade / trade.entryPrice;
        
        return (
          <div 
            key={index} 
            className="bg-white dark:bg-slate-800 rounded-lg border border-gray-300 dark:border-slate-700 shadow-md overflow-hidden mb-4"
          >
            <div className="bg-gray-200 dark:bg-slate-700 px-4 py-2 font-medium">
              {t('tradeTable.tradeNumber')} {trade.tradeNumber}
            </div>
            <div className="p-4 space-y-2">
              <div className="grid grid-cols-2 gap-x-2">
                <div className="text-sm text-gray-600 dark:text-gray-400">{t('tradeTable.entryPrice')}</div>
                <div className="text-sm font-medium">${trade.entryPrice.toFixed(2)}</div>
              </div>
              <div className="grid grid-cols-2 gap-x-2">
                <div className="text-sm text-gray-600 dark:text-gray-400">{t('tradeTable.exitPrice')}</div>
                <div className="text-sm font-medium">${trade.targetPrice.toFixed(2)}</div>
              </div>
              <div className="grid grid-cols-2 gap-x-2">
                <div className="text-sm text-gray-600 dark:text-gray-400">{t('tradeTable.profit')}</div>
                <div className="text-sm font-medium text-green-600 dark:text-green-400">${trade.profit.toFixed(2)}</div>
              </div>
              <div className="grid grid-cols-2 gap-x-2">
                <div className="text-sm text-gray-600 dark:text-gray-400">{t('tradeTable.liquidationPrice')}</div>
                <div className="text-sm font-medium">${trade.liquidationPrice.toFixed(2)}</div>
              </div>
              <div className="grid grid-cols-2 gap-x-2">
                <div className="text-sm text-gray-600 dark:text-gray-400">{t('tradeTable.leveragedAmount')}</div>
                <div className="text-sm font-medium">${amountPerTrade.toFixed(2)}</div>
              </div>
              <div className="grid grid-cols-2 gap-x-2">
                <div className="text-sm text-gray-600 dark:text-gray-400">{t('tradeTable.realAmount')}</div>
                <div className="text-sm font-medium">${realAmountPerTrade.toFixed(2)}</div>
              </div>
              <div className="grid grid-cols-2 gap-x-2">
                <div className="text-sm text-gray-600 dark:text-gray-400">{t('tradeTable.cryptoAmount')}</div>
                <div className="text-sm font-medium">{cryptoAmount.toFixed(6)}</div>
              </div>
              <div className="grid grid-cols-2 gap-x-2">
                <div className="text-sm text-gray-600 dark:text-gray-400">{t('tradeTable.adjustedGain')}</div>
                <div className="text-sm font-medium">{trade.adjustedGainTarget.toFixed(2)}%</div>
              </div>
              <div className="grid grid-cols-2 gap-x-2">
                <div className="text-sm text-gray-600 dark:text-gray-400">{t('tradeTable.fees')}</div>
                <div className="text-sm font-medium">${trade.fees.toFixed(2)}</div>
              </div>
              <div className="grid grid-cols-2 gap-x-2">
                <div className="text-sm text-gray-600 dark:text-gray-400">{t('tradeTable.riskRewardRatio')}</div>
                <div className="text-sm font-medium">{trade.riskRewardRatio.toFixed(2)}</div>
              </div>
            </div>
          </div>
        );
      });
    } else {
      return entryPrices.map((price, index) => {
        const cryptoAmount = amountPerTrade / price;
        const exitPrice = price * (1 + targetGain / 100);
        const profit = amountPerTrade * (targetGain / 100);
        const risk = (price - stopLoss) * cryptoAmount;
        const riskRewardRatio = risk > 0 ? profit / risk : 0;
        const fees = (amountPerTrade * (makerFee / 100) * 2) + 
                    (amountPerTrade * (fundingFee / 100) * duration);
        const liquidationPrice = price * (1 - 1/leverage);
        
        return (
          <div 
            key={index} 
            className="bg-white dark:bg-slate-800 rounded-lg border border-gray-300 dark:border-slate-700 shadow-md overflow-hidden mb-4"
          >
            <div className="bg-gray-200 dark:bg-slate-700 px-4 py-2 font-medium">
              {t('tradeTable.tradeNumber')} {index + 1}
            </div>
            <div className="p-4 space-y-2">
              <div className="grid grid-cols-2 gap-x-2">
                <div className="text-sm text-gray-600 dark:text-gray-400">{t('tradeTable.entryPrice')}</div>
                <div className="text-sm font-medium">${price.toFixed(2)}</div>
              </div>
              <div className="grid grid-cols-2 gap-x-2">
                <div className="text-sm text-gray-600 dark:text-gray-400">{t('tradeTable.exitPrice')}</div>
                <div className="text-sm font-medium">${exitPrice.toFixed(2)}</div>
              </div>
              <div className="grid grid-cols-2 gap-x-2">
                <div className="text-sm text-gray-600 dark:text-gray-400">{t('tradeTable.profit')}</div>
                <div className="text-sm font-medium text-green-600 dark:text-green-400">${profit.toFixed(2)}</div>
              </div>
              <div className="grid grid-cols-2 gap-x-2">
                <div className="text-sm text-gray-600 dark:text-gray-400">{t('tradeTable.liquidationPrice')}</div>
                <div className="text-sm font-medium">${liquidationPrice.toFixed(2)}</div>
              </div>
              <div className="grid grid-cols-2 gap-x-2">
                <div className="text-sm text-gray-600 dark:text-gray-400">{t('tradeTable.leveragedAmount')}</div>
                <div className="text-sm font-medium">${amountPerTrade.toFixed(2)}</div>
              </div>
              <div className="grid grid-cols-2 gap-x-2">
                <div className="text-sm text-gray-600 dark:text-gray-400">{t('tradeTable.realAmount')}</div>
                <div className="text-sm font-medium">${realAmountPerTrade.toFixed(2)}</div>
              </div>
              <div className="grid grid-cols-2 gap-x-2">
                <div className="text-sm text-gray-600 dark:text-gray-400">{t('tradeTable.cryptoAmount')}</div>
                <div className="text-sm font-medium">{cryptoAmount.toFixed(6)}</div>
              </div>
              <div className="grid grid-cols-2 gap-x-2">
                <div className="text-sm text-gray-600 dark:text-gray-400">{t('tradeTable.adjustedGain')}</div>
                <div className="text-sm font-medium">{targetGain.toFixed(2)}%</div>
              </div>
              <div className="grid grid-cols-2 gap-x-2">
                <div className="text-sm text-gray-600 dark:text-gray-400">{t('tradeTable.fees')}</div>
                <div className="text-sm font-medium">${fees.toFixed(2)}</div>
              </div>
              <div className="grid grid-cols-2 gap-x-2">
                <div className="text-sm text-gray-600 dark:text-gray-400">{t('tradeTable.riskRewardRatio')}</div>
                <div className="text-sm font-medium">{riskRewardRatio.toFixed(2)}</div>
              </div>
            </div>
          </div>
        );
      });
    }
  };
  
  return (
    <div className="mt-10">
      <h3 className="text-2xl font-semibold mb-5 text-center">
        {t('sections.tradesDetail')} {recovery ? t('common.withRecovery') : t('common.withoutRecovery')}
      </h3>
      
      {/* Vue pour appareils mobiles - visible seulement sur petit écran */}
      <div className="md:hidden">
        {renderMobileCards()}
      </div>
      
      {/* Vue pour desktop - cachée sur mobile */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-300 dark:border-slate-700 shadow-lg">
        <table className="min-w-full bg-white dark:bg-slate-800 rounded-lg overflow-hidden">
          <thead className="bg-gray-200 dark:bg-slate-700">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                {t('tradeTable.tradeNumber')}
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                {t('tradeTable.entryPrice')}
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                {t('tradeTable.realAmount')}
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                {t('tradeTable.leveragedAmount')}
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                {t('tradeTable.cryptoAmount')}
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                {t('tradeTable.liquidationPrice')}
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                {t('tradeTable.exitPrice')}
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                {t('tradeTable.profit')}
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                {t('tradeTable.adjustedGain')}
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                {t('tradeTable.fees')}
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                {t('tradeTable.riskRewardRatio')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-slate-600">
            {tradeDetails ? (
              // Utiliser les détails de trades calculés
              tradeDetails.map((trade, index) => {
                // Calculer la quantité crypto basée sur le montant avec levier
                const cryptoAmount = amountPerTrade / trade.entryPrice;
                
                return (
                  <tr key={index} className="hover:bg-gray-100 dark:hover:bg-slate-700">
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{trade.tradeNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${trade.entryPrice.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${realAmountPerTrade.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${amountPerTrade.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{cryptoAmount.toFixed(6)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${trade.liquidationPrice.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${trade.targetPrice.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-green-600 dark:text-green-400">${trade.profit.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{trade.adjustedGainTarget.toFixed(2)}%</td>
                    <td className="px-6 py-4 whitespace-nowrap">${trade.fees.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{trade.riskRewardRatio.toFixed(2)}</td>
                  </tr>
                );
              })
            ) : (
              // Fallback pour la compatibilité avec l'ancien code
              entryPrices.map((price, index) => {
                // Utiliser le montant avec levier pour le calcul de la quantité crypto
                const cryptoAmount = amountPerTrade / price;
                
                // Calcul du prix de sortie pour ce trade (basé sur le prix d'entrée et le gain cible)
                const exitPrice = price * (1 + targetGain / 100);
                
                // Calcul du profit potentiel pour ce trade (basé sur le montant avec levier)
                const profit = amountPerTrade * (targetGain / 100);
                
                // Calcul du risque (perte) potentiel pour ce trade
                const risk = (price - stopLoss) * cryptoAmount;
                
                // Calcul du ratio risque/récompense pour ce trade
                const riskRewardRatio = risk > 0 ? profit / risk : 0;
                
                // Calcul des frais pour ce trade (maker pour ouverture et fermeture + frais de financement)
                // Utiliser le montant avec levier pour le calcul des frais
                const fees = (amountPerTrade * (makerFee / 100) * 2) + 
                             (amountPerTrade * (fundingFee / 100) * duration);
                
                // Calcul du prix de liquidation selon la formule: liquidationPrice = entryPrice * (1 - 1/leverage)
                const liquidationPrice = price * (1 - 1/leverage);
                
                return (
                  <tr key={index} className="hover:bg-gray-100 dark:hover:bg-slate-700">
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${price.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${realAmountPerTrade.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${amountPerTrade.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{cryptoAmount.toFixed(6)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${liquidationPrice.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${exitPrice.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-green-600 dark:text-green-400">${profit.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{targetGain.toFixed(2)}%</td>
                    <td className="px-6 py-4 whitespace-nowrap">${fees.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{riskRewardRatio.toFixed(2)}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TradeDetailsTable; 