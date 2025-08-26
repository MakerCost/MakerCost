import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PayPalProvider } from '@/lib/payment/providers/paypal-provider';
import { PaymentService } from '@/lib/payment/payment-service';
import { WebhookEvent, PaymentEvent } from '@/types/payment';
import type { SupabaseClient } from '@supabase/supabase-js';

// Initialize PayPal provider
function getPayPalProvider() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const environment = process.env.PAYPAL_ENVIRONMENT as 'sandbox' | 'live';

  if (!clientId || !clientSecret) {
    throw new Error('PayPal credentials not configured');
  }

  return new PayPalProvider(clientId, clientSecret, environment);
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.text();
    const signature = request.headers.get('paypal-transmission-sig') || '';
    
    let webhookData;
    try {
      webhookData = JSON.parse(body);
    } catch {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }

    // Verify webhook signature (implement proper verification in production)
    const paypalProvider = getPayPalProvider();
    const isValid = paypalProvider.verifyWebhookSignature(body, signature);
    
    if (!isValid) {
      console.warn('Invalid PayPal webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // Create webhook event record
    const webhookEvent: Omit<WebhookEvent, 'id'> = {
      provider: 'paypal',
      eventType: webhookData.event_type,
      data: webhookData,
      timestamp: new Date().toISOString(),
      signature,
    };

    // Store webhook event
    const { data: storedEvent, error: webhookError } = await supabase
      .from('webhook_events')
      .insert({
        provider: webhookEvent.provider,
        event_type: webhookEvent.eventType,
        provider_event_id: webhookData.id,
        data: webhookEvent.data,
        processed: false,
        retry_count: 0,
      })
      .select()
      .single();

    if (webhookError) {
      console.error('Error storing webhook event:', webhookError);
      return NextResponse.json({ error: 'Failed to store webhook' }, { status: 500 });
    }

    try {
      // Process the webhook event
      const paymentService = new PaymentService(paypalProvider, 'paypal');
      const paymentEvent = await paypalProvider.handleWebhookEvent({
        ...webhookEvent,
        id: storedEvent.id,
      });

      if (paymentEvent) {
        await processPaymentEvent(paymentEvent, supabase);
        
        // Track the event with analytics
        await paymentService.trackPaymentEvent(paymentEvent);
      }

      // Mark webhook as processed
      await supabase
        .from('webhook_events')
        .update({ 
          processed: true, 
          processed_at: new Date().toISOString() 
        })
        .eq('id', storedEvent.id);

      return NextResponse.json({ success: true });

    } catch (processingError) {
      console.error('Error processing webhook:', processingError);
      
      // Update webhook with error
      await supabase
        .from('webhook_events')
        .update({ 
          error_message: processingError instanceof Error ? processingError.message : 'Processing failed',
          retry_count: storedEvent.retry_count + 1
        })
        .eq('id', storedEvent.id);

      return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
    }

  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function processPaymentEvent(event: PaymentEvent, supabase: SupabaseClient) {
  try {
    // Store payment event
    await supabase
      .from('payment_events')
      .insert({
        event_type: event.eventType,
        user_id: event.userId,
        plan_id: event.planId,
        amount: event.amount,
        currency: event.currency,
        provider: event.provider,
        provider_event_id: event.metadata?.id || null,
        metadata: event.metadata,
      });

    // Update user subscription based on event type
    switch (event.eventType) {
      case 'subscription_created':
        await handleSubscriptionCreated(event, supabase);
        break;
      
      case 'subscription_updated':
        await handleSubscriptionUpdated(event, supabase);
        break;
      
      case 'subscription_cancelled':
        await handleSubscriptionCancelled(event, supabase);
        break;
      
      case 'payment_succeeded':
        await handlePaymentSucceeded(event, supabase);
        break;
      
      case 'payment_failed':
        await handlePaymentFailed(event, supabase);
        break;
      
      default:
        console.log(`Unhandled payment event type: ${event.eventType}`);
    }

  } catch (error) {
    console.error('Error processing payment event:', error);
    throw error;
  }
}

async function handleSubscriptionCreated(event: PaymentEvent, supabase: SupabaseClient) {
  const resource = event.metadata?.resource as Record<string, unknown>;
  
  if (!resource) {
    console.warn('No resource data in subscription created event');
    return;
  }

  // Create or update user subscription
  const subscriptionData = {
    user_id: event.userId,
    plan_id: event.planId,
    tier: event.planId.includes('pro') ? 'pro' as const : 'free' as const,
    status: 'active' as const,
    provider: event.provider,
    provider_subscription_id: event.subscriptionId,
    current_period_start: String(resource.start_time || new Date().toISOString()),
    current_period_end: String((resource.billing_info as Record<string, unknown>)?.next_billing_time || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()),
    cancel_at_period_end: false,
  };

  await supabase
    .from('user_subscriptions')
    .upsert(subscriptionData, { 
      onConflict: 'user_id,status',
      ignoreDuplicates: false 
    });

  // Initialize or update user tier usage
  await supabase
    .from('user_tier_usage')
    .upsert({
      user_id: event.userId,
      tier: subscriptionData.tier,
      project_count: 0,
      material_count: 0,
      last_reset_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id',
      ignoreDuplicates: false
    });
}

async function handleSubscriptionUpdated(event: PaymentEvent, supabase: SupabaseClient) {
  // Update existing subscription
  await supabase
    .from('user_subscriptions')
    .update({
      plan_id: event.planId,
      tier: event.planId.includes('pro') ? 'pro' : 'free',
      updated_at: new Date().toISOString(),
    })
    .eq('provider_subscription_id', event.subscriptionId);
}

async function handleSubscriptionCancelled(event: PaymentEvent, supabase: SupabaseClient) {
  // Update subscription status
  await supabase
    .from('user_subscriptions')
    .update({
      status: 'cancelled',
      cancel_at_period_end: true,
      updated_at: new Date().toISOString(),
    })
    .eq('provider_subscription_id', event.subscriptionId);
}

async function handlePaymentSucceeded(event: PaymentEvent, supabase: SupabaseClient) {
  // Update subscription as active if it was past due
  await supabase
    .from('user_subscriptions')
    .update({
      status: 'active',
      updated_at: new Date().toISOString(),
    })
    .eq('provider_subscription_id', event.subscriptionId)
    .in('status', ['past_due', 'unpaid']);
}

async function handlePaymentFailed(event: PaymentEvent, supabase: SupabaseClient) {
  // Update subscription as past due
  await supabase
    .from('user_subscriptions')
    .update({
      status: 'past_due',
      updated_at: new Date().toISOString(),
    })
    .eq('provider_subscription_id', event.subscriptionId);
}