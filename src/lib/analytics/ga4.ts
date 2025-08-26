// Enhanced Google Analytics 4 integration
declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: Record<string, unknown>) => void;
    dataLayer: unknown[];
  }
}

// Initialize dataLayer if it doesn't exist
if (typeof window !== 'undefined') {
  window.dataLayer = window.dataLayer || [];
}

// Enhanced gtag function with error handling
export const gtag = (...args: unknown[]) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push(args);
  }
};

// GA4 Configuration
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Initialize GA4 with enhanced configuration
export const initializeGA4 = () => {
  if (!GA_MEASUREMENT_ID) {
    console.warn('GA4 Measurement ID not found');
    return;
  }

  try {
    // Configure GA4 with enhanced settings
    gtag('config', GA_MEASUREMENT_ID, {
      // Page tracking
      send_page_view: true,
      
      // Enhanced measurement
      enhanced_measurement: true,
      
      // User engagement
      engagement_time_msec: 100,
      
      // Cookie settings
      cookie_domain: 'auto',
      cookie_expires: 63072000, // 2 years
      
      // Privacy settings
      anonymize_ip: true,
      allow_google_signals: true,
      allow_ad_personalization_signals: false,
      
      // Custom settings for SaaS
      custom_map: {
        'custom_user_tier': 'user_tier',
        'custom_subscription_status': 'subscription_status',
        'custom_feature_used': 'feature_used'
      },
      
      // Debug mode (only in development)
      debug_mode: process.env.NODE_ENV === 'development'
    });

    // Set default custom dimensions
    gtag('config', GA_MEASUREMENT_ID, {
      custom_map: {
        custom_parameter_1: 'user_tier',
        custom_parameter_2: 'subscription_plan',
        custom_parameter_3: 'feature_context'
      }
    });

  } catch (error) {
    console.error('Failed to initialize GA4:', error);
  }
};

// User identification with privacy compliance
export const identifyUser = (userId: string, properties?: Record<string, unknown>) => {
  if (!GA_MEASUREMENT_ID) return;

  try {
    gtag('config', GA_MEASUREMENT_ID, {
      user_id: userId,
      ...properties
    });

    // Set user properties
    if (properties) {
      gtag('event', 'set_user_properties', properties);
    }
  } catch (error) {
    console.error('Failed to identify user in GA4:', error);
  }
};

// Enhanced event tracking with automatic retry
export const trackGA4Event = (
  eventName: string,
  parameters?: Record<string, unknown>,
  retryCount = 0
) => {
  if (!GA_MEASUREMENT_ID) return;

  try {
    const eventData = {
      event_category: 'engagement',
      app_name: 'MakerCost',
      timestamp_micros: Date.now() * 1000,
      ...parameters
    };

    gtag('event', eventName, eventData);
    
    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('GA4 Event:', eventName, eventData);
    }
  } catch (error) {
    console.error('GA4 event tracking failed:', error);
    
    // Retry once on failure
    if (retryCount < 1) {
      setTimeout(() => {
        trackGA4Event(eventName, parameters, retryCount + 1);
      }, 1000);
    }
  }
};

// Custom exception tracking
export const trackException = (description: string, fatal = false) => {
  trackGA4Event('exception', {
    description,
    fatal,
    event_category: 'error'
  });
};

// Timing events
export const trackTiming = (
  name: string,
  value: number,
  category = 'performance'
) => {
  trackGA4Event('timing_complete', {
    name,
    value,
    event_category: category
  });
};

// Page view tracking with enhanced data
export const trackPageView = (
  page_title?: string,
  page_location?: string,
  custom_parameters?: Record<string, unknown>
) => {
  trackGA4Event('page_view', {
    page_title: page_title || document.title,
    page_location: page_location || window.location.href,
    ...custom_parameters
  });
};

// Scroll tracking
export const trackScroll = (percent: number) => {
  if (percent === 90) {
    trackGA4Event('scroll', {
      percent_scrolled: percent,
      event_category: 'engagement'
    });
  }
};

// File download tracking
export const trackDownload = (fileName: string, fileType: string) => {
  trackGA4Event('file_download', {
    file_name: fileName,
    file_extension: fileType,
    event_category: 'engagement'
  });
};

// External link tracking
export const trackOutboundClick = (url: string, linkText?: string) => {
  trackGA4Event('click', {
    link_url: url,
    link_text: linkText,
    outbound: true,
    event_category: 'engagement'
  });
};

// Search tracking
export const trackSearch = (searchTerm: string, resultsCount?: number) => {
  trackGA4Event('search', {
    search_term: searchTerm,
    results_count: resultsCount,
    event_category: 'engagement'
  });
};

// Video interaction tracking
export const trackVideoInteraction = (
  action: 'play' | 'pause' | 'complete',
  videoTitle: string,
  videoDuration?: number,
  videoCurrentTime?: number
) => {
  trackGA4Event('video_' + action, {
    video_title: videoTitle,
    video_duration: videoDuration,
    video_current_time: videoCurrentTime,
    event_category: 'video'
  });
};

// Form interaction tracking
export const trackFormInteraction = (
  action: 'start' | 'submit' | 'abandon',
  formName: string,
  formId?: string
) => {
  trackGA4Event('form_' + action, {
    form_name: formName,
    form_id: formId,
    event_category: 'form'
  });
};

// Enhanced consent mode (GDPR compliance)
export const updateConsentMode = (consentSettings: {
  analytics_storage?: 'granted' | 'denied';
  ad_storage?: 'granted' | 'denied';
  functionality_storage?: 'granted' | 'denied';
  personalization_storage?: 'granted' | 'denied';
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('consent', 'update', consentSettings);
  }
};

// Initialize default consent (should be called before GA4 loads)
export const setDefaultConsent = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('consent', 'default', {
      'analytics_storage': 'denied',
      'ad_storage': 'denied',
      'functionality_storage': 'granted',
      'personalization_storage': 'denied',
      'wait_for_update': 500
    });
  }
};