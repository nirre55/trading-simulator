import React from 'react';

type TabsProps = {
  active: string;
  onChange: (tab: 'manual' | 'calculated') => void;
};

const Tabs: React.FC<TabsProps> = ({ active, onChange }) => (
  <>
    <div className="flex bg-slate-800 rounded overflow-hidden mb-4">
      <button
        onClick={() => onChange('manual')}
        className={`w-1/2 py-2 text-sm font-semibold ${active === 'manual' ? 'bg-slate-700 text-white' : 'bg-slate-900 text-slate-400'}`}
      >
        Manual Entry Points
      </button>
      <button
        onClick={() => onChange('calculated')}
        className={`w-1/2 py-2 text-sm font-semibold ${active === 'calculated' ? 'bg-slate-700 text-white' : 'bg-slate-900 text-slate-400'}`}
      >
        Calculated Entry Points
      </button>
    </div>
  </>
);

export default Tabs;
