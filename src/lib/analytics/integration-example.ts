// Integration Example: How to use the new GA4 analytics system
// This file demonstrates how to integrate GA4 tracking into existing components

import { 
  trackSignUp, 
  trackLogin, 
  trackProjectCreated, 
  trackQuoteGenerated,
  trackSubscriptionPurchase,
  trackFeatureUsed,
  trackFeatureBlocked
} from './events';
import { subscriptionFunnel, onboardingFunnel, featureDiscoveryFunnel } from './funnels';

// Example 1: User Authentication Integration
export const integrateAuthTracking = {
  // In signup form
  onSignUp: (userId: string, method: 'email' | 'google' | 'github') => {
    trackSignUp(method, userId);
    onboardingFunnel.start(userId);
  },

  // In login form
  onLogin: (userId: string, method: 'email' | 'google' | 'github') => {
    trackLogin(method, userId);
  },

  // In onboarding flow
  onOnboardingStep: (stepName: string, stepNumber: number, completed: boolean) => {
    onboardingFunnel.step(stepName, stepNumber, completed);
  }
};

// Example 2: Project and Quote Tracking
export const integrateProjectTracking = {
  // When user creates a new project
  onProjectCreate: (projectId: string, userTier: 'free' | 'pro') => {
    trackProjectCreated({
      project_id: projectId,
      user_tier: userTier,
      has_materials: false,
      has_machines: false
    });
  },

  // When user generates a quote
  onQuoteGenerate: (quoteData: {
    quote_id: string;
    project_id: string;
    product_count: number;
    total_value: number;
    currency: string;
    user_tier: 'free' | 'pro';
  }) => {
    trackQuoteGenerated(quoteData);
  }
};

// Example 3: Subscription Funnel Integration
export const integrateSubscriptionTracking = {
  // When user visits pricing page
  onPricingPageView: (source?: string, userTier: 'free' | 'pro' | 'anonymous' = 'anonymous') => {
    subscriptionFunnel.viewPricing(source, userTier);
  },

  // When user selects a plan
  onPlanSelect: (planData: {
    plan_id: string;
    plan_name: string;
    billing_cycle: 'monthly' | 'yearly';
    price: number;
    currency: string;
  }) => {
    subscriptionFunnel.selectPlan(planData);
  },

  // When payment is successful
  onPaymentSuccess: (subscriptionData: {
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
    subscriptionFunnel.completePayment(subscriptionData);
    trackSubscriptionPurchase(subscriptionData);
  }
};

// Example 4: Feature Usage and Blocking
export const integrateFeatureTracking = {
  // When user uses a feature successfully
  onFeatureUse: (featureName: string, userTier: 'free' | 'pro', context?: string) => {
    trackFeatureUsed({
      feature_name: featureName,
      feature_category: 'pricing', // Adjust based on feature
      user_tier: userTier,
      success: true,
      context
    });
  },

  // When user hits a feature limit
  onFeatureBlock: (featureName: string, userTier: 'free' | 'pro', reason: string) => {
    trackFeatureBlocked({
      feature_name: featureName,
      block_reason: reason as 'usage_limit' | 'tier_limit' | 'trial_expired',
      user_tier: userTier,
      upgrade_prompt_shown: true
    });

    // Start feature discovery funnel
    featureDiscoveryFunnel.discoverFeature(featureName, 'feature_gate', userTier);
    featureDiscoveryFunnel.attemptUse(featureName, userTier, true);
    featureDiscoveryFunnel.showUpgradePrompt(featureName, 'feature_gate', userTier);
  },

  // When user clicks upgrade prompt
  onUpgradeClick: (featureName: string, location: string) => {
    featureDiscoveryFunnel.clickUpgradePrompt(featureName, location);
  }
};

// Example 5: How to integrate into React components
export const ReactIntegrationExamples = {
  // In a signup component
  SignupComponent: `
    import { integrateAuthTracking } from '@/lib/analytics/integration-example';
    
    const handleSignup = async (email: string, password: string) => {
      try {
        const user = await signup(email, password);
        integrateAuthTracking.onSignUp(user.id, 'email');
        // ... rest of signup logic
      } catch (error) {
        // Handle error
      }
    };
  `,

  // In a project creation component
  ProjectComponent: `
    import { integrateProjectTracking } from '@/lib/analytics/integration-example';
    import { useUserTier } from '@/hooks/useUserTier';
    
    const { userTier } = useUserTier();
    
    const handleCreateProject = async (projectName: string) => {
      const project = await createProject(projectName);
      integrateProjectTracking.onProjectCreate(project.id, userTier);
      // ... rest of project creation
    };
  `,

  // In a feature gate component
  FeatureGateComponent: `
    import { integrateFeatureTracking } from '@/lib/analytics/integration-example';
    
    const FeatureGate = ({ feature, userTier, children }) => {
      const hasAccess = checkFeatureAccess(feature, userTier);
      
      if (!hasAccess) {
        integrateFeatureTracking.onFeatureBlock(
          feature, 
          userTier, 
          userTier === 'free' ? 'tier_limit' : 'usage_limit'
        );
        
        return <UpgradePrompt feature={feature} />;
      }
      
      // Track successful feature use
      integrateFeatureTracking.onFeatureUse(feature, userTier);
      return children;
    };
  `
};

// Example 6: Admin Dashboard Data Integration
export const adminDashboardIntegration = {
  // How to fetch GA4 data for the dashboard
  fetchAnalyticsData: async (startDate: string, endDate: string) => {
    // This would use the GA4Analytics class from reporting-api.ts
    try {
      // Example API integration
      const response = await fetch('/api/analytics/dashboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startDate, endDate })
      });
      
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
      throw error;
    }
  }
};

export default {
  integrateAuthTracking,
  integrateProjectTracking,
  integrateSubscriptionTracking,
  integrateFeatureTracking,
  ReactIntegrationExamples,
  adminDashboardIntegration
};