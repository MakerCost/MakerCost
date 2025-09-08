import type { Metadata } from 'next';
import HomeContent from './HomeContent';
import StructuredData, { generateBreadcrumbSchema } from '@/components/seo/StructuredData';

export const metadata: Metadata = {
  title: 'MakerCost - Professional P&L Calculator for Makers & Custom Businesses',
  description: 'Free professional profit & loss calculator for makers, 3D printing businesses, and custom product entrepreneurs. Calculate true costs including materials, labor, overhead, and optimize your pricing strategies.',
  keywords: [
    'maker calculator',
    '3d printing pricing calculator',
    'profit and loss calculator',
    'cost calculator for makers',
    'handmade business calculator',
    'custom product pricing',
    'maker business tools',
    'manufacturing cost calculator',
    'small business calculator',
    'craft business pricing'
  ],
  openGraph: {
    title: 'MakerCost - Professional P&L Calculator for Makers',
    description: 'Free professional profit & loss calculator for makers, 3D printing businesses, and custom product entrepreneurs.',
    url: 'https://makercost.com',
    type: 'website',
    images: [
      {
        url: 'https://makercost.com/makercost-logo-new.png',
        width: 1200,
        height: 630,
        alt: 'MakerCost Calculator Interface',
      }
    ],
  },
  twitter: {
    title: 'MakerCost - Professional P&L Calculator for Makers',
    description: 'Free professional profit & loss calculator for makers, 3D printing businesses, and custom product entrepreneurs.',
    card: 'summary_large_image',
    images: ['https://makercost.com/makercost-logo-new.png'],
  },
  alternates: {
    canonical: 'https://makercost.com',
  },
};

// Generate breadcrumb schema for homepage
const breadcrumbSchema = generateBreadcrumbSchema([
  { name: 'MakerCost', url: 'https://makercost.com' }
]);

export default function Home() {
  return (
    <>
      {/* Breadcrumb Structured Data */}
      <StructuredData data={breadcrumbSchema} />
      
      {/* SEO-optimized Hero Section */}
      <section className="bg-gray-50 dark:bg-slate-900 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-4">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
              Free Professional P&L Calculator for Makers
            </h1>
            <h2 className="text-xl text-gray-600 dark:text-gray-300 mb-4">
              Calculate True Costs, Optimize Pricing, and Maximize Profits for Your Custom Business
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
              Professional profit & loss calculator for makers, 3D printing businesses, and custom product entrepreneurs. 
              Track materials, labor, overhead, and generate quotes with accurate pricing strategies.
            </p>
          </div>
        </div>
      </section>
      
      {/* Interactive Calculator Component */}
      <HomeContent />
    </>
  );
}
