'use client';

import { ReactNode } from 'react';
import { useFeatureFlag } from '@/contexts/PostHogProvider';
import { trackFeatureFlagExposure, trackExperimentExposure } from '@/lib/posthog-product-analytics';

interface FeatureFlagProps {
  flag: string;
  children: ReactNode;
  fallback?: ReactNode;
  onExposure?: (flagValue: boolean) => void;
}

export default function FeatureFlag({ 
  flag, 
  children, 
  fallback = null, 
  onExposure 
}: FeatureFlagProps) {
  const flagValue = useFeatureFlag(flag);

  // Track feature flag exposure
  if (flagValue !== undefined) {
    trackFeatureFlagExposure(flag, flagValue);
    onExposure?.(flagValue);
  }

  if (flagValue === undefined) {
    // Still loading
    return <>{fallback}</>;
  }

  return flagValue ? <>{children}</> : <>{fallback}</>;
}

// Specific feature flag components for common experiments
export function ExperimentalCalculator({ children, fallback }: { 
  children: ReactNode; 
  fallback?: ReactNode 
}) {
  return (
    <FeatureFlag 
      flag="experimental_calculator_ui" 
      fallback={fallback}
      onExposure={(enabled) => {
        trackExperimentExposure('calculator_ui_experiment', enabled ? 'experimental' : 'control');
      }}
    >
      {children}
    </FeatureFlag>
  );
}

export function EnhancedOnboarding({ children, fallback }: { 
  children: ReactNode; 
  fallback?: ReactNode 
}) {
  return (
    <FeatureFlag 
      flag="enhanced_onboarding" 
      fallback={fallback}
      onExposure={(enabled) => {
        trackExperimentExposure('onboarding_experiment', enabled ? 'enhanced' : 'standard');
      }}
    >
      {children}
    </FeatureFlag>
  );
}

export function SmartTooltips({ children, fallback }: { 
  children: ReactNode; 
  fallback?: ReactNode 
}) {
  return (
    <FeatureFlag 
      flag="smart_tooltips" 
      fallback={fallback}
      onExposure={(enabled) => {
        trackExperimentExposure('tooltips_experiment', enabled ? 'smart' : 'standard');
      }}
    >
      {children}
    </FeatureFlag>
  );
}