'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Material, UnitType, MaterialCategory } from '@/types/pricing';
import { usePricingStore } from '@/store/pricing-store';
import { useUserMaterialsStore } from '@/store/user-materials-store';
import { useShopStore } from '@/store/shop-store';
import { useAuth } from '@/hooks/useAuth';
import { getCurrencySymbol, formatNumberForDisplay, parseFormattedNumber } from '@/lib/currency-utils';
import { getGroupedUnits, getCategoryDisplayName } from '@/lib/unit-system';
import InventoryModal from './InventoryModal';
import Link from 'next/link';

const createMaterialSchema = () => z.object({
  name: z.string().min(1, 'Material name is required'),
  category: z.enum(['main', 'packaging', 'decorations']),
  costType: z.enum(['per-unit', 'total-cost']),
  unitCost: z.number().optional(),
  totalCost: z.number().optional(),
  quantity: z.number().min(0.01, 'Quantity must be greater than 0'),
  unit: z.string().min(1, 'Unit is required'),
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

type MaterialFormData = z.infer<ReturnType<typeof createMaterialSchema>>;

interface EnhancedMaterialFormProps {
  material?: Material;
  onClose: () => void;
}


export default function EnhancedMaterialForm({ material, onClose }: EnhancedMaterialFormProps) {
  const { user } = useAuth();
  const { addMaterial, updateMaterial, currentProject } = usePricingStore();
  const { addMaterial: addUserMaterial } = useUserMaterialsStore();
  const { shopData } = useShopStore();
  
  // const [costType, setCostType] = useState<'per-unit' | 'total-cost'>('per-unit');
  const [savedQuantities, setSavedQuantities] = useState({
    'per-unit': material?.costType === 'per-unit' ? (material?.quantity || currentProject.salePrice.unitsCount) : currentProject.salePrice.unitsCount,
    'total-cost': material?.costType === 'total-cost' ? (material?.quantity || 1) : 1
  });
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [pendingMaterial, setPendingMaterial] = useState<MaterialFormData | null>(null);
  const [addToMyMaterials, setAddToMyMaterials] = useState(false);

  const materialSchema = createMaterialSchema();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<MaterialFormData>({
    resolver: zodResolver(materialSchema),
    defaultValues: {
      category: material?.category || 'main',
      costType: 'per-unit',
      quantity: material?.quantity || (material ? 1 : currentProject.salePrice.unitsCount),
      unit: 'pieces',
      wastePercentage: 0,
      ...material,
    },
  });

  const watchedCostType = watch('costType');
  const watchedUnit = watch('unit');

  // Get simplified unit options
  const getSimplifiedUnits = () => {
    return [
      { value: 'pieces', label: 'Pieces' },
      { value: 'grams', label: 'Grams' },
      { value: 'kilograms', label: 'Kilograms' },
      { value: 'meters', label: 'Meters' },
      { value: 'centimeters', label: 'Centimeters' },
      { value: 'liters', label: 'Liters' },
      { value: 'custom', label: 'Custom' }
    ];
  };

  const simplifiedUnits = getSimplifiedUnits();

  // No longer need material selection logic

  const handleInventorySubmission = (inventoryQuantity: number) => {
    if (pendingMaterial) {
      // Add material to user's inventory
      addUserMaterial({
        name: pendingMaterial.name,
        category: 'Main Materials',
        materialType: pendingMaterial.category as MaterialCategory,
        supplier: '',
        costPerUnit: pendingMaterial.unitCost || 0,
        unit: getUnitDisplayName(pendingMaterial.unit as UnitType),
        calculatorUnit: pendingMaterial.unit as UnitType,
        description: pendingMaterial.description || '',
        inStock: true,
        minStock: Math.max(1, Math.floor(inventoryQuantity * 0.1)), // 10% of initial stock as minimum
        currentStock: inventoryQuantity,
        wastePercentage: pendingMaterial.wastePercentage || 0
      });

      // Add material to calculator
      const materialData: Omit<Material, 'id'> = {
        name: pendingMaterial.name,
        category: pendingMaterial.category as MaterialCategory,
        costType: pendingMaterial.costType,
        unitCost: pendingMaterial.unitCost,
        totalCost: pendingMaterial.totalCost,
        quantity: pendingMaterial.quantity,
        unit: pendingMaterial.unit as UnitType,
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
      'sheets': 'sheet',
      'grams': 'gram',
      'kilograms': 'kilogram',
      'ounces': 'ounce',
      'pounds': 'pound',
      'millimeters': 'millimeter',
      'centimeters': 'centimeter',
      'meters': 'meter',
      'linear meters': 'linear meter',
      'inches': 'inch',
      'feet': 'foot',
      'yards': 'yard',
      'linear feet': 'linear foot',
      'milliliters': 'milliliter',
      'liters': 'liter',
      'cubic meters': 'cubic meter',
      'fluid ounces': 'fluid ounce',
      'pints': 'pint',
      'quarts': 'quart',
      'gallons': 'gallon',
      'cubic feet': 'cubic foot',
      'square meters': 'sq meter',
      'square feet': 'sq foot',
      'custom': 'custom'
    };
    return unitMap[unit] || unit;
  };

  const onSubmit = (data: MaterialFormData, shouldClose: boolean = false) => {
    const materialData: Omit<Material, 'id'> = {
      name: data.name,
      category: data.category as MaterialCategory,
      costType: data.costType,
      unitCost: data.unitCost,
      totalCost: data.totalCost,
      quantity: data.quantity,
      unit: data.unit as UnitType,
      customUnit: data.customUnit,
      description: data.description,
      wastePercentage: data.wastePercentage,
    };

    // If user wants to add to inventory, show inventory modal
    if (user && addToMyMaterials && !material) {
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
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
        <div className="bg-white rounded-lg p-4 w-full max-w-2xl max-h-[95vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-bold">
              {material ? 'Edit Material' : 'Add Material'}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none"
            >
              ×
            </button>
          </div>
          
          <form onSubmit={handleSubmit((data) => onSubmit(data, true))} className="space-y-3">


            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Material Name *</label>
                <input
                  {...register('name')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Oak Wood, Steel Plate, PLA Filament"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Material Type *</label>
                <select
                  {...register('category')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="main">Main Materials</option>
                  <option value="packaging">Packaging</option>
                  <option value="decorations">Decorations</option>
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                )}
              </div>
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

            {watchedCostType === 'per-unit' ? (
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Quantity</label>
                  <input
                    {...register('quantity', { 
                      valueAsNumber: true,
                      setValueAs: (value) => {
                        const parsed = parseFormattedNumber(value);
                        return parsed !== undefined ? parsed : 0;
                      }
                    })}
                    type="text"
                    value={formatNumberForDisplay(watch('quantity'))}
                    onChange={(e) => {
                      const numValue = parseFormattedNumber(e.target.value);
                      setValue('quantity', numValue || 0);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="1"
                  />
                  {errors.quantity && (
                    <p className="text-red-500 text-sm mt-1">{errors.quantity.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Unit</label>
                  <select
                    {...register('unit')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    {simplifiedUnits.map((unit) => (
                      <option key={unit.value} value={unit.value}>
                        {unit.label}
                      </option>
                    ))}
                  </select>
                  {errors.unit && (
                    <p className="text-red-500 text-sm mt-1">{errors.unit.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Cost per Unit *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">{getCurrencySymbol(currentProject.currency)}</span>
                    <input
                      {...register('unitCost', { 
                        valueAsNumber: true,
                        setValueAs: (value) => {
                          const parsed = parseFormattedNumber(value);
                          return parsed !== undefined ? parsed : 0;
                        }
                      })}
                      type="number"
                      step="0.01"
                      min="0"
                      value={watch('unitCost') ? formatNumberForDisplay(watch('unitCost')) : ''}
                      onChange={(e) => {
                        const numValue = parseFormattedNumber(e.target.value);
                        setValue('unitCost', numValue);
                      }}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder="0"
                    />
                  </div>
                  {errors.unitCost && (
                    <p className="text-red-500 text-sm mt-1">{errors.unitCost.message}</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Quantity</label>
                  <input
                    {...register('quantity', { 
                      valueAsNumber: true,
                      setValueAs: (value) => {
                        const parsed = parseFormattedNumber(value);
                        return parsed !== undefined ? parsed : 0;
                      }
                    })}
                    type="text"
                    value={formatNumberForDisplay(watch('quantity'))}
                    onChange={(e) => {
                      const numValue = parseFormattedNumber(e.target.value);
                      setValue('quantity', numValue || 0);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="1"
                  />
                  {errors.quantity && (
                    <p className="text-red-500 text-sm mt-1">{errors.quantity.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Unit</label>
                  <select
                    {...register('unit')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    {simplifiedUnits.map((unit) => (
                      <option key={unit.value} value={unit.value}>
                        {unit.label}
                      </option>
                    ))}
                  </select>
                  {errors.unit && (
                    <p className="text-red-500 text-sm mt-1">{errors.unit.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Total Cost</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">{getCurrencySymbol(currentProject.currency)}</span>
                    <input
                      {...register('totalCost', { 
                        valueAsNumber: true,
                        setValueAs: (value) => {
                          const parsed = parseFormattedNumber(value);
                          return parsed !== undefined ? parsed : 0;
                        }
                      })}
                      type="number"
                      step="0.01"
                      min="0"
                      value={watch('totalCost') ? formatNumberForDisplay(watch('totalCost')) : ''}
                      onChange={(e) => {
                        const numValue = parseFormattedNumber(e.target.value);
                        setValue('totalCost', numValue);
                      }}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder="0.00"
                    />
                  </div>
                  {errors.totalCost && (
                    <p className="text-red-500 text-sm mt-1">{errors.totalCost.message}</p>
                  )}
                </div>
              </div>
            )}

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

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Comments (Optional)</label>
                <input
                  {...register('description')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Additional notes about this material..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Waste %</label>
                <div className="flex items-center">
                  <input
                    {...register('wastePercentage', { valueAsNumber: true })}
                    type="number"
                    step="1"
                    min="0"
                    max="100"
                    className="w-16 px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                  <span className="text-sm text-gray-500 ml-1">%</span>
                </div>
              </div>
            </div>

            {/* Add to My Materials Checkbox */}
            {!material && user && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={addToMyMaterials}
                    onChange={(e) => setAddToMyMaterials(e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-sm text-gray-700">
                    Add to My Materials
                  </span>
                </label>
                <p className="text-xs text-gray-500 mt-1 ml-6">
                  Save this material configuration to your dashboard for future projects
                </p>
              </div>
            )}

            <div className="flex justify-between items-center pt-3">
              {/* Sign-up prompt for guest users */}
              {!material && !user ? (
                <div className="flex-1 mr-4">
                  <div className="p-2 bg-green-50 rounded border border-green-200 text-xs">
                    <div className="flex items-center space-x-1 text-green-800">
                      <svg className="w-3 h-3 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium">Import from stock?</span>
                      <Link 
                        href="/auth/signup" 
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