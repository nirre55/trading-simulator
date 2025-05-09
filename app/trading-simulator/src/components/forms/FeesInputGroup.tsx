import React from 'react';
import { useTranslation } from 'react-i18next';
import Input from '../ui/Input';
import Label from '../ui/Label';
import ErrorMessage from '../ui/ErrorMessage';
import type { InputParameters } from '../../utils/types';

const FeesInputGroup: React.FC<{
  formData: InputParameters;
  errors: { [key: string]: string };
  handleInputChange: (field: keyof InputParameters, value: any) => void;
}> = ({ formData, errors, handleInputChange }) => {
  const { t } = useTranslation();
  
  return (
    <div>
      <Label htmlFor="fees">{t('fields.fees')}</Label>
      <div className="grid grid-cols-4 gap-2">
        <div>
          <Input
            id="maker"
            type="number"
            value={formData.makerFee}
            onChange={(e) =>
              handleInputChange('makerFee', Number(e.target.value))
            }
            aria-describedby={errors.makerFee ? 'maker-error' : undefined}
            className={errors.makerFee ? 'border-red-400' : ''}
          />
          {errors.makerFee && (
            <ErrorMessage
              id="maker-error"
              message={t('errors.feeNegative.maker')}
            />
          )}
        </div>
        <div>
          <Input
            id="taker"
            type="number"
            value={formData.takerFee}
            onChange={(e) =>
              handleInputChange('takerFee', Number(e.target.value))
            }
            aria-describedby={errors.takerFee ? 'taker-error' : undefined}
            className={errors.takerFee ? 'border-red-400' : ''}
          />
          {errors.takerFee && (
            <ErrorMessage
              id="taker-error"
              message={t('errors.feeNegative.taker')}
            />
          )}
        </div>
        <div>
          <Input
            id="funding"
            type="number"
            value={formData.fundingFee}
            onChange={(e) =>
              handleInputChange('fundingFee', Number(e.target.value))
            }
            aria-describedby={errors.fundingFee ? 'funding-error' : undefined}
            className={errors.fundingFee ? 'border-red-400' : ''}
          />
          {errors.fundingFee && (
            <ErrorMessage
              id="funding-error"
              message={t('errors.feeNegative.funding')}
            />
          )}
        </div>
        <div>
          <Input
            id="duration"
            type="number"
            value={formData.duration}
            onChange={(e) =>
              handleInputChange('duration', Number(e.target.value))
            }
            aria-describedby={errors.duration ? 'duration-error' : undefined}
            className={errors.duration ? 'border-red-400' : ''}
          />
          {errors.duration && (
            <ErrorMessage
              id="duration-error"
              message={t('errors.durationNegative')}
            />
          )}
        </div>
      </div>
      <div className="flex justify-between text-sm text-gray-600 dark:text-slate-300 px-1 mt-1">
        <span>{t('fields.maker')}</span>
        <span>{t('fields.taker')}</span>
        <span>{t('fields.funding')}</span>
        <span>{t('fields.duration')}</span>
      </div>
    </div>
  );
};

export default FeesInputGroup; 