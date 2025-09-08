import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Understanding Material Costs: Beyond Filament Weight & Basic Calculations (2025)',
  description: 'Learn how to calculate true material costs including waste, failed prints, bulk pricing tiers, and hidden expenses that impact your maker business profitability.',
  keywords: 'material cost calculation, maker business costs, 3d printing material waste, bulk material pricing, manufacturing cost analysis',
};

const CalculatorCTA = ({ position }: { position: 'top' | 'middle' | 'bottom' }) => {
  const ctaTexts = {
    top: "Skip Complex Material Cost Calculations - Try Our Free Tool",
    middle: "Ready to Calculate Your True Material Costs? Use Our Professional Calculator",
    bottom: "Start Tracking Your Material Costs Professionally Today"
  };

  return (
    <div className="my-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {ctaTexts[position]}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Get accurate material cost calculations in seconds with our professional P&L calculator designed for maker businesses.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          Calculate My Material Costs - Free →
        </Link>
      </div>
    </div>
  );
};

export default function MaterialCostsGuidePage() {
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
            <li className="text-gray-900 dark:text-white">Material Costs Guide</li>
          </ol>
        </nav>

        {/* Article Header */}
        <article className="bg-white dark:bg-slate-800 rounded-lg shadow-lg">
          <div className="p-8">
            <div className="mb-6">
              <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full">
                Business Strategy
              </span>
              <div className="flex items-center mt-3 text-sm text-gray-500 dark:text-gray-400">
                <span>Published January 20, 2025</span>
                <span className="mx-2">•</span>
                <span>6 min read</span>
              </div>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Understanding Material Costs: Beyond Filament Weight & Basic Calculations
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Successful maker businesses understand that <strong>material cost calculation</strong> extends far beyond 
              simple weight measurements or invoice totals. Between waste factors, failed prints, bulk pricing tiers, 
              storage costs, and inventory management, accurate material costing requires sophisticated analysis that 
              many makers overlook completely.
            </p>

            <CalculatorCTA position="top" />

            {/* Hero Image */}
            <div className="mb-8">
              <Image
                src="https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                alt="Various crafting materials organized in a workshop, demonstrating the complexity of material cost tracking for maker businesses"
                width={800}
                height={400}
                className="w-full h-96 object-cover rounded-lg"
                priority
              />
            </div>

            {/* Main Content */}
            <div className="prose prose-xl dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white">
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4">
                Why Simple Material Cost Calculations Fail Maker Businesses
              </h2>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Most makers start by dividing material purchase price by total quantity, assuming this gives accurate 
                per-unit costs. However, <strong>manufacturing cost analysis</strong> reveals that true material 
                costs include numerous hidden factors that can double or triple your actual expenses per finished product.
              </p>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Professional manufacturers understand that material utilization rates, waste factors, quality control 
                rejects, and inventory carrying costs significantly impact profitability. Ignoring these factors leads 
                to systematic underpricing that destroys margins over time.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                The Hidden Material Costs That Destroy Profits
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Beyond obvious purchase prices, maker businesses face numerous material-related expenses that must 
                be tracked and allocated properly for accurate costing:
              </p>

              <ul className="text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                <li><strong>Waste and scrap factors:</strong> Offcuts, test pieces, setup waste, and production rejects</li>
                <li><strong>Failed print/production costs:</strong> Material consumed in unsuccessful attempts</li>
                <li><strong>Quality control testing:</strong> Materials used for calibration and testing procedures</li>
                <li><strong>Inventory carrying costs:</strong> Storage, insurance, and opportunity cost of tied-up capital</li>
                <li><strong>Material degradation:</strong> Filament moisture absorption, paint settling, adhesive aging</li>
                <li><strong>Minimum order quantities:</strong> Bulk purchase requirements and associated storage needs</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4">
                Critical Factors in Professional Material Cost Analysis
              </h2>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                Understanding True Utilization Rates and Waste Factors
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Effective <strong>material cost calculation</strong> requires measuring actual utilization rates rather 
                than theoretical consumption. For example, 3D printing rarely achieves 100% filament utilization due to 
                support structures, purge towers, and print failures that consume material without producing sellable output.
              </p>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Professional operations track utilization rates by material type and production method. Sheet materials 
                might achieve 75-85% utilization in optimized layouts, while complex 3D prints with supports might only 
                reach 60-70% efficiency. These variations dramatically impact true material costs per finished product.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                Bulk Pricing Tiers and Purchase Optimization
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                <strong>Bulk material pricing</strong> creates complex trade-offs between unit costs and cash flow 
                requirements. Lower per-unit costs from bulk purchases must be balanced against storage costs, 
                inventory risks, and opportunity costs of capital investment in materials.
              </p>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Additionally, bulk purchases often force makers to stock slow-moving colors or sizes to meet minimum 
                orders, effectively increasing average material costs when these items age or become obsolete. Professional 
                costing systems account for these inventory management complexities rather than using simple bulk pricing.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                Quality Control and Testing Material Costs
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Consistent quality requires ongoing testing and calibration that consumes materials without producing 
                sellable output. Color matching tests, adhesion samples, dimensional verification, and print setting 
                optimization all require material investments that must be allocated across production runs.
              </p>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Professional operations typically allocate 3-7% of material costs to quality control and testing 
                activities, depending on production complexity and quality requirements. Ignoring these costs leads 
                to systematic underpricing of products requiring strict quality standards.
              </p>

              <CalculatorCTA position="middle" />

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4">
                Inventory Management and Storage Cost Factors
              </h2>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Material inventory represents significant capital investment that generates carrying costs until converted 
                to finished products. Storage space, climate control, inventory insurance, and material handling equipment 
                all contribute to true material costs that must be recovered through product pricing.
              </p>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Additionally, materials can degrade during storage, requiring rotation protocols and occasional disposal 
                of expired inventory. Filament moisture absorption, adhesive shelf life, and paint separation all create 
                material losses that increase effective costs beyond purchase prices.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4">
                Industry-Specific Material Cost Challenges
              </h2>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                3D Printing Material Waste Factors
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                <strong>3D printing material waste</strong> extends beyond support structures to include purge towers, 
                bed adhesion sacrificial layers, print failures, and material changes. Complex multi-color prints can 
                waste 40-60% of loaded filament in purge operations and support structures.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                Sheet Material and Fabric Optimization
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Sheet materials like plywood, acrylic, or fabric require careful layout optimization to maximize 
                utilization. Professional operations use nesting software to achieve 80-90% utilization, while manual 
                layouts often waste 25-35% of material in unusable offcuts and spacing requirements.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4">
                Real-World Material Costing Examples
              </h2>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Consider PLA filament purchased at $25/kg: simple calculation suggests $0.025 per gram. However, 
                professional costing includes 15% support/waste factor, 8% failed print allocation, 5% quality control 
                testing, and 12% inventory carrying costs, bringing true cost to $0.035 per gram - 40% higher than 
                purchase price suggests.
              </p>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Similarly, sheet materials purchased at $15/square foot might achieve only 75% utilization in production, 
                effectively costing $20/square foot of finished product before adding handling, storage, and waste disposal 
                expenses.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4">
                Frequently Asked Questions About Material Cost Calculations
              </h2>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                What percentage should I add for material waste?
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Waste factors vary significantly by production method and material type. 3D printing typically requires 
                20-40% waste allocation, while sheet materials might need 15-25%. CNC machining can waste 30-60% depending 
                on part complexity. Track your actual waste rates for accurate costing.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                How do I handle bulk pricing in cost calculations?
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Use volume-weighted average costs that include storage and carrying costs. If bulk purchasing requires 
                3-month inventory, include financing costs and storage expenses. Consider cash flow impact and obsolescence 
                risk when calculating true bulk pricing benefits.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                Should I track material costs by individual project or batch?
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Both approaches have merit. Project-level tracking provides precise costing but requires detailed record 
                keeping. Batch-level tracking simplifies administration but may mask variations in material efficiency. 
                Most successful operations use batch tracking with periodic project-level verification.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4">
                Building Professional Material Cost Management
              </h2>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Successful maker businesses implement systematic material cost tracking that captures all relevant factors, 
                from purchase prices through waste allocation to inventory carrying costs. This comprehensive approach 
                ensures accurate product costing and sustainable profitability.
              </p>

              <p className="text-gray-600 dark:text-gray-300 mb-8">
                Professional material cost management eliminates pricing surprises and margin erosion by providing 
                accurate, real-time cost data that supports confident pricing decisions and operational improvements 
                across all production activities.
              </p>

              <CalculatorCTA position="bottom" />

            </div>
          </div>
        </article>
      </div>
    </div>
  );
}