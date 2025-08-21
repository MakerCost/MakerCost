'use client'

import { useState } from 'react'
import { useToast } from '@/hooks/useToast'
import { useQuotes } from '@/hooks/useQuotes'
import { Quote, QuoteStatus } from '@/types/pricing'
import { formatCurrency } from '@/lib/calculations'

export default function QuotesPage() {
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

  // Filter quotes by active tab and search term
  const filteredQuotes = searchQuotes(searchTerm, activeTab)

  const handleDeleteQuote = async (quoteId: string) => {
    if (!confirm('Are you sure you want to delete this quote?')) return
    
    try {
      await deleteQuote(quoteId)
      addToast('Quote deleted successfully', 'success')
    } catch (error) {
      console.error('Failed to delete quote:', error)
      addToast('Failed to delete quote', 'error')
    }
  }

  const handleStatusChange = async (quoteId: string, newStatus: QuoteStatus) => {
    try {
      await changeQuoteStatus(quoteId, newStatus)
      addToast(`Quote marked as ${newStatus}`, 'success')
    } catch (error) {
      console.error('Failed to update quote status:', error)
      addToast('Failed to update quote status', 'error')
    }
  }

  const handleBulkDelete = async () => {
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
  }

  const toggleQuoteSelection = (quoteId: string) => {
    const newSelection = new Set(selectedQuotes)
    if (newSelection.has(quoteId)) {
      newSelection.delete(quoteId)
    } else {
      newSelection.add(quoteId)
    }
    setSelectedQuotes(newSelection)
  }

  const getStatusBadgeColor = (status: QuoteStatus) => {
    switch (status) {
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      case 'saved': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTabCount = (status: QuoteStatus) => {
    return getQuotesByStatus(status).length
  }

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
        <h1 className="text-3xl font-bold text-gray-900">My Quotes</h1>
        <p className="mt-2 text-gray-600">
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {(['draft', 'saved', 'completed'] as QuoteStatus[]).map((status) => (
            <button
              key={status}
              onClick={() => setActiveTab(status)}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === status
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {status} ({getTabCount(status)})
            </button>
          ))}
        </nav>
      </div>

      {/* Quotes Grid */}
      {filteredQuotes.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">
            {searchTerm ? 'No quotes found matching your search' : `No ${activeTab} quotes found`}
          </div>
          {!searchTerm && activeTab === 'draft' && (
            <p className="text-gray-500">
              Create your first quote from the main calculator
            </p>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredQuotes.map((quote) => (
            <QuoteCard
              key={quote.id}
              quote={quote}
              isSelected={selectedQuotes.has(quote.id)}
              onToggleSelection={() => toggleQuoteSelection(quote.id)}
              onDelete={() => handleDeleteQuote(quote.id)}
              onStatusChange={(newStatus) => handleStatusChange(quote.id, newStatus)}
              getStatusBadgeColor={getStatusBadgeColor}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface QuoteCardProps {
  quote: Quote
  isSelected: boolean
  onToggleSelection: () => void
  onDelete: () => void
  onStatusChange: (status: QuoteStatus) => void
  getStatusBadgeColor: (status: QuoteStatus) => string
}

function QuoteCard({ 
  quote, 
  isSelected, 
  onToggleSelection, 
  onDelete, 
  onStatusChange, 
  getStatusBadgeColor 
}: QuoteCardProps) {
  const [showActions, setShowActions] = useState(false)

  return (
    <div className={`bg-white rounded-lg shadow border-2 ${isSelected ? 'border-blue-500' : 'border-gray-200'} hover:shadow-md transition-shadow`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={onToggleSelection}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {quote.quoteNumber}
              </h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusBadgeColor(quote.status)}`}>
                {quote.status}
              </span>
            </div>
          </div>
          
          <button
            onClick={() => setShowActions(!showActions)}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        </div>

        {/* Quote Details */}
        <div className="space-y-2 mb-4">
          <div>
            <p className="text-sm font-medium text-gray-900">{quote.projectName}</p>
            <p className="text-sm text-gray-500">{quote.clientName}</p>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-gray-900">
              {formatCurrency(quote.totalAmount, quote.currency)}
            </span>
            <span className="text-sm text-gray-500">
              {quote.products.length} product{quote.products.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Dates */}
        <div className="text-xs text-gray-500 space-y-1">
          <div>Created: {new Date(quote.createdAt).toLocaleDateString()}</div>
          <div>Updated: {new Date(quote.updatedAt).toLocaleDateString()}</div>
          {quote.finalizedAt && (
            <div>Completed: {new Date(quote.finalizedAt).toLocaleDateString()}</div>
          )}
        </div>

        {/* Actions Menu */}
        {showActions && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="space-y-2">
              <button
                onClick={() => console.log('View quote:', quote.id)}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
              >
                View Details
              </button>
              
              {quote.status === 'draft' && (
                <>
                  <button
                    onClick={() => console.log('Edit quote:', quote.id)}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                  >
                    Edit Quote
                  </button>
                  <button
                    onClick={() => onStatusChange('saved')}
                    className="w-full text-left px-3 py-2 text-sm text-blue-700 hover:bg-blue-50 rounded"
                  >
                    Mark as Saved
                  </button>
                </>
              )}
              
              {quote.status === 'saved' && (
                <button
                  onClick={() => onStatusChange('completed')}
                  className="w-full text-left px-3 py-2 text-sm text-green-700 hover:bg-green-50 rounded"
                >
                  Mark as Completed
                </button>
              )}
              
              <button
                onClick={onDelete}
                className="w-full text-left px-3 py-2 text-sm text-red-700 hover:bg-red-50 rounded"
              >
                Delete Quote
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}