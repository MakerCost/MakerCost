import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Candle Making Profits: Wax Costs, Labor Time & Pricing Strategy (2025)',
  description: 'Master candle making costs from wax weight calculations to fragrance oils, molds, and labor time. Professional pricing strategies for profitable candle businesses.',
  keywords: 'candle making pricing, how to price handmade candles, candle business profits, wax cost calculation, fragrance oil costs',
};

const CalculatorCTA = ({ position }: { position: 'top' | 'middle' | 'bottom' }) => {
  const ctaTexts = {
    top: "Skip Complex Candle Cost Calculations - Try Our Free Tool",
    middle: "Ready to Price Your Candles for Maximum Profit? Use Our Calculator",
    bottom: "Start Pricing Your Handmade Candles Professionally Today"
  };

  return (
    <div className="my-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {ctaTexts[position]}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Get accurate pricing for handmade candles in seconds with our professional P&L calculator designed for artisan businesses.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          Calculate My Candle Prices - Free →
        </Link>
      </div>
    </div>
  );
};

export default function CandleMakingPricingPage() {
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
            <li className="text-gray-900 dark:text-white">Candle Making Profits</li>
          </ol>
        </nav>

        {/* Article Header */}
        <article className="bg-white dark:bg-slate-800 rounded-lg shadow-lg">
          <div className="p-8">
            <div className="mb-6">
              <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full">
                Candle Making Guide
              </span>
              <div className="flex items-center mt-3 text-sm text-gray-500 dark:text-gray-400">
                <span>Published January 17, 2025</span>
                <span className="mx-2">•</span>
                <span>7 min read</span>
              </div>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Candle Making Profits: Wax Costs, Labor Time & Pricing Strategy
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Building a profitable candle making business requires far more than calculating wax and fragrance costs. 
              Between precise wax weight calculations, fragrance oil percentages, wick sizing costs, container expenses, 
              and labor time tracking, pricing errors can quickly destroy your margins. Let's explore why professional 
              candle pricing demands sophisticated cost analysis.
            </p>

            <CalculatorCTA position="top" />

            {/* Hero Image */}
            <div className="mb-8">
              <Image
                src="https://images.pexels.com/photos/6957242/pexels-photo-6957242.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Artisan carefully measuring wax and fragrance oils for handmade candles in workshop, demonstrating the precision required for accurate cost calculation"
                width={800}
                height={400}
                className="w-full h-96 object-cover rounded-lg"
                priority
              />
            </div>

            {/* Main Content */}
            <div className="prose prose-xl dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white">
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4">
                Why Candle Making Pricing Is More Complex Than It Appears
              </h2>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                When you first start a <strong>candle business</strong>, the temptation is to simply add up wax, fragrance, 
                and container costs, then multiply by two for profit. But successful candle makers know that sustainable 
                <strong>candle making pricing</strong> requires accounting for dozens of variables that novice makers 
                often overlook completely.
              </p>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Unlike simple crafts, candle making involves precise formulations where small measurement errors can 
                affect burn quality, scent throw, and customer satisfaction. Your wax-to-fragrance ratios must be 
                consistent, your containers properly sized, and your labor time accurately tracked to ensure each 
                candle generates adequate profit.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                The Hidden Costs That Destroy Candle Profits
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Beyond the obvious wax and container costs, candle making businesses face numerous hidden expenses 
                that can quickly eliminate profitability if not properly tracked:
              </p>

              <ul className="text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                <li><strong>Fragrance oil waste:</strong> Testing blends, spillage, and minimum order quantities</li>
                <li><strong>Wax shrinkage factors:</strong> Volume loss during cooling and container adhesion issues</li>
                <li><strong>Labor time complexity:</strong> Mixing, pouring, cooling supervision, and finishing work</li>
                <li><strong>Quality control costs:</strong> Test burns, scent throw evaluation, and rework expenses</li>
                <li><strong>Packaging overhead:</strong> Labels, boxes, tissue paper, and protective materials</li>
                <li><strong>Equipment depreciation:</strong> Double boilers, thermometers, scales, and pouring vessels</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4">
                Critical Cost Factors in Professional Candle Making
              </h2>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                Wax Cost Calculations Beyond Simple Weight
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Accurate <strong>wax cost calculation</strong> requires more than dividing bulk wax price by total weight. 
                You must account for wax shrinkage during cooling (typically 8-12%), container adhesion loss, and testing 
                waste. Additionally, different wax types have varying fill rates and performance characteristics that affect 
                your true cost per finished candle.
              </p>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                For example, soy wax may cost more per pound than paraffin but provides better scent throw, allowing you 
                to use less fragrance oil. These trade-offs significantly impact your total material costs and must be 
                factored into professional pricing calculations.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                Fragrance Oil Costs and Percentage Calculations
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                <strong>Fragrance oil costs</strong> represent one of the largest variable expenses in candle making, 
                typically accounting for 15-25% of total material costs. However, calculating true fragrance costs 
                involves more complexity than simple percentage calculations.
              </p>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Premium fragrance oils may cost 3-4 times more than basic scents but require lower usage rates for 
                equivalent scent throw. Additionally, some fragrances perform better in specific wax types, affecting 
                both material costs and customer satisfaction. Professional pricing accounts for these performance 
                variables rather than using simple cost-per-ounce calculations.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                Container, Wick, and Packaging Cost Variables
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Container costs vary dramatically based on size, material, and purchase quantities. Glass jars may 
                offer better aesthetics but require careful shipping considerations. Tin containers provide cost 
                advantages but limit design options. Each choice affects both material costs and customer perception 
                of value.
              </p>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Wick selection impacts both performance and costs. Cotton wicks cost less initially but may require 
                larger sizes for proper burn pools. Wood wicks command premium pricing but create unique sensory 
                experiences that support higher retail prices. Professional candle makers evaluate these trade-offs 
                systematically rather than choosing based solely on material costs.
              </p>

              <CalculatorCTA position="middle" />

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4">
                Labor Time and Production Efficiency Factors
              </h2>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Candle making labor involves multiple distinct phases that must be tracked separately for accurate 
                costing. Wax melting and temperature monitoring require active attention, while cooling and curing 
                happen passively but tie up equipment and workspace.
              </p>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Professional operations batch production to maximize efficiency, but batch sizes are limited by 
                equipment capacity and fragrance working times. Calculating true labor costs requires understanding 
                these production constraints and their impact on your effective hourly rates.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4">
                Real-World Candle Pricing Scenarios
              </h2>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Consider pricing a 9oz soy candle: material costs might total $8 (wax, fragrance, container, wick, label), 
                but professional pricing accounts for shrinkage factors, testing waste, equipment depreciation, and 
                labor time. When properly calculated, true cost per candle often exceeds $12, requiring retail prices 
                of $24-30 to maintain healthy margins.
              </p>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                The complexity multiplies with seasonal collections, custom scents, or premium packaging requirements. 
                Each variation affects material costs, labor time, and quality control requirements, making manual 
                calculations increasingly error-prone.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4">
                Frequently Asked Questions About Candle Making Pricing
              </h2>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                How much should I charge for handmade candles?
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                <strong>Handmade candle</strong> pricing should reflect true material costs, labor time, overhead expenses, 
                and target profit margins. Most successful candle makers price at 2.5-3x material costs, but this only 
                works when material calculations include all hidden costs and waste factors.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                What profit margins should candle businesses target?
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Sustainable candle businesses typically target 50-65% gross margins to account for seasonal sales 
                fluctuations, inventory holding costs, and reinvestment in materials and equipment. Lower margins 
                make it difficult to weather slow periods or invest in business growth.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                How do I price custom or seasonal candles?
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Custom work should include design time, sample creation costs, and premium pricing for personalization. 
                Seasonal candles may require higher margins to compensate for shorter selling periods and potential 
                inventory obsolescence after holidays.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                Should I offer wholesale pricing to retailers?
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Wholesale pricing typically offers 50% discount from retail prices but requires larger order quantities 
                that improve production efficiency. Successful wholesale requires understanding your true cost structure 
                to ensure adequate margins even at wholesale rates.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                How do different wax types affect pricing?
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Premium waxes like coconut or beeswax cost more per pound but may provide better performance characteristics 
                that justify higher retail pricing. Soy wax offers marketing advantages as natural and renewable. Each 
                wax type requires specific costing analysis based on performance and market positioning.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4">
                The Professional Approach: Specialized Pricing Tools
              </h2>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Understanding <strong>how to price handmade candles</strong> professionally means recognizing when manual 
                calculations become inadequate for sustainable business operations. The most successful candle makers have 
                discovered that professional pricing calculators don't just save time—they reveal cost factors that manual 
                spreadsheets consistently miss.
              </p>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Modern pricing tools integrate all the complex variables we've discussed: wax shrinkage factors, fragrance 
                oil percentages, container costs, labor time optimization, and packaging expenses. They handle the mathematical 
                complexity while you focus on creating beautiful candles and building customer relationships.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                Beyond Basic Material Calculations
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Professional calculators provide insights that manual methods cannot match. They help you understand which 
                candle sizes and scents truly drive profitability, how pricing changes affect your bottom line, and where 
                you might be undervaluing your handcrafted products compared to market rates.
              </p>

              <CalculatorCTA position="bottom" />

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4">
                Conclusion: Build a Profitable Candle Empire
              </h2>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Learning <strong>candle making pricing</strong> effectively is crucial for building a sustainable artisan 
                business, but it doesn't require overwhelming manual calculations. The complexity we've explored—from wax 
                shrinkage calculations to fragrance oil optimization—demonstrates why successful makers are moving beyond 
                simple markup pricing methods.
              </p>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Professional pricing tools handle the mathematical complexity while ensuring you capture all material costs, 
                labor time, and overhead expenses in your pricing structure. Instead of spending hours calculating fragrance 
                percentages and container costs, you can focus on what drives business success: creating exceptional candles 
                and delighting customers.
              </p>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                The candle makers who thrive in today's competitive market are those who price strategically using professional 
                tools. They understand that accurate pricing isn't just about covering immediate material costs—it's about 
                building a sustainable business that can invest in premium materials, expand product lines, and weather 
                seasonal fluctuations.
              </p>

              <div className="mt-12 p-6 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Ready to Transform Your Candle Making Business?
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Join successful candle makers who've discovered the power of professional pricing. Our free calculator 
                  handles all the complexity we've discussed, giving you accurate, profitable pricing in minutes instead of hours.
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
            <Link href="/blog/laser-cutting-pricing" className="group">
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-4">
                <Image
                  src="https://images.pexels.com/photos/5691656/pexels-photo-5691656.jpeg?auto=compress&cs=tinysrgb&w=400"
                  alt="Laser cutting pricing guide"
                  width={400}
                  height={200}
                  className="w-full h-32 object-cover rounded mb-3"
                />
                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  Laser Cutting Business Pricing
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                  Material costs, machine time & profit margins
                </p>
              </div>
            </Link>
            
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