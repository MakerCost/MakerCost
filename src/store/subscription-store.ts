import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  SubscriptionTier, 
  SubscriptionStatus, 
  UserSubscription, 
  SubscriptionPlan,
  TierLimits,
  TIER_LIMITS 
} from '@/types/payment';

interface SubscriptionState {
  // Current subscription data
  subscription: UserSubscription | null;
  currentTier: SubscriptionTier;
  currentPlan: SubscriptionPlan | null;
  isLoading: boolean;
  error: string | null;

  // Feature access
  tierLimits: TierLimits;
  usage: {
    projectCount: number;
    materialCount: number;
  };

  // Actions
  setSubscription: (subscription: UserSubscription | null) => void;
  setCurrentPlan: (plan: SubscriptionPlan | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setUsage: (usage: { projectCount: number; materialCount: number }) => void;
  updateTier: (tier: SubscriptionTier) => void;
  
  // Feature access helpers
  hasFeatureAccess: (feature: keyof TierLimits) => boolean;
  hasReachedLimit: (feature: 'projects' | 'materials') => boolean;
  getRemainingUsage: (feature: 'projects' | 'materials') => number;
  
  // Reset store
  reset: () => void;
}

const initialState = {
  subscription: null,
  currentTier: 'free' as SubscriptionTier,
  currentPlan: null,
  isLoading: false,
  error: null,
  tierLimits: TIER_LIMITS.free,
  usage: {
    projectCount: 0,
    materialCount: 0,
  },
};

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setSubscription: (subscription) => {
        const tier = subscription?.tier || 'free';
        set({
          subscription,
          currentTier: tier,
          tierLimits: TIER_LIMITS[tier],
        });
      },

      setCurrentPlan: (plan) => set({ currentPlan: plan }),

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      setUsage: (usage) => set({ usage }),

      updateTier: (tier) => set({
        currentTier: tier,
        tierLimits: TIER_LIMITS[tier],
      }),

      hasFeatureAccess: (feature) => {
        const { tierLimits } = get();
        return tierLimits[feature] === true || (typeof tierLimits[feature] === 'number' && tierLimits[feature] !== 0);
      },

      hasReachedLimit: (feature) => {
        const { tierLimits, usage } = get();
        
        if (feature === 'projects') {
          return tierLimits.maxProjects !== -1 && usage.projectCount >= tierLimits.maxProjects;
        }
        
        if (feature === 'materials') {
          return tierLimits.maxMaterials !== -1 && usage.materialCount >= tierLimits.maxMaterials;
        }
        
        return false;
      },

      getRemainingUsage: (feature) => {
        const { tierLimits, usage } = get();
        
        if (feature === 'projects') {
          if (tierLimits.maxProjects === -1) return Infinity;
          return Math.max(0, tierLimits.maxProjects - usage.projectCount);
        }
        
        if (feature === 'materials') {
          if (tierLimits.maxMaterials === -1) return Infinity;
          return Math.max(0, tierLimits.maxMaterials - usage.materialCount);
        }
        
        return 0;
      },

      reset: () => set(initialState),
    }),
    {
      name: 'subscription-store',
      version: 1,
      // Only persist essential data, not loading states
      partialize: (state) => ({
        subscription: state.subscription,
        currentTier: state.currentTier,
        currentPlan: state.currentPlan,
        usage: state.usage,
      }),
    }
  )
);

// Selectors for common use cases
export const useCurrentTier = () => useSubscriptionStore((state) => state.currentTier);
export const useSubscription = () => useSubscriptionStore((state) => state.subscription);
export const useIsProUser = () => useSubscriptionStore((state) => state.currentTier === 'pro');
export const useTierLimits = () => useSubscriptionStore((state) => state.tierLimits);
export const useUsage = () => useSubscriptionStore((state) => state.usage);

// Feature access hooks
export const useFeatureAccess = (feature: keyof TierLimits) => 
  useSubscriptionStore((state) => state.hasFeatureAccess(feature));

export const useHasReachedLimit = (feature: 'projects' | 'materials') =>
  useSubscriptionStore((state) => state.hasReachedLimit(feature));

export const useRemainingUsage = (feature: 'projects' | 'materials') =>
  useSubscriptionStore((state) => state.getRemainingUsage(feature));

// Subscription status helpers
export const useSubscriptionStatus = () => {
  const subscription = useSubscriptionStore((state) => state.subscription);
  
  return {
    isActive: subscription?.status === 'active',
    isTrialing: subscription?.status === 'trialing',
    isPastDue: subscription?.status === 'past_due',
    isCancelled: subscription?.status === 'cancelled',
    willCancelAtPeriodEnd: subscription?.cancelAtPeriodEnd || false,
    currentPeriodEnd: subscription?.currentPeriodEnd,
    provider: subscription?.provider,
  };
};