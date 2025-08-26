// PostHog Product Analytics - Focused on user behavior, UX, and product insights
// Separate from GA4 business analytics (revenue, conversions, marketing)

import posthog from 'posthog-js';

// Product Analytics Event Types
export interface ProductEvent {
  calculator_interaction: {
    interaction_type: 'material_add' | 'material_edit' | 'material_remove' | 'parameter_change' | 'calculation_trigger';
    form_section?: string;
    field_name?: string;
    field_value?: string | number;
    time_spent_ms?: number;
    validation_error?: string;
  };
  
  ui_interaction: {
    element_type: 'button' | 'input' | 'select' | 'modal' | 'tab' | 'accordion';
    element_id?: string;
    element_text?: string;
    interaction_type: 'click' | 'focus' | 'blur' | 'change' | 'submit' | 'cancel';
    page_section?: string;
  };

  form_behavior: {
    form_name: string;
    action: 'start' | 'field_focus' | 'field_complete' | 'validation_error' | 'abandon' | 'submit';
    field_name?: string;
    error_message?: string;
    completion_time_ms?: number;
    fields_completed?: number;
    total_fields?: number;
  };

  navigation_pattern: {
    from_page: string;
    to_page: string;
    navigation_type: 'link_click' | 'back_button' | 'breadcrumb' | 'menu' | 'direct_url';
    time_on_page_ms: number;
    scroll_depth_percent: number;
  };

  feature_discovery: {
    feature_name: string;
    discovery_method: 'tooltip_shown' | 'help_clicked' | 'demo_triggered' | 'onboarding_step';
    user_engagement: 'viewed' | 'interacted' | 'completed' | 'dismissed';
    time_to_discover_ms?: number;
  };

  error_experience: {
    error_type: 'validation' | 'network' | 'calculation' | 'ui_bug';
    error_message: string;
    user_action: 'retry' | 'ignore' | 'contact_support' | 'abandon';
    page_location: string;
    recovery_time_ms?: number;
  };
}

// Helper function to safely capture PostHog events
const captureProductEvent = (eventName: string, properties: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && posthog) {
    try {
      posthog.capture(eventName, {
        ...properties,
        event_type: 'product_analytics',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.warn('PostHog product analytics tracking failed:', error);
    }
  }
};

// Typed product analytics functions
export const trackCalculatorInteraction = (data: ProductEvent['calculator_interaction']) => {
  captureProductEvent('calculator_interaction', {
    ...data,
    category: 'product_usage',
    context: 'pricing_calculator',
  });
};

export const trackUIInteraction = (data: ProductEvent['ui_interaction']) => {
  captureProductEvent('ui_interaction', {
    ...data,
    category: 'user_experience',
    context: 'interface_usage',
  });
};

export const trackFormBehavior = (data: ProductEvent['form_behavior']) => {
  captureProductEvent('form_behavior', {
    ...data,
    category: 'user_experience',
    context: 'form_interaction',
  });
};

export const trackNavigationPattern = (data: ProductEvent['navigation_pattern']) => {
  captureProductEvent('navigation_pattern', {
    ...data,
    category: 'user_journey',
    context: 'site_navigation',
  });
};

export const trackFeatureDiscovery = (data: ProductEvent['feature_discovery']) => {
  captureProductEvent('feature_discovery', {
    ...data,
    category: 'product_adoption',
    context: 'feature_learning',
  });
};

export const trackErrorExperience = (data: ProductEvent['error_experience']) => {
  captureProductEvent('error_experience', {
    ...data,
    category: 'user_experience',
    context: 'error_handling',
    severity: data.error_type === 'ui_bug' ? 'high' : 'medium',
  });
};

// Specialized tracking for calculator workflow
export const trackCalculatorWorkflow = {
  startSession: (project_type?: string) => {
    captureProductEvent('calculator_session_start', {
      project_type,
      session_timestamp: Date.now(),
      category: 'product_usage',
    });
  },

  addMaterial: (material_data: { name: string; category: string; cost_type: string }) => {
    trackCalculatorInteraction({
      interaction_type: 'material_add',
      form_section: 'materials',
      ...material_data,
    });
  },

  updateParameter: (parameter: string, old_value: unknown, new_value: unknown) => {
    trackCalculatorInteraction({
      interaction_type: 'parameter_change',
      field_name: parameter,
      field_value: String(new_value),
      form_section: 'cost_parameters',
    });
  },

  triggerCalculation: (trigger_reason: 'auto' | 'manual', calculation_time_ms: number) => {
    trackCalculatorInteraction({
      interaction_type: 'calculation_trigger',
      time_spent_ms: calculation_time_ms,
    });
  },

  completeQuote: (quote_data: { product_count: number; complexity: 'simple' | 'complex' }) => {
    captureProductEvent('calculator_quote_complete', {
      ...quote_data,
      category: 'product_completion',
      workflow_stage: 'quote_generation',
    });
  },
};

// User experience tracking
export const trackUserExperience = {
  pageLoad: (page: string, load_time_ms: number) => {
    captureProductEvent('page_performance', {
      page,
      load_time_ms,
      performance_category: load_time_ms > 3000 ? 'slow' : load_time_ms > 1000 ? 'average' : 'fast',
      category: 'user_experience',
    });
  },

  scrollDepth: (page: string, max_scroll_percent: number, time_on_page_ms: number) => {
    captureProductEvent('scroll_engagement', {
      page,
      max_scroll_percent,
      time_on_page_ms,
      engagement_level: max_scroll_percent > 75 ? 'high' : max_scroll_percent > 25 ? 'medium' : 'low',
      category: 'user_engagement',
    });
  },

  tooltipInteraction: (tooltip_id: string, action: 'show' | 'dismiss' | 'click_learn_more') => {
    trackFeatureDiscovery({
      feature_name: tooltip_id,
      discovery_method: 'tooltip_shown',
      user_engagement: action === 'show' ? 'viewed' : action === 'dismiss' ? 'dismissed' : 'interacted',
    });
  },

  helpInteraction: (help_type: 'documentation' | 'demo_data' | 'tutorial', result: 'helpful' | 'not_helpful') => {
    captureProductEvent('help_usage', {
      help_type,
      result,
      category: 'user_support',
      context: 'self_service',
    });
  },
};

// A/B Test and Feature Flag helpers
export const trackExperimentExposure = (experiment_name: string, variant: string) => {
  captureProductEvent('experiment_exposure', {
    experiment_name,
    variant,
    category: 'experimentation',
  });
};

export const trackFeatureFlagExposure = (flag_name: string, flag_value: boolean, user_segment?: string) => {
  captureProductEvent('feature_flag_exposure', {
    flag_name,
    flag_value,
    user_segment,
    category: 'product_features',
  });
};

// User feedback and satisfaction
export const trackUserSentiment = (
  page: string, 
  sentiment: 'positive' | 'neutral' | 'negative',
  feedback_method: 'survey' | 'rating' | 'comment',
  details?: string
) => {
  captureProductEvent('user_sentiment', {
    page,
    sentiment,
    feedback_method,
    details,
    category: 'user_satisfaction',
  });
};

// Export all tracking functions
export const posthogProductAnalytics = {
  calculator: trackCalculatorWorkflow,
  ux: trackUserExperience,
  ui: trackUIInteraction,
  forms: trackFormBehavior,
  navigation: trackNavigationPattern,
  features: trackFeatureDiscovery,
  errors: trackErrorExperience,
  experiments: trackExperimentExposure,
  flags: trackFeatureFlagExposure,
  sentiment: trackUserSentiment,
};