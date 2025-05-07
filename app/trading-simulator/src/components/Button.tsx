
import React from 'react';

type ButtonProps = {
  children: React.ReactNode;
};

const Button: React.FC<ButtonProps> = ({ children }) => (
  <button className="mt-6 w-full bg-green-700 hover:bg-green-600 text-white py-2 rounded text-lg">
    {children}
  </button>
);

export default Button;
