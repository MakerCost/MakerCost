import posthog from 'posthog-js';

// PostHog event tracking utilities
export const trackPostHogEvent = (eventName: string, properties?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && posthog) {
    try {
      posthog.capture(eventName, {
        app_section: 'makercost',
        timestamp: new Date().toISOString(),
        ...properties,
      });
    } catch (error) {
      console.warn('PostHog event tracking failed:', error);
    }
  }
};

// Business-specific PostHog event tracking
export const trackQuoteCreation = (data: {
  productCount: number;
  totalValue: number;
  currency: string;
  hasCustomMaterials: boolean;
}) => {
  trackPostHogEvent('quote_created', {
    product_count: data.productCount,
    total_value: data.totalValue,
    currency: data.currency,
    has_custom_materials: data.hasCustomMaterials,
    user_journey_stage: 'quote_generation',
  });
};

export const trackMaterialInteraction = (action: string, data: {
  materialType?: string;
  materialCategory?: string;
  cost?: number;
}) => {
  trackPostHogEvent('material_interaction', {
    action, // 'add', 'edit', 'delete', 'view'
    material_type: data.materialType,
    material_category: data.materialCategory,
    material_cost: data.cost,
    interaction_context: 'material_management',
  });
};

export const trackPricingCalculation = (data: {
  materialCount: number;
  totalMaterialCost: number;
  laborCost: number;
  overheadCost: number;
  profitMargin: number;
  finalPrice: number;
}) => {
  trackPostHogEvent('pricing_calculated', {
    ...data,
    calculation_complexity: data.materialCount > 5 ? 'complex' : 'simple',
    user_journey_stage: 'pricing_optimization',
  });
};

export const trackFeatureInteraction = (featureName: string, data?: {
  context?: string;
  value?: number;
  success?: boolean;
}) => {
  trackPostHogEvent('feature_interaction', {
    feature_name: featureName,
    interaction_context: data?.context || 'general',
    interaction_value: data?.value,
    interaction_success: data?.success ?? true,
    user_engagement_type: 'feature_usage',
  });
};

export const trackUserFlow = (flowStep: string, data?: {
  flowName?: string;
  stepNumber?: number;
  completed?: boolean;
  timeSpent?: number;
}) => {
  trackPostHogEvent('user_flow_step', {
    flow_step: flowStep,
    flow_name: data?.flowName || 'default',
    step_number: data?.stepNumber,
    step_completed: data?.completed ?? true,
    time_spent_seconds: data?.timeSpent,
    user_journey_tracking: true,
  });
};

export const trackBusinessMetric = (metricName: string, value: number, data?: {
  currency?: string;
  category?: string;
  context?: string;
}) => {
  trackPostHogEvent('business_metric', {
    metric_name: metricName,
    metric_value: value,
    metric_currency: data?.currency,
    metric_category: data?.category || 'general',
    metric_context: data?.context,
    business_intelligence: true,
  });
};

export const trackAuthenticationEvent = (action: 'login' | 'signup' | 'logout' | 'profile_update') => {
  trackPostHogEvent('authentication_event', {
    auth_action: action,
    user_lifecycle: 'authentication',
  });
};

// User identification for PostHog
export const identifyUser = (userId: string, properties?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && posthog) {
    try {
      posthog.identify(userId, {
        user_type: 'registered',
        platform: 'web',
        app_name: 'MakerCost',
        ...properties,
      });
    } catch (error) {
      console.warn('PostHog user identification failed:', error);
    }
  }
};

// Reset user identity (for logout)
export const resetUser = () => {
  if (typeof window !== 'undefined' && posthog) {
    try {
      posthog.reset();
    } catch (error) {
      console.warn('PostHog user reset failed:', error);
    }
  }
};

// Subscription-specific PostHog tracking
export const trackSubscriptionPurchasePostHog = (data: {
  subscriptionId: string;
  planId: string;
  planName: string;
  amount: number;
  currency: string;
  provider: string;
  userId: string;
}) => {
  trackPostHogEvent('subscription_purchased', {
    subscription_id: data.subscriptionId,
    plan_id: data.planId,
    plan_name: data.planName,
    amount: data.amount,
    currency: data.currency,
    provider: data.provider,
    subscription_tier: data.planId.includes('pro') ? 'pro' : 'free',
    billing_cycle: data.planId.includes('yearly') ? 'yearly' : 'monthly',
    revenue_event: true,
    user_journey_stage: 'conversion',
  });

  // Update user properties with subscription info
  identifyUser(data.userId, {
    subscription_tier: data.planId.includes('pro') ? 'pro' : 'free',
    subscription_plan: data.planId,
    subscription_status: 'active',
    payment_provider: data.provider,
    subscription_start_date: new Date().toISOString(),
    lifetime_value: data.amount,
    is_paying_customer: true,
  });
};

export const trackSubscriptionCancellationPostHog = (data: {
  subscriptionId: string;
  planId: string;
  provider: string;
  userId: string;
  reason?: string;
  immediately?: boolean;
}) => {
  trackPostHogEvent('subscription_cancelled', {
    subscription_id: data.subscriptionId,
    plan_id: data.planId,
    provider: data.provider,
    cancellation_reason: data.reason,
    immediate_cancellation: data.immediately,
    subscription_tier: data.planId.includes('pro') ? 'pro' : 'free',
    user_journey_stage: 'churn',
  });

  // Update user properties
  identifyUser(data.userId, {
    subscription_status: 'cancelled',
    cancellation_date: new Date().toISOString(),
    cancellation_reason: data.reason,
  });
};

export const trackFeatureBlockedPostHog = (data: {
  feature: string;
  blockReason: string;
  userTier: 'free' | 'pro';
  upgradePromptShown: boolean;
}) => {
  trackPostHogEvent('feature_blocked', {
    blocked_feature: data.feature,
    block_reason: data.blockReason,
    user_tier: data.userTier,
    upgrade_prompt_shown: data.upgradePromptShown,
    conversion_opportunity: data.userTier === 'free',
    user_journey_stage: 'feature_discovery',
  });
};

export const trackUpgradeConversionPostHog = (data: {
  sourceFeature: string;
  promptLocation: string;
  userId: string;
  timeToConversion?: number; // milliseconds
}) => {
  trackPostHogEvent('upgrade_conversion', {
    source_feature: data.sourceFeature,
    prompt_location: data.promptLocation,
    time_to_conversion_ms: data.timeToConversion,
    conversion_source: 'feature_gate',
    user_journey_stage: 'conversion',
  });
};

export const trackUsageLimitReachedPostHog = (data: {
  limitType: 'projects' | 'materials';
  currentUsage: number;
  limit: number;
  userTier: 'free' | 'pro';
}) => {
  trackPostHogEvent('usage_limit_reached', {
    limit_type: data.limitType,
    current_usage: data.currentUsage,
    usage_limit: data.limit,
    user_tier: data.userTier,
    limit_percentage: (data.currentUsage / data.limit) * 100,
    conversion_opportunity: data.userTier === 'free',
    user_journey_stage: 'limit_discovery',
  });
};

// Revenue and business metrics
export const trackRevenueEventPostHog = (data: {
  amount: number;
  currency: string;
  revenueType: 'subscription' | 'upgrade' | 'renewal';
  planId: string;
  userId: string;
}) => {
  trackPostHogEvent('revenue_event', {
    revenue_amount: data.amount,
    revenue_currency: data.currency,
    revenue_type: data.revenueType,
    plan_id: data.planId,
    subscription_tier: data.planId.includes('pro') ? 'pro' : 'free',
    business_metric: true,
  });
};

// Cohort and retention tracking
export const trackUserRetentionEventPostHog = (data: {
  userId: string;
  daysActive: number;
  lastActiveDate: string;
  userTier: 'free' | 'pro';
  engagementScore?: number;
}) => {
  trackPostHogEvent('user_retention_milestone', {
    days_active: data.daysActive,
    last_active_date: data.lastActiveDate,
    user_tier: data.userTier,
    engagement_score: data.engagementScore,
    retention_milestone: data.daysActive,
    user_lifecycle: 'retention',
  });

  // Update user properties with retention data
  identifyUser(data.userId, {
    days_active: data.daysActive,
    last_active_date: data.lastActiveDate,
    engagement_score: data.engagementScore,
    user_segment: data.daysActive > 30 ? 'highly_engaged' : data.daysActive > 7 ? 'engaged' : 'new',
  });
};