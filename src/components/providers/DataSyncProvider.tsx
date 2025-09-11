'use client'

import { useDataSync } from '@/hooks/useDataSync'

interface DataSyncProviderProps {
  children: React.ReactNode
}

/**
 * Provider that initializes data sync after AuthProvider is ready
 * Must be wrapped inside AuthProvider to access user context
 */
export function DataSyncProvider({ children }: DataSyncProviderProps) {
  // Initialize data sync - this will run after AuthProvider is ready
  useDataSync()
  
  return <>{children}</>
}