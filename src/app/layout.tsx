import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { PostHogProvider } from "@/contexts/PostHogProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { GA4Provider } from "@/components/analytics/GA4Provider";
import ConsentBanner from "@/components/analytics/ConsentBanner";
import PageEngagement from "@/components/analytics/PageEngagement";
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
  title: "MakerCost",
  description: "Professional P&L calculator for makers and custom product businesses",
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/makercost-logo-new.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GA4Provider>
          <PostHogProvider>
            <AuthProvider>
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
            </AuthProvider>
          </PostHogProvider>
        </GA4Provider>
      </body>
    </html>
  );
}
