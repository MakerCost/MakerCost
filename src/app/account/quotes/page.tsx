'use client'

import { useState, useCallback, useMemo, useEffect, memo } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/useToast'
import { useQuotes } from '@/hooks/useQuotes'
import { Quote, QuoteStatus } from '@/types/pricing'
import { formatCurrency } from '@/lib/calculations'

export default function QuotesPage() {
  const router = useRouter()
  const { addToast } = useToast()
  const { 
    loading, 
    deleteQuote, 
    changeQuoteStatus,
    getQuotesByStatus,
    searchQuotes,
    isAuthenticated
  } = useQuotes()
  
  const [activeTab, setActiveTab] = useState<QuoteStatus>('draft')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedQuotes, setSelectedQuotes] = useState<Set<string>>(new Set())

  // Filter quotes by active tab and search term (memoized)
  const filteredQuotes = useMemo(() => 
    searchQuotes(searchTerm, activeTab), 
    [searchQuotes, searchTerm, activeTab]
  )

  // Calculate select all checkbox state
  const selectAllState = useMemo(() => {
    if (filteredQuotes.length === 0) return { checked: false, indeterminate: false }
    const selectedCount = filteredQuotes.filter(quote => selectedQuotes.has(quote.id)).length
    
    if (selectedCount === 0) return { checked: false, indeterminate: false }
    if (selectedCount === filteredQuotes.length) return { checked: true, indeterminate: false }
    return { checked: false, indeterminate: true }
  }, [filteredQuotes, selectedQuotes])

  // Handle select all toggle
  const handleSelectAllToggle = useCallback(() => {
    if (selectAllState.checked || selectAllState.indeterminate) {
      // Deselect all
      setSelectedQuotes(prev => {
        const newSet = new Set(prev)
        filteredQuotes.forEach(quote => newSet.delete(quote.id))
        return newSet
      })
    } else {
      // Select all
      setSelectedQuotes(prev => {
        const newSet = new Set(prev)
        filteredQuotes.forEach(quote => newSet.add(quote.id))
        return newSet
      })
    }
  }, [selectAllState, filteredQuotes])

  const handleDeleteQuote = useCallback(async (quoteId: string) => {
    if (!confirm('Are you sure you want to delete this quote?')) return
    
    try {
      await deleteQuote(quoteId)
      addToast('Quote deleted successfully', 'success')
    } catch (error) {
      console.error('Failed to delete quote:', error)
      addToast('Failed to delete quote', 'error')
    }
  }, [deleteQuote, addToast])

  const handleStatusChange = useCallback(async (quoteId: string, newStatus: QuoteStatus) => {
    try {
      await changeQuoteStatus(quoteId, newStatus)
      addToast(`Quote marked as ${newStatus}`, 'success')
    } catch (error) {
      console.error('Failed to update quote status:', error)
      addToast('Failed to update quote status', 'error')
    }
  }, [changeQuoteStatus, addToast])

  const handleEditQuote = useCallback((quoteId: string) => {
    // Navigate to main calculator with quote loaded
    router.push(`/?quote=${quoteId}`)
  }, [router])

  const handleBulkDelete = useCallback(async () => {
    if (selectedQuotes.size === 0) return
    if (!confirm(`Are you sure you want to delete ${selectedQuotes.size} quotes?`)) return

    try {
      await Promise.all(Array.from(selectedQuotes).map(id => deleteQuote(id)))
      setSelectedQuotes(new Set())
      addToast(`${selectedQuotes.size} quotes deleted successfully`, 'success')
    } catch (error) {
      console.error('Failed to delete quotes:', error)
      addToast('Failed to delete some quotes', 'error')
    }
  }, [selectedQuotes, deleteQuote, addToast])

  const toggleQuoteSelection = useCallback((quoteId: string) => {
    const newSelection = new Set(selectedQuotes)
    if (newSelection.has(quoteId)) {
      newSelection.delete(quoteId)
    } else {
      newSelection.add(quoteId)
    }
    setSelectedQuotes(newSelection)
  }, [selectedQuotes])

  const getStatusBadgeColor = (status: QuoteStatus) => {
    switch (status) {
      case 'draft': return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
      case 'final': return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
      case 'completed': return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
    }
  }

  const getTabCount = (status: QuoteStatus) => {
    return getQuotesByStatus(status).length
  }

  // Add ref for select all checkbox to handle indeterminate state
  const selectAllCheckboxRef = useCallback((node: HTMLInputElement | null) => {
    if (node) {
      node.indeterminate = selectAllState.indeterminate
    }
  }, [selectAllState.indeterminate])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Quotes</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Manage your project quotes and track their progress
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search quotes by number, project, or client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          {selectedQuotes.size > 0 && (
            <button
              onClick={handleBulkDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Delete Selected ({selectedQuotes.size})
            </button>
          )}
        </div>
      </div>

      {/* Status Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {(['draft', 'final', 'completed'] as QuoteStatus[]).map((status) => (
            <button
              key={status}
              onClick={() => setActiveTab(status)}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === status
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              {status} ({getTabCount(status)})
            </button>
          ))}
        </nav>
      </div>

      {/* Quotes Table */}
      {filteredQuotes.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500 text-lg mb-2">
            {searchTerm ? 'No quotes found matching your search' : `No ${activeTab} quotes found`}
          </div>
          {!searchTerm && activeTab === 'draft' && (
            <p className="text-gray-500 dark:text-gray-400">
              Create your first quote from the main calculator
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
                    Quote
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredQuotes.map((quote) => (
                  <QuoteTableRow
                    key={quote.id}
                    quote={quote}
                    isSelected={selectedQuotes.has(quote.id)}
                    onToggleSelection={() => toggleQuoteSelection(quote.id)}
                    onDelete={() => handleDeleteQuote(quote.id)}
                    onEdit={() => handleEditQuote(quote.id)}
                    onStatusChange={(newStatus) => handleStatusChange(quote.id, newStatus)}
                    getStatusBadgeColor={getStatusBadgeColor}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

interface QuoteTableRowProps {
  quote: Quote
  isSelected: boolean
  onToggleSelection: () => void
  onDelete: () => void
  onEdit: () => void
  onStatusChange: (status: QuoteStatus) => void
  getStatusBadgeColor: (status: QuoteStatus) => string
}

const QuoteTableRow = memo(function QuoteTableRow({ 
  quote, 
  isSelected, 
  onToggleSelection, 
  onDelete, 
  onEdit,
  onStatusChange, 
  getStatusBadgeColor 
}: QuoteTableRowProps) {
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

      {/* Quote Number */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900 dark:text-white">
          {quote.quoteNumber}
        </div>
      </td>

      {/* Project Name */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900 dark:text-white">{quote.projectName}</div>
      </td>

      {/* Client Name */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900 dark:text-white">{quote.clientName}</div>
      </td>

      {/* Status - with dropdown for easy changing */}
      <td className="px-6 py-4 whitespace-nowrap">
        <select
          value={quote.status}
          onChange={(e) => onStatusChange(e.target.value as QuoteStatus)}
          className={`text-sm rounded-full px-3 py-1 font-medium capitalize border-0 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer ${getStatusBadgeColor(quote.status)}`}
        >
          <option value="draft">Draft</option>
          <option value="final">Final</option>
          <option value="completed">Completed</option>
        </select>
      </td>

      {/* Amount */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900 dark:text-white">
          {formatCurrency(quote.totalAmount, quote.currency)}
        </div>
      </td>

      {/* Created Date */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {new Date(quote.createdAt).toLocaleDateString()}
        </div>
        {quote.finalizedAt && (
          <div className="text-xs text-gray-400 dark:text-gray-500">
            Completed: {new Date(quote.finalizedAt).toLocaleDateString()}
          </div>
        )}
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