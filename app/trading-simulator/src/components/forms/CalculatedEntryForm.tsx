import React from 'react';
import { useTranslation } from 'react-i18next';
import Input from '../ui/Input';
import Label from '../ui/Label';
import ErrorMessage from '../ui/ErrorMessage';
import type { InputParameters } from '../../utils/types';

const CalculatedEntryForm: React.FC<{
  formData: InputParameters;
  errors: { [key: string]: string };
  handleInputChange: (field: keyof InputParameters, value: any) => void;
}> = ({ formData, errors, handleInputChange }) => {
  const { t } = useTranslation();
  
  // Calcul du nombre de trades en fonction du prix initial, du pourcentage de baisse et du stop-loss
  const calculateNumberOfTrades = () => {
    const initialPrice = formData.initialEntryPrice || 0;
    const dropPercentage = formData.dropPercentage || 0;
    const stopLoss = formData.stopLoss || 0;
    
    if (initialPrice <= 0 || dropPercentage <= 0 || stopLoss <= 0) {
      return 0;
    }
    
    // Commencer avec 1 pour inclure le prix initial
    let count = 1;
    let price = initialPrice;
    
    // Compter combien de trades sont nécessaires pour atteindre le stop-loss
    while (true) {
      price = price * (1 - dropPercentage / 100);
      
      // Si le prix passe sous le stop-loss, on ajoute ce dernier trade
      // et on arrête de compter
      if (price <= stopLoss) {
        count++;
        break;
      }
      
      count++;
      if (count > 99) break; // Limite de sécurité
    }
    
    return count;
  };
  
  // Calcul du nombre de trades effectifs
  const totalTrades = calculateNumberOfTrades();
  
  return (
    <div className="mt-8">
      <h3 className="text-md font-semibold mb-2">{t('sections.calculatedEntryPoints')}</h3>
      <div className="space-y-4">
        <div>
          <Label htmlFor="numberOfTrades">{t('fields.numberOfTrades')}</Label>
          <Input
            id="numberOfTrades"
            type="number"
            value={totalTrades}
            readOnly
            disabled
            className="bg-gray-100 dark:bg-gray-700"
          />
          <p className="text-xs text-gray-500 mt-1 italic">
            {t('fields.autoCalculatedTradesCount')}
            <br />
            {t('fields.tradesStopLossNote')}
            <br />
            {t('fields.includesLastTrade')}
          </p>
        </div>
        <div>
          <Label htmlFor="initialPrice">{t('fields.initialPrice')}</Label>
          <Input
            id="initialPrice"
            type="number"
            value={formData.initialEntryPrice}
            onChange={(e) =>
              handleInputChange('initialEntryPrice', Number(e.target.value))
            }
            aria-describedby={
              errors.initialEntryPrice ? 'initialPrice-error' : undefined
            }
            className={errors.initialEntryPrice ? 'border-red-400' : ''}
          />
          {errors.initialEntryPrice && (
            <ErrorMessage
              id="initialPrice-error"
              message={
                errors.initialEntryPrice === 'initialPriceTooLow'
                  ? t('errors.initialPriceTooLow')
                  : t('errors.initialPriceNegative')
              }
            />
          )}
        </div>
        <div>
          <Label htmlFor="dropPercentage">{t('fields.dropPercentage')} (%)</Label>
          <div className="relative">
            <Input
              id="dropPercentage"
              type="number"
              value={formData.dropPercentage}
              onChange={(e) =>
                handleInputChange('dropPercentage', Number(e.target.value))
              }
              aria-describedby={
                errors.dropPercentage ? 'dropPercentage-error' : undefined
              }
              className={errors.dropPercentage ? 'border-red-400' : ''}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="text-gray-500">%</span>
            </div>
          </div>
          {errors.dropPercentage && (
            <ErrorMessage
              id="dropPercentage-error"
              message={
                errors.dropPercentage === 'percentageOutOfRange'
                  ? t('errors.percentageOutOfRange')
                  : ''
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CalculatedEntryForm; 