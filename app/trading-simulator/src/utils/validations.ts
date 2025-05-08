// src/utils/validations.ts
import type { InputParameters } from './types';

export const validateCommonParams = (params: InputParameters) => {
  const errors: { [key: string]: string } = {};
  if (params.balance <= 0) errors.balance = 'balanceTooLow';
  if (params.leverage <= 0 || params.leverage > 100) errors.leverage = 'leverageOutOfRange';
  if (params.stopLoss <= 0) errors.stopLoss = 'stopLossTooLow';
  if (params.gainTarget < 0) errors.gainTarget = 'gainTargetNegative';
  if (params.makerFee < 0) errors.makerFee = 'feeNegative';
  if (params.takerFee < 0) errors.takerFee = 'feeNegative';
  if (params.fundingFee < 0) errors.fundingFee = 'feeNegative';
  if (params.duration < 0) errors.duration = 'durationNegative';
  if (params.balance * params.leverage < 100) errors.balance = 'insufficientPosition';
  return errors;
};

export const validateVariant1 = (params: InputParameters) => {
  const errors: { [key: string]: string } = {};
  if (params.numberOfTrades! < 1) errors.numberOfTrades = 'tradesTooLow';
  if ((params.balance * params.leverage) / params.numberOfTrades! < 100) {
    errors.numberOfTrades = 'insufficientPerTrade';
  }
  params.entryPrices?.forEach((price, index) => {
    if (price <= params.stopLoss) {
      errors[`entryPrice${index}`] = 'entryPriceTooLow';
    }
    if (price <= 0) {
      errors[`entryPrice${index}`] = 'entryPriceNegative';
    }
  });
  return errors;
};

export const validateVariant2 = (params: InputParameters) => {
  const errors: { [key: string]: string } = {};
  if (params.initialEntryPrice! <= params.stopLoss) {
    errors.initialEntryPrice = 'initialPriceTooLow';
  }
  if (params.initialEntryPrice! <= 0) {
    errors.initialEntryPrice = 'initialPriceNegative';
  }
  if (params.dropPercentages!.length > 99) {
    errors.dropPercentages = 'tooManyPercentages';
  }
  if (params.dropPercentages!.length > 0 && (params.balance * params.leverage) / (params.dropPercentages!.length + 1) < 100) {
    errors.dropPercentages = 'insufficientPerTrade';
  }
  params.dropPercentages?.forEach((percent, index) => {
    if (percent <= 0 || percent >= 100) {
      errors[`dropPercentage${index}`] = 'percentageOutOfRange';
    }
  });
  return errors;
};