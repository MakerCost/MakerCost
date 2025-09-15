import { supabase } from '@/lib/supabase/client'
import type { PricingProject, Quote, DatabaseProject, DatabaseQuote, QuoteStatus } from '@/types/pricing'
import type { ShopData } from '@/store/shop-store'
import type { DashboardMachine } from '@/store/machine-store'
import type { UserMaterial } from '@/types/user-materials'

export class DatabaseError extends Error {
  constructor(message: string, public originalError?: unknown) {
    super(message)
    this.name = 'DatabaseError'
  }
}

// Projects
export async function saveProject(project: PricingProject): Promise<string> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new DatabaseError('User not authenticated')

    const projectData: DatabaseProject['project_data'] = project
    
    const { data, error } = await supabase
      .from('projects')
      .upsert({
        id: project.id,
        user_id: user.id,
        project_name: project.projectName,
        project_data: projectData,
      })
      .select()
      .single()

    if (error) throw new DatabaseError('Failed to save project', error)
    return data.id
  } catch (error) {
    if (error instanceof DatabaseError) throw error
    throw new DatabaseError('Unexpected error saving project', error)
  }
}

export async function loadProject(projectId: string): Promise<PricingProject | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new DatabaseError('User not authenticated')

    const { data, error } = await supabase
      .from('projects')
      .select('project_data')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // Not found
      throw new DatabaseError('Failed to load project', error)
    }

    return data.project_data
  } catch (error) {
    if (error instanceof DatabaseError) throw error
    throw new DatabaseError('Unexpected error loading project', error)
  }
}

export async function loadAllProjects(): Promise<PricingProject[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new DatabaseError('User not authenticated')

    const { data, error } = await supabase
      .from('projects')
      .select('project_data')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })

    if (error) throw new DatabaseError('Failed to load projects', error)

    return data.map(row => row.project_data)
  } catch (error) {
    if (error instanceof DatabaseError) throw error
    throw new DatabaseError('Unexpected error loading projects', error)
  }
}

export async function deleteProject(projectId: string): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new DatabaseError('User not authenticated')

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId)
      .eq('user_id', user.id)

    if (error) throw new DatabaseError('Failed to delete project', error)
  } catch (error) {
    if (error instanceof DatabaseError) throw error
    throw new DatabaseError('Unexpected error deleting project', error)
  }
}

// Quotes
export async function saveQuote(quote: Quote): Promise<string> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new DatabaseError('User not authenticated')

    const quoteData: DatabaseQuote['quote_data'] = quote
    
    const dbPayload = {
      id: quote.id,
      user_id: user.id,
      quote_number: quote.quoteNumber,
      project_name: quote.projectName,
      client_name: quote.clientName,
      quote_data: quoteData,
    };
    
    // Save quote data to database
    
    const { data, error } = await supabase
      .from('quotes')
      .upsert(dbPayload)
      .select()
      .single()

    if (error) {
      throw new DatabaseError('Failed to save quote', error);
    }
    return data.id
  } catch (error) {
    if (error instanceof DatabaseError) throw error
    throw new DatabaseError('Unexpected error saving quote', error)
  }
}

export async function loadQuote(quoteId: string): Promise<Quote | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new DatabaseError('User not authenticated')

    const { data, error } = await supabase
      .from('quotes')
      .select('quote_data')
      .eq('id', quoteId)
      .eq('user_id', user.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // Not found
      throw new DatabaseError('Failed to load quote', error)
    }

    return data.quote_data
  } catch (error) {
    if (error instanceof DatabaseError) throw error
    throw new DatabaseError('Unexpected error loading quote', error)
  }
}

export async function loadAllQuotes(): Promise<Quote[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new DatabaseError('User not authenticated')

    const { data, error } = await supabase
      .from('quotes')
      .select('quote_data')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })

    if (error) throw new DatabaseError('Failed to load quotes', error)

    return data.map(row => row.quote_data)
  } catch (error) {
    if (error instanceof DatabaseError) throw error
    throw new DatabaseError('Unexpected error loading quotes', error)
  }
}

export async function loadQuotesByStatus(status: QuoteStatus): Promise<Quote[]> {
  try {
    // Load all quotes first, then filter by status in JavaScript
    const allQuotes = await loadAllQuotes()
    return allQuotes.filter(quote => quote.status === status)
  } catch (error) {
    if (error instanceof DatabaseError) throw error
    throw new DatabaseError('Unexpected error loading quotes by status', error)
  }
}

export async function deleteQuote(quoteId: string): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new DatabaseError('User not authenticated')

    const { error } = await supabase
      .from('quotes')
      .delete()
      .eq('id', quoteId)
      .eq('user_id', user.id)

    if (error) throw new DatabaseError('Failed to delete quote', error)
  } catch (error) {
    if (error instanceof DatabaseError) throw error
    throw new DatabaseError('Unexpected error deleting quote', error)
  }
}

// Enhanced Shop Data Functions with Sync Support
export async function saveShopData(shopData: ShopData): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new DatabaseError('User not authenticated')

    // Ensure sync metadata is present
    const dataToSave = {
      ...shopData,
      lastModified: shopData.lastModified || new Date().toISOString(),
      syncVersion: shopData.syncVersion || 1
    }

    // Try update first
    const { error: updateError } = await supabase
      .from('user_shops')
      .update({
        shop_data: dataToSave,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)

    // If update failed because record doesn't exist, try insert
    if (updateError && updateError.code === 'PGRST116') {
      const { error: insertError } = await supabase
        .from('user_shops')
        .insert({
          user_id: user.id,
          shop_data: dataToSave,
          updated_at: new Date().toISOString(),
        })

      if (insertError) {
        console.error('Shop data insert error details:', {
          message: insertError.message,
          details: insertError.details,
          hint: insertError.hint,
          code: insertError.code
        });
        throw new DatabaseError('Failed to insert shop data', insertError);
      }
    } else if (updateError) {
      console.error('Shop data update error details:', {
        message: updateError.message,
        details: updateError.details,
        hint: updateError.hint,
        code: updateError.code
      });
      throw new DatabaseError('Failed to update shop data', updateError);
    }
  } catch (error) {
    if (error instanceof DatabaseError) throw error
    throw new DatabaseError('Unexpected error saving shop data', error)
  }
}

export async function loadShopData(): Promise<ShopData | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new DatabaseError('User not authenticated')

    const { data, error } = await supabase
      .from('user_shops')
      .select('shop_data, updated_at')
      .eq('user_id', user.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // Not found
      throw new DatabaseError('Failed to load shop data', error)
    }

    return data.shop_data
  } catch (error) {
    if (error instanceof DatabaseError) throw error
    throw new DatabaseError('Unexpected error loading shop data', error)
  }
}

export async function compareShopData(localData: ShopData, cloudData: ShopData): Promise<'local' | 'cloud' | 'conflict'> {
  try {
    // If either doesn't have sync metadata, prefer the one that does
    if (!localData.lastModified && cloudData.lastModified) return 'cloud'
    if (localData.lastModified && !cloudData.lastModified) return 'local'
    
    // If neither has metadata, it's a conflict
    if (!localData.lastModified && !cloudData.lastModified) return 'conflict'
    
    // Compare timestamps
    const localTime = new Date(localData.lastModified!).getTime()
    const cloudTime = new Date(cloudData.lastModified!).getTime()
    
    if (localTime > cloudTime) return 'local'
    if (cloudTime > localTime) return 'cloud'
    
    // Same timestamp, compare sync versions
    const localVersion = localData.syncVersion || 0
    const cloudVersion = cloudData.syncVersion || 0
    
    if (localVersion > cloudVersion) return 'local'
    if (cloudVersion > localVersion) return 'cloud'
    
    // Complete tie - no conflict if data is identical
    return 'conflict'
  } catch (error) {
    console.error('Error comparing shop data:', error)
    return 'conflict'
  }
}

export function validateShopData(data: ShopData): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  // Validate required fields
  if (!data.name?.trim()) errors.push('Shop name is required')
  if (!data.currency) errors.push('Currency is required')
  if (!data.unitSystem) errors.push('Unit system is required')

  // Validate numeric fields
  const numericFields: (keyof ShopData)[] = [
    'rentLease', 'utilities', 'digitalInfrastructure', 'insuranceProfessional',
    'marketingAdvertising', 'officeSupplies', 'transportationDelivery', 
    'miscellaneousContingency', 'totalMonthlyHours', 'laborRate', 
    'operatingHours', 'operatingDays', 'powerCostPerKwh', 'vatRate'
  ]

  for (const field of numericFields) {
    const value = data[field] as number
    if (typeof value !== 'number' || isNaN(value) || value < 0) {
      errors.push(`${field} must be a valid positive number`)
    }
  }

  // Validate ranges
  if (data.operatingHours > 24) errors.push('Operating hours cannot exceed 24')
  if (data.operatingDays > 31) errors.push('Operating days cannot exceed 31')
  if (data.vatRate > 100) errors.push('VAT rate cannot exceed 100%')

  // Validate sync metadata if present
  if (data.lastModified && isNaN(new Date(data.lastModified).getTime())) {
    errors.push('Invalid lastModified timestamp')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export function sanitizeShopData(data: Partial<ShopData>): Partial<ShopData> {
  const sanitized = { ...data }

  // Sanitize strings
  if (sanitized.name) sanitized.name = sanitized.name.trim()
  if (sanitized.address) sanitized.address = sanitized.address.trim()
  if (sanitized.phone) sanitized.phone = sanitized.phone.trim()
  if (sanitized.email) sanitized.email = sanitized.email.trim().toLowerCase()
  if (sanitized.slogan) sanitized.slogan = sanitized.slogan.trim()

  // Ensure numeric fields are valid
  const numericFields: (keyof ShopData)[] = [
    'rentLease', 'utilities', 'digitalInfrastructure', 'insuranceProfessional',
    'marketingAdvertising', 'officeSupplies', 'transportationDelivery', 
    'miscellaneousContingency', 'totalMonthlyHours', 'laborRate', 
    'operatingHours', 'operatingDays', 'powerCostPerKwh', 'vatRate'
  ]

  for (const field of numericFields) {
    if (sanitized[field] !== undefined) {
      const value = sanitized[field] as number
      sanitized[field] = Math.max(0, Number(value) || 0)
    }
  }

  // Cap certain values
  if (sanitized.operatingHours !== undefined) {
    sanitized.operatingHours = Math.min(24, sanitized.operatingHours)
  }
  if (sanitized.operatingDays !== undefined) {
    sanitized.operatingDays = Math.min(31, sanitized.operatingDays)
  }
  if (sanitized.vatRate !== undefined) {
    sanitized.vatRate = Math.min(100, sanitized.vatRate)
  }

  return sanitized
}

// Machine Data Functions
export async function saveMachine(machine: DashboardMachine): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new DatabaseError('User not authenticated')

    const { error } = await supabase
      .from('user_machines')
      .upsert({
        user_id: user.id,
        machine_id: machine.id,
        name: machine.name,
        machine_data: machine,
      })

    if (error) throw new DatabaseError('Failed to save machine', error)
  } catch (error) {
    if (error instanceof DatabaseError) throw error
    throw new DatabaseError('Unexpected error saving machine', error)
  }
}

export async function loadAllMachines(): Promise<DashboardMachine[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new DatabaseError('User not authenticated')

    const { data, error } = await supabase
      .from('user_machines')
      .select('machine_data')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })

    if (error) throw new DatabaseError('Failed to load machines', error)

    return data.map(row => row.machine_data)
  } catch (error) {
    if (error instanceof DatabaseError) throw error
    throw new DatabaseError('Unexpected error loading machines', error)
  }
}

export async function deleteMachine(machineId: string): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new DatabaseError('User not authenticated')

    const { error } = await supabase
      .from('user_machines')
      .delete()
      .eq('machine_id', machineId)
      .eq('user_id', user.id)

    if (error) throw new DatabaseError('Failed to delete machine', error)
  } catch (error) {
    if (error instanceof DatabaseError) throw error
    throw new DatabaseError('Unexpected error deleting machine', error)
  }
}

// Material Data Functions
export async function saveMaterial(material: UserMaterial): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new DatabaseError('User not authenticated')

    const { error } = await supabase
      .from('user_materials')
      .upsert({
        user_id: user.id,
        material_id: material.id,
        name: material.name,
        category: material.category,
        material_data: material,
      })

    if (error) throw new DatabaseError('Failed to save material', error)
  } catch (error) {
    if (error instanceof DatabaseError) throw error
    throw new DatabaseError('Unexpected error saving material', error)
  }
}

export async function loadAllMaterials(): Promise<UserMaterial[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new DatabaseError('User not authenticated')

    const { data, error } = await supabase
      .from('user_materials')
      .select('material_data')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })

    if (error) throw new DatabaseError('Failed to load materials', error)

    return data.map(row => row.material_data)
  } catch (error) {
    if (error instanceof DatabaseError) throw error
    throw new DatabaseError('Unexpected error loading materials', error)
  }
}

export async function deleteMaterial(materialId: string): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new DatabaseError('User not authenticated')

    const { error } = await supabase
      .from('user_materials')
      .delete()
      .eq('material_id', materialId)
      .eq('user_id', user.id)

    if (error) throw new DatabaseError('Failed to delete material', error)
  } catch (error) {
    if (error instanceof DatabaseError) throw error
    throw new DatabaseError('Unexpected error deleting material', error)
  }
}