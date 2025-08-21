'use client';

import { useState } from 'react';
import { Machine, MachineType, Currency } from '@/types/pricing';
import { formatCurrency } from '@/lib/calculations';

interface MachineCardProps {
  machine: Machine;
  currency: Currency;
  onUpdate: (updates: Partial<Machine>) => void;
  onRemove: () => void;
}

const machineTypeOptions: Array<{ value: MachineType; label: string }> = [
  { value: 'CO2 Laser', label: 'CO2 Laser' },
  { value: 'Fiber Laser', label: 'Fiber Laser' },
  { value: 'UV Printer', label: 'UV Printer' },
  { value: 'Sublimation Press', label: 'Sublimation Press' },
  { value: 'FDM 3D Printer', label: 'FDM 3D Printer' },
  { value: 'Resin Printer', label: 'Resin Printer' },
  { value: 'CNC Router', label: 'CNC Router' },
  { value: 'Vinyl Cutter', label: 'Vinyl Cutter' },
  { value: 'Injection Molding', label: 'Injection Molding' },
  { value: 'Die Cutting', label: 'Die Cutting' },
  { value: 'Heat Press', label: 'Heat Press' },
  { value: 'Embroidery Machine', label: 'Embroidery Machine' },
  { value: 'Screen Printer', label: 'Screen Printer' },
  { value: 'Pad Printer', label: 'Pad Printer' },
  { value: 'Rotary Engraver', label: 'Rotary Engraver' },
  { value: 'Plasma Cutter', label: 'Plasma Cutter' },
  { value: 'Waterjet Cutter', label: 'Waterjet Cutter' },
  { value: 'Bandsaw', label: 'Bandsaw' },
  { value: 'Table Saw', label: 'Table Saw' },
  { value: 'Router Table', label: 'Router Table' },
  { value: 'Drill Press', label: 'Drill Press' },
  { value: 'Lathe', label: 'Lathe' },
  { value: 'Milling Machine', label: 'Milling Machine' },
  { value: 'Welding Equipment', label: 'Welding Equipment' },
  { value: 'Powder Coating Oven', label: 'Powder Coating Oven' },
  { value: 'Kiln', label: 'Kiln' },
  { value: 'Vacuum Former', label: 'Vacuum Former' },
  { value: 'Airbrush Setup', label: 'Airbrush Setup' },
  { value: 'Sewing Machine', label: 'Sewing Machine' },
  { value: 'Other', label: 'Other' },
];

export default function MachineCard({ machine, currency, onUpdate, onRemove }: MachineCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleMachineTypeChange = (newType: MachineType) => {
    onUpdate({ 
      name: newType
    });
  };

  // Calculate costs in real-time
  const usageHours = 1; // Default usage hours
  const profitMargin = 0; // Default profit margin
  const lifetimeHours = machine.hoursPerYear * 10; // Estimate lifetime from yearly hours
  const depreciation = (machine.purchasePrice / lifetimeHours) * usageHours;
  const machineCharge = depreciation + (depreciation * profitMargin / 100);

  const getCurrencySymbol = (currency: Currency): string => {
    switch (currency) {
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'GBP': return '£';
      case 'NIS': return '₪';
      case 'CAD': return 'C$';
      case 'AUD': return 'A$';
      case 'JPY': return '¥';
      case 'CHF': return 'CHF';
      case 'CNY': return '¥';
      case 'INR': return '₹';
      case 'BRL': return 'R$';
      case 'MXN': return '$';
      case 'KRW': return '₩';
      case 'SEK': return 'kr';
      case 'NOK': return 'kr';
      default: return '$';
    }
  };

  const currencySymbol = getCurrencySymbol(currency);

  return (
    <div className="border border-gray-200 rounded-lg">
      {/* Header */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <div className="flex-1">
            <select
              value={machine.name}
              onChange={(e) => handleMachineTypeChange(e.target.value as MachineType)}
              onClick={(e) => e.stopPropagation()}
              className="max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
            >
              {machineTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="text-sm text-gray-600">
            Cost: <span className="font-medium text-green-600">
              {formatCurrency(machineCharge, currency)}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="px-2 py-1 text-red-600 border border-red-600 rounded hover:bg-red-50 text-sm cursor-pointer"
          >
            Remove
          </button>
          <div className="transform transition-transform">
            {isExpanded ? '▼' : '▶'}
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Purchase Cost */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Purchase Cost ({currencySymbol})
              </label>
              <div className="relative max-w-xs">
                <span className="absolute left-3 top-2 text-gray-500">
                  {currencySymbol}
                </span>
                <input
                  type="number"
                  value={machine.purchasePrice}
                  onChange={(e) => onUpdate({ purchasePrice: parseFloat(e.target.value) || 0 })}
                  step="0.01"
                  min="0"
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Lifetime Hours */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lifetime Hours
              </label>
              <input
                type="number"
                value={lifetimeHours}
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0;
                  // This is calculated, not directly updatable
                  console.log('Lifetime hours changed:', value);
                }}
                step="100"
                min="100"
                className="max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="5000"
              />
              <p className="text-xs text-gray-500 mt-1">Expected machine lifetime (multiples of 100)</p>
            </div>

            {/* Profit Margin */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profit Margin (%)
              </label>
              <input
                type="number"
                value={profitMargin}
                onChange={(e) => {
                  // This is calculated, not directly updatable
                  console.log('Profit margin changed:', e.target.value);
                }}
                step="0.1"
                min="0"
                max="1000"
                className="max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="30"
              />
              <p className="text-xs text-gray-500 mt-1">Desired profit on machine usage</p>
            </div>

            {/* Usage Hours */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Usage Hours (This Project)
              </label>
              <input
                type="number"
                value={usageHours || ''}
                onChange={(e) => {
                  // This is calculated, not directly updatable
                  console.log('Usage hours changed:', e.target.value);
                }}
                step="0.1"
                min="0"
                className="max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder=""
              />
              <p className="text-xs text-gray-500 mt-1">Hours used for this project</p>
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="mt-4 p-3 bg-white rounded-lg border">
            <h4 className="font-medium text-sm mb-2">Cost Breakdown</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Depreciation:</span>
                <div className="font-medium">{formatCurrency(depreciation, currency)}</div>
              </div>
              <div>
                <span className="text-gray-600">Profit ({profitMargin}%):</span>
                <div className="font-medium">{formatCurrency(depreciation * profitMargin / 100, currency)}</div>
              </div>
              <div>
                <span className="text-gray-600">Total Machine Cost:</span>
                <div className="font-medium text-green-600 text-base">{formatCurrency(machineCharge, currency)}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}