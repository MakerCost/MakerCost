'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

interface UserSegmentData {
  freeUsers: number;
  proUsers: number;
  trialUsers: number;
}

interface UserSegmentChartProps {
  data: UserSegmentData;
}

export default function UserSegmentChart({ data }: UserSegmentChartProps) {
  const total = data.freeUsers + data.proUsers + data.trialUsers;
  
  const segments = [
    { label: 'Free Users', value: data.freeUsers, color: 'bg-blue-500', percentage: (data.freeUsers / total) * 100 },
    { label: 'Pro Users', value: data.proUsers, color: 'bg-green-500', percentage: (data.proUsers / total) * 100 },
    { label: 'Trial Users', value: data.trialUsers, color: 'bg-yellow-500', percentage: (data.trialUsers / total) * 100 }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Segments</CardTitle>
        <CardDescription>Distribution of users by subscription tier</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Simple bar chart representation */}
          <div className="space-y-3">
            {segments.map((segment) => (
              <div key={segment.label} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{segment.label}</span>
                  <div className="text-right">
                    <div className="text-sm font-semibold">{segment.value.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">{segment.percentage.toFixed(1)}%</div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${segment.color} transition-all duration-500`}
                    style={{ width: `${segment.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">
              Total Users: {' '}
              <span className="font-semibold text-gray-900">{total.toLocaleString()}</span>
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Conversion Rate: {' '}
              <span className="font-semibold text-gray-900">
                {((data.proUsers / (data.freeUsers + data.proUsers)) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}