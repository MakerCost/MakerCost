'use client';

import { useState } from 'react';
import { Material, MaterialCategory } from '@/types/pricing';
import { usePricingStore } from '@/store/pricing-store';
import { useShopStore } from '@/store/shop-store';
import { calculateMaterialCost, calculateMaterialCostByCategory, formatCurrency } from '@/lib/calculations';
import { trackFeatureUsage } from '@/lib/analytics';
import { trackMaterialInteraction } from '@/lib/posthog-analytics';
import { formatUnitDisplay } from '@/lib/unit-system';
import EnhancedMaterialForm from './EnhancedMaterialForm';
import ConfirmModal from '@/components/ui/ConfirmModal';

export default function MaterialsList() {
  const { currentProject, removeMaterial } = usePricingStore();
  const { shopData } = useShopStore();
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState<{ id: string; name: string } | null>(null);

  const handleEdit = (material: Material) => {
    setEditingMaterial(material);
    setShowForm(true);
    
    // Track material edit interaction
    trackMaterialInteraction('edit', {
      materialType: material.name,
      materialCategory: material.category,
      cost: calculateMaterialCost(material),
    });
  };

  const handleCloseForm = () => {
    setEditingMaterial(null);
    setShowForm(false);
  };

  const handleRemove = (material: Material) => {
    setMaterialToDelete({ id: material.id, name: material.name });
  };

  const confirmRemove = () => {
    if (materialToDelete) {
      // Find the material before removing it for analytics
      const materialToRemove = currentProject.materials.find(m => m.id === materialToDelete.id);
      
      removeMaterial(materialToDelete.id);
      setMaterialToDelete(null);
      
      // Track material removal
      if (materialToRemove) {
        trackMaterialInteraction('delete', {
          materialType: materialToRemove.name,
          materialCategory: materialToRemove.category,
          cost: calculateMaterialCost(materialToRemove),
        });
        trackFeatureUsage('material_removal');
      }
    }
  };

  const cancelRemove = () => {
    setMaterialToDelete(null);
  };

  const getCategoryTitle = (category: MaterialCategory): string => {
    switch (category) {
      case 'main': return 'Main Materials';
      case 'packaging': return 'Packaging';
      case 'decorations': return 'Decorations';
      default: return 'Other';
    }
  };

  const getCategoryColor = (category: MaterialCategory): string => {
    switch (category) {
      case 'main': return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300';
      case 'packaging': return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300';
      case 'decorations': return 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300';
      default: return 'bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-300';
    }
  };

  const groupedMaterials = currentProject.materials.reduce((acc, material) => {
    const category = material.category || 'main';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(material);
    return acc;
  }, {} as Record<MaterialCategory, Material[]>);

  const categories: MaterialCategory[] = ['main', 'packaging', 'decorations'];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow dark:shadow-slate-700/10 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Materials</h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 cursor-pointer"
        >
          Add Material
        </button>
      </div>

      {currentProject.materials.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>No materials added yet.</p>
          <p className="text-sm">Click &quot;Add Material&quot; to get started.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {categories.map((category) => {
            const materials = groupedMaterials[category] || [];
            if (materials.length === 0) return null;
            
            const categoryTotal = calculateMaterialCostByCategory(currentProject.materials, category);
            
            return (
              <div key={category} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center space-x-2">
                    <span>{getCategoryTitle(category)}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(category)}`}>
                      {materials.length} item{materials.length !== 1 ? 's' : ''}
                    </span>
                  </h3>
                  <span className="text-sm font-medium text-green-600">
                    {formatCurrency(categoryTotal, currentProject.currency)}
                  </span>
                </div>
                
                <div className="space-y-2 pl-4 border-l-2 border-gray-100">
                  {materials.map((material) => (
                    <div
                      key={material.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <h4 className="font-medium">{material.name}</h4>
                          <span className="text-sm text-gray-500">
                            {material.quantity} {material.customUnit || formatUnitDisplay(material.unit)}
                          </span>
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {material.costType === 'per-unit' ? 'Per Unit' : 'Total Cost'}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-4 mt-1">
                          {material.costType === 'per-unit' ? (
                            <span className="text-sm text-gray-600">
                              {formatCurrency(material.unitCost || 0, currentProject.currency)} per {material.customUnit || formatUnitDisplay(material.unit)}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-600">
                              Total: {formatCurrency(material.totalCost || 0, currentProject.currency)}
                            </span>
                          )}
                          <span className="text-sm font-medium text-green-600">
                            Cost: {formatCurrency(calculateMaterialCost(material), currentProject.currency)}
                          </span>
                        </div>
                        
                        {material.description && (
                          <p className="text-xs text-gray-500 mt-1">{material.description}</p>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(material)}
                          className="px-2 py-1 text-xs text-blue-600 border border-blue-600 rounded hover:bg-blue-50 cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleRemove(material)}
                          className="px-2 py-1 text-xs text-red-600 border border-red-600 rounded hover:bg-red-50 cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          
          <div className="border-t pt-4 mt-6">
            <div className="flex justify-between items-center font-medium text-lg">
              <span>Total COGS:</span>
              <span className="text-green-600">
                {formatCurrency(
                  (currentProject.calculations?.cogs?.total || 0), 
                  currentProject.currency
                )}
              </span>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <EnhancedMaterialForm
          material={editingMaterial || undefined}
          onClose={handleCloseForm}
        />
      )}

      <ConfirmModal
        isOpen={!!materialToDelete}
        title="Remove Material"
        message={`Are you sure you want to remove "${materialToDelete?.name}"? This action cannot be undone.`}
        confirmText="Remove"
        cancelText="Cancel"
        onConfirm={confirmRemove}
        onCancel={cancelRemove}
        isDangerous={true}
      />
    </div>
  );
}