'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

interface FeatureUsageData {
  feature: string;
  usage: number;
  tier: 'free' | 'pro';
}

interface FeatureUsageChartProps {
  data: FeatureUsageData[];
}

export default function FeatureUsageChart({ data }: FeatureUsageChartProps) {
  const maxUsage = Math.max(...data.map(d => d.usage));
  
  const freeFeatures = data.filter(d => d.tier === 'free');
  const proFeatures = data.filter(d => d.tier === 'pro');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Feature Usage Analysis</CardTitle>
        <CardDescription>Most used features by subscription tier</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Free Tier Features */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
              Free Tier Features
            </h4>
            <div className="space-y-3">
              {freeFeatures.map((feature) => {
                const width = (feature.usage / maxUsage) * 100;
                
                return (
                  <div key={`free-${feature.feature}`} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">{feature.feature}</span>
                      <span className="text-sm font-medium text-gray-900">
                        {feature.usage.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pro Tier Features */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
              Pro Tier Features
            </h4>
            <div className="space-y-3">
              {proFeatures.map((feature) => {
                const width = (feature.usage / maxUsage) * 100;
                
                return (
                  <div key={`pro-${feature.feature}`} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">{feature.feature}</span>
                      <span className="text-sm font-medium text-gray-900">
                        {feature.usage.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-600">Free Features Usage</div>
                <div className="font-semibold">
                  {freeFeatures.reduce((sum, f) => sum + f.usage, 0).toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-gray-600">Pro Features Usage</div>
                <div className="font-semibold">
                  {proFeatures.reduce((sum, f) => sum + f.usage, 0).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}