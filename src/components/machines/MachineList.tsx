'use client';

import { useState } from 'react';
import { Machine, Currency } from '@/types/pricing';
import { usePricingStore } from '@/store/pricing-store';
import { useMachineStore, DashboardMachine } from '@/store/machine-store';
import MachineCard from './MachineCard';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { formatCurrency } from '@/lib/calculations';

interface MachineListProps {
  currency: Currency;
}

export default function MachineList({ currency }: MachineListProps) {
  const { currentProject, addMachine, updateMachine, removeMachine } = usePricingStore();
  const { machines: dashboardMachines } = useMachineStore();
  const machines = currentProject.costParameters.machines;
  const [machineToDelete, setMachineToDelete] = useState<{ id: string; type: string } | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);

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

  // Convert dashboard machine to calculator machine
  const convertDashboardMachine = (dashboardMachine: DashboardMachine): Omit<Machine, 'id'> => {
    // Calculate estimated usage hours based on annual depreciation
    const annualDepreciation = dashboardMachine.purchasePrice * (dashboardMachine.depreciationPercentage / 100);
    const depreciationPerHour = annualDepreciation / dashboardMachine.hoursPerYear;
    
    return {
      type: 'Other', // Default to 'Other' since dashboard machines don't have this categorization
      purchaseCost: dashboardMachine.purchasePrice,
      lifetimeHours: Math.round(dashboardMachine.purchasePrice / depreciationPerHour), // Estimate based on depreciation
      profitMargin: 30, // Default profit margin
      usageHours: 0, // User will need to set this per project
    };
  };

  const handleImportMachine = (dashboardMachine: DashboardMachine) => {
    if (machines.length < 5) {
      const calculatorMachine = convertDashboardMachine(dashboardMachine);
      addMachine(calculatorMachine);
      setShowImportModal(false);
    }
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
        <div className="flex items-center space-x-2">
          {dashboardMachines.length > 0 && (
            <button
              onClick={() => setShowImportModal(true)}
              className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors cursor-pointer"
              title="Import machines from your dashboard"
            >
              Import from My Machines
            </button>
          )}
          {machines.length > 0 && (
            <div className="text-sm text-gray-600">
              {machines.length}/5 machines
            </div>
          )}
        </div>
      </div>

      {machines.length === 0 ? (
        <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="mb-2">No machines added yet.</p>
          <p className="text-sm mb-4">Add machines to include equipment costs in your pricing.</p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
            <button
              onClick={handleAddMachine}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
            >
              Add First Machine
            </button>
            {dashboardMachines.length > 0 && (
              <button
                onClick={() => setShowImportModal(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer"
              >
                Import from My Machines
              </button>
            )}
          </div>
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
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors cursor-pointer"
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

      {/* Import Machines Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Import from My Machines
                </h2>
                <button
                  onClick={() => setShowImportModal(false)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                {dashboardMachines.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No machines found in your dashboard.</p>
                    <p className="text-sm mt-2">Add machines in the Dashboard → My Machines section first.</p>
                  </div>
                ) : (
                  <>
                    <p className="text-gray-600 mb-4">
                      Select machines from your dashboard to import into this project. 
                      Machine settings will be converted to work with the project calculator.
                    </p>
                    {dashboardMachines.map((machine) => (
                      <div key={machine.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{machine.name}</h3>
                            <div className="text-sm text-gray-600 mt-1">
                              Purchase Price: {formatCurrency(machine.purchasePrice, currency)} • 
                              Depreciation: {machine.depreciationPercentage}% • 
                              Hours/Year: {machine.hoursPerYear.toLocaleString()}
                            </div>
                          </div>
                          <button
                            onClick={() => handleImportMachine(machine)}
                            disabled={machines.length >= 5}
                            className={`px-3 py-1 text-sm rounded transition-colors ${
                              machines.length >= 5
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                            }`}
                          >
                            Import
                          </button>
                        </div>
                      </div>
                    ))}
                    {machines.length >= 5 && (
                      <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                        Maximum of 5 machines per project reached. Remove existing machines to import more.
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowImportModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}