import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input, Label, Select, Checkbox, ErrorMessage } from '../ui';
import FeesInputGroup from './FeesInputGroup';
import { type InputParameters } from '../../utils';

const CommonParameters: React.FC<{
  formData: InputParameters;
  errors: { [key: string]: string };
  handleInputChange: (field: keyof InputParameters, value: any) => void;
  handleLeverageChange: (value: string) => void;
}> = ({ formData, errors, handleInputChange, handleLeverageChange }) => {
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
          <Label htmlFor="leverage">{t('fields.leverage')}</Label>
          <Select
            id="leverage"
            options={['1x', '5x', '10x', '50x', '100x']}
            value={`${formData.leverage}x`}
            onChange={(e) => handleLeverageChange(e.target.value)}
          />
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