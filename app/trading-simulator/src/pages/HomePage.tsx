import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-6xl mx-auto bg-white dark:bg-slate-900 p-8 rounded-lg border border-gray-300 dark:border-slate-700 shadow-lg">
      <h2 className="text-4xl font-bold mb-10 text-center">{t('app.title')}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
        <Link
          to="/manual"
          className="flex flex-col items-center p-8 bg-gray-100 dark:bg-slate-800 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition shadow-md hover:shadow-lg"
        >
          <h3 className="text-2xl font-semibold mb-4">{t('tabs.manual')}</h3>
          <p className="text-center text-gray-600 dark:text-gray-300 text-lg">
            {t('home.manualDescription')}
          </p>
        </Link>
        
        <Link
          to="/calculated"
          className="flex flex-col items-center p-8 bg-gray-100 dark:bg-slate-800 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition shadow-md hover:shadow-lg"
        >
          <h3 className="text-2xl font-semibold mb-4">{t('tabs.calculated')}</h3>
          <p className="text-center text-gray-600 dark:text-gray-300 text-lg">
            {t('home.calculatedDescription')}
          </p>
        </Link>
      </div>
    </div>
  );
};

export default HomePage; 