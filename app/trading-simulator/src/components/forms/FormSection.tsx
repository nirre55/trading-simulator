// src/components/forms/FormSection.tsx
import React, { useState } from 'react';
import { toast } from 'react-toastify';
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
      toast.error('Saisie irréaliste : position totale < 100 $.', {
        position: 'bottom-right',
        autoClose: false,
        closeOnClick: true,
      });
    }
    if (allErrors.balance === 'insufficientPerTrade') {
      toast.error('Solde trop faible : minimum 100 $ requis par trade.', {
        position: 'bottom-right',
        autoClose: false,
        closeOnClick: true,
      });
    }
    if (formData.leverage === 0) {
      toast.info('Levier à 0 : simulation impossible.', {
        position: 'bottom-right',
        autoClose: false,
        closeOnClick: true,
      });
    }
    /*if (formData.duration === 0) {
      toast.info('Durée à 0 : frais de financement ignorés.', {
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
      <h2 className="text-lg font-semibold mb-4">Common Parameters</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="balance">Total Balance</Label>
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
                  ? 'Solde doit être > 0.'
                  : 'Saisie irréaliste : position totale < 100 $.'
              }
            />
          )}
        </div>

        <div>
          <Label htmlFor="leverage">Leverage</Label>
          <Select
            id="leverage"
            options={['1x', '5x', '10x', '50x', '100x']}
            value={`${formData.leverage}x`}
            onChange={(e) => handleLeverageChange(e.target.value)}
          />
          {errors.leverage && (
            <ErrorMessage
              id="leverage-error"
              message="Levier doit être entre 0 et 100."
            />
          )}
        </div>

        <div>
          <Label htmlFor="stoploss">Stop-loss Price</Label>
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
              message="Stop-Loss doit être > 0."
            />
          ) : errors.stopLoss && (
            <ErrorMessage
              id="stoploss-error"
              message="Stop-Loss doit être < Prix d'Entrée."
            />
          )}
        </div>

        <div>
          <Label htmlFor="target">Target Gain %</Label>
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
            <ErrorMessage id="target-error" message="Gain Cible doit être ≥ 0." />
          )}
        </div>

        <div>
          <Label htmlFor="fees">Fees (%)</Label>
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
                  message="Frais Maker doit être ≥ 0."
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
                  message="Frais Taker doit être ≥ 0."
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
                  message="Frais Financement doit être ≥ 0."
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
                  message="Durée doit être ≥ 0."
                />
              )}
            </div>
          </div>
          <div className="flex justify-between text-sm text-gray-600 dark:text-slate-300 px-1 mt-1">
            <span>Maker</span>
            <span>Taker</span>
            <span>Funding</span>
            <span>Duration</span>
          </div>
        </div>

        <Checkbox
          id="recovery"
          label="Loss recovery"
          checked={formData.recovery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleInputChange('recovery', e.target.checked)
          }
        />

        <div>
          <Label htmlFor="symbol">Symbol</Label>
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
          <h3 className="text-md font-semibold mb-2">Manual Entry Points</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="numTrades">Number of Trades</Label>
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
                      ? 'Nombre de Trades doit être ≥ 1.'
                      : 'Solde trop faible : minimum 100 $ requis par trade.'
                  }
                />
              )}
            </div>
            <div>
              <Label htmlFor="entryPrices">Entry Prices</Label>
              <DropPercentageInputList
                buttonText="+ Ajouter Entry Prices"
                symbol="$"
                values={formData.entryPrices!}
                onChange={(values) => handleInputChange('entryPrices', values)}
                errors={formData.entryPrices?.map((_, idx) =>
                  errors[`entryPrice${idx}`]
                    ? errors[`entryPrice${idx}`] === 'entryPriceTooLow'
                      ? 'Prix d’Entrée doit être > Stop-Loss.'
                      : 'Prix d’Entrée doit être > 0.'
                    : ''
                )}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-8">
          <h3 className="text-md font-semibold mb-2">Calculated Entry Points</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="initialPrice">Initial Entry Price</Label>
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
                      ? 'Prix d’Entrée Initial doit être > Stop-Loss.'
                      : 'Prix d’Entrée Initial doit être > 0.'
                  }
                />
              )}
            </div>
            <div>
              <Label htmlFor="dropPercentage">Drop Percentage</Label>
              <DropPercentageInputList
                buttonText="+ Add Drop Percentage"
                symbol="%"
                values={formData.dropPercentages!}
                onChange={(values) =>
                  handleInputChange('dropPercentages', values)
                }
                errors={formData.dropPercentages?.map((_, idx) =>
                  errors[`dropPercentage${idx}`]
                    ? 'Pourcentage de Baisse doit être entre 0 et 100.'
                    : errors.dropPercentages === 'tooManyPercentages'
                    ? 'Maximum 99 pourcentages.'
                    : ''
                )}
              />
            </div>
          </div>
        </div>
      )}

      <Button onClick={handleSimulate}>Simulate</Button>
    </div>
  );
};

export default FormSection;