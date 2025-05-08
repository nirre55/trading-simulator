
import React from 'react';

type CheckboxProps = {
  id: string;
  label: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Checkbox: React.FC<CheckboxProps> = ({ id, label, onChange, ...props }) => (
<div className="flex items-center space-x-2">
    <input
      type="checkbox"
      id={id}
      onChange={onChange}
      className="accent-sky-500 dark:accent-sky-400"
      {...props}
    />
    <label htmlFor={id} className="text-sm text-black dark:text-white">
      {label}
    </label>
  </div>
);

export default Checkbox;
