'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from './useAuth'
import { supabase } from '@/lib/supabase/client'

export interface AdminStats {
  total_users: number
  total_projects: number
  total_quotes: number
  users_this_month: number
  projects_this_month: number
  quotes_this_month: number
}

export interface AdminUser {
  id: string
  email: string
  first_name?: string
  last_name?: string
  username?: string
  is_admin: boolean
  tier?: string
  created_at: string
  updated_at: string
}

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  const checkAdminStatus = useCallback(async () => {
    if (!user) {
      setIsAdmin(false)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const { data, error: checkError } = await supabase
        .rpc('is_admin')

      if (checkError) {
        console.error('Error checking admin status:', checkError)
        setError(checkError.message)
        setIsAdmin(false)
      } else {
        setIsAdmin(data || false)
      }
    } catch (err) {
      console.error('Unexpected error checking admin status:', err)
      setError('An unexpected error occurred')
      setIsAdmin(false)
    } finally {
      setLoading(false)
    }
  }, [user])

  const getAdminStats = async (): Promise<AdminStats | null> => {
    if (!isAdmin) return null

    try {
      const { data, error } = await supabase
        .rpc('get_admin_stats')

      if (error) {
        console.error('Error fetching admin stats:', error)
        return null
      }

      return data?.[0] || null
    } catch (err) {
      console.error('Unexpected error fetching admin stats:', err)
      return null
    }
  }

  const getAllUsers = async (): Promise<AdminUser[] | null> => {
    if (!isAdmin) return null

    try {
      // Get profiles data
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError)
        return null
      }

      // Get auth users data to get emails
      const { data: authData, error: authError } = await supabase.auth.admin.listUsers()
      
      if (authError) {
        console.error('Error fetching auth users:', authError)
        // Continue with just profiles data if auth query fails
      }

      // Create a map of user ID to email from auth data
      const emailMap = new Map<string, string>()
      console.log('Auth users raw data:', authData?.users)
      
      if (authData?.users) {
        authData.users.forEach(user => {
          console.log('Processing user:', { id: user.id, email: user.email })
          if (user.email) {
            emailMap.set(user.id, user.email)
          }
        })
      }
      
      console.log('Email map created:', Object.fromEntries(emailMap))
      console.log('Profiles data:', profilesData)

      // Transform profiles data and merge with email from auth
      const transformedUsers: AdminUser[] = profilesData.map(profile => {
        const email = emailMap.get(profile.id) || profile.email || ''
        console.log(`User ${profile.id}: profile.email=${profile.email}, mapped email=${emailMap.get(profile.id)}, final email=${email}`)
        
        return {
          id: profile.id,
          email: email,
          first_name: profile.first_name,
          last_name: profile.last_name,
          username: profile.username,
          is_admin: profile.is_admin || false,
          tier: profile.tier || 'free',
          created_at: profile.created_at,
          updated_at: profile.updated_at || profile.created_at
        }
      })

      console.log('Users query successful:', transformedUsers)
      return transformedUsers
    } catch (err) {
      console.error('Unexpected error fetching all users:', err)
      return null
    }
  }

  const setAdminStatus = async (targetUserId: string, adminStatus: boolean): Promise<boolean> => {
    if (!isAdmin) return false

    try {
      const { data, error } = await supabase
        .rpc('set_admin_status', {
          target_user_id: targetUserId,
          admin_status: adminStatus
        })

      if (error) {
        console.error('Error setting admin status:', error)
        return false
      }

      return data || false
    } catch (err) {
      console.error('Unexpected error setting admin status:', err)
      return false
    }
  }

  useEffect(() => {
    checkAdminStatus()
  }, [user, checkAdminStatus])

  return {
    isAdmin,
    loading,
    error,
    getAdminStats,
    getAllUsers,
    setAdminStatus,
    refetchAdminStatus: checkAdminStatus
  }
}