import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { PricingProject, Material, CostParameters, ProductionInfo, PricingState, Currency, VATSettings, SalePriceInfo, Machine, ExportSettings } from '@/types/pricing';
import { calculatePricing } from '@/lib/calculations';
import { generateRandomDemoProject } from '@/lib/demo-data';
import { saveProject, loadAllProjects, deleteProject, DatabaseError } from '@/lib/database';
import { trackProjectCreated, trackMaterialAdded, trackMachineImported } from '@/lib/analytics/events';

const createDefaultProject = (defaultCurrency: Currency = 'USD'): PricingProject => {
  const now = new Date();
  const oneWeekFromToday = new Date();
  oneWeekFromToday.setDate(now.getDate() + 7);
  
  return {
    id: uuidv4(),
    projectName: '',
    clientName: '',
    projectDate: now,
    deliveryDate: oneWeekFromToday,
    paymentTerms: 'Net 30',
    createdAt: now,
    updatedAt: now,
  currency: defaultCurrency,
  vatSettings: {
    rate: 8.875,
    isInclusive: true,
  },
  salePrice: {
    amount: 0,
    isPerUnit: true,
    unitsCount: 1,
    fixedCharge: 0,
  },
  materials: [],
  costParameters: {
    machines: [],
    labor: { hours: 0, ratePerHour: 0 },
    depreciation: { amount: 0 },
    overhead: { ratePerHour: 0 },
  },
  production: {
    unitsProduced: 1,
    targetProfitMargin: 30,
  },
  exportSettings: {
    includeBreakdown: true,
    showPerUnitCosts: false,
  },
  };
};

interface PricingStore extends PricingState {
  // Material actions
  addMaterial: (material: Omit<Material, 'id'>) => void;
  updateMaterial: (id: string, updates: Partial<Material>) => void;
  removeMaterial: (id: string) => void;
  
  // Machine actions
  addMachine: (machine: Omit<Machine, 'id'>) => void;
  updateMachine: (id: string, updates: Partial<Machine>) => void;
  removeMachine: (id: string) => void;
  
  // Cost parameters actions
  updateCostParameters: (updates: Partial<CostParameters>) => void;
  
  // Production info actions
  updateProduction: (updates: Partial<ProductionInfo>) => void;
  
  // Currency and VAT actions
  updateCurrency: (currency: Currency) => void;
  updateVATSettings: (vatSettings: VATSettings) => void;
  updateSalePrice: (salePrice: SalePriceInfo) => void;
  
  // Project metadata actions
  updateProjectInfo: (updates: { projectName?: string; clientName?: string; projectDate?: Date; productName?: string; deliveryDate?: Date; paymentTerms?: string }) => void;
  
  
  // Calculation actions
  recalculate: () => void;
  
  // Project management
  createNewProject: (defaultCurrency?: Currency) => void;
  saveProject: () => Promise<void>;
  loadProject: (project: PricingProject) => void;
  loadAllProjects: () => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  
  // Demo data
  loadRandomDemoData: (isFieldsLocked?: boolean) => void;
  
  // Export settings
  updateExportSettings: (settings: ExportSettings) => void;
  
  // Loading state
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const usePricingStore = create<PricingStore>()(
  persist(
    (set, get) => ({
      currentProject: createDefaultProject('USD'), // Force USD as default
      projects: [],
      loading: false,

  addMaterial: (material) =>
    set((state) => {
      const newMaterial: Material = {
        ...material,
        id: uuidv4(),
      };
      const updatedProject = {
        ...state.currentProject,
        materials: [...state.currentProject.materials, newMaterial],
        updatedAt: new Date(),
      };
      
      // Track material addition
      trackMaterialAdded({
        material_type: newMaterial.unit,
        material_category: 'custom',
        cost_type: 'per-unit',
        user_tier: 'free', // Should be updated based on user subscription
        project_context: true
      });
      
      // Recalculate automatically
      if (updatedProject.salePrice.amount > 0) {
        updatedProject.calculations = calculatePricing(
          updatedProject.materials,
          updatedProject.costParameters,
          updatedProject.production,
          updatedProject.salePrice,
          updatedProject.vatSettings
        );
      }
      
      return { currentProject: updatedProject };
    }),

  updateMaterial: (id, updates) =>
    set((state) => {
      const updatedProject = {
        ...state.currentProject,
        materials: state.currentProject.materials.map((material) =>
          material.id === id ? { ...material, ...updates } : material
        ),
        updatedAt: new Date(),
      };
      
      // Recalculate automatically
      if (updatedProject.salePrice.amount > 0) {
        updatedProject.calculations = calculatePricing(
          updatedProject.materials,
          updatedProject.costParameters,
          updatedProject.production,
          updatedProject.salePrice,
          updatedProject.vatSettings
        );
      }
      
      return { currentProject: updatedProject };
    }),

  removeMaterial: (id) =>
    set((state) => {
      const updatedProject = {
        ...state.currentProject,
        materials: state.currentProject.materials.filter((material) => material.id !== id),
        updatedAt: new Date(),
      };
      
      // Recalculate automatically
      if (updatedProject.salePrice.amount > 0) {
        updatedProject.calculations = calculatePricing(
          updatedProject.materials,
          updatedProject.costParameters,
          updatedProject.production,
          updatedProject.salePrice,
          updatedProject.vatSettings
        );
      }
      
      return { currentProject: updatedProject };
    }),

  addMachine: (machine) =>
    set((state) => {
      const newMachine: Machine = {
        ...machine,
        id: uuidv4(),
      };
      const updatedProject = {
        ...state.currentProject,
        costParameters: {
          ...state.currentProject.costParameters,
          machines: [...state.currentProject.costParameters.machines, newMachine],
        },
        updatedAt: new Date(),
      };
      
      // Track machine import
      trackMachineImported({
        machine_name: newMachine.name,
        usage_hours: newMachine.usageHours,
        user_tier: 'free' // Should be updated based on user subscription
      });
      
      // Recalculate automatically
      if (updatedProject.salePrice.amount > 0) {
        updatedProject.calculations = calculatePricing(
          updatedProject.materials,
          updatedProject.costParameters,
          updatedProject.production,
          updatedProject.salePrice,
          updatedProject.vatSettings
        );
      }
      
      return { currentProject: updatedProject };
    }),

  updateMachine: (id, updates) =>
    set((state) => {
      const updatedProject = {
        ...state.currentProject,
        costParameters: {
          ...state.currentProject.costParameters,
          machines: state.currentProject.costParameters.machines.map((machine) =>
            machine.id === id ? { ...machine, ...updates } : machine
          ),
        },
        updatedAt: new Date(),
      };
      
      // Recalculate automatically
      if (updatedProject.salePrice.amount > 0) {
        updatedProject.calculations = calculatePricing(
          updatedProject.materials,
          updatedProject.costParameters,
          updatedProject.production,
          updatedProject.salePrice,
          updatedProject.vatSettings
        );
      }
      
      return { currentProject: updatedProject };
    }),

  removeMachine: (id) =>
    set((state) => {
      const updatedProject = {
        ...state.currentProject,
        costParameters: {
          ...state.currentProject.costParameters,
          machines: state.currentProject.costParameters.machines.filter((machine) => machine.id !== id),
        },
        updatedAt: new Date(),
      };
      
      // Recalculate automatically
      if (updatedProject.salePrice.amount > 0) {
        updatedProject.calculations = calculatePricing(
          updatedProject.materials,
          updatedProject.costParameters,
          updatedProject.production,
          updatedProject.salePrice,
          updatedProject.vatSettings
        );
      }
      
      return { currentProject: updatedProject };
    }),

  updateCostParameters: (updates) =>
    set((state) => {
      const updatedProject = {
        ...state.currentProject,
        costParameters: { ...state.currentProject.costParameters, ...updates },
        updatedAt: new Date(),
      };
      
      // Recalculate automatically
      if (updatedProject.salePrice.amount > 0) {
        updatedProject.calculations = calculatePricing(
          updatedProject.materials,
          updatedProject.costParameters,
          updatedProject.production,
          updatedProject.salePrice,
          updatedProject.vatSettings
        );
      }
      
      return { currentProject: updatedProject };
    }),

  updateProduction: (updates) =>
    set((state) => {
      const updatedProject = {
        ...state.currentProject,
        production: { ...state.currentProject.production, ...updates },
        updatedAt: new Date(),
      };
      
      // Recalculate automatically
      if (updatedProject.salePrice.amount > 0) {
        updatedProject.calculations = calculatePricing(
          updatedProject.materials,
          updatedProject.costParameters,
          updatedProject.production,
          updatedProject.salePrice,
          updatedProject.vatSettings
        );
      }
      
      return { currentProject: updatedProject };
    }),

  updateProjectInfo: (updates) =>
    set((state) => ({
      currentProject: {
        ...state.currentProject,
        ...updates,
        updatedAt: new Date(),
      },
    })),


  recalculate: () =>
    set((state) => {
      const updatedProject = {
        ...state.currentProject,
        calculations: state.currentProject.salePrice.amount > 0 
          ? calculatePricing(
              state.currentProject.materials,
              state.currentProject.costParameters,
              state.currentProject.production,
              state.currentProject.salePrice,
              state.currentProject.vatSettings
            )
          : undefined,
        updatedAt: new Date(),
      };
      
      return { currentProject: updatedProject };
    }),

  createNewProject: (defaultCurrency?: Currency) =>
    set(() => {
      // Always use USD as default if no specific currency is provided
      const targetCurrency = defaultCurrency || 'USD';
      const newProject = createDefaultProject(targetCurrency);
      
      // Track project creation
      trackProjectCreated({
        project_id: newProject.id,
        user_tier: 'free', // Default to free, should be updated based on user subscription
        has_materials: false,
        has_machines: false
      });
      
      return { currentProject: newProject };
    }),

  saveProject: async () => {
    const state = get();
    set({ loading: true });
    
    try {
      // Try to save to cloud, but don't fail if user is not authenticated
      try {
        await saveProject(state.currentProject);
      } catch (error) {
        // If it's an authentication error, save locally only
        if (error instanceof DatabaseError && error.message.includes('not authenticated')) {
          console.log('User not authenticated, saving locally only');
        } else {
          throw error; // Re-throw other errors
        }
      }
      
      // Always update local projects list
      set((state) => {
        const existingIndex = state.projects.findIndex(
          (project) => project.id === state.currentProject.id
        );
        
        let updatedProjects;
        if (existingIndex >= 0) {
          updatedProjects = [...state.projects];
          updatedProjects[existingIndex] = state.currentProject;
        } else {
          updatedProjects = [...state.projects, state.currentProject];
        }
        
        return { projects: updatedProjects, loading: false };
      });
    } catch (error) {
      set({ loading: false });
      console.error('Failed to save project:', error);
      throw error;
    }
  },

  loadProject: (project) =>
    set(() => ({
      currentProject: project,
    })),

  loadAllProjects: async () => {
    set({ loading: true });
    
    try {
      const projects = await loadAllProjects();
      set({ projects, loading: false });
    } catch (error) {
      set({ loading: false });
      // If user is not authenticated, just use local projects (empty initially)
      if (error instanceof DatabaseError && error.message.includes('not authenticated')) {
        console.log('User not authenticated, using local projects only');
        return;
      }
      console.error('Failed to load projects:', error);
      throw error;
    }
  },

  deleteProject: async (projectId: string) => {
    set({ loading: true });
    
    try {
      await deleteProject(projectId);
      
      // Update local projects list
      set((state) => ({
        projects: state.projects.filter(p => p.id !== projectId),
        loading: false
      }));
    } catch (error) {
      set({ loading: false });
      console.error('Failed to delete project:', error);
      throw error;
    }
  },

  setLoading: (loading: boolean) =>
    set({ loading }),

  updateCurrency: (currency) =>
    set((state) => {
      const updatedProject = {
        ...state.currentProject,
        currency,
        updatedAt: new Date(),
      };
      
      // Recalculate automatically
      if (updatedProject.salePrice.amount > 0) {
        updatedProject.calculations = calculatePricing(
          updatedProject.materials,
          updatedProject.costParameters,
          updatedProject.production,
          updatedProject.salePrice,
          updatedProject.vatSettings
        );
      }
      
      return { currentProject: updatedProject };
    }),

  updateVATSettings: (vatSettings) =>
    set((state) => {
      const updatedProject = {
        ...state.currentProject,
        vatSettings,
        updatedAt: new Date(),
      };
      
      // Recalculate automatically
      if (updatedProject.salePrice.amount > 0) {
        updatedProject.calculations = calculatePricing(
          updatedProject.materials,
          updatedProject.costParameters,
          updatedProject.production,
          updatedProject.salePrice,
          updatedProject.vatSettings
        );
      }
      
      return { currentProject: updatedProject };
    }),

  updateSalePrice: (salePrice) =>
    set((state) => {
      const updatedProject = {
        ...state.currentProject,
        salePrice,
        updatedAt: new Date(),
      };
      
      // Recalculate automatically
      if (updatedProject.salePrice.amount > 0) {
        updatedProject.calculations = calculatePricing(
          updatedProject.materials,
          updatedProject.costParameters,
          updatedProject.production,
          updatedProject.salePrice,
          updatedProject.vatSettings
        );
      }
      
      return { currentProject: updatedProject };
    }),

  loadRandomDemoData: (isFieldsLocked = false) =>
    set((state) => {
      const demoData = generateRandomDemoProject();
      const currentProject = state.currentProject;
      
      let newProject: PricingProject;
      
      if (isFieldsLocked && currentProject) {
        // Preserve locked fields when products exist
        newProject = {
          ...currentProject,
          id: currentProject.id,
          createdAt: currentProject.createdAt,
          updatedAt: new Date(),
          // Only update unlocked fields
          productName: demoData.productName,
          // Preserve entire vatSettings object since VAT rate is locked
          vatSettings: currentProject.vatSettings,
          // Preserve delivery date and payment terms when locked
          deliveryDate: currentProject.deliveryDate,
          paymentTerms: currentProject.paymentTerms,
          salePrice: demoData.salePrice,
          materials: demoData.materials,
          costParameters: demoData.costParameters,
          production: demoData.production,
        };
      } else {
        // Load all demo data when no restrictions
        newProject = {
          id: currentProject?.id || uuidv4(),
          createdAt: currentProject?.createdAt || new Date(),
          updatedAt: new Date(),
          ...demoData,
        };
      }
      
      // Calculate pricing for the demo data
      if (newProject.salePrice.amount > 0) {
        newProject.calculations = calculatePricing(
          newProject.materials,
          newProject.costParameters,
          newProject.production,
          newProject.salePrice,
          newProject.vatSettings
        );
      }
      
      return { currentProject: newProject };
    }),

  updateExportSettings: (settings) =>
    set((state) => ({
      currentProject: {
        ...state.currentProject,
        exportSettings: settings,
        updatedAt: new Date(),
      },
    })),

    }),
    {
      name: 'makercost-calculator',
      version: 2,
      // Exclude non-serializable fields from persistence
      partialize: (state) => ({
        currentProject: {
          ...state.currentProject,
          calculations: undefined, // Exclude calculations as they're computed
        },
        projects: state.projects.map(project => ({
          ...project,
          calculations: undefined, // Exclude calculations from projects too
        })),
      }),
      migrate: (persistedState: unknown, version: number) => {
        if (version < 2) {
          // Migrate to version 2 - update defaults
          const state = persistedState as PricingState;
          return {
            ...state,
            currentProject: {
              ...state.currentProject,
              currency: 'USD',
              vatSettings: {
                rate: 8.875,
                isInclusive: true,
              },
              salePrice: {
                ...state.currentProject.salePrice,
                isPerUnit: true,
              }
            }
          };
        }
        return persistedState as PricingState;
      },
      // Recompute calculations after rehydration
      onRehydrateStorage: () => (state) => {
        if (state?.currentProject) {
          // Convert date strings back to Date objects
          if (typeof state.currentProject.projectDate === 'string') {
            state.currentProject.projectDate = new Date(state.currentProject.projectDate);
          }
          if (typeof state.currentProject.deliveryDate === 'string') {
            state.currentProject.deliveryDate = new Date(state.currentProject.deliveryDate);
          }
          if (typeof state.currentProject.createdAt === 'string') {
            state.currentProject.createdAt = new Date(state.currentProject.createdAt);
          }
          if (typeof state.currentProject.updatedAt === 'string') {
            state.currentProject.updatedAt = new Date(state.currentProject.updatedAt);
          }

          // Handle projects array dates as well
          if (state.projects) {
            state.projects.forEach(project => {
              if (typeof project.projectDate === 'string') {
                project.projectDate = new Date(project.projectDate);
              }
              if (typeof project.deliveryDate === 'string') {
                project.deliveryDate = new Date(project.deliveryDate);
              }
              if (typeof project.createdAt === 'string') {
                project.createdAt = new Date(project.createdAt);
              }
              if (typeof project.updatedAt === 'string') {
                project.updatedAt = new Date(project.updatedAt);
              }
            });
          }

          // Recompute calculations
          if (state.currentProject.salePrice.amount > 0) {
            state.currentProject.calculations = calculatePricing(
              state.currentProject.materials,
              state.currentProject.costParameters,
              state.currentProject.production,
              state.currentProject.salePrice,
              state.currentProject.vatSettings
            );
          }
        }
      },
    }
  )
);