import React from 'react';
import { describe, expect, test, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Checkbox from '../../../src/components/ui/Checkbox';

describe('Checkbox Component', () => {
  test('renders checkbox with label', () => {
    const label = 'Test Checkbox';
    render(<Checkbox id="test-checkbox" label={label} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeDefined();
    
    const labelElement = screen.getByText(label);
    expect(labelElement).toBeDefined();
    expect(labelElement.tagName).toBe('LABEL');
    expect(labelElement.getAttribute('for')).toBe('test-checkbox');
  });
  
  test('applies custom props correctly', () => {
    render(<Checkbox id="test-checkbox" label="Test" checked disabled />);
    
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
    expect(checkbox.disabled).toBe(true);
  });
  
  test('applies correct styling', () => {
    render(<Checkbox id="test-checkbox" label="Test" />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox.className).toContain('accent-sky-500');
    
    const wrapper = checkbox.parentElement;
    expect(wrapper?.className).toContain('flex');
    expect(wrapper?.className).toContain('items-center');
    
    const label = screen.getByText('Test');
    expect(label.className).toContain('text-sm');
    expect(label.className).toContain('text-black');
    expect(label.className).toContain('dark:text-white');
  });
  
  test('calls onChange when clicked', () => {
    const handleChange = vi.fn();
    render(<Checkbox id="test-checkbox" label="Test" onChange={handleChange} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(handleChange).toHaveBeenCalledTimes(1);
  });
  
  test('associates label with checkbox via id', () => {
    render(<Checkbox id="test-checkbox" label="Test Label" />);
    
    const label = screen.getByText('Test Label');
    fireEvent.click(label);
    
    // Check that clicking the label toggles the checkbox
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });
}); 