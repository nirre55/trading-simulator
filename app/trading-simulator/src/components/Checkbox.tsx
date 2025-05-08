
import React from 'react';

type CheckboxProps = {
  id: string;
  label: string;
};

const Checkbox: React.FC<CheckboxProps> = ({ id, label }) => (
  <div className="flex items-center space-x-2">
    <input type="checkbox" id={id} className="accent-sky-500 dark:accent-sky-400" />
    <label htmlFor={id} className="text-sm text-black dark:text-white">{label}</label>
  </div>
);

export default Checkbox;
