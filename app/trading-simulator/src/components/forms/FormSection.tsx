// src/components/forms/FormSection.tsx
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import Button from '../ui/Button';
import Tabs from '../layout/Tabs';
import CommonParameters from './CommonParameters';
import ManualEntryForm from './ManualEntryForm';
import CalculatedEntryForm from './CalculatedEntryForm';
import {
  validateCommonParams,
  validateVariant1,
  validateVariant2,
} from '../../utils/validations';
import type { InputParameters } from '../../utils/types';

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
    numberOfTrades: 3,
    entryPrices: [0, 0, 0],
    initialEntryPrice: 100,
    dropPercentages: [0],
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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

    // Si aucune erreur, procéder à la simulation (logique à ajouter)
    if (Object.keys(allErrors).length === 0) {
      console.log('Simulation déclenchée avec :', formData);
      // TODO: Ajouter la logique de simulation ici
    }
  };

  const handleInputChange = (field: keyof InputParameters, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLeverageChange = (value: string) => {
    const numericValue = parseFloat(value.replace('x', '')) || 0;
    handleInputChange('leverage', numericValue);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 p-6 rounded-lg border border-gray-300 dark:border-slate-700">
      <Tabs active={activeTab} onChange={setActiveTab} />

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

      {/* Bouton de simulation */}
      <Button onClick={handleSimulate}>{t('common.simulate')}</Button>
    </div>
  );
};

export default FormSection;