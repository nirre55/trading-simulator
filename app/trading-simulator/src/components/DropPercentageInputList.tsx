import React, { useState } from 'react';
import Input from './Input';

interface DropPercentageInputListProps {
  buttonText?: string;
}

const DropPercentageInputList: React.FC<DropPercentageInputListProps> = ({ buttonText = '+ Add Drop Percentage' }) => {
  const [values, setValues] = useState<string[]>(['']);

  const handleChange = (index: number, value: string) => {
    const updated = [...values];
    updated[index] = value;
    setValues(updated);
  };

  const addField = () => setValues([...values, '']);
  const removeField = (index: number) => {
    const updated = [...values];
    updated.splice(index, 1);
    setValues(updated);
  };

  return (
    <div className="space-y-2">
      {values.map((val, idx) => (
        <div key={idx} className="flex items-center space-x-2">
          <Input
            type="text"
            value={val}
            onChange={(e) => handleChange(idx, e.target.value)}
          />
          <span className="text-white">%</span>
          {values.length > 1 && (
            <button onClick={() => removeField(idx)} className="text-red-400">⊖</button>
          )}
        </div>
      ))}
      <button onClick={addField} className="mt-2 text-sm text-slate-300 hover:text-white">{buttonText}</button>
    </div>
  );
};

export default DropPercentageInputList;
