'use client';

import { useState, ReactNode } from 'react';

interface AccordionSectionProps {
  title: string;
  children: ReactNode;
  defaultExpanded?: boolean;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  showBadge?: boolean;
  badgeContent?: string | number;
}

export default function AccordionSection({
  title,
  children,
  defaultExpanded = false,
  className = '',
  headerClassName = '',
  contentClassName = '',
  showBadge = false,
  badgeContent
}: AccordionSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-lg shadow dark:shadow-slate-700/10 ${className}`}>
      {/* Accordion Header */}
      <button
        onClick={toggleExpanded}
        className={`w-full flex items-center justify-between p-4 sm:p-6 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 rounded-t-lg hover:bg-gray-50 dark:hover:bg-slate-750 transition-colors ${headerClassName}`}
        aria-expanded={isExpanded}
        aria-controls={`accordion-content-${title.replace(/\s+/g, '-').toLowerCase()}`}
      >
        <div className="flex items-center gap-3">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
            {title}
          </h2>
          {showBadge && badgeContent !== undefined && (
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full">
              {badgeContent}
            </span>
          )}
        </div>
        
        {/* Caret Icon - Best practice from Nielsen Norman Group */}
        <div className="flex-shrink-0 ml-2">
          {isExpanded ? (
            <svg className="h-5 w-5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          ) : (
            <svg className="h-5 w-5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </div>
      </button>

      {/* Accordion Content */}
      <div
        id={`accordion-content-${title.replace(/\s+/g, '-').toLowerCase()}`}
        className={`transition-all duration-200 ease-in-out overflow-hidden ${
          isExpanded ? 'max-h-none opacity-100' : 'max-h-0 opacity-0'
        }`}
        style={{
          maxHeight: isExpanded ? 'none' : '0',
        }}
        aria-hidden={!isExpanded}
      >
        <div className={`p-4 sm:p-6 pt-0 border-t border-gray-200 dark:border-slate-600 ${contentClassName}`}>
          {children}
        </div>
      </div>
    </div>
  );
}