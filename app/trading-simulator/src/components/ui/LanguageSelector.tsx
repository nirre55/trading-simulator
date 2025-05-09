import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('i18nextLng', lng);
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        className={`px-2 py-1 text-sm rounded ${
          i18n.language === 'fr' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'
        }`}
        onClick={() => changeLanguage('fr')}
      >
        FR
      </button>
      <button
        className={`px-2 py-1 text-sm rounded ${
          i18n.language === 'en' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'
        }`}
        onClick={() => changeLanguage('en')}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSelector; 