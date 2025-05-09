import React from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '../ui';
import { ThemeToggle } from '../features';

const Header: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <header className="bg-white dark:bg-slate-800 shadow-md py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          {t('app.title')}
        </h1>
        <div className="flex space-x-4 items-center">
          <LanguageSelector />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header; 