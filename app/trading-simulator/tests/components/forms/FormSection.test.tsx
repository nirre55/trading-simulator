import React from 'react';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FormSection from '../../../src/components/forms/FormSection';
import { calculateResults } from '../../../src/utils';

// Mock des dépendances
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  }
}));

// Mock pour le composant TradeDetailsTable à l'intérieur de SimulationResults
vi.mock('../../../src/components/features/TradeDetailsTable', () => ({
  default: () => <div data-testid="trade-details-table">Trade Details Table</div>
}));

vi.mock('../../../src/utils', () => ({
  validateCommonParams: vi.fn(() => ({})),
  validateVariant1: vi.fn(() => ({})),
  validateVariant2: vi.fn(() => ({})),
  calculateResults: vi.fn(() => ({
    positionSize: 10000,
    numberOfTrades: 3,
    amountPerTrade: 3333.33,
    realAmountPerTrade: 3333.33,
    averageEntryPrice: 95,
    riskTotal: 500,
    profitTarget: 2500,
    totalFees: 100,
    riskRewardRatio: 5,
    entryPrices: [100, 95, 90],
    variant: 'manual'
  })),
}));

describe('FormSection Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('rend le composant avec les onglets et formulaire par défaut', () => {
    render(<FormSection />);
    
    // Vérifier que les onglets sont présents
    const manualTab = screen.getByText('tabs.manual');
    const calculatedTab = screen.getByText('tabs.calculated');
    expect(manualTab).toBeInTheDocument();
    expect(calculatedTab).toBeInTheDocument();
    
    // Vérifier que le formulaire de paramètres communs est présent
    expect(screen.getByLabelText('fields.balance')).toBeInTheDocument();
    expect(screen.getByLabelText(/fields.leverage/)).toBeInTheDocument();
    
    // Vérifier que le formulaire manuel est affiché par défaut
    // Comme le libellé exact peut varier, nous recherchons un élément qui fait partie du formulaire manuel
    expect(screen.getByText('sections.manualEntryPoints', { exact: false })).toBeInTheDocument();
    
    // Vérifier que le bouton de simulation est présent
    expect(screen.getByText('common.simulate')).toBeInTheDocument();
  });

  test('change d\'onglet correctement', () => {
    const { container } = render(<FormSection />);
    
    // Cliquer sur l'onglet "calculated"
    fireEvent.click(screen.getByText('tabs.calculated'));
    
    // Vérifier que le formulaire calculé est affiché
    expect(screen.getByText('sections.calculatedEntryPoints', { exact: false })).toBeInTheDocument();
    expect(screen.getByLabelText('fields.initialPrice')).toBeInTheDocument();
    
    // Vérifier que le champ dropPercentage est présent
    expect(container.querySelector('#dropPercentage')).toBeInTheDocument();
  });

  test('permet d\'ajuster le levier avec le curseur RangeInput', () => {
    render(<FormSection />);
    
    // Vérifier que le curseur est présent et a les bonnes valeurs
    const leverageSlider = screen.getByLabelText(/fields.leverage/) as HTMLInputElement;
    expect(leverageSlider).toBeInTheDocument();
    expect(leverageSlider.getAttribute('min')).toBe('1');
    expect(leverageSlider.getAttribute('max')).toBe('125');
    expect(leverageSlider.getAttribute('step')).toBe('1');
    
    // Vérifier la valeur par défaut (10x comme défini dans le state initial)
    expect(screen.getByText('10x')).toBeInTheDocument();
    
    // Ajuster le levier
    fireEvent.change(leverageSlider, { target: { value: '50' } });
    
    // Vérifier que la valeur affichée est mise à jour
    expect(screen.getByText('50x')).toBeInTheDocument();
  });

  test('simule correctement en mode manuel', async () => {
    render(<FormSection />);
    
    // Remplir le formulaire
    fireEvent.change(screen.getByLabelText('fields.balance'), { target: { value: '10000' } });
    fireEvent.change(screen.getByLabelText('fields.stopLoss'), { target: { value: '20' } });
    fireEvent.change(screen.getByLabelText('fields.gainTarget'), { target: { value: '100' } });
    
    // Cliquer sur le bouton de simulation
    fireEvent.click(screen.getByText('common.simulate'));
    
    // Vérifier que la fonction calculateResults a été appelée
    expect(calculateResults).toHaveBeenCalled();
    
    // Attendre que le tableau de détails des trades s'affiche au lieu des résultats
    await waitFor(() => {
      expect(screen.getByTestId('trade-details-table')).toBeInTheDocument();
    });
  });

  test('simule correctement en mode calculé', async () => {
    const { container } = render(<FormSection />);
    
    // Changer d'onglet
    fireEvent.click(screen.getByText('tabs.calculated'));
    
    // Remplir le formulaire
    fireEvent.change(screen.getByLabelText('fields.balance'), { target: { value: '10000' } });
    fireEvent.change(screen.getByLabelText('fields.stopLoss'), { target: { value: '20' } });
    fireEvent.change(screen.getByLabelText('fields.initialPrice'), { target: { value: '100' } });
    
    // Le champ dropPercentage n'est pas directement accessible par label
    const dropPercentageInput = container.querySelector('#dropPercentage') as HTMLInputElement;
    fireEvent.change(dropPercentageInput, { target: { value: '10' } });
    
    // Cliquer sur le bouton de simulation
    fireEvent.click(screen.getByText('common.simulate'));
    
    // Vérifier que la fonction calculateResults a été appelée
    expect(calculateResults).toHaveBeenCalled();
    
    // Attendre que le tableau de détails des trades s'affiche au lieu des résultats
    await waitFor(() => {
      expect(screen.getByTestId('trade-details-table')).toBeInTheDocument();
    });
  });

  test('met à jour correctement les valeurs du formulaire', () => {
    render(<FormSection />);
    
    // Changer la valeur du solde
    const balanceInput = screen.getByLabelText('fields.balance');
    fireEvent.change(balanceInput, { target: { value: '20000' } });
    expect(balanceInput).toHaveValue(20000);
    
    // Activer la récupération des pertes
    const recoveryCheckbox = screen.getByLabelText('common.lossRecovery');
    fireEvent.click(recoveryCheckbox);
    expect(recoveryCheckbox).toBeChecked();
  });
}); 