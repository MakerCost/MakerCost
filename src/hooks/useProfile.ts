'use client'

import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'
import { supabase } from '@/lib/supabase/client'

export interface UserProfile {
  id: string
  first_name?: string
  last_name?: string
  username?: string
  avatar_url?: string
  website?: string
  bio?: string
  email?: string
  created_at?: string
  updated_at?: string
}

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  const fetchProfile = async () => {
    if (!user) {
      setProfile(null)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (fetchError) {
        console.error('Error fetching profile:', fetchError)
        setError(fetchError.message)
        
        // Create profile if it doesn't exist
        if (fetchError.code === 'PGRST116') {
          await createProfile()
        }
      } else {
        setProfile({
          ...data,
          email: user.email
        })
      }
    } catch (err) {
      console.error('Unexpected error fetching profile:', err)
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const createProfile = async () => {
    if (!user) return

    try {
      const { data, error: createError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          first_name: user.user_metadata?.first_name || '',
          last_name: user.user_metadata?.last_name || '',
          username: user.user_metadata?.username || '',
        })
        .select()
        .single()

      if (createError) {
        console.error('Error creating profile:', createError)
        setError(createError.message)
      } else {
        setProfile({
          ...data,
          email: user.email
        })
      }
    } catch (err) {
      console.error('Unexpected error creating profile:', err)
      setError('Failed to create profile')
    }
  }

  const updateProfile = async (updates: Partial<Omit<UserProfile, 'id' | 'email' | 'created_at' | 'updated_at'>>) => {
    if (!user || !profile) return { error: 'No user or profile found' }

    try {
      setLoading(true)
      setError(null)

      const { data, error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()

      if (updateError) {
        console.error('Error updating profile:', updateError)
        setError(updateError.message)
        return { error: updateError.message }
      } else {
        setProfile({
          ...data,
          email: user.email
        })
        return { error: null }
      }
    } catch (err) {
      console.error('Unexpected error updating profile:', err)
      const errorMessage = 'An unexpected error occurred'
      setError(errorMessage)
      return { error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [user])

  return {
    profile,
    loading,
    error,
    updateProfile,
    refetchProfile: fetchProfile
  }
}