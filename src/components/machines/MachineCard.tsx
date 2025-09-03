'use client';

import { useState } from 'react';
import { Machine, MachineType, Currency } from '@/types/pricing';
import { formatCurrency } from '@/lib/calculations';
import { useMachineStore } from '@/store/machine-store';
import { useShopStore } from '@/store/shop-store';
import { useAuth } from '@/hooks/useAuth';

interface MachineCardProps {
  machine: Machine;
  currency: Currency;
  onUpdate: (updates: Partial<Machine>) => void;
  onRemove: () => void;
  onEdit: () => void;
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

export default function MachineCard({ machine, currency, onUpdate, onRemove, onEdit }: MachineCardProps) {
  // Removed isExpanded state - no longer needed
  const [addToMyMachines, setAddToMyMachines] = useState(false);
  const { addMachine: addToMachineStore } = useMachineStore();

  const handleMachineTypeChange = (newType: MachineType) => {
    onUpdate({ 
      name: newType
    });
    handleSaveToMyMachines();
  };

  const handleSaveToMyMachines = () => {
    if (addToMyMachines) {
      // Convert machine to dashboard format and save
      const dashboardMachine = {
        name: machine.name,
        purchasePrice: machine.purchasePrice,
        depreciationPercentage: machine.depreciationPercentage,
        hoursPerYear: machine.hoursPerYear,
        maintenanceCostPerYear: machine.maintenanceCostPerYear,
        powerConsumption: machine.powerConsumption,
        electricityIncludedInOverhead: machine.electricityIncludedInOverhead,
      };
      addToMachineStore(dashboardMachine);
    }
  };

  const handleUpdateField = (updates: Partial<Machine>) => {
    onUpdate(updates);
    handleSaveToMyMachines();
  };

  const { user } = useAuth();
  const { shopData } = useShopStore();
  
  // Calculate complete machine cost to match the summary calculation
  const calculateMachineCost = (machine: Machine): number => {
    // Depreciation cost per hour
    const annualDepreciation = machine.purchasePrice * (machine.depreciationPercentage / 100);
    const depreciationPerHour = annualDepreciation / machine.hoursPerYear;
    const depreciationCost = depreciationPerHour * machine.usageHours;

    // Maintenance cost per hour
    const maintenancePerHour = machine.maintenanceCostPerYear / machine.hoursPerYear;
    const maintenanceCost = maintenancePerHour * machine.usageHours;

    // Electricity cost per hour (if not included in overhead)
    let electricityCost = 0;
    if (!machine.electricityIncludedInOverhead) {
      // Use 1.00 for non-logged users, shopData.powerCostPerKwh for logged users, with fallback
      const powerCost = user ? (shopData.powerCostPerKwh || 0.12) : 1.00;
      const electricityPerHour = machine.powerConsumption * powerCost;
      electricityCost = electricityPerHour * machine.usageHours;
    }

    return depreciationCost + maintenanceCost + electricityCost;
  };

  const machineCharge = calculateMachineCost(machine);
  const usageHours = machine.usageHours || 1; // Use machine's usage hours

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
    <div className="border border-gray-200 dark:border-gray-600 rounded-lg">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          {/* Machine Name as Text */}
          <div className="flex-1">
            <span className="font-medium text-gray-900 dark:text-white">{machine.name}</span>
          </div>
          
          {/* Cost Display */}
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Cost: <span className="font-medium text-green-600 dark:text-green-400">
              {formatCurrency(machineCharge, currency)}
            </span>
          </div>
          
          {/* Machine Time Display */}
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Time: <span className="font-medium text-blue-600 dark:text-blue-400">
              {usageHours} {usageHours === 1 ? 'hour' : 'hours'}
            </span>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onEdit}
            className="px-3 py-1 text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 text-sm cursor-pointer"
          >
            Edit Machine
          </button>
          <button
            onClick={onRemove}
            className="px-3 py-1 text-red-600 dark:text-red-400 border border-red-600 dark:border-red-400 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-sm cursor-pointer"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}