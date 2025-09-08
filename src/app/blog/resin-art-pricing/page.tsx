import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Resin Art Pricing: Material Costs, Curing Time & Mold Expenses (2025)',
  description: 'Master resin art pricing with accurate epoxy costs, pigment calculations, mold expenses, and extended curing time overhead. Professional pricing for profitable resin businesses.',
  keywords: 'resin art pricing, how to price resin art, epoxy resin costs, resin business profits, pigment cost calculation',
};

const CalculatorCTA = ({ position }: { position: 'top' | 'middle' | 'bottom' }) => {
  const ctaTexts = {
    top: "Skip Complex Resin Cost Calculations - Try Our Free Tool",
    middle: "Ready to Price Your Resin Art for Maximum Profit? Use Our Calculator",
    bottom: "Start Pricing Your Resin Creations Professionally Today"
  };

  return (
    <div className="my-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {ctaTexts[position]}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Get accurate pricing for resin art projects in seconds with our professional P&L calculator designed for creative businesses.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          Calculate My Resin Art Prices - Free →
        </Link>
      </div>
    </div>
  );
};

export default function ResinArtPricingPage() {
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
            <li className="text-gray-900 dark:text-white">Resin Art Pricing</li>
          </ol>
        </nav>

        {/* Article Header */}
        <article className="bg-white dark:bg-slate-800 rounded-lg shadow-lg">
          <div className="p-8">
            <div className="mb-6">
              <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full">
                Resin Art Guide
              </span>
              <div className="flex items-center mt-3 text-sm text-gray-500 dark:text-gray-400">
                <span>Published January 19, 2025</span>
                <span className="mx-2">•</span>
                <span>6 min read</span>
              </div>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Resin Art Pricing: Material Costs, Curing Time & Mold Expenses
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Creating profitable resin art requires far more complex cost analysis than most artists realize. Between 
              precise epoxy measurements, expensive pigment costs, mold depreciation, extended curing times, and workspace 
              overhead, pricing errors can quickly transform creative passion into financial loss. Let's explore why 
              professional resin art pricing demands sophisticated business calculation methods.
            </p>

            <CalculatorCTA position="top" />

            {/* Hero Image */}
            <div className="mb-8">
              <Image
                src="https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                alt="Artist creating colorful resin art piece with swirling pigments and epoxy, demonstrating the precision and material costs involved in professional resin artwork pricing"
                width={800}
                height={400}
                className="w-full h-96 object-cover rounded-lg"
                priority
              />
            </div>

            {/* Main Content */}
            <div className="prose prose-xl dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white">
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4">
                Why Resin Art Pricing Is More Complex Than Material Costs
              </h2>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                When you first start a <strong>resin art business</strong>, the temptation is to calculate resin and 
                pigment costs, add time for mixing and pouring, then multiply by desired profit margin. But successful 
                resin artists know that sustainable <strong>resin art pricing</strong> requires accounting for dozens 
                of variables that beginning artists consistently underestimate or completely overlook.
              </p>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Unlike traditional painting mediums, resin art involves precise chemical processes, extended curing periods, 
                specialized equipment, and environmental controls that create hidden costs. Your workspace setup, ventilation 
                system, and tool collection represent significant investments that must be recovered through proper 
                pricing to ensure sustainable artistic practice.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                The Hidden Costs That Destroy Resin Art Profits
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Beyond the obvious epoxy resin and pigment costs, resin art businesses face numerous hidden expenses 
                that can quickly eliminate profitability if not properly tracked and included in pricing calculations:
              </p>

              <ul className="text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                <li><strong>Curing time overhead:</strong> Extended workspace occupation, heating costs, and delayed revenue recognition</li>
                <li><strong>Mold depreciation costs:</strong> Silicone molds, release agents, and replacement schedules</li>
                <li><strong>Ventilation and safety equipment:</strong> Respirators, gloves, and workspace modifications</li>
                <li><strong>Temperature control expenses:</strong> Heating, air conditioning, and humidity management</li>
                <li><strong>Mixing and measuring tools:</strong> Scales, cups, stir sticks, and precision equipment</li>
                <li><strong>Waste and experimentation costs:</strong> Failed pours, color testing, and technique development</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4">
                Critical Cost Factors in Professional Resin Art Operations
              </h2>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                Epoxy Resin Costs and Accurate Volume Calculations
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Accurate <strong>epoxy resin costs</strong> require precise volume calculations that account for mixing 
                ratios, over-pour allowances, and container geometry. Professional resin artists understand that quoted 
                coverage rates from manufacturers rarely match real-world usage due to mixing losses, surface variations, 
                and safety over-pour margins typically required for quality results.
              </p>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Additionally, premium epoxy resins designed for art applications cost significantly more than industrial 
                grades but provide superior clarity, UV stability, and working times. These performance characteristics 
                directly affect customer satisfaction and long-term durability, justifying higher material costs but 
                requiring accurate pricing calculations to maintain profitability.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                Pigment and Additive Cost Complexities
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Resin pigments and additives represent some of the highest per-unit costs in artistic materials, with 
                premium alcohol inks and metallic powders costing $15-50 per ounce. However, usage rates vary dramatically 
                based on desired opacity, color intensity, and artistic technique. Professional costing requires tracking 
                actual consumption rates rather than estimating based on container sizes.
              </p>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Moreover, specialty additives like glow powders, glass microspheres, or embedded objects add significant 
                material costs while requiring modified mixing and curing processes. Each additive affects working time, 
                cure characteristics, and often necessitates technique adjustments that impact labor efficiency and 
                project timelines.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                Mold Costs and Depreciation Factors
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Quality silicone molds represent significant upfront investments, typically costing $20-200 depending 
                on size and complexity. However, mold lifespan varies dramatically based on resin type, cure temperature, 
                and release agent usage. Professional artists track mold usage cycles and calculate depreciation costs 
                per casting to ensure adequate cost recovery.
              </p>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Custom mold creation adds additional complexity, requiring mold-making materials, prototype development, 
                and significant time investment. These custom tooling costs must be amortized across expected production 
                runs and factored into individual piece pricing to ensure profitability.
              </p>

              <CalculatorCTA position="middle" />

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4">
                Time and Workspace Cost Considerations
              </h2>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Resin art involves multiple distinct time phases that require different costing approaches. Active working 
                time includes mixing, pouring, and manipulation, while passive curing time ties up workspace and equipment 
                without generating additional revenue. Professional pricing accounts for both direct labor and workspace 
                opportunity costs during extended cure cycles.
              </p>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Additionally, resin work requires controlled environmental conditions—consistent temperatures, low humidity, 
                and dust-free spaces—that create ongoing overhead costs. Heating, air conditioning, and air filtration 
                expenses must be factored into project pricing based on actual usage and cure time requirements.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4">
                Real-World Resin Art Pricing Scenarios
              </h2>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Consider pricing a 12" resin art piece: raw materials might total $35 (resin, pigments, mold usage), 
                but professional pricing includes workspace overhead during 72-hour cure time ($18), ventilation and 
                safety equipment costs ($8), mixing supplies and tools ($5), and skilled artistic labor for design, 
                mixing, and finishing work. True project costs often exceed $80 before profit margins.
              </p>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                The complexity multiplies with large-scale pieces, multiple-pour techniques, or embedded object integration. 
                Each technique requires different material usage, extended working times, and often multiple cure cycles. 
                Manual calculations become increasingly error-prone as artistic complexity increases, leading to systematic 
                underpricing that threatens business sustainability.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4">
                Frequently Asked Questions About Resin Art Pricing
              </h2>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                How much should I charge for custom resin art pieces?
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                <strong>Resin art pricing</strong> should reflect true material costs, active working time, workspace 
                overhead, equipment depreciation, and target profit margins. Most successful resin artists target 
                55-70% gross margins to account for technique development time and artistic experimentation costs.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                How do I calculate resin and pigment costs accurately?
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Accurate material costing requires tracking actual consumption rates rather than theoretical calculations. 
                Premium pigments may cost more per ounce but require lower usage rates for equivalent color intensity. 
                Professional artists maintain usage logs to determine true cost-per-piece for different techniques.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                Should I charge separately for design and consultation time?
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Design time should typically be included in piece pricing for standard work but charged separately 
                for complex custom commissions requiring extensive client collaboration. Many artists charge $50-100 
                per hour for detailed design consultation and revision work.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                How do I handle pricing for different resin art sizes?
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Size-based pricing should reflect actual material usage, workspace requirements, and handling complexity 
                rather than simple area calculations. Large pieces require proportionally more setup time, extended 
                cure periods, and often specialized handling equipment that affects true costs.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                What about pricing for resin art workshops and classes?
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Workshop pricing should include all material costs, instruction time, workspace usage, cleanup time, 
                and equipment depreciation. Many successful artists charge $75-150 per student for 3-4 hour workshops, 
                depending on project complexity and local market rates.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4">
                The Professional Approach: Specialized Pricing Tools
              </h2>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Understanding <strong>how to price resin art</strong> professionally means recognizing when manual 
                calculations become inadequate for sustainable artistic business operations. The most successful resin 
                artists have discovered that professional pricing calculators don't just save time—they reveal cost 
                factors that spreadsheet methods consistently miss or underestimate.
              </p>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Modern pricing tools integrate all the complex variables we've discussed: material consumption rates, 
                mold depreciation schedules, workspace overhead allocation, extended curing time costs, and artistic 
                labor valuation. They handle the mathematical complexity while you focus on creating exceptional art 
                and building customer relationships.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                Beyond Basic Material and Time Calculations
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Professional calculators provide insights that manual methods cannot match. They help you understand 
                which techniques and piece sizes truly drive profitability, how pricing adjustments affect your bottom 
                line, and where you might be undervaluing your artistic skills compared to market rates.
              </p>

              <CalculatorCTA position="bottom" />

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4">
                Conclusion: Build a Profitable Resin Art Practice
              </h2>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Learning <strong>resin art pricing</strong> effectively is crucial for building a sustainable artistic 
                business, but it doesn't require overwhelming manual calculations. The complexity we've explored—from 
                precise material measurements to workspace overhead allocation—demonstrates why successful resin artists 
                are moving beyond simple markup pricing methods.
              </p>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Professional pricing tools handle the mathematical complexity while ensuring you capture all material 
                costs, workspace overhead, and artistic labor in your piece pricing. Instead of spending hours calculating 
                resin volumes and pigment costs, you can focus on what drives artistic success: creating stunning pieces 
                and building relationships with collectors who value your work.
              </p>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                The resin artists who thrive in today's competitive market are those who price strategically using 
                professional tools. They understand that accurate pricing isn't just about covering immediate material 
                costs—it's about building a sustainable practice that can invest in premium materials, advanced techniques, 
                and continued artistic development while providing fair compensation for creative expertise.
              </p>

              <div className="mt-12 p-6 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Ready to Transform Your Resin Art Business?
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Join successful resin artists who've discovered the power of professional pricing. Our free calculator 
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
            <Link href="/blog/woodworking-pricing" className="group">
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-4">
                <Image
                  src="https://images.pexels.com/photos/175045/pexels-photo-175045.jpeg?auto=compress&cs=tinysrgb&w=400"
                  alt="Woodworking pricing guide"
                  width={400}
                  height={200}
                  className="w-full h-32 object-cover rounded mb-3"
                />
                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  Woodworking Shop Pricing
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                  Lumber costs, tool wear & project pricing
                </p>
              </div>
            </Link>

            <Link href="/blog/candle-making-pricing" className="group">
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-4">
                <Image
                  src="https://images.pexels.com/photos/6957242/pexels-photo-6957242.jpeg?auto=compress&cs=tinysrgb&w=400"
                  alt="Candle making pricing guide"
                  width={400}
                  height={200}
                  className="w-full h-32 object-cover rounded mb-3"
                />
                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  Candle Making Profits
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                  Wax costs, labor time & pricing strategy
                </p>
              </div>
            </Link>
            
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 opacity-60">
              <Image
                src="https://images.unsplash.com/photo-1565008447742-97f6f38c985c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                alt="CNC machining pricing"
                width={400}
                height={200}
                className="w-full h-32 object-cover rounded mb-3"
              />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                CNC Machining Costs
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                Coming Soon: Material waste & tool wear
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}