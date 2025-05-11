import React from 'react';
import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorMessage from '../../../src/components/ui/ErrorMessage';

describe('ErrorMessage Component', () => {
  test('renders with the provided error message', () => {
    const errorMessage = 'This field is required';
    render(<ErrorMessage message={errorMessage} />);
    
    const element = screen.getByText(errorMessage);
    expect(element).toBeDefined();
    expect(element.textContent).toBe(errorMessage);
  });
  
  test('applies correct styling', () => {
    render(<ErrorMessage message="Error" />);
    
    const element = screen.getByText('Error');
    expect(element.className).toContain('text-red-400');
    expect(element.className).toContain('text-sm');
    expect(element.className).toContain('mt-1');
  });
  
  test('has role="alert" for accessibility', () => {
    render(<ErrorMessage message="Error" />);
    
    const element = screen.getByRole('alert');
    expect(element).toBeDefined();
    expect(element.textContent).toBe('Error');
  });
  
  test('applies custom id when provided', () => {
    const customId = 'custom-error-id';
    render(<ErrorMessage message="Error" id={customId} />);
    
    const element = screen.getByText('Error');
    expect(element.id).toBe(customId);
  });
}); 