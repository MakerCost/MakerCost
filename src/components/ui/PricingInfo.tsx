'use client';

import { useState, useEffect } from 'react';
import { SalePriceInfo, Currency, VATSettings } from '@/types/pricing';
import { formatCurrency } from '@/lib/calculations';
import { useAuth } from '@/hooks/useAuth';
import { useShopStore } from '@/store/shop-store';
import Tooltip, { QuestionMarkIcon } from '@/components/ui/Tooltip';

interface PricingInfoProps {
  currency: Currency;
  vatSettings: VATSettings;
  salePrice: SalePriceInfo;
  onCurrencyChange: (currency: Currency) => void;
  onVATChange: (vatSettings: VATSettings) => void;
  onSalePriceChange: (salePrice: SalePriceInfo) => void;
  isFieldsLocked?: boolean;
}

const currencies = [
  { code: 'USD' as Currency, symbol: '$', name: 'US Dollar' },
  { code: 'EUR' as Currency, symbol: '€', name: 'Euro' },
  { code: 'GBP' as Currency, symbol: '£', name: 'British Pound' },
  { code: 'NIS' as Currency, symbol: '₪', name: 'Israeli Shekel' },
  { code: 'CAD' as Currency, symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD' as Currency, symbol: 'A$', name: 'Australian Dollar' },
  { code: 'JPY' as Currency, symbol: '¥', name: 'Japanese Yen' },
  { code: 'CHF' as Currency, symbol: 'CHF', name: 'Swiss Franc' },
  { code: 'CNY' as Currency, symbol: '¥', name: 'Chinese Yuan' },
  { code: 'INR' as Currency, symbol: '₹', name: 'Indian Rupee' },
  { code: 'BRL' as Currency, symbol: 'R$', name: 'Brazilian Real' },
  { code: 'MXN' as Currency, symbol: '$', name: 'Mexican Peso' },
  { code: 'KRW' as Currency, symbol: '₩', name: 'South Korean Won' },
  { code: 'SEK' as Currency, symbol: 'kr', name: 'Swedish Krona' },
  { code: 'NOK' as Currency, symbol: 'kr', name: 'Norwegian Krone' },
];

const getCurrencySymbol = (currency: Currency): string => {
  const currencyData = currencies.find(c => c.code === currency);
  return currencyData?.symbol || '$';
};

export default function PricingInfo({ 
  currency, 
  vatSettings, 
  salePrice, 
  onCurrencyChange, 
  onVATChange, 
  onSalePriceChange,
  isFieldsLocked = false
}: PricingInfoProps) {
  const { user } = useAuth();
  const { shopData } = useShopStore();
  const [amount, setAmount] = useState(salePrice.amount > 0 ? salePrice.amount.toString() : '');
  const [unitsCount, setUnitsCount] = useState(salePrice.unitsCount.toString());
  const [fixedCharge, setFixedCharge] = useState(salePrice.fixedCharge > 0 ? salePrice.fixedCharge.toString() : '');
  const [vatRate, setVatRate] = useState(vatSettings.rate.toString());

  // Sync local state with prop changes (for demo data loading)
  useEffect(() => {
    setAmount(salePrice.amount > 0 ? salePrice.amount.toString() : '');
    setUnitsCount(salePrice.unitsCount.toString());
    setFixedCharge(salePrice.fixedCharge > 0 ? salePrice.fixedCharge.toString() : '');
  }, [salePrice]);

  useEffect(() => {
    setVatRate(vatSettings.rate.toString());
  }, [vatSettings.rate]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = e.target.value;
    setAmount(newAmount);
    
    const numericAmount = parseFloat(newAmount);
    if (!isNaN(numericAmount) && numericAmount >= 0) {
      onSalePriceChange({ ...salePrice, amount: numericAmount });
    } else if (newAmount === '') {
      onSalePriceChange({ ...salePrice, amount: 0 });
    }
  };

  const handleUnitsCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUnitsCount = e.target.value;
    setUnitsCount(newUnitsCount);
    
    const numericUnitsCount = parseInt(newUnitsCount);
    if (!isNaN(numericUnitsCount) && numericUnitsCount > 0) {
      onSalePriceChange({ ...salePrice, unitsCount: numericUnitsCount });
    }
  };

  const handleFixedChargeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFixedCharge = e.target.value;
    setFixedCharge(newFixedCharge);
    
    const numericFixedCharge = parseFloat(newFixedCharge);
    if (!isNaN(numericFixedCharge) && numericFixedCharge >= 0) {
      onSalePriceChange({ ...salePrice, fixedCharge: numericFixedCharge });
    } else if (newFixedCharge === '') {
      onSalePriceChange({ ...salePrice, fixedCharge: 0 });
    }
  };

  const handleVATRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVatRate = e.target.value;
    setVatRate(newVatRate);
    
    const numericVatRate = parseFloat(newVatRate);
    if (!isNaN(numericVatRate) && numericVatRate >= 0) {
      onVATChange({ ...vatSettings, rate: numericVatRate });
    }
  };

  const handlePricingTypeToggle = (isPerUnit: boolean) => {
    onSalePriceChange({ 
      ...salePrice, 
      isPerUnit
    });
  };

  const handleVATInclusiveToggle = (isInclusive: boolean) => {
    onVATChange({
      ...vatSettings,
      isInclusive
    });
  };

  const currencySymbol = getCurrencySymbol(currency);
  
  // Calculate totals based on pricing type
  const productTotal = salePrice.isPerUnit ? salePrice.amount * salePrice.unitsCount : salePrice.amount;
  const totalAmount = productTotal + salePrice.fixedCharge;
  const unitPrice = salePrice.isPerUnit ? salePrice.amount : salePrice.amount / salePrice.unitsCount;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow dark:shadow-slate-700/10 p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">Pricing Information</h2>
      
      <div className="space-y-4 sm:space-y-6">
        {/* Mobile: Single column layout, Desktop: Multi-column */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          
          {/* Column 1 - Pricing Type, VAT Settings */}
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pricing Type</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="pricingType"
                    checked={salePrice.isPerUnit}
                    onChange={() => handlePricingTypeToggle(true)}
                    className="mr-2 h-4 w-4"
                  />
                  <span className="text-sm text-gray-900 dark:text-white">Per unit price</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="pricingType"
                    checked={!salePrice.isPerUnit}
                    onChange={() => handlePricingTypeToggle(false)}
                    className="mr-2 h-4 w-4"
                  />
                  <span className="text-sm text-gray-900 dark:text-white">Total price for all units</span>
                </label>
              </div>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={vatSettings.isInclusive}
                  onChange={(e) => handleVATInclusiveToggle(e.target.checked)}
                  className="mr-2 h-4 w-4"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Includes VAT / Sales Tax</span>
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {vatSettings.isInclusive ? 'Prices include VAT / Sales Tax' : 'VAT / Sales Tax will be added to prices'}
              </p>
            </div>

            {/* Currency and VAT Rate for non-logged-in users */}
            {!user && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => onCurrencyChange(e.target.value as Currency)}
                    className="w-full sm:w-auto min-w-[160px] px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm"
                  >
                    {currencies.map((curr) => (
                      <option key={curr.code} value={curr.code}>
                        {curr.symbol} ({curr.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">VAT / Sales Tax Rate (%)</label>
                  <input
                    type="number"
                    value={vatRate}
                    onChange={handleVATRateChange}
                    step="0.1"
                    min="0"
                    max="100"
                    className="w-full sm:w-auto min-w-[120px] px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="8.875"
                  />
                </div>
              </>
            )}
          </div>

          {/* Column 2 - Price Fields */}
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {salePrice.isPerUnit ? `Price per Unit (${currencySymbol})` : `Total Price (${currencySymbol})`}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500 dark:text-gray-400 text-sm">
                  {currencySymbol}
                </span>
                <input
                  type="number"
                  value={amount}
                  onChange={handleAmountChange}
                  step="0.01"
                  min="0"
                  className="w-full sm:w-48 pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quantity</label>
              <input
                type="number"
                value={unitsCount}
                onChange={handleUnitsCountChange}
                min="1"
                className="w-full sm:w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="1"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fixed Charge ({currencySymbol})
                <Tooltip 
                  content="Setup fees, design costs, initial consultation, project planning, or any one-time charges that don't scale with quantity"
                  maxWidth="w-72"
                  placement="top"
                >
                  <QuestionMarkIcon className="w-4 h-4 flex-shrink-0" />
                </Tooltip>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500 dark:text-gray-400 text-sm">
                  {currencySymbol}
                </span>
                <input
                  type="number"
                  value={fixedCharge}
                  onChange={handleFixedChargeChange}
                  step="0.01"
                  min="0"
                  className="w-full sm:w-48 pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="0.00"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">One-time charge independent of quantity</p>
            </div>
          </div>

          {/* Column 3 - Price Summary */}
          <div className="md:col-span-2 lg:col-span-1">
            {(salePrice.amount > 0 || salePrice.fixedCharge > 0) && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 sm:p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2 text-sm">Price Summary</h4>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Unit Price:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(unitPrice, currency)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">{salePrice.fixedCharge > 0 ? 'Subtotal' : 'Product Total'} ({salePrice.unitsCount}x):</span>
                    <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(productTotal, currency)}</span>
                  </div>
                  {salePrice.fixedCharge > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">Fixed Costs:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(salePrice.fixedCharge, currency)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-1 border-t border-blue-200 dark:border-blue-700">
                    <span className="text-gray-600 dark:text-gray-300 font-medium">Total:</span>
                    <span className="font-bold text-lg text-blue-600 dark:text-blue-400">{formatCurrency(totalAmount, currency)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}