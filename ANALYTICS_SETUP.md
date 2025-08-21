# Analytics Setup Guide - MakerCost

## Overview
MakerCost now includes comprehensive analytics tracking using both **Google Analytics 4 (GA4)** and **PostHog** for complete user behavior insights.

## Required Environment Variables

Add these to your `.env.local` file:

```bash
# Google Analytics 4
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# PostHog
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

## Getting Your Analytics Keys

### Google Analytics 4
1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new GA4 property for your website
3. Navigate to Admin > Data Streams > Web
4. Copy your Measurement ID (format: G-XXXXXXXXXX)

### PostHog
1. Sign up at [PostHog](https://posthog.com/)
2. Create a new project
3. Copy your Project API Key from the project settings
4. Use the appropriate host URL based on your region

## Tracked Events

### Google Analytics 4 Events
- **Quote Creation**: Product count, total value, currency
- **Quote Finalization**: Quote completion with business metrics
- **Material Management**: Material additions, edits, deletions
- **Demo Data Usage**: User onboarding interactions
- **Authentication**: Login, signup, logout events
- **Feature Usage**: Core feature engagement tracking

### PostHog Events
- **User Behavior**: Detailed interaction tracking with context
- **Business Metrics**: Revenue, conversion, and growth analytics  
- **User Journeys**: Multi-step workflow analysis
- **Feature Adoption**: Product feature usage patterns
- **Session Analysis**: User session recordings and heatmaps

## Implementation Details

### Architecture
- **GA4**: Uses Next.js official `@next/third-parties` package for optimal performance
- **PostHog**: Client-side initialization with React context provider
- **Privacy**: Only collects identified user profiles when users are authenticated

### Performance
- Analytics scripts load after page hydration
- No impact on Core Web Vitals or page load speed
- Automatic pageview tracking for both platforms

### Key Features
- **Automatic Integration**: No manual tracking needed for basic events
- **User Identification**: Links analytics data when users authenticate
- **Custom Events**: Business-specific tracking for quotes, materials, and features
- **Privacy Compliant**: Respects user preferences and consent

## Usage in Code

### Import Analytics Functions
```typescript
// Google Analytics
import { trackEvent, trackQuoteCreated } from '@/lib/analytics';

// PostHog
import { trackPostHogEvent, trackQuoteCreation } from '@/lib/posthog-analytics';
```

### Track Custom Events
```typescript
// Track business events
trackQuoteCreated(productCount, totalValue, currency);
trackQuoteCreation({
  productCount,
  totalValue,
  currency,
  hasCustomMaterials: true
});

// Track feature usage
trackFeatureUsage('material_management');
trackFeatureInteraction('demo_data_load', { success: true });
```

## Deployment
Both analytics platforms will automatically start tracking once you deploy with the environment variables set. No additional configuration needed.

## Troubleshooting
- Verify environment variables are set in production
- Check browser console for any PostHog initialization errors
- Use GA4 Real-Time reports to verify events are being received
- PostHog events appear in the Live Events feed immediately