import { Client, Environment, ClientCredentialsAuthManager } from '@paypal/paypal-server-sdk';
import { 
  PaymentProviderInterface, 
  SubscriptionPlan, 
  UserSubscription, 
  PaymentMethod, 
  PaymentEvent, 
  WebhookEvent,
  SubscriptionStatus,
  DEFAULT_PLANS
} from '@/types/payment';

export class PayPalProvider implements PaymentProviderInterface {
  private client: Client;
  private environment: 'sandbox' | 'live';

  constructor(clientId: string, clientSecret: string, environment: 'sandbox' | 'live' = 'sandbox') {
    this.environment = environment;
    this.client = new Client({
      authCredentials: new ClientCredentialsAuthManager({
        oAuthClientId: clientId,
        oAuthClientSecret: clientSecret,
      }),
      environment: environment === 'sandbox' ? Environment.Sandbox : Environment.Production,
    });
  }

  // Subscription management
  async createSubscription(userId: string, planId: string, paymentMethodId?: string): Promise<{
    subscriptionId: string;
    clientSecret?: string;
    approvalUrl?: string;
  }> {
    // PayPal implementation needs proper SDK setup
    throw new Error('PayPal provider not fully implemented yet');
  }

  async cancelSubscription(subscriptionId: string, immediately = false) {
    throw new Error('PayPal provider not fully implemented yet');
  }

  async updateSubscription(subscriptionId: string, newPlanId: string) {
    throw new Error('PayPal provider not fully implemented yet');
  }

  async getSubscription(subscriptionId: string): Promise<UserSubscription | null> {
    // PayPal implementation needs proper SDK setup
    return null;
  }

  // Payment methods (PayPal uses approval flow, so these are simplified)
  async attachPaymentMethod(userId: string, paymentMethodId: string) {
    // PayPal handles payment methods through their approval flow
    // This is a no-op for PayPal implementation
    return;
  }

  async getPaymentMethods(userId: string): Promise<PaymentMethod[]> {
    // PayPal subscriptions handle payment methods internally
    // Return empty array for now, could be enhanced to show PayPal account info
    return [];
  }

  async setDefaultPaymentMethod(userId: string, paymentMethodId: string) {
    // PayPal handles payment methods through their system
    // This is a no-op for PayPal implementation
    return;
  }

  // Webhooks
  verifyWebhookSignature(payload: string, signature: string): boolean {
    // PayPal webhook verification would be implemented here
    // For now, return true (implement proper verification in production)
    return true;
  }

  async handleWebhookEvent(event: WebhookEvent): Promise<PaymentEvent | null> {
    try {
      const { eventType, data } = event;
      
      // Map PayPal webhook events to our internal events
      const eventMapping: Record<string, string> = {
        'BILLING.SUBSCRIPTION.CREATED': 'subscription_created',
        'BILLING.SUBSCRIPTION.UPDATED': 'subscription_updated',
        'BILLING.SUBSCRIPTION.CANCELLED': 'subscription_cancelled',
        'PAYMENT.SALE.COMPLETED': 'payment_succeeded',
        'PAYMENT.SALE.DENIED': 'payment_failed',
      };

      const internalEventType = eventMapping[eventType];
      if (!internalEventType) {
        return null; // Event type not handled
      }

      // Extract relevant data from PayPal webhook
      const resource = data.resource as Record<string, unknown>;
      
      return {
        eventType: internalEventType as PaymentEvent['eventType'],
        userId: String(resource.custom_id || ''),
        subscriptionId: String(resource.id || resource.billing_agreement_id || ''),
        planId: this.mapPayPalPlanToInternal(String(resource.plan_id || '')),
        amount: parseFloat(String((resource.amount as Record<string, unknown>)?.total || (resource.gross_amount as Record<string, unknown>)?.value || '0')),
        currency: String((resource.amount as Record<string, unknown>)?.currency || (resource.gross_amount as Record<string, unknown>)?.currency_code || 'USD'),
        provider: 'paypal',
        timestamp: String(resource.create_time || new Date().toISOString()),
        metadata: data,
      };
    } catch (error) {
      console.error('Failed to handle PayPal webhook event:', error);
      return null;
    }
  }

  // Plans
  async getPlans(): Promise<SubscriptionPlan[]> {
    // Return our predefined plans with PayPal plan IDs
    return DEFAULT_PLANS.map(plan => ({
      ...plan,
      paypalPlanId: this.getPayPalPlanId(plan.id),
    }));
  }

  async getPlan(planId: string): Promise<SubscriptionPlan | null> {
    const plans = await this.getPlans();
    return plans.find(plan => plan.id === planId) || null;
  }

  // Helper methods
  private mapPayPalStatus(paypalStatus: string): SubscriptionStatus {
    const statusMapping: Record<string, SubscriptionStatus> = {
      'APPROVAL_PENDING': 'incomplete',
      'APPROVED': 'trialing',
      'ACTIVE': 'active',
      'SUSPENDED': 'past_due',
      'CANCELLED': 'cancelled',
      'EXPIRED': 'cancelled',
    };

    return statusMapping[paypalStatus] || 'active';
  }

  private mapPayPalPlanToTier(paypalPlanId: string): 'free' | 'pro' {
    if (paypalPlanId.includes('pro')) {
      return 'pro';
    }
    return 'free';
  }

  private mapPayPalPlanToInternal(paypalPlanId: string): string {
    // Map PayPal plan IDs back to our internal plan IDs
    const planMapping: Record<string, string> = {
      [process.env.PAYPAL_PRO_MONTHLY_PLAN_ID || '']: 'pro-monthly',
      [process.env.PAYPAL_PRO_YEARLY_PLAN_ID || '']: 'pro-yearly',
    };

    return planMapping[paypalPlanId] || 'free-plan';
  }

  private getPayPalPlanId(planId: string): string | undefined {
    const planMapping: Record<string, string> = {
      'pro-monthly': process.env.PAYPAL_PRO_MONTHLY_PLAN_ID || '',
      'pro-yearly': process.env.PAYPAL_PRO_YEARLY_PLAN_ID || '',
    };

    return planMapping[planId];
  }

  private calculateNextBillingTime(nextBillingTime: string): string {
    if (nextBillingTime) {
      return nextBillingTime;
    }
    
    // Fallback: calculate next month
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return nextMonth.toISOString();
  }
}