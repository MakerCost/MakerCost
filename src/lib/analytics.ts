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

// Enhanced E-commerce tracking for subscriptions
export const trackSubscriptionPurchase = (
  transactionId: string,
  planId: string,
  planName: string,
  value: number,
  currency: string,
  provider: string
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    // Track purchase event with enhanced e-commerce
    window.gtag('event', 'purchase', {
      transaction_id: transactionId,
      value: value,
      currency: currency,
      payment_type: provider,
      items: [
        {
          item_id: planId,
          item_name: planName,
          item_category: 'subscription',
          item_variant: provider,
          price: value,
          quantity: 1,
        },
      ],
      // Custom parameters
      subscription_type: planId.includes('yearly') ? 'yearly' : 'monthly',
      subscription_tier: planId.includes('pro') ? 'pro' : 'free',
      payment_provider: provider,
    });

    // Also track as conversion
    trackConversion('subscription_purchase', value, currency);
  }
};

export const trackSubscriptionCancellation = (
  subscriptionId: string,
  planId: string,
  provider: string,
  reason?: string
) => {
  trackEvent('subscription_cancelled', {
    event_category: 'subscription',
    event_label: 'cancellation',
    subscription_id: subscriptionId,
    plan_id: planId,
    provider: provider,
    cancellation_reason: reason,
    subscription_tier: planId.includes('pro') ? 'pro' : 'free',
  });
};

export const trackSubscriptionUpgrade = (
  subscriptionId: string,
  oldPlanId: string,
  newPlanId: string,
  provider: string
) => {
  trackEvent('subscription_upgraded', {
    event_category: 'subscription',
    event_label: 'upgrade',
    subscription_id: subscriptionId,
    old_plan_id: oldPlanId,
    new_plan_id: newPlanId,
    provider: provider,
    old_tier: oldPlanId.includes('pro') ? 'pro' : 'free',
    new_tier: newPlanId.includes('pro') ? 'pro' : 'free',
  });
};

export const trackPaymentFailure = (
  subscriptionId: string,
  planId: string,
  provider: string,
  error: string
) => {
  trackEvent('payment_failed', {
    event_category: 'payment',
    event_label: 'failure',
    subscription_id: subscriptionId,
    plan_id: planId,
    provider: provider,
    error_message: error,
    subscription_tier: planId.includes('pro') ? 'pro' : 'free',
  });
};

// Subscription funnel tracking
export const trackSubscriptionFunnelStep = (
  step: 'pricing_page_view' | 'plan_selected' | 'payment_started' | 'payment_completed' | 'onboarding_completed',
  planId?: string,
  additionalData?: Record<string, unknown>
) => {
  trackEvent('subscription_funnel', {
    event_category: 'funnel',
    event_label: step,
    funnel_step: step,
    plan_id: planId,
    subscription_tier: planId?.includes('pro') ? 'pro' : 'free',
    ...additionalData,
  });
};

// Feature usage tracking for subscription optimization
export const trackFeatureUsageWithTier = (
  featureName: string,
  userTier: 'free' | 'pro',
  success: boolean = true,
  details?: Record<string, unknown>
) => {
  trackEvent('feature_usage_by_tier', {
    event_category: 'engagement',
    event_label: featureName,
    feature_name: featureName,
    user_tier: userTier,
    usage_success: success,
    ...details,
  });
};

// Upgrade prompt tracking
export const trackUpgradePrompt = (
  promptLocation: string,
  feature: string,
  action: 'shown' | 'clicked' | 'dismissed',
  userTier: 'free' | 'pro' = 'free'
) => {
  trackEvent('upgrade_prompt', {
    event_category: 'conversion',
    event_label: action,
    prompt_location: promptLocation,
    blocked_feature: feature,
    user_tier: userTier,
    prompt_action: action,
  });
};