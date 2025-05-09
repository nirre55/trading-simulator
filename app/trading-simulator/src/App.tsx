// src/App.tsx
import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from 'react-i18next';
import { default as FormSection } from './components/forms/FormSection';
import ThemeToggle from './components/features/ThemeToggle';
import Header from './components/layout/Header';

const App: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white">
      <Header />
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