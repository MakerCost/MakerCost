'use client'

import { useState, useEffect } from 'react'
import { useToast } from '@/hooks/useToast'
import { useDisableNumberInputScroll } from '@/hooks/useDisableNumberInputScroll'
import LogoUpload from '@/components/ui/LogoUpload'
import Tooltip, { QuestionMarkIcon } from '@/components/ui/Tooltip'
import CurrencySelector from '@/components/ui/CurrencySelector'
import { useShopStore, type ShopData, type UnitSystem } from '@/store/shop-store'
import { OVERHEAD_FIELDS } from '@/constants/overhead-fields'
import { Currency } from '@/types/pricing'
import { getCurrencySymbol, formatNumberForDisplay, parseFormattedNumber } from '@/lib/currency-utils'

export default function MyShopPage() {
  const { addToast } = useToast()
  const { shopData, updateShopData, calculateMonthlyOverhead, calculateHourlyOverhead, syncTotalHours, loadFromDatabase, error, loading } = useShopStore()
  
  const [saving, setSaving] = useState(false)

  // Disable mouse wheel scrolling on number inputs
  useDisableNumberInputScroll()


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

  const handleCurrencyChange = (currency: Currency) => {
    updateShopData({ currency })
  }

  const handleUnitSystemChange = (unitSystem: UnitSystem) => {
    updateShopData({ unitSystem })
  }

  const handleLogoChange = (logoData: string | null) => {
    updateShopData({ logo: logoData })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Save to database using the store's saveToDatabase function
      await useShopStore.getState().saveToDatabase()
      addToast('Shop settings saved successfully!', 'success')

      // Clear any existing error state
      useShopStore.getState().setError(null)
    } catch (error) {
      console.error('Failed to save shop settings:', error)
      addToast('Failed to save shop settings. Please try again.', 'error')
    } finally {
      setSaving(false)
    }
  }




  return (
    <div className="p-6">
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Shop</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Configure your shop details and overhead cost calculations.
        </p>
      </div>

      {/* Error Banner - only shows after manual save failures */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-md p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 dark:text-red-300">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Shop Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Shop Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Shop Name
              </label>
              <input
                type="text"
                value={shopData.name}
                onChange={handleInputChange('name')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="My Workshop"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={shopData.email}
                onChange={handleInputChange('email')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="shop@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={shopData.phone}
                onChange={handleInputChange('phone')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="(555) 123-4567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Address
              </label>
              <input
                type="text"
                value={shopData.address}
                onChange={handleInputChange('address')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="123 Workshop St, City, State 12345"
              />
            </div>

            <div>
              <LogoUpload
                currentLogo={shopData.logo || undefined}
                onLogoChange={handleLogoChange}
                onError={(error) => addToast(error, 'error')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quote Comments
              </label>
              <textarea
                value={shopData.quoteComments}
                onChange={handleInputChange('quoteComments')}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                placeholder="Thank you for choosing our business. We look forward to bringing your project to life!
For any questions or modifications, please don't hesitate to contact us.
Quote valid for 5 days from date of issue."
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                This text will appear in your quote PDFs and can be customized for each quote.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Shop Slogan
              </label>
              <input
                type="text"
                value={shopData.slogan}
                onChange={handleInputChange('slogan')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Quality craftsmanship, every time"
              />
            </div>

            <div>
              <CurrencySelector
                value={shopData.currency}
                onChange={handleCurrencyChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                VAT / Sales Tax Rate (%)
              </label>
              <input
                type="number"
                value={shopData.vatRate}
                onChange={handleInputChange('vatRate')}
                onWheel={(e) => e.currentTarget.blur()}
                step="0.1"
                min="0"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="18"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Shop Units
              </label>
              <select
                value={shopData.unitSystem}
                onChange={(e) => handleUnitSystemChange(e.target.value as UnitSystem)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              >
                <option value="metric">Metric (grams, meters, liters)</option>
                <option value="imperial">Imperial (ounces, feet, gallons)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Monthly Overhead Costs */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Overhead Costs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {OVERHEAD_FIELDS.map((field) => (
              <div key={field.key}>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {field.label}
                  <Tooltip content={field.tooltip}>
                    <QuestionMarkIcon className="w-4 h-4" />
                  </Tooltip>
                </label>
                <div className="relative">
                  <span className="currency-symbol absolute left-3 top-2 text-gray-500 dark:text-gray-400">{getCurrencySymbol(shopData.currency)}</span>
                  <input
                    type="text"
                    value={formatNumberForDisplay(shopData[field.key])}
                    onChange={(e) => {
                      const numValue = parseFormattedNumber(e.target.value) ?? 0;
                      updateShopData({ [field.key]: numValue });
                    }}
                    className="currency-input w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder={field.placeholder}
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Base Labor Rate (per hour)
              </label>
              <div className="relative">
                <span className="currency-symbol absolute left-3 top-2 text-gray-500 dark:text-gray-400">{getCurrencySymbol(shopData.currency)}</span>
                <input
                  type="text"
                  value={formatNumberForDisplay(shopData.laborRate)}
                  onChange={(e) => {
                    const numValue = parseFormattedNumber(e.target.value) ?? 0;
                    updateShopData({ laborRate: numValue });
                  }}
                  className="currency-input w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="45"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Operating Hours per Day
              </label>
              <input
                type="number"
                value={shopData.operatingHours}
                onChange={handleInputChange('operatingHours')}
                onWheel={(e) => e.currentTarget.blur()}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="8"
                min="1"
                max="24"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Operating Days per Month
              </label>
              <input
                type="number"
                value={shopData.operatingDays}
                onChange={handleInputChange('operatingDays')}
                onWheel={(e) => e.currentTarget.blur()}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="22"
                min="1"
                max="31"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Total Monthly Hours
              </label>
              <input
                type="number"
                value={shopData.operatingHours * shopData.operatingDays}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="160"
                min="1"
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Power Settings */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Power & Electricity</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Power Cost per kWh
                <Tooltip content="Cost of electricity per kilowatt hour. This will be used to calculate machine operating costs. If you include electricity in your overhead calculation above, machines can be set to ignore this to avoid double counting.">
                  <QuestionMarkIcon className="w-4 h-4" />
                </Tooltip>
              </label>
              <div className="relative">
                <span className="currency-symbol absolute left-3 top-2 text-gray-500 dark:text-gray-400">{getCurrencySymbol(shopData.currency)}</span>
                <input
                  type="text"
                  value={shopData.powerCostPerKwh?.toFixed(3) || '0.000'}
                  onChange={(e) => {
                    const numValue = parseFloat(e.target.value) || 0;
                    updateShopData({ powerCostPerKwh: numValue });
                  }}
                  className="currency-input w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="0.12"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Cost Summary */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Cost Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Monthly Overhead</h4>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {getCurrencySymbol(shopData.currency)}{formatNumberForDisplay(calculateMonthlyOverhead())}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total fixed costs per month</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Overhead per Hour</h4>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {getCurrencySymbol(shopData.currency)}{calculateHourlyOverhead().toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Overhead cost per operating hour</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Fully Loaded Rate</h4>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {getCurrencySymbol(shopData.currency)}{(shopData.laborRate + calculateHourlyOverhead()).toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Labor + overhead per hour</p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white py-2 px-6 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center"
            >
              {saving && (
                <svg className="w-4 h-4 mr-2 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
              )}
              {saving ? 'Saving...' : 'Save Shop Settings'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}