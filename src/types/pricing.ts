export type Currency = 'USD' | 'EUR' | 'NIS' | 'GBP' | 'CAD' | 'AUD' | 'JPY' | 'CHF' | 'CNY' | 'INR' | 'BRL' | 'MXN' | 'KRW' | 'SEK' | 'NOK';
export type MaterialCategory = 'main' | 'packaging' | 'decorations';
export type UnitType = 'pieces' | 'grams' | 'kilograms' | 'sheets' | 'meters' | 'centimeters' | 'milliliters' | 'liters' | 'square meters' | 'linear meters' | 'custom';

export type MachineType = 
  | 'CO2 Laser'
  | 'Fiber Laser' 
  | 'UV Printer'
  | 'Sublimation Press'
  | 'FDM 3D Printer'
  | 'Resin Printer'
  | 'CNC Router'
  | 'Vinyl Cutter'
  | 'Injection Molding'
  | 'Die Cutting'
  | 'Heat Press'
  | 'Embroidery Machine'
  | 'Screen Printer'
  | 'Pad Printer'
  | 'Rotary Engraver'
  | 'Plasma Cutter'
  | 'Waterjet Cutter'
  | 'Bandsaw'
  | 'Table Saw'
  | 'Router Table'
  | 'Drill Press'
  | 'Lathe'
  | 'Milling Machine'
  | 'Welding Equipment'
  | 'Powder Coating Oven'
  | 'Kiln'
  | 'Vacuum Former'
  | 'Airbrush Setup'
  | 'Sewing Machine'
  | 'Other';

export interface Material {
  id: string;
  name: string;
  category: MaterialCategory;
  costType: 'per-unit' | 'total-cost';
  unitCost?: number;
  totalCost?: number;
  quantity: number;
  unit: UnitType;
  customUnit?: string;
  description?: string;
  wastePercentage?: number;
}

export interface VATSettings {
  rate: number;
  isInclusive: boolean;
}

export interface SalePriceInfo {
  amount: number;
  isPerUnit: boolean;
  unitsCount: number;
  fixedCharge: number;
}

export interface Machine {
  id: string;
  type: MachineType;
  customType?: string;
  purchaseCost: number;
  lifetimeHours: number;
  profitMargin: number;
  usageHours: number;
  description?: string;
}

export type MachineDefaults = {
  [K in MachineType]: {
    lifetimeHours: number;
  };
};

export interface OverheadCalculatorData {
  rent: number;
  electricity: number;
  software: number;
  marketing: number;
  accounting: number;
  other: number;
  totalMonthlyHours: number;
}

export interface CostParameters {
  machines: Machine[];
  labor: {
    hours: number;
    ratePerHour: number;
  };
  depreciation: {
    amount: number;
    description?: string;
  };
  overhead: {
    ratePerHour: number;
    calculatorData?: OverheadCalculatorData;
  };
}

export interface ProductionInfo {
  unitsProduced: number;
  targetProfitMargin: number;
}

export interface PricingCalculations {
  totalSalePrice: number;
  vatAmount: number;
  netSalePrice: number;
  fixedCharge: number;
  
  cogs: {
    mainMaterials: number;
    packaging: number;
    decorations: number;
    total: number;
  };
  
  grossProfit: number;
  
  operatingExpenses: {
    machineCosts: number;
    laborCosts: number;
    depreciation: number;
    overhead: number;
    total: number;
  };
  
  machineDetails: {
    totalDepreciation: number;
    totalMachineRate: number;
  };
  
  netProfit: number;
  
  perUnit: {
    salePrice: number;
    vatAmount: number;
    netSalePrice: number;
    fixedCharge: number;
    cogs: number;
    grossProfit: number;
    operatingExpenses: number;
    netProfit: number;
  };
  
  percentOfNetSales: {
    fixedCharge: number;
    cogs: number;
    grossProfit: number;
    machineCosts: number;
    laborCosts: number;
    depreciation: number;
    overhead: number;
    netProfit: number;
  };
}

export interface ExportSettings {
  includeBreakdown: boolean;
  showPerUnitCosts: boolean;
  logoUrl?: string;
  businessName?: string;
  customFooterText?: string;
  validityDays?: number;
  companyInfo?: {
    name: string;
    address: string;
    phone?: string;
    email?: string;
  };
}

export interface PricingProject {
  id: string;
  projectName: string;
  clientName: string;
  projectDate: Date;
  deliveryDate?: Date;
  paymentTerms?: string;
  createdAt: Date;
  updatedAt: Date;
  currency: Currency;
  vatSettings: VATSettings;
  salePrice: SalePriceInfo;
  materials: Material[];
  costParameters: CostParameters;
  production: ProductionInfo;
  calculations?: PricingCalculations;
  exportSettings?: ExportSettings;
  productName?: string;
}

export interface PricingState {
  currentProject: PricingProject;
  projects: PricingProject[];
}

export interface QuoteProduct {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  calculations: PricingCalculations;
  materials: Material[];
  costParameters: CostParameters;
  vatSettings: VATSettings;
  currency: Currency;
  addedAt: Date;
}

export interface ShippingInfo {
  cost: number;
  chargeToCustomer: number;
  isFreeShipping: boolean;
  includesVAT: boolean;
}

export interface DiscountInfo {
  type: 'fixed' | 'percentage';
  amount: number;
}

export interface Quote {
  id: string;
  quoteNumber: string;
  projectName: string;
  clientName: string;
  currency: Currency;
  products: QuoteProduct[];
  discount?: DiscountInfo;
  shipping?: ShippingInfo;
  deliveryDate?: Date;
  paymentTerms?: string;
  subtotal: number;
  discountAmount: number;
  shippingAmount: number;
  vatAmount: number;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuoteState {
  currentQuote: Quote | null;
  quotes: Quote[];
}