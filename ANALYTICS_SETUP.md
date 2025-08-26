# MakerCost Analytics Setup Guide

## Overview
MakerCost uses a dual analytics approach for comprehensive insights:
- **Google Analytics 4 (GA4)**: Business metrics, revenue tracking, marketing attribution
- **PostHog**: Product analytics, user behavior, session recordings, feature flags

## Current Implementation Status ✅

### Google Analytics 4 (GA4)
- **Status**: Fully implemented and operational
- **Tracking ID**: Configured via `NEXT_PUBLIC_GA_TRACKING_ID`

### PostHog Product Analytics
- **Status**: Fully implemented and operational  
- **Project Key**: `phc_xyKKTgkDQJSOz22TcPZixu3Vc5yVAuxcKPiLS9YBwEK`

## Environment Variables

Required variables in your `.env.local`:

```bash
# Google Analytics 4
NEXT_PUBLIC_GA_TRACKING_ID=your_ga4_tracking_id

# PostHog
NEXT_PUBLIC_POSTHOG_KEY=phc_xyKKTgkDQJSOz22TcPZixu3Vc5yVAuxcKPiLS9YBwEK
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
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

## Admin Dashboard Access

### GA4 Analytics Tab
- Real-time business metrics dashboard
- Revenue and conversion tracking
- Date range filtering
- Quote generation analytics

### PostHog Product Analytics Tab  
- Session recording access and controls
- Heatmap configuration and viewing
- User survey management
- A/B testing and feature flag controls

## Key Features Implemented

### PostHog Product Analytics
- **Session Recordings**: 50% sampling rate with privacy controls
- **Heatmaps**: Click and scroll tracking on key pages
- **Feature Flags**: A/B testing infrastructure ready
- **User Surveys**: Contextual feedback collection
- **Product Analytics**: User journey and behavior tracking

### Google Analytics 4
- **Enhanced Ecommerce**: Revenue and transaction tracking  
- **Business Metrics**: Quote completion, user acquisition
- **Marketing Attribution**: Campaign performance tracking
- **Conversion Goals**: Business objective tracking

## Event Tracking Architecture

### Business Events (GA4)
Located in `src/lib/analytics.ts`:
```typescript
trackPurchase(transactionId, value, currency, items)
trackQuoteGenerated(quoteData) 
trackSignUp(method, userId)
trackMaterialAdded(materialData)
```

### Product Events (PostHog)
Located in `src/lib/posthog-product-analytics.ts`:
```typescript
trackCalculatorWorkflow(step, data)
trackUIInteraction(element, action)
trackFormBehavior(formName, fieldName, action)
trackUserSentiment(page, sentiment, context)
```

## Usage Guide

### For Business Analytics (GA4)
1. Access your Google Analytics dashboard
2. Navigate to Reports > Monetization for revenue data
3. Check Conversions for goal completion rates
4. Use admin panel "Analytics" tab for quick insights

### for Product Analytics (PostHog)
1. Visit [PostHog Dashboard](https://app.posthog.com)
2. Select your MakerCost project
3. Use admin panel "Product Analytics" tab for direct access
4. Available features:
   - **Session Recordings**: Watch user interactions
   - **Heatmaps**: See click and scroll patterns  
   - **Surveys**: Collect user feedback
   - **Feature Flags**: Control feature rollouts

## Implementation Status ✅
- ✅ PostHog provider and context setup
- ✅ Session recording with privacy controls
- ✅ Heatmap tracking configuration
- ✅ Feature flags and A/B testing ready
- ✅ User surveys and feedback system
- ✅ Product analytics event tracking
- ✅ Admin dashboard integration
- ✅ Privacy-compliant data collection

## Next Steps
1. Configure specific feature flags in PostHog dashboard
2. Set up custom dashboards for business metrics
3. Create user segments for targeted analysis
4. Configure automated alerts for key metrics

Both analytics systems are fully operational and ready for production deployment.