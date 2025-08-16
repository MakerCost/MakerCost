'use client';

import { useState, useEffect } from 'react';
import { useQuoteStore } from '@/store/quote-store';
import { usePricingStore } from '@/store/pricing-store';
import { formatCurrencyWholeNumbers } from '@/lib/calculations';
import { CustomerType, DiscountInfo, ShippingInfo, FinalizeQuoteViewModel } from '@/types/pricing';
import { createFinalizeQuoteViewModel } from '@/lib/finalize-quote-calculations';
import { exportQuoteToPDF, exportQuoteToExcel } from '@/lib/exportUtils';
import ShippingModal from './ShippingModal';
import ExportSettings from '@/components/ui/ExportSettings';
import { ExportSettings as ExportSettingsType } from '@/types/pricing';

interface QuoteFinalizationModalNewProps {
  isOpen: boolean;
  onClose: () => void;
  quoteId?: string;
}

export default function QuoteFinalizationModalNew({ 
  isOpen, 
  onClose, 
  quoteId 
}: QuoteFinalizationModalNewProps) {
  const { currentQuote, quotes, finalizeQuote } = useQuoteStore();
  const { 
    currentProject, 
    updateExportSettings, 
    createNewProject,
    updateProjectInfo,
    addMaterial,
    updateCostParameters,
    updateProduction,
    removeMaterial,
    updateSalePrice
  } = usePricingStore();
  
  // State
  const [customerType, setCustomerType] = useState<CustomerType>('private');
  const [discount, setDiscount] = useState<DiscountInfo | undefined>(undefined);
  const [shipping, setShipping] = useState<ShippingInfo | undefined>(undefined);
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [showExportSettings, setShowExportSettings] = useState(false);
  
  // Discount form state
  const [discountType, setDiscountType] = useState<'fixed' | 'percentage'>('percentage');
  const [discountAmount, setDiscountAmount] = useState<string>('');

  // Get quote
  const quote = quoteId ? quotes.find(q => q.id === quoteId) : currentQuote;

  // Create view model
  const viewModel: FinalizeQuoteViewModel | null = quote 
    ? createFinalizeQuoteViewModel(quote, customerType, discount, shipping)
    : null;

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen && quote) {
      setCustomerType('private');
      setDiscount(quote.discount);
      setShipping(quote.shipping);
      setDiscountAmount(quote.discount?.amount.toString() || '');
      setDiscountType(quote.discount?.type || 'percentage');
    }
  }, [isOpen, quote]);

  if (!isOpen || !quote || !viewModel) return null;

  // Event handlers
  const handleDiscountSubmit = () => {
    const amount = parseFloat(discountAmount);
    if (isNaN(amount) || amount <= 0) {
      setDiscount(undefined);
      return;
    }

    setDiscount({
      type: discountType,
      amount,
    });
  };

  const handleRemoveDiscount = () => {
    setDiscount(undefined);
    setDiscountAmount('');
  };

  const handleShippingUpdate = (newShipping: ShippingInfo) => {
    setShipping(newShipping);
    setShowShippingModal(false);
  };

  const handleRemoveShipping = () => {
    setShipping(undefined);
  };

  const handleExportPDF = async () => {
    try {
      const exportSettings = currentProject.exportSettings || {
        includeBreakdown: true,
        showPerUnitCosts: false,
      };
      await exportQuoteToPDF(quote, exportSettings);
      finalizeQuote(quote.id);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF. Please try again.');
    }
  };

  const handleExportExcel = () => {
    try {
      exportQuoteToExcel(quote);
    } catch (error) {
      console.error('Error exporting Excel:', error);
      alert('Failed to export Excel file. Please try again.');
    }
  };

  const handleExportSettingsChange = (settings: ExportSettingsType) => {
    updateExportSettings(settings);
    setShowExportSettings(false);
  };

  const handleEditProduct = (productId: string) => {
    if (!quote) return;
    
    const product = quote.products.find(p => p.id === productId);
    if (!product) return;

    // Reset the form to a fresh state first
    createNewProject();

    // Wait for the reset to complete, then populate with product data
    setTimeout(() => {
      // Update project info with product data
      updateProjectInfo({
        productName: product.productName,
        projectName: quote.projectName,
        clientName: quote.clientName,
        projectDate: quote.createdAt
      });

      // Clear existing materials first
      currentProject.materials.forEach(material => {
        removeMaterial(material.id);
      });

      // Add materials from the product
      product.materials.forEach(material => {
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

    // Close the modal to return to editing
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Finalize Quote</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-2xl cursor-pointer"
              >
                ×
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Customer Type Toggle */}
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-6">
                <span className="font-semibold">Customer Type:</span>
                <div className="flex gap-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="customerType"
                      checked={customerType === 'private'}
                      onChange={() => setCustomerType('private')}
                      className="mr-2"
                    />
                    <span className="font-medium">Private Customer</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="customerType"
                      checked={customerType === 'business'}
                      onChange={() => setCustomerType('business')}
                      className="mr-2"
                    />
                    <span className="font-medium">Business Customer</span>
                  </label>
                </div>
                <span className="text-xs text-gray-600">
                  {customerType === 'private' 
                    ? 'Prices include VAT, breakdown shown for transparency'
                    : 'Prices exclude VAT, VAT calculated in totals'
                  }
                </span>
              </div>
            </div>

            {/* Quote Header */}
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Quote Details</h3>
                  <p><strong>Quote Number:</strong> {quote.quoteNumber}</p>
                  <p><strong>Project:</strong> {quote.projectName}</p>
                  <p><strong>Client:</strong> {quote.clientName}</p>
                  <p><strong>Date:</strong> {quote.createdAt.toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Currency</h3>
                  <p>{quote.currency}</p>
                </div>
              </div>
            </div>

            {/* Products Table */}
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-4">Products</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="border border-gray-300 px-4 py-2 text-left">Product Name</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Quantity</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">
                        Unit Price {customerType === 'private' ? '(incl. VAT)' : '(ex. VAT)'}
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-right">
                        Line Total {customerType === 'private' ? '(incl. VAT)' : '(ex. VAT)'}
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewModel.lineItems.map((item, index) => (
                      <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="border border-gray-300 px-4 py-2">{item.productName}</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">{item.quantity}</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">
                          {formatCurrencyWholeNumbers(
                            customerType === 'private' ? item.unitPriceIncVat : item.unitPriceExVat,
                            quote.currency
                          )}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-right">
                          {formatCurrencyWholeNumbers(
                            customerType === 'private' ? item.lineTotalIncVat : item.lineTotalExVat,
                            quote.currency
                          )}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          <button
                            onClick={() => handleEditProduct(item.id)}
                            className="px-3 py-1 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700 transition-colors cursor-pointer"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                    
                    {/* Shipping Line Item */}
                    {viewModel.shippingLine && (
                      <tr className="bg-blue-50">
                        <td className="border border-gray-300 px-4 py-2 font-medium">
                          {viewModel.shippingLine.isFreeShipping ? 'Free Shipping' : 'Shipping'}
                        </td>
                        <td className="border border-gray-300 px-4 py-2"></td>
                        <td className="border border-gray-300 px-4 py-2"></td>
                        <td className="border border-gray-300 px-4 py-2 text-right font-medium">
                          {viewModel.shippingLine.isFreeShipping 
                            ? 'Free'
                            : formatCurrencyWholeNumbers(
                                customerType === 'private' 
                                  ? viewModel.shippingLine.chargeIncVat 
                                  : viewModel.shippingLine.chargeExVat,
                                quote.currency
                              )
                          }
                        </td>
                        <td className="border border-gray-300 px-4 py-2"></td>
                      </tr>
                    )}
                    
                    {/* Empty spacing row */}
                    <tr>
                      <td className="border-0 px-4 py-2" colSpan={5}></td>
                    </tr>

                    {/* Subtotal Row (including shipping) */}
                    <tr className="bg-gray-100 font-bold">
                      <td className="border border-gray-300 px-4 py-2" colSpan={4}>
                        Subtotal:
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right">
                        {formatCurrencyWholeNumbers(
                          (() => {
                            const productsTotal = customerType === 'private' 
                              ? viewModel.lineItems.reduce((sum, item) => sum + item.lineTotalIncVat, 0)
                              : viewModel.lineItems.reduce((sum, item) => sum + item.lineTotalExVat, 0);
                            
                            const shippingTotal = viewModel.shippingLine 
                              ? (customerType === 'private' 
                                  ? viewModel.shippingLine.chargeIncVat 
                                  : viewModel.shippingLine.chargeExVat)
                              : 0;
                              
                            return productsTotal + shippingTotal;
                          })(),
                          quote.currency
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Discount Section */}
            <div className="mb-6 p-4 border rounded-lg">
              <h3 className="font-semibold text-lg mb-4">💰 Discount</h3>
              <div className="flex flex-wrap gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as 'fixed' | 'percentage')}
                    className="px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">
                      Fixed Amount ({quote.currency}) - {customerType === 'private' ? 'incl. VAT' : 'ex. VAT'}
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Amount</label>
                  <input
                    type="number"
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(e.target.value)}
                    placeholder={discountType === 'percentage' ? '10' : '100'}
                    className="px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <button
                  onClick={handleDiscountSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
                >
                  Apply
                </button>
                {viewModel.discount && (
                  <button
                    onClick={handleRemoveDiscount}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 cursor-pointer"
                  >
                    Remove
                  </button>
                )}
              </div>
              {viewModel.discount && (
                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                  <p className="text-green-800 text-sm">
                    Discount applied: {viewModel.discount.type === 'percentage' ? `${viewModel.discount.amount}%` : `${formatCurrencyWholeNumbers(viewModel.discount.amount, quote.currency)}`}
                    {' = '}
                    {formatCurrencyWholeNumbers(
                      customerType === 'private' 
                        ? viewModel.discount.appliedAmountIncVat 
                        : viewModel.discount.appliedAmountExVat,
                      quote.currency
                    )}
                  </p>
                </div>
              )}
            </div>

            {/* Shipping Section */}
            <div className="mb-6 p-4 border rounded-lg">
              <h3 className="font-semibold text-lg mb-4">🚚 Shipping</h3>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowShippingModal(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer"
                >
                  + Add Shipping
                </button>
                {shipping && (
                  <button
                    onClick={handleRemoveShipping}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 cursor-pointer"
                  >
                    Remove Shipping
                  </button>
                )}
              </div>
              {viewModel.shippingLine && (
                <div className="mt-2">
                  {viewModel.shippingLine.isFreeShipping ? (
                    <p className="text-green-600">
                      Free shipping (Cost: {formatCurrencyWholeNumbers(viewModel.shippingLine.costIncVat, quote.currency)} incl. VAT)
                    </p>
                  ) : (
                    <p className="text-blue-600">
                      Shipping charge: {formatCurrencyWholeNumbers(
                        customerType === 'private' 
                          ? viewModel.shippingLine.chargeIncVat 
                          : viewModel.shippingLine.chargeExVat,
                        quote.currency
                      )} {customerType === 'private' ? '(incl. VAT)' : '(ex. VAT)'}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Totals Section */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-4">Quote Summary</h3>
              
              {customerType === 'private' ? (
                // Private Customer Display
                <div className="space-y-3">
                  {viewModel.totals.vatInfoLine && (
                    <div className="text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Net amount (ex. VAT):</span>
                        <span>{formatCurrencyWholeNumbers(viewModel.totals.vatInfoLine.netAmount, quote.currency)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>VAT amount:</span>
                        <span>{formatCurrencyWholeNumbers(viewModel.totals.vatInfoLine.vatAmount, quote.currency)}</span>
                      </div>
                      {viewModel.discount && (
                        <div className="flex justify-between text-red-600">
                          <span>Discount (incl. VAT):</span>
                          <span>-{formatCurrencyWholeNumbers(viewModel.discount.appliedAmountIncVat, quote.currency)}</span>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-xl border-t pt-3">
                    <span>TOTAL (incl. VAT):</span>
                    <span>{formatCurrencyWholeNumbers(viewModel.totals.grandTotalIncVat!, quote.currency)}</span>
                  </div>
                </div>
              ) : (
                // Business Customer Display
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>SUBTOTAL (ex. VAT):</span>
                    <span>{formatCurrencyWholeNumbers(viewModel.totals.subtotalExVat!, quote.currency)}</span>
                  </div>
                  {viewModel.totals.discountExVat! > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>Discount (ex. VAT):</span>
                      <span>-{formatCurrencyWholeNumbers(viewModel.totals.discountExVat!, quote.currency)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>VAT ({quote.products[0]?.vatSettings.rate || 18}%):</span>
                    <span>{formatCurrencyWholeNumbers(viewModel.totals.vatAmount!, quote.currency)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-xl border-t pt-3">
                    <span>TOTAL INCL VAT:</span>
                    <span>{formatCurrencyWholeNumbers(viewModel.totals.totalIncVat!, quote.currency)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="sticky bottom-0 bg-gray-50 border-t p-6">
            <div className="flex justify-end items-center">
              <div className="flex gap-3">
                <button
                  onClick={handleExportExcel}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span>📊</span>
                  Export Excel
                </button>
                <button
                  onClick={() => setShowExportSettings(true)}
                  className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  PDF Settings
                </button>
                <button
                  onClick={handleExportPDF}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span>📄</span>
                  Export PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shipping Modal */}
      <ShippingModal
        isOpen={showShippingModal}
        onClose={() => setShowShippingModal(false)}
        onSubmit={handleShippingUpdate}
        currency={quote.currency}
      />

      {/* Export Settings Modal */}
      <ExportSettings
        settings={currentProject.exportSettings || {
          includeBreakdown: true,
          showPerUnitCosts: false,
        }}
        onSettingsChange={handleExportSettingsChange}
        isOpen={showExportSettings}
        onClose={() => setShowExportSettings(false)}
      />
    </>
  );
}