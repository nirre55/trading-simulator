import React from 'react';
import { describe, expect, test, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Input from '../../../src/components/ui/Input';

describe('Input Component', () => {
  test('renders an input element with default styles', () => {
    render(<Input data-testid="input-test" />);
    const input = screen.getByTestId('input-test');
    
    expect(input).toBeDefined();
    expect(input.tagName).toBe('INPUT');
    expect(input.className).toContain('w-full');
    expect(input.className).toContain('bg-white');
    expect(input.className).toContain('dark:bg-slate-800');
  });

  test('passes props correctly to the input element', () => {
    const placeholderText = 'Enter a value';
    render(
      <Input 
        data-testid="input-test" 
        type="text" 
        placeholder={placeholderText}
        required
      />
    );
    
    const input = screen.getByTestId('input-test');
    expect(input.getAttribute('type')).toBe('text');
    expect(input.getAttribute('placeholder')).toBe(placeholderText);
    expect(input.hasAttribute('required')).toBe(true);
  });

  test('handles input changes correctly', () => {
    const handleChange = vi.fn();
    render(<Input data-testid="input-test" onChange={handleChange} />);
    
    const input = screen.getByTestId('input-test');
    fireEvent.change(input, { target: { value: 'test value' } });
    
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange.mock.calls[0][0].target.value).toBe('test value');
  });

  test('accepts a value prop', () => {
    const value = 'test value';
    render(<Input data-testid="input-test" value={value} onChange={() => {}} />);
    
    const input = screen.getByTestId('input-test') as HTMLInputElement;
    expect(input.value).toBe(value);
  });
}); 