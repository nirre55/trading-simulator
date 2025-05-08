import { validateCommonParams, validateVariant1, validateVariant2 } from '../src/utils/validations';
import type { InputParameters } from '../src/utils/types';
import { describe, expect, test } from 'vitest';

describe('validateCommonParams', () => {
  const baseParams: InputParameters = {
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
    entryPrices: [30, 40, 50],
    initialEntryPrice: 100,
    dropPercentages: [50],
  };

  test('should return no errors for valid params', () => {
    const errors = validateCommonParams(baseParams);
    expect(errors).toEqual({});
  });

  test('should validate balance > 0', () => {
    const params = { ...baseParams, balance: 0 };
    const errors = validateCommonParams(params);
    expect(errors.balance).toBe('insufficientPosition');
  });

  test('should validate leverage > 0 and <= 100', () => {
    let params = { ...baseParams, leverage: 0 };
    let errors = validateCommonParams(params);
    expect(errors.leverage).toBe('leverageOutOfRange');

    params = { ...baseParams, leverage: 101 };
    errors = validateCommonParams(params);
    expect(errors.leverage).toBe('leverageOutOfRange');
  });

  test('should validate stopLoss > 0', () => {
    const params = { ...baseParams, stopLoss: 0 };
    const errors = validateCommonParams(params);
    expect(errors.stopLoss).toBe('stopLossTooLow');
  });

  test('should validate gainTarget >= 0', () => {
    const params = { ...baseParams, gainTarget: -1 };
    const errors = validateCommonParams(params);
    expect(errors.gainTarget).toBe('gainTargetNegative');
  });

  test('should validate fees >= 0', () => {
    let params = { ...baseParams, makerFee: -0.1 };
    let errors = validateCommonParams(params);
    expect(errors.makerFee).toBe('feeNegative');

    params = { ...baseParams, takerFee: -0.1 };
    errors = validateCommonParams(params);
    expect(errors.takerFee).toBe('feeNegative');

    params = { ...baseParams, fundingFee: -0.1 };
    errors = validateCommonParams(params);
    expect(errors.fundingFee).toBe('feeNegative');
  });

  test('should validate duration >= 0', () => {
    const params = { ...baseParams, duration: -1 };
    const errors = validateCommonParams(params);
    expect(errors.duration).toBe('durationNegative');
  });

  test('should validate balance * leverage >= 100', () => {
    const params = { ...baseParams, balance: 9, leverage: 10 };
    const errors = validateCommonParams(params);
    expect(errors.balance).toBe('insufficientPosition');
  });
});

describe('validateVariant1', () => {
  const baseParams: InputParameters = {
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
    entryPrices: [30, 40, 50],
  };

  test('should return no errors for valid params', () => {
    const errors = validateVariant1(baseParams);
    expect(errors).toEqual({});
  });

  test('should validate numberOfTrades >= 1', () => {
    const params = { ...baseParams, numberOfTrades: 0 };
    const errors = validateVariant1(params);
    expect(errors.numberOfTrades).toBe('tradesTooLow');
  });

  test('should validate (balance * leverage) / numberOfTrades >= 100', () => {
    const params = { ...baseParams, balance: 10, leverage: 1, numberOfTrades: 1 };
    const errors = validateVariant1(params);
    expect(errors.numberOfTrades).toBe('insufficientPerTrade');
  });

  test('should validate each entryPrice > stopLoss', () => {
    const params = { ...baseParams, entryPrices: [30, 15, 50] };
    const errors = validateVariant1(params);
    expect(errors['entryPrice1']).toBe('entryPriceTooLow');
  });

  test('should validate each entryPrice > 0', () => {
    const params = { ...baseParams, entryPrices: [30, 0, 50] };
    const errors = validateVariant1(params);
    expect(errors['entryPrice1']).toBe('entryPriceNegative');
  });
});

describe('validateVariant2', () => {
  const baseParams: InputParameters = {
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
    initialEntryPrice: 100,
    dropPercentages: [50],
  };

  test('should return no errors for valid params', () => {
    const errors = validateVariant2(baseParams);
    expect(errors).toEqual({});
  });

  test('should validate initialEntryPrice > stopLoss', () => {
    const params = { ...baseParams, initialEntryPrice: 10 };
    const errors = validateVariant2(params);
    expect(errors.initialEntryPrice).toBe('initialPriceTooLow');
  });

  test('should validate initialEntryPrice > 0', () => {
    const params = { ...baseParams, initialEntryPrice: 0 };
    const errors = validateVariant2(params);
    expect(errors.initialEntryPrice).toBe('initialPriceNegative');
  });

  test('should validate dropPercentages.length <= 99', () => {
    const params = { ...baseParams, dropPercentages: Array(100).fill(50) };
    params.balance = 100000;
    const errors = validateVariant2(params);
    expect(errors.dropPercentages).toBe('tooManyPercentages');
  });

  test('should validate (balance * leverage) / (dropPercentages.length + 1) >= 100', () => {
    const params = { ...baseParams, balance: 10, leverage: 1, dropPercentages: [50, 50] };
    const errors = validateVariant2(params);
    expect(errors.dropPercentages).toBe('insufficientPerTrade');
  });

  test('should validate each dropPercentage > 0 and < 100', () => {
    let params = { ...baseParams, dropPercentages: [0, 50] };
    let errors = validateVariant2(params);
    expect(errors['dropPercentage0']).toBe('percentageOutOfRange');

    params = { ...baseParams, dropPercentages: [50, 100] };
    errors = validateVariant2(params);
    expect(errors['dropPercentage1']).toBe('percentageOutOfRange');
  });
});
