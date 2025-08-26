import { UnitSystem } from '@/store/shop-store';

// Define all possible unit types
export type MetricUnitType = 
  | 'pieces' 
  | 'grams' 
  | 'kilograms' 
  | 'sheets' 
  | 'meters' 
  | 'centimeters' 
  | 'millimeters'
  | 'milliliters' 
  | 'liters' 
  | 'square meters' 
  | 'linear meters'
  | 'cubic meters'
  | 'custom';

export type ImperialUnitType = 
  | 'pieces'
  | 'ounces'
  | 'pounds'
  | 'sheets'
  | 'feet'
  | 'inches'
  | 'yards'
  | 'fluid ounces'
  | 'gallons'
  | 'quarts'
  | 'pints'
  | 'square feet'
  | 'linear feet'
  | 'cubic feet'
  | 'custom';

export type UnifiedUnitType = MetricUnitType | ImperialUnitType;

// Unit categories for better organization
export interface UnitOption {
  value: UnifiedUnitType;
  label: string;
  category: 'quantity' | 'weight' | 'length' | 'area' | 'volume' | 'other';
}

// Metric unit options
export const METRIC_UNITS: UnitOption[] = [
  // Quantity
  { value: 'pieces', label: 'Pieces', category: 'quantity' },
  { value: 'sheets', label: 'Sheets', category: 'quantity' },
  
  // Weight
  { value: 'grams', label: 'Grams', category: 'weight' },
  { value: 'kilograms', label: 'Kilograms', category: 'weight' },
  
  // Length
  { value: 'millimeters', label: 'Millimeters', category: 'length' },
  { value: 'centimeters', label: 'Centimeters', category: 'length' },
  { value: 'meters', label: 'Meters', category: 'length' },
  { value: 'linear meters', label: 'Linear Meters', category: 'length' },
  
  // Area
  { value: 'square meters', label: 'Square Meters', category: 'area' },
  
  // Volume
  { value: 'milliliters', label: 'Milliliters', category: 'volume' },
  { value: 'liters', label: 'Liters', category: 'volume' },
  { value: 'cubic meters', label: 'Cubic Meters', category: 'volume' },
  
  // Other
  { value: 'custom', label: 'Custom Unit', category: 'other' },
];

// Imperial unit options
export const IMPERIAL_UNITS: UnitOption[] = [
  // Quantity
  { value: 'pieces', label: 'Pieces', category: 'quantity' },
  { value: 'sheets', label: 'Sheets', category: 'quantity' },
  
  // Weight
  { value: 'ounces', label: 'Ounces', category: 'weight' },
  { value: 'pounds', label: 'Pounds', category: 'weight' },
  
  // Length
  { value: 'inches', label: 'Inches', category: 'length' },
  { value: 'feet', label: 'Feet', category: 'length' },
  { value: 'yards', label: 'Yards', category: 'length' },
  { value: 'linear feet', label: 'Linear Feet', category: 'length' },
  
  // Area
  { value: 'square feet', label: 'Square Feet', category: 'area' },
  
  // Volume
  { value: 'fluid ounces', label: 'Fluid Ounces', category: 'volume' },
  { value: 'pints', label: 'Pints', category: 'volume' },
  { value: 'quarts', label: 'Quarts', category: 'volume' },
  { value: 'gallons', label: 'Gallons', category: 'volume' },
  { value: 'cubic feet', label: 'Cubic Feet', category: 'volume' },
  
  // Other
  { value: 'custom', label: 'Custom Unit', category: 'other' },
];

// Get units based on system preference
export function getUnitsForSystem(unitSystem: UnitSystem): UnitOption[] {
  return unitSystem === 'metric' ? METRIC_UNITS : IMPERIAL_UNITS;
}

// Get grouped units by category for better UX
export function getGroupedUnits(unitSystem: UnitSystem): Record<string, UnitOption[]> {
  const units = getUnitsForSystem(unitSystem);
  return units.reduce((groups, unit) => {
    const category = unit.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(unit);
    return groups;
  }, {} as Record<string, UnitOption[]>);
}

// Unit equivalents for conversion between systems
export const UNIT_EQUIVALENTS: Record<string, string> = {
  // Metric to Imperial
  'grams': 'ounces',
  'kilograms': 'pounds',
  'meters': 'feet',
  'centimeters': 'inches',
  'millimeters': 'inches',
  'milliliters': 'fluid ounces',
  'liters': 'quarts',
  'square meters': 'square feet',
  'linear meters': 'linear feet',
  'cubic meters': 'cubic feet',
  
  // Imperial to Metric
  'ounces': 'grams',
  'pounds': 'kilograms',
  'feet': 'meters',
  'inches': 'centimeters',
  'yards': 'meters',
  'fluid ounces': 'milliliters',
  'pints': 'liters',
  'quarts': 'liters',
  'gallons': 'liters',
  'square feet': 'square meters',
  'linear feet': 'linear meters',
  'cubic feet': 'cubic meters',
};

// Get equivalent unit in the other system
export function getEquivalentUnit(unit: UnifiedUnitType, targetSystem: UnitSystem): UnifiedUnitType {
  // Units that exist in both systems
  if (unit === 'pieces' || unit === 'sheets' || unit === 'custom') {
    return unit;
  }
  
  const equivalent = UNIT_EQUIVALENTS[unit];
  if (equivalent) {
    return equivalent as UnifiedUnitType;
  }
  
  // If no equivalent found, return the original unit
  return unit;
}

// Format unit display with proper abbreviations
export function formatUnitDisplay(unit: UnifiedUnitType): string {
  const abbreviations: Record<string, string> = {
    'pieces': 'pcs',
    'grams': 'g',
    'kilograms': 'kg',
    'ounces': 'oz',
    'pounds': 'lbs',
    'sheets': 'sheets',
    'meters': 'm',
    'centimeters': 'cm',
    'millimeters': 'mm',
    'feet': 'ft',
    'inches': 'in',
    'yards': 'yd',
    'milliliters': 'ml',
    'liters': 'L',
    'fluid ounces': 'fl oz',
    'pints': 'pt',
    'quarts': 'qt',
    'gallons': 'gal',
    'square meters': 'm²',
    'square feet': 'ft²',
    'linear meters': 'm',
    'linear feet': 'ft',
    'cubic meters': 'm³',
    'cubic feet': 'ft³',
    'custom': 'custom',
  };
  
  return abbreviations[unit] || unit;
}

// Get category display name
export function getCategoryDisplayName(category: string): string {
  const categoryNames: Record<string, string> = {
    'quantity': 'Quantity',
    'weight': 'Weight',
    'length': 'Length',
    'area': 'Area',
    'volume': 'Volume',
    'other': 'Other',
  };
  
  return categoryNames[category] || category;
}