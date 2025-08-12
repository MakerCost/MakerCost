'use client';

import { useState } from 'react';
import { VATSettings } from '@/types/pricing';

interface VATConfigurationProps {
  value: VATSettings;
  onChange: (vatSettings: VATSettings) => void;
}

export default function VATConfiguration({ value, onChange }: VATConfigurationProps) {
  const [rate, setRate] = useState(value.rate.toString());

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRate = e.target.value;
    setRate(newRate);
    
    const numericRate = parseFloat(newRate);
    if (!isNaN(numericRate) && numericRate >= 0 && numericRate <= 100) {
      onChange({ ...value, rate: numericRate });
    }
  };

  const handleInclusiveToggle = (isInclusive: boolean) => {
    onChange({ ...value, isInclusive });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">VAT Configuration</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            VAT Rate (%)
          </label>
          <input
            type="number"
            value={rate}
            onChange={handleRateChange}
            step="0.1"
            min="0"
            max="100"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="18"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price Setting
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="vatInclusive"
                checked={!value.isInclusive}
                onChange={() => handleInclusiveToggle(false)}
                className="mr-2"
              />
              <span className="text-sm">Price excludes VAT</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="vatInclusive"
                checked={value.isInclusive}
                onChange={() => handleInclusiveToggle(true)}
                className="mr-2"
              />
              <span className="text-sm">Price includes VAT</span>
            </label>
          </div>
        </div>
      </div>
      
      <div className="bg-blue-50 p-3 rounded-lg">
        <p className="text-sm text-blue-800">
          {value.isInclusive ? (
            <>VAT will be calculated as part of the entered sale price</>
          ) : (
            <>VAT will be added on top of the entered sale price</>
          )}
        </p>
      </div>
    </div>
  );
}