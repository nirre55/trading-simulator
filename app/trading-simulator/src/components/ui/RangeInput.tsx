import React from 'react';

type RangeInputProps = {
  id: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const RangeInput: React.FC<RangeInputProps> = ({ id, className = '', ...props }) => (
  <input
    id={id}
    type="range"
    className={`w-full h-2 appearance-none bg-slate-200 dark:bg-slate-600 rounded outline-none cursor-pointer
      ${className}
    `}
    {...props}
  />
);

export default RangeInput; 