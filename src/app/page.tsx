'use client';

import MaterialList from '@/components/materials/MaterialList';
import CostParameters from '@/components/costs/CostParameters';
import PLBreakdown from '@/components/results/PLBreakdown';
import PricingInfo from '@/components/ui/PricingInfo';
import QuoteActions from '@/components/quote/QuoteActions';
import QuoteFinalizationModalNew from '@/components/quote/QuoteFinalizationModalNew';
import CloudSyncPromo from '@/components/auth/CloudSyncPromo';
import AutoSaveIndicator from '@/components/ui/AutoSaveIndicator';
import { usePricingStore } from '@/store/pricing-store';
import { useQuoteStore } from '@/store/quote-store';
import { useShopStore } from '@/store/shop-store';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/useToast';
import { useAutoSave } from '@/hooks/useAutoSave';
import { trackDemoDataLoaded } from '@/lib/analytics';
import { trackFeatureInteraction } from '@/lib/posthog-analytics';
import { trackFeatureUsed } from '@/lib/analytics/events';
import { trackUserExperience, trackCalculatorWorkflow } from '@/lib/posthog-product-analytics';
import PostHogSurvey, { calculatorFeedbackSurvey } from '@/components/feedback/PostHogSurvey';

function HomeContent() {
  const { 
    currentProject, 
    updateProjectInfo, 
    updateCurrency, 
    updateVATSettings, 
    updateSalePrice,
    loadRandomDemoData,
    createNewProject
  } = usePricingStore();
  const { currentQuote } = useQuoteStore();
  const { shopData } = useShopStore();
  const [showQuoteFinalize, setShowQuoteFinalize] = useState(false);
  const { addToast } = useToast();
  
  // Initialize auto-save functionality
  const { saveNow, hasMinimalContent, lastSaveTime } = useAutoSave({
    enabled: true,
    interval: 30000, // 30 seconds
  });

  // Sync calculator currency with shop currency on initial load
  useEffect(() => {
    if (shopData.currency && currentProject.currency !== shopData.currency) {
      updateCurrency(shopData.currency);
    }
  }, [shopData.currency, currentProject.currency, updateCurrency]);

  // Determine if fields should be locked (when quote has products)
  const isFieldsLocked = currentQuote && currentQuote.products.length > 0;

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
        feature_category: 'productivity',
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
      createNewProject(shopData.currency);
      addToast('Project reset successfully! All fields cleared to defaults.', 'success');
      
      // Track reset usage
      trackFeatureInteraction('project_reset', {
        success: true,
      });
      
      // Track with GA4
      trackFeatureUsed({
        feature_name: 'project_reset',
        feature_category: 'productivity',
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
          {/* Title Section */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Professional P&L Calculator</h1>
            <p className="text-gray-600 dark:text-gray-300">Calculate accurate pricing for your custom products and grow your maker business</p>
          </div>
          
          {/* Demo Data and Reset Buttons */}
          <div className="mt-6 text-center">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleDemoDataLoad}
                className="px-6 py-3 rounded-lg font-medium bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 cursor-pointer"
                title="Load realistic demo data for testing"
              >
                Load Demo Data
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-3 rounded-lg font-medium bg-gray-600 dark:bg-gray-500 text-white hover:bg-gray-700 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 cursor-pointer"
                title="Reset all fields to default values"
              >
                Reset Project
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

        {/* Project Info */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow dark:shadow-slate-700/10 p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Project Information</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Name</label>
              <input
                type="text"
                value={currentProject.projectName}
                onChange={(e) => updateProjectInfo({ projectName: e.target.value })}
                disabled={isFieldsLocked || false}
                className={`w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-left ${
                  isFieldsLocked ? 'bg-gray-100 dark:bg-slate-600 text-gray-500 dark:text-gray-400 cursor-not-allowed' : ''
                }`}
                style={{ textOverflow: 'ellipsis' }}
                placeholder="Enter project name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client Name</label>
              <input
                type="text"
                value={currentProject.clientName}
                onChange={(e) => updateProjectInfo({ clientName: e.target.value })}
                disabled={isFieldsLocked || false}
                className={`w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-left ${
                  isFieldsLocked ? 'bg-gray-100 dark:bg-slate-600 text-gray-500 dark:text-gray-400 cursor-not-allowed' : ''
                }`}
                style={{ textOverflow: 'ellipsis' }}
                placeholder="Enter client name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product Name *</label>
              <input
                type="text"
                value={currentProject.productName || ''}
                onChange={(e) => updateProjectInfo({ productName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-left"
                style={{ textOverflow: 'ellipsis' }}
                placeholder="Enter product name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Date</label>
              <input
                type="date"
                value={currentProject.projectDate instanceof Date ? currentProject.projectDate.toISOString().split('T')[0] : new Date(currentProject.projectDate).toISOString().split('T')[0]}
                onChange={(e) => updateProjectInfo({ projectDate: new Date(e.target.value) })}
                disabled={isFieldsLocked || false}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isFieldsLocked ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Delivery Date</label>
              <input
                type="date"
                value={currentProject.deliveryDate ? (currentProject.deliveryDate instanceof Date ? currentProject.deliveryDate.toISOString().split('T')[0] : new Date(currentProject.deliveryDate).toISOString().split('T')[0]) : ''}
                onChange={(e) => updateProjectInfo({ deliveryDate: e.target.value ? new Date(e.target.value) : undefined })}
                disabled={isFieldsLocked || false}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isFieldsLocked ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''
                }`}
                placeholder="Select delivery date"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Payment Terms</label>
              <input
                type="text"
                value={currentProject.paymentTerms || ''}
                onChange={(e) => updateProjectInfo({ paymentTerms: e.target.value })}
                disabled={isFieldsLocked || false}
                className={`w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-left ${
                  isFieldsLocked ? 'bg-gray-100 dark:bg-slate-600 text-gray-500 dark:text-gray-400 cursor-not-allowed' : ''
                }`}
                style={{ textOverflow: 'ellipsis' }}
                placeholder="e.g., Net 30, Due on receipt, 50% upfront"
              />
            </div>
          </div>
        </div>

        {/* Pricing Info - Consolidated Section */}
        <div className="mb-6">
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
          {/* Left Column - Materials and Parameters */}
          <div className="lg:col-span-2 space-y-6">
            <MaterialList currency={currentProject.currency} />
            <CostParameters />
            <QuoteActions onFinalize={() => setShowQuoteFinalize(true)} />
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-1">
            <PLBreakdown />
          </div>
        </div>
        
        {/* Quote Finalization Modal */}
        <QuoteFinalizationModalNew
          isOpen={showQuoteFinalize}
          onClose={() => setShowQuoteFinalize(false)}
        />

        {/* PostHog Survey for User Feedback */}
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
      </div>
  );
}

export default function Home() {
  return <HomeContent />;
}
