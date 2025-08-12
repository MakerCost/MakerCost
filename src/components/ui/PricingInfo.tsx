'use client';

import { useState, useEffect } from 'react';
import { SalePriceInfo, Currency, VATSettings } from '@/types/pricing';
import { formatCurrency } from '@/lib/calculations';

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
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Pricing Information</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Currency Selection */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
            <select
              value={currency}
              onChange={(e) => onCurrencyChange(e.target.value as Currency)}
              disabled={isFieldsLocked}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isFieldsLocked ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'
              }`}
            >
              {currencies.map((curr) => (
                <option key={curr.code} value={curr.code}>
                  {curr.symbol} ({curr.code}) - {curr.name}
                </option>
              ))}
            </select>
          </div>

          {/* VAT Settings */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">VAT Rate (%)</label>
            <input
              type="number"
              value={vatRate}
              onChange={handleVATRateChange}
              step="0.1"
              min="0"
              max="100"
              disabled={isFieldsLocked}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isFieldsLocked ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''
              }`}
              placeholder="18"
            />
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={vatSettings.isInclusive}
                onChange={(e) => handleVATInclusiveToggle(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Includes VAT</span>
            </label>
            <p className="text-xs text-gray-500 mt-1">
              {vatSettings.isInclusive ? 'Prices include VAT' : 'VAT will be added to prices'}
            </p>
          </div>
        </div>

        {/* Quantity and Pricing Type */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
            <input
              type="number"
              value={unitsCount}
              onChange={handleUnitsCountChange}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="1"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pricing Type</label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="pricingType"
                  checked={salePrice.isPerUnit}
                  onChange={() => handlePricingTypeToggle(true)}
                  className="mr-2"
                />
                <span className="text-sm">Per unit price</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="pricingType"
                  checked={!salePrice.isPerUnit}
                  onChange={() => handlePricingTypeToggle(false)}
                  className="mr-2"
                />
                <span className="text-sm">Total price for all units</span>
              </label>
            </div>
          </div>
        </div>

        {/* Price Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {salePrice.isPerUnit ? `Price per Unit (${currencySymbol})` : `Total Price (${currencySymbol})`}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">
                {currencySymbol}
              </span>
              <input
                type="number"
                value={amount}
                onChange={handleAmountChange}
                step="0.01"
                min="0"
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder=""
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fixed Charge ({currencySymbol})
              <span className="block text-xs text-gray-500 font-normal">Setup/Design/One-time fee</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">
                {currencySymbol}
              </span>
              <input
                type="number"
                value={fixedCharge}
                onChange={handleFixedChargeChange}
                step="0.01"
                min="0"
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder=""
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">One-time charge independent of quantity</p>
          </div>
        </div>
      </div>
      
      {/* Price Summary */}
      {(salePrice.amount > 0 || salePrice.fixedCharge > 0) && (
        <div className="mt-6 bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Price Summary</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Unit Price:</span>
              <div className="font-medium">{formatCurrency(unitPrice, currency)}</div>
            </div>
            <div>
              <span className="text-gray-600">Product Total ({salePrice.unitsCount} units):</span>
              <div className="font-medium">{formatCurrency(productTotal, currency)}</div>
            </div>
            <div>
              <span className="text-gray-600">Total with Fixed Charge:</span>
              <div className="font-medium text-lg text-blue-600">{formatCurrency(totalAmount, currency)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}