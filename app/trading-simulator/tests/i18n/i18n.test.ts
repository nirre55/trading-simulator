import { describe, expect, test } from 'vitest';
import enTranslation from '../src/i18n/en.json';
import frTranslation from '../src/i18n/fr.json';

// Fonction pour obtenir toutes les clés d'un objet de traduction (même imbriquées)
function getAllKeys(obj: any, parentKey = ''): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const currentKey = parentKey ? `${parentKey}.${key}` : key;
    
    if (typeof value === 'object' && value !== null) {
      return getAllKeys(value, currentKey);
    }
    
    return currentKey;
  });
}

describe('i18n translations', () => {
  test('French and English translations should have the same keys', () => {
    const enKeys = getAllKeys(enTranslation).sort();
    const frKeys = getAllKeys(frTranslation).sort();
    
    expect(enKeys).toEqual(frKeys);
  });
  
  test('No empty translation values in English file', () => {
    const hasEmptyValues = checkEmptyValues(enTranslation);
    expect(hasEmptyValues).toBe(false);
  });
  
  test('No empty translation values in French file', () => {
    const hasEmptyValues = checkEmptyValues(frTranslation);
    expect(hasEmptyValues).toBe(false);
  });
});

// Fonction pour vérifier qu'aucune traduction n'est vide
function checkEmptyValues(obj: any, path = ''): boolean {
  return Object.entries(obj).some(([key, value]) => {
    const currentPath = path ? `${path}.${key}` : key;
    
    if (typeof value === 'object' && value !== null) {
      return checkEmptyValues(value, currentPath);
    }
    
    if (typeof value === 'string' && value.trim() === '') {
      console.error(`Empty translation at: ${currentPath}`);
      return true;
    }
    
    return false;
  });
} 