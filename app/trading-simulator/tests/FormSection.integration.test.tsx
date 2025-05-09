import React from 'react';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import FormSection from '../src/components/forms/FormSection';

// Mock de traductions pour simuler le changement de langue
const mockTranslations: Record<string, Record<string, string>> = {
  fr: {
    'sections.commonParameters': 'Paramètres communs',
    'fields.balance': 'Solde total',
    'fields.leverage': 'Effet de levier',
    'common.simulate': 'Simuler'
  },
  en: {
    'sections.commonParameters': 'Common Parameters',
    'fields.balance': 'Total Balance',
    'fields.leverage': 'Leverage',
    'common.simulate': 'Simulate'
  }
};

// Variable pour stocker la langue actuelle pour les tests
let currentLanguage = 'fr';

// Mock pour i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      // Retourne la traduction selon la langue actuelle
      return mockTranslations[currentLanguage][key] || key;
    },
    i18n: {
      language: currentLanguage,
      changeLanguage: (lang: string) => {
        currentLanguage = lang;
      }
    }
  })
}));

// Mock pour les composants UI
vi.mock('../src/components/ui/ErrorMessage', () => ({
  default: ({ message }: { message: string }) => <div className="error-message">{message}</div>
}));

vi.mock('../src/components/ui/Button', () => ({
  default: ({ children, onClick }: { children: React.ReactNode, onClick?: () => void }) => 
    <button onClick={onClick}>{children}</button>
}));

vi.mock('../src/components/ui/Input', () => ({
  default: (props: any) => <input {...props} />
}));

vi.mock('../src/components/ui/Label', () => ({
  default: ({ children, htmlFor }: { children: React.ReactNode, htmlFor: string }) => 
    <label htmlFor={htmlFor}>{children}</label>
}));

vi.mock('../src/components/ui/Select', () => ({
  default: (props: any) => <select {...props} />
}));

vi.mock('../src/components/ui/Checkbox', () => ({
  default: (props: any) => <input type="checkbox" {...props} />
}));

vi.mock('../src/components/layout/Tabs', () => ({
  default: () => <div data-testid="tabs">Tabs</div>
}));

vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
    info: vi.fn()
  }
}));

vi.mock('../src/utils/validations', () => ({
  validateCommonParams: vi.fn().mockReturnValue({}),
  validateVariant1: vi.fn().mockReturnValue({}),
  validateVariant2: vi.fn().mockReturnValue({})
}));

describe('FormSection Component with i18n integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    currentLanguage = 'fr'; // Réinitialiser la langue à français
  });

  test('renders with French translations by default', () => {
    render(<FormSection />);
    
    // Vérifier que les textes en français sont présents
    expect(screen.getByText('Paramètres communs')).toBeDefined();
    expect(screen.getByText('Solde total')).toBeDefined();
    expect(screen.getByText('Simuler')).toBeDefined();
  });

  test('updates content when language changes to English', () => {
    const { rerender } = render(<FormSection />);
    
    // Changer la langue en anglais
    currentLanguage = 'en';
    
    // Forcer le re-rendu pour appliquer la nouvelle langue
    rerender(<FormSection />);
    
    // Vérifier que les textes en anglais sont présents
    expect(screen.getByText('Common Parameters')).toBeDefined();
    expect(screen.getByText('Total Balance')).toBeDefined();
    expect(screen.getByText('Simulate')).toBeDefined();
  });
}); 