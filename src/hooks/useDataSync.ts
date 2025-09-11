'use client'

import { useEffect, useRef } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useShopStore } from '@/store/shop-store'
import { useMachineStore } from '@/store/machine-store'
import { useUserMaterialsStore } from '@/store/user-materials-store'

/**
 * Hook to automatically sync user data between localStorage and Supabase
 * This handles the migration from local-only storage to cloud storage
 */
export function useDataSync() {
  const { user } = useAuth()
  const hasRunSync = useRef(false)
  
  // Store hooks
  const { loadFromDatabase: loadShopData, saveToDatabase: saveShopData, shopData } = useShopStore()
  const { loadFromDatabase: loadMachineData, saveToDatabase: saveMachineData, machines } = useMachineStore()
  const { loadFromDatabase: loadMaterialData, saveToDatabase: saveMaterialData, materials } = useUserMaterialsStore()

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 DataSync useEffect triggered:', { 
        hasUser: !!user, 
        userEmail: user?.email,
        hasRunSync: hasRunSync.current 
      })
    }
    
    if (!user || hasRunSync.current) {
      if (process.env.NODE_ENV === 'development') {
        if (!user) {
          console.log('⏸️ DataSync skipped: No authenticated user')
        }
        if (hasRunSync.current) {
          console.log('⏸️ DataSync skipped: Already ran sync')
        }
      }
      return
    }

    const syncUserData = async () => {
      if (process.env.NODE_ENV === 'development') {
        console.log('🔄 Starting user data sync...')
      }
      
      try {
        if (process.env.NODE_ENV === 'development') {
          console.log('📡 Loading data from Supabase...')
        }
        // Load cloud data and update stores with it
        await Promise.all([
          loadShopData(),
          loadMachineData(), 
          loadMaterialData()
        ])
        
        if (process.env.NODE_ENV === 'development') {
          console.log('✅ Data sync completed - cloud data loaded and stores updated')
        }
        
        // No need to check for migration since the stores already loaded and used the cloud data
        // If cloud data existed, it's now in the stores. If not, stores kept their local/default data.
        
      } catch (error) {
        console.error('❌ Data sync failed:', error)
      }
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('⏰ Setting sync timeout for 1 second...')
    }
    // Run sync after a short delay to ensure stores are initialized
    const timeoutId = setTimeout(() => {
      if (process.env.NODE_ENV === 'development') {
        console.log('⏰ Sync timeout triggered, executing sync...')
      }
      syncUserData()
    }, 1000)
    hasRunSync.current = true

    return () => clearTimeout(timeoutId)
  }, [user, loadShopData, loadMachineData, loadMaterialData, saveShopData, saveMachineData, saveMaterialData, shopData, machines, materials])

  // Reset sync flag when user logs out
  useEffect(() => {
    if (!user) {
      if (process.env.NODE_ENV === 'development') {
        console.log('🔄 User logged out, resetting sync flag')
      }
      hasRunSync.current = false
    }
  }, [user])

  // For debugging: reset sync flag on every page refresh in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 Component mounted, resetting sync flag for debugging')
    }
    hasRunSync.current = false
  }, [])
}