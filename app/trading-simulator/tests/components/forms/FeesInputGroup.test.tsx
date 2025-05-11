import React from 'react';
import { describe, expect, test, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FeesInputGroup from '../../../src/components/forms/FeesInputGroup';
import { InputParameters } from '../../../src/utils';

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('FeesInputGroup Component', () => {
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
  };

  test('renders all fee inputs with correct default values', () => {
    const { container } = render(<FeesInputGroup {...defaultProps} />);
    
    // Vérifier les valeurs par ID
    expect(container.querySelector('#maker')).toHaveValue(0.05);
    expect(container.querySelector('#taker')).toHaveValue(0.1);
    expect(container.querySelector('#funding')).toHaveValue(0.01);
    expect(container.querySelector('#duration')).toHaveValue(1);
    
    // Vérifier que les labels sont bien affichés
    expect(screen.getByText('fields.maker')).toBeInTheDocument();
    expect(screen.getByText('fields.taker')).toBeInTheDocument();
    expect(screen.getByText('fields.funding')).toBeInTheDocument();
    expect(screen.getByText('fields.duration')).toBeInTheDocument();
  });

  test('calls handleInputChange when fee values are updated', () => {
    const handleInputChange = vi.fn();
    const { container } = render(<FeesInputGroup {...defaultProps} handleInputChange={handleInputChange} />);
    
    // Modifier les frais maker
    const makerInput = container.querySelector('#maker') as HTMLInputElement;
    fireEvent.change(makerInput, { target: { value: '0.1' } });
    expect(handleInputChange).toHaveBeenCalledWith('makerFee', 0.1);
    
    // Modifier les frais taker
    const takerInput = container.querySelector('#taker') as HTMLInputElement;
    fireEvent.change(takerInput, { target: { value: '0.2' } });
    expect(handleInputChange).toHaveBeenCalledWith('takerFee', 0.2);
    
    // Modifier les frais funding
    const fundingInput = container.querySelector('#funding') as HTMLInputElement;
    fireEvent.change(fundingInput, { target: { value: '0.02' } });
    expect(handleInputChange).toHaveBeenCalledWith('fundingFee', 0.02);
    
    // Modifier la durée
    const durationInput = container.querySelector('#duration') as HTMLInputElement;
    fireEvent.change(durationInput, { target: { value: '2' } });
    expect(handleInputChange).toHaveBeenCalledWith('duration', 2);
  });

  test('displays error messages when errors are provided', () => {
    const errors = {
      makerFee: 'feeNegative.maker',
      takerFee: 'feeNegative.taker',
      fundingFee: 'feeNegative.funding',
      duration: 'durationNegative',
    };
    
    const { container } = render(<FeesInputGroup {...defaultProps} errors={errors} />);
    
    // Les messages d'erreur sont affichés via i18n
    expect(screen.getByText('errors.feeNegative.maker')).toBeInTheDocument();
    expect(screen.getByText('errors.feeNegative.taker')).toBeInTheDocument();
    expect(screen.getByText('errors.feeNegative.funding')).toBeInTheDocument();
    expect(screen.getByText('errors.durationNegative')).toBeInTheDocument();
    
    // Vérifier les attributs aria-describedby
    expect(container.querySelector('#maker')).toHaveAttribute('aria-describedby', 'maker-error');
    expect(container.querySelector('#taker')).toHaveAttribute('aria-describedby', 'taker-error');
    expect(container.querySelector('#funding')).toHaveAttribute('aria-describedby', 'funding-error');
    expect(container.querySelector('#duration')).toHaveAttribute('aria-describedby', 'duration-error');
  });

  test('handles empty values correctly', () => {
    const handleInputChange = vi.fn();
    const { container } = render(<FeesInputGroup {...defaultProps} handleInputChange={handleInputChange} />);
    
    // Tester avec une valeur vide (sera convertie en 0)
    const makerInput = container.querySelector('#maker') as HTMLInputElement;
    fireEvent.change(makerInput, { target: { value: '' } });
    expect(handleInputChange).toHaveBeenCalledWith('makerFee', 0);
  });

  test('sets correct aria-describedby attributes for error states', () => {
    const errors = {
      makerFee: 'feeNegative.maker',
    };
    
    const { container } = render(<FeesInputGroup {...defaultProps} errors={errors} />);
    
    const makerInput = container.querySelector('#maker') as HTMLInputElement;
    const takerInput = container.querySelector('#taker') as HTMLInputElement;
    
    expect(makerInput).toHaveAttribute('aria-describedby', 'maker-error');
    expect(takerInput).not.toHaveAttribute('aria-describedby');
  });
}); 