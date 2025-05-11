import React from 'react';
import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeToggle from '../../../src/components/features/ThemeToggle';

// Mock pour localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
  };
})();

// Mock pour document.documentElement.classList
const mockClassList = {
  add: vi.fn(),
  remove: vi.fn(),
  contains: vi.fn(),
  toggle: vi.fn() // Ajouter toggle car il est utilisé dans le composant
};

describe('ThemeToggle Component', () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.classList.remove('dark');
    vi.spyOn(console, 'log').mockImplementation(() => {});
    
    // Setup mocks
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    
    // Mock documentElement.classList methods
    vi.spyOn(document.documentElement.classList, 'add').mockImplementation(mockClassList.add);
    vi.spyOn(document.documentElement.classList, 'remove').mockImplementation(mockClassList.remove);
    vi.spyOn(document.documentElement.classList, 'contains').mockImplementation(mockClassList.contains);
    vi.spyOn(document.documentElement.classList, 'toggle').mockImplementation(mockClassList.toggle);
    
    // Réinitialiser les mocks
    mockClassList.add.mockClear();
    mockClassList.remove.mockClear();
    mockClassList.contains.mockReset();
    mockClassList.toggle.mockReset();
  });
  
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('initializes with dark theme if dark theme is stored', () => {
    localStorageMock.setItem('theme', 'dark');
    mockClassList.contains.mockReturnValue(true);
    
    render(<ThemeToggle />);
    
    console.log('Theme initialized: dark');
    
    expect(mockClassList.toggle).toHaveBeenCalledWith('dark', true);
    expect(screen.getByRole('button')).toBeDefined();
  });

  test('initializes with light theme if light theme is stored', () => {
    localStorageMock.setItem('theme', 'light');
    mockClassList.contains.mockReturnValue(false);
    
    render(<ThemeToggle />);
    
    console.log('Theme initialized: light');
    
    expect(mockClassList.toggle).toHaveBeenCalledWith('dark', false);
    expect(screen.getByRole('button')).toBeDefined();
  });

  test('toggles theme from light to dark when clicked', () => {
    localStorageMock.setItem('theme', 'light');
    mockClassList.contains.mockReturnValue(false);
    
    render(<ThemeToggle />);
    
    console.log('Theme initialized: light');
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(mockClassList.toggle).toHaveBeenCalledWith('dark', true);
    expect(localStorageMock.getItem('theme')).toBe('dark');
  });

  test('toggles theme from dark to light when clicked', () => {
    localStorageMock.setItem('theme', 'dark');
    mockClassList.contains.mockReturnValue(true);
    
    render(<ThemeToggle />);
    
    console.log('Theme initialized: dark');
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(mockClassList.toggle).toHaveBeenCalledWith('dark', false);
    expect(localStorageMock.getItem('theme')).toBe('light');
  });
}); 