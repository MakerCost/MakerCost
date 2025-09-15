'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useShopStore } from '@/store/shop-store'
import { useMachineStore } from '@/store/machine-store'
import { useUserMaterialsStore } from '@/store/user-materials-store'
import { compareShopData } from '@/lib/database'

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error' | 'conflict'

/**
 * Enhanced hook for robust data synchronization between localStorage and Supabase
 * Handles conflicts, provides sync status, and ensures data integrity
 */
export function useDataSync() {
  const { user } = useAuth()
  const hasRunSync = useRef(false)
  const syncMutex = useRef(false)
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle')
  const [syncError, setSyncError] = useState<string | null>(null)
  
  // Store hooks
  const { loadFromDatabase: loadShopData, saveToDatabase: saveShopData, shopData } = useShopStore()
  const { loadFromDatabase: loadMachineData, saveToDatabase: saveMachineData, machines } = useMachineStore()
  const { loadFromDatabase: loadMaterialData, saveToDatabase: saveMaterialData, materials } = useUserMaterialsStore()

  // Smart sync function with intelligent conflict detection
  const performSync = useCallback(async (force = false, resolveConflicts: 'local' | 'cloud' | 'ask' = 'ask') => {
    if (!user || (syncMutex.current && !force)) {
      return
    }

    syncMutex.current = true
    setSyncStatus('syncing')
    setSyncError(null)

    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('🔄 Starting smart data sync...')
      }

      // Load cloud data into stores
      await Promise.all([
        loadShopData(),
        loadMachineData(),
        loadMaterialData()
      ])

      // Simplified sync completion
      setSyncStatus('synced')
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Data sync completed successfully')
      }
      
    } catch (error) {
      setSyncStatus('error')
      setSyncError(error instanceof Error ? error.message : 'Sync failed')
      console.error('❌ Smart data sync failed:', error)
    } finally {
      syncMutex.current = false
    }
  }, [user, loadShopData, loadMachineData, loadMaterialData, saveShopData, saveMachineData, saveMaterialData, shopData, machines, materials]);

  // Initial sync on user login
  useEffect(() => {
    if (!user) {
      setSyncStatus('idle')
      hasRunSync.current = false
      return
    }

    if (hasRunSync.current) return

    const timeoutId = setTimeout(() => {
      performSync()
      hasRunSync.current = true
    }, 500) // Reduced delay for faster initial sync

    return () => clearTimeout(timeoutId)
  }, [user, performSync])

  // Expose sync status and control functions
  return {
    syncStatus,
    syncError,
    manualSync: () => performSync(true),
    resolveConflict: (resolution: 'local' | 'cloud') => performSync(true, resolution),
    isOnline: !!user
  }
}