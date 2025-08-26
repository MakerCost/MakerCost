'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface MetricCardProps {
  title: string;
  value: number;
  change?: number;
  icon: string;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  format?: 'number' | 'currency' | 'percentage';
}

export default function MetricCard({ 
  title, 
  value, 
  change, 
  icon, 
  color, 
  format = 'number' 
}: MetricCardProps) {
  const formatValue = (val: number, fmt: string) => {
    switch (fmt) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(val);
      case 'percentage':
        return `${val.toFixed(1)}%`;
      default:
        return val.toLocaleString();
    }
  };

  const getColorClasses = (colorName: string) => {
    const colors = {
      blue: {
        bg: 'bg-blue-50',
        icon: 'text-blue-600',
        border: 'border-blue-200'
      },
      green: {
        bg: 'bg-green-50',
        icon: 'text-green-600',
        border: 'border-green-200'
      },
      purple: {
        bg: 'bg-purple-50',
        icon: 'text-purple-600',
        border: 'border-purple-200'
      },
      orange: {
        bg: 'bg-orange-50',
        icon: 'text-orange-600',
        border: 'border-orange-200'
      },
      red: {
        bg: 'bg-red-50',
        icon: 'text-red-600',
        border: 'border-red-200'
      }
    };
    return colors[colorName as keyof typeof colors];
  };

  const colorClasses = getColorClasses(color);
  const isPositiveChange = change && change > 0;
  const isNegativeChange = change && change < 0;

  return (
    <Card className={`${colorClasses.border} border-l-4`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        <div className={`text-2xl ${colorClasses.bg} p-2 rounded-lg`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className={`text-2xl font-bold ${colorClasses.icon}`}>
            {formatValue(value, format)}
          </div>
          
          {change !== undefined && (
            <div className="flex items-center text-sm">
              <span
                className={`flex items-center ${
                  isPositiveChange
                    ? 'text-green-600'
                    : isNegativeChange
                    ? 'text-red-600'
                    : 'text-gray-500'
                }`}
              >
                {isPositiveChange && (
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                )}
                {isNegativeChange && (
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                )}
                {Math.abs(change).toFixed(1)}%
              </span>
              <span className="text-gray-500 ml-1">vs last period</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}