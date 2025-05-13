import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '../ui';
import { ThemeToggle } from '../features';

const Header: React.FC = () => {
  const { t } = useTranslation();
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
    <header className="bg-white dark:bg-slate-800 shadow-md py-4 z-10">
      <div className={`flex justify-between items-center transition-all duration-300 ${isMobile ? 'px-16' : 'ml-64 px-6'}`}>
        {isMobile && (
          <h1 className="text-xl font-bold text-gray-900 dark:text-white pl-6">
            {t('app.title')}
          </h1>
        )}
        <div className="flex-1"></div>
        <div className="flex space-x-4 items-center">
          <LanguageSelector />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header; 