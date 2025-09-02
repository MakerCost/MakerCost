'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

interface LocationData {
  id: string;
  name: string;
  country?: string;
  users: number;
  newUsers: number;
  sessions: number;
  bounceRate: number;
  averageSessionDuration: number;
  pageViewsPerSession: number;
  conversionRate: number;
}

interface TopLocationsTableProps {
  data: LocationData[];
  loading?: boolean;
  type: 'countries' | 'cities';
  totalUsers: number;
}

type SortField = keyof Omit<LocationData, 'id' | 'name' | 'country'>;
type SortDirection = 'asc' | 'desc';

export default function TopLocationsTable({ 
  data, 
  loading = false, 
  type,
  totalUsers 
}: TopLocationsTableProps) {
  const [sortField, setSortField] = useState<SortField>('users');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [showAll, setShowAll] = useState(false);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-5 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="grid grid-cols-7 gap-4">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    const direction = sortDirection === 'asc' ? 1 : -1;
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return (aValue - bValue) * direction;
    }
    return 0;
  });

  const displayData = showAll ? sortedData : sortedData.slice(0, 10);

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds.toFixed(0)}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds.toFixed(0)}s`;
  };

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 text-left font-medium text-gray-700 hover:text-gray-900 transition-colors"
    >
      {children}
      <span className="text-xs">
        {sortField === field ? (
          sortDirection === 'asc' ? '↑' : '↓'
        ) : (
          '↕'
        )}
      </span>
    </button>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Top {type === 'countries' ? 'Countries' : 'Cities'}
        </CardTitle>
        <CardDescription>
          Performance metrics by {type === 'countries' ? 'country' : 'city'} - click column headers to sort
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <>
            {/* Table Header */}
            <div className="grid grid-cols-7 gap-4 pb-3 border-b text-xs font-medium text-gray-500 uppercase tracking-wide">
              <div>{type === 'countries' ? 'Country' : 'City'}</div>
              <div className="text-right">
                <SortButton field="users">Users</SortButton>
              </div>
              <div className="text-right">
                <SortButton field="sessions">Sessions</SortButton>
              </div>
              <div className="text-right">
                <SortButton field="bounceRate">Bounce Rate</SortButton>
              </div>
              <div className="text-right">
                <SortButton field="averageSessionDuration">Avg Session</SortButton>
              </div>
              <div className="text-right">
                <SortButton field="pageViewsPerSession">Pages/Session</SortButton>
              </div>
              <div className="text-right">
                <SortButton field="conversionRate">Conv Rate</SortButton>
              </div>
            </div>

            {/* Table Body */}
            <div className="space-y-2 mt-3">
              {displayData.map((location, index) => (
                <div
                  key={location.id}
                  className="grid grid-cols-7 gap-4 py-3 hover:bg-gray-50 rounded-md transition-colors"
                >
                  {/* Location Name */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 min-w-6">
                      #{(showAll ? sortedData : sortedData.slice(0, 10)).indexOf(location) + 1}
                    </span>
                    <div>
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {location.name}
                      </div>
                      {type === 'cities' && location.country && (
                        <div className="text-xs text-gray-500 truncate">
                          {location.country}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Users */}
                  <div className="text-right">
                    <div className="text-sm font-medium">{location.users.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">
                      {totalUsers > 0 ? ((location.users / totalUsers) * 100).toFixed(1) : 0}%
                    </div>
                  </div>

                  {/* Sessions */}
                  <div className="text-right">
                    <div className="text-sm">{location.sessions.toLocaleString()}</div>
                    <div className="text-xs text-green-600">
                      +{location.newUsers.toLocaleString()} new
                    </div>
                  </div>

                  {/* Bounce Rate */}
                  <div className="text-right">
                    <div className={`text-sm ${
                      location.bounceRate > 70 ? 'text-red-600' : 
                      location.bounceRate > 50 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {location.bounceRate.toFixed(1)}%
                    </div>
                  </div>

                  {/* Average Session Duration */}
                  <div className="text-right">
                    <div className="text-sm">{formatDuration(location.averageSessionDuration)}</div>
                  </div>

                  {/* Pages per Session */}
                  <div className="text-right">
                    <div className="text-sm">{location.pageViewsPerSession.toFixed(1)}</div>
                  </div>

                  {/* Conversion Rate */}
                  <div className="text-right">
                    <div className={`text-sm ${
                      location.conversionRate > 3 ? 'text-green-600' : 
                      location.conversionRate > 1 ? 'text-yellow-600' : 'text-gray-600'
                    }`}>
                      {location.conversionRate.toFixed(2)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Show More/Less Button */}
            {data.length > 10 && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                >
                  {showAll ? (
                    <>Show Top 10 ({data.length - 10} hidden)</>
                  ) : (
                    <>Show All {data.length} {type}</>
                  )}
                </button>
              </div>
            )}

            {/* Summary Stats */}
            <div className="mt-6 pt-4 border-t">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">Total {type}</div>
                  <div className="font-medium">{data.length}</div>
                </div>
                <div>
                  <div className="text-gray-500">Top 10 Users</div>
                  <div className="font-medium">
                    {data.slice(0, 10).reduce((sum, location) => sum + location.users, 0).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Avg Bounce Rate</div>
                  <div className="font-medium">
                    {data.length > 0 ? (data.reduce((sum, location) => sum + location.bounceRate, 0) / data.length).toFixed(1) : 0}%
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Avg Conv Rate</div>
                  <div className="font-medium">
                    {data.length > 0 ? (data.reduce((sum, location) => sum + location.conversionRate, 0) / data.length).toFixed(2) : 0}%
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              📍
            </div>
            <p className="text-sm">No location data available</p>
            <p className="text-xs mt-1">Location data will appear as users visit your site</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}