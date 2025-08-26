import { useEffect, useCallback } from 'react';
import { useSubscriptionStore } from '@/store/subscription-store';
import { createClient } from '@/lib/supabase/client';
import { getPaymentService } from '@/lib/payment/payment-service';
import { UserSubscription, SubscriptionPlan } from '@/types/payment';
import { trackPostHogEvent } from '@/lib/posthog-analytics';
import { trackEvent } from '@/lib/analytics';

export function useSubscription() {
  const {
    subscription,
    currentTier,
    currentPlan,
    isLoading,
    error,
    setSubscription,
    setCurrentPlan,
    setLoading,
    setError,
    setUsage,
  } = useSubscriptionStore();

  const supabase = createClient();

  // Load user's current subscription
  const loadSubscription = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setSubscription(null);
        setCurrentPlan(null);
        return;
      }

      // Get current subscription from database
      const { data: subscriptionData, error: subError } = await supabase
        .rpc('get_user_subscription', { user_uuid: user.id });

      if (subError) {
        console.error('Error fetching subscription:', subError);
        setError('Failed to load subscription');
        return;
      }

      if (subscriptionData && subscriptionData.length > 0) {
        const subData = subscriptionData[0];
        const userSubscription: UserSubscription = {
          id: subData.subscription_id,
          userId: user.id,
          planId: subData.plan_id,
          tier: subData.tier,
          status: subData.status,
          provider: subData.provider,
          providerSubscriptionId: '', // This would come from the full subscription record
          currentPeriodStart: '', // This would come from the full subscription record
          currentPeriodEnd: subData.current_period_end,
          cancelAtPeriodEnd: subData.cancel_at_period_end,
          createdAt: '',
          updatedAt: '',
        };

        setSubscription(userSubscription);

        // Load plan details
        const { data: planData } = await supabase
          .from('subscription_plans')
          .select('*')
          .eq('id', subData.plan_id)
          .single();

        if (planData) {
          const plan: SubscriptionPlan = {
            id: planData.id,
            name: planData.name,
            tier: planData.tier,
            price: parseFloat(planData.price),
            currency: planData.currency,
            interval: planData.interval,
            features: planData.features,
            paypalPlanId: planData.paypal_plan_id,
            stripePriceId: planData.stripe_price_id,
          };
          setCurrentPlan(plan);
        }
      } else {
        // User has no active subscription - default to free
        setSubscription(null);
        setCurrentPlan(null);
      }

      // Load usage data
      const { data: usageData } = await supabase
        .from('user_tier_usage')
        .select('project_count, material_count')
        .eq('user_id', user.id)
        .single();

      if (usageData) {
        setUsage({
          projectCount: usageData.project_count,
          materialCount: usageData.material_count,
        });
      }

    } catch (err) {
      console.error('Error loading subscription:', err);
      setError('Failed to load subscription');
    } finally {
      setLoading(false);
    }
  }, [supabase, setSubscription, setCurrentPlan, setLoading, setError, setUsage]);

  // Create a new subscription
  const createSubscription = useCallback(async (planId: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const paymentService = getPaymentService();
      const result = await paymentService.createSubscription(user.id, planId);

      // Track subscription creation attempt
      trackEvent('subscription_creation_started', {
        plan_id: planId,
        provider: paymentService.getProviderType(),
      });

      trackPostHogEvent('subscription_creation_started', {
        plan_id: planId,
        provider: paymentService.getProviderType(),
        user_id: user.id,
      });

      return result;
    } catch (err) {
      console.error('Error creating subscription:', err);
      setError(err instanceof Error ? err.message : 'Failed to create subscription');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [supabase, setLoading, setError]);

  // Cancel subscription
  const cancelSubscription = useCallback(async (immediately = false) => {
    if (!subscription) {
      throw new Error('No active subscription to cancel');
    }

    setLoading(true);
    setError(null);

    try {
      const paymentService = getPaymentService();
      await paymentService.cancelSubscription(subscription.providerSubscriptionId, immediately);

      // Track cancellation
      trackEvent('subscription_cancelled', {
        plan_id: subscription.planId,
        provider: subscription.provider,
        immediately: immediately,
      });

      trackPostHogEvent('subscription_cancelled', {
        plan_id: subscription.planId,
        provider: subscription.provider,
        immediately: immediately,
        user_id: subscription.userId,
      });

      // Reload subscription to get updated status
      await loadSubscription();
    } catch (err) {
      console.error('Error cancelling subscription:', err);
      setError(err instanceof Error ? err.message : 'Failed to cancel subscription');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [subscription, setLoading, setError, loadSubscription]);

  // Update subscription plan
  const updateSubscription = useCallback(async (newPlanId: string) => {
    if (!subscription) {
      throw new Error('No active subscription to update');
    }

    setLoading(true);
    setError(null);

    try {
      const paymentService = getPaymentService();
      await paymentService.updateSubscription(subscription.providerSubscriptionId, newPlanId);

      // Track plan change
      trackEvent('subscription_plan_changed', {
        old_plan_id: subscription.planId,
        new_plan_id: newPlanId,
        provider: subscription.provider,
      });

      trackPostHogEvent('subscription_plan_changed', {
        old_plan_id: subscription.planId,
        new_plan_id: newPlanId,
        provider: subscription.provider,
        user_id: subscription.userId,
      });

      // Reload subscription to get updated data
      await loadSubscription();
    } catch (err) {
      console.error('Error updating subscription:', err);
      setError(err instanceof Error ? err.message : 'Failed to update subscription');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [subscription, setLoading, setError, loadSubscription]);

  // Load subscription on mount and auth changes
  useEffect(() => {
    loadSubscription();

    // Listen for auth changes
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        loadSubscription();
      } else if (event === 'SIGNED_OUT') {
        setSubscription(null);
        setCurrentPlan(null);
        setUsage({ projectCount: 0, materialCount: 0 });
      }
    });

    return () => {
      authSubscription.unsubscribe();
    };
  }, [loadSubscription, supabase.auth, setSubscription, setCurrentPlan, setUsage]);

  return {
    subscription,
    currentTier,
    currentPlan,
    isLoading,
    error,
    loadSubscription,
    createSubscription,
    cancelSubscription,
    updateSubscription,
  };
}

// Hook for managing usage tracking
export function useUsageTracking() {
  const { setUsage } = useSubscriptionStore();
  const supabase = createClient();

  const incrementUsage = useCallback(async (type: 'project' | 'material', increment = 1) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const column = type === 'project' ? 'project_count' : 'material_count';
      
      // Update usage in database
      const { data, error } = await supabase
        .rpc('increment_user_usage', {
          user_uuid: user.id,
          usage_type: column,
          increment_amount: increment,
        });

      if (error) {
        console.error('Error incrementing usage:', error);
        return;
      }

      // Update local state
      const { data: usageData } = await supabase
        .from('user_tier_usage')
        .select('project_count, material_count')
        .eq('user_id', user.id)
        .single();

      if (usageData) {
        setUsage({
          projectCount: usageData.project_count,
          materialCount: usageData.material_count,
        });
      }
    } catch (err) {
      console.error('Error tracking usage:', err);
    }
  }, [supabase, setUsage]);

  const decrementUsage = useCallback(async (type: 'project' | 'material', decrement = 1) => {
    await incrementUsage(type, -decrement);
  }, [incrementUsage]);

  return {
    incrementUsage,
    decrementUsage,
  };
}