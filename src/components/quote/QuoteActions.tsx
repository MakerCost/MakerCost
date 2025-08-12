'use client';

import { useState } from 'react';
import { usePricingStore } from '@/store/pricing-store';
import { useQuoteStore } from '@/store/quote-store';
import { useToast } from '@/contexts/ToastContext';

interface QuoteActionsProps {
  onFinalize?: () => void;
}

export default function QuoteActions({ onFinalize }: QuoteActionsProps) {
  const { currentProject, createNewProject } = usePricingStore();
  const { createProductFromProject, addProductToQuote, currentQuote, createQuote } = useQuoteStore();
  const { showSuccess, showError } = useToast();
  const [isAdding, setIsAdding] = useState(false);

  const resetForm = () => {
    // Preserve project info, currency, and overhead settings
    const projectName = currentProject.projectName;
    const clientName = currentProject.clientName;
    const projectDate = currentProject.projectDate;
    const currency = currentProject.currency;
    const vatSettings = currentProject.vatSettings;
    const overheadSettings = currentProject.costParameters.overhead;
    const machines = currentProject.costParameters.machines;
    
    // Create a new project which resets all fields
    createNewProject();
    
    // Restore the settings we want to keep
    setTimeout(() => {
      const { updateProjectInfo, updateCurrency, updateVATSettings, updateCostParameters, updateSalePrice } = usePricingStore.getState();
      
      // Restore project info
      updateProjectInfo({ 
        projectName, 
        clientName, 
        projectDate,
        productName: '' // Reset product name
      });
      
      // Restore currency and VAT settings
      updateCurrency(currency);
      updateVATSettings(vatSettings);
      
      // Restore overhead and machines, but reset labor hours
      updateCostParameters({
        machines: machines,
        labor: { hours: 0, ratePerHour: 0 }, // Reset labor time and rate
        depreciation: { amount: 0 },
        overhead: overheadSettings // Keep overhead settings
      });
      
      // Reset sale price and quantities
      updateSalePrice({
        amount: 0,
        isPerUnit: false,
        unitsCount: 1,
        fixedCharge: 0,
      });
    }, 0);
  };

  const validateProduct = (): string | null => {
    if (!currentProject.productName || currentProject.productName.trim() === '') {
      return 'Product name is required';
    }
    
    if (!currentProject.calculations) {
      return 'Please complete pricing calculations first';
    }
    
    if (!currentProject.salePrice.amount || currentProject.salePrice.amount <= 0) {
      return 'Please set a valid sale price';
    }
    
    return null;
  };

  const handleAddToQuote = async () => {
    const validationError = validateProduct();
    if (validationError) {
      showError(validationError);
      return;
    }

    setIsAdding(true);
    
    try {
      const product = createProductFromProject(currentProject);
      if (!product) {
        showError('Failed to create product from current data');
        return;
      }

      // Create quote if none exists
      let targetQuote = currentQuote;
      if (!targetQuote) {
        targetQuote = createQuote(
          currentProject.projectName || 'New Project',
          currentProject.clientName || 'Client Name',
          currentProject.currency,
          currentProject.deliveryDate,
          currentProject.paymentTerms
        );
      }

      addProductToQuote(product, targetQuote.id);
      
      const productCount = (targetQuote.products?.length || 0) + 1;
      showSuccess(`Product added to quote. Total products in quote: ${productCount}`);
      
      // Reset form
      resetForm();
      
    } catch (error) {
      console.error('Error adding product to quote:', error);
      showError('Failed to add product to quote');
    } finally {
      setIsAdding(false);
    }
  };

  const handleAddToQuoteAndFinalize = async () => {
    const validationError = validateProduct();
    if (validationError) {
      showError(validationError);
      return;
    }

    setIsAdding(true);
    
    try {
      const product = createProductFromProject(currentProject);
      if (!product) {
        showError('Failed to create product from current data');
        return;
      }

      // Create quote if none exists
      let targetQuote = currentQuote;
      if (!targetQuote) {
        targetQuote = createQuote(
          currentProject.projectName || 'New Project',
          currentProject.clientName || 'Client Name',
          currentProject.currency,
          currentProject.deliveryDate,
          currentProject.paymentTerms
        );
      }

      addProductToQuote(product, targetQuote.id);
      
      const productCount = (targetQuote.products?.length || 0) + 1;
      showSuccess(`Product added to quote. Total products in quote: ${productCount}`);
      
      // Reset form
      resetForm();
      
      // Open finalization modal/view
      if (onFinalize) {
        onFinalize();
      }
      
    } catch (error) {
      console.error('Error adding product to quote:', error);
      showError('Failed to add product to quote');
    } finally {
      setIsAdding(false);
    }
  };

  const hasValidCalculations = currentProject.calculations && currentProject.salePrice.amount > 0;
  const hasProductName = currentProject.productName && currentProject.productName.trim() !== '';
  const isValid = hasValidCalculations && hasProductName;
  const hasQuoteToView = currentQuote && currentQuote.products.length > 0;

  const handleViewQuote = () => {
    if (onFinalize) {
      onFinalize();
    }
  };


  return (
    <div className="bg-white rounded-lg shadow p-6 mt-6">
      <h2 className="text-xl font-bold mb-4">Quote Actions</h2>
      
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleAddToQuote}
            disabled={!isValid || isAdding}
            className={`flex-1 px-6 py-3 rounded-md font-medium transition-colors ${
              isValid && !isAdding
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isAdding ? 'Adding...' : 'Add to Quote'}
          </button>
          
          <button
            onClick={handleAddToQuoteAndFinalize}
            disabled={!isValid || isAdding}
            className={`flex-1 px-6 py-3 rounded-md font-medium transition-colors ${
              isValid && !isAdding
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isAdding ? 'Adding...' : 'Add to Quote and Finalize'}
          </button>
        </div>

        {hasQuoteToView && (
          <div className="flex justify-center">
            <button
              onClick={handleViewQuote}
              className="px-8 py-3 bg-purple-600 text-white rounded-md font-medium hover:bg-purple-700 transition-colors"
            >
              View Current Quote ({currentQuote?.products.length} product{currentQuote?.products.length !== 1 ? 's' : ''})
            </button>
          </div>
        )}
      </div>
      
      {!hasProductName && (
        <p className="text-red-500 text-sm mt-2">⚠ Product name is required</p>
      )}
      
      {!hasValidCalculations && hasProductName && (
        <p className="text-yellow-600 text-sm mt-2">⚠ Complete pricing calculations first</p>
      )}
      
      {currentQuote && currentQuote.products.length > 0 && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800 text-sm">
            📋 Current quote has {currentQuote.products.length} product{currentQuote.products.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}

    </div>
  );
}