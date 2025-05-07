// components/FormSection.tsx
import React, { useState } from 'react';
import Input from './Input';
import Label from './Label';
import Select from './Select';
import Checkbox from './Checkbox';
import Button from './Button';
import DropPercentageInputList from './DropPercentageInputList';
import Tabs from './Tabs';

const FormSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'manual' | 'calculated'>('manual');

  return (
    <div className="max-w-3xl mx-auto bg-slate-900 p-6 rounded-lg border border-slate-700">
      <Tabs active={activeTab} onChange={setActiveTab} />

      {/* Common Parameters */}
      <h2 className="text-lg font-semibold mb-4">Common Parameters</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="balance">Total Balance</Label>
          <Input id="balance" defaultValue="1000" />
        </div>

        <div>
          <Label htmlFor="leverage">Leverage</Label>
          <Select id="leverage" options={['1x', '5x', '10x', '50x', '100x']} />
        </div>

        <div>
          <Label htmlFor="stoploss">Stop-loss Price</Label>
          <Input id="stoploss" defaultValue="20" />
        </div>

        <div>
          <Label htmlFor="target">Target Gain %</Label>
          <Input id="target" defaultValue="100" />
        </div>

        <div>
          <Label htmlFor="fees">Fees (%)</Label>
          <div className="grid grid-cols-3 gap-2">
            <Input id="maker" defaultValue="0,1" />
            <Input id="taker" defaultValue="0,2" />
            <Input id="funding" defaultValue="0,01" />
          </div>
          <div className="flex justify-between text-sm text-gray-400 px-1 mt-1">
            <span>Maker</span>
            <span>Taker</span>
            <span>Funding</span>
          </div>
        </div>

        <Checkbox id="recovery" label="Loss recovery" />

        <div>
          <Label htmlFor="symbol">Symbol</Label>
          <Input id="symbol" defaultValue="BTC/USDT" />
        </div>
      </div>

      {/* Tab-specific sections */}
      {activeTab === 'manual' ? (
        <div className="mt-8">
          <h3 className="text-md font-semibold mb-2">Manual Entry Points</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="numTrades">Number of Trades</Label>
              <Input id="numTrades" defaultValue="3" />
            </div>
            <div>
              <Label htmlFor="entryPrices">Entry Prices</Label>
              <DropPercentageInputList buttonText="+ Ajouter Entry Prices" />
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-8">
          <h3 className="text-md font-semibold mb-2">Calculated Entry Points</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="initialPrice">Initial Entry Price</Label>
              <Input id="initialPrice" defaultValue="100" />
            </div>
            <Label htmlFor="dropPercentage">Drop Percentage</Label>
            <DropPercentageInputList buttonText="+ Add Drop Percentage" />
          </div>
        </div>
      )}

      <Button>Simulate</Button>
    </div>
  );
};

export default FormSection;
