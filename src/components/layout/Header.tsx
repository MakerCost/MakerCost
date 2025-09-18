'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/contexts/ToastContext';
import UserMenu from '@/components/auth/UserMenu';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const { addToast } = useToast();

  const isActivePath = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      addToast('Error signing out', 'error');
    } else {
      addToast('Successfully signed out', 'success');
    }
    setIsMobileMenuOpen(false);
  };

  const getDisplayName = () => {
    return profile?.first_name && profile?.last_name
      ? `${profile.first_name} ${profile.last_name}`
      : profile?.username || user?.email;
  };

  const getInitials = () => {
    return profile?.first_name && profile?.last_name
      ? `${profile.first_name.charAt(0)}${profile.last_name.charAt(0)}`
      : (profile?.username?.charAt(0) || user?.email?.charAt(0) || '?').toUpperCase();
  };

  const navigation = [
    {
      name: 'Products',
      items: [
        { name: 'Calculator', href: '/', description: 'Professional P&L calculator' },
        { name: 'Calendar', href: '#', description: 'Coming Soon', isComingSoon: true },
      ]
    },
    {
      name: 'Pricing',
      href: '/pricing',
      description: 'Compare Free vs Pro plans'
    },
    {
      name: 'Blog',
      href: '/blog',
      description: 'Tips and guides for makers'
    },
    {
      name: 'Resources',
      items: [
        { name: 'User Guide', href: '/guide', description: 'Complete calculator tutorial' },
        { name: 'FAQ', href: '/faq', description: 'Frequently asked questions' },
        { name: 'Contact', href: '/contact', description: 'Get in touch with us' },
      ]
    }
  ];

  return (
    <header className="bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center">
              <Image 
                src="/makercost-logo-new.png" 
                alt="MakerCost Logo" 
                width={280}
                height={84}
                className="h-20 w-auto"
                priority
              />
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <div key={item.name} className="relative group">
                {item.items ? (
                  // Dropdown menu
                  <div className="relative">
                    <button
                      className={`text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white px-3 py-2 text-sm font-medium transition-colors ${
                        item.items.some(subItem => isActivePath(subItem.href)) ? 'text-blue-600 dark:text-blue-400' : ''
                      }`}
                    >
                      {item.name}
                    </button>
                    
                    {/* Dropdown content */}
                    <div className="absolute left-0 mt-2 w-64 bg-white dark:bg-slate-700 rounded-md shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border dark:border-slate-600">
                      {item.items.map((subItem) => (
                        <div key={subItem.name}>
                          {subItem.isComingSoon ? (
                            <div className="px-4 py-3 text-gray-400 dark:text-gray-500 cursor-not-allowed">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="text-sm font-medium">{subItem.name}</div>
                                  <div className="text-xs">{subItem.description}</div>
                                </div>
                                <span className="text-xs bg-gray-100 dark:bg-slate-600 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">Coming Soon</span>
                              </div>
                            </div>
                          ) : (
                            <Link
                              href={subItem.href}
                              className={`block px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors ${
                                isActivePath(subItem.href) ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-200'
                              }`}
                            >
                              <div className="font-medium">{subItem.name}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">{subItem.description}</div>
                            </Link>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  // Single link
                  <Link
                    href={item.href!}
                    className={`text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white px-3 py-2 text-sm font-medium transition-colors ${
                      isActivePath(item.href!) ? 'text-blue-600 dark:text-blue-400' : ''
                    }`}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
            </nav>
          </div>

          {/* Right side - User Menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden lg:block">
              <UserMenu />
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden ml-4 inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200 dark:border-slate-600">
              {/* User content section */}
              {user ? (
                <div className="px-3 py-4 border-b border-gray-200 dark:border-slate-600 mb-2">
                  {/* User info */}
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {getInitials()}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white text-sm">{getDisplayName()}</div>
                      <div className="text-gray-600 dark:text-gray-300 text-xs">{user.email}</div>
                      {!user.email_confirmed_at && (
                        <div className="text-amber-600 text-xs mt-1">⚠️ Email not verified</div>
                      )}
                    </div>
                  </div>

                  {/* User menu items */}
                  <div className="space-y-1">
                    <Link
                      href="/account/settings"
                      className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white transition-colors rounded-md"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Account Settings
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white transition-colors rounded-md"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="px-3 py-4 border-b border-gray-200 dark:border-slate-600 mb-2">
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        router.push('/login');
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors rounded-md"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => {
                        router.push('/signup');
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Sign Up
                    </button>
                  </div>
                </div>
              )}

              {/* Site navigation */}
              {navigation.map((item) => (
                <div key={item.name} className="space-y-1">
                  {item.items ? (
                    <>
                      <div className="text-gray-900 dark:text-gray-100 font-medium px-3 py-2 text-sm">
                        {item.name}
                      </div>
                      {item.items.map((subItem) => (
                        <div key={subItem.name}>
                          {subItem.isComingSoon ? (
                            <div className="text-gray-400 dark:text-gray-500 px-6 py-2 text-sm flex items-center justify-between">
                              <span>{subItem.name}</span>
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">Coming Soon</span>
                            </div>
                          ) : (
                            <Link
                              href={subItem.href}
                              className={`block px-6 py-2 text-sm transition-colors ${
                                isActivePath(subItem.href)
                                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                                  : 'text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-700'
                              }`}
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {subItem.name}
                            </Link>
                          )}
                        </div>
                      ))}
                    </>
                  ) : (
                    <Link
                      href={item.href!}
                      className={`block px-3 py-2 text-sm font-medium transition-colors ${
                        isActivePath(item.href!)
                          ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                          : 'text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-700'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}