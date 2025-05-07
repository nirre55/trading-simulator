
import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input: React.FC<InputProps> = (props) => (
  <input
    {...props}
    className="w-full bg-slate-800 border border-slate-600 px-3 py-2 rounded text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
  />
);

export default Input;
