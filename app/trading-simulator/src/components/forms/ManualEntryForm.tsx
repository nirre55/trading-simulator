import React from 'react';
import { useTranslation } from 'react-i18next';
import Input from '../ui/Input';
import Label from '../ui/Label';
import ErrorMessage from '../ui/ErrorMessage';
import DropPercentageInputList from './DropPercentageInputList';
import type { InputParameters } from '../../utils/types';

const ManualEntryForm: React.FC<{
  formData: InputParameters;
  errors: { [key: string]: string };
  handleInputChange: (field: keyof InputParameters, value: any) => void;
}> = ({ formData, errors, handleInputChange }) => {
  const { t } = useTranslation();
  
  return (
    <div className="mt-8">
      <h3 className="text-md font-semibold mb-2">{t('sections.manualEntryPoints')}</h3>
      <div className="space-y-4">
        <div>
          <Label htmlFor="numTrades">{t('fields.numberOfTrades')}</Label>
          <Input
            id="numTrades"
            type="number"
            value={formData.numberOfTrades}
            readOnly
            disabled
            aria-describedby={
              errors.numberOfTrades ? 'numTrades-error' : undefined
            }
            className={`bg-gray-100 dark:bg-gray-700 ${errors.numberOfTrades ? 'border-red-400' : ''}`}
          />
          {errors.numberOfTrades && (
            <ErrorMessage
              id="numTrades-error"
              message={
                errors.numberOfTrades === 'tradesTooLow'
                  ? t('errors.tradesTooLow')
                  : t('errors.insufficientPerTrade')
              }
            />
          )}
          <p className="text-xs text-gray-500 mt-1 italic">{t('fields.autoTradesCount')}</p>
        </div>
        <div>
          <Label htmlFor="entryPrices">{t('fields.entryPrices')}</Label>
          <DropPercentageInputList
            buttonText={t('buttons.addEntryPrice')}
            symbol="$"
            values={formData.entryPrices!}
            onChange={(values) => handleInputChange('entryPrices', values)}
            errors={formData.entryPrices?.map((_, idx) =>
              errors[`entryPrice${idx}`]
                ? errors[`entryPrice${idx}`] === 'entryPriceTooLow'
                  ? t('errors.entryPriceTooLow')
                  : t('errors.entryPriceNegative')
                : ''
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default ManualEntryForm; 