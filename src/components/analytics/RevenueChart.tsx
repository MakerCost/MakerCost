'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

interface RevenueChartProps {
  startDate: string;
  endDate: string;
}

export default function RevenueChart({ startDate, endDate }: RevenueChartProps) {
  // Mock data for demonstration
  const revenueData = [
    { period: 'Week 1', revenue: 2450, subscriptions: 15 },
    { period: 'Week 2', revenue: 3200, subscriptions: 21 },
    { period: 'Week 3', revenue: 2800, subscriptions: 18 },
    { period: 'Week 4', revenue: 3900, subscriptions: 25 },
  ];

  const maxRevenue = Math.max(...revenueData.map(d => d.revenue));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Trend</CardTitle>
        <CardDescription>Revenue and subscription growth over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Simple bar chart */}
          <div className="space-y-4">
            {revenueData.map((data) => {
              const heightPercentage = (data.revenue / maxRevenue) * 100;
              
              return (
                <div key={data.period} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">{data.period}</span>
                    <div className="text-right">
                      <div className="text-sm font-semibold">
                        ${data.revenue.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {data.subscriptions} subs
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="w-full bg-gray-200 rounded-full h-8 flex items-end">
                      <div
                        className="bg-green-500 rounded-full h-full flex items-center justify-center transition-all duration-500"
                        style={{ 
                          width: `${heightPercentage}%`, 
                          minWidth: '60px' 
                        }}
                      >
                        <span className="text-white text-xs font-medium">
                          ${data.revenue.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-2 gap-4 mt-6 p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="text-sm text-gray-600">Total Revenue</div>
              <div className="text-lg font-semibold text-green-600">
                ${revenueData.reduce((sum, d) => sum + d.revenue, 0).toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Total Subscriptions</div>
              <div className="text-lg font-semibold text-blue-600">
                {revenueData.reduce((sum, d) => sum + d.subscriptions, 0)}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}