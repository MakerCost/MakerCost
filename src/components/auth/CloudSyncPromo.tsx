'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface CloudSyncPromoProps {
  feature: string // e.g., "save projects", "sync across devices"
}

export default function CloudSyncPromo({ feature }: CloudSyncPromoProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [dismissed, setDismissed] = useState(false)

  // Don't show if user is authenticated or has dismissed
  if (user || dismissed) {
    return null
  }

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Want to {feature} to the cloud?
            </h3>
            <div className="mt-1 text-sm text-blue-700 dark:text-blue-300">
              <p>Sign up for a free account to sync your data across devices and never lose your work!</p>
            </div>
            <div className="mt-3 flex space-x-2">
              <button
                onClick={() => router.push('/signup')}
                className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Sign Up Free
              </button>
              <button
                onClick={() => router.push('/login')}
                className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="flex-shrink-0 text-blue-400 dark:text-blue-300 hover:text-blue-500 dark:hover:text-blue-200 cursor-pointer"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}