import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Woodworking Shop Pricing: Lumber Costs, Tool Wear & Project Pricing (2025)',
  description: 'Master woodworking project pricing with accurate lumber waste, tool depreciation, and finishing costs. Professional pricing strategies for sustainable woodworking profits.',
  keywords: 'woodworking pricing, how to price woodworking projects, lumber cost calculation, woodworking business profits, tool depreciation costs',
};

const CalculatorCTA = ({ position }: { position: 'top' | 'middle' | 'bottom' }) => {
  const ctaTexts = {
    top: "Skip Complex Woodworking Cost Calculations - Try Our Free Tool",
    middle: "Ready to Price Your Woodworking Projects Accurately? Use Our Calculator",
    bottom: "Start Pricing Your Woodworking Services Professionally Today"
  };

  return (
    <div className="my-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {ctaTexts[position]}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Get accurate pricing for woodworking projects in seconds with our professional P&L calculator designed for custom woodworking shops.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          Calculate My Woodworking Prices - Free →
        </Link>
      </div>
    </div>
  );
};

export default function WoodworkingPricingPage() {
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
            <li className="text-gray-900 dark:text-white">Woodworking Shop Pricing</li>
          </ol>
        </nav>

        {/* Article Header */}
        <article className="bg-white dark:bg-slate-800 rounded-lg shadow-lg">
          <div className="p-8">
            <div className="mb-6">
              <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full">
                Woodworking Guide
              </span>
              <div className="flex items-center mt-3 text-sm text-gray-500 dark:text-gray-400">
                <span>Published January 18, 2025</span>
                <span className="mx-2">•</span>
                <span>9 min read</span>
              </div>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Woodworking Shop Pricing: Lumber Costs, Tool Wear & Project Pricing
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Pricing custom woodworking projects involves complexities that extend far beyond board feet calculations. 
              Between lumber waste factors, tool depreciation costs, finishing material expenses, and skilled labor 
              valuations, pricing errors can quickly turn profitable projects into financial losses. Let's explore why 
              professional woodworking pricing requires sophisticated cost analysis methods.
            </p>

            <CalculatorCTA position="top" />

            {/* Hero Image */}
            <div className="mb-8">
              <Image
                src="https://images.pexels.com/photos/175045/pexels-photo-175045.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Professional woodworker using precision tools in well-organized workshop with quality lumber, showcasing the craftsmanship and equipment investment requiring accurate cost calculation"
                width={800}
                height={400}
                className="w-full h-96 object-cover rounded-lg"
                priority
              />
            </div>

            {/* Main Content */}
            <div className="prose prose-xl dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white">
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4">
                Why Woodworking Pricing Is More Complex Than Board Feet
              </h2>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                When you first start a <strong>woodworking business</strong>, the temptation is to calculate lumber costs, 
                estimate time, add markup, and quote the project. But successful custom woodworking shops know that 
                sustainable <strong>woodworking pricing</strong> requires accounting for dozens of variables that novice 
                woodworkers consistently underestimate or ignore completely.
              </p>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Unlike mass production, custom woodworking involves skilled craftsmanship, premium materials, and precision 
                tools that represent significant investments. Your shop setup, tool collection, and expertise took years 
                to develop—these investments must be recovered through proper project pricing to ensure long-term sustainability 
                and continued business growth.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                The Hidden Costs That Destroy Woodworking Profits
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Beyond the obvious lumber and hardware costs, woodworking businesses face numerous hidden expenses 
                that can quickly eliminate profitability if not properly tracked and included in pricing:
              </p>

              <ul className="text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                <li><strong>Lumber waste factors:</strong> Defect removal, grain matching, and cutting optimization losses</li>
                <li><strong>Tool depreciation costs:</strong> Blade replacement, sharpening services, and equipment wear</li>
                <li><strong>Shop overhead expenses:</strong> Dust collection, heating, lighting, and workspace maintenance</li>
                <li><strong>Finishing material costs:</strong> Stains, sealers, topcoats, and application supplies</li>
                <li><strong>Setup and breakdown time:</strong> Machine adjustments, jig creation, and workspace preparation</li>
                <li><strong>Quality control labor:</strong> Sanding progression, assembly time, and final inspection</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4">
                Critical Cost Factors in Professional Woodworking Operations
              </h2>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                Lumber Cost Calculations Beyond Simple Board Feet
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Accurate <strong>lumber cost calculation</strong> requires far more sophistication than multiplying board 
                feet by price per foot. Professional woodworkers account for species-specific waste factors, grain matching 
                requirements, and defect allowances. Premium hardwoods often have 20-30% waste factors when accounting for 
                splits, knots, and grain direction requirements.
              </p>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Additionally, project complexity dramatically affects lumber utilization rates. A simple table requires 
                different waste calculations than intricate cabinetry with complex joinery and precise grain matching. 
                Professional pricing systems account for these project-specific variables rather than using generic 
                waste percentages across all work.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                Tool Depreciation and Equipment Cost Recovery
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                <strong>Tool depreciation costs</strong> represent one of the most overlooked expenses in woodworking 
                pricing. Quality woodworking tools require significant upfront investment and ongoing maintenance to 
                perform at professional standards. Router bits, saw blades, chisels, and sanders all wear with use 
                and must be replaced or serviced regularly.
              </p>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Beyond replacement costs, tool maintenance includes sharpening services, calibration, and periodic 
                overhauls. A professional table saw blade might cost $150 and last 500 hours of use, creating a 
                $0.30 per hour depreciation cost that must be factored into project pricing. Multiply this across 
                dozens of tools, and equipment costs become substantial.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                Finishing Materials and Process Complexity
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Finishing costs extend far beyond the price of stain and polyurethane. Professional finishes require 
                multiple coats, sanding between applications, and controlled drying environments. Each finish type—oil, 
                lacquer, shellac, or water-based polyurethane—has different material costs, application requirements, 
                and cure times that affect project scheduling and profitability.
              </p>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Moreover, finishing consumables include sandpaper, tack cloths, brushes, spray equipment maintenance, 
                and ventilation costs. These seemingly minor expenses accumulate quickly across multiple projects and 
                must be systematically tracked and recovered through proper pricing.
              </p>

              <CalculatorCTA position="middle" />

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4">
                Labor Valuation and Skill-Based Pricing
              </h2>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Woodworking labor involves multiple skill levels and process types that require different pricing approaches. 
                Rough milling operates at different rates than fine joinery work. Complex curved work demands premium 
                pricing compared to straight-line operations. Hand-tool work typically commands higher rates than 
                machine-assisted processes due to skill requirements and time investment.
              </p>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Professional woodworkers track time across different project phases—design, milling, assembly, sanding, 
                and finishing—because each phase has different skill requirements and shop rates. This granular tracking 
                enables accurate project costing and helps identify the most profitable types of work.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4">
                Real-World Woodworking Pricing Scenarios
              </h2>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Consider pricing a custom dining table: raw lumber might cost $400, but professional pricing accounts 
                for 25% waste factor ($100), tool depreciation during 15 hours of machining ($45), finishing materials 
                and supplies ($75), and skilled labor across design, milling, assembly, and finishing phases. True 
                material and direct costs often exceed $800 before any profit margin.
              </p>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                The complexity multiplies with built-in cabinetry, curved work, or antique reproduction projects. Each 
                requires specialized techniques, longer time investments, and often custom jigs or templates. Manual 
                calculations become increasingly error-prone as project complexity increases, leading to systematic 
                underpricing that threatens business sustainability.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4">
                Frequently Asked Questions About Woodworking Pricing
              </h2>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                How do I calculate fair pricing for custom woodworking projects?
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                <strong>Woodworking project pricing</strong> should reflect true material costs (including waste), skilled 
                labor rates, tool depreciation, shop overhead, and target profit margins. Most successful shops target 
                45-60% gross margins to account for business growth investments and economic fluctuations.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                What hourly rate should I charge for woodworking services?
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Skilled woodworking rates vary significantly by region and specialization, typically ranging from $45-125 
                per hour. Rates should reflect your skill level, tool investment, shop overhead, and local market conditions. 
                Specialized work like restoration or curved elements commands premium rates.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                How do I price design time and consultations?
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Design time should be priced separately from fabrication work, typically at $75-150 per hour depending 
                on complexity and your design expertise. Many shops include basic design time in project pricing but 
                charge separately for extensive revisions or complex engineering requirements.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                Should I offer different pricing for different wood species?
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Yes, different species have varying material costs, workability characteristics, and waste factors. 
                Exotic hardwoods require different handling, tooling, and finishing approaches than domestic species. 
                Pricing should reflect these material and processing differences accurately.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                How do I handle pricing for repair and restoration work?
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Restoration work often requires diagnostic time, specialty materials, and unpredictable challenges. 
                Many shops charge diagnostic fees upfront and provide ranges rather than fixed quotes. Restoration 
                typically commands premium rates due to specialized knowledge requirements.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4">
                The Professional Approach: Specialized Pricing Tools
              </h2>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Understanding <strong>how to price woodworking projects</strong> professionally means recognizing when 
                manual calculations become inadequate for sustainable business operations. The most successful custom 
                woodworking shops have discovered that professional pricing calculators don't just save time—they reveal 
                cost factors that spreadsheet methods consistently miss.
              </p>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Modern pricing tools integrate all the complex variables we've discussed: lumber waste factors, tool 
                depreciation schedules, finishing material costs, multi-phase labor tracking, and overhead allocation. 
                They handle the mathematical complexity while you focus on creating exceptional woodwork and building 
                customer relationships.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                Beyond Basic Material and Time Calculations
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Professional calculators provide insights that manual methods cannot match. They help you understand 
                which project types truly drive profitability, how pricing adjustments affect your bottom line, and 
                where you might be undervaluing your skilled craftsmanship compared to market rates.
              </p>

              <CalculatorCTA position="bottom" />

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4">
                Conclusion: Build a Sustainable Woodworking Business
              </h2>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Learning <strong>woodworking pricing</strong> effectively is crucial for building a sustainable custom 
                woodworking business, but it doesn't require overwhelming manual calculations. The complexity we've 
                explored—from lumber waste optimization to tool depreciation tracking—demonstrates why successful shops 
                are moving beyond simple markup pricing methods.
              </p>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Professional pricing tools handle the mathematical complexity while ensuring you capture all material 
                costs, skilled labor rates, and overhead expenses in your project quotes. Instead of spending hours 
                calculating board feet and tool depreciation, you can focus on what drives business success: creating 
                exceptional woodwork and delighting customers with your craftsmanship.
              </p>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                The woodworking businesses that thrive in today's competitive market are those who price strategically 
                using professional tools. They understand that accurate pricing isn't just about covering immediate 
                costs—it's about building a sustainable operation that can invest in better tools, premium materials, 
                and continued skill development while providing fair compensation for expert craftsmanship.
              </p>

              <div className="mt-12 p-6 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Ready to Transform Your Woodworking Business Pricing?
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Join successful woodworking shops who've discovered the power of professional pricing. Our free calculator 
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
                src="https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                alt="Resin art pricing"
                width={400}
                height={200}
                className="w-full h-32 object-cover rounded mb-3"
              />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Resin Art Pricing
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                Coming Soon: Material costs & curing time
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}