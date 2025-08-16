import { MaterialCategory, UnitType } from './pricing'

export interface UserMaterial {
  id: string
  name: string
  category: string // Wood, Metal, Plastic, etc. (display category)
  materialType: MaterialCategory // main, packaging, decorations (calculator category)
  supplier: string
  costPerUnit: number
  unit: string
  description: string
  inStock: boolean
  minStock: number
  currentStock: number
  lastUpdated: string
  // New fields for calculator integration
  calculatorUnit?: UnitType // Standardized unit for calculator
  wastePercentage?: number
  usageHistory?: MaterialUsage[]
}

export interface MaterialUsage {
  id: string
  projectId: string
  projectName: string
  quantityUsed: number
  dateUsed: string
  costAtTime: number
}

export interface InventoryUpdateRequest {
  materialId: string
  quantityUsed: number
  projectId: string
  projectName: string
}

// For calculator material selection
export interface MaterialOption {
  id: string
  name: string
  costPerUnit: number
  unit: string
  calculatorUnit: UnitType
  currentStock: number
  materialType: MaterialCategory
}

// For converting between user materials and calculator materials
export interface MaterialConversion {
  fromUserMaterial: (userMaterial: UserMaterial) => MaterialOption
  fromCalculatorMaterial: (calculatorMaterial: any, userMaterial: UserMaterial) => UserMaterial
}