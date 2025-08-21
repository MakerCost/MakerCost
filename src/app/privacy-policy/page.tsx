import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - MakerCost',
  description: 'Privacy Policy explaining how MakerCost collects, uses, and protects your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-gray-600">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                MakerCost ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, 
                use, disclose, and safeguard your information when you use our web application and services.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, 
                please do not access the application.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Personal Information</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may collect personally identifiable information that you provide to us such as:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Name and contact information (email address)</li>
                <li>Account credentials (username and password)</li>
                <li>Profile information you choose to provide</li>
                <li>Business information related to your calculations</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Usage Data</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We automatically collect certain information when you use our service:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>IP address and device information</li>
                <li>Browser type and version</li>
                <li>Pages visited and time spent on our service</li>
                <li>Calculation data and project information you create</li>
                <li>Technical data for service improvement</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-700 leading-relaxed mb-4">We use the information we collect to:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Provide, operate, and maintain our service</li>
                <li>Improve and personalize your experience</li>
                <li>Process your calculations and save your projects</li>
                <li>Communicate with you about your account or our service</li>
                <li>Provide customer support</li>
                <li>Detect and prevent fraudulent or unauthorized activity</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Information Sharing and Disclosure</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Service Providers:</strong> We may share your information with trusted third-party service providers who assist us in operating our service</li>
                <li><strong>Legal Requirements:</strong> We may disclose your information if required by law or in response to valid requests by public authorities</li>
                <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred</li>
                <li><strong>Protection of Rights:</strong> We may disclose information to protect our rights, property, or safety, or that of our users</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Security</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, 
                alteration, disclosure, or destruction. These measures include:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and authentication measures</li>
                <li>Secure hosting infrastructure</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                However, no method of transmission over the internet or electronic storage is 100% secure, 
                and we cannot guarantee absolute security.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Data Retention</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, 
                unless a longer retention period is required or permitted by law. When we no longer need your personal information, 
                we will securely delete or anonymize it.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Your Privacy Rights</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Depending on your location, you may have certain rights regarding your personal information:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Access:</strong> Request access to your personal information we hold</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                <li><strong>Objection:</strong> Object to the processing of your personal information</li>
                <li><strong>Withdrawal:</strong> Withdraw consent where processing is based on consent</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                To exercise these rights, please contact us using the information provided below.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Cookies and Tracking Technologies</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use cookies and similar tracking technologies to enhance your experience on our service. 
                Cookies are small data files stored on your device that help us:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Remember your preferences and settings</li>
                <li>Authenticate your account</li>
                <li>Analyze how our service is used</li>
                <li>Improve our service performance</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                You can control cookies through your browser settings, but disabling cookies may affect the functionality of our service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. International Data Transfers</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Your information may be transferred to and processed in countries other than your own. 
                We ensure that such transfers are conducted in accordance with applicable data protection laws 
                and include appropriate safeguards to protect your personal information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Children's Privacy</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our service is not intended for children under the age of 13. We do not knowingly collect personal information 
                from children under 13. If you become aware that a child has provided us with personal information, 
                please contact us, and we will take steps to remove such information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Changes to This Privacy Policy</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new 
                Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy 
                periodically for any changes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Contact Us</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or our privacy practices, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  Email: privacy@makercost.com<br />
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