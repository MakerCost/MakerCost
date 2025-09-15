'use client';

import { useState, useEffect } from 'react';
import { useQuoteStore } from '@/store/quote-store';
import { usePricingStore } from '@/store/pricing-store';
import { useShopStore } from '@/store/shop-store';
import { useAuth } from '@/hooks/useAuth';
import { formatCurrencyWholeNumbers } from '@/lib/calculations';
import { CustomerType, DiscountInfo, ShippingInfo, FinalizeQuoteViewModel } from '@/types/pricing';
import { createFinalizeQuoteViewModel } from '@/lib/finalize-quote-calculations';
import { exportQuoteToPDF, exportQuoteToExcel } from '@/lib/exportUtils';
import ShippingModal from './ShippingModal';

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
  const { currentQuote, quotes, finalizeQuote, removeProductFromQuote, updateQuoteShipping, updateQuoteDiscount } = useQuoteStore();
  const { 
    currentProject, 
 
    createNewProject,
    updateProjectInfo,
    addMaterial,
    updateCostParameters,
    updateProduction,
    removeMaterial,
    updateSalePrice
  } = usePricingStore();
  const { shopData } = useShopStore();
  const { user } = useAuth();
  
  // State
  const [customerType, setCustomerType] = useState<CustomerType>('private');
  const [discount, setDiscount] = useState<DiscountInfo | undefined>(undefined);
  const [shipping, setShipping] = useState<ShippingInfo | undefined>(undefined);
  const [showShippingModal, setShowShippingModal] = useState(false);
  
  // Discount form state
  const [discountType, setDiscountType] = useState<'fixed' | 'percentage'>('percentage');
  const [discountAmount, setDiscountAmount] = useState<string>('');
  
  // Comment state - initialize from shop data
  const [comments, setComments] = useState<string>('');

  // Get quote
  const quote = quoteId ? quotes.find(q => q.id === quoteId) : currentQuote;

  // Initialize comments from shop data when modal opens
  useEffect(() => {
    if (isOpen && shopData?.quoteComments) {
      setComments(shopData.quoteComments);
    }
  }, [isOpen, shopData?.quoteComments]);

  // Sync local state with quote data when quote changes
  useEffect(() => {
    if (quote) {
      setShipping(quote.shipping);
      setDiscount(quote.discount);
    }
  }, [quote?.id, quote?.shipping, quote?.discount]);

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
      // Update the quote in the store
      if (quote) {
        updateQuoteDiscount(quote.id, undefined);
      }
      return;
    }

    const newDiscount = {
      type: discountType,
      amount,
    };
    setDiscount(newDiscount);
    
    // Update the quote in the store
    if (quote) {
      updateQuoteDiscount(quote.id, newDiscount);
    }
  };

  const handleRemoveDiscount = () => {
    setDiscount(undefined);
    setDiscountAmount('');
    
    // Update the quote in the store
    if (quote) {
      updateQuoteDiscount(quote.id, undefined);
    }
  };

  const handleShippingUpdate = (newShipping: ShippingInfo) => {
    setShipping(newShipping);
    setShowShippingModal(false);
    
    // Update the quote in the store
    if (quote) {
      updateQuoteShipping(quote.id, newShipping);
    }
  };

  const handleEditShipping = () => {
    setShowShippingModal(true);
  };

  const handleDeleteShipping = () => {
    if (confirm('Are you sure you want to remove shipping from this quote?')) {
      setShipping(undefined);
      
      // Update the quote in the store
      if (quote) {
        updateQuoteShipping(quote.id, undefined);
      }
    }
  };

  const handleRemoveShipping = () => {
    setShipping(undefined);
  };

  const handleExportPDF = async () => {
    try {
      // Use default export settings since we're pulling everything from shop data now
      const exportSettings = {
        includeBreakdown: true,
        showPerUnitCosts: false,
      };
      
      // Include quote comments from the local state
      const shopDataWithComments = {
        ...shopData,
        logo: shopData.logo || undefined,
        quoteComments: comments
      };
      
      await exportQuoteToPDF(
        quote, 
        exportSettings, 
        shopDataWithComments, 
        customerType, 
        discount, 
        shipping
      );
      // Don't automatically finalize quote after PDF export
      // User can manually finalize if they want to mark it as complete
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


  const handleDeleteProduct = (productId: string) => {
    if (!quote) return;
    
    const product = quote.products.find(p => p.id === productId);
    if (!product) return;

    // Confirm deletion
    if (confirm(`Are you sure you want to delete "${product.productName}" from this quote?`)) {
      removeProductFromQuote(productId, quote.id);
      
      // If this was the last product, we might want to handle it differently
      if (quote.products.length === 1) {
        // Optional: Close modal or show a message when no products remain
        console.log('Last product removed from quote');
      }
    }
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
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={(e) => {
          // Close modal if clicking on backdrop
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-6xl max-h-[95vh] overflow-y-auto">
          {/* Professional Header */}
          <div className="bg-white dark:bg-gray-800 p-6 border-b-2 border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start mb-6">
              {/* Left side - Logo and Business Info */}
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  {shopData.logo ? (
                    <img
                      src={shopData.logo}
                      alt="Business Logo"
                      className="w-16 h-16 object-contain rounded-lg"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center text-white text-2xl font-bold">
                      MC
                    </div>
                  )}
                  
                  {/* Date and Currency below logo */}
                  <div className="text-xs text-gray-600 dark:text-gray-300 mt-3 text-center">
                    <div className="mb-1">
                      <strong>Date:</strong> {new Date(quote.createdAt).toLocaleDateString()}
                    </div>
                    <div>
                      <strong>Currency:</strong> {quote.currency}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {user ? shopData.name || 'MakerCost' : 'MakerCost'}
                  </h1>
                  {user && shopData.slogan && (
                    <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                      {shopData.slogan}
                    </p>
                  )}
                  {!user && (
                    <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                      We make sure you profit from your amazing creations
                    </p>
                  )}
                </div>
              </div>
              
              {/* Right side - Close button only */}
              <div className="text-right">
                <button
                  onClick={onClose}
                  className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-2xl cursor-pointer"
                >
                  ×
                </button>
              </div>
            </div>
            
            {/* Centered Quote Title */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Quote {quote.quoteNumber}
              </h2>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Customer Type Toggle - Smaller and less prominent */}
            <div className="mb-6 p-3 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Customer Type:</span>
                <div className="flex gap-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="customerType"
                      checked={customerType === 'private'}
                      onChange={() => setCustomerType('private')}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-900 dark:text-white">Private Customer</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="customerType"
                      checked={customerType === 'business'}
                      onChange={() => setCustomerType('business')}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-900 dark:text-white">Business Customer</span>
                  </label>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {customerType === 'private' 
                    ? 'Prices include VAT / Sales Tax'
                    : 'Prices exclude VAT / Sales Tax'
                  }
                </span>
              </div>
            </div>

            {/* Quote Details Grid - PDF Style */}
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Project Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Project:</span> {quote.projectName}</p>
                    <p><span className="font-medium">Client:</span> {quote.clientName}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Project Terms</h3>
                  <div className="space-y-2 text-sm">
                    {quote.deliveryDate && (
                      <p><span className="font-medium">Delivery Date:</span> {new Date(quote.deliveryDate).toLocaleDateString()}</p>
                    )}
                    {quote.paymentTerms && (
                      <p><span className="font-medium">Payment Terms:</span> {quote.paymentTerms}</p>
                    )}
                    {!quote.deliveryDate && !quote.paymentTerms && (
                      <p className="text-gray-500 dark:text-gray-400 italic">No terms specified</p>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Quote Details</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Total Products:</span> {quote.products.length}</p>
                    <p><span className="font-medium">VAT / Sales Tax Rate:</span> {quote.products[0]?.vatSettings.rate || 0}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Table */}
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-4">Products</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead className="bg-gray-50 dark:bg-gray-600">
                    <tr>
                      <th className="border border-gray-300 px-4 py-2 text-left">Product Name</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Quantity</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">
                        Unit Price {customerType === 'private' ? '(incl. VAT / Sales Tax)' : '(ex. VAT / Sales Tax)'}
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-right">
                        Line Total {customerType === 'private' ? '(incl. VAT / Sales Tax)' : '(ex. VAT / Sales Tax)'}
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewModel.lineItems.map((item, index) => (
                      <tr key={item.id} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'}>
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
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => handleEditProduct(item.id)}
                              className="px-3 py-1 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700 transition-colors cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(item.id)}
                              className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
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
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={handleEditShipping}
                              className="px-3 py-1 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700 transition-colors cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={handleDeleteShipping}
                              className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                    
                    {/* Empty spacing row */}
                    <tr>
                      <td className="border-0 px-4 py-2" colSpan={5}></td>
                    </tr>

                    {/* Subtotal Row (including shipping) */}
                    <tr className="bg-gray-100 dark:bg-gray-600 font-bold">
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
                      Fixed Amount ({quote.currency}) - {customerType === 'private' ? 'incl. VAT / Sales Tax' : 'ex. VAT / Sales Tax'}
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

            {/* Shipping Section - Only show when no shipping exists */}
            {!viewModel.shippingLine && (
              <div className="mb-6 p-4 border rounded-lg">
                <h3 className="font-semibold text-lg mb-4">🚚 Shipping</h3>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowShippingModal(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer"
                  >
                    + Add Shipping
                  </button>
                </div>
              </div>
            )}

            {/* Quote Comments Section */}
            <div className="mb-6 p-4 border rounded-lg">
              <h3 className="font-semibold text-lg mb-4">💬 Quote Comments</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Comments for this quote
                </label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Thank you for choosing our business. We look forward to bringing your project to life!
For any questions or modifications, please don't hesitate to contact us.
Quote valid for 5 days from date of issue."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-vertical"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  These comments will appear in the PDF export. Default text is loaded from your shop settings.
                </p>
              </div>
            </div>

            {/* Totals Section */}
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-4">Quote Summary</h3>
              
              {customerType === 'private' ? (
                // Private Customer Display
                <div className="space-y-3">
                  {viewModel.totals.vatInfoLine && (
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex justify-between">
                        <span>Net amount (ex. VAT / Sales Tax):</span>
                        <span>{formatCurrencyWholeNumbers(
                          viewModel.discount
                            ? viewModel.totals.vatInfoLine.netAmount + viewModel.discount.appliedAmountExVat
                            : viewModel.totals.vatInfoLine.netAmount,
                          quote.currency
                        )}</span>
                      </div>
                      {viewModel.discount && (
                        <div className="flex justify-between text-red-600">
                          <span>Discount:</span>
                          <span>-{formatCurrencyWholeNumbers(viewModel.discount.appliedAmountExVat, quote.currency)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>VAT / Sales Tax amount:</span>
                        <span>{formatCurrencyWholeNumbers(viewModel.totals.vatInfoLine.vatAmount, quote.currency)}</span>
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-xl border-t pt-3">
                    <span>TOTAL (incl. VAT / Sales Tax):</span>
                    <span>{formatCurrencyWholeNumbers(viewModel.totals.grandTotalIncVat!, quote.currency)}</span>
                  </div>
                </div>
              ) : (
                // Business Customer Display
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>SUBTOTAL (ex. VAT / Sales Tax):</span>
                    <span>{formatCurrencyWholeNumbers(viewModel.totals.subtotalExVat!, quote.currency)}</span>
                  </div>
                  {viewModel.totals.discountExVat! > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>Discount (ex. VAT / Sales Tax):</span>
                      <span>-{formatCurrencyWholeNumbers(viewModel.totals.discountExVat!, quote.currency)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>VAT / Sales Tax ({quote.products[0]?.vatSettings.rate || 18}%):</span>
                    <span>{formatCurrencyWholeNumbers(viewModel.totals.vatAmount!, quote.currency)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-xl border-t pt-3">
                    <span>TOTAL INCL VAT / SALES TAX:</span>
                    <span>{formatCurrencyWholeNumbers(viewModel.totals.totalIncVat!, quote.currency)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 p-6">
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
        initialData={shipping}
      />

    </>
  );
}