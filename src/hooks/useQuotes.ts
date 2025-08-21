'use client'

import { useEffect, useCallback } from 'react'
import { useQuoteStore } from '@/store/quote-store'
import { useAuth } from '@/hooks/useAuth'
import { QuoteStatus } from '@/types/pricing'

export function useQuotes() {
  const { user } = useAuth()
  const {
    quotes,
    currentQuote,
    loading,
    loadAllQuotesFromDatabase,
    saveQuoteToDatabase,
    deleteQuoteFromDatabase,
    updateQuoteStatus,
    getQuotesByStatus,
    setCurrentQuote,
    resetCurrentQuote
  } = useQuoteStore()

  // Auto-load quotes when user logs in
  useEffect(() => {
    if (user) {
      loadAllQuotesFromDatabase().catch(error => {
        console.error('Failed to auto-load quotes:', error)
      })
    } else {
      // Clear quotes when user logs out
      resetCurrentQuote()
    }
  }, [user, loadAllQuotesFromDatabase, resetCurrentQuote])

  // Load quotes manually with error handling
  const loadQuotes = useCallback(async () => {
    if (!user) return
    
    try {
      await loadAllQuotesFromDatabase()
    } catch (error) {
      console.error('Failed to load quotes:', error)
      throw error
    }
  }, [user, loadAllQuotesFromDatabase])

  // Save quote with error handling
  const saveQuote = useCallback(async (quoteId: string) => {
    try {
      await saveQuoteToDatabase(quoteId)
    } catch (error) {
      console.error('Failed to save quote:', error)
      throw error
    }
  }, [saveQuoteToDatabase])

  // Delete quote with error handling
  const deleteQuote = useCallback(async (quoteId: string) => {
    try {
      await deleteQuoteFromDatabase(quoteId)
    } catch (error) {
      console.error('Failed to delete quote:', error)
      throw error
    }
  }, [deleteQuoteFromDatabase])

  // Update quote status with automatic save
  const changeQuoteStatus = useCallback(async (quoteId: string, status: QuoteStatus, autoSave: boolean = true) => {
    try {
      updateQuoteStatus(quoteId, status)
      
      if (autoSave) {
        await saveQuoteToDatabase(quoteId)
      }
    } catch (error) {
      console.error('Failed to update quote status:', error)
      throw error
    }
  }, [updateQuoteStatus, saveQuoteToDatabase])

  // Get quotes by status with caching
  const getQuotesByStatusMemo = useCallback((status: QuoteStatus) => {
    return getQuotesByStatus(status)
  }, [quotes, getQuotesByStatus])

  // Get quote statistics
  const getQuoteStats = useCallback(() => {
    const draftCount = getQuotesByStatus('draft').length
    const savedCount = getQuotesByStatus('saved').length
    const completedCount = getQuotesByStatus('completed').length
    const totalCount = quotes.length

    const totalValue = quotes.reduce((sum, quote) => sum + quote.totalAmount, 0)
    const completedValue = getQuotesByStatus('completed').reduce((sum, quote) => sum + quote.totalAmount, 0)

    return {
      counts: {
        draft: draftCount,
        saved: savedCount,
        completed: completedCount,
        total: totalCount
      },
      values: {
        total: totalValue,
        completed: completedValue
      }
    }
  }, [quotes, getQuotesByStatus])

  // Search quotes
  const searchQuotes = useCallback((searchTerm: string, status?: QuoteStatus) => {
    const quotesToSearch = status ? getQuotesByStatus(status) : quotes
    
    if (!searchTerm.trim()) return quotesToSearch

    const searchLower = searchTerm.toLowerCase()
    return quotesToSearch.filter(quote => 
      quote.quoteNumber.toLowerCase().includes(searchLower) ||
      quote.projectName.toLowerCase().includes(searchLower) ||
      quote.clientName.toLowerCase().includes(searchLower)
    )
  }, [quotes, getQuotesByStatus])

  // Get recent quotes (last 5)
  const getRecentQuotes = useCallback((limit: number = 5) => {
    return [...quotes]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, limit)
  }, [quotes])

  // Check if user has any quotes
  const hasQuotes = quotes.length > 0

  // Check if current quote exists and has products
  const hasActiveQuote = currentQuote && currentQuote.products.length > 0

  return {
    // Data
    quotes,
    currentQuote,
    loading,
    hasQuotes,
    hasActiveQuote,

    // Actions
    loadQuotes,
    saveQuote,
    deleteQuote,
    changeQuoteStatus,
    setCurrentQuote,
    resetCurrentQuote,

    // Queries
    getQuotesByStatus: getQuotesByStatusMemo,
    getQuoteStats,
    searchQuotes,
    getRecentQuotes,

    // Utilities
    isAuthenticated: !!user
  }
}

export default useQuotes