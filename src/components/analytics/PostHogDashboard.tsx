'use client';

import { useState, useEffect } from 'react';
import { usePostHog } from '@/contexts/PostHogProvider';
import { Card, CardContent } from '@/components/ui/Card';

interface PostHogDashboardProps {
  startDate?: string;
  endDate?: string;
}

export default function PostHogDashboard({ startDate, endDate }: PostHogDashboardProps = {}) {
  const { posthog, isLoaded } = usePostHog();
  const [insights, setInsights] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'sessions' | 'heatmaps' | 'surveys' | 'experiments'>('overview');

  useEffect(() => {
    if (isLoaded && posthog) {
      // Simulate loading PostHog insights
      // In a real implementation, you'd use PostHog's API to fetch this data
      setLoading(true);
      
      setTimeout(() => {
        setInsights({
          totalSessions: Math.floor(Math.random() * 1000) + 500,
          activeUsers: Math.floor(Math.random() * 200) + 100,
          averageSessionDuration: Math.floor(Math.random() * 300) + 120,
          bounceRate: (Math.random() * 30 + 20).toFixed(1),
          topPages: [
            { page: '/', sessions: Math.floor(Math.random() * 300) + 200 },
            { page: '/pricing', sessions: Math.floor(Math.random() * 150) + 75 },
            { page: '/signup', sessions: Math.floor(Math.random() * 100) + 50 },
          ],
          topFeatures: [
            { feature: 'Demo Data Load', usage: Math.floor(Math.random() * 200) + 100 },
            { feature: 'Material Add', usage: Math.floor(Math.random() * 150) + 75 },
            { feature: 'Quote Generate', usage: Math.floor(Math.random() * 100) + 50 },
          ],
          userSentiment: {
            positive: Math.floor(Math.random() * 40) + 50,
            neutral: Math.floor(Math.random() * 30) + 20,
            negative: Math.floor(Math.random() * 20) + 5,
          },
        });
        setLoading(false);
      }, 1000);
    }
  }, [isLoaded, posthog, startDate, endDate]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading PostHog...</p>
        </div>
      </div>
    );
  }

  if (!posthog) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">PostHog Not Available</h3>
            <p className="mt-1 text-sm text-yellow-700">
              PostHog is not initialized. Please check your NEXT_PUBLIC_POSTHOG_KEY configuration.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'sessions', label: 'Sessions', icon: '🎥' },
    { id: 'heatmaps', label: 'Heatmaps', icon: '🔥' },
    { id: 'surveys', label: 'Surveys', icon: '📝' },
    { id: 'experiments', label: 'Experiments', icon: '🧪' },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-2">🔍 Product Analytics Dashboard</h2>
        <p className="text-purple-100">
          Deep insights into user behavior, feature usage, and product optimization opportunities
        </p>
        <div className="mt-4 text-sm text-purple-100">
          Period: {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-3"></div>
                <div className="h-8 bg-gray-300 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {activeTab === 'overview' && (
            <OverviewTab insights={insights} />
          )}
          {activeTab === 'sessions' && (
            <SessionsTab />
          )}
          {activeTab === 'heatmaps' && (
            <HeatmapsTab />
          )}
          {activeTab === 'surveys' && (
            <SurveysTab insights={insights} />
          )}
          {activeTab === 'experiments' && (
            <ExperimentsTab />
          )}
        </>
      )}
    </div>
  );
}

function OverviewTab({ insights }: { insights: Record<string, unknown> | null }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Key Metrics */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Total Sessions</h3>
          <p className="text-3xl font-bold text-purple-600">{insights?.totalSessions?.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">Recorded user sessions</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Active Users</h3>
          <p className="text-3xl font-bold text-blue-600">{insights?.activeUsers?.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">Unique active users</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Avg Session</h3>
          <p className="text-3xl font-bold text-green-600">{Math.floor(insights?.averageSessionDuration / 60)}m {insights?.averageSessionDuration % 60}s</p>
          <p className="text-sm text-gray-500 mt-1">Average session duration</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Bounce Rate</h3>
          <p className="text-3xl font-bold text-orange-600">{insights?.bounceRate}%</p>
          <p className="text-sm text-gray-500 mt-1">Single-page sessions</p>
        </CardContent>
      </Card>

      {/* Top Pages */}
      <Card className="md:col-span-2">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Pages by Sessions</h3>
          <div className="space-y-3">
            {(insights?.topPages as Array<{page?: string, sessions?: number}>)?.map((page, index: number) => (
              <div key={page.page} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-600 w-6">#{index + 1}</span>
                  <span className="text-sm text-gray-900 ml-2">{page.page}</span>
                </div>
                <div className="text-sm font-medium text-purple-600">
                  {page.sessions.toLocaleString()} sessions
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Features */}
      <Card className="md:col-span-2">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Feature Usage</h3>
          <div className="space-y-3">
            {(insights?.topFeatures as Array<{feature?: string, usage?: number}>)?.map((feature, index: number) => (
              <div key={feature.feature} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-600 w-6">#{index + 1}</span>
                  <span className="text-sm text-gray-900 ml-2">{feature.feature}</span>
                </div>
                <div className="text-sm font-medium text-blue-600">
                  {feature.usage.toLocaleString()} uses
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SessionsTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">📹 Session Recordings</h3>
          <p className="text-gray-600 mb-4">
            Watch real user sessions to understand how people interact with your calculator.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">🎯 How to Access Session Recordings:</h4>
            <ol className="list-decimal list-inside text-sm text-blue-800 space-y-1">
              <li>Go to your <a href="https://app.posthog.com" target="_blank" rel="noopener noreferrer" className="underline">PostHog Dashboard</a></li>
              <li>Navigate to &ldquo;Session Recordings&rdquo; in the left sidebar</li>
              <li>Filter by date range, user properties, or events</li>
              <li>Click on any recording to watch user interactions</li>
            </ol>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-900 mb-2">✅ What You&rsquo;ll See:</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Mouse movements and clicks</li>
                <li>• Form interactions and typing</li>
                <li>• Calculator usage patterns</li>
                <li>• Navigation behavior</li>
              </ul>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="font-medium text-purple-900 mb-2">🔒 Privacy Controls:</h4>
              <ul className="text-sm text-purple-800 space-y-1">
                <li>• Passwords are masked</li>
                <li>• 50% sampling rate</li>
                <li>• Consent-based recording</li>
                <li>• GDPR compliant</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function HeatmapsTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">🔥 Heatmaps & Click Analysis</h3>
          <p className="text-gray-600 mb-4">
            See where users click, scroll, and spend time on your pages.
          </p>
          
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h4 className="font-medium text-orange-900 mb-2">🎯 How to Access Heatmaps:</h4>
            <ol className="list-decimal list-inside text-sm text-orange-800 space-y-1">
              <li>Go to your <a href="https://app.posthog.com" target="_blank" rel="noopener noreferrer" className="underline">PostHog Dashboard</a></li>
              <li>Navigate to &ldquo;Web Analytics&rdquo; → &ldquo;Heatmaps&rdquo;</li>
              <li>Enter your website URL (e.g., makercost.com)</li>
              <li>View click heatmaps, scroll maps, and rage clicks</li>
            </ol>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-medium text-red-900 mb-2">🖱️ Click Maps</h4>
              <p className="text-sm text-red-800">See where users click most frequently</p>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">📜 Scroll Maps</h4>
              <p className="text-sm text-blue-800">Understand how far users scroll</p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-900 mb-2">😤 Rage Clicks</h4>
              <p className="text-sm text-yellow-800">Identify frustrating UI elements</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SurveysTab({ insights }: { insights: Record<string, unknown> | null }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">📝 User Surveys & Feedback</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {insights?.userSentiment?.positive}%
              </div>
              <div className="text-sm text-green-800">Positive Feedback</div>
            </div>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-600">
                {insights?.userSentiment?.neutral}%
              </div>
              <div className="text-sm text-gray-800">Neutral Feedback</div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {insights?.userSentiment?.negative}%
              </div>
              <div className="text-sm text-red-800">Needs Improvement</div>
            </div>
          </div>

          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <h4 className="font-medium text-indigo-900 mb-2">📊 Active Surveys:</h4>
            <div className="space-y-2 text-sm text-indigo-800">
              <div>• Calculator Feedback Survey (triggers after 30s on main page)</div>
              <div>• NPS Survey (triggers after quote completion)</div>
              <div>• Feature Usability Survey (context-based)</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ExperimentsTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">🧪 A/B Tests & Experiments</h3>
          <p className="text-gray-600 mb-4">
            Feature flags and experiments for safe rollouts and optimization.
          </p>
          
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-medium text-purple-900 mb-2">🚀 Available Experiments:</h4>
            <div className="space-y-2 text-sm text-purple-800">
              <div>• <strong>experimental_calculator_ui:</strong> Test new calculator layout</div>
              <div>• <strong>enhanced_onboarding:</strong> Improved user onboarding flow</div>
              <div>• <strong>smart_tooltips:</strong> Context-aware help system</div>
            </div>
          </div>

          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">📈 How to Manage Experiments:</h4>
            <ol className="list-decimal list-inside text-sm text-blue-800 space-y-1">
              <li>Go to your <a href="https://app.posthog.com" target="_blank" rel="noopener noreferrer" className="underline">PostHog Dashboard</a></li>
              <li>Navigate to &ldquo;Feature Flags&rdquo; in the left sidebar</li>
              <li>Create or edit feature flags for experiments</li>
              <li>Set rollout percentages and user targeting</li>
              <li>Monitor experiment results in &ldquo;Experiments&rdquo; section</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}