'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import AuthGuard from '@/components/auth/AuthGuard'
import { useAdmin } from '@/hooks/useAdmin'

const navigationItems = [
  {
    name: 'Profile',
    href: '/account/settings',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    name: 'My Quotes',
    href: '/account/quotes',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    name: 'My Shop',
    href: '/account/shop',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    name: 'My Machines',
    href: '/account/tools',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    name: 'My Materials',
    href: '/account/materials',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
]

export default function MaterialsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { isAdmin } = useAdmin()

  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <Link href="/" className="flex items-center">
                  <Image src="/makercost-logo.png" alt="MakerCost" width={128} height={32} className="h-8 w-auto" />
                </Link>
                <nav className="hidden md:ml-8 md:flex md:space-x-8">
                  <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white cursor-pointer">
                    Calculator
                  </Link>
                </nav>
              </div>
              
              {/* Mobile menu button */}
              <div className="xl:hidden">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 rounded-md text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Bar for Desktop (xl screens and up) */}
        <div className="hidden xl:block bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-8 py-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Account:</h2>
              <nav className="flex space-x-8">
                {navigationItems.map((item) => {
                  const isActive = pathname === item.href
                  
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors ${
                        isActive
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                          : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span className={`mr-2 ${isActive ? 'text-blue-700 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400'}`}>
                        {item.icon}
                      </span>
                      {item.name}
                    </Link>
                  )
                })}
                
                {/* Admin Menu Item */}
                {isAdmin && (
                  <Link
                    href="/account/admin"
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors ${
                      pathname === '/account/admin'
                        ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                        : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className={`mr-2 ${pathname === '/account/admin' ? 'text-red-700 dark:text-red-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400'}`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </span>
                    Admin Panel
                  </Link>
                )}
              </nav>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar Navigation */}
        <div className={`${sidebarOpen ? 'block' : 'hidden'} xl:hidden fixed inset-0 z-50 bg-gray-600 bg-opacity-75`}>
          <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Account Settings</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-md text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="p-4 space-y-1">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className={`mr-3 ${isActive ? 'text-blue-700 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400'}`}>
                      {item.icon}
                    </span>
                    {item.name}
                  </Link>
                )
              })}
              
              {/* Admin Menu Item */}
              {isAdmin && (
                <>
                  <div className="border-t border-gray-200 dark:border-gray-600 my-3"></div>
                  <Link
                    href="/account/admin"
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors ${
                      pathname === '/account/admin'
                        ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                        : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className={`mr-3 ${pathname === '/account/admin' ? 'text-red-700 dark:text-red-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400'}`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </span>
                    Admin Panel
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}