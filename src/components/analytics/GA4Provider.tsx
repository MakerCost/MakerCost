'use client';

import { useEffect, ReactNode } from 'react';
import Script from 'next/script';
import { initializeGA4, setDefaultConsent, GA_MEASUREMENT_ID } from '@/lib/analytics/ga4';

interface GA4ProviderProps {
  children: ReactNode;
}

export function GA4Provider({ children }: GA4ProviderProps) {
  useEffect(() => {
    // Set default consent before GA4 loads
    setDefaultConsent();
  }, []);

  const handleGA4Load = () => {
    // Initialize GA4 with enhanced configuration
    initializeGA4();
    
    // Track initial page view
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href,
        app_name: 'MakerCost'
      });
    }
  };

  // Don't load GA4 if no measurement ID
  const measurementId = GA_MEASUREMENT_ID || 'G-5HLQ9GC26S'; // Fallback for production
  if (!measurementId) {
    console.error('GA4 Measurement ID not found');
    return <>{children}</>;
  }

  return (
    <>
      {/* Google Analytics 4 */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
        onLoad={handleGA4Load}
      />
      <Script
        id="ga4-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            
            // Set default consent
            gtag('consent', 'default', {
              'analytics_storage': 'denied',
              'ad_storage': 'denied',
              'functionality_storage': 'granted',
              'personalization_storage': 'denied',
              'wait_for_update': 500
            });
            
            gtag('js', new Date());
            gtag('config', '${measurementId}');
          `.replace('${measurementId}', measurementId),
        }}
      />
      {children}
    </>
  );
}