'use client'

import { useState, useEffect } from 'react'
import { useToast } from '@/hooks/useToast'
import LogoUpload from '@/components/ui/LogoUpload'
import Tooltip, { QuestionMarkIcon } from '@/components/ui/Tooltip'
import { useShopStore, type ShopData } from '@/store/shop-store'
import { OVERHEAD_FIELDS } from '@/constants/overhead-fields'

export default function MyShopPage() {
  const { addToast } = useToast()
  const { shopData, updateShopData, calculateMonthlyOverhead, calculateHourlyOverhead, syncTotalHours } = useShopStore()
  
  const [saving, setSaving] = useState(false)

  // Ensure totalMonthlyHours is synced on component mount
  useEffect(() => {
    syncTotalHours()
  }, [syncTotalHours])

  const handleInputChange = (field: keyof ShopData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value
    updateShopData({ [field]: value })
  }

  const handleLogoChange = (logoData: string | null) => {
    updateShopData({ logo: logoData })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Here you would save to your backend/database
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      addToast('Shop settings saved successfully!', 'success')
    } catch {
      addToast('Failed to save shop settings', 'error')
    } finally {
      setSaving(false)
    }
  }



  return (
    <div className="p-6">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Shop</h1>
        <p className="text-gray-600 mt-1">
          Configure your shop details and overhead cost calculations.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Shop Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Shop Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shop Name
              </label>
              <input
                type="text"
                value={shopData.name}
                onChange={handleInputChange('name')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="My Workshop"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={shopData.email}
                onChange={handleInputChange('email')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="shop@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={shopData.phone}
                onChange={handleInputChange('phone')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="(555) 123-4567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                value={shopData.address}
                onChange={handleInputChange('address')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="123 Workshop St, City, State 12345"
              />
            </div>

            <div className="md:col-span-2">
              <LogoUpload
                currentLogo={shopData.logo}
                onLogoChange={handleLogoChange}
                onError={(error) => addToast(error, 'error')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shop Slogan
              </label>
              <input
                type="text"
                value={shopData.slogan}
                onChange={handleInputChange('slogan')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Quality craftsmanship, every time"
              />
            </div>
          </div>
        </div>

        {/* Monthly Overhead Costs */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Overhead Costs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {OVERHEAD_FIELDS.map((field) => (
              <div key={field.key}>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  {field.label}
                  <Tooltip content={field.tooltip}>
                    <QuestionMarkIcon className="w-4 h-4" />
                  </Tooltip>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={shopData[field.key]}
                    onChange={handleInputChange(field.key)}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder={field.placeholder}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Labor Settings */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Labor & Operations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Base Labor Rate (per hour)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  value={shopData.laborRate}
                  onChange={handleInputChange('laborRate')}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="45"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Operating Hours per Day
              </label>
              <input
                type="number"
                value={shopData.operatingHours}
                onChange={handleInputChange('operatingHours')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="8"
                min="1"
                max="24"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Operating Days per Month
              </label>
              <input
                type="number"
                value={shopData.operatingDays}
                onChange={handleInputChange('operatingDays')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="22"
                min="1"
                max="31"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Monthly Hours
              </label>
              <input
                type="number"
                value={shopData.operatingHours * shopData.operatingDays}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                placeholder="160"
                min="1"
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Cost Summary */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Cost Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-4 border">
              <h4 className="text-sm font-medium text-gray-700">Monthly Overhead</h4>
              <p className="text-2xl font-bold text-blue-600">
                ${calculateMonthlyOverhead().toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">Total fixed costs per month</p>
            </div>

            <div className="bg-white rounded-lg p-4 border">
              <h4 className="text-sm font-medium text-gray-700">Overhead per Hour</h4>
              <p className="text-2xl font-bold text-yellow-600">
                ${calculateHourlyOverhead().toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">Overhead cost per operating hour</p>
            </div>

            <div className="bg-white rounded-lg p-4 border">
              <h4 className="text-sm font-medium text-gray-700">Fully Loaded Rate</h4>
              <p className="text-2xl font-bold text-green-600">
                ${(shopData.laborRate + calculateHourlyOverhead()).toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">Labor + overhead per hour</p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-6 border-t border-gray-200">
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white py-2 px-6 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              {saving ? 'Saving...' : 'Save Shop Settings'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}