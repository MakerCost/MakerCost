'use client';

import { useState, useEffect } from 'react';
import { useQuoteStore } from '@/store/quote-store';
import { usePricingStore } from '@/store/pricing-store';
import { useShopStore } from '@/store/shop-store';
import { formatCurrencyWholeNumbers } from '@/lib/calculations';
import { DiscountInfo, ShippingInfo } from '@/types/pricing';
import { exportQuoteToPDF, exportQuoteToExcel } from '@/lib/exportUtils';
import ShippingModal from './ShippingModal';

interface QuoteFinalizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  quoteId?: string;
}

export default function QuoteFinalizationModal({ isOpen, onClose, quoteId }: QuoteFinalizationModalProps) {
  const { currentQuote, quotes, updateQuoteDiscount, updateQuoteShipping, finalizeQuote, recalculateQuoteWithVAT } = useQuoteStore();
  const { currentProject, updateProjectInfo, updateSalePrice, addMaterial, updateCostParameters, updateProduction, removeMaterial, createNewProject } = usePricingStore();
  const { getShopDataForExport } = useShopStore();
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [discountType, setDiscountType] = useState<'fixed' | 'percentage'>('percentage');
  const [discountAmount, setDiscountAmount] = useState<string>('');
  const [pendingDiscount, setPendingDiscount] = useState<{ type: 'fixed' | 'percentage'; amount: number } | null>(null);
  const [showVatPrompt, setShowVatPrompt] = useState(false);
  const [localQuoteComments, setLocalQuoteComments] = useState<string>('');

  // Initialize quote comments from shop settings
  useEffect(() => {
    if (isOpen) {
      const shopData = getShopDataForExport();
      setLocalQuoteComments(shopData.quoteComments);
    }
  }, [isOpen, getShopDataForExport]);

  // Get quote before using it in useEffect
  const quote = quoteId ? quotes.find(q => q.id === quoteId) : currentQuote;

  // Recalculate quote with current VAT settings when modal opens
  useEffect(() => {
    if (isOpen && quote) {
      recalculateQuoteWithVAT(quote.id, currentProject.vatSettings);
    }
  }, [isOpen, quote, currentProject.vatSettings, recalculateQuoteWithVAT]);

  if (!isOpen) return null;
  if (!quote) return null;

  const handleDiscountChange = () => {
    const amount = parseFloat(discountAmount);
    if (isNaN(amount) || amount < 0) {
      // Remove discount if invalid
      updateQuoteDiscount(quote.id, undefined);
      return;
    }

    const discount: DiscountInfo = {
      type: discountType,
      amount
    };

    // For fixed discounts, show VAT clarification prompt
    if (discountType === 'fixed') {
      setPendingDiscount(discount);
      setShowVatPrompt(true);
    } else {
      updateQuoteDiscount(quote.id, discount);
    }
  };

  const handleVatDiscountConfirm = (includesVat: boolean) => {
    if (!quote) return;
    
    const amount = parseFloat(discountAmount);
    if (isNaN(amount) || amount < 0) return;

    let finalDiscount = {
      type: discountType as 'fixed' | 'percentage',
      amount
    };
    
    // Only adjust for fixed discounts, percentage discounts don't need VAT adjustment
    if (discountType === 'fixed') {
      // If the discount includes VAT, but the prices are VAT inclusive, no adjustment needed
      // If the discount excludes VAT, but the prices are VAT inclusive, add VAT to the discount
      if (!includesVat && quote.products[0]?.vatSettings.isInclusive) {
        const vatRate = quote.products[0].vatSettings.rate;
        finalDiscount = {
          ...finalDiscount,
          amount: amount * (1 + vatRate / 100)
        };
      }
      // If the discount includes VAT, but the prices are VAT exclusive, subtract VAT from the discount
      else if (includesVat && !quote.products[0]?.vatSettings.isInclusive) {
        const vatRate = quote.products[0].vatSettings.rate;
        finalDiscount = {
          ...finalDiscount,
          amount: amount / (1 + vatRate / 100)
        };
      }
    }

    updateQuoteDiscount(quote.id, finalDiscount);
  };

  const handleRemoveDiscount = () => {
    setDiscountAmount('');
    updateQuoteDiscount(quote.id, undefined);
  };

  const handleShippingUpdate = (shipping: ShippingInfo) => {
    updateQuoteShipping(quote.id, shipping);
    setShowShippingModal(false);
  };

  const handleRemoveShipping = () => {
    updateQuoteShipping(quote.id, undefined);
  };

  const handleEditQuote = () => {
    // Close the modal to go back to the main form
    onClose();
    // The quote is already in the store and will be available for editing
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

  const handleExportPDF = async () => {
    try {
      // Use default export settings since we're pulling everything from shop data now
      const exportSettings = {
        includeBreakdown: true,
        showPerUnitCosts: false,
      };
      
      // Get shop data for export and transform to expected format
      const shopExportData = getShopDataForExport();
      const shopData = {
        name: shopExportData.businessName,
        logo: shopExportData.logoUrl,
        slogan: undefined // We don't have a slogan field in the current shop data
      };

      await exportQuoteToPDF(quote, exportSettings, shopData);
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


  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
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

          {/* Quote Content */}
          <div className="p-6">
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

            {/* Products List */}
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-4">Products</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="border border-gray-300 px-4 py-2 text-left">Product Name</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Quantity</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Unit Price</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Total</th>
                      <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quote.products.map((product, index) => (
                      <tr key={product.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="border border-gray-300 px-4 py-2">{product.productName}</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">{product.quantity}</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">
                          {formatCurrencyWholeNumbers(product.unitPrice, quote.currency)}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-right">
                          {formatCurrencyWholeNumbers(product.totalPrice, quote.currency)}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          <button
                            onClick={() => handleEditProduct(product.id)}
                            className="px-3 py-1 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700 transition-colors cursor-pointer"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
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
                    className="px-3 py-2 border border-gray-300 rounded-md cursor-pointer"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ({quote.currency})</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Amount</label>
                  <input
                    type="number"
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(e.target.value)}
                    onBlur={handleDiscountChange}
                    placeholder={discountType === 'percentage' ? '10' : '100'}
                    className="px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                {discountType === 'fixed' && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Include VAT / Sales Tax?</label>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleVatDiscountConfirm(true)}
                        className="px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 cursor-pointer"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => handleVatDiscountConfirm(false)}
                        className="px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 cursor-pointer"
                      >
                        No
                      </button>
                    </div>
                  </div>
                )}
                <button
                  onClick={discountType === 'fixed' ? () => {} : handleDiscountChange}
                  disabled={discountType === 'fixed'}
                  className={`px-4 py-2 rounded-md ${
                    discountType === 'fixed' 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                  }`}
                >
                  Apply
                </button>
                {quote.discount && (
                  <button
                    onClick={handleRemoveDiscount}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 cursor-pointer"
                  >
                    Remove
                  </button>
                )}
              </div>
              {quote.discount && (
                <p className="text-green-600 mt-2">
                  Discount applied: {quote.discount.type === 'percentage' ? `${quote.discount.amount}%` : formatCurrencyWholeNumbers(quote.discount.amount, quote.currency)}
                  {' = '}
                  {formatCurrencyWholeNumbers(quote.discountAmount, quote.currency)}
                </p>
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
                {quote.shipping && (
                  <button
                    onClick={handleRemoveShipping}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 cursor-pointer"
                  >
                    Remove Shipping
                  </button>
                )}
              </div>
              {quote.shipping && (
                <div className="mt-2">
                  {quote.shipping.isFreeShipping ? (
                    <p className="text-green-600">
                      Free shipping (Cost: {formatCurrencyWholeNumbers(quote.shipping.cost, quote.currency)}{' '}
                      {quote.shipping.includesVAT ? 'incl. VAT / Sales Tax' : 'excl. VAT / Sales Tax'})
                    </p>
                  ) : (
                    <p className="text-blue-600">
                      Shipping: {formatCurrencyWholeNumbers(quote.shipping.chargeToCustomer, quote.currency)}{' '}
                      ({quote.shipping.includesVAT ? 'incl. VAT / Sales Tax' : 'excl. VAT / Sales Tax'})
                      {quote.shipping.cost !== quote.shipping.chargeToCustomer && (
                        <span className="text-gray-600 ml-2">
                          (Cost: {formatCurrencyWholeNumbers(quote.shipping.cost, quote.currency)})
                        </span>
                      )}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Quote Comments Section */}
            <div className="mb-6 p-4 border rounded-lg">
              <h3 className="font-semibold text-lg mb-4">💬 Quote Comments</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comments for this quote
                </label>
                <textarea
                  value={localQuoteComments}
                  onChange={(e) => setLocalQuoteComments(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-none"
                  placeholder="Thank you for choosing our business. We look forward to bringing your project to life!
For any questions or modifications, please don't hesitate to contact us.
Quote valid for 5 days from date of issue."
                />
                <p className="text-xs text-gray-500 mt-1">
                  These comments will appear in the PDF export. Default text is loaded from your shop settings.
                </p>
              </div>
            </div>

            {/* Quote Totals */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-4">Quote Summary</h3>
              <div className="space-y-2">
                {(() => {
                  const vatSettings = quote.products[0]?.vatSettings || { rate: 0, isInclusive: true };
                  
                  // Calculate net amounts correctly like P&L does
                  const beforeVatSubtotal = quote.subtotal - quote.discountAmount;
                  const beforeVatWithShipping = beforeVatSubtotal + quote.shippingAmount;
                  const netAmount = quote.totalAmount - quote.vatAmount; // This is the actual net revenue
                  
                  return (
                    <>
                      <div className="flex justify-between">
                        <span>Subtotal (products):</span>
                        <span>{formatCurrencyWholeNumbers(quote.subtotal, quote.currency)}</span>
                      </div>
                      {quote.discountAmount > 0 && (
                        <div className="flex justify-between text-red-600">
                          <span>Discount:</span>
                          <span>-{formatCurrencyWholeNumbers(quote.discountAmount, quote.currency)}</span>
                        </div>
                      )}
                      {quote.shipping && (
                        <div className="flex justify-between">
                          <span>Shipping {quote.shipping.includesVAT ? '(incl. VAT / Sales Tax)' : '(excl. VAT / Sales Tax)'}:</span>
                          <span>
                            {quote.shipping.isFreeShipping 
                              ? 'Free Shipping' 
                              : formatCurrencyWholeNumbers(quote.shippingAmount, quote.currency)
                            }
                          </span>
                        </div>
                      )}
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between">
                          <span>Total Sale Price {vatSettings.isInclusive ? '(incl. VAT / Sales Tax)' : '(excl. VAT / Sales Tax)'}:</span>
                          <span>{formatCurrencyWholeNumbers(beforeVatWithShipping, quote.currency)}</span>
                        </div>
                        {vatSettings.rate > 0 && (
                          <>
                            <div className="flex justify-between text-red-600">
                              <span>Less: VAT / Sales Tax ({vatSettings.rate}%):</span>
                              <span>-{formatCurrencyWholeNumbers(quote.vatAmount, quote.currency)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                              <span>Net Revenue (excl. VAT / Sales Tax):</span>
                              <span>{formatCurrencyWholeNumbers(netAmount, quote.currency)}</span>
                            </div>
                          </>
                        )}
                      </div>
                      <div className="flex justify-between font-bold text-lg border-t pt-2">
                        <span>Total Amount:</span>
                        <span>{formatCurrencyWholeNumbers(quote.totalAmount, quote.currency)}</span>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="sticky bottom-0 bg-gray-50 border-t p-6">
            <div className="flex justify-end items-center">
              <div className="flex gap-3">
                <button
                  onClick={handleEditQuote}
                  className="px-6 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors cursor-pointer"
                >
                  Edit Quote
                </button>
                <button
                  onClick={handleExportExcel}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span>📊</span>
                  Export Excel
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


    </>
  );
}