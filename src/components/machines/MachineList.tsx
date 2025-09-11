'use client';

import { useState, useEffect } from 'react';
import { Machine, Currency } from '@/types/pricing';
import { usePricingStore } from '@/store/pricing-store';
import { useMachineStore, DashboardMachine } from '@/store/machine-store';
import { useShopStore } from '@/store/shop-store';
import { useAuth } from '@/hooks/useAuth';
import MachineCard from './MachineCard';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { formatCurrency } from '@/lib/calculations';
import { getCurrencySymbol, formatNumberForDisplay, parseFormattedNumber } from '@/lib/currency-utils';
import Tooltip, { QuestionMarkIcon } from '@/components/ui/Tooltip';
import { useToast } from '@/contexts/ToastContext';
import Link from 'next/link';

interface MachineListProps {
  currency: Currency;
}

export default function MachineList({ currency }: MachineListProps) {
  const { currentProject, addMachine: addMachineToProject, updateMachine, removeMachine } = usePricingStore();
  const { machines: dashboardMachines } = useMachineStore();
  const { shopData } = useShopStore();
  const { addToast } = useToast();
  const { user } = useAuth();
  const machines = currentProject.costParameters.machines;
  const [machineToDelete, setMachineToDelete] = useState<{ id: string; type: string } | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showAddMachineModal, setShowAddMachineModal] = useState(false);
  const [showEditMachineModal, setShowEditMachineModal] = useState(false);
  const [showUsageHoursModal, setShowUsageHoursModal] = useState(false);
  const [editingMachine, setEditingMachine] = useState<Machine | null>(null);
  const [selectedMachineForImport, setSelectedMachineForImport] = useState<DashboardMachine | null>(null);
  const [importUsageHours, setImportUsageHours] = useState<number>(1);
  const [newMachineData, setNewMachineData] = useState({
    name: '',
    purchasePrice: 0,
    depreciationPercentage: 20,
    hoursPerYear: 500,
    maintenanceCostPerYear: 0,
    powerConsumption: 0.5,
    electricityIncludedInOverhead: false,
    addToMyMachines: false,
    usageHours: 1,
  });
  
  const [editMachineData, setEditMachineData] = useState<Partial<Machine>>({});
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [isAddFormDirty, setIsAddFormDirty] = useState(false);

  // Auto-calculate maintenance cost when purchase price changes (Add Modal)
  useEffect(() => {
    if (newMachineData.purchasePrice && newMachineData.purchasePrice > 0) {
      const calculatedMaintenance = newMachineData.purchasePrice * 0.04 // 4% of purchase price
      setNewMachineData(prev => ({ ...prev, maintenanceCostPerYear: calculatedMaintenance }))
    } else if (newMachineData.purchasePrice === undefined || newMachineData.purchasePrice === 0) {
      // Reset maintenance cost when purchase price is cleared or undefined
      setNewMachineData(prev => ({ ...prev, maintenanceCostPerYear: 0 }))
    }
  }, [newMachineData.purchasePrice])
  
  // Auto-calculate maintenance cost when purchase price changes (Edit Modal)
  useEffect(() => {
    if (editMachineData.purchasePrice && editMachineData.purchasePrice > 0) {
      const calculatedMaintenance = editMachineData.purchasePrice * 0.04 // 4% of purchase price
      setEditMachineData(prev => ({ ...prev, maintenanceCostPerYear: calculatedMaintenance }))
    } else if (editMachineData.purchasePrice === undefined || editMachineData.purchasePrice === 0) {
      // Reset maintenance cost when purchase price is cleared or undefined
      setEditMachineData(prev => ({ ...prev, maintenanceCostPerYear: 0 }))
    }
  }, [editMachineData.purchasePrice])

  // Track if add form is dirty (has user input)
  useEffect(() => {
    const initialData = {
      name: 'Other',
      purchasePrice: 0,
      depreciationPercentage: 20,
      hoursPerYear: 500,
      maintenanceCostPerYear: 0,
      powerConsumption: 0.5,
      electricityIncludedInOverhead: false,
      addToMyMachines: false,
      usageHours: 1,
    };
    
    const isDirty = JSON.stringify(newMachineData) !== JSON.stringify(initialData);
    setIsAddFormDirty(isDirty);
  }, [newMachineData])

  const handleCreateMachine = () => {
    if (machines.length < 5) {
      // Validation: Check if required fields are filled
      if (!newMachineData.name.trim()) {
        addToast('Please enter a machine name', 'error');
        return;
      }
      
      if (!newMachineData.purchasePrice || newMachineData.purchasePrice <= 0) {
        addToast('Please enter a valid purchase price', 'error');
        return;
      }
      
      // Check for duplicate machine name in current project
      const trimmedNewName = newMachineData.name.toLowerCase().trim();
      const isDuplicateInProject = machines.some(machine => 
        machine.name.toLowerCase().trim() === trimmedNewName
      );
      
      if (isDuplicateInProject) {
        addToast(`A machine named "${newMachineData.name}" already exists in this project`, 'error');
        return;
      }
      
      // Check for duplicate machine name in dashboard if adding to My Machines
      if (newMachineData.addToMyMachines) {
        const isDuplicateInDashboard = dashboardMachines.some(machine => 
          machine.name.toLowerCase().trim() === trimmedNewName
        );
        
        if (isDuplicateInDashboard) {
          addToast(`A machine named "${newMachineData.name}" already exists in your dashboard`, 'error');
          return;
        }
      }
      
      const { addToMyMachines: saveToMyMachines, ...machineConfig } = newMachineData;
      
      // Ensure required fields have default values
      const completeConfig = {
        ...machineConfig,
        purchasePrice: machineConfig.purchasePrice ?? 0
      };
      
      // Add to project
      addMachineToProject(completeConfig);
      
      // Add to My Machines if requested
      if (saveToMyMachines) {
        const dashboardMachine = {
          name: newMachineData.name,
          purchasePrice: newMachineData.purchasePrice,
          depreciationPercentage: newMachineData.depreciationPercentage,
          hoursPerYear: newMachineData.hoursPerYear,
          maintenanceCostPerYear: newMachineData.maintenanceCostPerYear,
          powerConsumption: newMachineData.powerConsumption,
          electricityIncludedInOverhead: newMachineData.electricityIncludedInOverhead,
        };
        addToMachineStore(dashboardMachine);
      }
      
      // Reset form and close modal
      setNewMachineData({
        name: 'Other',
        purchasePrice: 0,
        depreciationPercentage: 20,
        hoursPerYear: 500,
        maintenanceCostPerYear: 0,
        powerConsumption: 0.5,
        electricityIncludedInOverhead: false,
        addToMyMachines: false,
        usageHours: 1,
      });
      setShowAddMachineModal(false);
    }
  };

  const handleUpdateMachine = (machineId: string, updates: Partial<Machine>) => {
    updateMachine(machineId, updates);
  };

  const handleRemoveMachine = (machine: Machine) => {
    setMachineToDelete({ id: machine.id, type: machine.name });
  };
  
  const handleEditMachine = (machine: Machine) => {
    setEditingMachine(machine);
    setEditMachineData(machine);
    setShowEditMachineModal(true);
  };
  
  const handleUpdateEditMachine = () => {
    if (!editingMachine) return;
    
    // Validation
    if (!editMachineData.name?.trim()) {
      addToast('Please enter a machine name', 'error');
      return;
    }
    
    if (!editMachineData.purchasePrice || editMachineData.purchasePrice <= 0) {
      addToast('Please enter a valid purchase price', 'error');
      return;
    }
    
    if (!editMachineData.hoursPerYear || editMachineData.hoursPerYear <= 0) {
      addToast('Please enter valid hours per year', 'error');
      return;
    }
    
    if (!editMachineData.usageHours || editMachineData.usageHours <= 0) {
      addToast('Please enter valid usage hours', 'error');
      return;
    }
    
    // Check for duplicate name (excluding the current machine being edited)
    const isDuplicateName = machines.some(machine => 
      machine.id !== editingMachine.id && 
      machine.name.toLowerCase().trim() === editMachineData.name?.toLowerCase().trim()
    );
    
    if (isDuplicateName) {
      addToast(`A machine named "${editMachineData.name}" already exists in this project`, 'error');
      return;
    }
    
    // Update the machine
    handleUpdateMachine(editingMachine.id, editMachineData);
    
    // Reset and close
    setEditingMachine(null);
    setEditMachineData({});
    setShowEditMachineModal(false);
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

  const { addMachine: addToMachineStore } = useMachineStore();

  // Convert dashboard machine to calculator machine
  const convertDashboardMachine = (dashboardMachine: DashboardMachine, usageHours: number = 1): Omit<Machine, 'id'> => {
    
    return {
      name: dashboardMachine.name, // Use the actual machine name from dashboard
      purchasePrice: dashboardMachine.purchasePrice,
      depreciationPercentage: dashboardMachine.depreciationPercentage,
      hoursPerYear: dashboardMachine.hoursPerYear,
      maintenanceCostPerYear: dashboardMachine.maintenanceCostPerYear,
      powerConsumption: dashboardMachine.powerConsumption,
      electricityIncludedInOverhead: dashboardMachine.electricityIncludedInOverhead,
      usageHours: usageHours,
    };
  };

  const handleShowUsageHoursPrompt = (dashboardMachine: DashboardMachine) => {
    if (machines.length >= 5) {
      return;
    }
    
    // Check if machine is already in the project (by name and purchase price as identifier)
    const isDuplicate = machines.some(machine => 
      machine.name === dashboardMachine.name && 
      machine.purchasePrice === dashboardMachine.purchasePrice
    );
    
    if (isDuplicate) {
      addToast(`"${dashboardMachine.name}" is already in this project`, 'error');
      return;
    }
    
    setSelectedMachineForImport(dashboardMachine);
    setImportUsageHours(1);
    setShowUsageHoursModal(true);
  };

  const handleImportMachine = (dashboardMachine: DashboardMachine) => {
    const calculatorMachine = convertDashboardMachine(dashboardMachine, importUsageHours);
    addMachineToProject(calculatorMachine);
    addToast(`"${dashboardMachine.name}" added to project`, 'success');
    setShowImportModal(false);
    setShowUsageHoursModal(false);
    setSelectedMachineForImport(null);
  };

  const handleCloseAddMachine = () => {
    if (isAddFormDirty) {
      setShowExitConfirm(true);
    } else {
      setShowAddMachineModal(false);
    }
  };

  const confirmExitAddMachine = () => {
    // Clear form data
    setNewMachineData({
      name: 'Other',
      purchasePrice: 0,
      depreciationPercentage: 20,
      hoursPerYear: 500,
      maintenanceCostPerYear: 0,
      powerConsumption: 0.5,
      electricityIncludedInOverhead: false,
      addToMyMachines: false,
      usageHours: 1,
    });
    setShowExitConfirm(false);
    setShowAddMachineModal(false);
  };

  const cancelExitAddMachine = () => {
    setShowExitConfirm(false);
  };

  // Calculate detailed machine costs for summary
  const calculateMachineCosts = () => {
    let totalDepreciation = 0;
    let totalMaintenance = 0;
    let totalElectricity = 0;
    let hasElectricityInOverhead = false;
    let hasElectricityCalculated = false;

    machines.forEach(machine => {
      // Depreciation cost per hour
      const annualDepreciation = machine.purchasePrice * (machine.depreciationPercentage / 100);
      const depreciationPerHour = annualDepreciation / machine.hoursPerYear;
      totalDepreciation += depreciationPerHour * machine.usageHours;

      // Maintenance cost per hour
      const maintenancePerHour = machine.maintenanceCostPerYear / machine.hoursPerYear;
      totalMaintenance += maintenancePerHour * machine.usageHours;

      // Electricity cost per hour
      if (machine.electricityIncludedInOverhead) {
        hasElectricityInOverhead = true;
      } else {
        // Use 1.00 for non-logged users, shopData.powerCostPerKwh for logged users, with fallback
        const powerCost = user ? (shopData.powerCostPerKwh || 0.12) : 1.00;
        const electricityPerHour = machine.powerConsumption * powerCost;
        totalElectricity += electricityPerHour * machine.usageHours;
        hasElectricityCalculated = true;
      }
    });

    return {
      totalDepreciation,
      totalMaintenance,
      totalElectricity,
      totalMachineCosts: totalDepreciation + totalMaintenance + totalElectricity,
      hasElectricityInOverhead,
      hasElectricityCalculated
    };
  };

  const machineCosts = calculateMachineCosts();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Machine Setup</h3>
        <div className="flex items-center gap-3">
          {machines.length > 0 && (
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {machines.length}/5 machines
            </div>
          )}
          {machines.length > 0 && machines.length < 5 && (
            <>
              <button
                onClick={() => setShowAddMachineModal(true)}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
              >
                Add New Machine
              </button>
              {dashboardMachines.length > 0 && user && (
                <button
                  onClick={() => setShowImportModal(true)}
                  className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer"
                >
                  Choose from My Machines
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {machines.length === 0 ? (
        <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-sm mb-4">Add machines to include equipment costs in your pricing.</p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
            <button
              onClick={() => setShowAddMachineModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
            >
              Add New Machine
            </button>
            {dashboardMachines.length > 0 && user && (
              <button
                onClick={() => setShowImportModal(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer"
              >
                Choose from My Machines
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
                onEdit={() => handleEditMachine(machine)}
              />
            ))}
          </div>

          {/* Machine Cost Summary */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-3">Machine Cost Summary</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-blue-200 dark:border-blue-700">
                    <th className="text-left py-2 font-medium text-blue-900 dark:text-blue-100">Cost Type</th>
                    <th className="text-right py-2 font-medium text-blue-900 dark:text-blue-100">Amount</th>
                    <th className="text-left py-2 pl-4 font-medium text-blue-900 dark:text-blue-100">Notes</th>
                  </tr>
                </thead>
                <tbody className="space-y-1">
                  <tr className="border-b border-blue-100 dark:border-blue-800">
                    <td className="py-2 text-gray-700 dark:text-gray-300">Machine Depreciation</td>
                    <td className="py-2 text-right font-medium text-gray-900 dark:text-white">
                      {formatCurrency(machineCosts.totalDepreciation, currency)}
                    </td>
                    <td className="py-2 pl-4 text-xs text-gray-600 dark:text-gray-400">Equipment wear cost</td>
                  </tr>
                  <tr className="border-b border-blue-100 dark:border-blue-800">
                    <td className="py-2 text-gray-700 dark:text-gray-300">Maintenance Cost</td>
                    <td className="py-2 text-right font-medium text-gray-900 dark:text-white">
                      {formatCurrency(machineCosts.totalMaintenance, currency)}
                    </td>
                    <td className="py-2 pl-4 text-xs text-gray-600 dark:text-gray-400">Annual maintenance per hour</td>
                  </tr>
                  <tr className="border-b border-blue-100 dark:border-blue-800">
                    <td className="py-2 text-gray-700 dark:text-gray-300">Electricity Cost</td>
                    <td className="py-2 text-right font-medium text-gray-900 dark:text-white">
                      {machineCosts.hasElectricityInOverhead && !machineCosts.hasElectricityCalculated
                        ? 'Included in overhead'
                        : machineCosts.hasElectricityInOverhead && machineCosts.hasElectricityCalculated
                        ? `${formatCurrency(machineCosts.totalElectricity, currency)}*`
                        : formatCurrency(machineCosts.totalElectricity, currency)
                      }
                    </td>
                    <td className="py-2 pl-4 text-xs text-gray-600 dark:text-gray-400">
                      {machineCosts.hasElectricityInOverhead && machineCosts.hasElectricityCalculated
                        ? 'Some included in overhead'
                        : 'Power consumption cost'
                      }
                    </td>
                  </tr>
                  <tr className="border-t-2 border-blue-300 dark:border-blue-700 bg-blue-100 dark:bg-blue-800/50">
                    <td className="py-2 font-medium text-blue-900 dark:text-blue-100">Total Machine Cost</td>
                    <td className="py-2 text-right font-bold text-blue-600 dark:text-blue-400">
                      {formatCurrency(machineCosts.totalMachineCosts, currency)}
                    </td>
                    <td className="py-2 pl-4 text-xs text-gray-600 dark:text-gray-400">Sum of all machine costs</td>
                  </tr>
                </tbody>
              </table>
              {machineCosts.hasElectricityInOverhead && machineCosts.hasElectricityCalculated && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  * Some machines have electricity included in overhead, others calculated separately
                </p>
              )}
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
        <div className="fixed inset-0 bg-black dark:bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setShowImportModal(false)}>
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-gray-900">
                    Import from My Machines
                  </h2>
                  <Link 
                    href="/account/tools" 
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    My Machines
                  </Link>
                </div>
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
                    {dashboardMachines.map((machine) => {
                      const isAlreadyInProject = machines.some(projectMachine => 
                        projectMachine.name === machine.name && 
                        projectMachine.purchasePrice === machine.purchasePrice
                      );
                      const isMaxReached = machines.length >= 5;
                      
                      return (
                        <div key={machine.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900">{machine.name}</h3>
                              <div className="text-sm text-gray-600 mt-1">
                                Purchase Price: {formatCurrency(machine.purchasePrice, currency)} • 
                                Depreciation: {machine.depreciationPercentage}% • 
                                Hours/Year: {machine.hoursPerYear.toLocaleString()}
                              </div>
                              {isAlreadyInProject && (
                                <div className="text-sm text-amber-600 mt-1">Already in project</div>
                              )}
                            </div>
                            <button
                              onClick={() => handleShowUsageHoursPrompt(machine)}
                              disabled={isMaxReached || isAlreadyInProject}
                              className={`px-3 py-1 text-sm rounded transition-colors ${
                                isAlreadyInProject
                                  ? 'bg-amber-100 text-amber-600 cursor-not-allowed'
                                  : isMaxReached
                                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                              }`}
                            >
                              {isAlreadyInProject ? 'Already Added' : 'Import'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
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
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Machine Modal */}
      {showAddMachineModal && (
        <div className="fixed inset-0 bg-black dark:bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={handleCloseAddMachine}>
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Add New Machine
                </h2>
                <button
                  onClick={handleCloseAddMachine}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-gray-600 mb-4">
                  Configure your new machine for this project. All fields will be used to calculate accurate machine costs.
                </p>

                {/* Machine Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Machine Name
                  </label>
                  <input
                    type="text"
                    value={newMachineData.name}
                    onChange={(e) => setNewMachineData({ ...newMachineData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="UV printer / laser / CNC router / etc."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Purchase Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Purchase Price
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">{getCurrencySymbol(currency)}</span>
                      <input
                        type="text"
                        value={newMachineData.purchasePrice ? formatNumberForDisplay(newMachineData.purchasePrice) : ''}
                        onChange={(e) => {
                          const numValue = parseFormattedNumber(e.target.value);
                          setNewMachineData({ ...newMachineData, purchasePrice: numValue || 0 });
                        }}
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter purchase price"
                      />
                    </div>
                  </div>

                  {/* Depreciation Percentage */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Depreciation Percentage (%)
                    </label>
                    <input
                      type="number"
                      value={newMachineData.depreciationPercentage}
                      onChange={(e) => setNewMachineData({ ...newMachineData, depreciationPercentage: parseFloat(e.target.value) || 0 })}
                      step="0.1"
                      min="0"
                      max="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="20"
                    />
                  </div>

                  {/* Hours Per Year */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Hours Per Year
                    </label>
                    <input
                      type="number"
                      value={newMachineData.hoursPerYear}
                      onChange={(e) => setNewMachineData({ ...newMachineData, hoursPerYear: parseFloat(e.target.value) || 0 })}
                      step="100"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="500"
                    />
                  </div>

                  {/* Maintenance Cost Per Year */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Annual Maintenance Cost
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">{getCurrencySymbol(currency)}</span>
                      <input
                        type="text"
                        value={newMachineData.maintenanceCostPerYear ? formatNumberForDisplay(newMachineData.maintenanceCostPerYear) : ''}
                        onChange={(e) => {
                          const numValue = parseFormattedNumber(e.target.value);
                          setNewMachineData({ ...newMachineData, maintenanceCostPerYear: numValue || 0 });
                        }}
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Auto-calculated: 4% of purchase price"
                      />
                    </div>
                  </div>

                  {/* Power Consumption */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Power Consumption (kW)
                    </label>
                    <input
                      type="number"
                      value={newMachineData.powerConsumption}
                      onChange={(e) => setNewMachineData({ ...newMachineData, powerConsumption: parseFloat(e.target.value) || 0 })}
                      step="0.1"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.5"
                    />
                  </div>
                  
                  {/* Usage Hours */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Usage Hours (This Project)
                    </label>
                    <input
                      type="number"
                      value={newMachineData.usageHours}
                      onChange={(e) => setNewMachineData({ ...newMachineData, usageHours: parseFloat(e.target.value) || 1 })}
                      step="0.1"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="1"
                    />
                  </div>

                  {/* Electricity Included */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <input
                        type="checkbox"
                        checked={newMachineData.electricityIncludedInOverhead}
                        onChange={(e) => setNewMachineData({ ...newMachineData, electricityIncludedInOverhead: e.target.checked })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      Electricity included in overhead
                      <Tooltip 
                        content="Check this if your overhead calculation already includes electricity costs to avoid double counting. When checked, this machine's power consumption won't be added to the hourly rate calculation."
                        maxWidth="max-w-md"
                      >
                        <QuestionMarkIcon className="w-4 h-4" />
                      </Tooltip>
                    </label>
                  </div>
                </div>

                {/* Add to My Machines Checkbox for logged-in users */}
                {user && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newMachineData.addToMyMachines}
                        onChange={(e) => setNewMachineData({ ...newMachineData, addToMyMachines: e.target.checked })}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Add to My Machines
                      </span>
                    </label>
                    <p className="text-xs text-gray-500 mt-1 ml-6">
                      Save this machine configuration to your dashboard for future projects
                    </p>
                  </div>
                )}


                {machines.length >= 5 && (
                  <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                    Maximum of 5 machines per project reached. Remove existing machines to add more.
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center mt-6">
                {/* Sign-up prompt for guest users */}
                {!user ? (
                  <div className="flex-1 mr-4">
                    <div className="p-2 bg-green-50 rounded border border-green-200 text-xs">
                      <div className="flex items-center space-x-1 text-green-800">
                        <svg className="w-3 h-3 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium">Save for reuse?</span>
                        <Link 
                          href="/signup" 
                          className="text-green-600 hover:text-green-800 underline font-medium ml-1"
                        >
                          Sign up
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div></div>
                )}
                
                {/* Action buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={handleCloseAddMachine}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateMachine}
                    disabled={machines.length >= 5}
                    className={`px-4 py-2 rounded-md transition-colors ${
                      machines.length >= 5
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                    }`}
                  >
                    Add Machine
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Machine Modal */}
      {showEditMachineModal && editingMachine && (
        <div className="fixed inset-0 bg-black dark:bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setShowEditMachineModal(false)}>
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Edit Machine: {editingMachine.name}
                </h2>
                <button
                  onClick={() => setShowEditMachineModal(false)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Machine Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Machine Name
                    </label>
                    <input
                      type="text"
                      value={editMachineData.name || ''}
                      onChange={(e) => setEditMachineData({ ...editMachineData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter machine name"
                    />
                  </div>

                  {/* Purchase Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Purchase Price
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">{getCurrencySymbol(currency)}</span>
                      <input
                        type="text"
                        value={editMachineData.purchasePrice ? formatNumberForDisplay(editMachineData.purchasePrice) : ''}
                        onChange={(e) => {
                          const numValue = parseFormattedNumber(e.target.value);
                          setEditMachineData({ ...editMachineData, purchasePrice: numValue || 0 });
                        }}
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter purchase price"
                      />
                    </div>
                  </div>

                  {/* Depreciation Percentage */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Depreciation %
                    </label>
                    <input
                      type="number"
                      value={editMachineData.depreciationPercentage || 20}
                      onChange={(e) => setEditMachineData({ ...editMachineData, depreciationPercentage: parseFloat(e.target.value) || 20 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="20"
                      min="0"
                      max="100"
                      step="0.1"
                    />
                  </div>

                  {/* Hours Per Year */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Hours Per Year
                    </label>
                    <input
                      type="text"
                      value={editMachineData.hoursPerYear ? formatNumberForDisplay(editMachineData.hoursPerYear) : ''}
                      onChange={(e) => {
                        const numValue = parseFormattedNumber(e.target.value);
                        setEditMachineData({ ...editMachineData, hoursPerYear: numValue || 500 });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="500"
                    />
                  </div>

                  {/* Usage Hours */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Usage Hours (This Project)
                    </label>
                    <input
                      type="number"
                      value={editMachineData.usageHours || 1}
                      onChange={(e) => setEditMachineData({ ...editMachineData, usageHours: parseFloat(e.target.value) || 1 })}
                      step="0.1"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="1"
                    />
                  </div>

                  {/* Annual Maintenance Cost */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Annual Maintenance Cost
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">{getCurrencySymbol(currency)}</span>
                      <input
                        type="text"
                        value={editMachineData.maintenanceCostPerYear ? formatNumberForDisplay(editMachineData.maintenanceCostPerYear) : ''}
                        onChange={(e) => {
                          const numValue = parseFormattedNumber(e.target.value);
                          setEditMachineData({ ...editMachineData, maintenanceCostPerYear: numValue || 0 });
                        }}
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Auto-calculated: 4% of purchase price"
                      />
                    </div>
                  </div>

                  {/* Power Consumption */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Power Consumption (kW)
                    </label>
                    <input
                      type="number"
                      value={editMachineData.powerConsumption || 0.5}
                      onChange={(e) => setEditMachineData({ ...editMachineData, powerConsumption: parseFloat(e.target.value) || 0.5 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.5"
                      min="0"
                      step="0.1"
                    />
                  </div>

                  {/* Electricity Included in Overhead */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <input
                        type="checkbox"
                        checked={editMachineData.electricityIncludedInOverhead || false}
                        onChange={(e) => setEditMachineData({ ...editMachineData, electricityIncludedInOverhead: e.target.checked })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      Electricity included in overhead
                      <Tooltip 
                        content="Check this if your overhead calculation already includes electricity costs to avoid double counting. When checked, this machine's power consumption won't be added to the hourly rate calculation."
                        maxWidth="max-w-md"
                      >
                        <QuestionMarkIcon className="w-4 h-4" />
                      </Tooltip>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setShowEditMachineModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateEditMachine}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  Update Machine
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Usage Hours Prompt Modal */}
      {showUsageHoursModal && selectedMachineForImport && (
        <div className="fixed inset-0 bg-black dark:bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => { setShowUsageHoursModal(false); setSelectedMachineForImport(null); }}>
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Set Usage Hours for {selectedMachineForImport.name}
                </h2>
                <button
                  onClick={() => {
                    setShowUsageHoursModal(false);
                    setSelectedMachineForImport(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-gray-600 text-sm">
                  How many hours will this machine be used for this project?
                </p>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Usage Hours (This Project)
                  </label>
                  <input
                    type="number"
                    value={importUsageHours}
                    onChange={(e) => setImportUsageHours(parseFloat(e.target.value) || 1)}
                    step="0.1"
                    min="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="1"
                    autoFocus
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => {
                    setShowUsageHoursModal(false);
                    setSelectedMachineForImport(null);
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleImportMachine(selectedMachineForImport)}
                  disabled={!importUsageHours || importUsageHours <= 0}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    !importUsageHours || importUsageHours <= 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                  }`}
                >
                  Add Machine
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-medium mb-4">Unsaved Changes</h3>
            <p className="text-gray-600 mb-6">
              You have unsaved changes. Are you sure you want to close without saving?
            </p>
            <div className="flex space-x-3 justify-end">
              <button
                onClick={cancelExitAddMachine}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Continue Editing
              </button>
              <button
                onClick={confirmExitAddMachine}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Close Without Saving
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}