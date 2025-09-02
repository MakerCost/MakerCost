'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

interface TimelineDataPoint {
  date: string;
  totalUsers: number;
  newUsers: number;
  returningUsers: number;
  sessions: number;
}

interface UserTimelineChartProps {
  data: TimelineDataPoint[];
  loading?: boolean;
  dateRange: string;
}

export default function UserTimelineChart({ data, loading = false, dateRange }: UserTimelineChartProps) {
  const [activeMetric, setActiveMetric] = useState<'users' | 'sessions'>('users');
  const [viewType, setViewType] = useState<'line' | 'bar'>('line');

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-5 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-200 rounded animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  const maxTotalUsers = Math.max(...data.map(d => d.totalUsers), 1);
  const maxNewUsers = Math.max(...data.map(d => d.newUsers), 1);
  const maxReturningUsers = Math.max(...data.map(d => d.returningUsers), 1);
  const maxSessions = Math.max(...data.map(d => d.sessions), 1);

  const totalUsersGrowth = data.length >= 2 ? 
    ((data[data.length - 1].totalUsers - data[data.length - 2].totalUsers) / Math.max(data[data.length - 2].totalUsers, 1)) * 100 : 0;

  const totalSessionsGrowth = data.length >= 2 ?
    ((data[data.length - 1].sessions - data[data.length - 2].sessions) / Math.max(data[data.length - 2].sessions, 1)) * 100 : 0;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const renderLineChart = () => (
    <div className="relative h-64">
      <svg width="100%" height="100%" className="overflow-visible">
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map(percent => (
          <g key={percent}>
            <line
              x1="40"
              y1={`${percent * 2}%`}
              x2="95%"
              y2={`${percent * 2}%`}
              stroke="#f3f4f6"
              strokeWidth="1"
            />
            <text
              x="35"
              y={`${percent * 2 + 1}%`}
              textAnchor="end"
              className="text-xs fill-gray-500"
            >
              {activeMetric === 'users' 
                ? Math.round((100 - percent) * maxTotalUsers / 100) 
                : Math.round((100 - percent) * maxSessions / 100)
              }
            </text>
          </g>
        ))}

        {/* Data lines */}
        {data.length > 1 && (
          <>
            {/* Total Users/Sessions line */}
            <polyline
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              points={data.map((point, index) => {
                const x = 40 + (index * (90 - 40) / Math.max(data.length - 1, 1));
                const value = activeMetric === 'users' ? point.totalUsers : point.sessions;
                const maxValue = activeMetric === 'users' ? maxTotalUsers : maxSessions;
                const y = 200 - (value / Math.max(maxValue, 1)) * 200;
                return `${x}%,${y}`;
              }).join(' ')}
            />

            {/* New Users line (only when showing users) */}
            {activeMetric === 'users' && (
              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                strokeDasharray="5,5"
                points={data.map((point, index) => {
                  const x = 40 + (index * (90 - 40) / Math.max(data.length - 1, 1));
                  const y = 200 - (point.newUsers / Math.max(maxTotalUsers, 1)) * 200;
                  return `${x}%,${y}`;
                }).join(' ')}
              />
            )}

            {/* Data points */}
            {data.map((point, index) => {
              const x = 40 + (index * (90 - 40) / Math.max(data.length - 1, 1));
              const value = activeMetric === 'users' ? point.totalUsers : point.sessions;
              const maxValue = activeMetric === 'users' ? maxTotalUsers : maxSessions;
              const y = 200 - (value / Math.max(maxValue, 1)) * 200;
              
              return (
                <g key={index}>
                  <circle
                    cx={`${x}%`}
                    cy={y}
                    r="4"
                    fill="#3b82f6"
                    className="hover:r-6 transition-all cursor-pointer"
                  />
                  <text
                    x={`${x}%`}
                    y="220"
                    textAnchor="middle"
                    className="text-xs fill-gray-600"
                  >
                    {formatDate(point.date)}
                  </text>
                </g>
              );
            })}
          </>
        )}
      </svg>

      {/* Empty state */}
      {data.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              📈
            </div>
            <p className="text-sm">No timeline data available</p>
            <p className="text-xs mt-1">Data will appear as users visit your site</p>
          </div>
        </div>
      )}
    </div>
  );

  const renderBarChart = () => (
    <div className="relative h-64">
      <div className="flex items-end justify-between h-full gap-2 px-4 pb-8">
        {data.map((point, index) => {
          const value = activeMetric === 'users' ? point.totalUsers : point.sessions;
          const maxValue = activeMetric === 'users' ? maxTotalUsers : maxSessions;
          const height = maxValue > 0 ? (value / maxValue) * 200 : 0;
          
          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className="bg-blue-500 rounded-t hover:bg-blue-600 transition-colors cursor-pointer min-w-8"
                style={{ height: `${height}px` }}
                title={`${formatDate(point.date)}: ${value.toLocaleString()}`}
              />
              <span className="text-xs text-gray-600 mt-2 transform -rotate-45 origin-left">
                {formatDate(point.date)}
              </span>
            </div>
          );
        })}
      </div>

      {data.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              📊
            </div>
            <p className="text-sm">No timeline data available</p>
            <p className="text-xs mt-1">Data will appear as users visit your site</p>
          </div>
        </div>
      )}
    </div>
  );

  const renderLegend = () => (
    <div className="flex items-center justify-center gap-6 mt-4 text-sm">
      <div className="flex items-center gap-2">
        <div className="w-3 h-0.5 bg-blue-500 rounded" />
        <span className="text-gray-600">
          {activeMetric === 'users' ? 'Total Users' : 'Sessions'}
        </span>
      </div>
      {activeMetric === 'users' && (
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-green-500 rounded border-dashed border border-green-500" />
          <span className="text-gray-600">New Users</span>
        </div>
      )}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>User Activity Timeline</CardTitle>
            <CardDescription>
              {activeMetric === 'users' ? 'User' : 'Session'} trends over {dateRange}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {/* Metric toggle */}
            <div className="flex gap-1 bg-gray-100 rounded-md p-1">
              <button
                onClick={() => setActiveMetric('users')}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  activeMetric === 'users'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Users
              </button>
              <button
                onClick={() => setActiveMetric('sessions')}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  activeMetric === 'sessions'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Sessions
              </button>
            </div>
            
            {/* View type toggle */}
            <div className="flex gap-1 bg-gray-100 rounded-md p-1">
              <button
                onClick={() => setViewType('line')}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  viewType === 'line'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Line
              </button>
              <button
                onClick={() => setViewType('bar')}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  viewType === 'bar'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Bar
              </button>
            </div>
          </div>
        </div>

        {/* Growth indicators */}
        {data.length >= 2 && (
          <div className="flex gap-4 mt-2">
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-600">Users:</span>
              <span className={`text-sm font-medium ${totalUsersGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalUsersGrowth >= 0 ? '+' : ''}{totalUsersGrowth.toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-600">Sessions:</span>
              <span className={`text-sm font-medium ${totalSessionsGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalSessionsGrowth >= 0 ? '+' : ''}{totalSessionsGrowth.toFixed(1)}%
              </span>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {viewType === 'line' ? renderLineChart() : renderBarChart()}
        {data.length > 0 && renderLegend()}
      </CardContent>
    </Card>
  );
}