'use client';

import { SubscriptionPlan } from '@/types/payment';

interface PayPalButtonProps {
  plan: SubscriptionPlan;
  onSuccess?: (subscriptionId: string) => void;
  onError?: (error: string) => void;
  onCancel?: () => void;
  disabled?: boolean;
  className?: string;
}

export default function PayPalButton({
  plan,
  className = '',
}: PayPalButtonProps) {
  // Unused in stub mode
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { onSuccess, onError, onCancel, disabled } = {} as { onSuccess?: (id: string) => void, onError?: (err: string) => void, onCancel?: () => void, disabled?: boolean };
  // PayPal temporarily disabled for deployment
  return (
    <div className={`${className}`}>
      <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 text-center">
        <div className="text-gray-600 mb-2">
          PayPal payments temporarily unavailable
        </div>
        <div className="text-sm text-gray-500">
          Payment processing is temporarily disabled during deployment updates.
          <br />Plan: {plan.name}
        </div>
      </div>
    </div>
  );

  /* Original PayPal implementation - temporarily commented out
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { createSubscription } = useSubscription();
  const buttonRef = useRef<HTMLDivElement>(null);
  const [paypalLoaded, setPaypalLoaded] = useState(false);

  useEffect(() => {
    const loadPayPalScript = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
        const environment = process.env.NEXT_PUBLIC_PAYPAL_ENVIRONMENT as 'sandbox' | 'live';

        if (!clientId) {
          throw new Error('PayPal client ID not configured');
        }

        // Load PayPal script
        const paypal = await loadScript({
          clientId,
          components: 'buttons',
          vault: true,
          intent: 'subscription',
          currency: plan.currency,
          locale: 'en_US',
          environment: environment === 'live' ? 'production' : 'sandbox',
        });

        if (!paypal || !paypal.Buttons) {
          throw new Error('Failed to load PayPal SDK');
        }

        setPaypalLoaded(true);

        // Clear previous button
        if (buttonRef.current) {
          buttonRef.current.innerHTML = '';
        }

        // Render PayPal button
        const buttons = paypal.Buttons({
          style: {
            shape: 'rect',
            color: 'blue',
            layout: 'vertical',
            label: 'subscribe',
            height: 45,
          },

          createSubscription: async (data, actions) => {
            try {
              // Track subscription creation start
              trackEvent('paypal_subscription_create_start', {
                plan_id: plan.id,
                plan_name: plan.name,
                amount: plan.price,
                currency: plan.currency,
              });

              trackPostHogEvent('paypal_subscription_create_start', {
                plan_id: plan.id,
                plan_name: plan.name,
                amount: plan.price,
                currency: plan.currency,
              });

              // Track with GA4 subscription funnel
              subscriptionFunnel.startPayment({
                plan_id: plan.id,
                payment_method: 'paypal',
                value: plan.price,
                currency: plan.currency
              });

              if (!plan.paypalPlanId) {
                throw new Error('PayPal plan ID not configured for this plan');
              }

              return actions.subscription.create({
                plan_id: plan.paypalPlanId,
                application_context: {
                  brand_name: 'MakerCost',
                  locale: 'en-US',
                  shipping_preference: 'NO_SHIPPING',
                  user_action: 'SUBSCRIBE_NOW',
                  payment_method: {
                    payer_selected: 'PAYPAL',
                    payee_preferred: 'IMMEDIATE_PAYMENT_REQUIRED',
                  },
                  return_url: `${process.env.NEXT_PUBLIC_APP_URL}/account/subscription/success`,
                  cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
                },
              });
            } catch (err) {
              console.error('Error creating PayPal subscription:', err);
              const errorMessage = err instanceof Error ? err.message : 'Failed to create subscription';
              onError?.(errorMessage);
              throw err;
            }
          },

          onApprove: async (data, actions) => {
            try {
              // Track approval
              trackEvent('paypal_subscription_approved', {
                subscription_id: data.subscriptionID,
                plan_id: plan.id,
              });

              trackPostHogEvent('paypal_subscription_approved', {
                subscription_id: data.subscriptionID,
                plan_id: plan.id,
              });

              // Track with GA4 subscription funnel
              if (data.subscriptionID) {
                subscriptionFunnel.completePayment({
                  transaction_id: data.subscriptionID,
                  subscription_id: data.subscriptionID,
                  plan_id: plan.id,
                  plan_name: plan.name,
                  value: plan.price,
                  currency: plan.currency,
                  billing_cycle: plan.interval === 'month' ? 'monthly' : 'yearly',
                  tier: 'pro',
                  payment_provider: 'paypal',
                  user_id: '' // Should be filled from user context
                });
              }

              // Track subscription purchase
              if (data.subscriptionID) {
                trackSubscriptionPurchase({
                  transaction_id: data.subscriptionID,
                  subscription_id: data.subscriptionID,
                  plan_id: plan.id,
                  plan_name: plan.name,
                  value: plan.price,
                  currency: plan.currency,
                  billing_cycle: plan.interval === 'month' ? 'monthly' : 'yearly',
                  tier: 'pro',
                  payment_provider: 'paypal',
                  user_id: '' // Should be filled from user context
                });
              }

              // The subscription is now active on PayPal's side
              // We'll receive a webhook to update our database
              if (data.subscriptionID) {
                onSuccess?.(data.subscriptionID);
              }
            } catch (err) {
              console.error('Error handling PayPal approval:', err);
              const errorMessage = err instanceof Error ? err.message : 'Failed to process subscription';
              onError?.(errorMessage);
              throw err;
            }
          },

          onCancel: (data) => {
            // Track cancellation
            trackEvent('paypal_subscription_cancelled', {
              plan_id: plan.id,
            });

            trackPostHogEvent('paypal_subscription_cancelled', {
              plan_id: plan.id,
            });

            onCancel?.();
          },

          onError: (err) => {
            console.error('PayPal button error:', err);
            
            // Track error
            trackEvent('paypal_subscription_error', {
              plan_id: plan.id,
              error: err.toString(),
            });

            trackPostHogEvent('paypal_subscription_error', {
              plan_id: plan.id,
              error: err.toString(),
            });

            const errorMessage = 'Payment processing failed. Please try again.';
            setError(errorMessage);
            onError?.(errorMessage);
          },
        });

        if (buttonRef.current && !disabled) {
          buttons.render(buttonRef.current);
        }

      } catch (err) {
        console.error('Error loading PayPal:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load payment system';
        setError(errorMessage);
        onError?.(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadPayPalScript();
  }, [plan, onSuccess, onError, onCancel, disabled]);

  // Re-render button when disabled state changes
  useEffect(() => {
    if (paypalLoaded && buttonRef.current) {
      buttonRef.current.style.opacity = disabled ? '0.5' : '1';
      buttonRef.current.style.pointerEvents = disabled ? 'none' : 'auto';
    }
  }, [disabled, paypalLoaded]);

  if (error) {
    return (
      <div className={`text-center p-4 ${className}`}>
        <div className="text-red-600 text-sm mb-2">⚠️ Payment Error</div>
        <div className="text-gray-600 text-sm">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 text-blue-600 hover:text-blue-800 text-sm underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {isLoading && (
        <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading payment options...</span>
        </div>
      )}
      
      <div 
        ref={buttonRef} 
        className={`${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        style={{ minHeight: isLoading ? '0' : '45px' }}
      />
      
      {!isLoading && !error && (
        <div className="text-xs text-gray-500 text-center mt-2">
          Secure payment processed by PayPal
        </div>
      )}
    </div>
  );
  */
}