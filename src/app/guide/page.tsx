import type { Metadata } from 'next';
import UserGuideContent from './UserGuideContent';

export const metadata: Metadata = {
  title: 'User Guide - How to Use MakerCost Calculator',
  description: 'Complete guide to using the MakerCost P&L calculator. Learn how to calculate accurate pricing, understand profit margins, and optimize your maker business costs.',
  keywords: [
    'makercost guide',
    'pricing calculator tutorial',
    'profit and loss guide',
    'maker business tutorial',
    'cost calculation guide',
    'pricing methodology',
    'business calculator help'
  ],
  openGraph: {
    title: 'MakerCost Calculator User Guide - Complete Tutorial',
    description: 'Learn how to use the professional P&L calculator for makers. Step-by-step guide covering materials, labor, overhead, and profit optimization.',
    url: 'https://makercost.com/guide',
    type: 'website',
  },
  twitter: {
    title: 'MakerCost Calculator User Guide - Complete Tutorial',
    description: 'Learn how to use the professional P&L calculator for makers. Step-by-step guide covering materials, labor, overhead, and profit optimization.',
    card: 'summary_large_image',
  },
  alternates: {
    canonical: 'https://makercost.com/guide',
  },
};

export default function GuidePage() {
  return <UserGuideContent />;
}