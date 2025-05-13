// src/App.tsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Header, Navigation } from './components/layout';
import { HomePage, ManualEntryPage, CalculatedEntryPage } from './pages';

const App: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Vérifier initialement
    checkIfMobile();

    // Écouter les changements de taille d'écran
    window.addEventListener('resize', checkIfMobile);

    // Nettoyer l'écouteur d'événement
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white flex flex-col">
        <Header />
        <div className="flex flex-1 relative">
          <Navigation />
          <main className={`flex-1 py-8 px-6 transition-all duration-300 ${isMobile ? 'ml-0' : 'ml-64'}`}>
            <div className="max-w-6xl mx-auto">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/manual" element={<ManualEntryPage />} />
                <Route path="/calculated" element={<CalculatedEntryPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </main>
        </div>
        <ToastContainer
          position="bottom-right"
          autoClose={false}
          closeOnClick
          className="bg-gray-800 text-white border border-blue-600 rounded-lg p-4"
          toastClassName="flex items-center"
        />
      </div>
    </Router>
  );
};

export default App;