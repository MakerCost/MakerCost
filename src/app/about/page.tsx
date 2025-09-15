import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About MakerCost - Professional Pricing for Makers',
  description: 'Learn the story behind MakerCost and why accurate pricing matters for maker businesses. Created by a finance professional to help makers price their work profitably.',
  keywords: [
    'about makercost',
    'maker pricing tools',
    'business calculator story',
    'maker business help',
    'professional pricing makers'
  ],
  openGraph: {
    title: 'About MakerCost - Professional Pricing for Makers',
    description: 'Learn the story behind MakerCost and why accurate pricing matters for maker businesses. Created by a finance professional to help makers price their work profitably.',
    url: 'https://makercost.com/about',
    type: 'website',
  },
  twitter: {
    title: 'About MakerCost - Professional Pricing for Makers',
    description: 'Learn the story behind MakerCost and why accurate pricing matters for maker businesses. Created by a finance professional to help makers price their work profitably.',
    card: 'summary_large_image',
  },
  alternates: {
    canonical: 'https://makercost.com/about',
  },
};

export default function AboutPage() {
  return (
    <div className="bg-gray-50 dark:bg-slate-900 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <li><Link href="/" className="hover:text-gray-700 dark:hover:text-gray-200">Home</Link></li>
            <li>→</li>
            <li className="text-gray-900 dark:text-white">About Us</li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            About MakerCost
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Professional pricing tools created by makers, for makers
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 mb-8">
          <div className="prose prose-lg dark:prose-invert max-w-none">

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              About MakerCost
            </h2>

            <p className="text-gray-600 dark:text-gray-300 mb-6">
              As a CPA and finance manager, I've always used systematic cost analysis and pricing methods in my
              professional work. When I started making and selling art as a hobby, I naturally applied the same
              business principles: tracking material costs, calculating fair labor rates, and accounting for overhead expenses.
            </p>

            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Through conversations with other makers, I learned that many talented craftspeople struggle with pricing.
              Some price based on what competitors charge, others add a simple markup to materials, and many work for
              rates that don't cover their true costs or provide sustainable income.
            </p>

            <p className="text-gray-600 dark:text-gray-300 mb-6">
              The business side of making—especially pricing—can be challenging when you don't have a finance background.
              Most makers excel at their craft but haven't had exposure to professional cost analysis methods.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
              The Solution
            </h3>

            <p className="text-gray-600 dark:text-gray-300 mb-6">
              MakerCost was created to make professional pricing methods accessible to makers. The calculator uses
              the same cost analysis principles that successful businesses rely on, adapted specifically for maker
              businesses and custom product creation.
            </p>

            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Our tool helps makers properly account for material costs, labor time, tool depreciation, overhead
              expenses, and profit margins. This ensures pricing that covers all costs and supports sustainable
              business growth.
            </p>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800 mb-6">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
                Our Goal
              </h3>
              <p className="text-blue-800 dark:text-blue-200">
                Help makers price their work profitably so they can build sustainable businesses,
                value their skills appropriately, and focus on creating without financial stress.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
              Why Proper Pricing Matters
            </h3>

            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Accurate pricing benefits everyone. Makers can earn fair compensation for their skills and time.
              Customers understand the true value of handmade products. And creative communities can thrive
              when businesses are financially sustainable.
            </p>

            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Whether you're just starting out or have an established maker business, professional pricing
              methods help ensure your work generates the profits needed to support and grow your business.
            </p>

          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-blue-600 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to Price Your Work Professionally?
          </h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Join thousands of makers who've discovered the confidence that comes from knowing their true costs
            and pricing their work profitably.
          </p>
          <Link
            href="/"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-block"
          >
            Start Calculating Your Prices
          </Link>
        </div>
      </div>
    </div>
  );
}