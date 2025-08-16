'use client'

import { useState, useEffect } from 'react'
import { useToast } from '@/hooks/useToast'
import { useUserMaterialsStore } from '@/store/user-materials-store'
import { UserMaterial } from '@/types/user-materials'
import { MaterialCategory } from '@/types/pricing'

export default function MyMaterialsPage() {
  const { addToast } = useToast()
  const { 
    materials, 
    addMaterial, 
    updateMaterial, 
    deleteMaterial,
    checkLowStock,
    getTotalValue 
  } = useUserMaterialsStore()
  
  const [showForm, setShowForm] = useState(false)
  const [editingMaterial, setEditingMaterial] = useState<UserMaterial | null>(null)
  const [formData, setFormData] = useState<Partial<UserMaterial>>({
    name: '',
    category: 'General',
    materialType: 'main',
    supplier: '',
    costPerUnit: 0,
    unit: '',
    description: '',
    minStock: 0,
    currentStock: 0
  })

  const units = ['piece', 'board foot', 'sq ft', 'linear ft', 'yard', 'pound', 'gallon', 'gram', 'kilogram', 'meter', 'liter', 'other']
  const materialTypes: { value: MaterialCategory; label: string; description: string }[] = [
    { value: 'main', label: 'Main Material', description: 'Primary materials used in production' },
    { value: 'packaging', label: 'Packaging', description: 'Materials for packaging and shipping' },
    { value: 'decorations', label: 'Decorations', description: 'Decorative elements and finishing touches' }
  ]

  useEffect(() => {
    // Sync with store materials
  }, [materials])

  const handleInputChange = (field: keyof UserMaterial) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) || 0 : 
                  e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked :
                  e.target.value
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.costPerUnit) {
      addToast('Please fill in all required fields', 'error')
      return
    }

    const materialData = {
      ...formData,
      id: editingMaterial?.id || Date.now().toString(),
      lastUpdated: new Date().toISOString().split('T')[0],
      inStock: (formData.currentStock || 0) > 0
    } as UserMaterial

    if (editingMaterial) {
      updateMaterial(editingMaterial.id, materialData)
      addToast('Material updated successfully!', 'success')
    } else {
      addMaterial(materialData)
      addToast('Material added successfully!', 'success')
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'General',
      materialType: 'main',
      supplier: '',
      costPerUnit: 0,
      unit: '',
      description: '',
      minStock: 0,
      currentStock: 0
    })
    setEditingMaterial(null)
    setShowForm(false)
  }

  const handleEdit = (material: UserMaterial) => {
    setFormData(material)
    setEditingMaterial(material)
    setShowForm(true)
  }

  const handleDelete = (materialId: string) => {
    if (confirm('Are you sure you want to delete this material?')) {
      deleteMaterial(materialId)
      addToast('Material deleted successfully!', 'success')
    }
  }

  const getStockStatus = (material: UserMaterial) => {
    if (material.currentStock <= 0) return { status: 'Out of Stock', color: 'text-red-600' }
    if (material.currentStock <= material.minStock) return { status: 'Low Stock', color: 'text-yellow-600' }
    return { status: 'In Stock', color: 'text-green-600' }
  }

  const getMaterialTypeDisplay = (materialType: MaterialCategory) => {
    const typeInfo = materialTypes.find(t => t.value === materialType)
    return typeInfo ? typeInfo.label : materialType
  }

  const lowStockItems = checkLowStock()
  const totalInventoryValue = getTotalValue()

  return (
    <div className="p-6">
      <div className="flex justify-between items-start border-b border-gray-200 pb-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Materials</h1>
          <p className="text-gray-600 mt-1">
            Track your raw materials, costs, and inventory levels.
          </p>
          {lowStockItems.length > 0 && (
            <div className="mt-2 text-sm text-yellow-600">
              ⚠️ {lowStockItems.length} item(s) running low on stock
            </div>
          )}
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Total Inventory Value</div>
          <div className="text-xl font-bold text-green-600">${totalInventoryValue.toLocaleString()}</div>
        </div>
      </div>

      <div className="flex justify-end mb-6">
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors cursor-pointer"
        >
          Add Material
        </button>
      </div>

      {/* Materials List */}
      <div className="space-y-4 mb-8">
        {materials.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No materials yet</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding your first material.</p>
            <div className="mt-6">
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Add Your First Material
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {materials.map((material) => {
              const stockStatus = getStockStatus(material)
              return (
                <div key={material.id} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{material.name}</h3>
                      <p className="text-sm text-gray-600">{material.category}</p>
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full mt-1">
                        {getMaterialTypeDisplay(material.materialType)}
                      </span>
                      <div className={`text-sm font-medium ${stockStatus.color} mt-1`}>
                        {stockStatus.status}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(material)}
                        className="text-blue-600 hover:text-blue-800 text-sm cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(material.id)}
                        className="text-red-600 hover:text-red-800 text-sm cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Cost:</span>
                      <span className="font-medium">${material.costPerUnit.toFixed(2)}/{material.unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Stock:</span>
                      <span className="font-medium">{material.currentStock} {material.unit}s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Min Stock:</span>
                      <span className="font-medium">{material.minStock} {material.unit}s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Value:</span>
                      <span className="font-medium">${(material.costPerUnit * material.currentStock).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Supplier:</span>
                      <span className="font-medium">{material.supplier || 'N/A'}</span>
                    </div>
                    {material.description && (
                      <div className="pt-2 border-t">
                        <p className="text-gray-600 text-xs">{material.description}</p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Add/Edit Material Form */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingMaterial ? 'Edit Material' : 'Add New Material'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Material Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange('name')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Oak Wood"
                      required
                    />
                  </div>


                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Material Type *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {materialTypes.map((type) => (
                        <label key={type.value} className="flex items-start cursor-pointer">
                          <input
                            type="radio"
                            name="materialType"
                            value={type.value}
                            checked={formData.materialType === type.value}
                            onChange={handleInputChange('materialType')}
                            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{type.label}</div>
                            <div className="text-xs text-gray-500">{type.description}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cost Per Unit *
                    </label>
                    <input
                      type="number"
                      value={formData.costPerUnit}
                      onChange={handleInputChange('costPerUnit')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="45.50"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit of Measure
                    </label>
                    <select
                      value={formData.unit}
                      onChange={handleInputChange('unit')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                    >
                      <option value="">Select unit</option>
                      {units.map(unit => (
                        <option key={unit} value={unit}>{unit}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Supplier
                    </label>
                    <input
                      type="text"
                      value={formData.supplier}
                      onChange={handleInputChange('supplier')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Supplier name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Stock
                    </label>
                    <input
                      type="number"
                      value={formData.currentStock}
                      onChange={handleInputChange('currentStock')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="100"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Stock Level
                    </label>
                    <input
                      type="number"
                      value={formData.minStock}
                      onChange={handleInputChange('minStock')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="20"
                      min="0"
                    />
                  </div>

                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={handleInputChange('description')}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Additional details about this material..."
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    {editingMaterial ? 'Update Material' : 'Add Material'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}