
import React from 'react';

type SelectProps = {
  id: string;
  options: string[];
};

const Select: React.FC<SelectProps> = ({ id, options }) => (
  <select
    id={id}
    className="w-full bg-slate-800 border border-slate-600 px-3 py-2 rounded text-white"
  >
    {options.map((option) => (
      <option key={option} value={option}>
        {option}
      </option>
    ))}
  </select>
);

export default Select;
