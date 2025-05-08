
import React from 'react';

type LabelProps = {
  htmlFor: string;
  children: React.ReactNode;
};

const Label: React.FC<LabelProps> = ({ htmlFor, children }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium mb-1 text-black dark:text-white">
    {children}
  </label>
);

export default Label;
