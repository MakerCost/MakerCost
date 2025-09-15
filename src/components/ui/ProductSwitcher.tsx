'use client';

import { useState } from 'react';
import { Quote } from '@/types/pricing';

interface ProductSwitcherProps {
  quote: Quote;
  currentProductIndex: number;
  onProductSwitch: (productIndex: number) => void;
  onViewQuoteOverview: () => void;
}

export default function ProductSwitcher({
  quote,
  currentProductIndex,
  onProductSwitch,
  onViewQuoteOverview
}: ProductSwitcherProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const currentProduct = quote.products[currentProductIndex];

  if (quote.products.length <= 1) {
    return null; // Don't show switcher for single products
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        {/* Quote Information */}
        <div className="flex items-center gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {quote.projectName}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Quote {quote.quoteNumber} • Client: {quote.clientName}
            </p>
          </div>

          {/* Quote Status Indicators */}
          <div className="flex items-center gap-3">
            {quote.discount && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">
                Discount Applied
              </span>
            )}
            {quote.shipping && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                Shipping Added
              </span>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Product Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <span className="mr-2">
                Product {currentProductIndex + 1} of {quote.products.length}:
              </span>
              <span className="font-semibold truncate max-w-32">
                {currentProduct.productName}
              </span>
              <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-1 w-72 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg z-50">
                <div className="max-h-60 overflow-y-auto">
                  {quote.products.map((product, index) => (
                    <button
                      key={product.id}
                      onClick={() => {
                        onProductSwitch(index);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-600 border-b border-gray-100 dark:border-gray-600 last:border-b-0 ${
                        index === currentProductIndex
                          ? 'bg-blue-50 dark:bg-blue-900/20'
                          : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`font-medium text-sm ${
                            index === currentProductIndex
                              ? 'text-blue-900 dark:text-blue-300'
                              : 'text-gray-900 dark:text-white'
                          }`}>
                            {product.productName}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Qty: {product.quantity} • ${product.unitPrice.toFixed(2)} each
                          </p>
                        </div>
                        {index === currentProductIndex && (
                          <div className="text-blue-600 dark:text-blue-400">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quote Overview Button */}
          <button
            onClick={onViewQuoteOverview}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Quote Overview
          </button>
        </div>
      </div>

      {/* Close dropdown when clicking outside */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
}