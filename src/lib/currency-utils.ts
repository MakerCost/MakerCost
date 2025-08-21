import { Currency } from '@/types/pricing';

// Currency symbol mapping
const CURRENCY_SYMBOLS: Record<Currency, string> = {
  'USD': '$',
  'EUR': '€',
  'GBP': '£',
  'NIS': '₪',
  'CAD': 'C$',
  'AUD': 'A$',
  'JPY': '¥',
  'CHF': 'CHF',
  'CNY': '¥',
  'INR': '₹',
  'BRL': 'R$',
  'MXN': '$',
  'KRW': '₩',
  'SEK': 'kr',
  'NOK': 'kr',
};

/**
 * Get the currency symbol for a given currency code
 */
export function getCurrencySymbol(currency: Currency): string {
  return CURRENCY_SYMBOLS[currency] || '$';
}

/**
 * Format a number with thousands separators for display in input fields
 */
export function formatNumberForDisplay(value: number | undefined): string {
  if (value === undefined || isNaN(value)) return '';
  return value.toLocaleString('en-US', { 
    minimumFractionDigits: 0,
    maximumFractionDigits: 2 
  });
}

/**
 * Parse a formatted number string back to a number
 */
export function parseFormattedNumber(value: string): number | undefined {
  if (!value) return undefined;
  // Remove commas and parse
  const cleaned = value.replace(/,/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? undefined : parsed;
}

/**
 * Handle formatting of input field changes for currency inputs
 */
export function handleFormattedInputChange(
  value: string,
  onChange: (value: number | undefined) => void
) {
  const numericValue = parseFormattedNumber(value);
  onChange(numericValue);
}