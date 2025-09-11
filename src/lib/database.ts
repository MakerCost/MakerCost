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

// Shop Data Functions
export async function saveShopData(shopData: ShopData): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new DatabaseError('User not authenticated')

    const { error } = await supabase
      .from('user_shops')
      .upsert({
        user_id: user.id,
        shop_data: shopData,
      })

    if (error) throw new DatabaseError('Failed to save shop data', error)
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
      .select('shop_data')
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