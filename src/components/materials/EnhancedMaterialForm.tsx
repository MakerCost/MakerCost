'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Material, UnitType, MaterialCategory } from '@/types/pricing';
import { MaterialOption } from '@/types/user-materials';
import { usePricingStore } from '@/store/pricing-store';
import { useUserMaterialsStore } from '@/store/user-materials-store';
import { useAuth } from '@/hooks/useAuth';
import InventoryModal from './InventoryModal';

const materialSchema = z.object({
  selectedMaterialId: z.string().optional(),
  name: z.string().min(1, 'Material name is required'),
  costType: z.enum(['per-unit', 'total-cost']),
  unitCost: z.number().optional(),
  totalCost: z.number().optional(),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  unit: z.enum(['pieces', 'grams', 'kilograms', 'sheets', 'meters', 'centimeters', 'milliliters', 'liters', 'square meters', 'linear meters', 'custom']),
  customUnit: z.string().optional(),
  description: z.string().optional(),
  wastePercentage: z.number().optional(),
}).refine((data) => {
  if (data.costType === 'per-unit') {
    return data.unitCost !== undefined && data.unitCost > 0;
  }
  if (data.costType === 'total-cost') {
    return data.totalCost !== undefined && data.totalCost > 0;
  }
  return false;
}, {
  message: 'Cost value is required based on cost type',
  path: ['unitCost'],
});

type MaterialFormData = z.infer<typeof materialSchema>;

interface EnhancedMaterialFormProps {
  material?: Material;
  onClose: () => void;
}

const unitOptions = [
  { value: 'pieces', label: 'Pieces' },
  { value: 'grams', label: 'Grams' },
  { value: 'kilograms', label: 'Kilograms' },
  { value: 'sheets', label: 'Sheets' },
  { value: 'meters', label: 'Meters' },
  { value: 'centimeters', label: 'Centimeters' },
  { value: 'milliliters', label: 'Milliliters' },
  { value: 'liters', label: 'Liters' },
  { value: 'square meters', label: 'Square Meters' },
  { value: 'linear meters', label: 'Linear Meters' },
  { value: 'custom', label: 'Custom' },
];

export default function EnhancedMaterialForm({ material, onClose }: EnhancedMaterialFormProps) {
  const { user } = useAuth();
  const { addMaterial, updateMaterial, currentProject } = usePricingStore();
  const { getMaterialsForCalculator, addMaterial: addUserMaterial } = useUserMaterialsStore();
  
  // const [costType, setCostType] = useState<'per-unit' | 'total-cost'>('per-unit');
  const [savedQuantities, setSavedQuantities] = useState({ 'per-unit': 1, 'total-cost': 1 });
  const [availableMaterials, setAvailableMaterials] = useState<MaterialOption[]>([]);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>('new');
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [pendingMaterial, setPendingMaterial] = useState<MaterialFormData | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<MaterialFormData>({
    resolver: zodResolver(materialSchema),
    defaultValues: {
      selectedMaterialId: 'new',
      costType: 'per-unit',
      quantity: 1,
      unit: 'pieces',
      wastePercentage: 0,
      ...material,
    },
  });

  const watchedCostType = watch('costType');
  const watchedUnit = watch('unit');

  // Load available materials
  useEffect(() => {
    if (user) {
      const materials = getMaterialsForCalculator('main' as MaterialCategory);
      setAvailableMaterials(materials);
    }
  }, [user, getMaterialsForCalculator]);

  // Handle material selection
  const handleMaterialSelection = (materialId: string) => {
    setSelectedMaterialId(materialId);
    setValue('selectedMaterialId', materialId);
    
    if (materialId === 'new') {
      // Reset to default values for new material
      setValue('name', '');
      setValue('unitCost', undefined);
      setValue('totalCost', undefined);
      setValue('unit', 'pieces');
      setValue('description', '');
      setValue('wastePercentage', 0);
    } else {
      // Populate with selected material data
      const selectedMaterial = availableMaterials.find(m => m.id === materialId);
      if (selectedMaterial) {
        setValue('name', selectedMaterial.name);
        setValue('unitCost', selectedMaterial.costPerUnit);
        setValue('unit', selectedMaterial.calculatorUnit);
      }
    }
  };

  const handleInventorySubmission = (inventoryQuantity: number) => {
    if (pendingMaterial) {
      // Add material to user's inventory
      addUserMaterial({
        name: pendingMaterial.name,
        category: 'Main Materials',
        materialType: 'main' as MaterialCategory,
        supplier: '',
        costPerUnit: pendingMaterial.unitCost || 0,
        unit: getUnitDisplayName(pendingMaterial.unit),
        calculatorUnit: pendingMaterial.unit,
        description: pendingMaterial.description || '',
        inStock: true,
        minStock: Math.max(1, Math.floor(inventoryQuantity * 0.1)), // 10% of initial stock as minimum
        currentStock: inventoryQuantity,
        wastePercentage: pendingMaterial.wastePercentage || 0
      });

      // Add material to calculator
      const materialData: Omit<Material, 'id'> = {
        name: pendingMaterial.name,
        category: 'main' as MaterialCategory,
        costType: pendingMaterial.costType,
        unitCost: pendingMaterial.unitCost,
        totalCost: pendingMaterial.totalCost,
        quantity: pendingMaterial.quantity,
        unit: pendingMaterial.unit,
        customUnit: pendingMaterial.customUnit,
        description: pendingMaterial.description,
        wastePercentage: pendingMaterial.wastePercentage,
      };

      if (material) {
        updateMaterial(material.id, materialData);
      } else {
        addMaterial(materialData);
      }
    }
    
    setShowInventoryModal(false);
    setPendingMaterial(null);
    onClose();
  };


  const getUnitDisplayName = (unit: UnitType): string => {
    const unitMap: Record<UnitType, string> = {
      'pieces': 'piece',
      'grams': 'gram',
      'kilograms': 'kilogram',
      'sheets': 'sheet',
      'meters': 'meter',
      'centimeters': 'centimeter',
      'milliliters': 'milliliter',
      'liters': 'liter',
      'square meters': 'sq meter',
      'linear meters': 'linear meter',
      'custom': 'custom'
    };
    return unitMap[unit] || unit;
  };

  const onSubmit = (data: MaterialFormData, shouldClose: boolean = false) => {
    const materialData: Omit<Material, 'id'> = {
      name: data.name,
      category: 'main' as MaterialCategory,
      costType: data.costType,
      unitCost: data.unitCost,
      totalCost: data.totalCost,
      quantity: data.quantity,
      unit: data.unit,
      customUnit: data.customUnit,
      description: data.description,
      wastePercentage: data.wastePercentage,
    };

    // If this is a new material and user is authenticated, show inventory option
    if (selectedMaterialId === 'new' && user) {
      setPendingMaterial(data);
      setShowInventoryModal(true);
      return;
    }

    if (material) {
      updateMaterial(material.id, materialData);
      onClose();
    } else {
      addMaterial(materialData);
      if (shouldClose) {
        onClose();
      } else {
        // Reset form for new material but keep cost type
        const currentCostType = data.costType;
        setValue('name', '');
        setValue('unitCost', undefined);
        setValue('totalCost', undefined);
        setValue('quantity', currentCostType === 'per-unit' ? currentProject.salePrice.unitsCount : 1);
        setValue('description', '');
          setSelectedMaterialId('new');
      }
    }
  };

  const handleCostTypeChange = (newCostType: 'per-unit' | 'total-cost') => {
    const currentCostType = watchedCostType;
    const currentQuantity = watch('quantity');
    
    setSavedQuantities(prev => ({
      ...prev,
      [currentCostType]: currentQuantity || prev[currentCostType]
    }));
    
    // setCostType(newCostType); // Cost type is managed by form state
    setValue('costType', newCostType);
    setValue('unitCost', undefined);
    setValue('totalCost', undefined);
    setValue('quantity', savedQuantities[newCostType]);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">
            {material ? 'Edit Material' : 'Add Material'}
          </h2>
          
          <form onSubmit={handleSubmit((data) => onSubmit(data, true))} className="space-y-4">

            {/* Material Selection - Only show for authenticated users and new materials */}
            {user && !material && (
              <div>
                <label className="block text-sm font-medium mb-1">Choose Material</label>
                <select
                  value={selectedMaterialId}
                  onChange={(e) => handleMaterialSelection(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="new">New Material</option>
                  {availableMaterials.length > 0 && (
                    <optgroup label="From My Inventory">
                      {availableMaterials.map((mat) => (
                        <option key={mat.id} value={mat.id}>
                          {mat.name} - ${mat.costPerUnit}/{mat.unit} ({mat.currentStock} in stock)
                        </option>
                      ))}
                    </optgroup>
                  )}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">Material Name</label>
              <input
                {...register('name')}
                type="text"
                disabled={selectedMaterialId !== 'new'}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  selectedMaterialId !== 'new' ? 'bg-gray-50 text-gray-600' : ''
                }`}
                placeholder="e.g., Acrylic Sheet, PLA Filament"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>


            <div>
              <label className="block text-sm font-medium mb-2">Cost Type</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="per-unit"
                    checked={watchedCostType === 'per-unit'}
                    onChange={() => handleCostTypeChange('per-unit')}
                    className="mr-2 cursor-pointer"
                  />
                  Per Unit
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="total-cost"
                    checked={watchedCostType === 'total-cost'}
                    onChange={() => handleCostTypeChange('total-cost')}
                    className="mr-2 cursor-pointer"
                  />
                  Total Cost
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Quantity</label>
                <input
                  {...register('quantity', { valueAsNumber: true })}
                  type="number"
                  step="1"
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.quantity && (
                  <p className="text-red-500 text-sm mt-1">{errors.quantity.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Unit</label>
                <select
                  {...register('unit')}
                  disabled={selectedMaterialId !== 'new'}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${
                    selectedMaterialId !== 'new' ? 'bg-gray-50 text-gray-600' : ''
                  }`}
                >
                  {unitOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.unit && (
                  <p className="text-red-500 text-sm mt-1">{errors.unit.message}</p>
                )}
              </div>
            </div>

            {watchedUnit === 'custom' && (
              <div>
                <label className="block text-sm font-medium mb-1">Custom Unit Name</label>
                <input
                  {...register('customUnit')}
                  type="text"
                  className="max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., bottles, rolls"
                />
              </div>
            )}

            {watchedCostType === 'per-unit' ? (
              <div>
                <label className="block text-sm font-medium mb-1">Cost per Unit ($)</label>
                <input
                  {...register('unitCost', { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  min="0"
                  disabled={selectedMaterialId !== 'new'}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    selectedMaterialId !== 'new' ? 'bg-gray-50 text-gray-600' : ''
                  }`}
                  placeholder="0.00"
                />
                {errors.unitCost && (
                  <p className="text-red-500 text-sm mt-1">{errors.unitCost.message}</p>
                )}
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium mb-1">Total Cost ($)</label>
                <input
                  {...register('totalCost', { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
                {errors.totalCost && (
                  <p className="text-red-500 text-sm mt-1">{errors.totalCost.message}</p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">Description (Optional)</label>
              <textarea
                {...register('description')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
                placeholder="Brief description..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Waste Percentage (Optional)</label>
              <input
                {...register('wastePercentage', { valueAsNumber: true })}
                type="number"
                step="0.1"
                min="0"
                max="100"
                className="max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
              <span className="text-sm text-gray-500 ml-2">%</span>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <div className="flex space-x-2">
                {!material && (
                  <button
                    type="button"
                    onClick={handleSubmit((data) => onSubmit(data, false))}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
                  >
                    Add Material
                  </button>
                )}
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer"
                >
                  {material ? 'Update' : 'Add & Close'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Inventory Modal */}
      {showInventoryModal && pendingMaterial && (
        <InventoryModal
          materialName={pendingMaterial.name}
          onSubmit={handleInventorySubmission}
          onClose={() => {
            setShowInventoryModal(false);
            setPendingMaterial(null);
          }}
        />
      )}
    </>
  );
}