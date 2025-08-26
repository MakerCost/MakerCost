import { PayPalApi, subscriptionsAPI, ordersAPI } from '@paypal/paypal-server-sdk';
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
  private client: PayPalApi;
  private environment: 'sandbox' | 'live';

  constructor(clientId: string, clientSecret: string, environment: 'sandbox' | 'live' = 'sandbox') {
    this.environment = environment;
    this.client = new PayPalApi({
      clientCredentialsAuthCredentials: {
        oAuthClientId: clientId,
        oAuthClientSecret: clientSecret,
      },
      environment: environment,
    });
  }

  // Subscription management
  async createSubscription(userId: string, planId: string, paymentMethodId?: string) {
    try {
      const plan = await this.getPlan(planId);
      if (!plan || !plan.paypalPlanId) {
        throw new Error('Plan not found or PayPal plan ID not configured');
      }

      const request = {
        body: {
          planId: plan.paypalPlanId,
          applicationContext: {
            brandName: 'MakerCost',
            locale: 'en-US',
            shippingPreference: 'NO_SHIPPING',
            userAction: 'SUBSCRIBE_NOW',
            paymentMethod: {
              payerSelected: 'PAYPAL',
              payeePreferred: 'IMMEDIATE_PAYMENT_REQUIRED',
            },
            returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/account/subscription/success`,
            cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
          },
          customId: userId, // Store user ID for webhook processing
        },
      };

      const response = await this.client.subscriptions.subscriptionsCreate(request);
      
      if (response.result && response.result.id) {
        const approvalUrl = response.result.links?.find(link => link.rel === 'approve')?.href;
        
        return {
          subscriptionId: response.result.id,
          approvalUrl: approvalUrl,
        };
      }

      throw new Error('Failed to create subscription');
    } catch (error) {
      console.error('PayPal subscription creation failed:', error);
      throw error;
    }
  }

  async cancelSubscription(subscriptionId: string, immediately = false) {
    try {
      const request = {
        subscriptionId,
        body: {
          reason: immediately ? 'User requested immediate cancellation' : 'User requested cancellation at period end',
        },
      };

      await this.client.subscriptions.subscriptionsCancel(request);
    } catch (error) {
      console.error('PayPal subscription cancellation failed:', error);
      throw error;
    }
  }

  async updateSubscription(subscriptionId: string, newPlanId: string) {
    try {
      const plan = await this.getPlan(newPlanId);
      if (!plan || !plan.paypalPlanId) {
        throw new Error('New plan not found or PayPal plan ID not configured');
      }

      const request = {
        subscriptionId,
        body: {
          planId: plan.paypalPlanId,
        },
      };

      await this.client.subscriptions.subscriptionsRevise(request);
    } catch (error) {
      console.error('PayPal subscription update failed:', error);
      throw error;
    }
  }

  async getSubscription(subscriptionId: string): Promise<UserSubscription | null> {
    try {
      const request = { subscriptionId };
      const response = await this.client.subscriptions.subscriptionsGet(request);
      
      if (response.result) {
        const paypalSub = response.result;
        
        return {
          id: paypalSub.id || '',
          userId: paypalSub.customId || '', // We store user ID in customId
          planId: this.mapPayPalPlanToInternal(paypalSub.planId || ''),
          tier: this.mapPayPalPlanToTier(paypalSub.planId || ''),
          status: this.mapPayPalStatus(paypalSub.status || ''),
          provider: 'paypal',
          providerSubscriptionId: paypalSub.id || '',
          currentPeriodStart: paypalSub.startTime || new Date().toISOString(),
          currentPeriodEnd: this.calculateNextBillingTime(paypalSub.billingInfo?.nextBillingTime || ''),
          cancelAtPeriodEnd: paypalSub.status === 'CANCELLED',
          createdAt: paypalSub.createTime || new Date().toISOString(),
          updatedAt: paypalSub.updateTime || new Date().toISOString(),
        };
      }

      return null;
    } catch (error) {
      console.error('Failed to get PayPal subscription:', error);
      return null;
    }
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
      const resource = data.resource as any;
      
      return {
        eventType: internalEventType as any,
        userId: resource.custom_id || resource.payer?.payer_info?.payer_id || '',
        subscriptionId: resource.id || resource.billing_agreement_id || '',
        planId: this.mapPayPalPlanToInternal(resource.plan_id || ''),
        amount: parseFloat(resource.amount?.total || resource.gross_amount?.value || '0'),
        currency: resource.amount?.currency || resource.gross_amount?.currency_code || 'USD',
        provider: 'paypal',
        timestamp: resource.create_time || new Date().toISOString(),
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