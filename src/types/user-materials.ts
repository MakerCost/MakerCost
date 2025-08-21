import { MaterialCategory, UnitType } from './pricing'

export interface ProcessedImages {
  thumbnail: string; // 64x64px WebP
  medium: string;    // 200x200px WebP  
  large: string;     // 400x400px WebP
  original?: string; // Optional full-size backup
}

export interface UserMaterial {
  id: string
  name: string
  category: string // Wood, Metal, Plastic, etc. (display category)
  materialType: MaterialCategory // main, packaging, decorations (calculator category)
  supplier: string
  costPerUnit: number
  unit: string
  productLink?: string // URL where the material can be purchased
  comments?: string // Previously description, renamed to comments
  inStock: boolean
  minStock: number
  currentStock: number
  lastUpdated: string
  // New fields for calculator integration
  calculatorUnit?: UnitType // Standardized unit for calculator
  wastePercentage?: number
  usageHistory?: MaterialUsage[]
  // Pro feature: Material images
  images?: ProcessedImages
  hasImages?: boolean // Quick check for UI rendering
  // Legacy field for backward compatibility
  description?: string // Will be migrated to comments
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
  fromCalculatorMaterial: (calculatorMaterial: Record<string, unknown>, userMaterial: UserMaterial) => UserMaterial
}