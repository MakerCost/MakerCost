import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://makercost.com'
  
  // Main pages
  const mainPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/account`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
  ]

  // Blog posts
  const blogPosts = [
    // Featured and established articles
    {
      slug: 'how-to-price-your-3d-prints',
      date: '2025-01-15',
      priority: 0.9,
      changeFrequency: 'monthly' as const,
    },
    {
      slug: 'material-costs-guide',
      date: '2025-01-20',
      priority: 0.7,
      changeFrequency: 'monthly' as const,
    },
    {
      slug: 'time-tracking-guide',
      date: '2025-01-25',
      priority: 0.7,
      changeFrequency: 'monthly' as const,
    },
    {
      slug: 'uv-printing-pricing',
      date: '2025-02-25',
      priority: 0.7,
      changeFrequency: 'monthly' as const,
    },
    
    // Business strategy articles
    {
      slug: 'packaging-shipping-costs',
      date: '2025-02-01',
      priority: 0.7,
      changeFrequency: 'monthly' as const,
    },
    {
      slug: 'volume-pricing-strategies',
      date: '2025-02-05',
      priority: 0.7,
      changeFrequency: 'monthly' as const,
    },
    {
      slug: 'market-research-pricing',
      date: '2025-02-10',
      priority: 0.7,
      changeFrequency: 'monthly' as const,
    },

    // Industry-specific guides - recently completed
    {
      slug: 'rug-tufting-pricing',
      date: '2025-03-01',
      priority: 0.6,
      changeFrequency: 'monthly' as const,
    },
    {
      slug: 'ceramics-studio-pricing',
      date: '2025-02-28',
      priority: 0.6,
      changeFrequency: 'monthly' as const,
    },
    {
      slug: 'vinyl-cutting-profits',
      date: '2025-02-25',
      priority: 0.6,
      changeFrequency: 'monthly' as const,
    },
    {
      slug: 'soap-making-business',
      date: '2025-02-22',
      priority: 0.6,
      changeFrequency: 'monthly' as const,
    },
    {
      slug: 'jewelry-making-costs',
      date: '2025-02-20',
      priority: 0.6,
      changeFrequency: 'monthly' as const,
    },
    {
      slug: 'sublimation-printing',
      date: '2025-02-18',
      priority: 0.6,
      changeFrequency: 'monthly' as const,
    },
    {
      slug: 'leather-crafting-business',
      date: '2025-02-15',
      priority: 0.6,
      changeFrequency: 'monthly' as const,
    },
    {
      slug: 'pottery-wheel-business',
      date: '2025-02-12',
      priority: 0.6,
      changeFrequency: 'monthly' as const,
    },

    // Established industry articles
    {
      slug: 'candle-making-pricing',
      date: '2024-03-22',
      priority: 0.6,
      changeFrequency: 'monthly' as const,
    },
    {
      slug: 'laser-cutting-pricing',
      date: '2023-11-08',
      priority: 0.6,
      changeFrequency: 'monthly' as const,
    },
    {
      slug: 'woodworking-pricing',
      date: '2024-07-14',
      priority: 0.6,
      changeFrequency: 'monthly' as const,
    },
    {
      slug: 'embroidery-pricing',
      date: '2023-08-22',
      priority: 0.6,
      changeFrequency: 'monthly' as const,
    },
    {
      slug: 'cnc-machining-pricing',
      date: '2024-03-15',
      priority: 0.6,
      changeFrequency: 'monthly' as const,
    },
  ].map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: post.changeFrequency,
    priority: post.priority,
  }))

  return [
    ...mainPages,
    ...blogPosts,
  ]
}