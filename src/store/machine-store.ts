import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Machine } from '@/types/pricing';
import { saveMachine, loadAllMachines, deleteMachine, DatabaseError } from '@/lib/database';

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
    electricityIncludedInOverhead: dashboardMachine.electricityIncludedInOverhead,
    usageHours: 1, // Default usage hours for calculator
  };
};

interface MachineStore {
  machines: DashboardMachine[];
  loading: boolean;
  error: string | null;
  addMachine: (machine: Omit<DashboardMachine, 'id'>) => void;
  updateMachine: (id: string, machine: Partial<DashboardMachine>) => void;
  deleteMachine: (id: string) => void;
  getMachineById: (id: string) => DashboardMachine | undefined;
  getCalculatorMachines: () => Machine[];
  
  // Database operations
  saveToDatabase: (machine: DashboardMachine) => Promise<void>;
  loadFromDatabase: () => Promise<void>;
  deleteFromDatabase: (machineId: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
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
      loading: false,
      error: null,

      addMachine: (machineData) => {
        const newMachine: DashboardMachine = {
          ...machineData,
          id: `machine_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        };
        
        set((state) => ({
          machines: [...state.machines, newMachine],
        }));
        
        // Auto-save to database
        get().saveToDatabase(newMachine).catch(error => {
          console.error('Failed to save machine to database:', error);
        });
      },

      updateMachine: (id, updates) => {
        let updatedMachine: DashboardMachine | null = null;
        
        set((state) => {
          const machines = state.machines.map((machine) => {
            if (machine.id === id) {
              updatedMachine = { ...machine, ...updates };
              return updatedMachine;
            }
            return machine;
          });
          return { machines };
        });
        
        // Auto-save to database
        if (updatedMachine) {
          get().saveToDatabase(updatedMachine).catch(error => {
            console.error('Failed to update machine in database:', error);
          });
        }
      },

      deleteMachine: (id) => {
        set((state) => ({
          machines: state.machines.filter((machine) => machine.id !== id),
        }));
        
        // Auto-delete from database
        get().deleteFromDatabase(id).catch(error => {
          console.error('Failed to delete machine from database:', error);
        });
      },

      getMachineById: (id) => {
        const state = get();
        return state.machines.find((machine) => machine.id === id);
      },

      getCalculatorMachines: () => {
        const state = get();
        return state.machines.map(convertToCalculatorMachine);
      },

      // Database operations
      saveToDatabase: async (machine: DashboardMachine) => {
        set({ loading: true, error: null });
        
        try {
          await saveMachine(machine);
          set({ loading: false });
        } catch (error) {
          const errorMessage = error instanceof DatabaseError && error.message.includes('not authenticated') 
            ? 'Machine saved locally only (sign in to sync across devices)'
            : 'Failed to save machine to cloud';
          
          set({ loading: false, error: errorMessage });
          
          // Don't throw error for offline usage
          if (!(error instanceof DatabaseError && error.message.includes('not authenticated'))) {
            console.error('Failed to save machine:', error);
          }
        }
      },

      loadFromDatabase: async () => {
        set({ loading: true, error: null });
        
        try {
          const cloudMachines = await loadAllMachines();
          if (cloudMachines.length > 0) {
            set({ machines: cloudMachines, loading: false });
          } else {
            // No cloud data found, keep local data
            set({ loading: false });
          }
        } catch (error) {
          set({ loading: false });
          
          if (error instanceof DatabaseError && error.message.includes('not authenticated')) {
            // User not authenticated, use local data
            console.log('User not authenticated, using local machine data only');
          } else {
            const errorMessage = 'Failed to load machines from cloud, using local data';
            set({ error: errorMessage });
            console.error('Failed to load machines:', error);
          }
        }
      },

      deleteFromDatabase: async (machineId: string) => {
        try {
          await deleteMachine(machineId);
        } catch (error) {
          if (!(error instanceof DatabaseError && error.message.includes('not authenticated'))) {
            console.error('Failed to delete machine from cloud:', error);
            set({ error: 'Failed to delete machine from cloud' });
          }
        }
      },

      setLoading: (loading: boolean) => set({ loading }),
      
      setError: (error: string | null) => set({ error }),
    }),
    {
      name: 'machine-store',
      version: 1,
    }
  )
);