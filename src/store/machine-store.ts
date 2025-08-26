import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Machine } from '@/types/pricing';

// Machine interface for dashboard
export interface DashboardMachine {
  id: string;
  name: string;
  purchasePrice: number;
  depreciationPercentage: number;
  hoursPerYear: number;
  maintenanceCostPerYear: number;
  powerConsumption: number;
  electricityIncludedInOverhead: boolean;
}

// Utility function to convert DashboardMachine to pricing Machine
export const convertToCalculatorMachine = (dashboardMachine: DashboardMachine): Machine => {
  return {
    id: dashboardMachine.id,
    name: dashboardMachine.name,
    purchasePrice: dashboardMachine.purchasePrice,
    depreciationPercentage: dashboardMachine.depreciationPercentage,
    hoursPerYear: dashboardMachine.hoursPerYear,
    maintenanceCostPerYear: dashboardMachine.maintenanceCostPerYear,
    powerConsumption: dashboardMachine.powerConsumption,
    electricityIncludedInOverhead: dashboardMachine.electricityIncludedInOverhead
  };
};

interface MachineStore {
  machines: DashboardMachine[];
  addMachine: (machine: Omit<DashboardMachine, 'id'>) => void;
  updateMachine: (id: string, machine: Partial<DashboardMachine>) => void;
  deleteMachine: (id: string) => void;
  getMachineById: (id: string) => DashboardMachine | undefined;
  getCalculatorMachines: () => Machine[];
}

export const useMachineStore = create<MachineStore>()(
  persist(
    (set, get) => ({
      machines: [
        // Default demo machine
        {
          id: '1',
          name: 'CNC Router',
          purchasePrice: 25000,
          depreciationPercentage: 20,
          hoursPerYear: 500,
          maintenanceCostPerYear: 1000,
          powerConsumption: 5.5,
          electricityIncludedInOverhead: false
        }
      ],

      addMachine: (machineData) =>
        set((state) => ({
          machines: [
            ...state.machines,
            {
              ...machineData,
              id: `machine_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            },
          ],
        })),

      updateMachine: (id, updates) =>
        set((state) => ({
          machines: state.machines.map((machine) =>
            machine.id === id ? { ...machine, ...updates } : machine
          ),
        })),

      deleteMachine: (id) =>
        set((state) => ({
          machines: state.machines.filter((machine) => machine.id !== id),
        })),

      getMachineById: (id) => {
        const state = get();
        return state.machines.find((machine) => machine.id === id);
      },

      getCalculatorMachines: () => {
        const state = get();
        return state.machines.map(convertToCalculatorMachine);
      },
    }),
    {
      name: 'machine-store',
      version: 1,
    }
  )
);