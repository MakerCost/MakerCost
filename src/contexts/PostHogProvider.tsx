'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { PostHog } from 'posthog-js';

interface PostHogContextType {
  posthog: PostHog | null;
  isLoaded: boolean;
}

const PostHogContext = createContext<PostHogContextType | null>(null);

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const [posthog, setPosthog] = useState<PostHog | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

    if (posthogKey && posthogHost && typeof window !== 'undefined') {
      import('posthog-js').then((posthogModule) => {
        try {
          const posthogInstance = posthogModule.default;
          
          posthogInstance.init(posthogKey, {
            api_host: posthogHost,
            person_profiles: 'identified_only',
            
            // Product Analytics Features
            capture_pageview: true,
            capture_pageleave: true,
            session_recording: {
              maskAllInputs: true,
              maskInputOptions: {
                password: true,
                email: false, // Allow email for user journey analysis
              },
              blockClass: 'ph-no-record',
              blockSelector: '[data-posthog="block"]',
            },
            
            // Heatmaps & Autocapture
            autocapture: {
              dom_event_allowlist: ['click', 'change', 'submit'],
              element_allowlist: ['a', 'button', 'form', 'input', 'select', 'textarea'],
              css_selector_allowlist: ['.track-click', '[data-track]'],
            },
            
            // Feature Flags
            bootstrap: {
              featureFlags: {},
            },
            
            // Performance
            disable_session_recording: false,
            cross_subdomain_cookie: false,
            persistence: 'localStorage+cookie',
            
            loaded: (posthog) => {
              // Global properties for all events
              posthog.register({
                app_name: 'MakerCost',
                app_version: '1.0.0',
                analytics_purpose: 'product_analytics',
              });
              
              // Enable heatmaps for key pages
              if (window.location.pathname === '/' || 
                  window.location.pathname === '/pricing' ||
                  window.location.pathname.includes('/signup')) {
                posthog.startSessionRecording();
              }
              
              setIsLoaded(true);
            },
          });

          setPosthog(posthogInstance);
        } catch (error) {
          console.warn('PostHog initialization failed:', error);
          setIsLoaded(true); // Set loaded even on error to prevent hanging
        }
      }).catch((error) => {
        console.warn('PostHog module import failed:', error);
        setIsLoaded(true);
      });
    } else {
      setIsLoaded(true); // No PostHog config, mark as loaded
    }
  }, []);

  return (
    <PostHogContext.Provider value={{ posthog, isLoaded }}>
      {children}
    </PostHogContext.Provider>
  );
}

export function usePostHog() {
  const context = useContext(PostHogContext);
  if (!context) {
    return { posthog: null, isLoaded: false };
  }
  return context;
}

// Typed PostHog hooks for product analytics
export function useFeatureFlag(key: string): boolean | undefined {
  const { posthog } = usePostHog();
  const [flag, setFlag] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    if (posthog) {
      const flagValue = posthog.isFeatureEnabled(key);
      setFlag(flagValue);

      // Listen for flag changes
      posthog.onFeatureFlags(() => {
        setFlag(posthog.isFeatureEnabled(key));
      });
    }
  }, [posthog, key]);

  return flag;
}

export function usePostHogCapture() {
  const { posthog } = usePostHog();

  const captureEvent = (eventName: string, properties?: Record<string, unknown>) => {
    if (posthog) {
      posthog.capture(eventName, {
        ...properties,
        event_type: 'product_analytics',
        timestamp: new Date().toISOString(),
      });
    }
  };

  const identifyUser = (userId: string, properties?: Record<string, unknown>) => {
    if (posthog) {
      posthog.identify(userId, {
        ...properties,
        identified_via: 'product_analytics',
      });
    }
  };

  const startRecording = () => {
    if (posthog) {
      posthog.startSessionRecording();
    }
  };

  const stopRecording = () => {
    if (posthog) {
      posthog.stopSessionRecording();
    }
  };

  return {
    captureEvent,
    identifyUser,
    startRecording,
    stopRecording,
  };
}