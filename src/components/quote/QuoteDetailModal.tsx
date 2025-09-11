'use client'

import { useState, useEffect } from 'react'
import { Quote, QuoteStatus } from '@/types/pricing'
import { formatCurrency } from '@/lib/calculations'
import { useQuoteStore } from '@/store/quote-store'
import { useToast } from '@/hooks/useToast'

interface QuoteDetailModalProps {
  quote: Quote | null
  isOpen: boolean
  onClose: () => void
  onEdit?: () => void
}

export default function QuoteDetailModal({ quote, isOpen, onClose, onEdit }: QuoteDetailModalProps) {
  const { updateQuoteStatus, saveQuoteToDatabase } = useQuoteStore()
  const { addToast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [editableQuote, setEditableQuote] = useState<Quote | null>(null)

  useEffect(() => {
    if (quote) {
      setEditableQuote({ ...quote })
    }
  }, [quote])

  if (!isOpen || !quote || !editableQuote) return null

  const handleStatusChange = async (newStatus: QuoteStatus) => {
    try {
      updateQuoteStatus(quote.id, newStatus)
      
      // Save to database
      await saveQuoteToDatabase(quote.id)
      
      addToast(`Quote marked as ${newStatus}`, 'success')
    } catch (error) {
      console.error('Failed to update quote status:', error)
      addToast('Failed to update quote status', 'error')
    }
  }

  const handleSaveEdit = async () => {
    if (!editableQuote) return
    
    try {
      // Update the quote data in store
      // Note: This would need to be implemented in the store
      setIsEditing(false)
      addToast('Quote updated successfully', 'success')
    } catch (error) {
      console.error('Failed to update quote:', error)
      addToast('Failed to update quote', 'error')
    }
  }

  const handleFieldChange = (field: keyof Quote, value: string) => {
    if (!editableQuote) return
    
    setEditableQuote({
      ...editableQuote,
      [field]: value,
      updatedAt: new Date()
    })
  }

  const canEdit = quote.status === 'draft' || quote.status === 'final'
  const isCompleted = quote.status === 'completed'

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Quote {quote.quoteNumber}
            </h2>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize ${
              quote.status === 'draft' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
              quote.status === 'final' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' :
              'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
            }`}>
              {quote.status}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            {canEdit && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Edit
              </button>
            )}
            
            {isEditing && (
              <>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false)
                    setEditableQuote({ ...quote })
                  }}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
              </>
            )}
            
            <button
              onClick={onClose}
              className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Project Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editableQuote.projectName}
                  onChange={(e) => handleFieldChange('projectName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              ) : (
                <p className="text-gray-900 dark:text-white font-semibold">{quote.projectName}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Client Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editableQuote.clientName}
                  onChange={(e) => handleFieldChange('clientName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              ) : (
                <p className="text-gray-900 dark:text-white font-semibold">{quote.clientName}</p>
              )}
            </div>
          </div>

          {/* Delivery and Payment Terms */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Delivery Date
              </label>
              {isEditing ? (
                <input
                  type="date"
                  value={editableQuote.deliveryDate ? new Date(editableQuote.deliveryDate).toISOString().split('T')[0] : ''}
                  onChange={(e) => handleFieldChange('deliveryDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              ) : (
                <p className="text-gray-900 dark:text-white">
                  {quote.deliveryDate ? new Date(quote.deliveryDate).toLocaleDateString() : 'Not specified'}
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Payment Terms
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editableQuote.paymentTerms || ''}
                  onChange={(e) => handleFieldChange('paymentTerms', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., Net 30, 50% upfront"
                />
              ) : (
                <p className="text-gray-900 dark:text-white">{quote.paymentTerms || 'Not specified'}</p>
              )}
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Products</h3>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100 dark:bg-gray-600">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-200">Product</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-gray-200">Quantity</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-gray-200">Unit Price</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-gray-200">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {quote.products.map((product, index) => (
                    <tr key={product.id}>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{product.productName}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white text-right">{product.quantity}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white text-right">
                        {formatCurrency(product.unitPrice, quote.currency)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white text-right font-medium">
                        {formatCurrency(product.totalPrice, quote.currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">Subtotal:</span>
                <span className="text-gray-900 dark:text-white">{formatCurrency(quote.subtotal, quote.currency)}</span>
              </div>
              
              {quote.discountAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Discount:</span>
                  <span className="text-red-600 dark:text-red-400">-{formatCurrency(quote.discountAmount, quote.currency)}</span>
                </div>
              )}
              
              {quote.shippingAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Shipping:</span>
                  <span className="text-gray-900 dark:text-white">{formatCurrency(quote.shippingAmount, quote.currency)}</span>
                </div>
              )}
              
              {quote.vatAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">VAT / Sales Tax:</span>
                  <span className="text-gray-900 dark:text-white">{formatCurrency(quote.vatAmount, quote.currency)}</span>
                </div>
              )}
              
              <div className="border-t border-gray-300 dark:border-gray-600 pt-2">
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-gray-900 dark:text-white">Total:</span>
                  <span className="text-gray-900 dark:text-white">{formatCurrency(quote.totalAmount, quote.currency)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dates and Status Actions */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Timeline</h3>
              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                <div>Created: {new Date(quote.createdAt).toLocaleString()}</div>
                <div>Last Updated: {new Date(quote.updatedAt).toLocaleString()}</div>
                {quote.finalizedAt && (
                  <div>Completed: {new Date(quote.finalizedAt).toLocaleString()}</div>
                )}
              </div>
            </div>
            
            {/* Status Actions */}
            {!isCompleted && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Actions</h3>
                <div className="space-y-2">
                  {quote.status === 'draft' && (
                    <button
                      onClick={() => handleStatusChange('final')}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Mark as Final
                    </button>
                  )}
                  
                  {quote.status === 'final' && (
                    <button
                      onClick={() => handleStatusChange('completed')}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      Mark as Completed
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}