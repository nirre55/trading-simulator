import React from 'react';
import { describe, expect, test, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DropPercentageInputList from '../../../src/components/forms/DropPercentageInputList';

describe('DropPercentageInputList Component', () => {
  test('rend le composant avec une valeur par défaut', () => {
    const onChange = vi.fn();
    const initialValues = [10];
    
    render(
      <DropPercentageInputList 
        values={initialValues} 
        onChange={onChange} 
      />
    );
    
    // Vérifier que l'input est rendu avec la bonne valeur
    const inputs = screen.getAllByRole('spinbutton');
    expect(inputs).toHaveLength(1);
    expect(inputs[0]).toHaveValue(10);
    
    // Vérifier que le bouton d'ajout est présent
    expect(screen.getByText('+ Add Drop Percentage')).toBeInTheDocument();
  });

  test('ajoute un nouveau champ lorsque le bouton d\'ajout est cliqué', () => {
    const onChange = vi.fn();
    const initialValues = [10];
    
    render(
      <DropPercentageInputList 
        values={initialValues} 
        onChange={onChange} 
      />
    );
    
    // Cliquer sur le bouton d'ajout
    fireEvent.click(screen.getByText('+ Add Drop Percentage'));
    
    // Vérifier que onChange a été appelé avec deux valeurs
    expect(onChange).toHaveBeenCalledWith([10, 0]);
  });

  test('supprime un champ lorsque le bouton de suppression est cliqué', () => {
    const onChange = vi.fn();
    const initialValues = [10, 20];
    
    render(
      <DropPercentageInputList 
        values={initialValues} 
        onChange={onChange} 
      />
    );
    
    // Vérifier que deux entrées sont présentes
    const inputs = screen.getAllByRole('spinbutton');
    expect(inputs).toHaveLength(2);
    
    // Vérifier que les boutons de suppression sont présents
    const removeButtons = screen.getAllByText('⊖');
    expect(removeButtons).toHaveLength(2);
    
    // Cliquer sur le premier bouton de suppression
    fireEvent.click(removeButtons[0]);
    
    // Vérifier que onChange a été appelé avec une seule valeur (la deuxième)
    expect(onChange).toHaveBeenCalledWith([20]);
  });

  test('met à jour la valeur lorsque l\'utilisateur saisit dans un champ', () => {
    const onChange = vi.fn();
    const initialValues = [10];
    
    render(
      <DropPercentageInputList 
        values={initialValues} 
        onChange={onChange} 
      />
    );
    
    // Modifier la valeur du champ
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '25' } });
    
    // Vérifier que onChange a été appelé avec la nouvelle valeur
    expect(onChange).toHaveBeenCalledWith([25]);
  });

  test('gère les valeurs vides correctement', () => {
    const onChange = vi.fn();
    const initialValues = [10];
    
    render(
      <DropPercentageInputList 
        values={initialValues} 
        onChange={onChange} 
      />
    );
    
    // Modifier la valeur du champ pour qu'elle soit vide
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '' } });
    
    // Vérifier que onChange a été appelé avec 0
    expect(onChange).toHaveBeenCalledWith([0]);
  });

  test('affiche les messages d\'erreur lorsque fournis', () => {
    const onChange = vi.fn();
    const initialValues = [10, 20];
    const errors: string[] = ['Error message 1', ''];
    
    render(
      <DropPercentageInputList 
        values={initialValues} 
        onChange={onChange} 
        errors={errors}
      />
    );
    
    // Vérifier que le message d'erreur est affiché
    expect(screen.getByText('Error message 1')).toBeInTheDocument();
    
    // Note: Il n'est pas possible de vérifier directement la classe CSS 'border-red-400'
    // car le composant utilise Input qui est un composant externe
    const inputs = screen.getAllByRole('spinbutton');
    expect(inputs).toHaveLength(2);
    
    // Vérifier que le premier input a un aria-describedby qui le lie à son message d'erreur
    expect(inputs[0]).toHaveAttribute('aria-describedby', 'error-0');
  });

  test('utilise le texte de bouton personnalisé et le symbole lorsque fournis', () => {
    const onChange = vi.fn();
    const initialValues = [10];
    
    render(
      <DropPercentageInputList 
        values={initialValues} 
        onChange={onChange} 
        buttonText="Ajouter un pourcentage"
        symbol="$"
      />
    );
    
    // Vérifier que le texte du bouton est personnalisé
    expect(screen.getByText('Ajouter un pourcentage')).toBeInTheDocument();
    
    // Vérifier que le symbole personnalisé est affiché
    expect(screen.getByText('$')).toBeInTheDocument();
  });
}); 