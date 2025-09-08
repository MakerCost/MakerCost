import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Rug Tufting Business: Yarn Costs, Tool Depreciation & Time Tracking (2025)',
  description: 'Master rug tufting costs from yarn weight calculations to backing materials and finishing time. Professional pricing strategies for profitable rug tufting businesses.',
  keywords: 'rug tufting pricing, yarn cost calculation, tufting business costs, handmade rug pricing, tufting tool costs',
};

const CalculatorCTA = ({ position }: { position: 'top' | 'middle' | 'bottom' }) => {
  const ctaTexts = {
    top: "Skip Complex Rug Tufting Cost Calculations - Try Our Free Tool",
    middle: "Ready to Price Your Rug Tufting Projects for Maximum Profit? Use Our Calculator", 
    bottom: "Start Pricing Your Rug Tufting Business Professionally Today"
  };

  return (
    <div className="my-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {ctaTexts[position]}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Get accurate pricing for rug tufting projects with our professional calculator designed for textile businesses.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          Calculate My Rug Tufting Prices - Free →
        </Link>
      </div>
    </div>
  );
};

export default function RugTuftingPricingPage() {
  return (
    <div className="bg-gray-50 dark:bg-slate-900 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <li><Link href="/" className="hover:text-gray-700 dark:hover:text-gray-200">Home</Link></li>
            <li>→</li>
            <li><Link href="/blog" className="hover:text-gray-700 dark:hover:text-gray-200">Blog</Link></li>
            <li>→</li>
            <li className="text-gray-900 dark:text-white">Rug Tufting Business</li>
          </ol>
        </nav>

        <article className="bg-white dark:bg-slate-800 rounded-lg shadow-lg">
          <div className="p-8">
            <div className="mb-6">
              <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full">
                Rug Tufting Guide
              </span>
              <div className="flex items-center mt-3 text-sm text-gray-500 dark:text-gray-400">
                <span>Published March 1, 2025</span>
                <span className="mx-2">•</span>
                <span>7 min read</span>
              </div>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Rug Tufting Business: Yarn Costs, Tool Depreciation & Time Tracking
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Building a profitable <strong>rug tufting business</strong> requires precise cost analysis that extends far beyond 
              yarn purchases. Between accurate <strong>yarn cost calculations</strong>, tufting gun depreciation, backing material 
              expenses, finishing time allocation, and design complexity factors, professional <strong>rug tufting pricing</strong> 
              demands sophisticated analysis of every cost component.
            </p>

            <CalculatorCTA position="top" />

            <div className="mb-8">
              <Image
                src="https://images.pexels.com/photos/4792078/pexels-photo-4792078.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Artisan working on rug tufting project with various colored yarns, demonstrating the complexity of handmade rug cost calculation"
                width={800}
                height={400}
                className="w-full h-96 object-cover rounded-lg"
                priority
              />
            </div>

            <div className="prose prose-xl dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white">
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4">
                Why Rug Tufting Cost Calculation Is More Complex Than Expected
              </h2>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Many new rug tufters assume they can simply calculate yarn weight and add labor time. However, professional 
                <strong>handmade rug pricing</strong> requires understanding yarn waste factors, backing material variations, 
                tool maintenance costs, finishing process complexity, and design-specific time requirements that significantly 
                impact true project costs.
              </p>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Successful rug tufting businesses track every cost component from initial design sketching through final 
                trimming and binding, ensuring accurate pricing that maintains healthy margins while remaining competitive 
                in the custom textile market.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                The Hidden Costs That Destroy Rug Tufting Profits
              </h3>

              <ul className="text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                <li><strong>Yarn waste and color changes:</strong> Color transition waste, end trimming, and sample testing</li>
                <li><strong>Tool maintenance and depreciation:</strong> Tufting gun servicing, needle replacement, and equipment wear</li>
                <li><strong>Backing material variations:</strong> Monks cloth quality differences and size optimization</li>
                <li><strong>Finishing process complexity:</strong> Trimming, carving, binding, and backing attachment time</li>
                <li><strong>Design development overhead:</strong> Pattern creation, color planning, and client consultation</li>
                <li><strong>Quality control and rework:</strong> Mistake correction, density adjustments, and client revisions</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4">
                Professional Yarn Cost Analysis and Material Management
              </h2>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                Accurate Yarn Weight Calculations and Waste Factors
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Effective <strong>yarn cost calculation</strong> requires understanding that actual consumption exceeds theoretical 
                requirements by 15-25% due to waste factors, color changes, and finishing requirements. Different yarn weights 
                and textures create varying pile densities that affect consumption rates beyond simple area calculations.
              </p>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Professional operations track yarn consumption by project type, pile height, and design complexity to establish 
                accurate material estimates that account for real-world waste factors and ensure adequate material ordering 
                without excessive inventory investment.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                Tufting Tool Investment and Depreciation Analysis
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                <strong>Tufting tool costs</strong> represent significant capital investment that must be amortized across 
                production volume. Quality tufting guns cost $300-1500, frames require $200-800 investment, and specialized 
                scissors, carving tools, and finishing equipment add substantial overhead that affects project pricing.
              </p>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Professional pricing includes tool depreciation, maintenance reserves, and upgrade planning to ensure 
                equipment costs are properly recovered through project pricing while maintaining competitive rates that 
                support business growth and reinvestment.
              </p>

              <CalculatorCTA position="middle" />

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4">
                Time Tracking and Labor Efficiency Optimization
              </h2>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Rug tufting labor involves multiple distinct phases requiring separate time tracking for accurate costing. 
                Design transfer, tufting execution, trimming and carving, and finishing work each require different skill 
                levels and time allocations that must be understood for professional pricing accuracy.
              </p>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Experienced tufters achieve 20-40 square inches per hour for basic work, but complex designs with multiple 
                colors and pile height variations can reduce efficiency to 8-15 square inches per hour, dramatically affecting 
                labor costs and project timelines.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4">
                Design Complexity and Pricing Variables
              </h2>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Simple geometric designs with 2-3 colors require minimal setup and color changes, while photorealistic 
                portraits or complex landscapes involve frequent color transitions, detailed carving work, and extended 
                finishing time that can triple total project hours beyond basic tufting time.
              </p>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Professional pricing structures account for design complexity through tiered rates that reflect actual 
                time and skill requirements while communicating value to customers who may not understand the technical 
                challenges involved in complex textile work.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4">
                Real-World Rug Tufting Cost Examples
              </h2>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Consider a 24" x 36" custom rug: yarn costs might total $45, but comprehensive costing includes $15 backing 
                and finishing materials, $25 tool depreciation allocation, $120 labor time (8 hours at $15/hour), and $20 
                design development - totaling $225 production cost requiring $450-500 retail pricing for sustainable margins.
              </p>

              <p className="text-gray-600 dark:text-gray-300 mb-8">
                Complex portrait rugs or intricate patterns can require 15-25 hours for similar sizes, dramatically increasing 
                labor costs and necessitating premium pricing that reflects the specialized skill and time investment required 
                for high-quality results.
              </p>

              <CalculatorCTA position="bottom" />

            </div>
          </div>
        </article>
      </div>
    </div>
  );
}