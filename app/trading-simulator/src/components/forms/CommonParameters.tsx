import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input, Label, Checkbox, ErrorMessage, RangeInput } from '../ui';
import FeesInputGroup from './FeesInputGroup';
import { type InputParameters } from '../../utils';

const CommonParameters: React.FC<{
  formData: InputParameters;
  errors: { [key: string]: string };
  handleInputChange: (field: keyof InputParameters, value: any) => void;
}> = ({ formData, errors, handleInputChange }) => {
  const { t } = useTranslation();
  
  return (
    <>
      <h2 className="text-lg font-semibold mb-4">{t('sections.commonParameters')}</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="balance">{t('fields.balance')}</Label>
          <Input
            id="balance"
            type="number"
            value={formData.balance}
            onChange={(e) => handleInputChange('balance', Number(e.target.value))}
            aria-describedby={errors.balance ? 'balance-error' : undefined}
            className={errors.balance ? 'border-red-400' : ''}
          />
          {errors.balance && (
            <ErrorMessage
              id="balance-error"
              message={
                errors.balance === 'balanceTooLow'
                  ? t('errors.balanceTooLow')
                  : t('errors.insufficientPosition')
              }
            />
          )}
        </div>

        <div>
          <Label htmlFor="leverage">{t('fields.leverage')} ({formData.leverage}x)</Label>
          <div className="flex items-center space-x-2 w-full bg-slate-100 dark:bg-slate-800 rounded p-2">
            <RangeInput
              id="leverage"
              min={1}
              max={125}
              step={1}
              value={formData.leverage}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('leverage', Number(e.target.value))}
              aria-describedby={errors.leverage ? 'leverage-error' : undefined}
              className={`flex-grow ${errors.leverage ? 'border-red-400' : ''}`}
            />
            <span className="font-semibold text-sm min-w-[40px] text-right">{formData.leverage}x</span>
          </div>
          {errors.leverage && (
            <ErrorMessage
              id="leverage-error"
              message={t('errors.leverageOutOfRange')}
            />
          )}
        </div>

        <div>
          <Label htmlFor="stoploss">{t('fields.stopLoss')}</Label>
          <Input
            id="stoploss"
            type="number"
            value={formData.stopLoss}
            onChange={(e) => handleInputChange('stopLoss', Number(e.target.value))}
            aria-describedby={errors.stopLoss ? 'stoploss-error' : undefined}
            className={errors.stopLoss ? 'border-red-400' : ''}
          />
          {errors.stopLoss === 'stopLossTooLow' ? (
            <ErrorMessage
              id="stoploss-error"
              message={t('errors.stopLossTooLow')}
            />
          ) : errors.stopLoss && (
            <ErrorMessage
              id="stoploss-error"
              message={t('errors.stopLossVsEntryPrice')}
            />
          )}
        </div>

        <div>
          <Label htmlFor="target">{t('fields.gainTarget')}</Label>
          <Input
            id="target"
            type="number"
            value={formData.gainTarget}
            onChange={(e) =>
              handleInputChange('gainTarget', Number(e.target.value))
            }
            aria-describedby={errors.gainTarget ? 'target-error' : undefined}
            className={errors.gainTarget ? 'border-red-400' : ''}
          />
          {errors.gainTarget && (
            <ErrorMessage
              id="target-error"
              message={t('errors.gainTargetNegative')}
            />
          )}
        </div>

        <FeesInputGroup 
          formData={formData} 
          errors={errors} 
          handleInputChange={handleInputChange} 
        />

        <Checkbox
          id="recovery"
          label={t('common.lossRecovery')}
          checked={formData.recovery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleInputChange('recovery', e.target.checked)
          }
        />

        <div>
          <Label htmlFor="symbol">{t('fields.symbol')}</Label>
          <Input
            id="symbol"
            type="text"
            value={formData.symbol}
            onChange={(e) => handleInputChange('symbol', e.target.value)}
          />
        </div>
      </div>
    </>
  );
};

export default CommonParameters; 