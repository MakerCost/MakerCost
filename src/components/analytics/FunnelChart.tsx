'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

interface FunnelData {
  step: string;
  users: number;
  conversionRate: number;
}

interface FunnelChartProps {
  data: FunnelData[];
  title?: string;
}

export default function FunnelChart({ data, title = 'Conversion Funnel' }: FunnelChartProps) {
  const maxUsers = Math.max(...data.map(d => d.users));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>User conversion through the funnel</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((step, index) => {
            const width = (step.users / maxUsers) * 100;
            const isLast = index === data.length - 1;
            
            return (
              <div key={step.step} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{step.step}</span>
                  <div className="text-right">
                    <div className="text-sm font-semibold">{step.users.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">{step.conversionRate.toFixed(1)}%</div>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="w-full bg-gray-200 rounded-full h-8 flex items-center justify-center">
                    <div
                      className={`h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
                        index === 0
                          ? 'bg-blue-500'
                          : index === 1
                          ? 'bg-green-500'
                          : index === 2
                          ? 'bg-yellow-500'
                          : 'bg-purple-500'
                      }`}
                      style={{ width: `${width}%`, minWidth: '60px' }}
                    >
                      <span className="text-white text-xs font-medium">
                        {step.users.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                {!isLast && (
                  <div className="flex justify-center">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600">
            Overall conversion rate: {' '}
            <span className="font-semibold text-gray-900">
              {((data[data.length - 1]?.users / data[0]?.users) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}