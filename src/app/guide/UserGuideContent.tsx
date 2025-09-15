'use client';

import { useState } from 'react';
import Link from 'next/link';

interface GuideSection {
  id: string;
  title: string;
  icon: string;
  description: string;
  content: React.ReactNode;
}

const UserGuideContent = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections: GuideSection[] = [
    {
      id: 'overview',
      title: 'Overview',
      icon: '📊',
      description: 'Understanding the MakerCost methodology',
      content: (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Welcome to MakerCost</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              MakerCost is a professional Profit & Loss (P&L) calculator designed specifically for makers, custom product businesses,
              and small manufacturers. It helps you calculate true costs, optimize pricing, and maximize profits using proven business methodologies.
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">💡 The MakerCost Methodology</h3>
            <p className="text-blue-800 dark:text-blue-200 mb-3">
              Our calculator follows the fundamental business principle that <strong>Price = Cost + Profit</strong>.
              We help you calculate your true costs across five critical areas:
            </p>
            <ul className="space-y-2 text-blue-800 dark:text-blue-200">
              <li>• <strong>Direct Materials:</strong> Raw materials, packaging, and decorative elements</li>
              <li>• <strong>Labor Costs:</strong> Your time and expertise valued properly</li>
              <li>• <strong>Machine Depreciation:</strong> Equipment wear and replacement costs</li>
              <li>• <strong>Overhead Expenses:</strong> Rent, utilities, insurance, and business operations</li>
              <li>• <strong>Profit Margin:</strong> Your reward for risk and business growth</li>
            </ul>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
              <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3">✅ What You'll Learn</h3>
              <ul className="space-y-2 text-green-800 dark:text-green-200">
                <li>• How to price products profitably</li>
                <li>• Calculate true material costs including waste</li>
                <li>• Value your labor appropriately</li>
                <li>• Factor in overhead expenses</li>
                <li>• Generate professional quotes</li>
                <li>• Analyze profit margins effectively</li>
              </ul>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-3">⚠️ Common Pricing Mistakes</h3>
              <ul className="space-y-2 text-yellow-800 dark:text-yellow-200">
                <li>• Forgetting to include all material costs</li>
                <li>• Undervaluing your time and skills</li>
                <li>• Ignoring overhead expenses</li>
                <li>• Not accounting for equipment depreciation</li>
                <li>• Setting profit margins too low</li>
                <li>• Inconsistent pricing across products</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'pricing-info',
      title: 'Pricing Information',
      icon: '💰',
      description: 'Setting up your sale price, currency, and VAT',
      content: (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Pricing Information Setup</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              The pricing information section is where you define the fundamental parameters for your calculation.
              This determines how the P&L analysis will be structured and calculated.
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">💵 Sale Price Configuration</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Sale Price Amount</h4>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    This is the price you charge your customers. You can set this as either:
                  </p>
                  <ul className="space-y-1 text-gray-700 dark:text-gray-300 ml-4">
                    <li>• <strong>Per Unit:</strong> Price for each individual item</li>
                    <li>• <strong>Total Project:</strong> Fixed price for the entire job</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Units Count</h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    Number of units you're producing. This affects material quantities and helps calculate per-unit costs
                    for better pricing decisions on future orders.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Fixed Charge</h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    One-time charges like setup fees, design costs, or tooling charges that don't scale with quantity.
                    Common examples: initial design fee ($50), mold setup ($100), custom tooling ($200).
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">🌍 Currency Selection</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                Choose from 15+ supported currencies. This affects:
              </p>
              <ul className="space-y-1 text-gray-700 dark:text-gray-300 ml-4">
                <li>• Display formatting for all monetary values</li>
                <li>• PDF quote generation</li>
                <li>• Export calculations</li>
                <li>• Saved project calculations</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">🧾 VAT/Tax Configuration</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">VAT Rate</h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    Set your local tax rate (VAT, sales tax, GST, etc.). Common rates: US (varies by state),
                    EU (15-27%), UK (20%), Canada (5-15%).
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Tax Inclusive vs. Exclusive</h4>
                  <div className="space-y-2 text-gray-700 dark:text-gray-300">
                    <p><strong>Inclusive:</strong> Your sale price already includes tax (common in EU, UK)</p>
                    <p><strong>Exclusive:</strong> Tax is added on top of your sale price (common in US, Canada)</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-lg border border-amber-200 dark:border-amber-800">
              <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-100 mb-3">💡 Pro Tips</h3>
              <ul className="space-y-2 text-amber-800 dark:text-amber-200">
                <li>• <strong>Start with per-unit pricing</strong> for easier scaling and comparison</li>
                <li>• <strong>Include setup costs</strong> in fixed charges for small quantities</li>
                <li>• <strong>Know your local tax requirements</strong> - some areas require tax-inclusive pricing</li>
                <li>• <strong>Consider minimum order quantities</strong> to make fixed charges worthwhile</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'materials',
      title: 'Materials & Inventory',
      icon: '📦',
      description: 'Managing material costs and inventory',
      content: (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Materials & Inventory Management</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Accurate material costing is crucial for profitable pricing. MakerCost supports complex material
              calculations including waste factors, multiple categories, and extensive unit conversions.
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">🏷️ Material Categories</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Main Materials</h4>
                  <p className="text-blue-800 dark:text-blue-200 text-sm">
                    Primary raw materials that become the product. Supports waste percentage calculations.
                  </p>
                  <p className="text-blue-700 dark:text-blue-300 text-xs mt-2">
                    Examples: Wood, plastic filament, metal sheets, fabric, resin
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded border border-green-200 dark:border-green-800">
                  <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">Packaging</h4>
                  <p className="text-green-800 dark:text-green-200 text-sm">
                    Materials used to package and ship your products to customers.
                  </p>
                  <p className="text-green-700 dark:text-green-300 text-xs mt-2">
                    Examples: Boxes, bubble wrap, labels, tissue paper, branded packaging
                  </p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded border border-purple-200 dark:border-purple-800">
                  <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Decorations</h4>
                  <p className="text-purple-800 dark:text-purple-200 text-sm">
                    Finishing materials that enhance the product's appearance or functionality.
                  </p>
                  <p className="text-purple-700 dark:text-purple-300 text-xs mt-2">
                    Examples: Paint, stain, hardware, decorative elements, adhesives
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">⚖️ Units & Measurements</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                MakerCost supports 30+ unit types across different measurement systems:
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Quantity</h4>
                  <ul className="text-gray-700 dark:text-gray-300 space-y-1">
                    <li>• Pieces</li>
                    <li>• Sheets</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Weight</h4>
                  <ul className="text-gray-700 dark:text-gray-300 space-y-1">
                    <li>• Grams, Kilograms</li>
                    <li>• Ounces, Pounds</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Length</h4>
                  <ul className="text-gray-700 dark:text-gray-300 space-y-1">
                    <li>• mm, cm, meters</li>
                    <li>• Inches, feet, yards</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Volume & Area</h4>
                  <ul className="text-gray-700 dark:text-gray-300 space-y-1">
                    <li>• Liters, gallons</li>
                    <li>• Square meters/feet</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">🗑️ Waste Percentage</h3>
              <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">
                  Main materials support waste percentage to account for material loss during production.
                  This is crucial for accurate costing in manufacturing processes.
                </p>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded border border-yellow-200 dark:border-yellow-800">
                  <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">Common Waste Percentages by Process:</h4>
                  <ul className="text-yellow-800 dark:text-yellow-200 space-y-1 text-sm">
                    <li>• <strong>3D Printing:</strong> 5-10% (support material, failed prints)</li>
                    <li>• <strong>Laser Cutting:</strong> 10-20% (kerf, layout optimization)</li>
                    <li>• <strong>CNC Machining:</strong> 15-30% (chips, setup pieces)</li>
                    <li>• <strong>Woodworking:</strong> 15-25% (cuts, defects, sanding)</li>
                    <li>• <strong>Fabric Work:</strong> 10-15% (pattern layout, mistakes)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">💾 Inventory Integration</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                For registered users, MakerCost provides a materials library where you can:
              </p>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li>• Save frequently used materials with costs and specifications</li>
                <li>• Import materials directly into projects with one click</li>
                <li>• Maintain consistent pricing across projects</li>
                <li>• Track material cost changes over time</li>
              </ul>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-800">
              <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-3">⚠️ Common Material Costing Mistakes</h3>
              <ul className="space-y-2 text-red-800 dark:text-red-200">
                <li>• <strong>Forgetting small materials:</strong> Screws, adhesives, finishes add up</li>
                <li>• <strong>Not accounting for waste:</strong> Always add 5-20% depending on process</li>
                <li>• <strong>Using old prices:</strong> Material costs fluctuate - update regularly</li>
                <li>• <strong>Ignoring packaging costs:</strong> Professional packaging affects perceived value</li>
                <li>• <strong>Wrong unit conversions:</strong> Double-check when mixing metric/imperial</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'cost-parameters',
      title: 'Cost Parameters',
      icon: '⚙️',
      description: 'Labor, machines, and overhead calculations',
      content: (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Cost Parameters & Operating Expenses</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              This section captures all the costs of running your maker business beyond raw materials.
              These are often overlooked but are essential for sustainable pricing.
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">👷 Labor Costs</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Labor Hours</h4>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    Total time spent on this project, including:
                  </p>
                  <ul className="space-y-1 text-gray-700 dark:text-gray-300 ml-4">
                    <li>• Design and planning time</li>
                    <li>• Setup and preparation</li>
                    <li>• Active production time</li>
                    <li>• Finishing and quality control</li>
                    <li>• Packaging and shipping prep</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Hourly Rate</h4>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    What to charge per hour for your skilled work. Consider:
                  </p>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded border border-blue-200 dark:border-blue-800">
                    <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Rate Calculation Framework:</h5>
                    <ul className="text-blue-800 dark:text-blue-200 text-sm space-y-1">
                      <li>• <strong>Minimum:</strong> Local minimum wage + 50%</li>
                      <li>• <strong>Skilled trades:</strong> $25-50/hour depending on complexity</li>
                      <li>• <strong>Specialized skills:</strong> $50-100+/hour for expert-level work</li>
                      <li>• <strong>Consider:</strong> No benefits, no paid time off, business risk</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">🏭 Machine Depreciation</h3>
              <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">
                  Equipment costs money and wears out over time. MakerCost calculates the true hourly cost
                  of using your machines, including depreciation, maintenance, and power consumption.
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Supported Machine Types</h4>
                    <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <p>• <strong>Laser:</strong> CO2, Fiber, UV</p>
                      <p>• <strong>3D Printing:</strong> FDM, Resin</p>
                      <p>• <strong>CNC:</strong> Router, Mill, Lathe</p>
                      <p>• <strong>Woodworking:</strong> Saws, Presses</p>
                      <p>• <strong>Textiles:</strong> Embroidery, Sewing</p>
                      <p>• <strong>Plus 60+ more types</strong></p>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Cost Factors</h4>
                    <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <p>• <strong>Purchase Price:</strong> Original cost</p>
                      <p>• <strong>Depreciation:</strong> Annual % (10-25%)</p>
                      <p>• <strong>Operating Hours:</strong> Annual usage</p>
                      <p>• <strong>Maintenance:</strong> Annual service costs</p>
                      <p>• <strong>Power:</strong> kW consumption</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">🏢 Overhead Calculator</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Business expenses that must be covered by all projects. The calculator helps you determine
                your hourly overhead rate across 8 key categories:
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">🏠 Rent/Lease</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Workshop space, utilities, property costs</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">⚡ Utilities</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Electricity, water, internet, phone</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">💻 Digital Infrastructure</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Software, cloud services, website hosting</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">🛡️ Insurance & Professional</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Liability, accounting, legal services</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">📢 Marketing & Advertising</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Social media ads, business cards, shows</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">📝 Office Supplies</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Paper, ink, packaging, general supplies</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">🚚 Transportation & Delivery</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Vehicle costs, shipping, delivery services</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">🎯 Miscellaneous & Contingency</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Unexpected expenses, buffer for growth</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded border border-yellow-200 dark:border-yellow-800">
                <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">Overhead Rate Calculation</h4>
                <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                  <strong>Monthly Overhead ÷ Monthly Working Hours = Hourly Overhead Rate</strong><br/>
                  Example: $2,000/month ÷ 160 hours = $12.50/hour overhead rate
                </p>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
              <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3">💡 Cost Parameter Best Practices</h3>
              <ul className="space-y-2 text-green-800 dark:text-green-200">
                <li>• <strong>Track your time:</strong> Use timers to get accurate labor hours</li>
                <li>• <strong>Include all tasks:</strong> Don't forget setup, cleanup, and admin time</li>
                <li>• <strong>Regular rate reviews:</strong> Adjust hourly rates as skills improve</li>
                <li>• <strong>Machine utilization:</strong> Higher usage = lower per-hour costs</li>
                <li>• <strong>Overhead allocation:</strong> Update monthly for accuracy</li>
                <li>• <strong>Power costs:</strong> Don't ignore electricity for high-power equipment</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'pl-breakdown',
      title: 'P&L Analysis',
      icon: '📈',
      description: 'Understanding profit margins and profitability',
      content: (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Profit & Loss Breakdown Analysis</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              The P&L breakdown shows you exactly where your money comes from and where it goes.
              Understanding these metrics is crucial for making informed pricing decisions and growing your business profitably.
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">💰 Revenue Components</h3>
              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Gross Sale Price</h4>
                  <p className="text-blue-800 dark:text-blue-200 text-sm">
                    Total amount charged to customer including VAT/tax (if applicable). This is what appears on your invoice.
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded border border-green-200 dark:border-green-800">
                  <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">Net Sale Price</h4>
                  <p className="text-green-800 dark:text-green-200 text-sm">
                    Revenue after removing VAT/tax. This is the money actually available for covering costs and profit.
                  </p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded border border-purple-200 dark:border-purple-800">
                  <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Shipping Revenue</h4>
                  <p className="text-purple-800 dark:text-purple-200 text-sm">
                    Additional revenue from shipping charges (when quotes include shipping costs).
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">📊 Cost Structure</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Direct Costs (Cost of Goods Sold)</h4>
                  <ul className="space-y-1 text-gray-700 dark:text-gray-300 ml-4 text-sm">
                    <li>• <strong>Main Materials:</strong> Raw materials including waste percentage</li>
                    <li>• <strong>Packaging Materials:</strong> Boxes, protective materials, labels</li>
                    <li>• <strong>Decorative Materials:</strong> Finishes, hardware, accessories</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Operating Expenses</h4>
                  <ul className="space-y-1 text-gray-700 dark:text-gray-300 ml-4 text-sm">
                    <li>• <strong>Labor Costs:</strong> Your time valued at appropriate hourly rate</li>
                    <li>• <strong>Machine Depreciation:</strong> Equipment usage costs</li>
                    <li>• <strong>Overhead Allocation:</strong> Your share of business operating costs</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">🎯 Key Profit Metrics</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Gross Profit</h4>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded border border-green-200 dark:border-green-800">
                    <p className="text-green-800 dark:text-green-200 text-sm mb-2">
                      <strong>Net Revenue - Direct Material Costs</strong>
                    </p>
                    <div className="space-y-1 text-xs text-green-700 dark:text-green-300">
                      <p>• <span className="text-green-600 dark:text-green-400 font-medium">60%+ = Excellent</span> (Strong material cost control)</p>
                      <p>• <span className="text-yellow-600 dark:text-yellow-400 font-medium">40-60% = Good</span> (Healthy margins)</p>
                      <p>• <span className="text-red-600 dark:text-red-400 font-medium">&lt;40% = Concerning</span> (Review material costs)</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Operating Profit (Net Profit)</h4>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded border border-blue-200 dark:border-blue-800">
                    <p className="text-blue-800 dark:text-blue-200 text-sm mb-2">
                      <strong>Gross Profit - Operating Expenses</strong>
                    </p>
                    <div className="space-y-1 text-xs text-blue-700 dark:text-blue-300">
                      <p>• <span className="text-green-600 dark:text-green-400 font-medium">20%+ = Excellent</span> (Strong business model)</p>
                      <p>• <span className="text-yellow-600 dark:text-yellow-400 font-medium">10-20% = Acceptable</span> (Room for improvement)</p>
                      <p>• <span className="text-red-600 dark:text-red-400 font-medium">&lt;10% = Risky</span> (Insufficient profit buffer)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">🔍 What-If Analysis</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                The What-If Matrix helps you explore different pricing scenarios by showing how changes in
                price and quantity affect your profitability. This is invaluable for:
              </p>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li>• <strong>Volume discounting:</strong> Find the break-even point for quantity discounts</li>
                <li>• <strong>Price optimization:</strong> See the profit impact of price changes</li>
                <li>• <strong>Market positioning:</strong> Compare profitability across different price points</li>
                <li>• <strong>Customer negotiations:</strong> Know your minimum acceptable prices</li>
              </ul>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-lg border border-amber-200 dark:border-amber-800">
              <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-100 mb-3">⚠️ Profit Analysis Red Flags</h3>
              <ul className="space-y-2 text-amber-800 dark:text-amber-200">
                <li>• <strong>Negative net profit:</strong> You're losing money - raise prices or reduce costs</li>
                <li>• <strong>Low gross profit (&lt;40%):</strong> Material costs too high relative to price</li>
                <li>• <strong>High material percentage (&gt;60%):</strong> Consider cheaper alternatives or price increase</li>
                <li>• <strong>Labor below minimum wage:</strong> You're undervaluing your skills</li>
                <li>• <strong>Zero overhead allocation:</strong> Business expenses aren't covered</li>
                <li>• <strong>Inconsistent per-unit margins:</strong> Pricing strategy needs refinement</li>
              </ul>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
              <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3">💡 Profit Optimization Tips</h3>
              <ul className="space-y-2 text-green-800 dark:text-green-200">
                <li>• <strong>Track trends:</strong> Monitor profit margins across projects to identify patterns</li>
                <li>• <strong>Price testing:</strong> Use What-If analysis before committing to prices</li>
                <li>• <strong>Cost reduction focus:</strong> Small material cost reductions have big profit impacts</li>
                <li>• <strong>Value-based pricing:</strong> Price on value delivered, not just cost-plus</li>
                <li>• <strong>Minimum margins:</strong> Set minimum acceptable profit margins and stick to them</li>
                <li>• <strong>Volume strategies:</strong> Use quantity breaks to encourage larger orders</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'quotes',
      title: 'Quote Generation',
      icon: '📋',
      description: 'Creating professional customer quotes',
      content: (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Professional Quote Generation</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Transform your calculations into professional, customer-ready quotes. MakerCost's quote system
              supports multi-product quotes, shipping integration, discounts, and professional PDF export.
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">📄 Quote Components</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Project Information</h4>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                    <li>• <strong>Project Name:</strong> Internal reference for your records</li>
                    <li>• <strong>Client Name:</strong> Customer or company name</li>
                    <li>• <strong>Quote Number:</strong> Auto-generated unique identifier</li>
                    <li>• <strong>Project Date:</strong> Quote creation date</li>
                    <li>• <strong>Delivery Date:</strong> Expected completion date</li>
                    <li>• <strong>Payment Terms:</strong> Payment conditions (Net 30, etc.)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Product Details</h4>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                    <li>• <strong>Product Name:</strong> What you're making</li>
                    <li>• <strong>Quantity:</strong> Number of units</li>
                    <li>• <strong>Unit Price:</strong> Price per item</li>
                    <li>• <strong>Total Price:</strong> Extended line total</li>
                    <li>• <strong>Materials List:</strong> Optional breakdown</li>
                    <li>• <strong>Specifications:</strong> Custom requirements</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">🛒 Multi-Product Quotes</h3>
              <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">
                  Create comprehensive quotes with multiple products, each with their own calculations and pricing:
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded border border-blue-200 dark:border-blue-800">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Product Switching</h4>
                    <p className="text-blue-800 dark:text-blue-200 text-sm">
                      Switch between products in a quote to adjust calculations while preserving all data.
                    </p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded border border-green-200 dark:border-green-800">
                    <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">Independent Pricing</h4>
                    <p className="text-green-800 dark:text-green-200 text-sm">
                      Each product maintains its own materials, labor, and cost parameters for accurate pricing.
                    </p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded border border-purple-200 dark:border-purple-800">
                    <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Unified Quote</h4>
                    <p className="text-purple-800 dark:text-purple-200 text-sm">
                      All products combine into a single professional quote with totals and terms.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">🚚 Shipping Integration</h3>
              <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">
                  Add shipping costs directly to quotes with flexible configuration options:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Shipping Options</h4>
                    <ul className="space-y-1 text-gray-700 dark:text-gray-300 text-sm">
                      <li>• Customer pays actual shipping cost</li>
                      <li>• Fixed shipping rate</li>
                      <li>• Free shipping (absorbed in product price)</li>
                      <li>• Local pickup option</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">VAT/Tax Handling</h4>
                    <ul className="space-y-1 text-gray-700 dark:text-gray-300 text-sm">
                      <li>• Shipping VAT inclusive or exclusive</li>
                      <li>• Separate tax calculation for shipping</li>
                      <li>• Automatic P&L impact calculation</li>
                      <li>• Professional invoice formatting</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">💸 Discount Management</h3>
              <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  Apply percentage-based discounts while maintaining visibility into profit impact:
                </p>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded border border-yellow-200 dark:border-yellow-800">
                  <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">⚠️ Discount Strategy Guidelines</h4>
                  <ul className="space-y-1 text-yellow-800 dark:text-yellow-200 text-sm">
                    <li>• <strong>Volume discounts:</strong> Offer discounts for larger quantities to reduce per-unit costs</li>
                    <li>• <strong>Repeat customers:</strong> 5-10% discount for loyal clients</li>
                    <li>• <strong>Early payment:</strong> 2-3% for payment within 10 days</li>
                    <li>• <strong>Monitor margins:</strong> Ensure discounts don't eliminate profit</li>
                    <li>• <strong>Set minimums:</strong> Don't discount below break-even point</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">📁 Quote Management</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Draft Status</h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Work in progress quotes that can be modified and refined before sending to customers.
                  </p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-700 p-4 rounded">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Final Status</h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Completed quotes ready for customer presentation with locked calculations.
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-700 p-4 rounded">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Completed Status</h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Accepted and delivered projects for historical tracking and business analysis.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">📄 PDF Export Features</h3>
              <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  Generate professional PDF quotes that represent your business professionally:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Professional Formatting</h4>
                    <ul className="space-y-1 text-gray-700 dark:text-gray-300 text-sm">
                      <li>• Company branding and logo</li>
                      <li>• Professional layout and typography</li>
                      <li>• Clear pricing tables</li>
                      <li>• Terms and conditions</li>
                      <li>• Contact information</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Customization Options</h4>
                    <ul className="space-y-1 text-gray-700 dark:text-gray-300 text-sm">
                      <li>• Include/exclude cost breakdown</li>
                      <li>• Show per-unit pricing</li>
                      <li>• Custom notes and specifications</li>
                      <li>• Delivery and payment terms</li>
                      <li>• Project timeline information</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
              <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3">💡 Quote Best Practices</h3>
              <ul className="space-y-2 text-green-800 dark:text-green-200">
                <li>• <strong>Clear descriptions:</strong> Use specific product names and specifications</li>
                <li>• <strong>Realistic timelines:</strong> Add buffer time for unexpected delays</li>
                <li>• <strong>Payment terms:</strong> Be clear about when and how you expect payment</li>
                <li>• <strong>Revision policy:</strong> Include terms for design changes and revisions</li>
                <li>• <strong>Expiration date:</strong> Set quote validity period (30-60 days typical)</li>
                <li>• <strong>Professional presentation:</strong> Well-formatted quotes win more business</li>
                <li>• <strong>Follow up:</strong> Contact customers within a week of sending quotes</li>
              </ul>
            </div>
          </div>
        </div>
      )
    }
  ];

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                MakerCost User Guide
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Complete guide to using the professional P&L calculator for makers
              </p>
            </div>
            <Link
              href="/"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Try Calculator
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <nav className="bg-white dark:bg-slate-800 rounded-lg shadow dark:shadow-slate-700/10 p-4">
                <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Guide Sections</h2>
                <div className="space-y-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        activeSection === section.id
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="mr-2">{section.icon}</span>
                        <div>
                          <div className="font-medium">{section.title}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {section.description}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="space-y-12">
              {sections.map((section) => (
                <section key={section.id} id={section.id}>
                  <div className="bg-white dark:bg-slate-800 rounded-lg shadow dark:shadow-slate-700/10 p-8">
                    {section.content}
                  </div>
                </section>
              ))}
            </div>

            {/* Footer CTA */}
            <div className="mt-12 bg-blue-600 rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">
                Ready to Start Pricing Like a Pro?
              </h2>
              <p className="text-blue-100 mb-6">
                Use the MakerCost calculator to apply everything you've learned and optimize your business pricing.
              </p>
              <Link
                href="/"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-block"
              >
                Launch Calculator
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserGuideContent;