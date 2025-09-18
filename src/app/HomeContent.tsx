'use client';

import MaterialList from '@/components/materials/MaterialList';
import CostParameters from '@/components/costs/CostParameters';
import PLBreakdown from '@/components/results/PLBreakdown';
import PricingInfo from '@/components/ui/PricingInfo';
import QuoteGenerator from '@/components/quote/QuoteGenerator';
import QuoteFinalizationModalNew from '@/components/quote/QuoteFinalizationModalNew';
import CloudSyncPromo from '@/components/auth/CloudSyncPromo';
import AutoSaveIndicator from '@/components/ui/AutoSaveIndicator';
import ProductSwitcher from '@/components/ui/ProductSwitcher';
import QuoteInfoBar from '@/components/ui/QuoteInfoBar';
import { usePricingStore } from '@/store/pricing-store';
import { useQuoteStore } from '@/store/quote-store';
import { useShopStore } from '@/store/shop-store';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/useToast';
import { useAuth } from '@/hooks/useAuth';
import { useAutoSave } from '@/hooks/useAutoSave';
import { useProfile } from '@/hooks/useProfile';
import { useDisableNumberInputScroll } from '@/hooks/useDisableNumberInputScroll';
import { trackDemoDataLoaded } from '@/lib/analytics';
import { trackFeatureInteraction } from '@/lib/posthog-analytics';
import { trackFeatureUsed } from '@/lib/analytics/events';
import { trackUserExperience, trackCalculatorWorkflow } from '@/lib/posthog-product-analytics';
import PostHogSurvey, { calculatorFeedbackSurvey } from '@/components/feedback/PostHogSurvey';

export default function HomeContent() {
  const {
    currentProject,
    updateProjectInfo,
    updateCurrency,
    updateVATSettings,
    updateSalePrice,
    loadRandomDemoData,
    createNewProject,
    addMaterial,
    updateCostParameters,
    updateProduction,
    removeMaterial
  } = usePricingStore();
  const { currentQuote, quotes, getQuotesByStatus, setCurrentQuote, updateQuoteFromProject, createProductFromProject } = useQuoteStore();
  const { shopData } = useShopStore();
  const { user } = useAuth();
  const { profile } = useProfile();
  const [showQuoteFinalize, setShowQuoteFinalize] = useState(false);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [isMultiProductEditMode, setIsMultiProductEditMode] = useState(false);
  const { addToast } = useToast();
  const searchParams = useSearchParams();
  
  // Initialize auto-save functionality
  const { saveNow, hasMinimalContent, lastSaveTime } = useAutoSave({
    enabled: true,
    interval: 30000, // 30 seconds
  });

  // Disable mouse wheel scrolling on number inputs globally
  useDisableNumberInputScroll();

  // Sync calculator currency and VAT rate with shop data for logged-in users
  useEffect(() => {
    if (user && shopData.currency && currentProject.currency !== shopData.currency) {
      updateCurrency(shopData.currency);
    }
  }, [user, shopData.currency, currentProject.currency, updateCurrency]);

  useEffect(() => {
    if (user && shopData.vatRate && currentProject.vatSettings.rate !== shopData.vatRate) {
      updateVATSettings({
        ...currentProject.vatSettings,
        rate: shopData.vatRate
      });
    }
  }, [user, shopData.vatRate, currentProject.vatSettings, updateVATSettings]);

  // Auto-save current product changes in multi-product edit mode
  useEffect(() => {
    if (isMultiProductEditMode && currentQuote && currentProject.calculations) {
      // Debounce auto-save to avoid excessive saves
      const timeoutId = setTimeout(() => {
        saveCurrentProductToQuote();
      }, 2000); // Save after 2 seconds of inactivity

      return () => clearTimeout(timeoutId);
    }
  }, [isMultiProductEditMode, currentProject, currentQuote]);

  // Handle URL parameter for loading quotes from edit button
  useEffect(() => {
    const quoteId = searchParams.get('quote');
    if (quoteId) {
      const quote = quotes.find(q => q.id === quoteId);
      if (quote && quote.products.length > 0) {
        loadQuoteForEditing(quote);
      }
    }
  }, [searchParams, quotes]);

  // Determine if fields should be locked (when quote has products)
  const isFieldsLocked = currentQuote && currentQuote.products.length > 0;

  // Load complete quote for editing (preserves all products, shipping, discounts)
  const loadQuoteForEditing = (quote: any) => {
    try {
      // Set the complete quote as current quote (preserves all data)
      setCurrentQuote(quote);

      // Enable multi-product edit mode if quote has multiple products
      setIsMultiProductEditMode(quote.products.length > 1);
      setCurrentProductIndex(0);

      // Load the first product into the calculator
      loadProductIntoCalculator(quote.products[0]);

      addToast(
        `Loaded quote: ${quote.projectName} (${quote.products.length} product${quote.products.length > 1 ? 's' : ''})`,
        'success'
      );
    } catch (error) {
      console.error('Error loading quote for editing:', error);
      addToast('Failed to load quote. Please try again.', 'error');
    }
  };

  // Load a specific product into the calculator form
  const loadProductIntoCalculator = (product: any) => {
    try {
      // Reset the form to a fresh state first
      createNewProject();

      // Wait for the reset to complete, then populate with product data
      setTimeout(() => {
        // Update project info with product data
        updateProjectInfo({
          productName: product.productName,
          projectName: currentQuote?.projectName || '',
          clientName: currentQuote?.clientName || '',
          projectDate: currentQuote?.createdAt ? new Date(currentQuote.createdAt) : new Date()
        });

        // Clear existing materials first
        currentProject.materials.forEach(material => {
          removeMaterial(material.id);
        });

        // Add materials from the product
        product.materials.forEach((material: any) => {
          const { id, ...materialData } = material; // Remove id to create new
          addMaterial(materialData);
        });

        // Update cost parameters if available
        if (product.calculations) {
          updateCostParameters({
            machines: [], // Will be populated if data exists
            labor: {
              hours: product.calculations.operatingExpenses.laborCosts / (product.calculations.operatingExpenses.laborCosts / product.quantity || 1),
              ratePerHour: product.calculations.operatingExpenses.laborCosts / product.quantity || 0
            },
            depreciation: { amount: 0 },
            overhead: { ratePerHour: product.calculations.operatingExpenses.overhead / product.quantity || 0 }
          });

          updateProduction({
            unitsProduced: product.quantity,
            targetProfitMargin: 30 // Default, as this isn't stored in the product
          });
        }

        // Update sale price
        updateSalePrice({
          amount: product.unitPrice,
          isPerUnit: true,
          unitsCount: product.quantity,
          fixedCharge: 0
        });
      }, 100);
    } catch (error) {
      console.error('Error loading product into calculator:', error);
      addToast('Failed to load product. Please try again.', 'error');
    }
  };

  const handleContinueDraft = (quote: any) => {
    if (quote.products.length > 0) {
      loadQuoteForEditing(quote);
      setShowDraftModal(false);
    }
  };

  // Save current product changes back to the quote
  const saveCurrentProductToQuote = () => {
    if (!currentQuote || !currentProject.calculations) return;

    try {
      // Create updated product from current project
      const updatedProduct = createProductFromProject(currentProject);
      if (!updatedProduct) return;

      // Update the specific product in the quote
      const updatedProducts = [...currentQuote.products];
      updatedProducts[currentProductIndex] = {
        ...updatedProducts[currentProductIndex],
        ...updatedProduct,
        id: updatedProducts[currentProductIndex].id // Preserve original ID
      };

      // Update the quote with the modified products
      const updatedQuote = {
        ...currentQuote,
        products: updatedProducts,
        updatedAt: new Date()
      };

      setCurrentQuote(updatedQuote);
    } catch (error) {
      console.error('Error saving product to quote:', error);
      addToast('Failed to save product changes.', 'error');
    }
  };

  // Switch to a different product in the multi-product quote
  const handleProductSwitch = (newProductIndex: number) => {
    if (!currentQuote || newProductIndex === currentProductIndex) return;

    try {
      // Save current product changes first
      saveCurrentProductToQuote();

      // Switch to new product
      setCurrentProductIndex(newProductIndex);
      loadProductIntoCalculator(currentQuote.products[newProductIndex]);

      addToast(`Switched to: ${currentQuote.products[newProductIndex].productName}`, 'success');
    } catch (error) {
      console.error('Error switching product:', error);
      addToast('Failed to switch product. Please try again.', 'error');
    }
  };

  // Exit multi-product edit mode
  const handleExitMultiProductMode = () => {
    // Save current product changes first
    saveCurrentProductToQuote();

    // Reset states
    setIsMultiProductEditMode(false);
    setCurrentProductIndex(0);

    addToast('Exited multi-product edit mode.', 'info');
  };

  const handleDemoDataLoad = () => {
    try {
      loadRandomDemoData(isFieldsLocked || false);
      const message = isFieldsLocked 
        ? 'Demo data loaded successfully! Locked fields preserved, available fields updated.'
        : 'Demo data loaded successfully! All fields populated with realistic values.';
      addToast(message, 'success');
      
      // Track demo data usage
      trackDemoDataLoaded();
      trackFeatureInteraction('demo_data_load', {
        context: isFieldsLocked ? 'locked_fields' : 'full_load',
        success: true,
      });
      
      // Track with GA4
      trackFeatureUsed({
        feature_name: 'demo_data_load',
        feature_category: 'materials',
        user_tier: 'free', // Should be updated based on user subscription
        success: true,
        context: isFieldsLocked ? 'locked_fields' : 'full_load'
      });

      // Track with PostHog for product analytics
      trackUserExperience.helpInteraction('demo_data', 'helpful');
      trackCalculatorWorkflow.startSession('demo_project');
    } catch {
      addToast('Failed to load demo data. Please try again.', 'error');
      trackFeatureInteraction('demo_data_load', {
        success: false,
      });
    }
  };

  const handleReset = () => {
    try {
      // If in multi-product edit mode, exit it first
      if (isMultiProductEditMode) {
        setIsMultiProductEditMode(false);
        setCurrentProductIndex(0);
        setCurrentQuote(null);
      }

      createNewProject(shopData.currency);
      addToast('Project reset successfully! All fields cleared to defaults.', 'success');

      // Track reset usage
      trackFeatureInteraction('project_reset', {
        success: true,
      });

      // Track with GA4
      trackFeatureUsed({
        feature_name: 'project_reset',
        feature_category: 'pricing',
        user_tier: 'free', // Should be updated based on user subscription
        success: true
      });
    } catch {
      addToast('Failed to reset project. Please try again.', 'error');
      trackFeatureInteraction('project_reset', {
        success: false,
      });
    }
  };


  return (
    <div className="bg-gray-50 dark:bg-slate-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          {/* Demo Data and Reset Buttons */}
          <div className="mt-6 text-center">
            <div className="flex flex-row gap-2 justify-center">
              {/* Only show demo data button to admin users */}
              {profile?.is_admin && (
                <button
                  onClick={handleDemoDataLoad}
                  className="px-4 py-3 rounded-lg font-medium bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 cursor-pointer text-sm"
                  title="Load demo data"
                >
                  Demo
                </button>
              )}
              {/* Continue Draft Button - only show if drafts exist */}
              {getQuotesByStatus('draft').length > 0 && (
                <button
                  onClick={() => setShowDraftModal(true)}
                  className="px-4 py-3 rounded-lg font-medium bg-green-600 dark:bg-green-500 text-white hover:bg-green-700 dark:hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 cursor-pointer text-sm"
                  title="Continue draft"
                >
                  Draft ({getQuotesByStatus('draft').length})
                </button>
              )}
              <button
                onClick={handleReset}
                className="px-4 py-3 rounded-lg font-medium bg-gray-600 dark:bg-gray-500 text-white hover:bg-gray-700 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 cursor-pointer text-sm"
                title="Reset project"
              >
                Reset
              </button>
            </div>
            
            {/* Auto-save indicator */}
            <div className="mt-3 flex justify-center">
              <AutoSaveIndicator 
                lastSaveTime={lastSaveTime}
                hasMinimalContent={hasMinimalContent}
              />
            </div>
          </div>
        </div>

        {/* Cloud Sync Promotion for Guest Users */}
        <CloudSyncPromo feature="save your projects" />

        {/* Multi-Product Edit Mode Components */}
        {isMultiProductEditMode && currentQuote && (
          <>
            <ProductSwitcher
              quote={currentQuote}
              currentProductIndex={currentProductIndex}
              onProductSwitch={handleProductSwitch}
              onViewQuoteOverview={() => setShowQuoteFinalize(true)}
            />
            <QuoteInfoBar
              quote={currentQuote}
              currentProductIndex={currentProductIndex}
            />
          </>
        )}

        {/* Pricing Info - Consolidated Section */}
        <div className="mb-4 sm:mb-6">
          <PricingInfo
            currency={currentProject.currency}
            vatSettings={currentProject.vatSettings}
            salePrice={currentProject.salePrice}
            onCurrencyChange={updateCurrency}
            onVATChange={updateVATSettings}
            onSalePriceChange={updateSalePrice}
            isFieldsLocked={isFieldsLocked || false}
          />
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Input Sections */}
          <div className="lg:col-span-2 space-y-6">
            <MaterialList currency={currentProject.currency} />
            <CostParameters />

            {/* P&L Breakdown - Show here on mobile, hidden on desktop */}
            <div className="block lg:hidden">
              <PLBreakdown />
            </div>

            <QuoteGenerator onFinalize={() => setShowQuoteFinalize(true)} />

            {/* PostHog Survey - Positioned statically under Quote Generator on mobile, floating on desktop */}
            <PostHogSurvey
              config={calculatorFeedbackSurvey}
              onComplete={(responses) => {
                console.log('Survey completed:', responses);
                // Additional handling if needed
              }}
              onDismiss={() => {
                console.log('Survey dismissed');
              }}
            />
          </div>

          {/* Right Column - Results - Hidden on mobile, show on desktop */}
          <div className="hidden lg:block space-y-6">
            <div className="lg:sticky lg:top-4">
              <PLBreakdown />
            </div>
          </div>
        </div>
        
        {/* Quote Finalization Modal */}
        <QuoteFinalizationModalNew
          isOpen={showQuoteFinalize}
          onClose={() => setShowQuoteFinalize(false)}
          quoteId={isMultiProductEditMode && currentQuote ? currentQuote.id : undefined}
        />

        {/* Continue Draft Modal */}
        {showDraftModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Continue Draft</h2>
                  <button
                    onClick={() => setShowDraftModal(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
                  >
                    ×
                  </button>
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Select a draft quote to continue working on:
                </p>

                <div className="space-y-3">
                  {getQuotesByStatus('draft').map((quote) => (
                    <div
                      key={quote.id}
                      className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={() => handleContinueDraft(quote)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {quote.projectName}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Client: {quote.clientName}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Quote: {quote.quoteNumber}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {quote.products.length} product{quote.products.length !== 1 ? 's' : ''}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(quote.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setShowDraftModal(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        </div>
      </div>
  );
}