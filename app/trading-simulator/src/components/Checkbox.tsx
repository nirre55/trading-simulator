
import React from 'react';

type CheckboxProps = {
  id: string;
  label: string;
};

const Checkbox: React.FC<CheckboxProps> = ({ id, label }) => (
  <div className="flex items-center space-x-2">
    <input type="checkbox" id={id} className="accent-sky-500" />
    <label htmlFor={id} className="text-sm">{label}</label>
  </div>
);

export default Checkbox;
