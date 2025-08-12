'use client';

import Image from 'next/image';
import MaterialsList from '@/components/materials/MaterialsList';
import CostParameters from '@/components/costs/CostParameters';
import PLBreakdown from '@/components/results/PLBreakdown';
import PricingInfo from '@/components/ui/PricingInfo';
import QuoteActions from '@/components/quote/QuoteActions';
import QuoteFinalizationModal from '@/components/quote/QuoteFinalizationModal';
import { usePricingStore } from '@/store/pricing-store';
import { useQuoteStore } from '@/store/quote-store';
import { ToastProvider } from '@/contexts/ToastContext';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/useToast';

function HomeContent() {
  const { 
    currentProject, 
    updateProjectInfo, 
    updateCurrency, 
    updateVATSettings, 
    updateSalePrice,
    loadRandomDemoData
  } = usePricingStore();
  const { currentQuote } = useQuoteStore();
  const [showQuoteFinalize, setShowQuoteFinalize] = useState(false);
  const { addToast } = useToast();

  // Determine if fields should be locked (when quote has products)
  const isFieldsLocked = currentQuote && currentQuote.products.length > 0;

  const handleDemoDataLoad = () => {
    try {
      loadRandomDemoData(isFieldsLocked);
      const message = isFieldsLocked 
        ? 'Demo data loaded successfully! Locked fields preserved, available fields updated.'
        : 'Demo data loaded successfully! All fields populated with realistic values.';
      addToast(message, 'success');
    } catch {
      addToast('Failed to load demo data. Please try again.', 'error');
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Moved to Very Top */}
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <Image 
              src="/makercost-logo.png" 
              alt="MakerCost Logo" 
              width={200}
              height={64}
              className="h-16 w-auto"
              priority
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">MakerCost</h1>
          <p className="text-gray-600">Professional P&L calculator for makers and custom product businesses</p>
          
          {/* Demo Data Button */}
          <div className="mt-6">
            <button
              onClick={handleDemoDataLoad}
              className="px-6 py-3 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              title="Load realistic demo data for testing"
            >
              Load Demo Data
            </button>
          </div>
        </div>

        {/* Project Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Project Information</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Project Name</label>
              <input
                type="text"
                value={currentProject.projectName}
                onChange={(e) => updateProjectInfo({ projectName: e.target.value })}
                disabled={isFieldsLocked}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isFieldsLocked ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''
                }`}
                placeholder="Enter project name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Client Name</label>
              <input
                type="text"
                value={currentProject.clientName}
                onChange={(e) => updateProjectInfo({ clientName: e.target.value })}
                disabled={isFieldsLocked}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isFieldsLocked ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''
                }`}
                placeholder="Enter client name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Product Name *</label>
              <input
                type="text"
                value={currentProject.productName || ''}
                onChange={(e) => updateProjectInfo({ productName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter product name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Project Date</label>
              <input
                type="date"
                value={currentProject.projectDate.toISOString().split('T')[0]}
                onChange={(e) => updateProjectInfo({ projectDate: new Date(e.target.value) })}
                disabled={isFieldsLocked}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isFieldsLocked ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Delivery Date</label>
              <input
                type="date"
                value={currentProject.deliveryDate ? currentProject.deliveryDate.toISOString().split('T')[0] : ''}
                onChange={(e) => updateProjectInfo({ deliveryDate: e.target.value ? new Date(e.target.value) : undefined })}
                disabled={isFieldsLocked}
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
                disabled={isFieldsLocked}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isFieldsLocked ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''
                }`}
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
            isFieldsLocked={isFieldsLocked}
          />
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Materials and Parameters */}
          <div className="lg:col-span-2 space-y-6">
            <MaterialsList />
            <CostParameters />
            <QuoteActions onFinalize={() => setShowQuoteFinalize(true)} />
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-1">
            <PLBreakdown />
          </div>
        </div>
        
        {/* Quote Finalization Modal */}
        <QuoteFinalizationModal
          isOpen={showQuoteFinalize}
          onClose={() => setShowQuoteFinalize(false)}
        />
        </div>
      </div>
  );
}

export default function Home() {
  return (
    <ToastProvider>
      <HomeContent />
    </ToastProvider>
  );
}
