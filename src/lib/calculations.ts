import { Material, CostParameters, ProductionInfo, PricingCalculations, VATSettings, SalePriceInfo, Currency, MaterialCategory } from '@/types/pricing';

export function calculateMaterialCost(material: Material): number {
  let baseCost = 0;
  
  if (material.costType === 'per-unit' && material.unitCost !== undefined) {
    baseCost = material.unitCost * material.quantity;
  } else if (material.costType === 'total-cost' && material.totalCost !== undefined) {
    baseCost = material.totalCost;
  }
  
  // Apply waste percentage for main materials
  if (material.category === 'main' && material.wastePercentage) {
    baseCost = baseCost * (1 + material.wastePercentage / 100);
  }
  
  return baseCost;
}

export function calculateTotalMaterialCost(materials: Material[]): number {
  return materials.reduce((total, material) => total + calculateMaterialCost(material), 0);
}

export function calculateMaterialCostByCategory(materials: Material[], category: MaterialCategory): number {
  return materials
    .filter(material => material.category === category)
    .reduce((total, material) => total + calculateMaterialCost(material), 0);
}

export function calculateLaborCosts(costParameters: CostParameters): number {
  return costParameters.labor.hours * costParameters.labor.ratePerHour;
}

export function calculateDepreciationCosts(costParameters: CostParameters): number {
  return costParameters.depreciation.amount;
}

export function calculateVAT(amount: number, vatSettings: VATSettings): { vatAmount: number; netAmount: number; totalAmount: number } {
  if (vatSettings.isInclusive) {
    const netAmount = amount / (1 + vatSettings.rate / 100);
    const vatAmount = amount - netAmount;
    return { vatAmount, netAmount, totalAmount: amount };
  } else {
    const vatAmount = amount * (vatSettings.rate / 100);
    const totalAmount = amount + vatAmount;
    return { vatAmount, netAmount: amount, totalAmount };
  }
}

// Helper function to calculate net amounts for PDF display
export function calculateNetPriceForDisplay(grossPrice: number, vatSettings: VATSettings): number {
  const { netAmount } = calculateVAT(grossPrice, vatSettings);
  return netAmount;
}

export function calculateTotalSalePrice(salePrice: SalePriceInfo): number {
  const productTotal = salePrice.isPerUnit 
    ? salePrice.amount * salePrice.unitsCount 
    : salePrice.amount;
  return productTotal + salePrice.fixedCharge;
}

export function calculateMachineCosts(machines: Array<{ purchaseCost: number; lifetimeHours: number; usageHours: number; profitMargin: number }>): { totalCost: number; totalDepreciation: number } {
  let totalCost = 0;
  let totalDepreciation = 0;
  
  machines.forEach(machine => {
    const depreciation = (machine.purchaseCost / machine.lifetimeHours) * machine.usageHours;
    const machineRate = depreciation + (depreciation * machine.profitMargin / 100);
    
    totalDepreciation += depreciation;
    totalCost += machineRate;
  });
  
  return { totalCost, totalDepreciation };
}

export function calculateOverheadCost(laborHours: number, overheadRatePerHour: number): number {
  return laborHours * overheadRatePerHour;
}

export function calculateActualMachineCosts(machines: Array<{
  purchasePrice: number;
  depreciationPercentage: number;
  hoursPerYear: number;
  maintenanceCostPerYear: number;
  powerConsumption: number;
  electricityIncludedInOverhead: boolean;
  usageHours: number;
}>, powerCostPerKwh: number = 1.00): { totalCost: number; totalDepreciation: number } {
  let totalCost = 0;
  let totalDepreciation = 0;
  
  machines.forEach(machine => {
    // Depreciation cost per hour
    const annualDepreciation = machine.purchasePrice * (machine.depreciationPercentage / 100);
    const depreciationPerHour = annualDepreciation / machine.hoursPerYear;
    const depreciationCost = depreciationPerHour * machine.usageHours;
    
    // Maintenance cost per hour
    const maintenancePerHour = machine.maintenanceCostPerYear / machine.hoursPerYear;
    const maintenanceCost = maintenancePerHour * machine.usageHours;
    
    // Electricity cost per hour (if not included in overhead)
    let electricityCost = 0;
    if (!machine.electricityIncludedInOverhead) {
      const electricityPerHour = machine.powerConsumption * powerCostPerKwh;
      electricityCost = electricityPerHour * machine.usageHours;
    }
    
    totalDepreciation += depreciationCost;
    totalCost += depreciationCost + maintenanceCost + electricityCost;
  });
  
  return { totalCost, totalDepreciation };
}

export function calculateTotalCost(
  materialCost: number,
  additionalCosts: number,
  overheadCost: number
): number {
  return materialCost + additionalCosts + overheadCost;
}

export function calculateTargetProfit(totalCost: number, profitMargin: number): number {
  return totalCost * (profitMargin / 100);
}

export function calculateFinalPrice(totalCost: number, targetProfit: number): number {
  return totalCost + targetProfit;
}

export function calculatePerUnitCosts(
  totalCost: number,
  finalPrice: number,
  targetProfit: number,
  unitsProduced: number
): { costPerUnit: number; profitPerUnit: number } {
  return {
    costPerUnit: totalCost / unitsProduced,
    profitPerUnit: targetProfit / unitsProduced,
  };
}

export function calculatePricing(
  materials: Material[],
  costParameters: CostParameters,
  production: ProductionInfo,
  salePrice: SalePriceInfo,
  vatSettings: VATSettings,
  powerCostPerKwh: number = 1.00
): PricingCalculations {
  const totalSalePrice = calculateTotalSalePrice(salePrice);
  const vat = calculateVAT(totalSalePrice, vatSettings);
  
  // Calculate VAT-adjusted fixed charge
  const fixedChargeVAT = vatSettings.isInclusive 
    ? calculateVAT(salePrice.fixedCharge, vatSettings)
    : { totalAmount: salePrice.fixedCharge, netAmount: salePrice.fixedCharge, vatAmount: 0 };
  
  const mainMaterials = calculateMaterialCostByCategory(materials, 'main');
  const packaging = calculateMaterialCostByCategory(materials, 'packaging');
  const decorations = calculateMaterialCostByCategory(materials, 'decorations');
  const totalCOGS = mainMaterials + packaging + decorations;
  
  const grossProfit = vat.netAmount - fixedChargeVAT.netAmount - totalCOGS;
  
  // Calculate actual machine costs using the new interface
  const machineCalculations = calculateActualMachineCosts(costParameters.machines, powerCostPerKwh);
  const laborCosts = calculateLaborCosts(costParameters);
  const overhead = calculateOverheadCost(costParameters.labor.hours, costParameters.overhead.ratePerHour);
  const totalOperatingExpenses = machineCalculations.totalCost + laborCosts + overhead;
  
  const netProfit = grossProfit - totalOperatingExpenses;
  
  const unitsCount = salePrice.unitsCount;
  

  return {
    totalSalePrice: vat.totalAmount,
    vatAmount: vat.vatAmount,
    netSalePrice: vat.netAmount,
    fixedCharge: salePrice.fixedCharge,
    fixedChargeNet: fixedChargeVAT.netAmount,
    fixedChargeVAT: fixedChargeVAT.vatAmount,
    
    cogs: {
      mainMaterials,
      packaging,
      decorations,
      total: totalCOGS,
    },
    
    grossProfit,
    
    operatingExpenses: {
      machineCosts: machineCalculations.totalCost,
      laborCosts,
      depreciation: 0, // Deprecated, keeping for compatibility
      overhead,
      total: totalOperatingExpenses,
    },
    
    machineDetails: {
      totalDepreciation: machineCalculations.totalDepreciation,
      totalMachineRate: machineCalculations.totalCost,
    },
    
    netProfit,
    
    perUnit: {
      salePrice: vat.totalAmount / unitsCount,
      vatAmount: vat.vatAmount / unitsCount,
      netSalePrice: vat.netAmount / unitsCount,
      fixedCharge: salePrice.fixedCharge / unitsCount,
      fixedChargeNet: fixedChargeVAT.netAmount / unitsCount,
      cogs: totalCOGS / unitsCount,
      grossProfit: grossProfit / unitsCount,
      operatingExpenses: totalOperatingExpenses / unitsCount,
      netProfit: netProfit / unitsCount,
    },
    
    percentOfNetSales: {
      fixedCharge: (fixedChargeVAT.netAmount / vat.netAmount) * 100,
      cogs: (totalCOGS / vat.netAmount) * 100,
      grossProfit: (grossProfit / vat.netAmount) * 100,
      machineCosts: (machineCalculations.totalCost / vat.netAmount) * 100,
      laborCosts: (laborCosts / vat.netAmount) * 100,
      depreciation: 0, // Deprecated, keeping for compatibility
      overhead: (overhead / vat.netAmount) * 100,
      netProfit: (netProfit / vat.netAmount) * 100,
    },
  };
}

export function formatCurrency(amount: number, currency: Currency = 'USD'): string {
  const currencyCode = currency === 'NIS' ? 'ILS' : currency;
  
  // Map currencies to appropriate locales
  const localeMap: Record<Currency, string> = {
    'USD': 'en-US',
    'EUR': 'de-DE',
    'GBP': 'en-GB',
    'NIS': 'he-IL',
    'CAD': 'en-CA',
    'AUD': 'en-AU',
    'JPY': 'ja-JP',
    'CHF': 'de-CH',
    'CNY': 'zh-CN',
    'INR': 'en-IN',
    'BRL': 'pt-BR',
    'MXN': 'es-MX',
    'KRW': 'ko-KR',
    'SEK': 'sv-SE',
    'NOK': 'nb-NO',
  };
  
  const locale = localeMap[currency] || 'en-US';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
  }).format(amount);
}

export function formatCurrencyWholeNumbers(amount: number, currency: Currency = 'USD'): string {
  const currencyCode = currency === 'NIS' ? 'ILS' : currency;
  
  // Map currencies to appropriate locales
  const localeMap: Record<Currency, string> = {
    'USD': 'en-US',
    'EUR': 'de-DE',
    'GBP': 'en-GB',
    'NIS': 'he-IL',
    'CAD': 'en-CA',
    'AUD': 'en-AU',
    'JPY': 'ja-JP',
    'CHF': 'de-CH',
    'CNY': 'zh-CN',
    'INR': 'en-IN',
    'BRL': 'pt-BR',
    'MXN': 'es-MX',
    'KRW': 'ko-KR',
    'SEK': 'sv-SE',
    'NOK': 'nb-NO',
  };
  
  const locale = localeMap[currency] || 'en-US';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}