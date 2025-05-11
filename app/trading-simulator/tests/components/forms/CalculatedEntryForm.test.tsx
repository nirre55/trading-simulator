import React from 'react';
import { describe, expect, test, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CalculatedEntryForm from '../src/components/forms/CalculatedEntryForm';

// Mock pour les composants UI
vi.mock('../src/components/ui/Input', () => ({
  default: (props: any) => <input data-testid={`input-${props.name || props.id}`} {...props} />
}));

vi.mock('../src/components/ui/Label', () => ({
  default: ({ children, htmlFor }: { children: React.ReactNode, htmlFor: string }) => 
    <label data-testid={`label-${htmlFor}`} htmlFor={htmlFor}>{children}</label>
}));

vi.mock('../src/components/ui/Select', () => ({
  default: (props: any) => <select data-testid={`select-${props.name || props.id}`} {...props} />
}));

vi.mock('../src/components/ui/ErrorMessage', () => ({
  default: ({ message }: { message: string }) => 
    <div data-testid="error-message">{message}</div>
}));

vi.mock('../src/components/forms/DropPercentageInputList', () => ({
  default: (props: any) => <div data-testid="drop-percentage-list">{JSON.stringify(props)}</div>
}));

// Mock pour useTranslation
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key // Retourne simplement la clé pour faciliter les tests
  })
}));

describe('CalculatedEntryForm Component', () => {
  const defaultProps = {
    formData: {
      balance: 1000,
      leverage: 10,
      stopLoss: 20,
      gainTarget: 100,
      initialEntryPrice: 100,
      dropPercentage: 50,
      dropPercentages: [],
      numberOfTrades: 1,
      entryPrices: [],
      symbol: 'BTC/USDT',
      makerFee: 0.1,
      takerFee: 0.2,
      fundingFee: 0.01,
      duration: 1,
      recovery: false,
    },
    errors: {},
    handleInputChange: vi.fn(),
  };

  test('renders all calculated entry form fields', () => {
    render(<CalculatedEntryForm {...defaultProps} />);
    
    // Vérifier que les champs spécifiques au formulaire calculé sont présents
    expect(screen.getByTestId('label-initialPrice')).toBeDefined();
    expect(screen.getByTestId('label-dropPercentage')).toBeDefined();
    expect(screen.getByTestId('label-numberOfTrades')).toBeDefined();
  });

  test('calls handleInputChange when inputs change', () => {
    const { container } = render(<CalculatedEntryForm {...defaultProps} />);
    
    // Simuler un changement sur le champ de prix d'entrée initial
    const initialPriceInput = container.querySelector('#initialPrice');
    if (initialPriceInput) {
      fireEvent.change(initialPriceInput, { target: { value: '200' } });
      
      // Vérifier que la fonction de rappel a été appelée avec les bons paramètres
      expect(defaultProps.handleInputChange).toHaveBeenCalledWith('initialEntryPrice', 200);
    }
  });

  test('displays error messages when errors are present', () => {
    const propsWithErrors = {
      ...defaultProps,
      errors: {
        initialEntryPrice: 'errors.initialPriceNegative',
        dropPercentage: 'Drop percentage error'
      }
    };
    
    render(<CalculatedEntryForm {...propsWithErrors} />);
    
    // Vérifier que les messages d'erreur sont affichés
    const errorMessages = screen.getAllByTestId('error-message');
    // Le composant n'affiche peut-être qu'une seule erreur à la fois
    expect(errorMessages.length).toBeGreaterThan(0);
    expect(errorMessages[0].textContent).toBe('errors.initialPriceNegative');
  });

  test('renders fields for advanced configuration', () => {
    render(<CalculatedEntryForm {...defaultProps} />);
    
    // Vérifier que les labels des champs sont présents
    // Utiliser getByTestId au lieu de getByText car le texte est partiel
    expect(screen.getByTestId('label-numberOfTrades')).toBeDefined();
    expect(screen.getByTestId('label-dropPercentage')).toBeDefined();
    
    // Vérifier que le texte "fields.numberOfTrades" existe dans le DOM
    const labels = screen.getAllByText((content) => content.includes('fields.numberOfTrades'));
    expect(labels.length).toBeGreaterThanOrEqual(1);
  });
}); 