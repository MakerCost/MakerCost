import { useState, useCallback } from 'react';
import { formatNumberForDisplay, parseFormattedNumber } from '@/lib/currency-utils';

interface UseFormattedInputProps {
  initialValue?: number;
  onChange?: (value: number | undefined) => void;
}

export function useFormattedInput({ initialValue, onChange }: UseFormattedInputProps = {}) {
  const [displayValue, setDisplayValue] = useState(() => 
    initialValue !== undefined ? formatNumberForDisplay(initialValue) : ''
  );
  const [numericValue, setNumericValue] = useState<number | undefined>(initialValue);

  const handleChange = useCallback((value: string) => {
    setDisplayValue(value);
    
    // Parse the numeric value
    const parsed = parseFormattedNumber(value);
    setNumericValue(parsed);
    
    // Call onChange if provided
    if (onChange) {
      onChange(parsed);
    }
  }, [onChange]);

  const handleBlur = useCallback(() => {
    // Format the display value on blur
    if (numericValue !== undefined) {
      const formatted = formatNumberForDisplay(numericValue);
      setDisplayValue(formatted);
    }
  }, [numericValue]);

  const setValue = useCallback((value: number | undefined) => {
    setNumericValue(value);
    setDisplayValue(value !== undefined ? formatNumberForDisplay(value) : '');
  }, []);

  return {
    displayValue,
    numericValue,
    handleChange,
    handleBlur,
    setValue,
  };
}