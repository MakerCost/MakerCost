'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface PostHogContextType {
  posthog: unknown;
  isLoaded: boolean;
}

const PostHogContext = createContext<PostHogContextType | null>(null);

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const [posthog, setPosthog] = useState<unknown>(null);
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
            capture_pageview: true,
            capture_pageleave: true,
            loaded: (posthog) => {
              posthog.register({
                app_name: 'MakerCost',
                app_version: '1.0.0',
              });
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