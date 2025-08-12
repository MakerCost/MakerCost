'use client';

import { Currency } from '@/types/pricing';

interface CurrencySelectorProps {
  value: Currency;
  onChange: (currency: Currency) => void;
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

export default function CurrencySelector({ value, onChange }: CurrencySelectorProps) {
  return (
    <div className="flex flex-col space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        Currency
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as Currency)}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      >
        {currencies.map((currency) => (
          <option key={currency.code} value={currency.code}>
            {currency.symbol} ({currency.code}) - {currency.name}
          </option>
        ))}
      </select>
    </div>
  );
}