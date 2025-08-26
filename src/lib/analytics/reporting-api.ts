// Google Analytics 4 Reporting API Integration
export interface GA4ReportRequest {
  property: string;
  dateRanges: Array<{
    startDate: string;
    endDate: string;
  }>;
  dimensions?: Array<{
    name: string;
  }>;
  metrics: Array<{
    name: string;
  }>;
  dimensionFilter?: Record<string, unknown>;
  metricFilter?: Record<string, unknown>;
  orderBys?: Array<{
    dimension?: { dimensionName: string };
    metric?: { metricName: string };
    desc?: boolean;
  }>;
  limit?: number;
  offset?: number;
}

export interface GA4ReportResponse {
  dimensionHeaders: Array<{ name: string }>;
  metricHeaders: Array<{ name: string; type: string }>;
  rows: Array<{
    dimensionValues: Array<{ value: string }>;
    metricValues: Array<{ value: string }>;
  }>;
  rowCount: number;
  metadata: {
    currencyCode: string;
    timeZone: string;
  };
}

// GA4 Data API client
class GA4ReportingClient {
  private readonly propertyId: string;
  private readonly apiKey: string;
  private readonly baseUrl = 'https://analyticsdata.googleapis.com/v1beta';

  constructor(propertyId: string, apiKey: string) {
    this.propertyId = propertyId;
    this.apiKey = apiKey;
  }

  async runReport(request: Omit<GA4ReportRequest, 'property'>): Promise<GA4ReportResponse> {
    const url = `${this.baseUrl}/properties/${this.propertyId}:runReport`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        property: `properties/${this.propertyId}`,
        ...request
      })
    });

    if (!response.ok) {
      throw new Error(`GA4 API request failed: ${response.statusText}`);
    }

    return response.json();
  }
}

// Helper functions for common reports
export class GA4Analytics {
  private client: GA4ReportingClient;

  constructor(propertyId: string, apiKey: string) {
    this.client = new GA4ReportingClient(propertyId, apiKey);
  }

  // Get basic metrics
  async getBasicMetrics(startDate: string, endDate: string) {
    return this.client.runReport({
      dateRanges: [{ startDate, endDate }],
      metrics: [
        { name: 'activeUsers' },
        { name: 'newUsers' },
        { name: 'sessions' },
        { name: 'bounceRate' },
        { name: 'averageSessionDuration' },
        { name: 'screenPageViews' }
      ]
    });
  }

  // Get user acquisition data
  async getUserAcquisition(startDate: string, endDate: string) {
    return this.client.runReport({
      dateRanges: [{ startDate, endDate }],
      dimensions: [
        { name: 'sessionDefaultChannelGrouping' },
        { name: 'sessionSource' },
        { name: 'sessionMedium' }
      ],
      metrics: [
        { name: 'newUsers' },
        { name: 'sessions' },
        { name: 'conversions' }
      ],
      orderBys: [
        { metric: { metricName: 'newUsers' }, desc: true }
      ]
    });
  }

  // Get e-commerce data
  async getEcommerceMetrics(startDate: string, endDate: string) {
    return this.client.runReport({
      dateRanges: [{ startDate, endDate }],
      metrics: [
        { name: 'purchaseRevenue' },
        { name: 'transactions' },
        { name: 'averagePurchaseRevenue' },
        { name: 'itemRevenue' },
        { name: 'addToCarts' },
        { name: 'checkouts' }
      ]
    });
  }

  // Get subscription funnel data
  async getSubscriptionFunnel(startDate: string, endDate: string) {
    return this.client.runReport({
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'eventName' }],
      metrics: [{ name: 'eventCount' }],
      dimensionFilter: {
        filter: {
          fieldName: 'eventName',
          inListFilter: {
            values: [
              'pricing_page_view',
              'plan_selected',
              'payment_started',
              'purchase'
            ]
          }
        }
      },
      orderBys: [
        { metric: { metricName: 'eventCount' }, desc: true }
      ]
    });
  }

  // Get feature usage data
  async getFeatureUsage(startDate: string, endDate: string) {
    return this.client.runReport({
      dateRanges: [{ startDate, endDate }],
      dimensions: [
        { name: 'customEvent:feature_name' },
        { name: 'customEvent:user_tier' }
      ],
      metrics: [{ name: 'eventCount' }],
      dimensionFilter: {
        filter: {
          fieldName: 'eventName',
          stringFilter: {
            value: 'feature_used',
            matchType: 'EXACT'
          }
        }
      },
      orderBys: [
        { metric: { metricName: 'eventCount' }, desc: true }
      ]
    });
  }

  // Get user behavior flow
  async getUserBehaviorFlow(startDate: string, endDate: string) {
    return this.client.runReport({
      dateRanges: [{ startDate, endDate }],
      dimensions: [
        { name: 'pageTitle' },
        { name: 'eventName' }
      ],
      metrics: [
        { name: 'eventCount' },
        { name: 'userEngagementDuration' }
      ],
      orderBys: [
        { metric: { metricName: 'eventCount' }, desc: true }
      ],
      limit: 50
    });
  }

  // Get conversion data by user tier
  async getConversionsByTier(startDate: string, endDate: string) {
    return this.client.runReport({
      dateRanges: [{ startDate, endDate }],
      dimensions: [
        { name: 'customEvent:user_tier' }
      ],
      metrics: [
        { name: 'conversions' },
        { name: 'purchaseRevenue' },
        { name: 'activeUsers' }
      ],
      dimensionFilter: {
        filter: {
          fieldName: 'eventName',
          stringFilter: {
            value: 'purchase',
            matchType: 'EXACT'
          }
        }
      }
    });
  }

  // Get real-time data
  async getRealTimeData() {
    const url = `https://analyticsdata.googleapis.com/v1beta/properties/${this.client['propertyId']}:runRealtimeReport`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.client['apiKey']}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        metrics: [
          { name: 'activeUsers' },
          { name: 'screenPageViews' }
        ],
        dimensions: [
          { name: 'country' },
          { name: 'unifiedPageScreen' }
        ],
        limit: 10
      })
    });

    if (!response.ok) {
      throw new Error(`GA4 realtime API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Get cohort analysis data
  async getCohortAnalysis(startDate: string, endDate: string) {
    return this.client.runReport({
      dateRanges: [{ startDate, endDate }],
      dimensions: [
        { name: 'cohort' },
        { name: 'cohortNthWeek' }
      ],
      metrics: [
        { name: 'cohortActiveUsers' },
        { name: 'cohortTotalUsers' }
      ],
      orderBys: [
        { dimension: { dimensionName: 'cohort' }, desc: true }
      ]
    });
  }

  // Get retention data
  async getRetentionData(startDate: string, endDate: string) {
    return this.client.runReport({
      dateRanges: [{ startDate, endDate }],
      dimensions: [
        { name: 'newVsReturning' },
        { name: 'daysSinceLastSession' }
      ],
      metrics: [
        { name: 'activeUsers' },
        { name: 'sessions' }
      ]
    });
  }
}

// Utility functions for data processing
export const processGA4Data = {
  // Convert GA4 response to chart-friendly format
  toChartData: (response: GA4ReportResponse) => {
    return response.rows.map(row => {
      const data: Record<string, unknown> = {};
      
      response.dimensionHeaders.forEach((dimension, index) => {
        data[dimension.name] = row.dimensionValues[index].value;
      });
      
      response.metricHeaders.forEach((metric, index) => {
        data[metric.name] = parseFloat(row.metricValues[index].value) || 0;
      });
      
      return data;
    });
  },

  // Calculate conversion rates
  calculateConversionRate: (data: Record<string, unknown>[], numeratorMetric: string, denominatorMetric: string) => {
    return data.map(item => ({
      ...item,
      conversionRate: (item[denominatorMetric] as number) > 0 
        ? ((item[numeratorMetric] as number) / (item[denominatorMetric] as number)) * 100 
        : 0
    }));
  },

  // Aggregate data by dimension
  aggregateByDimension: (data: Record<string, unknown>[], dimension: string, metric: string) => {
    const aggregated: Record<string, number> = {};
    
    data.forEach(item => {
      const key = item[dimension] as string;
      aggregated[key] = (aggregated[key] || 0) + ((item[metric] as number) || 0);
    });
    
    return Object.entries(aggregated).map(([key, value]) => ({
      [dimension]: key,
      [metric]: value
    }));
  }
};

export default GA4Analytics;