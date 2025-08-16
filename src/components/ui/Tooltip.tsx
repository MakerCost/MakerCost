'use client';

import { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
  maxWidth?: string;
}

export default function Tooltip({ 
  content, 
  children, 
  placement = 'auto', 
  maxWidth = 'max-w-xs' 
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState(placement);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && placement === 'auto' && tooltipRef.current && triggerRef.current) {
      const tooltip = tooltipRef.current;
      const trigger = triggerRef.current;
      const rect = trigger.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();
      
      const spaceAbove = rect.top;
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceLeft = rect.left;
      const spaceRight = window.innerWidth - rect.right;

      // Determine best position based on available space
      if (spaceBelow >= tooltipRect.height + 10) {
        setPosition('bottom');
      } else if (spaceAbove >= tooltipRect.height + 10) {
        setPosition('top');
      } else if (spaceRight >= tooltipRect.width + 10) {
        setPosition('right');
      } else if (spaceLeft >= tooltipRect.width + 10) {
        setPosition('left');
      } else {
        setPosition('bottom'); // fallback
      }
    }
  }, [isVisible, placement]);

  const handleMouseEnter = () => {
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  const handleClick = () => {
    setIsVisible(!isVisible);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsVisible(!isVisible);
  };

  const getTooltipClasses = () => {
    const baseClasses = `
      absolute z-50 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-lg
      transition-opacity duration-200 pointer-events-none
      ${maxWidth}
    `;

    const positionClasses = {
      top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
      bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
      left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
      right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
    };

    const arrowClasses = {
      top: 'before:absolute before:top-full before:left-1/2 before:transform before:-translate-x-1/2 before:border-4 before:border-transparent before:border-t-gray-900',
      bottom: 'before:absolute before:bottom-full before:left-1/2 before:transform before:-translate-x-1/2 before:border-4 before:border-transparent before:border-b-gray-900',
      left: 'before:absolute before:left-full before:top-1/2 before:transform before:-translate-y-1/2 before:border-4 before:border-transparent before:border-l-gray-900',
      right: 'before:absolute before:right-full before:top-1/2 before:transform before:-translate-y-1/2 before:border-4 before:border-transparent before:border-r-gray-900',
    };

    // Handle auto position by defaulting to top
    const actualPosition = position === 'auto' ? 'top' : position;
    return `${baseClasses} ${positionClasses[actualPosition]} ${arrowClasses[actualPosition]}`;
  };

  // Close tooltip when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (
        isVisible &&
        tooltipRef.current &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsVisible(false);
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isVisible]);

  return (
    <div className="relative inline-block">
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        className="cursor-help"
        role="button"
        aria-describedby={isVisible ? 'tooltip' : undefined}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsVisible(!isVisible);
          }
        }}
      >
        {children}
      </div>
      
      {isVisible && (
        <div
          ref={tooltipRef}
          id="tooltip"
          role="tooltip"
          className={getTooltipClasses()}
          style={{
            opacity: isVisible ? 1 : 0,
          }}
        >
          {content}
        </div>
      )}
      
      {/* Mobile overlay backdrop */}
      {isVisible && (
        <div 
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setIsVisible(false)}
          onTouchStart={() => setIsVisible(false)}
        />
      )}
    </div>
  );
}

// Helper component for the question mark icon
export function QuestionMarkIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg 
      className={`${className} text-gray-400 hover:text-gray-600 transition-colors`} 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
      />
    </svg>
  );
}