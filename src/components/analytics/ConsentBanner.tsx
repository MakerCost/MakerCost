'use client';

import { useState, useEffect } from 'react';
import { updateConsentMode } from '@/lib/analytics/ga4';
import { Card, CardContent } from '@/components/ui/Card';

interface ConsentState {
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

export default function ConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [consent, setConsent] = useState<ConsentState>({
    analytics: false,
    marketing: false,
    functional: true // Functional cookies are typically required
  });

  useEffect(() => {
    // Check if user has already made a consent choice
    const savedConsent = localStorage.getItem('cookie-consent');
    if (!savedConsent) {
      setShowBanner(true);
    } else {
      const consentData = JSON.parse(savedConsent);
      setConsent(consentData);
      updateGAConsent(consentData);
    }
  }, []);

  const updateGAConsent = (consentState: ConsentState) => {
    updateConsentMode({
      analytics_storage: consentState.analytics ? 'granted' : 'denied',
      ad_storage: consentState.marketing ? 'granted' : 'denied',
      functionality_storage: consentState.functional ? 'granted' : 'denied',
      personalization_storage: consentState.marketing ? 'granted' : 'denied'
    });
  };

  const handleAcceptAll = () => {
    const newConsent = {
      analytics: true,
      marketing: true,
      functional: true
    };
    
    setConsent(newConsent);
    localStorage.setItem('cookie-consent', JSON.stringify(newConsent));
    updateGAConsent(newConsent);
    setShowBanner(false);
    
    // Track consent decision
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'consent_granted', {
        event_category: 'privacy',
        consent_type: 'all'
      });
    }
  };

  const handleRejectAll = () => {
    const newConsent = {
      analytics: false,
      marketing: false,
      functional: true // Keep functional as required
    };
    
    setConsent(newConsent);
    localStorage.setItem('cookie-consent', JSON.stringify(newConsent));
    updateGAConsent(newConsent);
    setShowBanner(false);
    
    // Track consent decision
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'consent_denied', {
        event_category: 'privacy',
        consent_type: 'rejected'
      });
    }
  };

  const handleCustomizeConsent = () => {
    localStorage.setItem('cookie-consent', JSON.stringify(consent));
    updateGAConsent(consent);
    setShowBanner(false);
    setShowDetails(false);
    
    // Track consent decision
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'consent_customized', {
        event_category: 'privacy',
        analytics_consent: consent.analytics,
        marketing_consent: consent.marketing
      });
    }
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <Card className="max-w-6xl mx-auto border-2 border-blue-200 shadow-lg">
        <CardContent className="p-6">
          {!showDetails ? (
            // Simple banner
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">
                  🍪 We use cookies to improve your experience
                </h3>
                <p className="text-sm text-gray-600">
                  We use cookies and similar technologies to enhance your browsing experience, 
                  analyze website traffic, and provide personalized content. By clicking &ldquo;Accept All&rdquo;, 
                  you consent to our use of cookies.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 min-w-fit">
                <button
                  onClick={() => setShowDetails(true)}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Customize
                </button>
                <button
                  onClick={handleRejectAll}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Reject All
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Accept All
                </button>
              </div>
            </div>
          ) : (
            // Detailed consent options
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Cookie Preferences</h3>
                <p className="text-sm text-gray-600">
                  Choose which cookies you want to allow. You can change these settings at any time.
                </p>
              </div>

              <div className="space-y-4">
                {/* Functional Cookies - Always required */}
                <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Functional Cookies</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Essential cookies that enable basic website functionality. These cannot be disabled.
                    </p>
                    <div className="text-xs text-gray-500 mt-2">
                      Examples: Authentication, security, preferences
                    </div>
                  </div>
                  <div className="ml-4">
                    <input
                      type="checkbox"
                      checked={true}
                      disabled
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded opacity-50"
                    />
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Analytics Cookies</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Help us understand how visitors interact with our website by collecting anonymous information.
                    </p>
                    <div className="text-xs text-gray-500 mt-2">
                      Examples: Google Analytics, page views, user behavior
                    </div>
                  </div>
                  <div className="ml-4">
                    <input
                      type="checkbox"
                      checked={consent.analytics}
                      onChange={(e) => setConsent(prev => ({ ...prev, analytics: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Marketing Cookies */}
                <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Marketing Cookies</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Used to track visitors across websites to display relevant and engaging ads.
                    </p>
                    <div className="text-xs text-gray-500 mt-2">
                      Examples: Ad targeting, conversion tracking, remarketing
                    </div>
                  </div>
                  <div className="ml-4">
                    <input
                      type="checkbox"
                      checked={consent.marketing}
                      onChange={(e) => setConsent(prev => ({ ...prev, marketing: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 justify-end">
                <button
                  onClick={() => setShowDetails(false)}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleRejectAll}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Reject All
                </button>
                <button
                  onClick={handleCustomizeConsent}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Save Preferences
                </button>
              </div>

              <div className="text-xs text-gray-500 pt-4 border-t border-gray-200">
                For more information about how we use cookies, please read our{' '}
                <a href="/privacy-policy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>{' '}
                and{' '}
                <a href="/cookie-policy" className="text-blue-600 hover:underline">
                  Cookie Policy
                </a>.
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}