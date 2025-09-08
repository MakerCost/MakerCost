import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/private/',
          '/account/quotes/', // Private user quotes
          '/tmp/',
          '*.json',
        ],
      },
      {
        userAgent: 'GPTBot',
        disallow: '/', // Block OpenAI's web crawler
      },
      {
        userAgent: 'ChatGPT-User',
        disallow: '/', // Block ChatGPT user requests
      },
      {
        userAgent: 'Google-Extended',
        disallow: '/', // Block Google's AI training crawler
      },
    ],
    sitemap: 'https://makercost.com/sitemap.xml',
  }
}