'use client';

import { useUsage, useRemainingUsage, useHasReachedLimit, useTierLimits } from '@/store/subscription-store';
import { trackEvent } from '@/lib/analytics';
import { trackPostHogEvent } from '@/lib/posthog-analytics';

interface UsageIndicatorProps {
  type: 'projects' | 'materials';
  className?: string;
  showUpgradeButton?: boolean;
}

export default function UsageIndicator({ 
  type, 
  className = '',
  showUpgradeButton = true 
}: UsageIndicatorProps) {
  const usage = useUsage();
  const tierLimits = useTierLimits();
  const remainingUsage = useRemainingUsage(type);
  const hasReachedLimit = useHasReachedLimit(type);

  const currentCount = type === 'projects' ? usage.projectCount : usage.materialCount;
  const maxCount = type === 'projects' ? tierLimits.maxProjects : tierLimits.maxMaterials;
  
  // If unlimited, don't show indicator
  if (maxCount === -1) {
    return null;
  }

  const percentage = Math.min((currentCount / maxCount) * 100, 100);
  const isNearLimit = percentage >= 80;
  const isAtLimit = hasReachedLimit;

  const handleUpgradeClick = () => {
    trackEvent('upgrade_from_usage_indicator', {
      usage_type: type,
      current_count: currentCount,
      max_count: maxCount,
      percentage: percentage,
    });

    trackPostHogEvent('upgrade_from_usage_indicator', {
      usage_type: type,
      current_count: currentCount,
      max_count: maxCount,
      percentage: percentage,
    });

    window.location.href = '/pricing';
  };

  const getBarColor = () => {
    if (isAtLimit) return 'bg-red-500';
    if (isNearLimit) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getTextColor = () => {
    if (isAtLimit) return 'text-red-700';
    if (isNearLimit) return 'text-yellow-700';
    return 'text-gray-700';
  };

  const getMessage = () => {
    if (isAtLimit) {
      return `You've reached your ${type} limit. Upgrade to Pro for unlimited ${type}.`;
    }
    if (isNearLimit) {
      return `You're approaching your ${type} limit. ${remainingUsage} remaining.`;
    }
    return `${currentCount} of ${maxCount} ${type} used. ${remainingUsage} remaining.`;
  };

  return (
    <div className={`bg-white border rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-900">
          {type === 'projects' ? 'Projects' : 'Materials'} Usage
        </h3>
        <span className={`text-sm font-medium ${getTextColor()}`}>
          {currentCount}/{maxCount === -1 ? '∞' : maxCount}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${getBarColor()}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>

      {/* Usage message */}
      <p className={`text-xs mb-3 ${getTextColor()}`}>
        {getMessage()}
      </p>

      {/* Upgrade button */}
      {(isAtLimit || isNearLimit) && showUpgradeButton && (
        <button
          onClick={handleUpgradeClick}
          className={`w-full text-xs py-2 px-3 rounded-md font-medium transition-colors ${
            isAtLimit 
              ? 'bg-red-100 text-red-700 hover:bg-red-200' 
              : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
          }`}
        >
          {isAtLimit ? 'Upgrade Required' : 'Upgrade to Pro'}
        </button>
      )}

      {/* Pro indicator for unlimited plans */}
      {maxCount === -1 && (
        <div className="flex items-center justify-center py-2">
          <div className="flex items-center text-xs text-green-600">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Unlimited (Pro)
          </div>
        </div>
      )}
    </div>
  );
}

// Combined usage overview component
export function UsageOverview({ className = '' }: { className?: string }) {
  const usage = useUsage();
  const tierLimits = useTierLimits();
  
  const projectsReachedLimit = useHasReachedLimit('projects');
  const materialsReachedLimit = useHasReachedLimit('materials');
  const hasAnyLimitReached = projectsReachedLimit || materialsReachedLimit;

  const handleUpgradeClick = () => {
    trackEvent('upgrade_from_usage_overview', {
      project_count: usage.projectCount,
      material_count: usage.materialCount,
      projects_at_limit: projectsReachedLimit,
      materials_at_limit: materialsReachedLimit,
    });

    trackPostHogEvent('upgrade_from_usage_overview', {
      project_count: usage.projectCount,
      material_count: usage.materialCount,
      projects_at_limit: projectsReachedLimit,
      materials_at_limit: materialsReachedLimit,
    });

    window.location.href = '/pricing';
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Usage Overview</h2>
        {tierLimits.maxProjects === -1 && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Pro Plan
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <UsageIndicator type="projects" showUpgradeButton={false} />
        <UsageIndicator type="materials" showUpgradeButton={false} />
      </div>

      {hasAnyLimitReached && tierLimits.maxProjects !== -1 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-red-800">
                Usage Limit Reached
              </h3>
              <p className="mt-1 text-sm text-red-700">
                You&rsquo;ve reached your free plan limits. Upgrade to Pro for unlimited access to all features.
              </p>
              <button
                onClick={handleUpgradeClick}
                className="mt-3 bg-red-600 text-white text-sm font-medium py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
              >
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}