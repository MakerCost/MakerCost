'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

interface ReportsPanelProps {
  startDate: string;
  endDate: string;
}

export default function ReportsPanel({ startDate, endDate }: ReportsPanelProps) {
  const reports = [
    {
      name: 'User Acquisition Report',
      description: 'Detailed breakdown of how users find and sign up',
      icon: '👥',
      format: 'CSV',
      size: '2.3 MB'
    },
    {
      name: 'Revenue Analytics',
      description: 'Complete revenue and subscription metrics',
      icon: '💰',
      format: 'PDF',
      size: '1.8 MB'
    },
    {
      name: 'Feature Usage Report',
      description: 'Usage statistics for all platform features',
      icon: '⚡',
      format: 'Excel',
      size: '3.1 MB'
    },
    {
      name: 'Conversion Funnel Analysis',
      description: 'Step-by-step conversion analysis',
      icon: '📊',
      format: 'PDF',
      size: '1.2 MB'
    },
    {
      name: 'Cohort Analysis Report',
      description: 'User retention and engagement over time',
      icon: '📈',
      format: 'CSV',
      size: '2.7 MB'
    }
  ];

  const handleDownloadReport = (reportName: string) => {
    // Implement report generation and download
    console.log(`Downloading ${reportName} for period ${startDate} to ${endDate}`);
    alert(`Generating ${reportName}... This feature will be implemented with GA4 API integration.`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Custom Reports</CardTitle>
          <CardDescription>
            Generate and download detailed analytics reports for the selected date range
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reports.map((report) => (
              <div
                key={report.name}
                className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="text-2xl">{report.icon}</div>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {report.format}
                  </span>
                </div>
                
                <h3 className="font-medium text-gray-900 mb-2">{report.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{report.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">~{report.size}</span>
                  <button
                    onClick={() => handleDownloadReport(report.name)}
                    className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                  >
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Automated Reports</CardTitle>
          <CardDescription>Schedule regular reports to be sent to your email</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium">Weekly Summary Report</h4>
                <p className="text-sm text-gray-600">Every Monday at 9:00 AM</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Active</span>
                <button className="text-sm text-blue-600 hover:text-blue-800">Configure</button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium">Monthly Business Review</h4>
                <p className="text-sm text-gray-600">First of each month at 10:00 AM</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">Inactive</span>
                <button className="text-sm text-blue-600 hover:text-blue-800">Configure</button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}