import { Currency } from './pricing';

// Subscription tiers
export type SubscriptionTier = 'free' | 'pro';

// Subscription status
export type SubscriptionStatus = 
  | 'active' 
  | 'cancelled' 
  | 'past_due' 
  | 'trialing' 
  | 'unpaid' 
  | 'incomplete';

// Payment provider types
export type PaymentProvider = 'paypal' | 'stripe';

// Subscription plan interface
export interface SubscriptionPlan {
  id: string;
  name: string;
  tier: SubscriptionTier;
  price: number;
  currency: Currency;
  interval: 'month' | 'year';
  features: string[];
  paypalPlanId?: string; // PayPal-specific plan ID
  stripePriceId?: string; // Stripe-specific price ID (for future use)
}

// User subscription interface
export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  provider: PaymentProvider;
  providerSubscriptionId: string; // PayPal subscription ID or Stripe subscription ID
  currentPeriodStart: string;
  currentPeriodEnd: string;
  trialEnd?: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
}

// Payment method interface
export interface PaymentMethod {
  id: string;
  provider: PaymentProvider;
  type: 'paypal' | 'card';
  last4?: string; // For cards
  brand?: string; // For cards
  email?: string; // For PayPal
  isDefault: boolean;
}

// Payment event interface for analytics
export interface PaymentEvent {
  eventType: 'subscription_created' | 'subscription_updated' | 'subscription_cancelled' | 'payment_succeeded' | 'payment_failed';
  userId: string;
  subscriptionId: string;
  planId: string;
  amount: number;
  currency: Currency;
  provider: PaymentProvider;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

// Webhook event interface
export interface WebhookEvent {
  id: string;
  provider: PaymentProvider;
  eventType: string;
  data: Record<string, unknown>;
  timestamp: string;
  signature?: string;
}

// Abstract payment provider interface
export interface PaymentProviderInterface {
  // Subscription management
  createSubscription(userId: string, planId: string, paymentMethodId?: string): Promise<{
    subscriptionId: string;
    clientSecret?: string;
    approvalUrl?: string;
  }>;
  
  cancelSubscription(subscriptionId: string, immediately?: boolean): Promise<void>;
  
  updateSubscription(subscriptionId: string, newPlanId: string): Promise<void>;
  
  getSubscription(subscriptionId: string): Promise<UserSubscription | null>;
  
  // Payment methods
  attachPaymentMethod(userId: string, paymentMethodId: string): Promise<void>;
  
  getPaymentMethods(userId: string): Promise<PaymentMethod[]>;
  
  setDefaultPaymentMethod(userId: string, paymentMethodId: string): Promise<void>;
  
  // Webhooks
  verifyWebhookSignature(payload: string, signature: string): boolean;
  
  handleWebhookEvent(event: WebhookEvent): Promise<PaymentEvent | null>;
  
  // Plans
  getPlans(): Promise<SubscriptionPlan[]>;
  
  getPlan(planId: string): Promise<SubscriptionPlan | null>;
}

// Subscription limits for different tiers
export interface TierLimits {
  maxProjects: number;
  maxMaterials: number;
  canUploadImages: boolean;
  canExportPdf: boolean;
  canExportExcel: boolean;
  canUseAdvancedReports: boolean;
  canUseWhatIfAnalysis: boolean;
  hasCloudSync: boolean;
  hasPrioritySupport: boolean;
}

export const TIER_LIMITS: Record<SubscriptionTier, TierLimits> = {
  free: {
    maxProjects: 5,
    maxMaterials: 50,
    canUploadImages: false,
    canExportPdf: false,
    canExportExcel: false,
    canUseAdvancedReports: false,
    canUseWhatIfAnalysis: false,
    hasCloudSync: false,
    hasPrioritySupport: false,
  },
  pro: {
    maxProjects: -1, // Unlimited
    maxMaterials: -1, // Unlimited
    canUploadImages: true,
    canExportPdf: true,
    canExportExcel: true,
    canUseAdvancedReports: true,
    canUseWhatIfAnalysis: true,
    hasCloudSync: true,
    hasPrioritySupport: true,
  },
};

// Default subscription plans
export const DEFAULT_PLANS: SubscriptionPlan[] = [
  {
    id: 'free-plan',
    name: 'Free',
    tier: 'free',
    price: 0,
    currency: 'USD',
    interval: 'month',
    features: [
      'Up to 5 projects',
      'Basic P&L calculator',
      'Material cost tracking',
      'Email support',
    ],
  },
  {
    id: 'pro-monthly',
    name: 'Pro Monthly',
    tier: 'pro',
    price: 19.99,
    currency: 'USD',
    interval: 'month',
    features: [
      'Unlimited projects',
      'Material photo uploads',
      'Advanced reporting & analytics',
      'Cloud sync across devices',
      'Export to PDF/Excel',
      'Priority support',
      'What-if analysis tools',
    ],
  },
  {
    id: 'pro-yearly',
    name: 'Pro Yearly',
    tier: 'pro',
    price: 199.99,
    currency: 'USD',
    interval: 'year',
    features: [
      'Unlimited projects',
      'Material photo uploads',
      'Advanced reporting & analytics',
      'Cloud sync across devices',
      'Export to PDF/Excel',
      'Priority support',
      'What-if analysis tools',
      'Save 17% vs monthly',
    ],
  },
];