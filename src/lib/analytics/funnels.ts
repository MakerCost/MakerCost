// Advanced Funnel Tracking for GA4
import { trackGA4Event } from './ga4';
import { 
  trackPricingPageView, 
  trackPlanSelected, 
  trackPaymentStarted, 
  trackSubscriptionPurchase,
  trackOnboardingStep,
  trackOnboardingCompleted
} from './events';

// Funnel step definitions
export type FunnelStep = {
  name: string;
  stepNumber: number;
  category: string;
  timestamp: number;
  data?: Record<string, any>;
};

// Funnel session storage
class FunnelTracker {
  private sessionKey = 'makercost_funnel_session';
  
  private getFunnelSession(): FunnelStep[] {
    if (typeof window === 'undefined') return [];
    const session = sessionStorage.getItem(this.sessionKey);
    return session ? JSON.parse(session) : [];
  }
  
  private setFunnelSession(steps: FunnelStep[]): void {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem(this.sessionKey, JSON.stringify(steps));
  }
  
  private addStep(step: FunnelStep): void {
    const steps = this.getFunnelSession();
    steps.push(step);
    this.setFunnelSession(steps);
  }
  
  public trackStep(stepName: string, category: string, data?: Record<string, any>): void {
    const steps = this.getFunnelSession();
    const stepNumber = steps.length + 1;
    
    const step: FunnelStep = {
      name: stepName,
      stepNumber,
      category,
      timestamp: Date.now(),
      data
    };
    
    this.addStep(step);
    
    // Send to GA4
    trackGA4Event('funnel_step', {
      funnel_name: category,
      step_name: stepName,
      step_number: stepNumber,
      session_id: this.getSessionId(),
      ...data
    });
  }
  
  public completeStep(stepName: string, data?: Record<string, any>): void {
    trackGA4Event('funnel_step_completed', {
      step_name: stepName,
      session_id: this.getSessionId(),
      ...data
    });
  }
  
  public abandonFunnel(reason?: string): void {
    const steps = this.getFunnelSession();
    if (steps.length === 0) return;
    
    const lastStep = steps[steps.length - 1];
    trackGA4Event('funnel_abandoned', {
      funnel_name: lastStep.category,
      last_step: lastStep.name,
      steps_completed: steps.length,
      abandonment_reason: reason,
      session_id: this.getSessionId()
    });
    
    this.clearSession();
  }
  
  public completeFunnel(funnelName: string, data?: Record<string, any>): void {
    const steps = this.getFunnelSession();
    const totalTime = steps.length > 0 ? Date.now() - steps[0].timestamp : 0;
    
    trackGA4Event('funnel_completed', {
      funnel_name: funnelName,
      steps_completed: steps.length,
      completion_time_ms: totalTime,
      session_id: this.getSessionId(),
      ...data
    });
    
    this.clearSession();
  }
  
  private getSessionId(): string {
    if (typeof window === 'undefined') return 'server';
    let sessionId = sessionStorage.getItem('makercost_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('makercost_session_id', sessionId);
    }
    return sessionId;
  }
  
  public clearSession(): void {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(this.sessionKey);
  }
  
  public getFunnelData(): FunnelStep[] {
    return this.getFunnelSession();
  }
}

// Global funnel tracker instance
const funnelTracker = new FunnelTracker();

// Subscription Funnel Tracking
export const subscriptionFunnel = {
  // Step 1: User views pricing page
  viewPricing: (source?: string, userTier: 'free' | 'pro' | 'anonymous' = 'anonymous') => {
    funnelTracker.trackStep('pricing_page_view', 'subscription_funnel', {
      source,
      user_tier: userTier
    });
    trackPricingPageView({ source, user_tier: userTier });
  },
  
  // Step 2: User selects a plan
  selectPlan: (planData: {
    plan_id: string;
    plan_name: string;
    billing_cycle: 'monthly' | 'yearly';
    price: number;
    currency: string;
  }) => {
    funnelTracker.trackStep('plan_selected', 'subscription_funnel', planData);
    trackPlanSelected(planData);
  },
  
  // Step 3: User starts payment process
  startPayment: (paymentData: {
    plan_id: string;
    payment_method: string;
    value: number;
    currency: string;
  }) => {
    funnelTracker.trackStep('payment_started', 'subscription_funnel', paymentData);
    trackPaymentStarted(paymentData);
  },
  
  // Step 4: Payment completed successfully
  completePayment: (subscriptionData: {
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
    funnelTracker.completeStep('payment_completed', subscriptionData);
    trackSubscriptionPurchase(subscriptionData);
    funnelTracker.completeFunnel('subscription_funnel', {
      subscription_tier: subscriptionData.tier,
      billing_cycle: subscriptionData.billing_cycle,
      value: subscriptionData.value
    });
  },
  
  // Funnel abandonment
  abandon: (reason?: string) => {
    funnelTracker.abandonFunnel(reason);
  }
};

// User Onboarding Funnel
export const onboardingFunnel = {
  start: (userId: string) => {
    funnelTracker.trackStep('onboarding_start', 'user_onboarding', { user_id: userId });
  },
  
  step: (stepName: string, stepNumber: number, completed: boolean, timeSpent?: number) => {
    funnelTracker.trackStep(`onboarding_${stepName}`, 'user_onboarding', {
      step_number: stepNumber,
      completed,
      time_spent_ms: timeSpent
    });
    trackOnboardingStep({ step_name: stepName, step_number: stepNumber, completed, time_spent: timeSpent });
  },
  
  complete: (userId: string, totalSteps: number, completionTimeMinutes: number) => {
    funnelTracker.completeFunnel('user_onboarding', {
      user_id: userId,
      total_steps: totalSteps,
      completion_time_minutes: completionTimeMinutes
    });
    trackOnboardingCompleted({ total_steps: totalSteps, completion_time_minutes: completionTimeMinutes, user_id: userId });
  },
  
  abandon: (reason?: string) => {
    funnelTracker.abandonFunnel(reason);
  }
};

// Feature Discovery Funnel
export const featureDiscoveryFunnel = {
  // User discovers a premium feature
  discoverFeature: (featureName: string, location: string, userTier: 'free' | 'pro') => {
    funnelTracker.trackStep('feature_discovered', 'feature_discovery', {
      feature_name: featureName,
      discovery_location: location,
      user_tier: userTier
    });
  },
  
  // User attempts to use the feature
  attemptUse: (featureName: string, userTier: 'free' | 'pro', blocked: boolean) => {
    funnelTracker.trackStep('feature_attempt', 'feature_discovery', {
      feature_name: featureName,
      user_tier: userTier,
      blocked
    });
  },
  
  // Upgrade prompt is shown
  showUpgradePrompt: (featureName: string, location: string, userTier: 'free' | 'pro') => {
    funnelTracker.trackStep('upgrade_prompt_shown', 'feature_discovery', {
      feature_name: featureName,
      prompt_location: location,
      user_tier: userTier
    });
  },
  
  // User clicks upgrade prompt
  clickUpgradePrompt: (featureName: string, location: string) => {
    funnelTracker.trackStep('upgrade_prompt_clicked', 'feature_discovery', {
      feature_name: featureName,
      prompt_location: location
    });
  },
  
  // User completes upgrade (conversion)
  completeUpgrade: (featureName: string, subscriptionData: any) => {
    funnelTracker.completeFunnel('feature_discovery', {
      source_feature: featureName,
      ...subscriptionData
    });
  }
};

// Quote Generation Funnel
export const quoteGenerationFunnel = {
  startProject: (projectData: { project_id: string; user_tier: 'free' | 'pro' }) => {
    funnelTracker.trackStep('project_started', 'quote_generation', projectData);
  },
  
  addMaterials: (materialCount: number, userTier: 'free' | 'pro') => {
    funnelTracker.trackStep('materials_added', 'quote_generation', {
      material_count: materialCount,
      user_tier: userTier
    });
  },
  
  addMachines: (machineCount: number, userTier: 'free' | 'pro') => {
    funnelTracker.trackStep('machines_added', 'quote_generation', {
      machine_count: machineCount,
      user_tier: userTier
    });
  },
  
  calculatePricing: (pricingData: {
    total_cost: number;
    material_cost: number;
    labor_cost: number;
    overhead_cost: number;
    profit_margin: number;
  }) => {
    funnelTracker.trackStep('pricing_calculated', 'quote_generation', pricingData);
  },
  
  generateQuote: (quoteData: {
    quote_id: string;
    total_value: number;
    currency: string;
    product_count: number;
  }) => {
    funnelTracker.trackStep('quote_generated', 'quote_generation', quoteData);
  },
  
  finalizeQuote: (finalData: {
    quote_id: string;
    total_value: number;
    export_format?: string;
  }) => {
    funnelTracker.completeFunnel('quote_generation', finalData);
  }
};

// Advanced funnel analytics
export const funnelAnalytics = {
  // Get current funnel progress
  getCurrentFunnel: () => {
    return funnelTracker.getFunnelData();
  },
  
  // Calculate funnel conversion rate
  calculateConversionRate: (startStep: string, endStep: string): number => {
    const steps = funnelTracker.getFunnelData();
    const startIndex = steps.findIndex(step => step.name === startStep);
    const endIndex = steps.findIndex(step => step.name === endStep);
    
    if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
      return 0;
    }
    
    return ((endIndex + 1) / (startIndex + 1)) * 100;
  },
  
  // Get time spent in funnel
  getTimeInFunnel: (): number => {
    const steps = funnelTracker.getFunnelData();
    if (steps.length === 0) return 0;
    
    const firstStep = steps[0];
    const lastStep = steps[steps.length - 1];
    return lastStep.timestamp - firstStep.timestamp;
  },
  
  // Clear all funnel data
  clearAllFunnels: () => {
    funnelTracker.clearSession();
  }
};

export default funnelTracker;