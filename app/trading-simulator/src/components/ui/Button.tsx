
import React from 'react';

type ButtonProps = {
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<ButtonProps> = ({ children, disabled, className, ...rest }) => (
  <button
    className={`mt-6 w-full py-2 rounded text-lg text-white ${
      disabled
        ? 'bg-gray-400 cursor-not-allowed'
        : 'bg-green-700 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-500'
    } ${className || ''}`}
    disabled={disabled}
    {...rest}
  >
    {children}
  </button>
);

export default Button;
