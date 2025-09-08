import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Laser Cutting Business Pricing: Material Costs & Profit Margins (2025)',
  description: 'Master laser cutting pricing with accurate material waste, machine depreciation, and power consumption calculations. Professional pricing strategies for sustainable profits.',
  keywords: 'laser cutting pricing, how to price laser cutting, laser cutting business costs, material waste calculation, machine depreciation',
};

const CalculatorCTA = ({ position }: { position: 'top' | 'middle' | 'bottom' }) => {
  const ctaTexts = {
    top: "Skip Complex Laser Cutting Calculations - Try Our Free Tool",
    middle: "Ready to Price Your Laser Jobs Accurately? Use Our Calculator",
    bottom: "Start Pricing Your Laser Cutting Services Professionally Today"
  };

  return (
    <div className="my-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {ctaTexts[position]}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Get accurate pricing for laser cutting jobs in seconds with our professional P&L calculator designed for fabrication businesses.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          Calculate My Laser Cutting Prices - Free →
        </Link>
      </div>
    </div>
  );
};

export default function LaserCuttingPricingPage() {
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
            <li className="text-gray-900 dark:text-white">Laser Cutting Business Pricing</li>
          </ol>
        </nav>

        {/* Article Header */}
        <article className="bg-white dark:bg-slate-800 rounded-lg shadow-lg">
          <div className="p-8">
            <div className="mb-6">
              <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full">
                Laser Cutting Guide
              </span>
              <div className="flex items-center mt-3 text-sm text-gray-500 dark:text-gray-400">
                <span>Published January 16, 2025</span>
                <span className="mx-2">•</span>
                <span>8 min read</span>
              </div>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Laser Cutting Business Pricing: Material Costs, Machine Time & Profit Margins
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Pricing laser cutting services involves far more complexity than most fabricators realize. Between material 
              waste calculations, precise machine depreciation, power consumption variables, and labor time tracking, 
              getting pricing wrong can quickly erode your profits. Let's explore why professional laser cutting pricing 
              requires sophisticated calculation methods.
            </p>

            <CalculatorCTA position="top" />

            {/* Hero Image */}
            <div className="mb-8">
              <Image
                src="https://images.pexels.com/photos/5691656/pexels-photo-5691656.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Industrial laser cutting machine in operation cutting metal sheet with precise beam, showing sparks and cutting process that requires accurate cost calculation"
                width={800}
                height={400}
                className="w-full h-96 object-cover rounded-lg"
                priority
              />
            </div>

            {/* Main Content */}
            <div className="prose prose-xl dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white">
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4">
                Why Laser Cutting Pricing Is Deceptively Complex
              </h2>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                When you first start a <strong>laser cutting business</strong>, the temptation is to simply calculate material 
                costs, estimate machine time, add profit, and quote the job. But successful fabrication shops know that 
                sustainable <strong>laser cutting pricing</strong> requires accounting for dozens of variables that novice 
                operators often overlook.
              </p>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Unlike simple manufacturing processes, laser cutting involves precision equipment with complex cost structures. 
                Your laser system represents a significant capital investment with ongoing operational costs that must be 
                recovered through proper job pricing. The difference between profitable and unprofitable shops often comes 
                down to how accurately they calculate these true operational costs.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                The Hidden Costs That Kill Profitability
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Beyond the obvious material and machine time costs, laser cutting businesses face numerous hidden expenses 
                that can quickly erode margins if not properly accounted for:
              </p>

              <ul className="text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                <li><strong>Material waste factors:</strong> Kerf width, nesting inefficiencies, and edge distance requirements</li>
                <li><strong>Machine depreciation:</strong> Laser tube degradation, optics replacement, and maintenance schedules</li>
                <li><strong>Power consumption:</strong> Variable electricity costs based on cutting parameters and material thickness</li>
                <li><strong>Assist gas expenses:</strong> Oxygen, nitrogen, or air costs that vary dramatically by application</li>
                <li><strong>Setup and programming time:</strong> CAD preparation, nesting optimization, and machine setup</li>
                <li><strong>Quality control overhead:</strong> Inspection time, rework costs, and scrap material losses</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4">
                Critical Cost Factors in Laser Cutting Operations
              </h2>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                Material Cost Calculations Beyond Simple Square Footage
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Accurate <strong>material waste calculation</strong> separates professional laser cutting operations from 
                amateur shops. It's not enough to calculate the raw square footage of your parts—you must account for 
                kerf width, nesting efficiency losses, and minimum edge distances required by your specific laser system.
              </p>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                For example, cutting 1/4" steel requires approximately 0.006" kerf width, but this seemingly small 
                measurement compounds across complex parts with numerous features. A part with 100 linear inches of 
                cutting might consume an additional 0.6 square inches of material just from kerf losses—multiply this 
                across large production runs, and the material waste becomes substantial.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                Machine Depreciation and Operational Costs
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Professional <strong>machine depreciation</strong> calculations consider multiple factors that amateur 
                operators often ignore. Your laser system doesn't depreciate based solely on time—it degrades based 
                on usage intensity, material types processed, and maintenance quality.
              </p>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Cutting thick materials or processing reflective metals accelerates laser tube degradation compared 
                to thin mild steel work. Similarly, optics require more frequent replacement when processing materials 
                that generate significant spatter or fumes. These variable depreciation factors must be reflected in 
                your job costing to ensure long-term profitability.
              </p>

              <CalculatorCTA position="middle" />

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                Power Consumption and Utility Cost Variables
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                <strong>Power consumption</strong> in laser cutting varies dramatically based on cutting parameters, 
                material properties, and thickness requirements. A 4kW fiber laser cutting 1/8" aluminum operates at 
                vastly different power levels than the same machine processing 1" steel plate.
              </p>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Additionally, your facility's electrical demand charges can create hidden costs that many operators 
                overlook. Running multiple high-power systems simultaneously can trigger peak demand penalties that 
                significantly impact your actual per-hour operational costs.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4">
                Real-World Laser Cutting Pricing Scenarios
              </h2>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Consider a typical job: cutting 50 brackets from 1/4" steel plate. The amateur approach might calculate 
                raw material cost plus an hourly machine rate and call it complete. However, professional pricing accounts 
                for nesting efficiency (typically 75-85% material utilization), kerf losses, assist gas consumption, 
                and variable power requirements based on cutting speed optimization.
              </p>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                The complexity multiplies with mixed-material jobs, rush orders requiring setup changes, or precision 
                work demanding slower cutting speeds. Each variable affects your true cost per part, and manual 
                calculations become increasingly error-prone as job complexity increases.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4">
                Frequently Asked Questions About Laser Cutting Pricing
              </h2>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                How do I calculate laser cutting costs per square inch?
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Per-square-inch pricing oversimplifies laser cutting costs. Material thickness, cutting complexity, 
                edge quality requirements, and setup time all significantly impact true costs. Professional pricing 
                considers these variables rather than relying on simple area calculations.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                What profit margins should laser cutting businesses target?
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Sustainable laser cutting operations typically target 40-60% gross margins to account for equipment 
                depreciation, facility overhead, and reinvestment requirements. Lower margins make it difficult to 
                weather equipment failures or invest in technology upgrades.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                How do I price rush orders and prototype work?
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Rush orders typically command 25-50% premium pricing to compensate for schedule disruption and priority 
                handling. Prototype work should include engineering time for nesting optimization and may require 
                slower cutting speeds for superior edge quality.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                Should I offer volume pricing discounts?
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Volume discounts make sense when they reflect actual cost savings through improved nesting efficiency 
                and reduced setup time per part. However, discounts should never compromise your ability to cover 
                fixed costs and maintain adequate profit margins.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                How do different materials affect laser cutting costs?
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Material properties dramatically impact cutting costs. Stainless steel requires different assist gases 
                and cutting parameters than mild steel. Aluminum demands specialized techniques to prevent edge dross. 
                Each material combination requires specific costing parameters.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4">
                The Professional Approach: Specialized Pricing Tools
              </h2>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Understanding <strong>how to price laser cutting</strong> professionally means recognizing when manual 
                calculations become inadequate for sustainable business operations. The most successful fabrication shops 
                have discovered that professional pricing calculators don't just save time—they reveal cost factors that 
                manual methods consistently miss.
              </p>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Modern pricing tools integrate all the complex variables we've discussed: material waste factors, machine 
                depreciation schedules, variable power consumption, assist gas costs, and labor time optimization. They 
                handle the mathematical complexity while you focus on growing your fabrication business and serving customers.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                Beyond Basic Job Costing
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Professional calculators provide insights that manual methods simply cannot match. They help you understand 
                which jobs truly drive profitability, how pricing adjustments affect your bottom line, and where you might 
                be undervaluing your laser cutting services compared to market rates.
              </p>

              <CalculatorCTA position="bottom" />

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4">
                Conclusion: Price Strategically, Profit Consistently
              </h2>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Learning <strong>laser cutting pricing</strong> effectively is crucial for building a sustainable fabrication 
                business, but it doesn't require overwhelming manual calculations. The complexity we've explored—from material 
                waste optimization to machine depreciation tracking—demonstrates why successful shops are moving beyond 
                spreadsheet-based pricing methods.
              </p>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Professional pricing tools handle the mathematical complexity while ensuring you capture all operational 
                costs and maintain healthy profit margins. Instead of spending hours calculating kerf factors and nesting 
                efficiencies, you can focus on what drives business growth: delivering quality fabrication services and 
                building customer relationships.
              </p>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                The laser cutting businesses that thrive in today's competitive market are those who price strategically 
                using professional tools. They understand that accurate pricing isn't just about covering immediate costs—it's 
                about building a sustainable operation that can invest in better equipment, expand capabilities, and weather 
                economic fluctuations.
              </p>

              <div className="mt-12 p-6 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Ready to Transform Your Laser Cutting Pricing Strategy?
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Join successful fabrication shops who've discovered the power of professional pricing. Our free calculator 
                  handles all the complexity we've discussed, giving you accurate, profitable quotes in minutes instead of hours.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center px-8 py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors"
                  >
                    Start Pricing Professionally - Free
                  </Link>
                  <Link
                    href="/pricing"
                    className="inline-flex items-center justify-center px-8 py-3 border border-green-600 text-green-600 font-medium rounded-md hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                  >
                    Learn About Pro Features
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </article>

        {/* Related Articles */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/blog/how-to-price-your-3d-prints" className="group">
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-4">
                <Image
                  src="https://images.unsplash.com/photo-1605647540924-852290f6b0d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                  alt="3D printing pricing guide"
                  width={400}
                  height={200}
                  className="w-full h-32 object-cover rounded mb-3"
                />
                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  How to Price Your 3D Prints
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                  Complete pricing guide for 3D printing businesses
                </p>
              </div>
            </Link>
            
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 opacity-60">
              <Image
                src="https://images.pexels.com/photos/6957242/pexels-photo-6957242.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Candle making pricing"
                width={400}
                height={200}
                className="w-full h-32 object-cover rounded mb-3"
              />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Candle Making Profits
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                Coming Soon: Wax costs and pricing strategy
              </p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 opacity-60">
              <Image
                src="https://images.pexels.com/photos/175045/pexels-photo-175045.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Woodworking pricing"
                width={400}
                height={200}
                className="w-full h-32 object-cover rounded mb-3"
              />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Woodworking Shop Pricing
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                Coming Soon: Lumber costs and project pricing
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}