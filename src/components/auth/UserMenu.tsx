'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import { useRouter } from 'next/navigation'
import { useProfile } from '@/hooks/useProfile'

export default function UserMenu() {
  const { user, signOut } = useAuth()
  const { profile } = useProfile()
  const { addToast } = useToast()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    const { error } = await signOut()
    if (error) {
      addToast('Error signing out', 'error')
    } else {
      addToast('Successfully signed out', 'success')
    }
    setIsOpen(false)
  }

  // Show sign in/up buttons when not authenticated
  if (!user) {
    return (
      <div className="flex items-center space-x-3">
        <button
          onClick={() => router.push('/login')}
          className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
        >
          Sign In
        </button>
        <button
          onClick={() => router.push('/signup')}
          className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer"
        >
          Sign Up
        </button>
      </div>
    )
  }

  const displayName = profile?.first_name && profile?.last_name 
    ? `${profile.first_name} ${profile.last_name}`
    : profile?.username || user.email

  const initials = profile?.first_name && profile?.last_name
    ? `${profile.first_name.charAt(0)}${profile.last_name.charAt(0)}`
    : (profile?.username?.charAt(0) || user.email?.charAt(0) || '?').toUpperCase()

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none cursor-pointer"
      >
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
          {initials}
        </div>
        <span className="hidden sm:block text-sm font-medium">{displayName}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 border">
          <div className="px-4 py-3 text-xs text-gray-500 border-b">
            <div className="font-medium text-gray-900 truncate text-sm">{displayName}</div>
            <div className="text-gray-600 truncate">{user.email}</div>
            {!user.email_confirmed_at && (
              <div className="text-amber-600 text-xs mt-1">⚠️ Email not verified</div>
            )}
          </div>
          
          <button
            onClick={() => {
              router.push('/account/settings')
              setIsOpen(false)
            }}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Account Settings
          </button>
          
          <button
            onClick={handleSignOut}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}