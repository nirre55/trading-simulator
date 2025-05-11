import React from 'react';
import { describe, expect, test, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import RangeInput from '../../../src/components/ui/RangeInput';

describe('RangeInput Component', () => {
  test('renders a range input with default attributes', () => {
    render(<RangeInput id="test-range" />);
    
    const rangeInput = screen.getByRole('slider');
    expect(rangeInput).toBeDefined();
    expect(rangeInput.getAttribute('type')).toBe('range');
    expect(rangeInput.getAttribute('id')).toBe('test-range');
  });
  
  test('applies custom props correctly', () => {
    render(
      <RangeInput 
        id="test-range" 
        min={0} 
        max={100} 
        step={5} 
        value={50} 
        disabled 
        data-testid="custom-range"
      />
    );
    
    const rangeInput = screen.getByTestId('custom-range') as HTMLInputElement;
    expect(rangeInput.getAttribute('min')).toBe('0');
    expect(rangeInput.getAttribute('max')).toBe('100');
    expect(rangeInput.getAttribute('step')).toBe('5');
    expect(rangeInput.value).toBe('50');
    expect(rangeInput.disabled).toBe(true);
  });
  
  test('applies correct styling', () => {
    render(<RangeInput id="test-range" />);
    
    const rangeInput = screen.getByRole('slider');
    expect(rangeInput.className).toContain('w-full');
    expect(rangeInput.className).toContain('appearance-none');
    expect(rangeInput.className).toContain('bg-slate-200');
    expect(rangeInput.className).toContain('dark:bg-slate-600');
    expect(rangeInput.className).toContain('rounded');
  });
  
  test('calls onChange when value changes', () => {
    const handleChange = vi.fn();
    render(<RangeInput id="test-range" onChange={handleChange} />);
    
    const rangeInput = screen.getByRole('slider');
    fireEvent.change(rangeInput, { target: { value: '75' } });
    
    expect(handleChange).toHaveBeenCalledTimes(1);
  });
  
  test('sets default value when provided', () => {
    const defaultValue = '25';
    render(<RangeInput id="test-range" defaultValue={defaultValue} />);
    
    const rangeInput = screen.getByRole('slider') as HTMLInputElement;
    expect(rangeInput.value).toBe(defaultValue);
  });

  test('works with full leverage range (1-125) as used in CommonParameters', () => {
    const handleChange = vi.fn();
    render(
      <RangeInput 
        id="leverage" 
        min={1}
        max={125}
        step={1}
        value={10}
        onChange={handleChange}
      />
    );
    
    const rangeInput = screen.getByRole('slider') as HTMLInputElement;
    expect(rangeInput.getAttribute('min')).toBe('1');
    expect(rangeInput.getAttribute('max')).toBe('125');
    expect(rangeInput.value).toBe('10');
    
    // Tester la valeur minimum
    fireEvent.change(rangeInput, { target: { value: '1' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
    
    // Tester la valeur maximum
    fireEvent.change(rangeInput, { target: { value: '125' } });
    expect(handleChange).toHaveBeenCalledTimes(2);
    
    // Tester une valeur intermédiaire
    fireEvent.change(rangeInput, { target: { value: '75' } });
    expect(handleChange).toHaveBeenCalledTimes(3);
  });
}); 