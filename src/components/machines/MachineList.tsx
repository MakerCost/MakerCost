'use client';

import { useState } from 'react';
import { Machine, Currency } from '@/types/pricing';
import { usePricingStore } from '@/store/pricing-store';
import MachineCard from './MachineCard';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { formatCurrency } from '@/lib/calculations';

interface MachineListProps {
  currency: Currency;
}

export default function MachineList({ currency }: MachineListProps) {
  const { currentProject, addMachine, updateMachine, removeMachine } = usePricingStore();
  const machines = currentProject.costParameters.machines;
  const [machineToDelete, setMachineToDelete] = useState<{ id: string; type: string } | null>(null);

  const handleAddMachine = () => {
    if (machines.length < 5) {
      addMachine({
        type: 'CO2 Laser',
        purchaseCost: 0,
        lifetimeHours: 8000,
        profitMargin: 30,
        usageHours: 0,
      });
    }
  };

  const handleUpdateMachine = (machineId: string, updates: Partial<Machine>) => {
    updateMachine(machineId, updates);
  };

  const handleRemoveMachine = (machine: Machine) => {
    setMachineToDelete({ id: machine.id, type: machine.type });
  };

  const confirmRemove = () => {
    if (machineToDelete) {
      removeMachine(machineToDelete.id);
      setMachineToDelete(null);
    }
  };

  const cancelRemove = () => {
    setMachineToDelete(null);
  };

  // Calculate total machine costs for summary
  const totalMachineCosts = machines.reduce((total, machine) => {
    const depreciation = (machine.purchaseCost / machine.lifetimeHours) * machine.usageHours;
    const machineCharge = depreciation + (depreciation * machine.profitMargin / 100);
    return total + machineCharge;
  }, 0);

  const totalDepreciation = machines.reduce((total, machine) => {
    const depreciation = (machine.purchaseCost / machine.lifetimeHours) * machine.usageHours;
    return total + depreciation;
  }, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Machine Setup</h3>
        {machines.length > 0 && (
          <div className="text-sm text-gray-600">
            {machines.length}/5 machines
          </div>
        )}
      </div>

      {machines.length === 0 ? (
        <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="mb-2">No machines added yet.</p>
          <p className="text-sm mb-4">Add machines to include equipment costs in your pricing.</p>
          <button
            onClick={handleAddMachine}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add First Machine
          </button>
        </div>
      ) : (
        <>
          {/* Machine Cards */}
          <div className="space-y-3">
            {machines.map((machine) => (
              <MachineCard
                key={machine.id}
                machine={machine}
                currency={currency}
                onUpdate={(updates) => handleUpdateMachine(machine.id, updates)}
                onRemove={() => handleRemoveMachine(machine)}
              />
            ))}
          </div>

          {/* Add Machine Button */}
          {machines.length < 5 && (
            <button
              onClick={handleAddMachine}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
            >
              + Add Machine ({machines.length}/5)
            </button>
          )}

          {/* Machine Cost Summary */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Machine Cost Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-700">Total Machine Charges:</span>
                <div className="font-medium text-blue-600">
                  {formatCurrency(totalMachineCosts, currency)}
                </div>
                <p className="text-xs text-gray-600 mt-1">Depreciation + profit</p>
              </div>
              <div>
                <span className="text-gray-700">Machine Depreciation:</span>
                <div className="font-medium text-gray-700">
                  {formatCurrency(totalDepreciation, currency)}
                </div>
                <p className="text-xs text-gray-600 mt-1">Equipment wear cost</p>
              </div>
            </div>
          </div>
        </>
      )}

      {machines.length >= 5 && (
        <div className="text-center py-2 text-sm text-amber-600 bg-amber-50 rounded-lg">
          Maximum of 5 machines per project. Remove a machine to add another.
        </div>
      )}

      <ConfirmModal
        isOpen={!!machineToDelete}
        title="Remove Machine"
        message={`Are you sure you want to remove the "${machineToDelete?.type}" machine? This action cannot be undone.`}
        confirmText="Remove"
        cancelText="Cancel"
        onConfirm={confirmRemove}
        onCancel={cancelRemove}
        isDangerous={true}
      />
    </div>
  );
}