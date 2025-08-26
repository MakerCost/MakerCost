'use client'

import { useState, useEffect } from 'react'
import { useToast } from '@/hooks/useToast'
import { useShopStore } from '@/store/shop-store'
import { useMachineStore, type DashboardMachine } from '@/store/machine-store'
import Tooltip, { QuestionMarkIcon } from '@/components/ui/Tooltip'
import { getCurrencySymbol, formatNumberForDisplay, parseFormattedNumber } from '@/lib/currency-utils'

export default function MyToolsPage() {
  const { addToast } = useToast()
  const { shopData } = useShopStore()
  const { machines, addMachine, updateMachine, deleteMachine } = useMachineStore()
  
  const [showForm, setShowForm] = useState(false)
  const [editingMachine, setEditingMachine] = useState<DashboardMachine | null>(null)
  const [formData, setFormData] = useState<Partial<DashboardMachine>>({
    name: '',
    purchasePrice: undefined,
    depreciationPercentage: 20,
    hoursPerYear: 500,
    maintenanceCostPerYear: undefined,
    powerConsumption: 0.5,
    electricityIncludedInOverhead: false
  })

  // Auto-calculate maintenance cost when purchase price changes
  useEffect(() => {
    if (formData.purchasePrice && formData.purchasePrice > 0) {
      const calculatedMaintenance = formData.purchasePrice * 0.04 // 4% of purchase price
      setFormData(prev => ({ ...prev, maintenanceCostPerYear: calculatedMaintenance }))
    }
  }, [formData.purchasePrice])

  const handleInputChange = (field: keyof DashboardMachine) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLInputElement>
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

  const calculateHourlyRate = (machine: DashboardMachine) => {
    // Calculate annual depreciation using percentage
    const annualDepreciation = machine.purchasePrice * (machine.depreciationPercentage / 100)
    
    // Calculate annual power cost (only if not included in overhead)
    const annualPowerCost = machine.electricityIncludedInOverhead 
      ? 0 
      : machine.powerConsumption * shopData.powerCostPerKwh * machine.hoursPerYear
    
    const totalAnnualCost = annualDepreciation + machine.maintenanceCostPerYear + annualPowerCost
    return totalAnnualCost / machine.hoursPerYear
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.purchasePrice) {
      addToast('Please fill in all required fields (Name and Purchase Price)', 'error')
      return
    }

    // Check for duplicate machine name
    const isDuplicateName = machines.some(machine => {
      // If editing, exclude the current machine from the check
      if (editingMachine && machine.id === editingMachine.id) {
        return false
      }
      return machine.name.toLowerCase().trim() === formData.name?.toLowerCase().trim()
    })

    if (isDuplicateName) {
      addToast(`A machine named "${formData.name}" already exists in your dashboard`, 'error')
      return
    }

    if (editingMachine) {
      updateMachine(editingMachine.id, formData)
      addToast('Machine updated successfully!', 'success')
    } else {
      addMachine(formData as Omit<DashboardMachine, 'id'>)
      addToast('Machine added successfully!', 'success')
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: '',
      purchasePrice: undefined,
      depreciationPercentage: 20,
      hoursPerYear: 500,
      maintenanceCostPerYear: undefined,
      powerConsumption: 0.5,
      electricityIncludedInOverhead: false
    })
    setEditingMachine(null)
    setShowForm(false)
  }

  const handleEdit = (machine: DashboardMachine) => {
    setFormData(machine)
    setEditingMachine(machine)
    setShowForm(true)
  }

  const handleDelete = (machineId: string) => {
    if (confirm('Are you sure you want to delete this machine?')) {
      deleteMachine(machineId)
      addToast('Machine deleted successfully!', 'success')
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-start border-b border-gray-200 pb-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Machines</h1>
          <p className="text-gray-600 mt-1">
            Manage your machines and calculate their hourly operating costs.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors cursor-pointer"
        >
          Add Machine
        </button>
      </div>

      {/* Machine List */}
      <div className="space-y-4 mb-8">
        {machines.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No machines yet</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding your first machine.</p>
            <div className="mt-6">
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Add Your First Machine
              </button>
            </div>
          </div>
        ) : (
          machines.map((machine) => (
            <div key={machine.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{machine.name}</h3>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(machine)}
                    className="text-blue-600 hover:text-blue-800 cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(machine.id)}
                    className="text-red-600 hover:text-red-800 cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Purchase Price:</span>
                  <p className="font-medium">{getCurrencySymbol(shopData.currency)}{formatNumberForDisplay(machine.purchasePrice)}</p>
                </div>
                <div>
                  <span className="text-gray-500">Hours/Year:</span>
                  <p className="font-medium">{machine.hoursPerYear.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-gray-500">Maintenance/Year:</span>
                  <p className="font-medium">{getCurrencySymbol(shopData.currency)}{formatNumberForDisplay(machine.maintenanceCostPerYear)}</p>
                </div>
                <div>
                  <span className="text-gray-500">Hourly Rate:</span>
                  <p className="font-medium text-green-600">{getCurrencySymbol(shopData.currency)}{calculateHourlyRate(machine).toFixed(2)}/hr</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Machine Form */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingMachine ? 'Edit Machine' : 'Add New Machine'}
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
                      Machine Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange('name')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., CNC Router"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Purchase Price *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">{getCurrencySymbol(shopData.currency)}</span>
                      <input
                        type="text"
                        value={formData.purchasePrice ? formatNumberForDisplay(formData.purchasePrice) : ''}
                        onChange={(e) => {
                          const numValue = parseFormattedNumber(e.target.value);
                          setFormData(prev => ({ ...prev, purchasePrice: numValue }));
                        }}
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter purchase price"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Depreciation %
                    </label>
                    <input
                      type="number"
                      value={formData.depreciationPercentage}
                      onChange={handleInputChange('depreciationPercentage')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="10"
                      min="0"
                      max="100"
                      step="0.1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hours Per Year
                    </label>
                    <input
                      type="text"
                      value={formData.hoursPerYear ? formatNumberForDisplay(formData.hoursPerYear) : ''}
                      onChange={(e) => {
                        const numValue = parseFormattedNumber(e.target.value);
                        setFormData(prev => ({ ...prev, hoursPerYear: numValue }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="2,000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Annual Maintenance Cost
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">{getCurrencySymbol(shopData.currency)}</span>
                      <input
                        type="text"
                        value={formData.maintenanceCostPerYear ? formatNumberForDisplay(formData.maintenanceCostPerYear) : ''}
                        onChange={(e) => {
                          const numValue = parseFormattedNumber(e.target.value);
                          setFormData(prev => ({ ...prev, maintenanceCostPerYear: numValue }));
                        }}
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Auto-calculated: 4% of purchase price"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Power Consumption (kW)
                    </label>
                    <input
                      type="number"
                      value={formData.powerConsumption}
                      onChange={handleInputChange('powerConsumption')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.5"
                      min="0"
                      step="0.1"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <input
                        type="checkbox"
                        checked={formData.electricityIncludedInOverhead}
                        onChange={handleInputChange('electricityIncludedInOverhead')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      Electricity included in overhead
                      <Tooltip 
                        content="Check this if your overhead calculation already includes electricity costs to avoid double counting. When checked, this machine's power consumption won't be added to the hourly rate calculation."
                        maxWidth="max-w-md"
                      >
                        <QuestionMarkIcon className="w-4 h-4" />
                      </Tooltip>
                    </label>
                  </div>
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
                    {editingMachine ? 'Update Machine' : 'Add Machine'}
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