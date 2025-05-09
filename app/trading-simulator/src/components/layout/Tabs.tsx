import React from 'react';
import { useTranslation } from 'react-i18next';

type TabsProps = {
  active: string;
  onChange: (tab: 'manual' | 'calculated') => void;
};

const Tabs: React.FC<TabsProps> = ({ active, onChange }) => {
  const { t } = useTranslation();
  
  return (
    <>
      <div className="flex bg-slate-800 rounded overflow-hidden mb-4">
        <button
          onClick={() => onChange('manual')}
          className={`w-1/2 py-2 text-sm font-semibold ${active === 'manual' ? 'bg-gray-200 dark:bg-slate-700 text-black dark:text-white' : 'bg-gray-100 dark:bg-slate-900 text-gray-600 dark:text-slate-400'}`}
        >
          {t('tabs.manual')}
        </button>
        <button
          onClick={() => onChange('calculated')}
          className={`w-1/2 py-2 text-sm font-semibold ${active === 'calculated' ? 'bg-gray-200 dark:bg-slate-700 text-black dark:text-white' : 'bg-gray-100 dark:bg-slate-900 text-gray-600 dark:text-slate-400'}`}
        >
          {t('tabs.calculated')}
        </button>
      </div>
    </>
  );
};

export default Tabs;
