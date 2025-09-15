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

      // Load cloud data
      const [cloudShopData, cloudMachineData, cloudMaterialData] = await Promise.all([
        loadShopData(),
        loadMachineData(), 
        loadMaterialData()
      ])

      let hasConflicts = false

      // Handle Shop Data Sync
      if (cloudShopData && shopData) {
        const comparison = await compareShopData(shopData, cloudShopData)
        
        if (comparison === 'conflict') {
          hasConflicts = true
          if (resolveConflicts === 'ask') {
            setSyncStatus('conflict')
            setSyncError('Shop data conflict detected. Please choose which version to keep.')
            return
          } else if (resolveConflicts === 'cloud') {
            // Use cloud data
            // The store's loadFromDatabase will handle this
          } else {
            // Use local data - save to cloud
            await saveShopData()
          }
        } else if (comparison === 'cloud') {
          // Cloud is newer - load it
          await loadShopData()
        } else {
          // Local is newer - save to cloud
          await saveShopData()
        }
      } else if (cloudShopData && !shopData) {
        // No local data, use cloud
        await loadShopData()
      } else if (!cloudShopData && shopData) {
        // No cloud data, save local
        await saveShopData()
      }

      // Handle Machine and Material data (simplified for now)
      if (cloudMachineData?.length && machines.length === 0) {
        await loadMachineData()
      } else if (!cloudMachineData?.length && machines.length > 0) {
        await saveMachineData()
      }

      if (cloudMaterialData?.length && materials.length === 0) {
        await loadMaterialData()
      } else if (!cloudMaterialData?.length && materials.length > 0) {
        await saveMaterialData()
      }

      if (!hasConflicts) {
        setSyncStatus('synced')
        if (process.env.NODE_ENV === 'development') {
          console.log('✅ Smart sync completed successfully')
        }
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