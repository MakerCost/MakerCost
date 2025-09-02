import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Quote, QuoteState, QuoteProduct, DiscountInfo, ShippingInfo, PricingProject, Currency, QuoteStatus } from '@/types/pricing';
import { calculateVAT } from '@/lib/calculations';
import { saveQuote, loadAllQuotes, deleteQuote, DatabaseError } from '@/lib/database';
import { trackQuoteGenerated, trackQuoteFinalized } from '@/lib/analytics/events';

const generateQuoteNumber = (): string => {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `Q${year}${month}${day}-${random}`;
};

const calculateQuoteTotals = (products: QuoteProduct[], discount?: DiscountInfo, shipping?: ShippingInfo, currentVatSettings?: { rate: number; isInclusive: boolean }) => {
  const subtotal = products.reduce((sum, product) => sum + product.totalPrice, 0);
  
  let discountAmount = 0;
  if (discount) {
    if (discount.type === 'percentage') {
      discountAmount = (subtotal * discount.amount) / 100;
    } else {
      discountAmount = discount.amount;
    }
  }
  
  const afterDiscountAmount = subtotal - discountAmount;
  const shippingAmount = shipping?.chargeToCustomer || 0;
  
  // Use current VAT settings if provided, otherwise fall back to first product's settings
  const vatSettings = currentVatSettings || (products.length > 0 ? products[0].vatSettings : { rate: 0, isInclusive: true });
  
  // Calculate VAT using the same function as main pricing calculations
  const beforeShippingTotal = afterDiscountAmount;
  const productVAT = calculateVAT(beforeShippingTotal, vatSettings);
  
  let shippingVAT = 0;
  let shippingNetAmount = shippingAmount;
  
  // Handle shipping VAT separately
  if (shipping && shippingAmount > 0) {
    if (shipping.includesVAT) {
      // Shipping includes VAT - extract the VAT portion
      const shippingVATCalc = calculateVAT(shippingAmount, { rate: vatSettings.rate, isInclusive: true });
      shippingVAT = shippingVATCalc.vatAmount;
      shippingNetAmount = shippingVATCalc.netAmount;
    } else {
      // Shipping excludes VAT - calculate VAT to add if needed
      if (!vatSettings.isInclusive) {
        // Products are VAT exclusive, so add VAT to shipping
        const shippingVATCalc = calculateVAT(shippingAmount, { rate: vatSettings.rate, isInclusive: false });
        shippingVAT = shippingVATCalc.vatAmount;
        shippingNetAmount = shippingAmount;
      } else {
        // Products are VAT inclusive, shipping stays as-is
        shippingVAT = 0;
        shippingNetAmount = shippingAmount;
      }
    }
  }
  
  const totalVATAmount = productVAT.vatAmount + shippingVAT;
  
  // Calculate final total based on VAT structure
  let totalAmount = 0;
  if (vatSettings.isInclusive) {
    // For inclusive VAT, the total is just the sum of all amounts
    totalAmount = afterDiscountAmount + shippingAmount;
  } else {
    // For exclusive VAT, add the VAT to the net amounts
    totalAmount = productVAT.netAmount + shippingNetAmount + totalVATAmount;
  }

  
  return {
    subtotal,
    discountAmount,
    shippingAmount,
    vatAmount: totalVATAmount,
    totalAmount
  };
};

interface QuoteStore extends QuoteState {
  // Quote management
  createQuote: (projectName: string, clientName: string, currency: string, deliveryDate?: Date, paymentTerms?: string) => Quote;
  addProductToQuote: (product: QuoteProduct, quoteId?: string) => void;
  removeProductFromQuote: (productId: string, quoteId?: string) => void;
  updateQuoteDiscount: (quoteId: string, discount?: DiscountInfo) => void;
  updateQuoteShipping: (quoteId: string, shipping?: ShippingInfo) => void;
  finalizeQuote: (quoteId: string) => void;
  
  // Product creation from project
  createProductFromProject: (project: PricingProject) => QuoteProduct | null;
  
  // Current quote management
  setCurrentQuote: (quote: Quote | null) => void;
  
  // Reset functionality
  resetCurrentQuote: () => void;
  
  // Quote status management
  updateQuoteStatus: (quoteId: string, status: QuoteStatus) => void;
  markQuoteAsCompleted: (quoteId: string) => void;
  getQuotesByStatus: (status: QuoteStatus) => Quote[];
  
  // Draft management
  findOrCreateDraftQuote: (projectName: string, clientName: string, currency: string) => Quote;
  updateQuoteFromProject: (quoteId: string, project: PricingProject) => void;
  
  // Recalculate quote with current VAT settings
  recalculateQuoteWithVAT: (quoteId: string, vatSettings: { rate: number; isInclusive: boolean }) => void;
  
  // Database operations
  saveQuoteToDatabase: (quoteId: string) => Promise<void>;
  loadAllQuotesFromDatabase: () => Promise<void>;
  deleteQuoteFromDatabase: (quoteId: string) => Promise<void>;
  
  // Loading state
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useQuoteStore = create<QuoteStore>((set, get) => ({
  currentQuote: null,
  quotes: [],
  loading: false,
  
  createQuote: (projectName: string, clientName: string, currency: string, deliveryDate?: Date, paymentTerms?: string) => {
    const newQuote: Quote = {
      id: uuidv4(),
      quoteNumber: generateQuoteNumber(),
      projectName,
      clientName,
      currency: currency as Currency,
      products: [],
      deliveryDate,
      paymentTerms,
      subtotal: 0,
      discountAmount: 0,
      shippingAmount: 0,
      vatAmount: 0,
      totalAmount: 0,
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    set(state => ({
      quotes: [...state.quotes, newQuote],
      currentQuote: newQuote
    }));
    
    return newQuote;
  },
  
  addProductToQuote: (product: QuoteProduct, quoteId?: string) => {
    set(state => {
      let targetQuote = quoteId 
        ? state.quotes.find(q => q.id === quoteId)
        : state.currentQuote;
        
      if (!targetQuote) {
        // Create a new quote if none exists
        targetQuote = get().createQuote(
          product.productName || 'New Project',
          'Client Name',
          product.currency
        );
      }
      
      const updatedProducts = [...targetQuote.products, product];
      const totals = calculateQuoteTotals(updatedProducts, targetQuote.discount, targetQuote.shipping);
      
      const updatedQuote = {
        ...targetQuote,
        products: updatedProducts,
        ...totals,
        updatedAt: new Date()
      };
      
      // Track quote generation when first product is added
      if (targetQuote.products.length === 0) {
        trackQuoteGenerated({
          quote_id: updatedQuote.id,
          project_id: product.id, // Use product ID as project reference
          product_count: 1,
          total_value: totals.totalAmount,
          currency: updatedQuote.currency,
          user_tier: 'free' // Should be updated based on user subscription
        });
      }
      
      const updatedQuotes = state.quotes.map(q => 
        q.id === updatedQuote.id ? updatedQuote : q
      );
      
      return {
        quotes: updatedQuotes,
        currentQuote: state.currentQuote?.id === updatedQuote.id ? updatedQuote : state.currentQuote
      };
    });
  },
  
  removeProductFromQuote: (productId: string, quoteId?: string) => {
    set(state => {
      const targetQuote = quoteId 
        ? state.quotes.find(q => q.id === quoteId)
        : state.currentQuote;
        
      if (!targetQuote) return state;
      
      const updatedProducts = targetQuote.products.filter(p => p.id !== productId);
      
      // If no products left, we might want to handle this differently
      // For now, recalculate totals with remaining products
      const totals = calculateQuoteTotals(updatedProducts, targetQuote.discount, targetQuote.shipping);
      
      const updatedQuote = {
        ...targetQuote,
        products: updatedProducts,
        ...totals,
        updatedAt: new Date()
      };
      
      const updatedQuotes = state.quotes.map(q => 
        q.id === updatedQuote.id ? updatedQuote : q
      );
      
      return {
        quotes: updatedQuotes,
        currentQuote: state.currentQuote?.id === updatedQuote.id ? updatedQuote : state.currentQuote
      };
    });
  },
  
  updateQuoteDiscount: (quoteId: string, discount?: DiscountInfo) => {
    set(state => {
      const quote = state.quotes.find(q => q.id === quoteId);
      if (!quote) return state;
      
      const totals = calculateQuoteTotals(quote.products, discount, quote.shipping);
      const updatedQuote = {
        ...quote,
        discount,
        ...totals,
        updatedAt: new Date()
      };
      
      const updatedQuotes = state.quotes.map(q => 
        q.id === quoteId ? updatedQuote : q
      );
      
      return {
        quotes: updatedQuotes,
        currentQuote: state.currentQuote?.id === quoteId ? updatedQuote : state.currentQuote
      };
    });
  },
  
  updateQuoteShipping: (quoteId: string, shipping?: ShippingInfo) => {
    set(state => {
      const quote = state.quotes.find(q => q.id === quoteId);
      if (!quote) return state;
      
      const totals = calculateQuoteTotals(quote.products, quote.discount, shipping);
      const updatedQuote = {
        ...quote,
        shipping,
        ...totals,
        updatedAt: new Date()
      };
      
      const updatedQuotes = state.quotes.map(q => 
        q.id === quoteId ? updatedQuote : q
      );
      
      return {
        quotes: updatedQuotes,
        currentQuote: state.currentQuote?.id === quoteId ? updatedQuote : state.currentQuote
      };
    });
  },
  
  finalizeQuote: (quoteId: string) => {
    // Mark quote as saved when finalized
    get().updateQuoteStatus(quoteId, 'saved');
    const state = get();
    const quote = state.quotes.find(q => q.id === quoteId);
    if (quote) {
      // Track quote finalization
      trackQuoteFinalized({
        quote_id: quote.id,
        project_id: quote.projectName,
        total_value: quote.totalAmount,
        currency: quote.currency,
        export_format: 'pdf',
        user_tier: 'free' // Should be updated based on user subscription
      });
      
      console.log('Finalizing quote:', quote);
    }
  },
  
  createProductFromProject: (project: PricingProject) => {
    if (!project.calculations || !project.productName) {
      return null;
    }
    
    // Use the calculated total sale price from P&L, not the raw input
    const calculatedUnitPrice = project.calculations.totalSalePrice / project.salePrice.unitsCount;
    const calculatedTotalPrice = project.calculations.totalSalePrice;
    
    const product: QuoteProduct = {
      id: uuidv4(),
      productName: project.productName,
      quantity: project.salePrice.unitsCount,
      unitPrice: calculatedUnitPrice,
      totalPrice: calculatedTotalPrice,
      calculations: project.calculations,
      materials: project.materials,
      costParameters: project.costParameters,
      vatSettings: project.vatSettings,
      currency: project.currency,
      addedAt: new Date()
    };
    
    return product;
  },
  
  setCurrentQuote: (quote: Quote | null) => {
    set({ currentQuote: quote });
  },
  
  resetCurrentQuote: () => {
    set({ currentQuote: null });
  },

  updateQuoteStatus: (quoteId: string, status: QuoteStatus) => {
    set(state => {
      const updatedQuotes = state.quotes.map(quote => 
        quote.id === quoteId 
          ? { 
              ...quote, 
              status, 
              finalizedAt: status === 'completed' ? new Date() : quote.finalizedAt,
              updatedAt: new Date() 
            }
          : quote
      );
      
      const updatedCurrentQuote = state.currentQuote?.id === quoteId 
        ? {
            ...state.currentQuote,
            status,
            finalizedAt: status === 'completed' ? new Date() : state.currentQuote.finalizedAt,
            updatedAt: new Date()
          }
        : state.currentQuote;

      return {
        quotes: updatedQuotes,
        currentQuote: updatedCurrentQuote
      };
    });
  },

  markQuoteAsCompleted: (quoteId: string) => {
    get().updateQuoteStatus(quoteId, 'completed');
  },

  getQuotesByStatus: (status: QuoteStatus) => {
    return get().quotes.filter(quote => quote.status === status);
  },
  
  recalculateQuoteWithVAT: (quoteId: string, vatSettings: { rate: number; isInclusive: boolean }) =>
    set((state) => {
      const quote = state.currentQuote?.id === quoteId ? state.currentQuote : state.quotes.find(q => q.id === quoteId);
      if (!quote) return state;

      const totals = calculateQuoteTotals(quote.products, quote.discount, quote.shipping, vatSettings);
      const updatedQuote = { ...quote, ...totals };

      if (state.currentQuote?.id === quoteId) {
        return {
          currentQuote: updatedQuote,
          quotes: state.quotes.map(q => q.id === quoteId ? updatedQuote : q)
        };
      } else {
        return {
          quotes: state.quotes.map(q => q.id === quoteId ? updatedQuote : q)
        };
      }
    }),

  // Database operations
  saveQuoteToDatabase: async (quoteId: string) => {
    const state = get();
    const quote = state.quotes.find(q => q.id === quoteId);
    if (!quote) throw new Error('Quote not found');

    set({ loading: true });
    
    try {
      // Try to save to cloud, but don't fail if user is not authenticated
      try {
        await saveQuote(quote);
      } catch (error) {
        if (error instanceof DatabaseError && error.message.includes('not authenticated')) {
          console.log('User not authenticated, quote saved locally only');
        } else {
          throw error;
        }
      }
      set({ loading: false });
    } catch (error) {
      set({ loading: false });
      console.error('Failed to save quote:', error);
      throw error;
    }
  },

  loadAllQuotesFromDatabase: async () => {
    set({ loading: true });
    
    try {
      const quotes = await loadAllQuotes();
      set({ quotes, loading: false });
    } catch (error) {
      set({ loading: false });
      // If user is not authenticated, just use local quotes
      if (error instanceof DatabaseError && error.message.includes('not authenticated')) {
        console.log('User not authenticated, using local quotes only');
        return;
      }
      console.error('Failed to load quotes:', error);
      throw error;
    }
  },

  deleteQuoteFromDatabase: async (quoteId: string) => {
    set({ loading: true });
    
    try {
      await deleteQuote(quoteId);
      
      // Update local quotes list
      set((state) => ({
        quotes: state.quotes.filter(q => q.id !== quoteId),
        currentQuote: state.currentQuote?.id === quoteId ? null : state.currentQuote,
        loading: false
      }));
    } catch (error) {
      set({ loading: false });
      console.error('Failed to delete quote:', error);
      throw error;
    }
  },

  setLoading: (loading: boolean) =>
    set({ loading }),

  // Find existing draft or create new one for auto-save
  findOrCreateDraftQuote: (projectName: string, clientName: string, currency: string) => {
    const state = get();
    
    // Look for existing draft with similar project/client name
    const existingDraft = state.quotes.find(quote => 
      quote.status === 'draft' && 
      quote.projectName === projectName &&
      quote.clientName === clientName
    );
    
    if (existingDraft) {
      // Update current quote to the existing draft
      set({ currentQuote: existingDraft });
      return existingDraft;
    }
    
    // Create new draft quote
    return get().createQuote(projectName, clientName, currency);
  },

  // Update quote with latest project data
  updateQuoteFromProject: (quoteId: string, project: PricingProject) => {
    const state = get();
    const quote = state.quotes.find(q => q.id === quoteId);
    if (!quote) return;

    // Create updated product from project
    const product = get().createProductFromProject(project);
    if (!product) return;

    const updatedProducts = [product]; // Replace existing products
    const totals = calculateQuoteTotals(updatedProducts, quote.discount, quote.shipping);
    
    const updatedQuote = {
      ...quote,
      projectName: project.projectName || quote.projectName,
      clientName: project.clientName || quote.clientName,
      currency: project.currency,
      deliveryDate: project.deliveryDate,
      paymentTerms: project.paymentTerms,
      products: updatedProducts,
      ...totals,
      updatedAt: new Date()
    };
    
    set(state => ({
      quotes: state.quotes.map(q => q.id === quoteId ? updatedQuote : q),
      currentQuote: state.currentQuote?.id === quoteId ? updatedQuote : state.currentQuote
    }));
  },
}));