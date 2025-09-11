import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { PostHogProvider } from "@/contexts/PostHogProvider";
import { DataSyncProvider } from "@/components/providers/DataSyncProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { GA4Provider } from "@/components/analytics/GA4Provider";
import ConsentBanner from "@/components/analytics/ConsentBanner";
import PageEngagement from "@/components/analytics/PageEngagement";
import StructuredData, { 
  organizationSchema, 
  websiteSchema, 
  calculatorAppSchema 
} from "@/components/seo/StructuredData";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "MakerCost - Professional P&L Calculator for Makers",
    template: "%s | MakerCost"
  },
  description: "Professional profit & loss calculator for makers, 3D printing businesses, and custom product entrepreneurs. Calculate true costs, optimize pricing, and maximize profits.",
  keywords: [
    "maker calculator",
    "3d printing pricing",
    "profit calculator",
    "cost calculator",
    "business calculator",
    "maker business",
    "custom product pricing",
    "handmade business",
    "craft business calculator",
    "manufacturing cost calculator"
  ],
  authors: [{ name: "MakerCost Team" }],
  creator: "MakerCost",
  publisher: "MakerCost",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://makercost.com',
    siteName: 'MakerCost',
    title: 'MakerCost - Professional P&L Calculator for Makers',
    description: 'Professional profit & loss calculator for makers, 3D printing businesses, and custom product entrepreneurs. Calculate true costs, optimize pricing, and maximize profits.',
    images: [
      {
        url: 'https://makercost.com/makercost-logo-new.png',
        width: 1200,
        height: 630,
        alt: 'MakerCost - Professional Calculator for Makers',
        type: 'image/png',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@makercost',
    creator: '@makercost',
    title: 'MakerCost - Professional P&L Calculator for Makers',
    description: 'Professional profit & loss calculator for makers, 3D printing businesses, and custom product entrepreneurs.',
    images: ['https://makercost.com/makercost-logo-new.png'],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
  alternates: {
    canonical: 'https://makercost.com',
  },
  category: 'business tools',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/makercost-logo-new.png',
  },
  manifest: '/manifest.json',
  metadataBase: new URL('https://makercost.com'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="color-scheme" content="light dark" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="canonical" href="https://makercost.com" />
        
        {/* System Dark Mode Detection - FOUC Prevention */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.documentElement.classList.add('dark');
              }
            `,
          }}
        />
        
        {/* Structured Data */}
        <StructuredData data={organizationSchema} />
        <StructuredData data={websiteSchema} />
        <StructuredData data={calculatorAppSchema} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GA4Provider>
          <PostHogProvider>
            <AuthProvider>
              <DataSyncProvider>
                <ToastProvider>
                  <PageEngagement>
                    <div className="min-h-screen flex flex-col">
                      <Header />
                      <main className="flex-1">
                        {children}
                      </main>
                      <Footer />
                    </div>
                    <ConsentBanner />
                  </PageEngagement>
                </ToastProvider>
              </DataSyncProvider>
            </AuthProvider>
          </PostHogProvider>
        </GA4Provider>
      </body>
    </html>
  );
}
