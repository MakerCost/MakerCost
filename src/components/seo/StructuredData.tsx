interface StructuredDataProps {
  data: Record<string, any>
}

export default function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

// Organization Schema
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "MakerCost",
  "url": "https://makercost.com",
  "logo": {
    "@type": "ImageObject",
    "url": "https://makercost.com/makercost-logo-new.png",
    "width": 512,
    "height": 512
  },
  "sameAs": [
    "https://twitter.com/makercost",
    "https://github.com/makercost"
  ],
  "description": "Professional profit & loss calculator for makers, 3D printing businesses, and custom product entrepreneurs.",
  "foundingDate": "2023",
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "availableLanguage": "English"
  }
}

// Website Schema
export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "MakerCost",
  "url": "https://makercost.com",
  "description": "Professional profit & loss calculator for makers, 3D printing businesses, and custom product entrepreneurs.",
  "publisher": {
    "@type": "Organization",
    "name": "MakerCost"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://makercost.com/blog?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}

// SoftwareApplication Schema for Calculator
export const calculatorAppSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "MakerCost Calculator",
  "url": "https://makercost.com",
  "description": "Professional profit & loss calculator for makers and custom product businesses. Calculate material costs, labor time, overhead, and optimize pricing strategies.",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web Browser",
  "price": "0",
  "priceCurrency": "USD",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "category": "Free"
  },
  "featureList": [
    "Material cost calculation",
    "Labor time tracking",
    "Overhead cost allocation",
    "Profit margin optimization",
    "Quote generation",
    "Multi-currency support",
    "Export capabilities"
  ],
  "publisher": {
    "@type": "Organization",
    "name": "MakerCost"
  }
}

// Article Schema Generator
export function generateArticleSchema(article: {
  title: string
  description: string
  slug: string
  date: string
  readTime: string
  category: string
  image?: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.description,
    "url": `https://makercost.com/blog/${article.slug}`,
    "datePublished": article.date,
    "dateModified": article.date,
    "author": {
      "@type": "Organization",
      "name": "MakerCost Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "MakerCost",
      "logo": {
        "@type": "ImageObject",
        "url": "https://makercost.com/makercost-logo-new.png",
        "width": 512,
        "height": 512
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://makercost.com/blog/${article.slug}`
    },
    "image": article.image || "https://makercost.com/makercost-logo-new.png",
    "articleSection": article.category,
    "wordCount": "2000", // Approximate based on read time
    "timeRequired": article.readTime,
    "inLanguage": "en-US",
    "isAccessibleForFree": true
  }
}

// FAQ Schema Generator
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }
}

// Breadcrumb Schema Generator
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  }
}