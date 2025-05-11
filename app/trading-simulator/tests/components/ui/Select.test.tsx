import React from 'react';
import { describe, expect, test, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Select from '../../../src/components/ui/Select';

describe('Select Component', () => {
  const options = ['Option 1', 'Option 2', 'Option 3'];
  
  test('renders with provided options', () => {
    render(<Select id="test-select" options={options} />);
    
    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toBeDefined();
    
    const optionElements = screen.getAllByRole('option');
    expect(optionElements.length).toBe(options.length);
    
    options.forEach((option, index) => {
      expect(optionElements[index].textContent).toBe(option);
      expect(optionElements[index].getAttribute('value')).toBe(option);
    });
  });
  
  test('selects the provided value', () => {
    const selectedValue = 'Option 2';
    render(<Select id="test-select" options={options} value={selectedValue} />);
    
    const selectElement = screen.getByRole('combobox') as HTMLSelectElement;
    expect(selectElement.value).toBe(selectedValue);
  });
  
  test('applies custom props correctly', () => {
    render(<Select id="test-select" options={options} data-testid="custom-select" disabled />);
    
    const selectElement = screen.getByTestId('custom-select');
    expect(selectElement.hasAttribute('disabled')).toBe(true);
  });
  
  test('calls onChange when selection changes', () => {
    const handleChange = vi.fn();
    render(<Select id="test-select" options={options} onChange={handleChange} />);
    
    const selectElement = screen.getByRole('combobox');
    fireEvent.change(selectElement, { target: { value: 'Option 3' } });
    
    expect(handleChange).toHaveBeenCalledTimes(1);
  });
  
  test('applies correct styling', () => {
    render(<Select id="test-select" options={options} />);
    
    const selectElement = screen.getByRole('combobox');
    expect(selectElement.className).toContain('w-full');
    expect(selectElement.className).toContain('bg-white');
    expect(selectElement.className).toContain('dark:bg-slate-800');
    expect(selectElement.className).toContain('border-slate-600');
  });
}); 