import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'UV Printing Profitability: Ink Costs, Substrate Pricing & Custom Orders (2025)',
  description: 'Master UV printing costs from ink consumption to substrate expenses and setup time. Professional pricing strategies for profitable UV printing businesses.',
  keywords: 'uv printing pricing, how to price uv printing, uv ink costs, substrate printing costs, custom printing business',
};

const CalculatorCTA = ({ position }: { position: 'top' | 'middle' | 'bottom' }) => {
  const ctaTexts = {
    top: "Skip Complex UV Printing Cost Calculations - Try Our Free Tool",
    middle: "Ready to Price Your UV Printing Jobs for Maximum Profit? Use Our Calculator",
    bottom: "Start Pricing Your UV Printing Services Professionally Today"
  };

  return (
    <div className="my-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {ctaTexts[position]}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Get accurate pricing for UV printing jobs in seconds with our professional P&L calculator designed for custom printing businesses.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          Calculate My UV Printing Prices - Free →
        </Link>
      </div>
    </div>
  );
};

export default function UVPrintingPricingPage() {
  return (
    <div className="bg-gray-50 dark:bg-slate-900 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <li><Link href="/" className="hover:text-gray-700 dark:hover:text-gray-200">Home</Link></li>
            <li>→</li>
            <li><Link href="/blog" className="hover:text-gray-700 dark:hover:text-gray-200">Blog</Link></li>
            <li>→</li>
            <li className="text-gray-900 dark:text-white">UV Printing Profitability</li>
          </ol>
        </nav>

        {/* Article Header */}
        <article className="bg-white dark:bg-slate-800 rounded-lg shadow-lg">
          <div className="p-8">
            <div className="mb-6">
              <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full">
                UV Printing Guide
              </span>
              <div className="flex items-center mt-3 text-sm text-gray-500 dark:text-gray-400">
                <span>Published February 25, 2025</span>
                <span className="mx-2">•</span>
                <span>6 min read</span>
              </div>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              UV Printing Profitability: Ink Costs, Substrate Pricing & Custom Orders
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Running a profitable UV printing business requires precise cost tracking across ink consumption, substrate 
              pricing, setup time, and equipment maintenance. Between variable ink coverage rates, substrate compatibility 
              issues, color matching requirements, and machine calibration time, pricing errors can quickly erode margins. 
              Let's examine why professional UV printing demands sophisticated cost analysis.
            </p>

            <CalculatorCTA position="top" />

            {/* Hero Image */}
            <div className="mb-8">
              <Image
                src="https://images.pexels.com/photos/3635300/pexels-photo-3635300.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Professional UV printer operating on various substrates, showing the precision required for accurate cost calculation in custom printing business"
                width={800}
                height={400}
                className="w-full h-96 object-cover rounded-lg"
                priority
              />
            </div>

            {/* Main Content */}
            <div className="prose prose-xl dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white">
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4">
                Why UV Printing Pricing Is More Complex Than Traditional Printing
              </h2>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                When starting a <strong>UV printing business</strong>, many operators assume they can simply calculate 
                square footage costs and add markup. However, successful <strong>UV printing pricing</strong> requires 
                understanding dozens of variables that traditional printing doesn't face, from substrate adhesion 
                requirements to curing energy consumption.
              </p>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Unlike offset or digital printing, UV printing involves real-time curing processes, substrate-specific 
                ink formulations, and varying coverage rates that directly impact material costs. Your ink consumption 
                varies dramatically based on image density, substrate porosity, and required opacity levels.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                The Hidden Costs That Destroy UV Printing Profits
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Beyond the obvious ink and substrate costs, UV printing operations face numerous hidden expenses 
                that can eliminate profitability if not properly tracked:
              </p>

              <ul className="text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                <li><strong>Ink waste during setup:</strong> Color calibration, test prints, and nozzle cleaning cycles</li>
                <li><strong>Substrate preparation time:</strong> Surface cleaning, primer application, and adhesion testing</li>
                <li><strong>UV lamp depreciation:</strong> Bulb replacement costs and energy consumption for curing</li>
                <li><strong>Color matching overhead:</strong> Profile creation, calibration, and customer approval processes</li>
                <li><strong>Equipment maintenance:</strong> Print head cleaning, calibration tools, and preventive service</li>
                <li><strong>Substrate waste factors:</strong> Test prints, registration adjustments, and quality control rejects</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4">
                Critical Cost Factors in Professional UV Printing
              </h2>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                UV Ink Cost Calculations Beyond Simple Coverage
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Accurate <strong>UV ink costs</strong> require understanding that coverage rates vary dramatically based 
                on substrate porosity, image density, and required opacity. Porous substrates like wood or uncoated 
                paper can consume 30-50% more ink than non-porous materials like acrylic or metal.
              </p>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Additionally, achieving consistent color reproduction often requires multiple ink layers, particularly 
                when printing light colors over dark substrates. Professional pricing accounts for these variable 
                consumption rates rather than using simple square-footage calculations.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                Substrate Compatibility and Pricing Variations
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                <strong>Substrate printing costs</strong> extend far beyond material purchase prices. Different substrates 
                require specific UV ink formulations, primer applications, and curing parameters that significantly 
                impact production time and material consumption.
              </p>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                For example, printing on glass requires specialized adhesion promoters and longer curing times, while 
                flexible materials need specific ink chemistries to prevent cracking. Each substrate combination affects 
                both material costs and production efficiency, making standardized pricing inadequate for professional 
                operations.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                Setup Time and Equipment Utilization Factors
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                UV printing setup time varies significantly based on job complexity, substrate changeover requirements, 
                and color matching needs. Short runs require proportionally more setup time per piece, while long runs 
                achieve better equipment utilization rates.
              </p>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Professional operations must factor equipment utilization into pricing, as UV printers represent 
                significant capital investments that generate revenue only when actively producing billable output. 
                Proper costing includes depreciation, financing costs, and opportunity costs of equipment downtime.
              </p>

              <CalculatorCTA position="middle" />

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4">
                Labor Efficiency and Production Workflow Optimization
              </h2>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                UV printing labor involves multiple specialized tasks that must be tracked separately for accurate 
                costing. File preparation, color profiling, substrate handling, and quality control each require 
                specific skill sets and time allocations that affect your true hourly labor costs.
              </p>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Efficient operations optimize workflow to minimize handling time and maximize print throughput, but 
                these optimizations require initial investment in jigs, fixtures, and process development that must 
                be amortized across production volumes.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4">
                Real-World UV Printing Pricing Scenarios
              </h2>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Consider pricing a custom acrylic sign job: material costs might total $25 (substrate, ink, primer), 
                but professional pricing accounts for setup time, color matching, quality control, and equipment 
                utilization. When properly calculated, true cost per piece often exceeds $45, requiring pricing of 
                $90-120 to maintain healthy margins.
              </p>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                The complexity multiplies with multi-substrate jobs, color-critical applications, or rush orders. 
                Each variation affects setup requirements, material consumption, and quality control procedures, 
                making manual calculations increasingly prone to costly errors.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4">
                Frequently Asked Questions About UV Printing Pricing
              </h2>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                How much should I charge for UV printing services?
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                UV printing prices depend on substrate type, image complexity, quantity, and turnaround requirements. 
                Simple single-color prints on acrylic might start at $3-5 per square inch, while complex multi-color 
                jobs on specialty substrates can command $15-25 per square inch. Always factor in setup time, material 
                waste, and equipment utilization for accurate pricing.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                What's the biggest mistake in UV printing cost calculation?
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                The most common error is underestimating ink consumption variations across different substrates and 
                image types. Many operators use average coverage rates that don't account for substrate porosity, 
                opacity requirements, or color density variations, leading to significant margin erosion on complex jobs.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                How do I handle rush orders and premium pricing?
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Rush orders should include premium pricing that covers overtime labor, expedited material procurement, 
                and disruption to regular production schedules. Typical rush premiums range from 50-150% depending on 
                timeline requirements and operational impact.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4">
                Professional UV Printing Business Success
              </h2>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Building a profitable UV printing operation requires sophisticated cost tracking that accounts for all 
                material variables, labor complexities, and equipment utilization factors. Manual calculations become 
                increasingly error-prone as job complexity and volume increase.
              </p>

              <p className="text-gray-600 dark:text-gray-300 mb-8">
                Professional UV printing businesses use comprehensive costing systems that automatically factor substrate 
                requirements, ink consumption variables, setup time allocations, and equipment depreciation to ensure 
                accurate pricing on every job, from simple signage to complex multi-substrate applications.
              </p>

              <CalculatorCTA position="bottom" />

            </div>
          </div>
        </article>
      </div>
    </div>
  );
}