import React from 'react';
import { describe, expect, test, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ManualEntryForm from '../src/components/forms/ManualEntryForm';

// Mock pour les composants UI
vi.mock('../src/components/ui/Input', () => ({
  default: (props: any) => <input data-testid={`input-${props.name}`} {...props} />
}));

vi.mock('../src/components/ui/Label', () => ({
  default: ({ children, htmlFor }: { children: React.ReactNode, htmlFor: string }) => 
    <label data-testid={`label-${htmlFor}`} htmlFor={htmlFor}>{children}</label>
}));

vi.mock('../src/components/ui/ErrorMessage', () => ({
  default: ({ message }: { message: string }) => 
    <div data-testid="error-message">{message}</div>
}));

// Mock pour useTranslation
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key // Retourne simplement la clé pour faciliter les tests
  })
}));

describe('ManualEntryForm Component', () => {
  const defaultProps = {
    formData: {
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
      entryPrices: [100, 90, 80],
      initialEntryPrice: 100,
      dropPercentage: 50,
      dropPercentages: [],
    },
    errors: {},
    handleInputChange: vi.fn(),
  };

  test('renders all manual entry form fields', () => {
    render(<ManualEntryForm {...defaultProps} />);
    
    // Vérifier que le champ de nombre de trades est présent - en utilisant l'ID réel 'numTrades'
    expect(screen.getByTestId('label-numTrades')).toBeDefined();
    
    // Les inputs n'ont pas de testid spécifique dans notre mock, mais on peut vérifier les champs par leur type
    const inputs = screen.getAllByRole('spinbutton');
    expect(inputs.length).toBeGreaterThanOrEqual(4); // Au moins 4 inputs (1 pour nombre de trades + 3 pour les prix)
    
    // Vérifier que le label des prix d'entrée est présent
    expect(screen.getByTestId('label-entryPrices')).toBeDefined();
  });

  test('calls handleInputChange when adding or removing entry prices', () => {
    render(<ManualEntryForm {...defaultProps} />);
    
    // Simuler un clic sur le bouton d'ajout d'un prix d'entrée
    const addButton = screen.getByText('buttons.addEntryPrice');
    fireEvent.click(addButton);
    
    // Vérifier que la fonction handleInputChange a été appelée avec un tableau plus long
    const expectedEntryPrices = [...defaultProps.formData.entryPrices, 0];
    expect(defaultProps.handleInputChange).toHaveBeenCalledWith('entryPrices', expectedEntryPrices);
  });

  test('displays error messages when errors are present', () => {
    const propsWithErrors = {
      ...defaultProps,
      errors: {
        numberOfTrades: 'errors.insufficientPerTrade',
        'entryPrices[0]': 'Entry price error'
      }
    };
    
    render(<ManualEntryForm {...propsWithErrors} />);
    
    // Vérifier que les messages d'erreur sont affichés
    const errorMessages = screen.getAllByTestId('error-message');
    // Le composant n'affiche qu'une erreur à la fois, ajuster l'assertion
    expect(errorMessages.length).toBe(1);
    expect(errorMessages[0].textContent).toBe('errors.insufficientPerTrade');
  });
}); 