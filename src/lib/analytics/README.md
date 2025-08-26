# MakerCost GA4 Analytics System

A comprehensive Google Analytics 4 implementation with advanced business intelligence, funnel tracking, and GDPR-compliant consent management.

## 🎯 Overview

This analytics system provides professional-grade tracking and reporting capabilities for MakerCost, including:

- **Advanced Event Tracking**: 25+ predefined business events
- **Funnel Analytics**: Subscription, onboarding, and feature discovery funnels  
- **Admin Dashboard**: Real-time metrics and business intelligence
- **Privacy Compliance**: GDPR/CCPA compliant consent management
- **Revenue Tracking**: Enhanced e-commerce and subscription analytics

## 📊 Admin Dashboard Access

The complete analytics system is accessible through the **Admin Panel**:

### Navigation Path:
1. Go to `/account/admin` (admin users only)
2. Click the **"Analytics"** tab
3. Access all features:
   - Real-time metrics
   - User segmentation 
   - Revenue analytics
   - Feature usage tracking
   - Custom reports
   - Funnel analysis

### Dashboard Features:
- **Overview Tab**: Quick stats and system health
- **Analytics Tab**: Full GA4 dashboard with:
  - Real-time user activity
  - Revenue and subscription metrics
  - Feature usage analysis
  - Conversion funnels
  - Custom date ranges
  - Downloadable reports
- **Users Tab**: User management and admin controls

## 🔧 Configuration

### Environment Setup:
```bash
# Your GA4 tracking ID is already configured
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-5HLQ9GC26S
```

### Consent Management:
- Privacy-first approach with default consent denial
- Granular cookie controls (Analytics, Marketing, Functional)
- Automatic consent banner for new users
- Consent decisions tracked in GA4

## 📈 Event Tracking

### Authentication Events:
- `sign_up` - User registration
- `login` - User authentication
- `logout` - User logout

### Business Events:
- `project_created` - New project started
- `quote_generated` - Quote creation
- `quote_finalized` - Quote completion
- `material_added` - Material management
- `machine_imported` - Machine setup

### E-commerce Events:
- `purchase` - Subscription purchases
- `add_to_cart` - Plan selection
- `begin_checkout` - Payment initiation
- `subscription_cancelled` - Cancellations

### Feature Usage:
- `feature_used` - Feature interactions
- `feature_blocked` - Premium feature blocks
- `upgrade_prompt_shown` - Upgrade CTAs

## 🔄 Funnel Tracking

### 1. Subscription Funnel:
```
Pricing Page View → Plan Selected → Payment Started → Purchase Completed
```

### 2. User Onboarding:
```
Sign Up → Profile Setup → First Project → Feature Discovery
```

### 3. Feature Discovery:
```
Feature Discovered → Attempt Use → Upgrade Prompt → Conversion
```

## 📝 Integration Examples

### Track User Signup:
```typescript
import { trackSignUp } from '@/lib/analytics/events';

// In signup component
const handleSignup = async (userId: string) => {
  trackSignUp('email', userId);
  // ... rest of signup logic
};
```

### Track Feature Usage:
```typescript
import { trackFeatureUsed } from '@/lib/analytics/events';

const handleFeatureUse = (feature: string, userTier: 'free' | 'pro') => {
  trackFeatureUsed({
    feature_name: feature,
    feature_category: 'pricing',
    user_tier: userTier,
    success: true
  });
};
```

### Track Subscription Purchase:
```typescript
import { subscriptionFunnel } from '@/lib/analytics/funnels';

// Complete subscription flow
subscriptionFunnel.completePayment({
  transaction_id: 'txn_123',
  subscription_id: 'sub_456', 
  plan_id: 'pro_monthly',
  value: 29.99,
  currency: 'USD',
  // ... other data
});
```

## 🛡️ Privacy & Compliance

### Consent Management:
- Automatic consent banner for new users
- Granular cookie preferences
- Analytics only load after user consent
- Consent decisions tracked for compliance

### Privacy Features:
- IP anonymization enabled
- No personal data in custom dimensions
- GDPR-compliant user identification
- Secure data handling

## 📊 Available Reports

### Real-time Metrics:
- Active users
- Page views  
- Conversions
- Revenue

### Business Intelligence:
- User acquisition analysis
- Feature usage by tier
- Subscription funnel performance
- Cohort and retention analysis
- Revenue and MRR tracking

### Custom Reports:
- User Acquisition Report (CSV)
- Revenue Analytics (PDF)  
- Feature Usage Report (Excel)
- Conversion Funnel Analysis (PDF)
- Cohort Analysis Report (CSV)

## 🔧 Technical Implementation

### File Structure:
```
src/lib/analytics/
├── ga4.ts              # Core GA4 setup and utilities
├── events.ts           # Event tracking functions
├── funnels.ts          # Funnel tracking system
├── reporting-api.ts    # GA4 Reporting API integration
├── integration-example.ts # Usage examples
└── README.md           # This documentation

src/components/analytics/
├── GA4Provider.tsx     # GA4 initialization 
├── ConsentBanner.tsx   # GDPR consent management
├── Dashboard.tsx       # Main analytics dashboard
├── MetricCard.tsx      # KPI display components
├── FunnelChart.tsx     # Conversion funnel charts
├── UserSegmentChart.tsx # User segmentation
├── RevenueChart.tsx    # Revenue analytics
├── FeatureUsageChart.tsx # Feature usage
├── ReportsPanel.tsx    # Custom reports
└── RealTimeMetrics.tsx # Live metrics
```

### Key Features:
- TypeScript integration with full type safety
- Error handling and retry logic
- Performance optimization with caching
- Automatic consent mode management
- Real-time data updates
- Mobile-responsive dashboard

## 🚀 Getting Started

1. **Access Admin Dashboard**: Navigate to `/account/admin`
2. **View Analytics**: Click the "Analytics" tab
3. **Customize Date Range**: Use the date picker for specific periods
4. **Download Reports**: Generate custom reports as needed
5. **Monitor Real-time**: View live user activity

## 🎯 Business Value

This analytics system provides:
- **Data-Driven Decisions**: Comprehensive user behavior insights
- **Conversion Optimization**: Funnel analysis and bottleneck identification  
- **Revenue Intelligence**: Subscription and pricing analytics
- **User Understanding**: Segmentation and cohort analysis
- **Privacy Compliance**: GDPR-ready consent management
- **Professional Reporting**: Executive-ready dashboards and reports

The system is production-ready and will help optimize MakerCost's growth and user experience through data-driven insights.