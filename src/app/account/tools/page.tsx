'use client'

import { useState } from 'react'
import { useToast } from '@/hooks/useToast'

interface Machine {
  id: string
  name: string
  type: string
  purchasePrice: number
  purchaseDate: string
  depreciationYears: number
  hoursPerYear: number
  maintenanceCostPerYear: number
  powerConsumption: number
  powerCostPerKwh: number
}

export default function MyToolsPage() {
  const { addToast } = useToast()
  const [machines, setMachines] = useState<Machine[]>([
    {
      id: '1',
      name: 'CNC Router',
      type: 'Cutting',
      purchasePrice: 25000,
      purchaseDate: '2023-01-15',
      depreciationYears: 10,
      hoursPerYear: 2000,
      maintenanceCostPerYear: 2500,
      powerConsumption: 5.5,
      powerCostPerKwh: 0.12
    }
  ])
  
  const [showForm, setShowForm] = useState(false)
  const [editingMachine, setEditingMachine] = useState<Machine | null>(null)
  const [formData, setFormData] = useState<Partial<Machine>>({
    name: '',
    type: '',
    purchasePrice: 0,
    purchaseDate: '',
    depreciationYears: 10,
    hoursPerYear: 2000,
    maintenanceCostPerYear: 0,
    powerConsumption: 0,
    powerCostPerKwh: 0.12
  })

  const handleInputChange = (field: keyof Machine) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const calculateHourlyRate = (machine: Machine) => {
    const annualDepreciation = machine.purchasePrice / machine.depreciationYears
    const annualPowerCost = machine.powerConsumption * machine.powerCostPerKwh * machine.hoursPerYear
    const totalAnnualCost = annualDepreciation + machine.maintenanceCostPerYear + annualPowerCost
    return totalAnnualCost / machine.hoursPerYear
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.type || !formData.purchasePrice) {
      addToast('Please fill in all required fields', 'error')
      return
    }

    const machineData = {
      ...formData,
      id: editingMachine?.id || Date.now().toString()
    } as Machine

    if (editingMachine) {
      setMachines(prev => prev.map(m => m.id === editingMachine.id ? machineData : m))
      addToast('Machine updated successfully!', 'success')
    } else {
      setMachines(prev => [...prev, machineData])
      addToast('Machine added successfully!', 'success')
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: '',
      type: '',
      purchasePrice: 0,
      purchaseDate: '',
      depreciationYears: 10,
      hoursPerYear: 2000,
      maintenanceCostPerYear: 0,
      powerConsumption: 0,
      powerCostPerKwh: 0.12
    })
    setEditingMachine(null)
    setShowForm(false)
  }

  const handleEdit = (machine: Machine) => {
    setFormData(machine)
    setEditingMachine(machine)
    setShowForm(true)
  }

  const handleDelete = (machineId: string) => {
    if (confirm('Are you sure you want to delete this machine?')) {
      setMachines(prev => prev.filter(m => m.id !== machineId))
      addToast('Machine deleted successfully!', 'success')
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-start border-b border-gray-200 pb-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Tools</h1>
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
                  <p className="text-gray-600">{machine.type}</p>
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
                  <p className="font-medium">${machine.purchasePrice.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-gray-500">Hours/Year:</span>
                  <p className="font-medium">{machine.hoursPerYear.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-gray-500">Maintenance/Year:</span>
                  <p className="font-medium">${machine.maintenanceCostPerYear.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-gray-500">Hourly Rate:</span>
                  <p className="font-medium text-green-600">${calculateHourlyRate(machine).toFixed(2)}/hr</p>
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
                      Machine Type *
                    </label>
                    <select
                      value={formData.type}
                      onChange={handleInputChange('type')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                      required
                    >
                      <option value="">Select type</option>
                      <option value="Cutting">Cutting</option>
                      <option value="Drilling">Drilling</option>
                      <option value="Milling">Milling</option>
                      <option value="Welding">Welding</option>
                      <option value="3D Printing">3D Printing</option>
                      <option value="Laser">Laser</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Purchase Price *
                    </label>
                    <input
                      type="number"
                      value={formData.purchasePrice}
                      onChange={handleInputChange('purchasePrice')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="25000"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Purchase Date
                    </label>
                    <input
                      type="date"
                      value={formData.purchaseDate}
                      onChange={handleInputChange('purchaseDate')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Depreciation Years
                    </label>
                    <input
                      type="number"
                      value={formData.depreciationYears}
                      onChange={handleInputChange('depreciationYears')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="10"
                      min="1"
                      max="50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hours Per Year
                    </label>
                    <input
                      type="number"
                      value={formData.hoursPerYear}
                      onChange={handleInputChange('hoursPerYear')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="2000"
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Annual Maintenance Cost
                    </label>
                    <input
                      type="number"
                      value={formData.maintenanceCostPerYear}
                      onChange={handleInputChange('maintenanceCostPerYear')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="2500"
                      min="0"
                      step="0.01"
                    />
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
                      placeholder="5.5"
                      min="0"
                      step="0.1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Power Cost per kWh
                    </label>
                    <input
                      type="number"
                      value={formData.powerCostPerKwh}
                      onChange={handleInputChange('powerCostPerKwh')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.12"
                      min="0"
                      step="0.001"
                    />
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