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

  // Load available materials from user's inventory
  useEffect(() => {
    if (user) {
      const userMaterials = getMaterialsForCalculator();
      setAvailableMaterials(userMaterials);
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
  const convertUserMaterial = (userMaterial: MaterialOption): Omit<Material, 'id'> => {
    return {
      name: userMaterial.name,
      category: 'main' as MaterialCategory,
      costType: 'per-unit',
      unitCost: userMaterial.costPerUnit,
      totalCost: undefined,
      quantity: currentProject.salePrice.unitsCount || 1,
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
    
    const projectMaterial = convertUserMaterial(userMaterial);
    addMaterialToProject(projectMaterial);
    addToast(`"${userMaterial.name}" added to project`, 'success');
    setShowImportModal(false);
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
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Materials</h2>
        <div className="flex items-center gap-3">
          {materials.length > 0 && (
            <>
              <button
                onClick={() => setShowAddMaterialModal(true)}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
              >
                Add New Material
              </button>
              {availableMaterials.length > 0 && (
                <button
                  onClick={() => setShowImportModal(true)}
                  className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer"
                >
                  Choose from My Materials
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {materials.length === 0 ? (
        <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-sm mb-4">Add materials to calculate accurate product costs.</p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
            <button
              onClick={() => setShowAddMaterialModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
            >
              Add New Material
            </button>
            {availableMaterials.length > 0 && (
              <button
                onClick={() => setShowImportModal(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer"
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
                    <span className="text-sm font-medium text-green-600">
                      {formatCurrency(categoryTotal, currency)}
                    </span>
                  </div>
                  
                  <div className="space-y-2 pl-4 border-l-2 border-gray-100">
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
            
            <div className="border-t pt-4 mt-6">
              <div className="flex justify-between items-center font-medium text-lg">
                <span>Total Material Costs:</span>
                <span className="text-green-600">
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
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-gray-900">
                    Import from My Materials
                  </h2>
                  <Link 
                    href="/account/materials" 
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    My Materials
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
                {availableMaterials.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No materials found in your inventory.</p>
                    <p className="text-sm mt-2">Add materials in the Dashboard → My Materials section first.</p>
                  </div>
                ) : (
                  <>
                    <p className="text-gray-600 mb-4">
                      Select materials from your inventory to import into this project.
                    </p>
                    {availableMaterials.map((material) => {
                      const isAlreadyInProject = materials.some(projectMaterial => 
                        projectMaterial.name.toLowerCase().trim() === material.name.toLowerCase().trim()
                      );
                      
                      return (
                        <div key={material.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900">{material.name}</h3>
                              <div className="text-sm text-gray-600 mt-1">
                                Cost: {formatCurrency(material.costPerUnit, currency)}/{material.unit} • 
                                Stock: {material.currentStock} {material.unit}
                              </div>
                              {isAlreadyInProject && (
                                <div className="text-sm text-amber-600 mt-1">Already in project</div>
                              )}
                            </div>
                            <button
                              onClick={() => handleImportMaterial(material)}
                              disabled={isAlreadyInProject}
                              className={`px-3 py-1 text-sm rounded transition-colors ${
                                isAlreadyInProject
                                  ? 'bg-amber-100 text-amber-600 cursor-not-allowed'
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
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
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
    </div>
  );
}