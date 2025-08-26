'use client';

import { PayPalProvider } from './providers/paypal-provider';
import { initializePaymentService, isPaymentServiceInitialized } from './payment-service';
import { WebhookEvent, PaymentEvent, UserSubscription } from '@/types/payment';

// Client-side payment service initialization
export function initializeClientPaymentService() {
  if (isPaymentServiceInitialized()) {
    return; // Already initialized
  }

  try {
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const environment = process.env.NEXT_PUBLIC_PAYPAL_ENVIRONMENT as 'sandbox' | 'live';

    if (!clientId) {
      console.warn('PayPal client ID not configured - payment service unavailable');
      return;
    }

    // For client-side, we create a limited PayPal provider
    // that only handles subscription creation (other operations happen server-side)
    const clientPayPalProvider = new ClientPayPalProvider(clientId, environment || 'sandbox');
    
    initializePaymentService(clientPayPalProvider, 'paypal');
    console.log('Payment service initialized with PayPal provider');
  } catch (error) {
    console.error('Failed to initialize payment service:', error);
  }
}

// Client-side PayPal provider implementation
class ClientPayPalProvider extends PayPalProvider {
  constructor(clientId: string, environment: 'sandbox' | 'live') {
    // Pass empty secret for client-side (not used)
    super(clientId, '', environment);
  }

  // Override server-side methods that shouldn't be called from client
  async getSubscription(subscriptionId: string): Promise<UserSubscription | null> {
    throw new Error('getSubscription should be called from server-side only');
  }

  async cancelSubscription(subscriptionId: string, immediately?: boolean) {
    throw new Error('cancelSubscription should be called from server-side only');
  }

  async updateSubscription(subscriptionId: string, newPlanId: string) {
    throw new Error('updateSubscription should be called from server-side only');
  }

  verifyWebhookSignature(payload: string, signature: string): boolean {
    throw new Error('verifyWebhookSignature should be called from server-side only');
  }

  async handleWebhookEvent(event: WebhookEvent): Promise<PaymentEvent | null> {
    throw new Error('handleWebhookEvent should be called from server-side only');
  }
}