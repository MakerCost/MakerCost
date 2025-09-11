import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { UserMaterial, MaterialOption, MaterialUsage, InventoryUpdateRequest } from '@/types/user-materials'
import { MaterialCategory, UnitType } from '@/types/pricing'
import { saveMaterial, loadAllMaterials, deleteMaterial, DatabaseError } from '@/lib/database'

interface UserMaterialsState {
  materials: UserMaterial[]
  loading: boolean
  error: string | null
  
  // Material management
  addMaterial: (material: Omit<UserMaterial, 'id' | 'lastUpdated'>) => void
  updateMaterial: (id: string, updates: Partial<UserMaterial>) => void
  deleteMaterial: (id: string) => void
  getMaterial: (id: string) => UserMaterial | undefined
  
  // Calculator integration
  getMaterialsForCalculator: (materialType?: MaterialCategory) => MaterialOption[]
  updateInventoryFromUsage: (request: InventoryUpdateRequest) => void
  addUsageHistory: (materialId: string, usage: Omit<MaterialUsage, 'id'>) => void
  
  // Utility functions
  getUnitMapping: (userUnit: string) => UnitType
  convertUserMaterialToOption: (material: UserMaterial) => MaterialOption
  
  // Inventory management
  checkLowStock: () => UserMaterial[]
  getTotalValue: () => number
  
  // Search and filter
  searchMaterials: (query: string) => UserMaterial[]
  filterByCategory: (category: string) => UserMaterial[]
  filterByType: (materialType: MaterialCategory) => UserMaterial[]
  
  // Database operations
  saveToDatabase: (material: UserMaterial) => Promise<void>
  loadFromDatabase: () => Promise<void>
  deleteFromDatabase: (materialId: string) => Promise<void>
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

// Unit mapping between user-friendly names and calculator units
const UNIT_MAPPING: Record<string, UnitType> = {
  'board foot': 'custom',
  'sq ft': 'square meters',
  'linear ft': 'linear meters',
  'piece': 'pieces',
  'yard': 'meters',
  'pound': 'kilograms',
  'gallon': 'liters',
  'other': 'custom'
}

export const useUserMaterialsStore = create<UserMaterialsState>()(
  persist(
    (set, get) => ({
      materials: [
        {
          id: '1',
          name: 'Oak Wood',
          category: 'Wood',
          materialType: 'main',
          supplier: 'Local Lumber Co.',
          costPerUnit: 45.50,
          unit: 'board foot',
          calculatorUnit: 'custom',
          productLink: 'https://locallumber.com/oak-boards',
          comments: 'Premium grade oak lumber, kiln dried',
          inStock: true,
          minStock: 50,
          currentStock: 150,
          lastUpdated: '2024-01-15',
          wastePercentage: 5,
          usageHistory: []
        },
        {
          id: '2',
          name: 'Steel Plate 1/4"',
          category: 'Metal',
          materialType: 'main',
          supplier: 'Metal Works Inc.',
          costPerUnit: 8.25,
          unit: 'sq ft',
          calculatorUnit: 'square meters',
          description: 'Cold rolled steel plate',
          inStock: true,
          minStock: 20,
          currentStock: 15,
          lastUpdated: '2024-01-10',
          wastePercentage: 2,
          usageHistory: []
        },
        {
          id: '3',
          name: 'Cardboard Box Small',
          category: 'Packaging',
          materialType: 'packaging',
          supplier: 'Box Supply Co.',
          costPerUnit: 1.25,
          unit: 'piece',
          calculatorUnit: 'pieces',
          description: '6x4x2 shipping boxes',
          inStock: true,
          minStock: 100,
          currentStock: 250,
          lastUpdated: '2024-01-12',
          wastePercentage: 0,
          usageHistory: []
        }
      ],
      loading: false,
      error: null,

      addMaterial: (materialData) => {
        const newMaterial: UserMaterial = {
          ...materialData,
          id: Date.now().toString(),
          lastUpdated: new Date().toISOString().split('T')[0],
          usageHistory: []
        }

        set((state) => ({
          materials: [...state.materials, newMaterial]
        }))
        
        // Auto-save to database
        get().saveToDatabase(newMaterial).catch(error => {
          console.error('Failed to save material to database:', error);
        });
      },

      updateMaterial: (id, updates) => {
        let updatedMaterial: UserMaterial | null = null;
        
        set((state) => {
          const materials = state.materials.map((material) => {
            if (material.id === id) {
              updatedMaterial = { ...material, ...updates, lastUpdated: new Date().toISOString().split('T')[0] };
              return updatedMaterial;
            }
            return material;
          });
          return { materials };
        });
        
        // Auto-save to database
        if (updatedMaterial) {
          get().saveToDatabase(updatedMaterial).catch(error => {
            console.error('Failed to update material in database:', error);
          });
        }
      },

      deleteMaterial: (id) => {
        set((state) => ({
          materials: state.materials.filter((material) => material.id !== id)
        }));
        
        // Auto-delete from database
        get().deleteFromDatabase(id).catch(error => {
          console.error('Failed to delete material from database:', error);
        });
      },

      getMaterial: (id) => {
        return get().materials.find((material) => material.id === id)
      },

      getMaterialsForCalculator: (materialType) => {
        const { materials, convertUserMaterialToOption } = get()
        
        let filteredMaterials = materials.filter(m => m.inStock && m.currentStock > 0)
        
        if (materialType) {
          filteredMaterials = filteredMaterials.filter(m => m.materialType === materialType)
        }
        
        return filteredMaterials.map(convertUserMaterialToOption)
      },

      updateInventoryFromUsage: (request) => {
        const { updateMaterial, addUsageHistory } = get()
        const material = get().getMaterial(request.materialId)
        
        if (material) {
          const newStock = Math.max(0, material.currentStock - request.quantityUsed)
          updateMaterial(request.materialId, { currentStock: newStock })
          
          addUsageHistory(request.materialId, {
            projectId: request.projectId,
            projectName: request.projectName,
            quantityUsed: request.quantityUsed,
            dateUsed: new Date().toISOString(),
            costAtTime: material.costPerUnit
          })
        }
      },

      addUsageHistory: (materialId, usage) => {
        const newUsage: MaterialUsage = {
          ...usage,
          id: Date.now().toString()
        }

        set((state) => ({
          materials: state.materials.map((material) =>
            material.id === materialId
              ? {
                  ...material,
                  usageHistory: [...(material.usageHistory || []), newUsage]
                }
              : material
          )
        }))
      },

      getUnitMapping: (userUnit) => {
        return UNIT_MAPPING[userUnit] || 'custom'
      },

      convertUserMaterialToOption: (material) => {
        const { getUnitMapping } = get()
        
        return {
          id: material.id,
          name: material.name,
          costPerUnit: material.costPerUnit,
          unit: material.unit,
          calculatorUnit: material.calculatorUnit || getUnitMapping(material.unit),
          currentStock: material.currentStock,
          materialType: material.materialType
        }
      },

      checkLowStock: () => {
        return get().materials.filter(
          (material) => material.inStock && material.currentStock <= material.minStock
        )
      },

      getTotalValue: () => {
        return get().materials.reduce(
          (total, material) => total + (material.costPerUnit * material.currentStock),
          0
        )
      },

      searchMaterials: (query) => {
        const lowerQuery = query.toLowerCase()
        return get().materials.filter(
          (material) =>
            material.name.toLowerCase().includes(lowerQuery) ||
            material.description?.toLowerCase().includes(lowerQuery) ||
            material.category.toLowerCase().includes(lowerQuery)
        )
      },

      filterByCategory: (category) => {
        return get().materials.filter((material) => material.category === category)
      },

      filterByType: (materialType) => {
        return get().materials.filter((material) => material.materialType === materialType)
      },

      // Database operations
      saveToDatabase: async (material: UserMaterial) => {
        set({ loading: true, error: null });
        
        try {
          await saveMaterial(material);
          set({ loading: false });
        } catch (error) {
          const errorMessage = error instanceof DatabaseError && error.message.includes('not authenticated') 
            ? 'Material saved locally only (sign in to sync across devices)'
            : 'Failed to save material to cloud';
          
          set({ loading: false, error: errorMessage });
          
          // Don't throw error for offline usage
          if (!(error instanceof DatabaseError && error.message.includes('not authenticated'))) {
            console.error('Failed to save material:', error);
          }
        }
      },

      loadFromDatabase: async () => {
        set({ loading: true, error: null });
        
        try {
          const cloudMaterials = await loadAllMaterials();
          if (cloudMaterials.length > 0) {
            set({ materials: cloudMaterials, loading: false });
          } else {
            // No cloud data found, keep local data
            set({ loading: false });
          }
        } catch (error) {
          set({ loading: false });
          
          if (error instanceof DatabaseError && error.message.includes('not authenticated')) {
            // User not authenticated, use local data
            console.log('User not authenticated, using local material data only');
          } else {
            const errorMessage = 'Failed to load materials from cloud, using local data';
            set({ error: errorMessage });
            console.error('Failed to load materials:', error);
          }
        }
      },

      deleteFromDatabase: async (materialId: string) => {
        try {
          await deleteMaterial(materialId);
        } catch (error) {
          if (!(error instanceof DatabaseError && error.message.includes('not authenticated'))) {
            console.error('Failed to delete material from cloud:', error);
            set({ error: 'Failed to delete material from cloud' });
          }
        }
      },

      setLoading: (loading: boolean) => set({ loading }),
      
      setError: (error: string | null) => set({ error }),
    }),
    {
      name: 'user-materials-storage',
      partialize: (state) => ({ materials: state.materials })
    }
  )
)