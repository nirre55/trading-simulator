// src/components/forms/FormSection.tsx
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui';
import { Tabs } from '../layout';
import { SimulationResults } from '../features';
import CommonParameters from './CommonParameters';
import ManualEntryForm from './ManualEntryForm';
import CalculatedEntryForm from './CalculatedEntryForm';
import {
  validateCommonParams,
  validateVariant1,
  validateVariant2,
  calculateResults,
  type InputParameters
} from '../../utils';

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

// Composant principal
const FormSection: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'manual' | 'calculated'>('manual');
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
    dropPercentages: [0],
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [calculationResults, setCalculationResults] = useState<CalculationResults | null>(null);

  // Fonction pour gérer le changement d'onglet
  const handleTabChange = (tab: 'manual' | 'calculated') => {
    // Réinitialiser les résultats lors du changement d'onglet
    setCalculationResults(null);
    
    // Mettre à jour l'onglet actif
    setActiveTab(tab);
  };

  const handleSimulate = () => {
    const commonErrors = validateCommonParams(formData);
    const variantErrors =
      activeTab === 'manual'
        ? validateVariant1(formData)
        : validateVariant2(formData);
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
      const results = calculateResults(formData, activeTab);
      setCalculationResults(results);
      
      console.log('Résultats de la simulation :', results);
      toast.success(t('common.simulationComplete'), {
        position: 'bottom-right',
        autoClose: 3000,
        closeOnClick: true,
      });
    }
  };

  const handleInputChange = (field: keyof InputParameters, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Synchronisation automatique du nombre de trades avec les prix d'entrée en mode manuel
    if (field === 'entryPrices' && Array.isArray(value) && activeTab === 'manual') {
      setFormData((prev) => ({ ...prev, numberOfTrades: value.length }));
    }
    
    // Synchronisation automatique du nombre de trades avec les pourcentages de baisse en mode calculé
    if (field === 'dropPercentages' && Array.isArray(value) && activeTab === 'calculated') {
      // Le nombre de trades est égal au nombre de pourcentages
      setFormData((prev) => ({ ...prev, numberOfTrades: value.length }));
    }
  };

  const handleLeverageChange = (value: string) => {
    const numericValue = parseFloat(value.replace('x', '')) || 0;
    handleInputChange('leverage', numericValue);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 p-6 rounded-lg border border-gray-300 dark:border-slate-700">
      <Tabs active={activeTab} onChange={handleTabChange} />

      <CommonParameters 
        formData={formData} 
        errors={errors} 
        handleInputChange={handleInputChange}
        handleLeverageChange={handleLeverageChange}
      />

      {activeTab === 'manual' ? (
        <ManualEntryForm 
          formData={formData}
          errors={errors}
          handleInputChange={handleInputChange}
        />
      ) : (
        <CalculatedEntryForm
          formData={formData}
          errors={errors}
          handleInputChange={handleInputChange}
        />
      )}

      {/* Affichage des résultats s'ils existent */}
      {calculationResults && <SimulationResults results={calculationResults} />}

      {/* Bouton de simulation */}
      <div className="mt-6">
        <Button onClick={handleSimulate}>{t('common.simulate')}</Button>
      </div>
    </div>
  );
};

export default FormSection;