
import React from 'react';

type SelectProps = {
  id: string;
  options: string[];
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
} & React.SelectHTMLAttributes<HTMLSelectElement>;

const Select: React.FC<SelectProps> = ({ id, options, value, onChange, ...props}) => (
  <select
    id={id}
    value={value}
    onChange={onChange}
    className="w-full bg-white text-black dark:bg-slate-800 dark:text-white border border-slate-600 px-3 py-2 rounded"
    {...props}
  >
    {options.map((option) => (
      <option key={option} value={option}>
        {option}
      </option>
    ))}
  </select>
);

export default Select;
