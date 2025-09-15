'use client';

import { Quote } from '@/types/pricing';
import { formatCurrency } from '@/lib/calculations';

interface QuoteInfoBarProps {
  quote: Quote;
  currentProductIndex: number;
}

export default function QuoteInfoBar({ quote, currentProductIndex }: QuoteInfoBarProps) {
  const currentProduct = quote.products[currentProductIndex];

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3 mb-6">
      <div className="flex items-center justify-between">
        {/* Current Product Info */}
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-blue-900 dark:text-blue-300">
              Editing: {currentProduct.productName}
            </h4>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200">
              Product {currentProductIndex + 1} of {quote.products.length}
            </span>
          </div>
          <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
            Quote: {quote.quoteNumber} • {quote.projectName} • {quote.clientName}
          </p>
        </div>

        {/* Quote Summary */}
        <div className="text-right">
          <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
            Quote Total: {formatCurrency(quote.totalAmount, quote.currency)}
          </p>
          <div className="flex items-center gap-3 text-xs text-blue-700 dark:text-blue-400 mt-1">
            {quote.discount && (
              <span>Discount: {quote.discount.type === 'percentage' ? `${quote.discount.amount}%` : formatCurrency(quote.discount.amount, quote.currency)}</span>
            )}
            {quote.shipping && (
              <span>Shipping: {quote.shipping.isFreeShipping ? 'Free' : formatCurrency(quote.shipping.chargeToCustomer, quote.currency)}</span>
            )}
            <span>Status: <span className="capitalize">{quote.status}</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}