// Next.js 15.3+ Instrumentation for PostHog
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Server-side instrumentation can go here if needed
    console.log('Server-side instrumentation loaded');
  }
}

// Client-side instrumentation
if (typeof window !== 'undefined') {
  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (posthogKey && posthogHost) {
    import('posthog-js').then((posthog) => {
      posthog.default.init(posthogKey, {
        api_host: posthogHost,
        person_profiles: 'identified_only',
        capture_pageview: true,
        capture_pageleave: true,
        loaded: (posthog) => {
          posthog.register({
            app_name: 'MakerCost',
            app_version: '1.0.0',
          });
        },
      });
    }).catch((error) => {
      console.warn('PostHog initialization failed:', error);
    });
  }
}