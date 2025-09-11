'use client'

import { useState, useCallback, useMemo, memo } from 'react'
import { useToast } from '@/hooks/useToast'
import { useUserMaterialsStore } from '@/store/user-materials-store'
import { useShopStore } from '@/store/shop-store'
import { UserMaterial, ProcessedImages } from '@/types/user-materials'
import { MaterialCategory } from '@/types/pricing'
import { getCurrencySymbol, formatNumberForDisplay, parseFormattedNumber } from '@/lib/currency-utils'
import MaterialImageUpload from '@/components/materials/MaterialImageUpload'
import { useUserTier } from '@/hooks/useUserTier'

export default function MyMaterialsPage() {
  const { addToast } = useToast()
  const { shopData } = useShopStore()
  const { canUploadPhotos, hasReachedLimit, tierInfo } = useUserTier()
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
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMaterials, setSelectedMaterials] = useState<Set<string>>(new Set())
  const [filterType, setFilterType] = useState<'all' | MaterialCategory>('all')
  const [formData, setFormData] = useState<Partial<UserMaterial>>({
    name: '',
    category: 'General',
    materialType: 'main',
    supplier: '',
    costPerUnit: undefined,
    unit: '',
    productLink: '',
    comments: '',
    minStock: undefined,
    currentStock: undefined,
    images: undefined,
    hasImages: false
  })

  const units = ['piece', 'board foot', 'sq ft', 'linear ft', 'yard', 'pound', 'gallon', 'gram', 'kilogram', 'meter', 'liter', 'other']
  const materialTypes: { value: MaterialCategory; label: string; description: string }[] = [
    { value: 'main', label: 'Main Material', description: 'Primary materials used in production' },
    { value: 'packaging', label: 'Packaging', description: 'Materials for packaging and shipping' },
    { value: 'decorations', label: 'Decorations', description: 'Decorative elements and finishing touches' }
  ]

  // Filter materials by search term and type (memoized)
  const filteredMaterials = useMemo(() => {
    let filtered = materials

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(material => material.materialType === filterType)
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(material =>
        material.name.toLowerCase().includes(searchLower) ||
        material.category.toLowerCase().includes(searchLower) ||
        material.supplier?.toLowerCase().includes(searchLower)
      )
    }

    return filtered
  }, [materials, searchTerm, filterType])

  // Calculate select all checkbox state
  const selectAllState = useMemo(() => {
    if (filteredMaterials.length === 0) return { checked: false, indeterminate: false }
    const selectedCount = filteredMaterials.filter(material => selectedMaterials.has(material.id)).length
    
    if (selectedCount === 0) return { checked: false, indeterminate: false }
    if (selectedCount === filteredMaterials.length) return { checked: true, indeterminate: false }
    return { checked: false, indeterminate: true }
  }, [filteredMaterials, selectedMaterials])

  // Handle select all toggle
  const handleSelectAllToggle = useCallback(() => {
    if (selectAllState.checked || selectAllState.indeterminate) {
      // Deselect all
      setSelectedMaterials(prev => {
        const newSet = new Set(prev)
        filteredMaterials.forEach(material => newSet.delete(material.id))
        return newSet
      })
    } else {
      // Select all
      setSelectedMaterials(prev => {
        const newSet = new Set(prev)
        filteredMaterials.forEach(material => newSet.add(material.id))
        return newSet
      })
    }
  }, [selectAllState, filteredMaterials])

  const handleImagesChange = (images: ProcessedImages | null) => {
    setFormData(prev => ({ 
      ...prev, 
      images: images || undefined,
      hasImages: !!images
    }))
  }

  const handleImageError = (error: string) => {
    addToast(error, 'error')
  }

  const handleInputChange = (field: keyof UserMaterial) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    let value
    if (e.target.type === 'number') {
      const numValue = e.target.value === '' ? undefined : parseFloat(e.target.value)
      value = isNaN(numValue as number) ? undefined : numValue
    } else if (e.target.type === 'checkbox') {
      value = (e.target as HTMLInputElement).checked
    } else {
      value = e.target.value
    }
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name) {
      addToast('Please enter a material name', 'error')
      return
    }
    
    if (!formData.unit) {
      addToast('Please select a unit of measure', 'error')
      return
    }
    
    if (!formData.costPerUnit || formData.costPerUnit <= 0) {
      addToast('Please enter a valid cost per unit (must be greater than 0)', 'error')
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
      costPerUnit: undefined,
      unit: '',
      productLink: '',
      comments: '',
      minStock: undefined,
      currentStock: undefined,
      images: undefined,
      hasImages: false
    })
    setEditingMaterial(null)
    setShowForm(false)
  }

  const handleEdit = useCallback((material: UserMaterial) => {
    setFormData(material)
    setEditingMaterial(material)
    setShowForm(true)
  }, [])

  const handleDelete = useCallback(async (materialId: string) => {
    if (!confirm('Are you sure you want to delete this material?')) return
    
    try {
      deleteMaterial(materialId)
      addToast('Material deleted successfully!', 'success')
    } catch (error) {
      console.error('Failed to delete material:', error)
      addToast('Failed to delete material', 'error')
    }
  }, [deleteMaterial, addToast])

  const handleBulkDelete = useCallback(async () => {
    if (selectedMaterials.size === 0) return
    if (!confirm(`Are you sure you want to delete ${selectedMaterials.size} materials?`)) return

    try {
      Array.from(selectedMaterials).forEach(id => deleteMaterial(id))
      setSelectedMaterials(new Set())
      addToast(`${selectedMaterials.size} materials deleted successfully`, 'success')
    } catch (error) {
      console.error('Failed to delete materials:', error)
      addToast('Failed to delete some materials', 'error')
    }
  }, [selectedMaterials, deleteMaterial, addToast])

  const toggleMaterialSelection = useCallback((materialId: string) => {
    const newSelection = new Set(selectedMaterials)
    if (newSelection.has(materialId)) {
      newSelection.delete(materialId)
    } else {
      newSelection.add(materialId)
    }
    setSelectedMaterials(newSelection)
  }, [selectedMaterials])

  const getStockStatus = useCallback((material: UserMaterial) => {
    if (material.currentStock <= 0) return { 
      status: 'Out of Stock', 
      color: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' 
    }
    if (material.currentStock <= material.minStock) return { 
      status: 'Low Stock', 
      color: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' 
    }
    return { 
      status: 'In Stock', 
      color: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
    }
  }, [])

  const getMaterialTypeDisplay = (materialType: MaterialCategory) => {
    const typeInfo = materialTypes.find(t => t.value === materialType)
    return typeInfo ? typeInfo.label : materialType
  }

  const getMaterialTypeColor = (materialType: MaterialCategory) => {
    switch (materialType) {
      case 'main': return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
      case 'packaging': return 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'
      case 'decorations': return 'bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200'
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
    }
  }

  const getTypeCount = (type: 'all' | MaterialCategory) => {
    if (type === 'all') return materials.length
    return materials.filter(m => m.materialType === type).length
  }

  // Add ref for select all checkbox to handle indeterminate state
  const selectAllCheckboxRef = useCallback((node: HTMLInputElement | null) => {
    if (node) {
      node.indeterminate = selectAllState.indeterminate
    }
  }, [selectAllState.indeterminate])

  const lowStockItems = checkLowStock()
  const totalInventoryValue = getTotalValue()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Materials</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Track your raw materials, costs, and inventory levels
        </p>
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {lowStockItems.length > 0 && (
            <div className="text-sm text-yellow-600 dark:text-yellow-400">
              ⚠️ {lowStockItems.length} item(s) running low on stock
            </div>
          )}
          <div className="text-right">
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Inventory Value</div>
            <div className="text-xl font-bold text-green-600 dark:text-green-400">
              {getCurrencySymbol(shopData.currency)}{formatNumberForDisplay(totalInventoryValue)}
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search materials by name, category, or supplier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Material
            </button>
            
            {selectedMaterials.size > 0 && (
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Delete Selected ({selectedMaterials.size})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Type Filter Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {(['all', 'main', 'packaging', 'decorations'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                filterType === type
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              {type === 'all' ? 'All Materials' : getMaterialTypeDisplay(type)} ({getTypeCount(type)})
            </button>
          ))}
        </nav>
      </div>

      {/* Materials Table */}
      {filteredMaterials.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500 text-lg mb-2">
            {searchTerm ? 'No materials found matching your search' : `No ${filterType === 'all' ? '' : filterType + ' '}materials found`}
          </div>
          {!searchTerm && filterType === 'all' && (
            <p className="text-gray-500 dark:text-gray-400">
              Get started by adding your first material
            </p>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      ref={selectAllCheckboxRef}
                      checked={selectAllState.checked}
                      onChange={handleSelectAllToggle}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Material
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Supplier
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Cost/Unit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Stock Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredMaterials.map((material) => (
                  <MaterialTableRow
                    key={material.id}
                    material={material}
                    isSelected={selectedMaterials.has(material.id)}
                    onToggleSelection={() => toggleMaterialSelection(material.id)}
                    onDelete={() => handleDelete(material.id)}
                    onEdit={() => handleEdit(material)}
                    getStockStatus={getStockStatus}
                    getMaterialTypeColor={getMaterialTypeColor}
                    getMaterialTypeDisplay={getMaterialTypeDisplay}
                    currencySymbol={getCurrencySymbol(shopData.currency)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Material Form */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {editingMaterial ? 'Edit Material' : 'Add New Material'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 cursor-pointer"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Material Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange('name')}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      placeholder="e.g., Oak Wood"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={handleInputChange('category')}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      placeholder="e.g., Wood, Metal, Fabric"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                          />
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{type.label}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{type.description}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Cost Per Unit *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500 dark:text-gray-400">{getCurrencySymbol(shopData.currency)}</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.costPerUnit ? formatNumberForDisplay(formData.costPerUnit) : ''}
                        onChange={(e) => {
                          const numValue = parseFormattedNumber(e.target.value);
                          setFormData(prev => ({ ...prev, costPerUnit: numValue }));
                        }}
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        placeholder="0"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Unit of Measure *
                    </label>
                    <select
                      value={formData.unit}
                      onChange={handleInputChange('unit')}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white cursor-pointer"
                      required
                    >
                      <option value="">Select unit</option>
                      {units.map(unit => (
                        <option key={unit} value={unit}>{unit}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Supplier
                    </label>
                    <input
                      type="text"
                      value={formData.supplier}
                      onChange={handleInputChange('supplier')}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      placeholder="Supplier name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Product Link
                    </label>
                    <input
                      type="url"
                      value={formData.productLink}
                      onChange={handleInputChange('productLink')}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      placeholder="https://example.com/product-page"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Current Stock
                    </label>
                    <input
                      type="text"
                      value={formData.currentStock ? formatNumberForDisplay(formData.currentStock) : ''}
                      onChange={(e) => {
                        const numValue = parseFormattedNumber(e.target.value);
                        setFormData(prev => ({ ...prev, currentStock: numValue }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      placeholder="100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Minimum Stock Level
                    </label>
                    <input
                      type="text"
                      value={formData.minStock ? formatNumberForDisplay(formData.minStock) : ''}
                      onChange={(e) => {
                        const numValue = parseFormattedNumber(e.target.value);
                        setFormData(prev => ({ ...prev, minStock: numValue }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      placeholder="Auto-calculated: 10% of current stock (min 1)"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Comments
                  </label>
                  <textarea
                    value={formData.comments}
                    onChange={handleInputChange('comments')}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="Additional notes about this material..."
                  />
                </div>

                {/* Material Photo Upload - Pro Feature */}
                <div>
                  <MaterialImageUpload
                    currentImages={formData.images}
                    onImagesChange={handleImagesChange}
                    onError={handleImageError}
                    isPro={canUploadPhotos}
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800 transition-colors cursor-pointer"
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

interface MaterialTableRowProps {
  material: UserMaterial
  isSelected: boolean
  onToggleSelection: () => void
  onDelete: () => void
  onEdit: () => void
  getStockStatus: (material: UserMaterial) => { status: string; color: string }
  getMaterialTypeColor: (type: MaterialCategory) => string
  getMaterialTypeDisplay: (type: MaterialCategory) => string
  currencySymbol: string
}

const MaterialTableRow = memo(function MaterialTableRow({ 
  material, 
  isSelected, 
  onToggleSelection, 
  onDelete, 
  onEdit,
  getStockStatus, 
  getMaterialTypeColor,
  getMaterialTypeDisplay,
  currencySymbol
}: MaterialTableRowProps) {
  const stockStatus = getStockStatus(material)
  
  return (
    <tr className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
      {/* Checkbox */}
      <td className="px-6 py-4 whitespace-nowrap">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggleSelection}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
        />
      </td>

      {/* Material Info with Image */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          {material.hasImages && material.images ? (
            <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 flex-shrink-0 mr-4">
              <img
                src={material.images.thumbnail}
                alt={material.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 mr-4">
              <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">{material.name}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{material.category}</div>
          </div>
        </div>
      </td>

      {/* Type */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getMaterialTypeColor(material.materialType)}`}>
          {getMaterialTypeDisplay(material.materialType)}
        </span>
      </td>

      {/* Supplier */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900 dark:text-white">{material.supplier || 'N/A'}</div>
      </td>

      {/* Cost/Unit */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900 dark:text-white">
          {currencySymbol}{formatNumberForDisplay(material.costPerUnit)}/{material.unit}
        </div>
      </td>

      {/* Stock Status */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="space-y-1">
          <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${stockStatus.color}`}>
            {stockStatus.status}
          </span>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {formatNumberForDisplay(material.currentStock)} / {formatNumberForDisplay(material.minStock)} {material.unit}s
          </div>
        </div>
      </td>

      {/* Actions */}
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex justify-end space-x-2">
          <button
            onClick={onEdit}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20 hover:bg-blue-200 dark:hover:bg-blue-900/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
          <button
            onClick={onDelete}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </td>
    </tr>
  )
})