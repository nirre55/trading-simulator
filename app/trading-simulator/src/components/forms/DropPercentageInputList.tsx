import React, { useState } from 'react';
import Input from '../ui/Input';
import ErrorMessage from '../ui/ErrorMessage';

interface DropPercentageInputListProps {
  buttonText?: string;
  symbol?: string;
  values: number[];
  onChange: (values: number[]) => void;
  errors?: string[];
}

const DropPercentageInputList: React.FC<DropPercentageInputListProps> = ({ 
  buttonText = '+ Add Drop Percentage',
  symbol = '%',
  values,
  onChange,
  errors = [],
}) => {
  const handleChange = (index: number, value: string) => {
    const updated = [...values];
    updated[index] = value === '' ? 0 : Number(value);
    onChange(updated);
  };

  const addField = () => onChange([...values, 0]);
  const removeField = (index: number) => {
    const updated = [...values];
    updated.splice(index, 1);
    onChange(updated);
  };

  return (
    <div className="space-y-2">
      {values.map((val, idx) => (
        <div key={idx} className="flex items-center space-x-2">
          <div className="flex-1">
            <Input
              type="number"
              value={val === 0 ? '' : val}
              onChange={(e) => handleChange(idx, e.target.value)}
              aria-describedby={errors[idx] ? `error-${idx}` : undefined}
              className={errors[idx] ? 'border-red-400' : ''}
            />
            {errors[idx] && <ErrorMessage id={`error-${idx}`} message={errors[idx]} />}
          </div>
          <span className="text-black dark:text-white">{symbol}</span>
          {values.length > 1 && (
            <button onClick={() => removeField(idx)} className="text-red-400">
              ⊖
            </button>
          )}
        </div>
      ))}
      <button
        onClick={addField}
        className="mt-2 text-sm text-gray-600 dark:text-slate-300 hover:text-black dark:hover:text-white"
      >
        {buttonText}
      </button>
    </div>
  );
};

export default DropPercentageInputList;