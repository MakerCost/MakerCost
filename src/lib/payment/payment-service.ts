import { 
  PaymentProviderInterface, 
  PaymentProvider, 
  SubscriptionPlan, 
  UserSubscription,
  PaymentMethod,
  PaymentEvent,
  WebhookEvent,
  DEFAULT_PLANS
} from '@/types/payment';

// Payment service class that acts as a facade for different payment providers
export class PaymentService {
  private provider: PaymentProviderInterface;
  private providerType: PaymentProvider;

  constructor(provider: PaymentProviderInterface, providerType: PaymentProvider) {
    this.provider = provider;
    this.providerType = providerType;
  }

  // Subscription management
  async createSubscription(userId: string, planId: string, paymentMethodId?: string) {
    return this.provider.createSubscription(userId, planId, paymentMethodId);
  }

  async cancelSubscription(subscriptionId: string, immediately = false) {
    return this.provider.cancelSubscription(subscriptionId, immediately);
  }

  async updateSubscription(subscriptionId: string, newPlanId: string) {
    return this.provider.updateSubscription(subscriptionId, newPlanId);
  }

  async getSubscription(subscriptionId: string) {
    return this.provider.getSubscription(subscriptionId);
  }

  // Payment methods
  async attachPaymentMethod(userId: string, paymentMethodId: string) {
    return this.provider.attachPaymentMethod(userId, paymentMethodId);
  }

  async getPaymentMethods(userId: string) {
    return this.provider.getPaymentMethods(userId);
  }

  async setDefaultPaymentMethod(userId: string, paymentMethodId: string) {
    return this.provider.setDefaultPaymentMethod(userId, paymentMethodId);
  }

  // Webhooks
  verifyWebhookSignature(payload: string, signature: string) {
    return this.provider.verifyWebhookSignature(payload, signature);
  }

  async handleWebhookEvent(event: WebhookEvent) {
    return this.provider.handleWebhookEvent(event);
  }

  // Plans
  async getPlans() {
    return this.provider.getPlans();
  }

  async getPlan(planId: string) {
    return this.provider.getPlan(planId);
  }

  // Utility methods
  getProviderType(): PaymentProvider {
    return this.providerType;
  }

  // Static method to get default plans (useful for fallback)
  static getDefaultPlans(): SubscriptionPlan[] {
    return DEFAULT_PLANS;
  }

  // Analytics integration helper
  async trackPaymentEvent(event: PaymentEvent) {
    // This will be integrated with GA4 and PostHog
    if (typeof window !== 'undefined') {
      // Track with GA4
      if (window.gtag) {
        window.gtag('event', 'purchase', {
          transaction_id: event.subscriptionId,
          value: event.amount,
          currency: event.currency,
          items: [{
            item_id: event.planId,
            item_name: `Subscription - ${event.planId}`,
            category: 'subscription',
            quantity: 1,
            price: event.amount,
          }],
        });
      }

      // Track with PostHog
      const { trackPostHogEvent, identifyUser } = await import('@/lib/posthog-analytics');
      
      trackPostHogEvent('subscription_event', {
        event_type: event.eventType,
        subscription_id: event.subscriptionId,
        plan_id: event.planId,
        amount: event.amount,
        currency: event.currency,
        provider: event.provider,
        user_id: event.userId,
      });

      // Update user properties
      identifyUser(event.userId, {
        subscription_tier: event.planId.includes('pro') ? 'pro' : 'free',
        subscription_status: event.eventType,
        payment_provider: event.provider,
      });
    }
  }
}

// Singleton pattern for payment service
let paymentServiceInstance: PaymentService | null = null;

export function getPaymentService(): PaymentService {
  if (!paymentServiceInstance) {
    throw new Error('Payment service not initialized. Call initializePaymentService first.');
  }
  return paymentServiceInstance;
}

export function initializePaymentService(provider: PaymentProviderInterface, providerType: PaymentProvider) {
  paymentServiceInstance = new PaymentService(provider, providerType);
  return paymentServiceInstance;
}

// Helper function to check if payment service is initialized
export function isPaymentServiceInitialized(): boolean {
  return paymentServiceInstance !== null;
}