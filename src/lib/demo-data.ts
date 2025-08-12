import { Material, Machine, PricingProject, Currency, MaterialCategory, UnitType, MachineType } from '@/types/pricing';
import { v4 as uuidv4 } from 'uuid';

// Random data pools
const customerNames = ['Alice Johnson', 'Ben Cohen', 'Dana Smith', 'Omar Hassan', 'Tal Levy', 'Noa Martinez'];
const currencies: Currency[] = ['NIS', 'USD', 'EUR'];
const vatRates = [18]; // Fixed 18% VAT for all demo data

// Material templates by category
const materialTemplates = {
  main: [
    { name: 'Acrylic Sheet 3mm', unit: 'sheets' as UnitType, minCost: 15, maxCost: 45 },
    { name: 'Birch Plywood 6mm', unit: 'sheets' as UnitType, minCost: 25, maxCost: 55 },
    { name: 'PLA Filament', unit: 'kilograms' as UnitType, minCost: 20, maxCost: 35 },
    { name: 'Aluminum Sheet 1.5mm', unit: 'square meters' as UnitType, minCost: 35, maxCost: 75 },
    { name: 'Canvas Fabric', unit: 'meters' as UnitType, minCost: 12, maxCost: 28 },
    { name: 'Stainless Steel Rod', unit: 'linear meters' as UnitType, minCost: 8, maxCost: 25 },
    { name: 'Leather Hide', unit: 'square meters' as UnitType, minCost: 45, maxCost: 120 },
    { name: 'Pine Board 2x4', unit: 'linear meters' as UnitType, minCost: 3.5, maxCost: 8 },
    { name: 'PETG Sheet 2mm', unit: 'sheets' as UnitType, minCost: 18, maxCost: 35 },
    { name: 'Cork Sheet 3mm', unit: 'sheets' as UnitType, minCost: 12, maxCost: 22 }
  ],
  packaging: [
    { name: 'Cardboard Box Small', unit: 'pieces' as UnitType, minCost: 0.5, maxCost: 2.5 },
    { name: 'Bubble Wrap Roll', unit: 'meters' as UnitType, minCost: 0.3, maxCost: 1.2 },
    { name: 'Kraft Paper', unit: 'square meters' as UnitType, minCost: 0.8, maxCost: 2.5 },
    { name: 'Tissue Paper', unit: 'sheets' as UnitType, minCost: 0.1, maxCost: 0.4 },
    { name: 'Gift Box Large', unit: 'pieces' as UnitType, minCost: 2.5, maxCost: 8 },
    { name: 'Protective Foam', unit: 'sheets' as UnitType, minCost: 1.5, maxCost: 4 },
    { name: 'Shipping Labels', unit: 'pieces' as UnitType, minCost: 0.05, maxCost: 0.25 },
    { name: 'Packing Tape Roll', unit: 'pieces' as UnitType, minCost: 2, maxCost: 6 }
  ],
  decorations: [
    { name: 'Gold Foil Stamping', unit: 'square meters' as UnitType, minCost: 8, maxCost: 25 },
    { name: 'Vinyl Stickers', unit: 'pieces' as UnitType, minCost: 0.2, maxCost: 1.5 },
    { name: 'Embroidery Thread', unit: 'grams' as UnitType, minCost: 0.1, maxCost: 0.3 },
    { name: 'Wood Stain', unit: 'milliliters' as UnitType, minCost: 0.05, maxCost: 0.15 },
    { name: 'Clear Coating', unit: 'milliliters' as UnitType, minCost: 0.08, maxCost: 0.2 },
    { name: 'Metal Hardware', unit: 'pieces' as UnitType, minCost: 0.5, maxCost: 3.5 },
    { name: 'Decorative Ribbon', unit: 'meters' as UnitType, minCost: 0.3, maxCost: 1.8 },
    { name: 'Paint Acrylic', unit: 'milliliters' as UnitType, minCost: 0.03, maxCost: 0.12 }
  ]
};

// Machine templates with realistic costs
const machineTemplates: Array<{
  type: MachineType;
  minCost: number;
  maxCost: number;
  minLifetime: number;
  maxLifetime: number;
  minMargin: number;
  maxMargin: number;
}> = [
  { type: 'CO2 Laser', minCost: 8000, maxCost: 45000, minLifetime: 8000, maxLifetime: 15000, minMargin: 15, maxMargin: 35 },
  { type: 'UV Printer', minCost: 12000, maxCost: 85000, minLifetime: 6000, maxLifetime: 12000, minMargin: 20, maxMargin: 40 },
  { type: 'Fiber Laser', minCost: 25000, maxCost: 120000, minLifetime: 10000, maxLifetime: 20000, minMargin: 25, maxMargin: 45 },
  { type: 'FDM 3D Printer', minCost: 500, maxCost: 8000, minLifetime: 3000, maxLifetime: 8000, minMargin: 10, maxMargin: 30 },
  { type: 'Resin Printer', minCost: 300, maxCost: 5000, minLifetime: 2000, maxLifetime: 6000, minMargin: 15, maxMargin: 35 },
  { type: 'CNC Router', minCost: 3000, maxCost: 25000, minLifetime: 8000, maxLifetime: 15000, minMargin: 20, maxMargin: 40 },
  { type: 'Vinyl Cutter', minCost: 200, maxCost: 2500, minLifetime: 3000, maxLifetime: 8000, minMargin: 15, maxMargin: 30 },
  { type: 'Heat Press', minCost: 150, maxCost: 1500, minLifetime: 2000, maxLifetime: 6000, minMargin: 10, maxMargin: 25 },
  { type: 'Embroidery Machine', minCost: 800, maxCost: 12000, minLifetime: 5000, maxLifetime: 10000, minMargin: 15, maxMargin: 35 },
  { type: 'Table Saw', minCost: 400, maxCost: 4000, minLifetime: 8000, maxLifetime: 15000, minMargin: 10, maxMargin: 25 }
];

// Project name templates
const projectTypes = [
  'Custom Signage', 'Promotional Products', 'Home Decor Items', 'Corporate Gifts',
  'Wedding Favors', 'Personalized Accessories', 'Art Pieces', 'Functional Prototypes',
  'Educational Materials', 'Event Decorations', 'Jewelry Collection', 'Furniture Pieces',
  'Tech Accessories', 'Garden Planters', 'Kitchen Utensils'
];

// Utility functions
const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const randomFloat = (min: number, max: number, decimals: number = 2): number => {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
};

const randomChoice = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

const randomBool = (probability: number = 0.5): boolean => {
  return Math.random() < probability;
};

// Generate random materials
const generateRandomMaterials = (count: number = randomInt(2, 5)): Material[] => {
  const materials: Material[] = [];
  
  for (let i = 0; i < count; i++) {
    const category: MaterialCategory = randomChoice(['main', 'packaging', 'decorations'] as MaterialCategory[]);
    const template = randomChoice(materialTemplates[category]);
    const costType = randomChoice(['per-unit', 'total-cost'] as const);
    
    const quantity = randomInt(1, 200);
    const unitCost = randomFloat(template.minCost, template.maxCost);
    
    materials.push({
      id: uuidv4(),
      name: template.name + (randomBool(0.3) ? ` - ${randomChoice(['Premium', 'Standard', 'Economy', 'Professional'])}` : ''),
      category,
      costType,
      unitCost: costType === 'per-unit' ? unitCost : undefined,
      totalCost: costType === 'total-cost' ? unitCost * quantity * randomFloat(0.8, 1.2) : undefined,
      quantity,
      unit: template.unit,
      customUnit: template.unit === 'custom' ? randomChoice(['boxes', 'rolls', 'bundles']) : undefined,
      description: randomBool(0.4) ? `High quality ${template.name.toLowerCase()} for professional use` : undefined,
      wastePercentage: randomBool(0.6) ? randomInt(0, 8) : undefined,
    });
  }
  
  return materials;
};

// Generate random machines
const generateRandomMachines = (count: number = randomInt(1, 3)): Machine[] => {
  const machines: Machine[] = [];
  const usedTypes: MachineType[] = [];
  
  for (let i = 0; i < count; i++) {
    // Avoid duplicate machine types
    const availableTemplates = machineTemplates.filter(t => !usedTypes.includes(t.type));
    if (availableTemplates.length === 0) break;
    
    const template = randomChoice(availableTemplates);
    usedTypes.push(template.type);
    
    machines.push({
      id: uuidv4(),
      type: template.type,
      purchaseCost: randomInt(template.minCost, template.maxCost),
      lifetimeHours: randomInt(template.minLifetime, template.maxLifetime),
      profitMargin: randomInt(template.minMargin, template.maxMargin),
      usageHours: randomFloat(0.25, 3, 2), // 15 minutes to 3 hours
      description: randomBool(0.3) ? `Professional ${template.type.toLowerCase()} for high-quality production` : undefined,
    });
  }
  
  return machines;
};

// Generate complete demo project
export const generateRandomDemoProject = (): Omit<PricingProject, 'id' | 'createdAt' | 'updatedAt'> => {
  const projectType = randomChoice(projectTypes);
  const projectNumber = randomInt(100, 999);
  const currency = randomChoice(currencies);
  
  // Generate realistic quantities and pricing - force per-unit pricing
  const quantity = randomInt(5, 50); // More reasonable quantity range for per-unit pricing
  const isPerUnit = true; // Always use per-unit pricing for demo data
  const baseUnitPrice = randomFloat(10, 200);
  const totalPrice = 0; // Not used when isPerUnit is true
  
  // Generate materials and machines
  const materials = generateRandomMaterials();
  const machines = generateRandomMachines();
  
  // Calculate reasonable labor and overhead
  const totalMachineTime = machines.reduce((sum, machine) => sum + machine.usageHours, 0);
  const laborTime = randomFloat(Math.max(0.17, totalMachineTime * 0.3), totalMachineTime * 2, 2); // 10 minutes minimum
  const laborRate = randomFloat(50, 150);
  const overheadRate = randomFloat(10, 80);
  
  return {
    projectName: `${projectType} Project #${projectNumber}`,
    clientName: randomChoice(customerNames),
    projectDate: new Date(),
    productName: `Custom ${projectType}`,
    currency,
    vatSettings: {
      rate: randomChoice(vatRates),
      isInclusive: randomBool(0.6),
    },
    salePrice: {
      amount: isPerUnit ? baseUnitPrice : totalPrice,
      isPerUnit,
      unitsCount: quantity,
      fixedCharge: randomBool(0.5) ? Math.round((baseUnitPrice * quantity * 0.1) * 100) / 100 : 0, // 0 or 10% of order value
    },
    materials,
    costParameters: {
      machines,
      labor: {
        hours: laborTime,
        ratePerHour: laborRate,
      },
      depreciation: {
        amount: 0, // Let machine depreciation handle this
      },
      overhead: {
        ratePerHour: overheadRate,
      },
    },
    production: {
      unitsProduced: quantity,
      targetProfitMargin: randomInt(10, 40),
    },
  };
};

// Generate multiple demo scenarios for testing
export const generateDemoScenarios = () => {
  return {
    simple: generateRandomDemoProject,
    complex: () => {
      const project = generateRandomDemoProject();
      // Make it more complex
      project.materials = generateRandomMaterials(randomInt(4, 8));
      project.costParameters.machines = generateRandomMachines(randomInt(2, 4));
      project.salePrice.fixedCharge = randomFloat(50, 500);
      return project;
    },
    highVolume: () => {
      const project = generateRandomDemoProject();
      project.production.unitsProduced = randomInt(100, 1000);
      project.salePrice.unitsCount = project.production.unitsProduced;
      return project;
    },
    lowMargin: () => {
      const project = generateRandomDemoProject();
      project.production.targetProfitMargin = randomInt(5, 15);
      project.salePrice.amount = randomFloat(5, 50);
      return project;
    }
  };
};