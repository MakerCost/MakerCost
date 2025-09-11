'use client';

import { useState, useEffect } from 'react';
import { usePricingStore } from '@/store/pricing-store';
import { useQuoteStore } from '@/store/quote-store';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/hooks/useAuth';
import { trackQuoteCreated, trackFeatureUsage } from '@/lib/analytics';
import { trackQuoteCreation, trackFeatureInteraction } from '@/lib/posthog-analytics';

interface QuoteGeneratorProps {
  onFinalize?: () => void;
}

export default function QuoteGenerator({ onFinalize }: QuoteGeneratorProps) {
  const { currentProject, createNewProject, updateProjectInfo } = usePricingStore();
  const { 
    createProductFromProject, 
    addProductToQuote, 
    currentQuote, 
    createQuote, 
    updateQuoteStatus,
    saveQuoteObjectToDatabase
  } = useQuoteStore();
  const { showSuccess, showError } = useToast();
  const { user } = useAuth();
  const [isAdding, setIsAdding] = useState(false);
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Clear status message after 5 seconds
  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => {
        setStatusMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  // Determine if date and payment fields should be locked (when quote has products)
  const isDateAndPaymentFieldsLocked = currentQuote && currentQuote.products.length > 0;
  // Determine if project and client name fields should be locked (when quote has products)
  const isProjectInfoFieldsLocked = currentQuote && currentQuote.products.length > 0;
  // Determine if user is signed in
  const isSignedIn = !!user;

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
      setShowValidationErrors(true);
      setStatusMessage({ type: 'error', message: validationError });
      return;
    }
    
    // Clear validation errors on successful validation
    setShowValidationErrors(false);
    setStatusMessage(null);

    setIsAdding(true);
    
    try {
      const product = createProductFromProject(currentProject);
      if (!product) {
        setStatusMessage({ type: 'error', message: 'Failed to create product from current data' });
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

      const updatedQuote = addProductToQuote(product, targetQuote.id);
      
      const productCount = updatedQuote.products.length;
      
      // Set success message
      setStatusMessage({ 
        type: 'success', 
        message: `✓ Product added to quote (${productCount} product${productCount !== 1 ? 's' : ''})${isSignedIn ? '. Saved to cloud!' : '. Sign in to save to "My Quotes"'}` 
      });
      
      // Automatically save quote as draft to database if user is signed in
      if (isSignedIn) {
        // Save the returned quote object directly
        const saveToCloud = async () => {
          try {
            await saveQuoteObjectToDatabase(updatedQuote);
            setStatusMessage({ 
              type: 'success', 
              message: `✓ Product added to quote (${productCount} product${productCount !== 1 ? 's' : ''}) and saved to "My Quotes"!` 
            });
          } catch (error) {
            console.error('Error saving quote to database:', error);
            if (error instanceof Error && error.message.includes('not authenticated')) {
              setStatusMessage({ type: 'error', message: 'Authentication required. Please sign in and try again.' });
            } else {
              setStatusMessage({ 
                type: 'success', 
                message: `✓ Product added to quote (${productCount} product${productCount !== 1 ? 's' : ''}). Could not sync to cloud - check connection.` 
              });
            }
          }
        };
        
        // Call the save function without blocking the UI
        saveToCloud();
      }
      
      // Track quote creation/update analytics
      const calculations = currentProject.calculations;
      if (calculations) {
        trackQuoteCreated(productCount, calculations.totalSalePrice, currentProject.currency);
        trackQuoteCreation({
          productCount: productCount,
          totalValue: calculations.totalSalePrice,
          currency: currentProject.currency,
          hasCustomMaterials: currentProject.materials.length > 0,
        });
      }
      
      // Reset form
      resetForm();
      
    } catch (error) {
      console.error('Error adding product to quote:', error);
      setStatusMessage({ type: 'error', message: 'Failed to add product to quote' });
    } finally {
      setIsAdding(false);
    }
  };

  const handleAddToQuoteAndFinalize = async () => {
    const validationError = validateProduct();
    if (validationError) {
      setShowValidationErrors(true);
      setStatusMessage({ type: 'error', message: validationError });
      return;
    }
    
    // Clear validation errors on successful validation
    setShowValidationErrors(false);
    setStatusMessage(null);

    setIsAdding(true);
    
    try {
      const product = createProductFromProject(currentProject);
      if (!product) {
        setStatusMessage({ type: 'error', message: 'Failed to create product from current data' });
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

      const updatedQuote = addProductToQuote(product, targetQuote.id);
      
      const productCount = updatedQuote.products.length;
      
      // Set success message
      setStatusMessage({ 
        type: 'success', 
        message: `✓ Product added to quote (${productCount} product${productCount !== 1 ? 's' : ''})${isSignedIn ? '. Saved to cloud!' : '. Sign in to save to "My Quotes"'}` 
      });
      
      // Automatically save quote as draft to database if user is signed in
      if (isSignedIn) {
        // Save the returned quote object directly
        const saveToCloud = async () => {
          try {
            await saveQuoteObjectToDatabase(updatedQuote);
            setStatusMessage({ 
              type: 'success', 
              message: `✓ Product added to quote (${productCount} product${productCount !== 1 ? 's' : ''}) and saved to "My Quotes"!` 
            });
          } catch (error) {
            console.error('Error saving quote to database:', error);
            if (error instanceof Error && error.message.includes('not authenticated')) {
              setStatusMessage({ type: 'error', message: 'Authentication required. Please sign in and try again.' });
            } else {
              setStatusMessage({ 
                type: 'success', 
                message: `✓ Product added to quote (${productCount} product${productCount !== 1 ? 's' : ''}). Could not sync to cloud - check connection.` 
              });
            }
          }
        };
        
        // Call the save function without blocking the UI
        saveToCloud();
      }
      
      // Track quote finalization analytics
      const calculations = currentProject.calculations;
      if (calculations) {
        trackFeatureUsage('quote_finalization_initiated');
        trackFeatureInteraction('quote_finalization', {
          context: 'add_and_finalize',
          value: calculations.totalSalePrice,
          success: true,
        });
      }
      
      // Reset form
      resetForm();
      
      // Open finalization modal/view
      if (onFinalize) {
        onFinalize();
      }
      
    } catch (error) {
      console.error('Error adding product to quote:', error);
      setStatusMessage({ type: 'error', message: 'Failed to add product to quote' });
    } finally {
      setIsAdding(false);
    }
  };

  const hasValidCalculations = currentProject.calculations && currentProject.salePrice.amount > 0;
  const hasProductName = currentProject.productName && currentProject.productName.trim() !== '';
  const hasUniqueProductName = !currentQuote || !currentQuote.products.some(product => 
    product.productName?.trim().toLowerCase() === currentProject.productName?.trim().toLowerCase()
  );
  
  const isValid = hasValidCalculations && hasProductName && hasUniqueProductName;
  const hasQuoteToView = currentQuote && currentQuote.products.length > 0;

  const handleViewQuote = () => {
    if (onFinalize) {
      onFinalize();
    }
  };


  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow dark:shadow-slate-700/10 p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Quote Generator</h2>
        {!isSignedIn && (
          <div className="text-sm text-gray-500 dark:text-gray-400 italic">
            💡 Sign in to save your project information and access additional features
          </div>
        )}
      </div>
      
      {/* Project Information Section */}
      <div className={`mb-6 p-4 border rounded-lg ${!isSignedIn ? 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600' : 'bg-white dark:bg-slate-700/50 border-gray-200 dark:border-gray-600'}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className={`text-lg font-semibold ${!isSignedIn ? 'text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
            Project Information
          </h3>
        </div>
        <div className="space-y-4">
          {/* First Row: Project Name, Client Name, Product Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${(!isSignedIn || isProjectInfoFieldsLocked) ? 'text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
                Project Name
              </label>
              <input
                type="text"
                value={currentProject.projectName}
                onChange={(e) => updateProjectInfo({ projectName: e.target.value })}
                disabled={!isSignedIn || isProjectInfoFieldsLocked}
                className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-left ${
                  (!isSignedIn || isProjectInfoFieldsLocked) ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed' : 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white'
                }`}
                style={{ textOverflow: 'ellipsis' }}
                placeholder={!isSignedIn ? 'Sign in to save project data' : isProjectInfoFieldsLocked ? 'Locked after adding products' : 'Enter project name'}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${(!isSignedIn || isProjectInfoFieldsLocked) ? 'text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
                Client Name
              </label>
              <input
                type="text"
                value={currentProject.clientName}
                onChange={(e) => updateProjectInfo({ clientName: e.target.value })}
                disabled={!isSignedIn || isProjectInfoFieldsLocked}
                className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-left ${
                  (!isSignedIn || isProjectInfoFieldsLocked) ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed' : 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white'
                }`}
                style={{ textOverflow: 'ellipsis' }}
                placeholder={!isSignedIn ? 'Sign in to save client data' : isProjectInfoFieldsLocked ? 'Locked after adding products' : 'Enter client name'}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${!isSignedIn ? 'text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
                Product Name *
              </label>
              <input
                type="text"
                value={currentProject.productName || ''}
                onChange={(e) => {
                  updateProjectInfo({ productName: e.target.value });
                  // Clear validation errors when user starts typing
                  if (showValidationErrors && e.target.value.trim()) {
                    setShowValidationErrors(false);
                  }
                }}
                disabled={!isSignedIn}
                className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-left ${
                  !isSignedIn ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed' : 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white'
                }`}
                style={{ textOverflow: 'ellipsis' }}
                placeholder={!isSignedIn ? 'Sign in to enter product name' : 'Enter product name'}
                required
              />
            </div>
          </div>
          
          {/* Second Row: Project Date, Delivery Date, Payment Terms */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${!isSignedIn ? 'text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
                Project Date
              </label>
              <input
                type="date"
                value={currentProject.projectDate instanceof Date ? currentProject.projectDate.toISOString().split('T')[0] : new Date(currentProject.projectDate).toISOString().split('T')[0]}
                onChange={(e) => updateProjectInfo({ projectDate: new Date(e.target.value) })}
                disabled={isDateAndPaymentFieldsLocked || !isSignedIn}
                className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${
                  (isDateAndPaymentFieldsLocked || !isSignedIn) ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed' : 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white'
                }`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${!isSignedIn ? 'text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
                Delivery Date
              </label>
              <input
                type="date"
                value={currentProject.deliveryDate ? (currentProject.deliveryDate instanceof Date ? currentProject.deliveryDate.toISOString().split('T')[0] : new Date(currentProject.deliveryDate).toISOString().split('T')[0]) : ''}
                onChange={(e) => updateProjectInfo({ deliveryDate: e.target.value ? new Date(e.target.value) : undefined })}
                disabled={isDateAndPaymentFieldsLocked || !isSignedIn}
                className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${
                  (isDateAndPaymentFieldsLocked || !isSignedIn) ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed' : 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white'
                }`}
                placeholder={!isSignedIn ? 'Sign in to set delivery date' : 'Select delivery date'}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${!isSignedIn ? 'text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
                Payment Terms
              </label>
              <input
                type="text"
                value={currentProject.paymentTerms || ''}
                onChange={(e) => updateProjectInfo({ paymentTerms: e.target.value })}
                disabled={isDateAndPaymentFieldsLocked || !isSignedIn}
                className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-left ${
                  (isDateAndPaymentFieldsLocked || !isSignedIn) ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed' : 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white'
                }`}
                style={{ textOverflow: 'ellipsis' }}
                placeholder={!isSignedIn ? 'Sign in to set payment terms' : 'e.g., Net 30, Due on receipt, 50% upfront'}
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleAddToQuote}
            disabled={!isValid || isAdding}
            className={`flex-1 px-6 py-3 rounded-md font-medium transition-colors ${
              isValid && !isAdding
                ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
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
                ? 'bg-green-600 text-white hover:bg-green-700 cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isAdding ? 'Adding...' : 'Add to Quote and Finalize'}
          </button>
        </div>

        {statusMessage && (
          <div className={`text-center text-sm font-medium ${
            statusMessage.type === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}>
            {statusMessage.message}
          </div>
        )}

        {hasQuoteToView && (
          <div className="flex justify-center">
            <button
              onClick={handleViewQuote}
              className="px-8 py-3 bg-purple-600 text-white rounded-md font-medium hover:bg-purple-700 transition-colors cursor-pointer"
            >
              View Current Quote ({currentQuote?.products.length} product{currentQuote?.products.length !== 1 ? 's' : ''})
            </button>
          </div>
        )}
      </div>
      
      {showValidationErrors && !hasProductName && (
        <p className="text-red-500 text-sm mt-2">⚠ Product name is required</p>
      )}
      
      {showValidationErrors && !hasValidCalculations && hasProductName && (
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