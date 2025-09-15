import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'MakerCost Blog - Tips and Guides for Makers',
  description: 'Learn about pricing, profit optimization, and business strategies for makers, 3D printing entrepreneurs, and custom product businesses.',
};

export default function BlogPage() {
  const blogPosts = [
    {
      title: 'How to Price Your 3D Prints: The Complete Guide for Makers',
      slug: 'how-to-price-your-3d-prints',
      excerpt: 'Discover the complexities of 3D print pricing and learn why using a professional calculator is the smartest approach for maximizing your profits.',
      date: '2025-01-15',
      readTime: '8 min read',
      category: '3D Printing',
      image: 'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      featured: true
    },
    {
      title: 'Understanding Material Costs: Beyond Filament Weight',
      slug: 'material-costs-guide',
      excerpt: 'Learn how to calculate true material costs including waste, failed prints, and hidden expenses.',
      date: '2025-01-20',
      readTime: '6 min read',
      category: '3D Printing',
      image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      featured: false
    },
    {
      title: 'Time Tracking for Makers: Valuing Your Work Properly',
      slug: 'time-tracking-guide',
      excerpt: 'Master the art of tracking and pricing your time across design, printing, and post-processing.',
      date: '2025-01-25',
      readTime: '7 min read',
      category: 'Business',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      featured: false
    },
    {
      title: 'Packaging and Shipping: Hidden Profit Killers',
      slug: 'packaging-shipping-costs',
      excerpt: 'Avoid common mistakes that eat into your margins with proper packaging cost calculations.',
      date: '2025-02-01',
      readTime: '5 min read',
      category: 'Business',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      featured: false
    },
    {
      title: 'Scaling Your 3D Printing Business: Volume Pricing Strategies',
      slug: 'volume-pricing-strategies',
      excerpt: 'Learn when and how to offer volume discounts without sacrificing profitability.',
      date: '2025-02-05',
      readTime: '9 min read',
      category: 'Business',
      image: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      featured: false
    },
    {
      title: 'Market Research for Makers: Competitive Pricing Analysis',
      slug: 'market-research-pricing',
      excerpt: 'Research your competition and position your pricing strategically in the marketplace.',
      date: '2025-02-10',
      readTime: '6 min read',
      category: 'Strategy',
      image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      featured: false
    },
    // Industry-Specific Pricing Guides
    {
      title: 'Candle Making Profits: Wax Costs, Labor Time & Pricing Strategy',
      slug: 'candle-making-pricing',
      excerpt: 'Master candle making costs from wax and wicks to fragrance oils, molds, and labor time.',
      date: '2024-03-22',
      readTime: '7 min read',
      category: 'Candle Making',
      image: 'https://images.pexels.com/photos/6957242/pexels-photo-6957242.jpeg?auto=compress&cs=tinysrgb&w=800',
      featured: false
    },
    {
      title: 'Laser Cutting Business: Material Costs, Machine Time & Profit Margins',
      slug: 'laser-cutting-pricing',
      excerpt: 'Calculate laser cutting costs including material waste, machine depreciation, and power consumption.',
      date: '2023-11-08',
      readTime: '8 min read',
      category: 'Laser Cutting',
      image: 'https://images.pexels.com/photos/5691656/pexels-photo-5691656.jpeg?auto=compress&cs=tinysrgb&w=800',
      featured: false
    },
    {
      title: 'UV Printing Profitability: Ink Costs, Substrate Pricing & Custom Orders',
      slug: 'uv-printing-pricing',
      excerpt: 'Price UV printing jobs with accurate ink consumption, substrate costs, and setup time calculations.',
      date: '2025-02-25',
      readTime: '6 min read',
      category: 'UV Printing',
      image: 'https://images.pexels.com/photos/3635300/pexels-photo-3635300.jpeg?auto=compress&cs=tinysrgb&w=800',
      featured: false
    },
    {
      title: 'Rug Tufting Business: Yarn Costs, Tool Depreciation & Time Tracking',
      slug: 'rug-tufting-pricing',
      excerpt: 'Master rug tufting costs from yarn weight calculations to backing materials and finishing time.',
      date: '2025-03-01',
      readTime: '7 min read',
      category: 'Rug Tufting',
      image: 'https://images.pexels.com/photos/4792078/pexels-photo-4792078.jpeg?auto=compress&cs=tinysrgb&w=800',
      featured: false
    },
    {
      title: 'Ceramics Studio Pricing: Clay, Firing Costs & Glazing Expenses',
      slug: 'ceramics-studio-pricing',
      excerpt: 'Calculate ceramics costs including clay weight, kiln firing, glazes, and studio overhead.',
      date: '2025-02-28',
      readTime: '8 min read',
      category: 'Ceramics',
      image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      featured: false
    },
    {
      title: 'Woodworking Shop: Lumber Costs, Tool Wear & Project Pricing',
      slug: 'woodworking-pricing',
      excerpt: 'Price woodworking projects with lumber waste, tool depreciation, and finishing material costs.',
      date: '2024-07-14',
      readTime: '9 min read',
      category: 'Woodworking',
      image: 'https://images.pexels.com/photos/175045/pexels-photo-175045.jpeg?auto=compress&cs=tinysrgb&w=800',
      featured: false
    },
    {
      title: 'Embroidery Business: Thread Costs, Digitizing Time & Machine Hours',
      slug: 'embroidery-pricing',
      excerpt: 'Calculate embroidery costs from thread consumption to digitizing labor and machine depreciation.',
      date: '2023-08-22',
      readTime: '6 min read',
      category: 'Embroidery',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      featured: false
    },
    {
      title: 'Vinyl Cutting Profits: Material Costs, Weeding Time & Transfer Pricing',
      slug: 'vinyl-cutting-profits',
      excerpt: 'Master vinyl cutting costs including material waste, weeding labor, and application complexity.',
      date: '2025-02-25',
      readTime: '7 min read',
      category: 'Vinyl Cutting',
      image: 'https://images.unsplash.com/photo-1609205264399-e3d8e655fc30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      featured: false
    },
    {
      title: 'Soap Making Business: Oil Costs, Curing Time & Packaging Expenses',
      slug: 'soap-making-business',
      excerpt: 'Price handmade soaps with accurate oil costs, labor time, and packaging material calculations.',
      date: '2025-02-22',
      readTime: '6 min read',
      category: 'Soap Making',
      image: 'https://images.unsplash.com/photo-1607748851584-d8aca2d90993?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      featured: false
    },
    {
      title: 'Jewelry Making Costs: Metal Prices, Stone Costs & Labor Valuation',
      slug: 'jewelry-making-costs',
      excerpt: 'Calculate jewelry costs with precious metal fluctuations, stone pricing, and intricate labor time.',
      date: '2025-02-20',
      readTime: '8 min read',
      category: 'Jewelry Making',
      image: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      featured: false
    },
    {
      title: 'Sublimation Printing: Transfer Costs, Substrate Pricing & Heat Press Time',
      slug: 'sublimation-printing',
      excerpt: 'Price sublimation products with transfer paper, ink, substrate, and heat press depreciation costs.',
      date: '2025-02-18',
      readTime: '7 min read',
      category: 'Sublimation',
      image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      featured: false
    },
    {
      title: 'Leather Crafting Business: Hide Costs, Tool Investment & Finishing Time',
      slug: 'leather-crafting-business',
      excerpt: 'Master leather crafting costs from hide selection to tool depreciation and hand-finishing labor.',
      date: '2025-02-15',
      readTime: '9 min read',
      category: 'Leather Crafting',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      featured: false
    },
    {
      title: 'Resin Art Pricing: Material Costs, Curing Time & Mold Expenses',
      slug: 'resin-art-pricing',
      excerpt: 'Calculate resin art costs including epoxy, pigments, molds, and extended curing time overhead.',
      date: '2025-04-15',
      readTime: '6 min read',
      category: 'Resin Art',
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      comingSoon: true
    },
    {
      title: 'CNC Machining Costs: Material Waste, Tool Wear & Programming Time',
      slug: 'cnc-machining-pricing',
      excerpt: 'Price CNC projects with material waste factors, cutting tool depreciation, and programming overhead.',
      date: '2024-03-15',
      readTime: '9 min read',
      category: 'CNC Machining',
      image: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      featured: false
    },
    {
      title: 'Pottery Wheel Business: Clay Costs, Firing Schedules & Glazing Profits',
      slug: 'pottery-wheel-business',
      excerpt: 'Master pottery costs from clay preparation to kiln schedules and multi-layer glazing processes.',
      date: '2025-02-12',
      readTime: '8 min read',
      category: 'Pottery',
      image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      featured: false
    }
  ];

  return (
    <div className="bg-gray-50 dark:bg-slate-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            MakerCost Blog
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Expert tips, guides, and strategies to help makers, 3D printing entrepreneurs, 
            and custom product businesses maximize their profits and grow their operations.
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <div key={post.slug} className="group">
              {post.comingSoon ? (
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  {/* Featured Image with Overlay */}
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      width={400}
                      height={256}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Overlay with brand name */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                      <div className="absolute top-4 left-4">
                        <span className="bg-white/90 px-3 py-1 text-sm font-semibold text-gray-900 rounded-full">
                          MakerCost
                        </span>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h2 className="text-white font-bold text-lg leading-tight line-clamp-2">
                          {post.title}
                        </h2>
                      </div>
                    </div>
                    
                    {/* Coming Soon Badge */}
                    <div className="absolute top-4 right-4">
                      <span className="bg-yellow-400 text-yellow-900 px-3 py-1 text-sm font-semibold rounded-full">
                        Coming Soon
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        {post.category}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {post.readTime}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(post.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                      
                      <button
                        disabled
                        className="text-sm text-gray-400 cursor-not-allowed"
                      >
                        Coming Soon
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link href={`/blog/${post.slug}`} className="block">
                  <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                    {/* Featured Image with Overlay */}
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={post.image}
                        alt={post.title}
                        width={400}
                        height={256}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Overlay with brand name */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                        <div className="absolute top-4 left-4">
                          <span className="bg-white/90 px-3 py-1 text-sm font-semibold text-gray-900 rounded-full">
                            MakerCost
                          </span>
                        </div>
                        <div className="absolute bottom-4 left-4 right-4">
                          <h2 className="text-white font-bold text-lg leading-tight line-clamp-2 hover:text-blue-200 transition-colors">
                            {post.title}
                          </h2>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                          {post.category}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {post.readTime}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(post.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                        
                        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                          Read More →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-12">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Price Your Products Professionally?
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Stop guessing at your pricing. Use our professional calculator to ensure you're covering all costs and maximizing your profits.
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-lg"
            >
              Try Our Free Calculator →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}