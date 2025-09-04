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
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow dark:shadow-slate-700/10 p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Pricing Information</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Pricing Type, VAT, Currency, VAT Rate */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pricing Type</label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="pricingType"
                  checked={salePrice.isPerUnit}
                  onChange={() => handlePricingTypeToggle(true)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-900 dark:text-white">Per unit price</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="pricingType"
                  checked={!salePrice.isPerUnit}
                  onChange={() => handlePricingTypeToggle(false)}
                  className="mr-2"
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
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Includes VAT / Sales Tax</span>
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {vatSettings.isInclusive ? 'Prices include VAT / Sales Tax' : 'VAT / Sales Tax will be added to prices'}
            </p>
          </div>

          {/* Currency and VAT / Sales Tax Settings for non-logged-in users */}
          {!user && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Currency</label>
                <select
                  value={currency}
                  onChange={(e) => onCurrencyChange(e.target.value as Currency)}
                  className="w-auto px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
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
                  className="w-auto px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-slate-700 text-gray-900 dark:text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="18"
                />
              </div>
            </>
          )}
        </div>

        {/* Middle Column - Total Price, Quantity, Fixed Charge */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {salePrice.isPerUnit ? `Price per Unit (${currencySymbol})` : `Total Price (${currencySymbol})`}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500 dark:text-gray-400">
                {currencySymbol}
              </span>
              <input
                type="number"
                value={amount}
                onChange={handleAmountChange}
                step="0.01"
                min="0"
                className="w-48 pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-slate-700 text-gray-900 dark:text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder=""
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
              className="w-48 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-slate-700 text-gray-900 dark:text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="1"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Fixed Charge ({currencySymbol})
              <Tooltip 
                content="Setup fees, design costs, initial consultation, project planning, or any one-time charges that don't scale with quantity"
                maxWidth="w-96"
                placement="top"
              >
                <QuestionMarkIcon className="w-4 h-4" />
              </Tooltip>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500 dark:text-gray-400">
                {currencySymbol}
              </span>
              <input
                type="number"
                value={fixedCharge}
                onChange={handleFixedChargeChange}
                step="0.01"
                min="0"
                className="w-48 pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-slate-700 text-gray-900 dark:text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder=""
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">One-time charge independent of quantity</p>
          </div>
        </div>

        {/* Right Column - Price Summary */}
        <div>
          {(salePrice.amount > 0 || salePrice.fixedCharge > 0) && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Price Summary</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-300">Unit Price:</span>
                  <div className="font-medium text-gray-900 dark:text-white">{formatCurrency(unitPrice, currency)}</div>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-300">Product Total ({salePrice.unitsCount} units):</span>
                  <div className="font-medium text-gray-900 dark:text-white">{formatCurrency(productTotal, currency)}</div>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-300">Total with Fixed Charge:</span>
                  <div className="font-medium text-lg text-blue-600 dark:text-blue-400">{formatCurrency(totalAmount, currency)}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}