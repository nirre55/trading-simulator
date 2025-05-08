// src/components/ui/ErrorMessage.tsx
import React from 'react';

interface ErrorMessageProps {
  message: string;
  id?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, id }) => {
  return (
    <p id={id} className="text-red-400 text-sm mt-1" role="alert">
      {message}
    </p>
  );
};

export default ErrorMessage;