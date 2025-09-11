import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy - MakerCost',
  description: 'Cookie Policy explaining how MakerCost uses cookies and similar technologies to enhance your experience.',
};

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Cookie Policy</h1>
            <p className="text-gray-600 dark:text-gray-300">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          <div className="prose prose-gray dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">1. What Are Cookies</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Cookies are small text files that are placed on your device (computer, smartphone, or tablet) when you visit our website. 
                They are widely used to make websites work more efficiently and to provide information to website owners.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Cookies contain information that is transferred to your device's hard drive. They help us recognize your device 
                and store some information about your preferences or past actions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">2. How We Use Cookies</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                MakerCost uses cookies to enhance your browsing experience and provide personalized services. 
                We use cookies for the following purposes:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li>To remember your login status and preferences</li>
                <li>To analyze how visitors use our website</li>
                <li>To improve our website's performance and functionality</li>
                <li>To provide personalized content and recommendations</li>
                <li>To ensure security and prevent fraud</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">3. Types of Cookies We Use</h2>
              
              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Necessary Cookies</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                    These cookies are essential for the website to function properly. They cannot be disabled as they are necessary for core functionality.
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Examples:</strong> Session management, security tokens, CSRF protection, authentication status, basic user preferences
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    <strong>Duration:</strong> Session cookies (deleted when you close your browser) or persistent cookies (up to 1 year)
                  </p>
                </div>

                <div className="border border-gray-200 dark:border-gray-600 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Analytics Cookies</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                    These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Examples:</strong> Google Analytics, page views, user behavior patterns, traffic sources, device information
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    <strong>Duration:</strong> Up to 2 years
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    <strong>Third Parties:</strong> Google Analytics, PostHog Analytics
                  </p>
                </div>

                <div className="border border-gray-200 dark:border-gray-600 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Marketing Cookies</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                    These cookies are used to track visitors across websites to display relevant and personalized advertisements.
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Examples:</strong> Ad targeting, conversion tracking, remarketing campaigns, social media integration
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    <strong>Duration:</strong> Up to 1 year
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    <strong>Third Parties:</strong> Google Ads, Facebook Pixel (if applicable)
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">4. Third-Party Cookies</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Some cookies on our website are set by third-party services. We use these services to enhance functionality and analyze usage:
              </p>
              
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Google Analytics</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    We use Google Analytics to understand how users interact with our website.
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Learn more: <a href="https://policies.google.com/privacy" className="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a>
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Supabase Authentication</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    We use Supabase for user authentication and data storage, which may set necessary cookies for security.
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Learn more: <a href="https://supabase.com/privacy" className="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">Supabase Privacy Policy</a>
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">5. Managing Your Cookie Preferences</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Cookie Consent Banner</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                When you first visit our website, you'll see a cookie consent banner that allows you to choose your cookie preferences:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                <li><strong>Accept All:</strong> Allow all cookies including analytics and marketing</li>
                <li><strong>Necessary Only:</strong> Only allow essential cookies required for basic functionality</li>
                <li><strong>Customize:</strong> Choose specific types of cookies to allow or block</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Browser Settings</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                You can also control cookies through your browser settings. Here's how to manage cookies in popular browsers:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
                <li><strong>Firefox:</strong> Preferences → Privacy & Security → Cookies and Site Data</li>
                <li><strong>Safari:</strong> Preferences → Privacy → Cookies and website data</li>
                <li><strong>Edge:</strong> Settings → Cookies and site permissions → Cookies and site data</li>
              </ul>
              
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                <strong>Note:</strong> Disabling certain cookies may affect the functionality of our website and your user experience.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">6. Cookie Retention</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Different cookies have different retention periods:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li><strong>Session Cookies:</strong> Automatically deleted when you close your browser</li>
                <li><strong>Persistent Cookies:</strong> Remain on your device for a specified period (from 30 days to 2 years)</li>
                <li><strong>Essential Cookies:</strong> Remain active as long as needed for core functionality</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">7. Changes to This Cookie Policy</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                We may update this Cookie Policy from time to time to reflect changes in our practices or for operational, legal, or regulatory reasons. 
                We will notify you of any significant changes by updating the "Last updated" date at the top of this policy.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                We encourage you to review this Cookie Policy periodically to stay informed about how we use cookies.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">8. Contact Us</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                If you have any questions about this Cookie Policy or our use of cookies, please contact us:
              </p>
              <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300">
                  Email: makercostapp@gmail.com<br />
                  Website: <a href="/contact" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">Contact Us</a><br />
                  Privacy Policy: <a href="/privacy-policy" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">View Privacy Policy</a>
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">9. Your Rights</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Under applicable data protection laws (such as GDPR and CCPA), you have the following rights regarding cookies:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li><strong>Right to Information:</strong> Be informed about what cookies we use and why</li>
                <li><strong>Right to Consent:</strong> Give or withdraw consent for non-essential cookies</li>
                <li><strong>Right to Access:</strong> Request information about cookies stored on your device</li>
                <li><strong>Right to Object:</strong> Object to the use of certain cookies</li>
                <li><strong>Right to Deletion:</strong> Request deletion of cookies (where technically feasible)</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                To exercise these rights, please use our cookie consent banner or contact us using the information provided above.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}