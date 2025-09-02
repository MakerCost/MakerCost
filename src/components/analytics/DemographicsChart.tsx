'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

interface DemographicsData {
  age: {
    '18-24': number;
    '25-34': number;
    '35-44': number;
    '45-54': number;
    '55-64': number;
    '65+': number;
  };
  gender: {
    male: number;
    female: number;
    unknown: number;
  };
  interests: Array<{
    category: string;
    percentage: number;
  }>;
}

interface DemographicsChartProps {
  data: DemographicsData;
  loading?: boolean;
}

export default function DemographicsChart({ data, loading = false }: DemographicsChartProps) {
  const [activeChart, setActiveChart] = useState<'age' | 'gender' | 'interests'>('age');

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="h-5 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
          </CardHeader>
          <CardContent>
            <div className="h-48 bg-gray-200 rounded animate-pulse" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="h-5 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
          </CardHeader>
          <CardContent>
            <div className="h-48 bg-gray-200 rounded animate-pulse" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const ageData = Object.entries(data.age);
  const genderData = Object.entries(data.gender);
  const totalAgeUsers = Object.values(data.age).reduce((sum, count) => sum + count, 0);
  const totalGenderUsers = Object.values(data.gender).reduce((sum, count) => sum + count, 0);

  const ageColors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-red-500',
    'bg-indigo-500'
  ];

  const genderColors = [
    'bg-blue-500',
    'bg-pink-500',
    'bg-gray-400'
  ];

  const renderAgeChart = () => (
    <div className="space-y-4">
      {ageData.map(([ageRange, count], index) => {
        const percentage = totalAgeUsers > 0 ? (count / totalAgeUsers) * 100 : 0;
        return (
          <div key={ageRange} className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className={`w-3 h-3 rounded-full ${ageColors[index]}`} />
              <span className="text-sm font-medium">{ageRange}</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2 mx-3">
                <div
                  className={`h-2 rounded-full ${ageColors[index]}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
            <div className="text-right min-w-16">
              <div className="text-sm font-medium">{count.toLocaleString()}</div>
              <div className="text-xs text-gray-500">{percentage.toFixed(1)}%</div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderGenderChart = () => (
    <div className="space-y-4">
      {genderData.map(([gender, count], index) => {
        const percentage = totalGenderUsers > 0 ? (count / totalGenderUsers) * 100 : 0;
        const displayGender = gender.charAt(0).toUpperCase() + gender.slice(1);
        
        return (
          <div key={gender} className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className={`w-3 h-3 rounded-full ${genderColors[index]}`} />
              <span className="text-sm font-medium">{displayGender}</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2 mx-3">
                <div
                  className={`h-2 rounded-full ${genderColors[index]}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
            <div className="text-right min-w-16">
              <div className="text-sm font-medium">{count.toLocaleString()}</div>
              <div className="text-xs text-gray-500">{percentage.toFixed(1)}%</div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderInterests = () => (
    <div className="space-y-3">
      {data.interests.slice(0, 8).map((interest, index) => (
        <div key={interest.category} className="flex items-center justify-between">
          <span className="text-sm text-gray-600 flex-1">{interest.category}</span>
          <div className="flex items-center gap-2 min-w-20">
            <div className="w-16 bg-gray-200 rounded-full h-1.5">
              <div
                className="h-1.5 bg-blue-500 rounded-full"
                style={{ width: `${interest.percentage}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-900 min-w-10 text-right">
              {interest.percentage.toFixed(1)}%
            </span>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Age and Gender Demographics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Demographics
            <div className="flex gap-1">
              <button
                onClick={() => setActiveChart('age')}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  activeChart === 'age'
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Age
              </button>
              <button
                onClick={() => setActiveChart('gender')}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  activeChart === 'gender'
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Gender
              </button>
            </div>
          </CardTitle>
          <CardDescription>
            {activeChart === 'age' ? 'User distribution by age range' : 'User distribution by gender'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activeChart === 'age' ? renderAgeChart() : renderGenderChart()}
          
          {(totalAgeUsers === 0 && totalGenderUsers === 0) && (
            <div className="text-center py-8 text-gray-500">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                👥
              </div>
              <p className="text-sm">No demographic data available</p>
              <p className="text-xs mt-1">Enable Google Signals in GA4 to collect demographic insights</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Interests */}
      <Card>
        <CardHeader>
          <CardTitle>User Interests</CardTitle>
          <CardDescription>Top interest categories of your audience</CardDescription>
        </CardHeader>
        <CardContent>
          {data.interests.length > 0 ? (
            renderInterests()
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                🎯
              </div>
              <p className="text-sm">No interest data available</p>
              <p className="text-xs mt-1">Interest data will appear as users engage with your site</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}