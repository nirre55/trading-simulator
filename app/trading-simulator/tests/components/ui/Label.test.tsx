import React from 'react';
import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import Label from '../../../src/components/ui/Label';

describe('Label Component', () => {
  test('renders a label with the given text', () => {
    render(<Label htmlFor="test-input">Test Label</Label>);
    
    const label = screen.getByText('Test Label');
    expect(label).toBeDefined();
    expect(label.tagName).toBe('LABEL');
  });
  
  test('applies the htmlFor attribute correctly', () => {
    const inputId = 'test-input';
    render(<Label htmlFor={inputId}>Test Label</Label>);
    
    const label = screen.getByText('Test Label');
    expect(label.getAttribute('for')).toBe(inputId);
  });
  
  test('applies the default styling classes', () => {
    render(<Label htmlFor="test-input">Test Label</Label>);
    
    const label = screen.getByText('Test Label');
    expect(label.className).toContain('block');
    expect(label.className).toContain('text-sm');
    expect(label.className).toContain('font-medium');
    expect(label.className).toContain('text-black');
    expect(label.className).toContain('dark:text-white');
  });
  
  test('renders children correctly', () => {
    render(
      <Label htmlFor="test-input">
        <span data-testid="child-element">Child Element</span>
      </Label>
    );
    
    const childElement = screen.getByTestId('child-element');
    expect(childElement).toBeDefined();
    expect(childElement.textContent).toBe('Child Element');
  });
}); 