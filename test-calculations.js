// Simple test script to verify calculations
const { 
  calculatePricing, 
  calculateVAT, 
  calculateTotalSalePrice,
  formatCurrency 
} = require('./src/lib/calculations.ts');

// Test data
const materials = [
  {
    id: '1',
    name: 'Wood',
    category: 'main',
    costType: 'per-unit',
    unitCost: 10,
    quantity: 2,
    unit: 'pieces'
  },
  {
    id: '2', 
    name: 'Box',
    category: 'packaging',
    costType: 'total-cost',
    totalCost: 5,
    quantity: 1,
    unit: 'piece'
  }
];

const costParameters = {
  machineTime: { hours: 2, ratePerHour: 25 },
  labor: { hours: 1, ratePerHour: 30 },
  depreciation: { amount: 10 },
  overhead: { percentage: 15 }
};

const production = {
  unitsProduced: 1,
  targetProfitMargin: 30
};

const salePrice = {
  amount: 100,
  isPerUnit: false,
  unitsCount: undefined
};

const vatSettings = {
  rate: 18,
  isInclusive: false
};

console.log('Testing Maker Business Calculator...');
console.log('='.repeat(50));

try {
  const calculations = calculatePricing(
    materials,
    costParameters, 
    production,
    salePrice,
    vatSettings
  );
  
  console.log('✅ Calculations completed successfully!');
  console.log('='.repeat(50));
  console.log(`Total Sale Price: $${calculations.totalSalePrice.toFixed(2)}`);
  console.log(`VAT Amount: $${calculations.vatAmount.toFixed(2)}`);
  console.log(`Net Sales: $${calculations.netSalePrice.toFixed(2)}`);
  console.log(`Total COGS: $${calculations.cogs.total.toFixed(2)}`);
  console.log(`- Main Materials: $${calculations.cogs.mainMaterials.toFixed(2)}`);  
  console.log(`- Packaging: $${calculations.cogs.packaging.toFixed(2)}`);
  console.log(`- Decorations: $${calculations.cogs.decorations.toFixed(2)}`);
  console.log(`Gross Profit: $${calculations.grossProfit.toFixed(2)}`);
  console.log(`Operating Expenses: $${calculations.operatingExpenses.total.toFixed(2)}`);
  console.log(`Net Profit: $${calculations.netProfit.toFixed(2)}`);
  console.log(`Gross Margin: ${calculations.percentOfNetSales.grossProfit.toFixed(1)}%`);
  console.log(`Net Margin: ${calculations.percentOfNetSales.netProfit.toFixed(1)}%`);
  
} catch (error) {
  console.error('❌ Calculation failed:', error.message);
}