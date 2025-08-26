// Comprehensive GA4 Event Tracking System
import { trackGA4Event, identifyUser } from './ga4';

// User Authentication Events
export const trackSignUp = (method: 'email' | 'google' | 'github' = 'email', userId?: string) => {
  trackGA4Event('sign_up', {
    method,
    event_category: 'authentication',
    user_id: userId
  });

  if (userId) {
    identifyUser(userId, {
      user_tier: 'free',
      signup_method: method,
      signup_date: new Date().toISOString()
    });
  }
};

export const trackLogin = (method: 'email' | 'google' | 'github' = 'email', userId?: string) => {
  trackGA4Event('login', {
    method,
    event_category: 'authentication',
    user_id: userId
  });

  if (userId) {
    identifyUser(userId);
  }
};

export const trackLogout = () => {
  trackGA4Event('logout', {
    event_category: 'authentication'
  });
};

// Enhanced E-commerce Events
export const trackPurchase = (transactionData: {
  transaction_id: string;
  value: number;
  currency: string;
  items: Array<{
    item_id: string;
    item_name: string;
    item_category: string;
    price: number;
    quantity: number;
  }>;
  payment_type?: string;
  coupon?: string;
}) => {
  trackGA4Event('purchase', {
    ...transactionData,
    event_category: 'ecommerce'
  });
};

export const trackSubscriptionPurchase = (subscriptionData: {
  transaction_id: string;
  subscription_id: string;
  plan_id: string;
  plan_name: string;
  value: number;
  currency: string;
  billing_cycle: 'monthly' | 'yearly';
  tier: 'free' | 'pro';
  payment_provider: string;
  user_id: string;
}) => {
  // Enhanced E-commerce purchase event
  trackPurchase({
    transaction_id: subscriptionData.transaction_id,
    value: subscriptionData.value,
    currency: subscriptionData.currency,
    items: [{
      item_id: subscriptionData.plan_id,
      item_name: subscriptionData.plan_name,
      item_category: 'subscription',
      price: subscriptionData.value,
      quantity: 1
    }],
    payment_type: subscriptionData.payment_provider
  });

  // Update user properties
  identifyUser(subscriptionData.user_id, {
    user_tier: subscriptionData.tier,
    subscription_plan: subscriptionData.plan_id,
    subscription_status: 'active',
    billing_cycle: subscriptionData.billing_cycle,
    payment_provider: subscriptionData.payment_provider,
    lifetime_value: subscriptionData.value
  });
};

export const trackAddToCart = (item: {
  currency: string;
  value: number;
  items: Array<{
    item_id: string;
    item_name: string;
    item_category: string;
    price: number;
    quantity: number;
  }>;
}) => {
  trackGA4Event('add_to_cart', {
    ...item,
    event_category: 'ecommerce'
  });
};

export const trackBeginCheckout = (checkoutData: {
  currency: string;
  value: number;
  items: Array<{
    item_id: string;
    item_name: string;
    item_category: string;
    price: number;
    quantity: number;
  }>;
}) => {
  trackGA4Event('begin_checkout', {
    ...checkoutData,
    event_category: 'ecommerce'
  });
};

export const trackAddPaymentInfo = (paymentData: {
  currency: string;
  value: number;
  payment_type: string;
}) => {
  trackGA4Event('add_payment_info', {
    ...paymentData,
    event_category: 'ecommerce'
  });
};

// Business-Specific Events
export const trackProjectCreated = (projectData: {
  project_id: string;
  project_name?: string;
  user_tier: 'free' | 'pro';
  has_materials?: boolean;
  has_machines?: boolean;
}) => {
  trackGA4Event('project_created', {
    ...projectData,
    event_category: 'business_action'
  });
};

export const trackQuoteGenerated = (quoteData: {
  quote_id: string;
  project_id: string;
  product_count: number;
  total_value: number;
  currency: string;
  user_tier: 'free' | 'pro';
  materials_count?: number;
  machines_count?: number;
}) => {
  trackGA4Event('quote_generated', {
    ...quoteData,
    value: quoteData.total_value,
    event_category: 'business_action'
  });
};

export const trackQuoteFinalized = (finalizeData: {
  quote_id: string;
  project_id: string;
  total_value: number;
  currency: string;
  export_format?: string;
  user_tier: 'free' | 'pro';
}) => {
  trackGA4Event('quote_finalized', {
    ...finalizeData,
    value: finalizeData.total_value,
    event_category: 'conversion'
  });
};

export const trackQuoteExported = (exportData: {
  quote_id: string;
  format: 'pdf' | 'csv' | 'excel';
  user_tier: 'free' | 'pro';
}) => {
  trackGA4Event('quote_exported', {
    ...exportData,
    event_category: 'engagement'
  });
};

// Material Management Events
export const trackMaterialAdded = (materialData: {
  material_type: string;
  material_category: string;
  cost_type: 'per-unit' | 'total-cost';
  user_tier: 'free' | 'pro';
  project_context?: boolean;
}) => {
  trackGA4Event('material_added', {
    ...materialData,
    event_category: 'content_management'
  });
};

export const trackMaterialUpdated = (materialData: {
  material_id: string;
  material_type: string;
  change_type: 'cost' | 'quantity' | 'properties';
  user_tier: 'free' | 'pro';
}) => {
  trackGA4Event('material_updated', {
    ...materialData,
    event_category: 'content_management'
  });
};

export const trackMaterialDeleted = (materialData: {
  material_id: string;
  material_type: string;
  user_tier: 'free' | 'pro';
}) => {
  trackGA4Event('material_deleted', {
    ...materialData,
    event_category: 'content_management'
  });
};

// Machine Management Events
export const trackMachineAdded = (machineData: {
  machine_name: string;
  machine_type?: string;
  purchase_price: number;
  depreciation_percentage: number;
  hours_per_year: number;
  user_tier: 'free' | 'pro';
  source: 'manual' | 'imported';
}) => {
  trackGA4Event('machine_added', {
    ...machineData,
    event_category: 'content_management'
  });
};

export const trackMachineImported = (importData: {
  machine_name: string;
  usage_hours: number;
  user_tier: 'free' | 'pro';
}) => {
  trackGA4Event('machine_imported', {
    ...importData,
    event_category: 'content_management'
  });
};

// Feature Usage Events
export const trackFeatureUsed = (featureData: {
  feature_name: string;
  feature_category: 'pricing' | 'materials' | 'machines' | 'quotes' | 'export';
  user_tier: 'free' | 'pro';
  success: boolean;
  context?: string;
}) => {
  trackGA4Event('feature_used', {
    ...featureData,
    event_category: 'feature_usage'
  });
};

export const trackFeatureBlocked = (blockData: {
  feature_name: string;
  block_reason: 'tier_limit' | 'usage_limit' | 'trial_expired';
  user_tier: 'free' | 'pro';
  upgrade_prompt_shown: boolean;
}) => {
  trackGA4Event('feature_blocked', {
    ...blockData,
    event_category: 'monetization'
  });
};

// Subscription Funnel Events
export const trackPricingPageView = (viewData: {
  source?: string;
  user_tier: 'free' | 'pro' | 'anonymous';
}) => {
  trackGA4Event('pricing_page_view', {
    ...viewData,
    event_category: 'funnel'
  });
};

export const trackPlanSelected = (planData: {
  plan_id: string;
  plan_name: string;
  billing_cycle: 'monthly' | 'yearly';
  price: number;
  currency: string;
}) => {
  trackGA4Event('plan_selected', {
    ...planData,
    value: planData.price,
    event_category: 'funnel'
  });

  // Also track as add_to_cart for e-commerce funnel
  trackAddToCart({
    currency: planData.currency,
    value: planData.price,
    items: [{
      item_id: planData.plan_id,
      item_name: planData.plan_name,
      item_category: 'subscription',
      price: planData.price,
      quantity: 1
    }]
  });
};

export const trackPaymentStarted = (paymentData: {
  plan_id: string;
  payment_method: string;
  value: number;
  currency: string;
}) => {
  trackGA4Event('payment_started', {
    ...paymentData,
    event_category: 'funnel'
  });

  // Also track as begin_checkout
  trackBeginCheckout({
    currency: paymentData.currency,
    value: paymentData.value,
    items: [{
      item_id: paymentData.plan_id,
      item_name: 'Subscription Plan',
      item_category: 'subscription',
      price: paymentData.value,
      quantity: 1
    }]
  });
};

// Upgrade and Conversion Events
export const trackUpgradePromptShown = (promptData: {
  feature_context: string;
  prompt_location: string;
  user_tier: 'free' | 'pro';
}) => {
  trackGA4Event('upgrade_prompt_shown', {
    ...promptData,
    event_category: 'monetization'
  });
};

export const trackUpgradePromptClicked = (clickData: {
  feature_context: string;
  prompt_location: string;
  user_tier: 'free' | 'pro';
}) => {
  trackGA4Event('upgrade_prompt_clicked', {
    ...clickData,
    event_category: 'monetization'
  });
};

export const trackTrialStarted = (trialData: {
  trial_type: string;
  trial_duration_days: number;
  user_id: string;
}) => {
  trackGA4Event('trial_started', {
    ...trialData,
    event_category: 'conversion'
  });

  identifyUser(trialData.user_id, {
    trial_status: 'active',
    trial_start_date: new Date().toISOString()
  });
};

// Error and Performance Events
export const trackError = (errorData: {
  error_type: string;
  error_message: string;
  error_location: string;
  user_tier: 'free' | 'pro';
  fatal?: boolean;
}) => {
  trackGA4Event('app_exception', {
    ...errorData,
    fatal: errorData.fatal || false,
    event_category: 'error'
  });
};

export const trackPerformance = (performanceData: {
  metric_name: string;
  metric_value: number;
  page_location: string;
}) => {
  trackGA4Event('performance_metric', {
    ...performanceData,
    value: performanceData.metric_value,
    event_category: 'performance'
  });
};

// Engagement Events
export const trackDemoDataLoaded = (demoData: {
  demo_type: string;
  user_tier: 'free' | 'pro' | 'anonymous';
}) => {
  trackGA4Event('demo_data_loaded', {
    ...demoData,
    event_category: 'engagement'
  });
};

export const trackOnboardingStep = (stepData: {
  step_name: string;
  step_number: number;
  completed: boolean;
  time_spent?: number;
}) => {
  trackGA4Event('onboarding_step', {
    ...stepData,
    event_category: 'user_journey'
  });
};

export const trackOnboardingCompleted = (completionData: {
  total_steps: number;
  completion_time_minutes: number;
  user_id: string;
}) => {
  trackGA4Event('onboarding_completed', {
    ...completionData,
    event_category: 'user_journey'
  });

  identifyUser(completionData.user_id, {
    onboarding_completed: true,
    onboarding_completion_date: new Date().toISOString()
  });
};