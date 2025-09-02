'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

interface GeographicData {
  countries: Array<{
    countryCode: string;
    countryName: string;
    users: number;
    sessions: number;
    bounceRate: number;
    averageSessionDuration: number;
  }>;
  cities: Array<{
    cityName: string;
    countryName: string;
    users: number;
    sessions: number;
    bounceRate: number;
  }>;
  totalUsers: number;
}

interface GeographicMapProps {
  data: GeographicData;
  loading?: boolean;
}

export default function GeographicMap({ data, loading = false }: GeographicMapProps) {
  const [activeView, setActiveView] = useState<'countries' | 'cities'>('countries');

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="h-5 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-200 rounded animate-pulse mb-4" />
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const topCountries = data.countries.slice(0, 10);
  const topCities = data.cities.slice(0, 10);

  const getIntensityColor = (users: number, maxUsers: number) => {
    if (maxUsers === 0) return 'bg-gray-100';
    const intensity = users / maxUsers;
    if (intensity > 0.8) return 'bg-blue-600';
    if (intensity > 0.6) return 'bg-blue-500';
    if (intensity > 0.4) return 'bg-blue-400';
    if (intensity > 0.2) return 'bg-blue-300';
    if (intensity > 0) return 'bg-blue-200';
    return 'bg-gray-100';
  };

  const maxCountryUsers = Math.max(...data.countries.map(c => c.users), 1);
  const maxCityUsers = Math.max(...data.cities.map(c => c.users), 1);

  const renderMapVisualization = () => (
    <div className="relative">
      {/* Simplified world map representation */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
            🌍
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Geographic Distribution</h3>
          <p className="text-sm text-gray-600">
            {data.totalUsers > 0 ? (
              <>Users from {data.countries.length} countries and {data.cities.length} cities</>
            ) : (
              'No geographic data available yet'
            )}
          </p>
          {data.totalUsers > 0 && (
            <div className="mt-4 flex justify-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-600 rounded-full" />
                <span>High traffic</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-400 rounded-full" />
                <span>Medium traffic</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-200 rounded-full" />
                <span>Low traffic</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toggle buttons */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveView('countries')}
          className={`px-4 py-2 text-sm rounded-md transition-colors ${
            activeView === 'countries'
              ? 'bg-blue-100 text-blue-700 border border-blue-200'
              : 'text-gray-500 hover:text-gray-700 border border-gray-200'
          }`}
        >
          Countries ({data.countries.length})
        </button>
        <button
          onClick={() => setActiveView('cities')}
          className={`px-4 py-2 text-sm rounded-md transition-colors ${
            activeView === 'cities'
              ? 'bg-blue-100 text-blue-700 border border-blue-200'
              : 'text-gray-500 hover:text-gray-700 border border-gray-200'
          }`}
        >
          Cities ({data.cities.length})
        </button>
      </div>
    </div>
  );

  const renderCountriesTable = () => (
    <div className="space-y-2">
      <div className="grid grid-cols-4 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wide pb-2 border-b">
        <div>Country</div>
        <div className="text-right">Users</div>
        <div className="text-right">Sessions</div>
        <div className="text-right">Bounce Rate</div>
      </div>
      {topCountries.map((country, index) => (
        <div key={country.countryCode} className="grid grid-cols-4 gap-4 py-2 hover:bg-gray-50 rounded">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">#{index + 1}</span>
            <div className={`w-2 h-2 rounded-full ${getIntensityColor(country.users, maxCountryUsers)}`} />
            <span className="text-sm font-medium truncate">{country.countryName}</span>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium">{country.users.toLocaleString()}</div>
            <div className="text-xs text-gray-500">
              {data.totalUsers > 0 ? ((country.users / data.totalUsers) * 100).toFixed(1) : 0}%
            </div>
          </div>
          <div className="text-right text-sm">{country.sessions.toLocaleString()}</div>
          <div className="text-right text-sm">{country.bounceRate.toFixed(1)}%</div>
        </div>
      ))}
      {topCountries.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm">No country data available</p>
        </div>
      )}
    </div>
  );

  const renderCitiesTable = () => (
    <div className="space-y-2">
      <div className="grid grid-cols-4 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wide pb-2 border-b">
        <div>City</div>
        <div>Country</div>
        <div className="text-right">Users</div>
        <div className="text-right">Sessions</div>
      </div>
      {topCities.map((city, index) => (
        <div key={`${city.cityName}-${city.countryName}`} className="grid grid-cols-4 gap-4 py-2 hover:bg-gray-50 rounded">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">#{index + 1}</span>
            <div className={`w-2 h-2 rounded-full ${getIntensityColor(city.users, maxCityUsers)}`} />
            <span className="text-sm font-medium truncate">{city.cityName}</span>
          </div>
          <div className="text-sm text-gray-600 truncate">{city.countryName}</div>
          <div className="text-right">
            <div className="text-sm font-medium">{city.users.toLocaleString()}</div>
            <div className="text-xs text-gray-500">
              {data.totalUsers > 0 ? ((city.users / data.totalUsers) * 100).toFixed(1) : 0}%
            </div>
          </div>
          <div className="text-right text-sm">{city.sessions.toLocaleString()}</div>
        </div>
      ))}
      {topCities.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm">No city data available</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Geographic Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Geographic Distribution</CardTitle>
          <CardDescription>Where your users are located around the world</CardDescription>
        </CardHeader>
        <CardContent>
          {renderMapVisualization()}
        </CardContent>
      </Card>

      {/* Detailed Geographic Data */}
      <Card>
        <CardHeader>
          <CardTitle>
            Top {activeView === 'countries' ? 'Countries' : 'Cities'}
          </CardTitle>
          <CardDescription>
            Detailed breakdown of user activity by {activeView}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activeView === 'countries' ? renderCountriesTable() : renderCitiesTable()}
        </CardContent>
      </Card>
    </div>
  );
}