'use client';

import { useState, useEffect } from 'react';
import { Material, Currency, MaterialCategory } from '@/types/pricing';
import { usePricingStore } from '@/store/pricing-store';
import { useUserMaterialsStore } from '@/store/user-materials-store';
import { MaterialOption } from '@/types/user-materials';
import { useAuth } from '@/hooks/useAuth';
import MaterialCard from './MaterialCard';
import EnhancedMaterialForm from './EnhancedMaterialForm';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { formatCurrency, calculateMaterialCost, calculateMaterialCostByCategory } from '@/lib/calculations';
import { useToast } from '@/hooks/useToast';
import Link from 'next/link';

interface MaterialListProps {
  currency: Currency;
}

export default function MaterialList({ currency }: MaterialListProps) {
  const { user } = useAuth();
  const { currentProject, addMaterial: addMaterialToProject, updateMaterial, removeMaterial } = usePricingStore();
  const { getMaterialsForCalculator } = useUserMaterialsStore();
  const { addToast } = useToast();
  const materials = currentProject.materials;
  const [materialToDelete, setMaterialToDelete] = useState<{ id: string; name: string } | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showAddMaterialModal, setShowAddMaterialModal] = useState(false);
  const [showEditMaterialModal, setShowEditMaterialModal] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [availableMaterials, setAvailableMaterials] = useState<MaterialOption[]>([]);
  const [quantityPrompt, setQuantityPrompt] = useState<{ material: MaterialOption; quantity: string } | null>(null);

  // Load available materials from user's inventory
  useEffect(() => {
    if (user) {
      const userMaterials = getMaterialsForCalculator();
      setAvailableMaterials(userMaterials);
    } else {
      // Clear available materials when user signs out
      setAvailableMaterials([]);
    }
  }, [user, getMaterialsForCalculator]);

  const handleRemoveMaterial = (material: Material) => {
    setMaterialToDelete({ id: material.id, name: material.name });
  };

  const handleEditMaterial = (material: Material) => {
    setEditingMaterial(material);
    setShowEditMaterialModal(true);
  };

  const confirmRemove = () => {
    if (materialToDelete) {
      removeMaterial(materialToDelete.id);
      setMaterialToDelete(null);
    }
  };

  const cancelRemove = () => {
    setMaterialToDelete(null);
  };

  // Convert user material to project material
  const convertUserMaterial = (userMaterial: MaterialOption, quantity: number): Omit<Material, 'id'> => {
    return {
      name: userMaterial.name,
      category: 'main' as MaterialCategory,
      costType: 'per-unit',
      unitCost: userMaterial.costPerUnit,
      totalCost: undefined,
      quantity: quantity,
      unit: userMaterial.calculatorUnit,
      customUnit: userMaterial.calculatorUnit === 'custom' ? userMaterial.unit : undefined,
      description: '',
      wastePercentage: 0,
    };
  };

  const handleImportMaterial = (userMaterial: MaterialOption) => {
    // Check if material is already in the project
    const isDuplicate = materials.some(material => 
      material.name.toLowerCase().trim() === userMaterial.name.toLowerCase().trim()
    );
    
    if (isDuplicate) {
      addToast(`"${userMaterial.name}" is already in this project`, 'error');
      return;
    }
    
    // Open quantity prompt instead of adding directly
    setQuantityPrompt({ material: userMaterial, quantity: '1' });
    setShowImportModal(false);
  };

  const handleConfirmQuantity = () => {
    if (!quantityPrompt) return;
    
    const quantity = parseFloat(quantityPrompt.quantity);
    if (isNaN(quantity) || quantity <= 0) {
      addToast('Please enter a valid quantity', 'error');
      return;
    }
    
    const projectMaterial = convertUserMaterial(quantityPrompt.material, quantity);
    addMaterialToProject(projectMaterial);
    addToast(`"${quantityPrompt.material.name}" added to project with quantity ${quantity}`, 'success');
    setQuantityPrompt(null);
  };

  const handleCancelQuantity = () => {
    setQuantityPrompt(null);
  };

  // Calculate totals by category
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

  const groupedMaterials = materials.reduce((acc, material) => {
    const category = material.category || 'main';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(material);
    return acc;
  }, {} as Record<MaterialCategory, Material[]>);

  const categories: MaterialCategory[] = ['main', 'packaging', 'decorations'];

  const totalMaterialCosts = materials.reduce((total, material) => {
    return total + calculateMaterialCost(material);
  }, 0);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow dark:shadow-slate-700/10 p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Materials</h2>
          {materials.length > 0 && (
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full">
              {materials.length}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between mb-4">
        <div></div>
        <div className="flex items-center gap-3">
          {materials.length > 0 && (
            <>
              <button
                onClick={() => setShowAddMaterialModal(true)}
                className="px-3 py-1.5 text-sm font-medium bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors cursor-pointer min-h-[44px] sm:min-h-auto"
              >
                Add New Material
              </button>
              {user && availableMaterials.length > 0 && (
                <button
                  onClick={() => setShowImportModal(true)}
                  className="px-3 py-1.5 text-sm font-medium bg-green-600 dark:bg-green-500 text-white rounded-md hover:bg-green-700 dark:hover:bg-green-600 transition-colors cursor-pointer min-h-[44px] sm:min-h-auto"
                >
                  Import Materials
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {materials.length === 0 ? (
        <div className="text-center py-6 sm:py-8 text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
          <p className="text-sm mb-4">Add materials to calculate accurate product costs.</p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
            <button
              onClick={() => setShowAddMaterialModal(true)}
              className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors cursor-pointer"
            >
              Add New Material
            </button>
            {user && availableMaterials.length > 0 && (
              <button
                onClick={() => setShowImportModal(true)}
                className="px-4 py-2 bg-green-600 dark:bg-green-500 text-white rounded-md hover:bg-green-700 dark:hover:bg-green-600 transition-colors cursor-pointer"
              >
                Choose from My Materials
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {categories.map((category) => {
              const categoryMaterials = groupedMaterials[category] || [];
              if (categoryMaterials.length === 0) return null;
              
              const categoryTotal = calculateMaterialCostByCategory(materials, category);
              
              return (
                <div key={category} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center space-x-2">
                      <span>{getCategoryTitle(category)}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(category)}`}>
                        {categoryMaterials.length} item{categoryMaterials.length !== 1 ? 's' : ''}
                      </span>
                    </h3>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">
                      {formatCurrency(categoryTotal, currency)}
                    </span>
                  </div>
                  
                  <div className="space-y-2 pl-4 border-l-2 border-gray-100 dark:border-gray-700">
                    {categoryMaterials.map((material) => (
                      <MaterialCard
                        key={material.id}
                        material={material}
                        currency={currency}
                        onUpdate={(updates) => updateMaterial(material.id, updates)}
                        onRemove={() => handleRemoveMaterial(material)}
                        onEdit={() => handleEditMaterial(material)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
            
            <div className="border-t dark:border-gray-700 pt-4 mt-6">
              <div className="flex justify-between items-center font-medium text-lg text-gray-900 dark:text-white">
                <span>Total Material Costs:</span>
                <span className="text-green-600 dark:text-green-400">
                  {formatCurrency(totalMaterialCosts, currency)}
                </span>
              </div>
            </div>
          </div>
        </>
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

      {/* Import Materials Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black dark:bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setShowImportModal(false)}>
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Import from My Materials
                  </h2>
                  <Link 
                    href="/account/materials" 
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
                  >
                    My Materials
                  </Link>
                </div>
                <button
                  onClick={() => setShowImportModal(false)}
                  className="text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100 cursor-pointer"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                {availableMaterials.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <p>No materials found in your inventory.</p>
                    <p className="text-sm mt-2">Add materials in the Dashboard → My Materials section first.</p>
                  </div>
                ) : (
                  <>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Select materials from your inventory to import into this project.
                    </p>
                    {availableMaterials.map((material) => {
                      const isAlreadyInProject = materials.some(projectMaterial => 
                        projectMaterial.name.toLowerCase().trim() === material.name.toLowerCase().trim()
                      );
                      
                      return (
                        <div key={material.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900 dark:text-white">{material.name}</h3>
                              <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                Cost: {formatCurrency(material.costPerUnit, currency)}/{material.unit} • 
                                Stock: {material.currentStock} {material.unit}
                              </div>
                              {isAlreadyInProject && (
                                <div className="text-sm text-amber-600 dark:text-amber-400 mt-1">Already in project</div>
                              )}
                            </div>
                            <button
                              onClick={() => handleImportMaterial(material)}
                              disabled={isAlreadyInProject}
                              className={`px-3 py-1 text-sm rounded transition-colors ${
                                isAlreadyInProject
                                  ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 cursor-not-allowed'
                                  : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                              }`}
                            >
                              {isAlreadyInProject ? 'Already Added' : 'Import'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
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

      {/* Add New Material Modal */}
      {showAddMaterialModal && (
        <EnhancedMaterialForm
          onClose={() => setShowAddMaterialModal(false)}
        />
      )}

      {/* Edit Material Modal */}
      {showEditMaterialModal && editingMaterial && (
        <EnhancedMaterialForm
          material={editingMaterial}
          onClose={() => {
            setShowEditMaterialModal(false);
            setEditingMaterial(null);
          }}
        />
      )}

      {/* Quantity Prompt Modal */}
      {quantityPrompt && (
        <div className="fixed inset-0 bg-black dark:bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                How many units?
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Enter the quantity of <strong>{quantityPrompt.material.name}</strong> to add to your project.
              </p>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quantity ({quantityPrompt.material.unit})
                </label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={quantityPrompt.quantity}
                  onChange={(e) => setQuantityPrompt({ ...quantityPrompt, quantity: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
                  placeholder="Enter quantity"
                  autoFocus
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Cost per unit: {formatCurrency(quantityPrompt.material.costPerUnit, currency)}/{quantityPrompt.material.unit}
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleCancelQuantity}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmQuantity}
                  className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors cursor-pointer"
                >
                  Add Material
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}