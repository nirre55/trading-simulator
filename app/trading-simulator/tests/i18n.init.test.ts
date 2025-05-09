// tests/i18n.init.test.ts
import { describe, expect, test, vi, beforeEach } from 'vitest';

// Mock pour i18next
const mockInit = vi.fn().mockResolvedValue({});
const mockUse = vi.fn().mockReturnThis();

vi.mock('i18next', () => ({
  default: {
    use: mockUse,
    init: mockInit
  }
}));

// Mock pour react-i18next
vi.mock('react-i18next', () => ({
  initReactI18next: { type: 'i18nextModule' }
}));

// Mock pour i18next-browser-languagedetector
vi.mock('i18next-browser-languagedetector', () => ({
  default: function LanguageDetector() {
    return { type: 'languageDetector' };
  }
}));

// Mock pour les fichiers de traduction
vi.mock('../src/i18n/en.json', () => ({
  default: { test: 'test' }
}));

vi.mock('../src/i18n/fr.json', () => ({
  default: { test: 'test' }
}));

describe('i18n initialization', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  test('i18n is properly initialized', async () => {
    // Importer le module après avoir configuré les mocks
    await import('../src/i18n');
    
    // Vérifier que use est appelé avec languageDetector et initReactI18next
    expect(mockUse).toHaveBeenCalledTimes(2);
    
    // Vérifier que init est appelé avec les bonnes options
    expect(mockInit).toHaveBeenCalledTimes(1);
    const initOptions = mockInit.mock.calls[0][0];
    
    // Vérifier les options essentielles
    expect(initOptions).toHaveProperty('resources');
    expect(initOptions).toHaveProperty('fallbackLng', 'fr');
    expect(initOptions).toHaveProperty('detection');
    expect(initOptions.detection).toHaveProperty('order');
    expect(initOptions.detection.order).toContain('localStorage');
    expect(initOptions.detection).toHaveProperty('caches');
    expect(initOptions.detection.caches).toContain('localStorage');
  });
}); 