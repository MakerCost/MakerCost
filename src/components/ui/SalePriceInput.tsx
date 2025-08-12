'use client';

import { useState } from 'react';
import { SalePriceInfo, Currency } from '@/types/pricing';

interface SalePriceInputProps {
  value: SalePriceInfo;
  currency: Currency;
  onChange: (salePrice: SalePriceInfo) => void;
}

const getCurrencySymbol = (currency: Currency): string => {
  switch (currency) {
    case 'USD': return '$';
    case 'EUR': return '€';
    case 'GBP': return '£';
    case 'NIS': return '₪';
    case 'CAD': return 'C$';
    case 'AUD': return 'A$';
    case 'JPY': return '¥';
    case 'CHF': return 'CHF';
    case 'CNY': return '¥';
    case 'INR': return '₹';
    case 'BRL': return 'R$';
    case 'MXN': return '$';
    case 'KRW': return '₩';
    case 'SEK': return 'kr';
    case 'NOK': return 'kr';
    default: return '$';
  }
};

export default function SalePriceInput({ value, currency, onChange }: SalePriceInputProps) {
  const [amount, setAmount] = useState(value.amount.toString());
  const [unitsCount, setUnitsCount] = useState(value.unitsCount.toString());
  const [fixedCharge, setFixedCharge] = useState(value.fixedCharge.toString());

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = e.target.value;
    setAmount(newAmount);
    
    const numericAmount = parseFloat(newAmount);
    if (!isNaN(numericAmount) && numericAmount >= 0) {
      onChange({ ...value, amount: numericAmount });
    }
  };

  const handleUnitsCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUnitsCount = e.target.value;
    setUnitsCount(newUnitsCount);
    
    const numericUnitsCount = parseInt(newUnitsCount);
    if (!isNaN(numericUnitsCount) && numericUnitsCount > 0) {
      onChange({ ...value, unitsCount: numericUnitsCount });
    }
  };

  const handleFixedChargeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFixedCharge = e.target.value;
    setFixedCharge(newFixedCharge);
    
    const numericFixedCharge = parseFloat(newFixedCharge);
    if (!isNaN(numericFixedCharge) && numericFixedCharge >= 0) {
      onChange({ ...value, fixedCharge: numericFixedCharge });
    }
  };

  const handlePricingTypeToggle = (isPerUnit: boolean) => {
    onChange({ 
      ...value, 
      isPerUnit
    });
  };

  const currencySymbol = getCurrencySymbol(currency);
  
  // Calculate totals based on pricing type
  const productTotal = value.isPerUnit ? value.amount * value.unitsCount : value.amount;
  const totalAmount = productTotal + value.fixedCharge;
  const unitPrice = value.isPerUnit ? value.amount : value.amount / value.unitsCount;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Sale Price Configuration</h3>
      
      {/* Always visible unit count */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Number of Units
          </label>
          <input
            type="number"
            value={unitsCount}
            onChange={handleUnitsCountChange}
            min="1"
            className="max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="1"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pricing Type
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="pricingType"
                checked={value.isPerUnit}
                onChange={() => handlePricingTypeToggle(true)}
                className="mr-2"
              />
              <span className="text-sm">Per unit price</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="pricingType"
                checked={!value.isPerUnit}
                onChange={() => handlePricingTypeToggle(false)}
                className="mr-2"
              />
              <span className="text-sm">Total price for all units</span>
            </label>
          </div>
        </div>
      </div>

      {/* Price and Fixed Charge Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {value.isPerUnit ? `Price per Unit (${currencySymbol})` : `Total Price (${currencySymbol})`}
          </label>
          <div className="relative max-w-xs">
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
              placeholder="0.00"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fixed Charge (${currencySymbol}) - Setup/Design
          </label>
          <div className="relative max-w-xs">
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
              placeholder="0.00"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">One-time charge independent of quantity</p>
        </div>
      </div>
      
      {/* Price Summary */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Price Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Unit Price:</span>
            <div className="font-medium">{currencySymbol}{unitPrice.toFixed(2)}</div>
          </div>
          <div>
            <span className="text-gray-600">Product Total ({value.unitsCount} units):</span>
            <div className="font-medium">{currencySymbol}{productTotal.toFixed(2)}</div>
          </div>
          <div>
            <span className="text-gray-600">Total with Fixed Charge:</span>
            <div className="font-medium text-lg text-blue-600">{currencySymbol}{totalAmount.toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}