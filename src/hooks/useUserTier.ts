import { useState, useEffect } from 'react';

export type UserTier = 'free' | 'pro' | 'enterprise';

export interface UserTierInfo {
  tier: UserTier;
  features: {
    materialPhotos: boolean;
    unlimitedMaterials: boolean;
    advancedReports: boolean;
    prioritySupport: boolean;
    customBranding: boolean;
  };
  limits: {
    maxMaterials: number;
    maxProjects: number;
    maxQuotes: number;
  };
}

const TIER_CONFIGURATIONS: Record<UserTier, UserTierInfo> = {
  free: {
    tier: 'free',
    features: {
      materialPhotos: false,
      unlimitedMaterials: false,
      advancedReports: false,
      prioritySupport: false,
      customBranding: false,
    },
    limits: {
      maxMaterials: 25,
      maxProjects: 10,
      maxQuotes: 50,
    },
  },
  pro: {
    tier: 'pro',
    features: {
      materialPhotos: true,
      unlimitedMaterials: true,
      advancedReports: true,
      prioritySupport: true,
      customBranding: false,
    },
    limits: {
      maxMaterials: Infinity,
      maxProjects: Infinity,
      maxQuotes: Infinity,
    },
  },
  enterprise: {
    tier: 'enterprise',
    features: {
      materialPhotos: true,
      unlimitedMaterials: true,
      advancedReports: true,
      prioritySupport: true,
      customBranding: true,
    },
    limits: {
      maxMaterials: Infinity,
      maxProjects: Infinity,
      maxQuotes: Infinity,
    },
  },
};

/**
 * Hook for managing user tier and feature access
 * Currently defaults to 'pro' for development - will be connected to actual user data later
 */
export function useUserTier() {
  // TODO: Replace with actual user tier from authentication/subscription system
  const [userTier, setUserTier] = useState<UserTier>('pro'); // Default to 'pro' for development
  const [loading, setLoading] = useState(false);

  // Get current tier configuration
  const tierInfo = TIER_CONFIGURATIONS[userTier];

  // Feature access helpers
  const hasFeature = (feature: keyof UserTierInfo['features']): boolean => {
    return tierInfo.features[feature];
  };

  const hasReachedLimit = (type: keyof UserTierInfo['limits'], currentCount: number): boolean => {
    const limit = tierInfo.limits[type];
    return limit !== Infinity && currentCount >= limit;
  };

  const getRemainingCount = (type: keyof UserTierInfo['limits'], currentCount: number): number => {
    const limit = tierInfo.limits[type];
    if (limit === Infinity) return Infinity;
    return Math.max(0, limit - currentCount);
  };

  // Future: Load user tier from API/localStorage
  useEffect(() => {
    // TODO: Implement actual tier loading from user data
    // For now, we'll use localStorage as a simple demo
    const savedTier = localStorage.getItem('userTier') as UserTier;
    if (savedTier && TIER_CONFIGURATIONS[savedTier]) {
      setUserTier(savedTier);
    }
  }, []);

  // Development helper to change tier
  const setTierForTesting = (newTier: UserTier) => {
    setUserTier(newTier);
    localStorage.setItem('userTier', newTier);
  };

  return {
    // Current tier info
    userTier,
    tierInfo,
    loading,
    
    // Feature access
    hasFeature,
    hasReachedLimit,
    getRemainingCount,
    
    // Feature-specific shortcuts
    canUploadPhotos: hasFeature('materialPhotos'),
    canCreateUnlimitedMaterials: hasFeature('unlimitedMaterials'),
    hasAdvancedReports: hasFeature('advancedReports'),
    hasPrioritySupport: hasFeature('prioritySupport'),
    hasCustomBranding: hasFeature('customBranding'),
    
    // Development helpers
    setTierForTesting,
    
    // Upgrade helpers
    isPro: userTier === 'pro' || userTier === 'enterprise',
    isFree: userTier === 'free',
    isEnterprise: userTier === 'enterprise',
  };
}

/**
 * Simple tier badge component data
 */
export function getTierBadgeInfo(tier: UserTier) {
  switch (tier) {
    case 'free':
      return {
        label: 'Free',
        className: 'bg-gray-100 text-gray-800',
      };
    case 'pro':
      return {
        label: 'Pro',
        className: 'bg-blue-100 text-blue-800',
      };
    case 'enterprise':
      return {
        label: 'Enterprise',
        className: 'bg-purple-100 text-purple-800',
      };
    default:
      return {
        label: 'Free',
        className: 'bg-gray-100 text-gray-800',
      };
  }
}