import React from 'react';
import { describe, expect, test, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CommonParameters from '../../../src/components/forms/CommonParameters';
import { InputParameters } from '../../../src/utils';

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('CommonParameters Component', () => {
  const defaultFormData: InputParameters = {
    balance: 10000,
    leverage: 10,
    stopLoss: 100,
    gainTarget: 5,
    makerFee: 0.05,
    takerFee: 0.1,
    fundingFee: 0.01,
    duration: 1,
    recovery: false,
    symbol: 'BTCUSDT',
  };
  
  const defaultProps = {
    formData: defaultFormData,
    errors: {},
    handleInputChange: vi.fn(),
    handleLeverageChange: vi.fn(),
  };

  test('renders with default values', () => {
    render(<CommonParameters {...defaultProps} />);
    
    // Vérifier que les champs sont bien affichés avec les valeurs par défaut
    expect(screen.getByLabelText('fields.balance')).toBeDefined();
    expect(screen.getByLabelText(/fields.leverage/)).toBeDefined();
    expect(screen.getByLabelText('fields.stopLoss')).toBeDefined();
    expect(screen.getByText('common.lossRecovery')).toBeDefined();
  });

  test('calls handleInputChange when fields are updated', () => {
    const handleInputChange = vi.fn();
    render(<CommonParameters {...defaultProps} handleInputChange={handleInputChange} />);
    
    // Modifier le solde
    const balanceInput = screen.getByLabelText('fields.balance');
    fireEvent.change(balanceInput, { target: { value: '20000' } });
    expect(handleInputChange).toHaveBeenCalledWith('balance', 20000);
    
    // Modifier le stop loss
    const stopLossInput = screen.getByLabelText('fields.stopLoss');
    fireEvent.change(stopLossInput, { target: { value: '200' } });
    expect(handleInputChange).toHaveBeenCalledWith('stopLoss', 200);
    
    // Modifier le gain target
    const targetInput = screen.getByLabelText('fields.gainTarget');
    fireEvent.change(targetInput, { target: { value: '10' } });
    expect(handleInputChange).toHaveBeenCalledWith('gainTarget', 10);
    
    // Modifier le recovery checkbox
    const recoveryCheckbox = screen.getByLabelText('common.lossRecovery');
    fireEvent.click(recoveryCheckbox);
    expect(handleInputChange).toHaveBeenCalledWith('recovery', true);
    
    // Modifier le symbol
    const symbolInput = screen.getByLabelText('fields.symbol');
    fireEvent.change(symbolInput, { target: { value: 'ETHUSDT' } });
    expect(handleInputChange).toHaveBeenCalledWith('symbol', 'ETHUSDT');
  });

  test('calls handleInputChange when leverage is changed with RangeInput', () => {
    const handleInputChange = vi.fn();
    render(<CommonParameters {...defaultProps} handleInputChange={handleInputChange} />);
    
    // Modifier le levier avec le RangeInput
    const leverageSlider = screen.getByLabelText(/fields.leverage/);
    fireEvent.change(leverageSlider, { target: { value: '50' } });
    expect(handleInputChange).toHaveBeenCalledWith('leverage', 50);
  });

  test('displays current leverage value', () => {
    const customFormData = {
      ...defaultFormData,
      leverage: 25
    };
    
    render(<CommonParameters {...defaultProps} formData={customFormData} />);
    
    // Vérifier que la valeur du levier est affichée correctement
    expect(screen.getByText('25x')).toBeDefined();
  });

  test('displays error messages when errors are provided', () => {
    const errors = {
      balance: 'balanceTooLow',
      leverage: 'leverageOutOfRange',
      stopLoss: 'stopLossTooLow',
      gainTarget: 'gainTargetNegative'
    };
    
    render(<CommonParameters {...defaultProps} errors={errors} />);
    
    // Les messages d'erreur sont affichés via i18n
    const alerts = screen.getAllByRole('alert');
    expect(alerts.length).toBeGreaterThanOrEqual(4);
  });
}); 