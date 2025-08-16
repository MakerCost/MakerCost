'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'

export default function VerifiedPage() {
  const [loading, setLoading] = useState(true)
  const { user, loading: authLoading } = useAuth()
  const { addToast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading) {
      if (user) {
        addToast('Welcome to MakerCost! Your account is now active.', 'success')
        setTimeout(() => {
          router.push('/')
        }, 3000)
      }
      setLoading(false)
    }
  }, [user, authLoading, addToast, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying your account...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Email Verified!
          </h2>
          
          <p className="mt-2 text-sm text-gray-600">
            Your email has been successfully verified. Welcome to MakerCost!
          </p>
          
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <h3 className="text-sm font-medium text-green-800 mb-2">
              You now have access to:
            </h3>
            <ul className="text-sm text-green-700 list-disc list-inside space-y-1">
              <li>Cloud sync across all your devices</li>
              <li>Save and manage multiple quotes</li>
              <li>Export professional proposals</li>
              <li>Premium calculation features</li>
            </ul>
          </div>
          
          {user ? (
            <div className="mt-6 space-y-4">
              <p className="text-sm text-gray-600">
                Redirecting you to the dashboard in a few seconds...
              </p>
              
              <Link 
                href="/"
                className="inline-block bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Go to Dashboard
              </Link>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              <p className="text-sm text-red-600">
                There was an issue signing you in automatically.
              </p>
              
              <Link 
                href="/login"
                className="inline-block bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Sign In
              </Link>
            </div>
          )}
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <Link 
              href="/"
              className="text-blue-600 hover:underline text-sm cursor-pointer"
            >
              ← Back to MakerCost
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}