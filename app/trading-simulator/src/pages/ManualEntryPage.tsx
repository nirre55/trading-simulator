import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui';
import { SimulationResults } from '../components/features';
import CommonParameters from '../components/forms/CommonParameters';
import ManualEntryForm from '../components/forms/ManualEntryForm';
import {
  validateCommonParams,
  validateVariant1,
  calculateResults,
  type InputParameters,
  type TradeDetail
} from '../utils';

// Type pour les résultats des calculs
interface CalculationResults {
  positionSize: number;
  numberOfTrades: number;
  amountPerTrade: number;
  realAmountPerTrade: number;
  averageEntryPrice: number;
  riskTotal: number;
  profitTarget: number;
  totalFees: number;
  riskRewardRatio: number;
  entryPrices: number[];
  variant: 'manual' | 'calculated';
  tradeDetails?: TradeDetail[];
}

const ManualEntryPage: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<InputParameters>({
    balance: 1000,
    leverage: 10,
    stopLoss: 20,
    gainTarget: 100,
    makerFee: 0.1,
    takerFee: 0.2,
    fundingFee: 0.01,
    duration: 1,
    recovery: false,
    symbol: 'BTC/USDT',
    numberOfTrades: 1,
    entryPrices: [100],
    initialEntryPrice: 100,
    dropPercentage: 50,
    dropPercentages: [],
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [calculationResults, setCalculationResults] = useState<CalculationResults | null>(null);

  const handleSimulate = () => {
    const commonErrors = validateCommonParams(formData);
    const variantErrors = validateVariant1(formData);
    const allErrors = { ...commonErrors, ...variantErrors };
    setErrors(allErrors);

    // Toasts pour erreurs critiques ou informatives
    if (allErrors.balance === 'insufficientPosition') {
      toast.error(t('toasts.insufficientPosition'), {
        position: 'bottom-right',
        autoClose: false,
        closeOnClick: true,
      });
    }
    if (allErrors.balance === 'insufficientPerTrade') {
      toast.error(t('toasts.insufficientPerTrade'), {
        position: 'bottom-right',
        autoClose: false,
        closeOnClick: true,
      });
    }
    if (formData.leverage === 0) {
      toast.info(t('toasts.leverageZero'), {
        position: 'bottom-right',
        autoClose: false,
        closeOnClick: true,
      });
    }
    if (formData.duration === 0) {
      toast.info(t('toasts.durationZero'), {
        position: 'bottom-right',
        autoClose: 3000,
        closeOnClick: true,
      });
    }

    // Si aucune erreur, procéder à la simulation
    if (Object.keys(allErrors).length === 0) {
      // Appel à la fonction calculateResults pour obtenir les résultats
      const results = calculateResults(formData, 'manual');
      setCalculationResults(results);
      
      toast.success(t('common.simulationComplete'), {
        position: 'bottom-right',
        autoClose: 3000,
        closeOnClick: true,
      });
    }
  };

  const handleInputChange = (field: keyof InputParameters, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Synchronisation automatique du nombre de trades avec les prix d'entrée
    if (field === 'entryPrices' && Array.isArray(value)) {
      setFormData((prev) => ({ ...prev, numberOfTrades: value.length }));
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-white dark:bg-slate-900 p-8 rounded-lg border border-gray-300 dark:border-slate-700 shadow-lg">
      <h2 className="text-3xl font-bold mb-8 text-center">{t('tabs.manual')}</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <CommonParameters 
            formData={formData} 
            errors={errors} 
            handleInputChange={handleInputChange}
          />
        </div>
        
        <div>
          <ManualEntryForm 
            formData={formData}
            errors={errors}
            handleInputChange={handleInputChange}
          />
        </div>
      </div>

      {/* Bouton de simulation */}
      <div className="mt-8 flex justify-center">
        <Button 
          onClick={handleSimulate}
          className="px-8 py-3 text-lg font-semibold"
        >
          {t('common.simulate')}
        </Button>
      </div>

      {/* Affichage des résultats s'ils existent */}
      {calculationResults && (
        <SimulationResults 
          results={calculationResults} 
          stopLoss={formData.stopLoss}
          gainTarget={formData.gainTarget}
          makerFee={formData.makerFee}
          fundingFee={formData.fundingFee}
          duration={formData.duration}
          leverage={formData.leverage}
          recovery={formData.recovery}
        />
      )}
    </div>
  );
};

export default ManualEntryPage; 