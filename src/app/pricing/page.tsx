'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PricingPage() {
  const router = useRouter();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const plans = {
    free: {
      name: 'Free',
      description: 'Perfect for getting started with basic calculations',
      price: { monthly: 0, yearly: 0 },
      features: [
        'Basic P&L calculator',
        'Material cost tracking',
        'Labor and overhead calculations',
        'Up to 5 projects',
        'Basic quote generation',
        'Email support',
      ],
      limitations: [
        'No material photos',
        'Limited export options',
        'No advanced reporting',
        'No cloud sync',
      ]
    },
    pro: {
      name: 'Pro',
      description: 'Advanced features for professional makers',
      price: { monthly: 19, yearly: 190 }, // 2 months free on yearly
      popular: true,
      features: [
        'Everything in Free',
        'Material photo uploads',
        'Unlimited projects',
        'Advanced reporting & analytics',
        'Cloud sync across devices',
        'Export to PDF/Excel',
        'Priority email support',
        'What-if analysis tools',
        'Bulk material import',
        'Team collaboration (coming soon)',
      ],
      limitations: []
    }
  };

  const handleGetStarted = (plan: 'free' | 'pro') => {
    if (plan === 'free') {
      router.push('/signup');
    } else {
      router.push('/signup?plan=pro');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Start for free and upgrade when you need advanced features. 
            No hidden fees, cancel anytime.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-lg p-1 shadow-sm border">
            <div className="flex">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-6 py-2 text-sm font-medium rounded-md transition-colors ${
                  billingPeriod === 'monthly'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod('yearly')}
                className={`px-6 py-2 text-sm font-medium rounded-md transition-colors relative ${
                  billingPeriod === 'yearly'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                Yearly
                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  Save 17%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plans.free.name}</h3>
              <p className="text-gray-600 mb-6">{plans.free.description}</p>
              <div className="flex items-baseline">
                <span className="text-4xl font-bold text-gray-900">$0</span>
                <span className="text-gray-600 ml-2">/ forever</span>
              </div>
            </div>

            <button
              onClick={() => handleGetStarted('free')}
              className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors mb-8"
            >
              Get Started Free
            </button>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">What's included:</h4>
              <ul className="space-y-3">
                {plans.free.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              {plans.free.limitations.length > 0 && (
                <>
                  <h4 className="font-semibold text-gray-900 mt-6">Limitations:</h4>
                  <ul className="space-y-3">
                    {plans.free.limitations.map((limitation, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-5 h-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span className="text-gray-500">{limitation}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>

          {/* Pro Plan */}
          <div className={`bg-white rounded-lg shadow-lg p-8 relative ${
            plans.pro.popular ? 'border-2 border-blue-500' : 'border border-gray-200'
          }`}>
            {plans.pro.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
            )}

            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plans.pro.name}</h3>
              <p className="text-gray-600 mb-6">{plans.pro.description}</p>
              <div className="flex items-baseline">
                <span className="text-4xl font-bold text-gray-900">
                  ${plans.pro.price[billingPeriod]}
                </span>
                <span className="text-gray-600 ml-2">
                  / {billingPeriod === 'monthly' ? 'month' : 'year'}
                </span>
              </div>
              {billingPeriod === 'yearly' && (
                <p className="text-sm text-green-600 mt-2">
                  Save $38 compared to monthly billing
                </p>
              )}
            </div>

            <button
              onClick={() => handleGetStarted('pro')}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors mb-8"
            >
              Start Pro Trial
            </button>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Everything in Pro:</h4>
              <ul className="space-y-3">
                {plans.pro.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Can I upgrade or downgrade anytime?
              </h3>
              <p className="text-gray-700">
                Yes! You can upgrade to Pro anytime from your account settings. If you downgrade from Pro to Free, 
                you'll retain access to Pro features until the end of your billing period.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Is there a free trial for Pro?
              </h3>
              <p className="text-gray-700">
                Yes, we offer a 14-day free trial for the Pro plan. No credit card required to start your trial.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-700">
                We accept all major credit cards (Visa, MasterCard, American Express) and PayPal. 
                All payments are processed securely through Stripe.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Can I cancel anytime?
              </h3>
              <p className="text-gray-700">
                Absolutely! You can cancel your subscription anytime from your account settings. 
                There are no cancellation fees, and you'll continue to have access until the end of your billing period.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Do you offer refunds?
              </h3>
              <p className="text-gray-700">
                We offer a 30-day money-back guarantee. If you're not satisfied with MakerCost Pro, 
                contact us within 30 days of your purchase for a full refund.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="bg-blue-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to get started?
            </h2>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Join thousands of makers who trust MakerCost to calculate accurate pricing and grow their businesses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => handleGetStarted('free')}
                className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Start Free
              </button>
              <button
                onClick={() => handleGetStarted('pro')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Try Pro Free
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}