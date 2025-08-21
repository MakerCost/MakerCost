// Google Analytics 4 utility functions
declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: Record<string, unknown>) => void;
  }
}

// Custom event tracking for Google Analytics
export const trackEvent = (eventName: string, parameters?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      app_name: 'MakerCost',
      ...parameters,
    });
  }
};

// Business-specific event tracking functions
export const trackQuoteCreated = (productCount: number, totalValue: number, currency: string) => {
  trackEvent('quote_created', {
    event_category: 'business',
    event_label: 'quote_generation',
    product_count: productCount,
    value: totalValue,
    currency: currency,
  });
};

export const trackQuoteFinalized = (quoteId: string, totalValue: number, currency: string) => {
  trackEvent('quote_finalized', {
    event_category: 'conversion',
    event_label: 'quote_completion',
    quote_id: quoteId,
    value: totalValue,
    currency: currency,
  });
};

export const trackMaterialAdded = (materialType: string) => {
  trackEvent('material_added', {
    event_category: 'engagement',
    event_label: 'material_management',
    material_type: materialType,
  });
};

export const trackDemoDataLoaded = () => {
  trackEvent('demo_data_loaded', {
    event_category: 'engagement',
    event_label: 'user_onboarding',
  });
};

export const trackPricingCalculated = (totalMaterialCost: number, profitMargin: number) => {
  trackEvent('pricing_calculated', {
    event_category: 'engagement',
    event_label: 'core_feature_usage',
    material_cost: totalMaterialCost,
    profit_margin: profitMargin,
  });
};

export const trackFeatureUsage = (featureName: string, details?: Record<string, unknown>) => {
  trackEvent('feature_used', {
    event_category: 'engagement',
    event_label: featureName,
    ...details,
  });
};

export const trackUserAuthentication = (action: 'login' | 'signup' | 'logout') => {
  trackEvent('user_authentication', {
    event_category: 'user',
    event_label: action,
  });
};

// Conversion tracking
export const trackConversion = (conversionType: string, value?: number, currency?: string) => {
  trackEvent('conversion', {
    event_category: 'conversion',
    event_label: conversionType,
    value: value,
    currency: currency,
  });
};