'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface RealTimeData {
  activeUsers: number;
  pageViews: number;
  conversions: number;
  revenue: number;
}

export default function RealTimeMetrics() {
  const [realTimeData, setRealTimeData] = useState<RealTimeData>({
    activeUsers: 23,
    pageViews: 45,
    conversions: 2,
    revenue: 278
  });
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      if (isLive) {
        setRealTimeData(prev => ({
          activeUsers: prev.activeUsers + Math.floor(Math.random() * 5) - 2,
          pageViews: prev.pageViews + Math.floor(Math.random() * 8),
          conversions: prev.conversions + (Math.random() > 0.7 ? 1 : 0),
          revenue: prev.revenue + (Math.random() > 0.8 ? Math.floor(Math.random() * 50) : 0)
        }));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isLive]);

  return (
    <Card className="border-l-4 border-l-green-500">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            Real-Time Metrics
          </div>
          <button
            onClick={() => setIsLive(!isLive)}
            className={`text-xs px-2 py-1 rounded ${
              isLive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
            }`}
          >
            {isLive ? 'Live' : 'Paused'}
          </button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {Math.max(0, realTimeData.activeUsers)}
            </div>
            <div className="text-xs text-gray-600">Active Users</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {realTimeData.pageViews}
            </div>
            <div className="text-xs text-gray-600">Page Views</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {realTimeData.conversions}
            </div>
            <div className="text-xs text-gray-600">Conversions</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              ${Math.max(0, realTimeData.revenue)}
            </div>
            <div className="text-xs text-gray-600">Revenue</div>
          </div>
        </div>
        
        <div className="mt-3 text-xs text-gray-500 text-center">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
}