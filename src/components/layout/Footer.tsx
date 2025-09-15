'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Product',
      links: [
        { name: 'Calculator', href: '/' },
        { name: 'Pricing', href: '/pricing' },
        { name: 'Features', href: '/#features' },
      ]
    },
    {
      title: 'Support',
      links: [
        { name: 'FAQ', href: '/faq' },
        { name: 'Contact Us', href: '/contact' },
      ]
    },
    {
      title: 'Legal',
      links: [
        { name: 'Terms of Service', href: '/terms-of-service' },
        { name: 'Privacy Policy', href: '/privacy-policy' },
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Blog', href: '/blog' },
      ]
    }
  ];

  return (
    <footer className="bg-gray-900 dark:bg-slate-900 text-white dark:text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <Image 
                src="/makercost-logo-new.png" 
                alt="MakerCost Logo" 
                width={280}
                height={84}
                className="h-20 w-auto"
              />
            </div>
            <p className="text-gray-300 dark:text-gray-400 text-sm leading-relaxed mb-6">
              Professional P&L calculator for makers and custom product businesses. 
              Calculate accurate pricing, manage materials, and grow your business with confidence.
            </p>
            <div className="flex space-x-4">
              {/* Social Links - placeholder for future */}
              <a 
                href="#" 
                className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-200 transition-colors"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-200 transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation Sections */}
          {footerSections.map((section) => (
            <div key={section.title} className="lg:col-span-1">
              <h3 className="text-sm font-semibold text-white dark:text-gray-100 uppercase tracking-wider mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    {link.isComingSoon ? (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400 dark:text-gray-500 cursor-not-allowed">
                          {link.name}
                        </span>
                        <span className="text-xs bg-gray-700 dark:bg-slate-700 text-gray-300 dark:text-gray-400 px-2 py-1 rounded-full">
                          Soon
                        </span>
                      </div>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-200 transition-colors duration-200"
                      >
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-800 dark:border-slate-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-sm text-gray-400 dark:text-gray-500">
                © {currentYear} MakerCost. All rights reserved.
              </p>
              <div className="flex space-x-6">
                <Link
                  href="/terms-of-service"
                  className="text-sm text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-200 transition-colors"
                >
                  Terms
                </Link>
                <Link
                  href="/privacy-policy"
                  className="text-sm text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-200 transition-colors"
                >
                  Privacy
                </Link>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0">
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Made with ❤️ for makers worldwide
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}