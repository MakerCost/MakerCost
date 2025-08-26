export type Currency = 'USD' | 'EUR' | 'NIS' | 'GBP' | 'CAD' | 'AUD' | 'JPY' | 'CHF' | 'CNY' | 'INR' | 'BRL' | 'MXN' | 'KRW' | 'SEK' | 'NOK';
export type MaterialCategory = 'main' | 'packaging' | 'decorations';
export type UnitType = 
  // Quantity
  | 'pieces' 
  | 'sheets'
  // Metric Weight
  | 'grams' 
  | 'kilograms'
  // Imperial Weight  
  | 'ounces'
  | 'pounds'
  // Metric Length
  | 'millimeters'
  | 'centimeters'
  | 'meters' 
  | 'linear meters'
  // Imperial Length
  | 'inches'
  | 'feet'
  | 'yards'
  | 'linear feet'
  // Metric Volume
  | 'milliliters' 
  | 'liters'
  | 'cubic meters'
  // Imperial Volume
  | 'fluid ounces'
  | 'pints'
  | 'quarts'
  | 'gallons'
  | 'cubic feet'
  // Area
  | 'square meters'
  | 'square feet'
  // Other
  | 'custom';
export type CustomerType = 'private' | 'business';
export type QuoteStatus = 'draft' | 'saved' | 'completed';

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
  name: string;
  purchasePrice: number;
  depreciationPercentage: number;
  hoursPerYear: number;
  maintenanceCostPerYear: number;
  powerConsumption: number; // in kW
  electricityIncludedInOverhead: boolean;
  usageHours: number; // hours used for this project
}

export type MachineDefaults = {
  [K in MachineType]: {
    lifetimeHours: number;
  };
};

export interface OverheadCalculatorData {
  rentLease: number;
  utilities: number;
  digitalInfrastructure: number;
  insuranceProfessional: number;
  marketingAdvertising: number;
  officeSupplies: number;
  transportationDelivery: number;
  miscellaneousContingency: number;
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
  status: QuoteStatus;
  finalizedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuoteState {
  currentQuote: Quote | null;
  quotes: Quote[];
}

// New finalize quote types
export interface QuoteLineItem {
  id: string;
  productName: string;
  quantity: number;
  unitPriceExVat: number;
  unitPriceIncVat: number;
  lineTotalExVat: number;
  lineTotalIncVat: number;
}

export interface QuoteShippingLine {
  costExVat: number;
  costIncVat: number;
  chargeExVat: number;
  chargeIncVat: number;
  isFreeShipping: boolean;
}

export interface QuoteTotals {
  // For Private Customer
  grandTotalIncVat?: number;
  vatInfoLine?: {
    vatAmount: number;
    netAmount: number;
  };
  
  // For Business Customer
  subtotalExVat?: number;
  shippingExVat?: number;
  discountExVat?: number;
  vatAmount?: number;
  totalIncVat?: number;
}

export interface FinalizeQuoteViewModel {
  customerType: CustomerType;
  quote: Quote;
  lineItems: QuoteLineItem[];
  shippingLine?: QuoteShippingLine;
  discount?: {
    type: 'fixed' | 'percentage';
    amount: number;
    appliedAmountExVat: number;
    appliedAmountIncVat: number;
  };
  totals: QuoteTotals;
}

// Auth & Database Types
export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseProject extends Omit<PricingProject, 'id' | 'createdAt' | 'updatedAt'> {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  project_data: PricingProject; // JSON field containing the full project
}

export interface DatabaseQuote extends Omit<Quote, 'id' | 'createdAt' | 'updatedAt'> {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  status: QuoteStatus; // Top-level field for easier filtering
  quote_data: Quote; // JSON field containing the full quote
}

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: DatabaseProject;
        Insert: Omit<DatabaseProject, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<DatabaseProject, 'id' | 'created_at' | 'updated_at' | 'user_id'>>;
      };
      quotes: {
        Row: DatabaseQuote;
        Insert: Omit<DatabaseQuote, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<DatabaseQuote, 'id' | 'created_at' | 'updated_at' | 'user_id'>>;
      };
    };
  };
}