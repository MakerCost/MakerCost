'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Material, UnitType } from '@/types/pricing';
import { usePricingStore } from '@/store/pricing-store';
import { useShopStore } from '@/store/shop-store';
import { getGroupedUnits, getCategoryDisplayName } from '@/lib/unit-system';
import { trackFormBehavior, trackCalculatorWorkflow } from '@/lib/posthog-product-analytics';

const materialSchema = z.object({
  name: z.string().min(1, 'Material name is required'),
  category: z.enum(['main', 'packaging', 'decorations']),
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

interface MaterialFormProps {
  material?: Material;
  onClose: () => void;
}


export default function MaterialForm({ material, onClose }: MaterialFormProps) {
  const { addMaterial, updateMaterial, currentProject } = usePricingStore();
  const { shopData } = useShopStore();
  const [, setCostType] = useState<'per-unit' | 'total-cost'>(
    material?.costType || 'per-unit'
  );

  // Track form start
  useEffect(() => {
    trackFormBehavior({
      form_name: 'material_form',
      action: 'start',
      total_fields: 7, // name, category, costType, cost, quantity, unit, description
    });
  }, []);
  const [savedQuantities, setSavedQuantities] = useState<{
    'per-unit': number;
    'total-cost': number;
  }>({
    'per-unit': material?.costType === 'per-unit' ? (material?.quantity || currentProject.salePrice.unitsCount) : currentProject.salePrice.unitsCount,
    'total-cost': material?.costType === 'total-cost' ? (material?.quantity || 1) : 1
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<MaterialFormData>({
    resolver: zodResolver(materialSchema),
    defaultValues: {
      name: material?.name || '',
      category: material?.category || 'main',
      costType: material?.costType || 'per-unit',
      unitCost: material?.unitCost || undefined,
      totalCost: material?.totalCost || undefined,
      quantity: material?.quantity || (material ? 1 : currentProject.salePrice.unitsCount),
      unit: (material?.unit as UnitType) || 'pieces',
      customUnit: material?.customUnit || '',
      description: material?.description || '',
      wastePercentage: material?.wastePercentage || 0,
    },
  });

  const watchedCostType = watch('costType');
  const watchedUnit = watch('unit');
  const watchedCategory = watch('category');

  // Get dynamic unit options based on shop's unit system
  const groupedUnits = getGroupedUnits(shopData.unitSystem);

  const onSubmit = (data: MaterialFormData, shouldClose: boolean = true) => {
    const materialData = {
      ...data,
      unitCost: data.costType === 'per-unit' ? data.unitCost : undefined,
      totalCost: data.costType === 'total-cost' ? data.totalCost : undefined,
    };

    // Track form completion
    trackFormBehavior({
      form_name: 'material_form',
      action: 'submit',
      fields_completed: 7,
      total_fields: 7,
    });

    // Track calculator interaction
    trackCalculatorWorkflow.addMaterial({
      name: data.name,
      category: data.category,
      cost_type: data.costType,
    });

    if (material) {
      updateMaterial(material.id, materialData);
      onClose(); // Always close for edit mode
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

  const handleAddMaterial = (data: MaterialFormData) => {
    onSubmit(data, false); // Add but don't close
  };

  const handleAddAndClose = (data: MaterialFormData) => {
    onSubmit(data, true); // Add and close
  };

  const handleCostTypeChange = (newCostType: 'per-unit' | 'total-cost') => {
    const currentCostType = watchedCostType;
    const currentQuantity = watch('quantity');
    
    // Save the current quantity for the current cost type
    setSavedQuantities(prev => ({
      ...prev,
      [currentCostType]: currentQuantity || prev[currentCostType]
    }));
    
    setCostType(newCostType);
    setValue('costType', newCostType);
    setValue('unitCost', undefined);
    setValue('totalCost', undefined);
    
    // Restore the saved quantity for the new cost type
    setValue('quantity', savedQuantities[newCostType]);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {material ? 'Edit Material' : 'Add Material'}
        </h2>
        
        <form onSubmit={handleSubmit((data) => onSubmit(data, true))} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Material Name</label>
            <input
              {...register('name')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Acrylic Sheet, PLA Filament"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                {Object.entries(groupedUnits).map(([category, units]) => (
                  <optgroup key={category} label={getCategoryDisplayName(category)}>
                    {units.map((unit) => (
                      <option key={unit.value} value={unit.value}>
                        {unit.label}
                      </option>
                    ))}
                  </optgroup>
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
              {errors.customUnit && (
                <p className="text-red-500 text-sm mt-1">{errors.customUnit.message}</p>
              )}
            </div>
          )}

          {watchedCostType === 'per-unit' && (
            <div>
              <label className="block text-sm font-medium mb-1">Cost Per Unit ({currentProject.currency})</label>
              <input
                {...register('unitCost', { valueAsNumber: true })}
                type="number"
                step="0.01"
                className="max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.unitCost && (
                <p className="text-red-500 text-sm mt-1">{errors.unitCost.message}</p>
              )}
            </div>
          )}

          {watchedCostType === 'total-cost' && (
            <div>
              <label className="block text-sm font-medium mb-1">Total Cost ({currentProject.currency})</label>
              <input
                {...register('totalCost', { valueAsNumber: true })}
                type="number"
                step="0.01"
                className="max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              placeholder="Additional notes about this material"
            />
          </div>

          {watchedCategory === 'main' && (
            <div>
              <label className="block text-sm font-medium mb-1">Waste Percentage (Optional)</label>
              <select
                {...register('wastePercentage', { valueAsNumber: true })}
                className="max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value={0}>No waste (0%)</option>
                <option value={1}>1%</option>
                <option value={2}>2%</option>
                <option value={3}>3%</option>
                <option value={4}>4%</option>
                <option value={5}>5%</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Account for material waste during production</p>
            </div>
          )}

          {material ? (
            // Edit mode - show Update and Cancel buttons
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
              >
                Update Material
              </button>
            </div>
          ) : (
            // Add mode - show three distinct buttons
            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleSubmit(handleAddMaterial)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer"
                >
                  Add Material
                </button>
                <button
                  type="button"
                  onClick={handleSubmit(handleAddAndClose)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
                >
                  Add and Close
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}