// src/components/forms/FormSection.tsx
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import Input from '../ui/Input';
import Label from '../ui/Label';
import Select from '../ui/Select';
import Checkbox from '../ui/Checkbox';
import Button from '../ui/Button';
import ErrorMessage from '../ui/ErrorMessage';
import DropPercentageInputList from './DropPercentageInputList';
import Tabs from '../layout/Tabs';
import {
  validateCommonParams,
  validateVariant1,
  validateVariant2,
} from '../../utils/validations';
import type { InputParameters } from '../../utils/types';

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
    /*if (formData.duration === 0) {
      toast.info(t('toasts.durationZero'), {
        position: 'bottom-right',
        autoClose: 3000,
        closeOnClick: true,
      });
    }*/

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

      {/* Common Parameters */}
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

      {/* Tab-specific sections */}
      {activeTab === 'manual' ? (
        <div className="mt-8">
          <h3 className="text-md font-semibold mb-2">{t('sections.manualEntryPoints')}</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="numTrades">{t('fields.numberOfTrades')}</Label>
              <Input
                id="numTrades"
                type="number"
                value={formData.numberOfTrades}
                onChange={(e) =>
                  handleInputChange('numberOfTrades', Number(e.target.value))
                }
                aria-describedby={
                  errors.numberOfTrades ? 'numTrades-error' : undefined
                }
                className={errors.numberOfTrades ? 'border-red-400' : ''}
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
      ) : (
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
      )}

      {/* Bouton de simulation */}
      <Button onClick={handleSimulate}>{t('common.simulate')}</Button>
    </div>
  );
};

export default FormSection;