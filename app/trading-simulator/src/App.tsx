// src/App.tsx
import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FormSection from './components/forms/FormSection';
import ThemeToggle from './components/features/ThemeToggle';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white">
      <header className="flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold">Trading Simulator</h1>
        <ThemeToggle />
      </header>
      <FormSection />
      <ToastContainer
        position="bottom-right"
        autoClose={false}
        closeOnClick
        className="bg-gray-800 text-white border border-blue-600 rounded-lg p-4"
        toastClassName="flex items-center"
      />
    </div>
  );
};

export default App;