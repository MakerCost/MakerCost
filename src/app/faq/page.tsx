'use client';

import { useState } from 'react';

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  const faqSections = [
    {
      title: 'Getting Started',
      items: [
        {
          question: 'What is MakerCost and who is it for?',
          answer: 'MakerCost is a professional profit and loss calculator designed specifically for makers, crafters, and custom product businesses. It helps you calculate accurate pricing by considering material costs, labor, overhead, machine depreciation, and profit margins.'
        },
        {
          question: 'How do I get started with MakerCost?',
          answer: 'Simply sign up for a free account at makercost.com. You can start using the calculator immediately to create your first project and calculate pricing for your products.'
        },
        {
          question: 'Is MakerCost really free?',
          answer: 'Yes! MakerCost offers a completely free plan that includes all basic calculation features. You can create up to 5 projects and access core functionality without any cost. Pro features like material photo uploads and advanced reporting are available with our paid plan.'
        }
      ]
    },
    {
      title: 'Using the Calculator',
      items: [
        {
          question: 'How do I calculate the cost of my product?',
          answer: 'Start by entering your project information, then add materials with their costs and quantities. Include labor hours and rates, set your overhead costs, and add any machine usage. MakerCost will automatically calculate your total costs, suggested pricing, and profit margins.'
        },
        {
          question: 'What types of materials can I track?',
          answer: 'You can track any type of material including raw materials, packaging, decorations, and supplies. Each material can be priced per unit or as a total cost, and you can specify quantities, units, and waste percentages.'
        },
        {
          question: 'How do I account for machine depreciation?',
          answer: 'In the Cost Parameters section, you can add machines with their purchase cost, lifetime hours, and usage for the current project. MakerCost automatically calculates depreciation costs and allows you to add profit margins on machine usage.'
        },
        {
          question: 'What is overhead and how do I calculate it?',
          answer: 'Overhead includes all business expenses that aren\'t directly tied to materials or labor, such as rent, utilities, insurance, and marketing. You can either enter a flat hourly rate or use our overhead calculator to determine the rate based on your monthly expenses and working hours.'
        }
      ]
    },
    {
      title: 'Projects and Quotes',
      items: [
        {
          question: 'What\'s the difference between a project and a quote?',
          answer: 'A project is a single product calculation with all its costs and pricing. A quote can contain multiple products and includes additional features like shipping, discounts, and customer information for presentation to clients.'
        },
        {
          question: 'Can I create quotes with multiple products?',
          answer: 'Yes! You can add multiple products to a single quote. Each product maintains its own pricing calculations, and the quote shows totals, discounts, shipping, and VAT calculations.'
        },
        {
          question: 'How do I export my quotes?',
          answer: 'Pro users can export quotes to PDF format for professional presentation to clients. The export includes your branding, detailed breakdowns, and terms and conditions.'
        }
      ]
    },
    {
      title: 'Account and Billing',
      items: [
        {
          question: 'What\'s included in the Pro plan?',
          answer: 'Pro includes unlimited projects, material photo uploads, advanced reporting, cloud sync across devices, PDF/Excel exports, priority support, what-if analysis tools, and upcoming team collaboration features.'
        },
        {
          question: 'Can I upgrade or downgrade my plan?',
          answer: 'Yes, you can change your plan anytime from your account settings. Upgrades take effect immediately, while downgrades take effect at the end of your current billing period.'
        },
        {
          question: 'Is there a free trial for Pro features?',
          answer: 'Yes! We offer a 14-day free trial of Pro features. No credit card required to start your trial.'
        },
        {
          question: 'Do you offer refunds?',
          answer: 'We offer a 30-day money-back guarantee. If you\'re not satisfied with MakerCost Pro, contact us within 30 days for a full refund.'
        }
      ]
    },
    {
      title: 'Technical Support',
      items: [
        {
          question: 'How do I save my work?',
          answer: 'All your work is automatically saved to your account when you\'re signed in. Free users can access their projects from the same device, while Pro users enjoy cloud sync across all devices.'
        },
        {
          question: 'Can I access MakerCost on mobile devices?',
          answer: 'Yes! MakerCost is fully responsive and works on all devices including smartphones and tablets. Pro users can sync their work across all devices.'
        },
        {
          question: 'What browsers are supported?',
          answer: 'MakerCost works on all modern browsers including Chrome, Firefox, Safari, and Edge. We recommend keeping your browser updated for the best experience.'
        },
        {
          question: 'How do I get help if I\'m stuck?',
          answer: 'You can contact our support team through the contact form, check this FAQ section, or email us directly at support@makercost.com. Pro users receive priority support with faster response times.'
        }
      ]
    },
    {
      title: 'Privacy and Security',
      items: [
        {
          question: 'Is my data secure?',
          answer: 'Yes! We use industry-standard encryption to protect your data both in transit and at rest. Your business information and calculations are private and secure.'
        },
        {
          question: 'Do you share my data with third parties?',
          answer: 'No, we do not sell or share your personal business data with third parties. Please see our Privacy Policy for complete details on how we handle your information.'
        },
        {
          question: 'Can I delete my account and data?',
          answer: 'Yes, you can delete your account and all associated data anytime from your account settings. This action is permanent and cannot be undone.'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about MakerCost. 
            Can't find what you're looking for? Contact our support team.
          </p>
        </div>

        {/* Search Box */}
        <div className="mb-12">
          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search FAQ..."
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-8">
          {faqSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {section.items.map((item, itemIndex) => {
                  const globalIndex = sectionIndex * 100 + itemIndex; // Unique index across all sections
                  const isOpen = openItems.has(globalIndex);
                  
                  return (
                    <div key={itemIndex}>
                      <button
                        onClick={() => toggleItem(globalIndex)}
                        className="w-full px-6 py-4 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors"
                      >
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium text-gray-900 pr-4">
                            {item.question}
                          </h3>
                          <svg
                            className={`w-5 h-5 text-gray-500 transform transition-transform ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-4">
                          <p className="text-gray-700 leading-relaxed">
                            {item.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <div className="bg-blue-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Still have questions?
            </h2>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Our support team is here to help. Get in touch and we'll get back to you as soon as possible.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact Support
              </a>
              <a
                href="mailto:support@makercost.com"
                className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Email Us Directly
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}