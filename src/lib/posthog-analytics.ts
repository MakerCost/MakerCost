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