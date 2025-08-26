'use client';

import { ReactNode } from 'react';
import { useFeatureAccess, useCurrentTier, useSubscriptionStatus } from '@/store/subscription-store';
import { TierLimits } from '@/types/payment';
import { trackEvent } from '@/lib/analytics';
import { trackPostHogEvent } from '@/lib/posthog-analytics';
import { trackFeatureBlocked, trackUpgradePromptShown } from '@/lib/analytics/events';
import { featureDiscoveryFunnel } from '@/lib/analytics/funnels';

interface FeatureGateProps {
  feature: keyof TierLimits;
  children: ReactNode;
  fallback?: ReactNode;
  showUpgradePrompt?: boolean;
  upgradeMessage?: string;
  className?: string;
}

export default function FeatureGate({
  feature,
  children,
  fallback,
  showUpgradePrompt = true,
  upgradeMessage,
  className = '',
}: FeatureGateProps) {
  const hasAccess = useFeatureAccess(feature);
  const currentTier = useCurrentTier();
  const { isActive } = useSubscriptionStatus();

  const handleUpgradeClick = () => {
    // Track upgrade prompt interaction
    trackEvent('upgrade_prompt_clicked', {
      feature: feature,
      current_tier: currentTier,
      source: 'feature_gate',
    });

    trackPostHogEvent('upgrade_prompt_clicked', {
      feature: feature,
      current_tier: currentTier,
      source: 'feature_gate',
    });

    // Track with GA4 feature discovery funnel
    featureDiscoveryFunnel.clickUpgradePrompt(feature, 'feature_gate');

    // Redirect to pricing page
    window.location.href = '/pricing';
  };

  if (hasAccess && (isActive || currentTier === 'free')) {
    return <>{children}</>;
  }

  // Track feature blocking and show upgrade prompt
  if (!hasAccess) {
    // Track feature blocked
    trackFeatureBlocked({
      feature_name: feature,
      block_reason: currentTier === 'free' ? 'tier_limit' : 'subscription_required',
      user_tier: currentTier,
      upgrade_prompt_shown: showUpgradePrompt
    });

    // Track with GA4 feature discovery funnel
    featureDiscoveryFunnel.discoverFeature(feature, 'feature_gate', currentTier);
    featureDiscoveryFunnel.attemptUse(feature, currentTier, true);
    
    if (showUpgradePrompt) {
      // Track upgrade prompt shown
      trackUpgradePromptShown({
        feature_name: feature,
        prompt_location: 'feature_gate',
        user_tier: currentTier,
        trigger_reason: 'feature_access_denied'
      });

      featureDiscoveryFunnel.showUpgradePrompt(feature, 'feature_gate', currentTier);
    }
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (!showUpgradePrompt) {
    return null;
  }

  const defaultMessage = getDefaultUpgradeMessage(feature);
  const message = upgradeMessage || defaultMessage;

  return (
    <div className={`bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 text-center ${className}`}>
      <div className="mb-4">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Pro Feature</h3>
        <p className="text-gray-600 mb-4">{message}</p>
      </div>
      
      <div className="space-y-3">
        <button
          onClick={handleUpgradeClick}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          Upgrade to Pro
        </button>
        
        <div className="text-sm text-gray-500">
          ✨ Unlock all features with Pro
        </div>
      </div>
    </div>
  );
}

function getDefaultUpgradeMessage(feature: keyof TierLimits): string {
  const featureMessages: Record<keyof TierLimits, string> = {
    maxProjects: 'Create unlimited projects and scale your business without limits.',
    maxMaterials: 'Add unlimited materials to your inventory and never run out of options.',
    canUploadImages: 'Upload photos of your materials for better organization and presentations.',
    canExportPdf: 'Export professional PDF quotes to share with your customers.',
    canExportExcel: 'Export detailed Excel reports for advanced analysis and record keeping.',
    canUseAdvancedReports: 'Access advanced reporting and analytics to optimize your business.',
    canUseWhatIfAnalysis: 'Use what-if analysis tools to explore different pricing scenarios.',
    hasCloudSync: 'Sync your data across all devices and never lose your work.',
    hasPrioritySupport: 'Get priority customer support with faster response times.',
  };

  return featureMessages[feature] || 'Upgrade to Pro to unlock this premium feature.';
}

// Specific feature gate components for common use cases
export function ProjectLimitGate({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <FeatureGate
      feature="maxProjects"
      className={className}
      upgradeMessage="You've reached the free plan limit of 5 projects. Upgrade to Pro for unlimited projects."
    >
      {children}
    </FeatureGate>
  );
}

export function MaterialLimitGate({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <FeatureGate
      feature="maxMaterials"
      className={className}
      upgradeMessage="You've reached the free plan limit of 50 materials. Upgrade to Pro for unlimited materials."
    >
      {children}
    </FeatureGate>
  );
}

export function ImageUploadGate({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <FeatureGate
      feature="canUploadImages"
      className={className}
      upgradeMessage="Material photo uploads are a Pro feature. Upgrade to organize your materials with images."
    >
      {children}
    </FeatureGate>
  );
}

export function ExportGate({ 
  children, 
  type = 'pdf',
  className 
}: { 
  children: ReactNode; 
  type?: 'pdf' | 'excel';
  className?: string;
}) {
  const feature = type === 'pdf' ? 'canExportPdf' : 'canExportExcel';
  const message = type === 'pdf' 
    ? 'PDF exports are a Pro feature. Upgrade to create professional quotes for your customers.'
    : 'Excel exports are a Pro feature. Upgrade to export detailed reports for analysis.';

  return (
    <FeatureGate
      feature={feature}
      className={className}
      upgradeMessage={message}
    >
      {children}
    </FeatureGate>
  );
}