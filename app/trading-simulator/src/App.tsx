// src/App.tsx
import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormSection } from './components/forms';
import { Header } from './components/layout';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white">
      <Header />
      <div className="mt-8"></div>
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