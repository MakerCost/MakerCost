import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - MakerCost',
  description: 'Terms of Service and conditions for using MakerCost calculator and services.',
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Terms of Service</h1>
            <p className="text-gray-600">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                By accessing and using MakerCost ("Service"), you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                MakerCost is a web-based profit and loss calculator designed for makers and custom product businesses. 
                The service provides tools for calculating material costs, labor expenses, overhead, and profit margins.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer. 
                You agree to accept responsibility for all activities that occur under your account or password.
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>You must provide accurate and complete information when creating an account</li>
                <li>You are responsible for keeping your account information up to date</li>
                <li>You must not share your account credentials with others</li>
                <li>You must notify us immediately of any unauthorized use of your account</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Acceptable Use</h2>
              <p className="text-gray-700 leading-relaxed mb-4">You agree to use MakerCost only for lawful purposes and in accordance with these Terms. You agree not to:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Use the service for any illegal or unauthorized purpose</li>
                <li>Violate any laws in your jurisdiction</li>
                <li>Transmit any malicious code or attempt to hack the service</li>
                <li>Interfere with or disrupt the service or servers</li>
                <li>Attempt to gain unauthorized access to any part of the service</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data and Privacy</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, 
                to understand our practices regarding the collection and use of your information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Intellectual Property</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                The Service and its original content, features, and functionality are and will remain the exclusive property of MakerCost and its licensors. 
                The Service is protected by copyright, trademark, and other laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Disclaimer of Warranties</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                The information, calculations, and tools provided by MakerCost are for informational purposes only. 
                While we strive for accuracy, we make no guarantees about the completeness, accuracy, or reliability of the calculations or recommendations.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                You acknowledge that any reliance upon any calculations, opinions, advice, or other information provided by the Service 
                is at your sole risk and discretion.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                In no event shall MakerCost, its directors, employees, partners, agents, suppliers, or affiliates be liable for any indirect, 
                incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, 
                or other intangible losses, resulting from your use of the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Termination</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, 
                under our sole discretion, for any reason whatsoever, including without limitation if you breach the Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Changes to Terms</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
                If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Contact Information</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  Email: support@makercost.com<br />
                  Website: <a href="/contact" className="text-blue-600 hover:text-blue-800">Contact Us</a>
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}