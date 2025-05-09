import React from 'react';
import { useTranslation } from 'react-i18next';
import Input from '../ui/Input';
import Label from '../ui/Label';
import ErrorMessage from '../ui/ErrorMessage';
import DropPercentageInputList from './DropPercentageInputList';
import type { InputParameters } from '../../utils/types';

const CalculatedEntryForm: React.FC<{
  formData: InputParameters;
  errors: { [key: string]: string };
  handleInputChange: (field: keyof InputParameters, value: any) => void;
}> = ({ formData, errors, handleInputChange }) => {
  const { t } = useTranslation();
  
  return (
    <div className="mt-8">
      <h3 className="text-md font-semibold mb-2">{t('sections.calculatedEntryPoints')}</h3>
      <div className="space-y-4">
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
          <Label htmlFor="dropPercentage">{t('fields.dropPercentage')}</Label>
          <DropPercentageInputList
            buttonText={t('buttons.addDropPercentage')}
            symbol="%"
            values={formData.dropPercentages!}
            onChange={(values) =>
              handleInputChange('dropPercentages', values)
            }
            errors={formData.dropPercentages?.map((_, idx) =>
              errors[`dropPercentage${idx}`]
                ? t('errors.percentageOutOfRange')
                : errors.dropPercentages === 'tooManyPercentages'
                ? t('errors.tooManyPercentages')
                : errors.dropPercentages === 'insufficientPerTrade'
                ? t('errors.insufficientPerTrade')
                : ''
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default CalculatedEntryForm; 