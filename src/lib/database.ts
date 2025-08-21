import { supabase } from '@/lib/supabase/client'
import type { PricingProject, Quote, DatabaseProject, DatabaseQuote, QuoteStatus } from '@/types/pricing'

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
    
    const { data, error } = await supabase
      .from('quotes')
      .upsert({
        id: quote.id,
        user_id: user.id,
        quote_number: quote.quoteNumber,
        project_name: quote.projectName,
        client_name: quote.clientName,
        status: quote.status,
        quote_data: quoteData,
      })
      .select()
      .single()

    if (error) throw new DatabaseError('Failed to save quote', error)
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
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new DatabaseError('User not authenticated')

    const { data, error } = await supabase
      .from('quotes')
      .select('quote_data')
      .eq('user_id', user.id)
      .eq('status', status)
      .order('updated_at', { ascending: false })

    if (error) throw new DatabaseError('Failed to load quotes by status', error)

    return data.map(row => row.quote_data)
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