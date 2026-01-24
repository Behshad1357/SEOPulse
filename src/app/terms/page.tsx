import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | SEOPulse",
  description: "Terms of Service for SEOPulse - AI-powered SEO analytics platform",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-gray-900">Terms of Service</h1>
          <p className="text-gray-500 mt-2">Last updated: January 24, 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-sm border p-8 space-y-8">
          
          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              By accessing or using SEOPulse (&quot;Service&quot;), you agree to be bound by these Terms of Service. 
              If you disagree with any part of these terms, you may not access the Service. These Terms apply 
              to all visitors, users, and others who access or use the Service.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
            <p className="text-gray-600 leading-relaxed">
              SEOPulse is an AI-powered SEO analytics platform that integrates with Google Search Console 
              to provide insights, recommendations, and tracking for website owners. The Service includes 
              dashboard analytics, AI-generated insights, keyword tracking, and SEO recommendations.
            </p>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p>When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms.</p>
              <p>You are responsible for safeguarding the password used to access the Service and for any activities or actions under your password.</p>
              <p>You agree not to disclose your password to any third party and to notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</p>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Google API Services</h2>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p>SEOPulse uses Google API Services to access your Google Search Console data. By using our Service, you also agree to be bound by Google&apos;s Terms of Service.</p>
              <p>We access only the data necessary to provide our Service, specifically Google Search Console performance data. We do not store your raw Google data permanently; it is fetched in real-time and cached temporarily for performance.</p>
              <p>You can revoke our access to your Google data at any time through the Settings page or through your Google Account settings.</p>
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Subscription and Payments</h2>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p>Some features of SEOPulse require a paid subscription. By subscribing, you agree to pay all fees associated with your chosen plan.</p>
              <p>Subscriptions are billed in advance on a monthly or annual basis depending on your selection. You may cancel your subscription at any time through your account settings.</p>
              <p>Refunds are handled on a case-by-case basis. Contact support for refund requests within 14 days of purchase.</p>
            </div>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Acceptable Use</h2>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p>You agree not to use the Service:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                <li>To submit false or misleading information</li>
                <li>To upload or transmit viruses or any other type of malicious code</li>
                <li>To interfere with or circumvent the security features of the Service</li>
              </ul>
            </div>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Data and Privacy</h2>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p>
                Your privacy is important to us. Please review our{" "}
                <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>, 
                which explains how we collect, use, and protect your personal information.
              </p>
              <p>By using SEOPulse, you consent to the collection and use of information as outlined in our Privacy Policy.</p>
            </div>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Intellectual Property</h2>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p>The Service and its original content, features, and functionality are and will remain the exclusive property of SEOPulse and its licensors.</p>
              <p>The Service is protected by copyright, trademark, and other laws. Our trademarks and trade dress may not be used in connection with any product or service without prior written consent.</p>
            </div>
          </section>

          {/* Section 9 - UPDATED */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Disclaimer</h2>
            <div className="text-gray-600 leading-relaxed space-y-3 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="font-semibold text-gray-800">
                THE SERVICE IS PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS WITHOUT ANY WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED.
              </p>
              <p>
                SEOPulse does not warrant that the Service will be uninterrupted, timely, secure, or error-free. 
                Results obtained from the use of the Service may not be accurate or reliable.
              </p>
              <p className="font-semibold text-gray-800">
                SEO RESULTS AND RECOMMENDATIONS ARE PROVIDED FOR INFORMATIONAL PURPOSES ONLY AND ARE NOT GUARANTEED. 
                SEOPULSE IS NOT A LAWYER, FINANCIAL ADVISOR, OR CERTIFIED SEO CONSULTANT. 
                CONSULT APPROPRIATE PROFESSIONALS FOR SPECIFIC ADVICE.
              </p>
              <p>
                No advice or information obtained through the Service shall create any warranty not expressly stated in these Terms.
              </p>
            </div>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Limitation of Liability</h2>
            <p className="text-gray-600 leading-relaxed">
              In no event shall SEOPulse, nor its directors, employees, partners, agents, suppliers, or affiliates, 
              be liable for any indirect, incidental, special, consequential, or punitive damages, including without 
              limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access 
              to or use of or inability to access or use the Service.
            </p>
          </section>

          {/* Section 11 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Indemnification</h2>
            <p className="text-gray-600 leading-relaxed">
              You agree to defend, indemnify, and hold harmless SEOPulse and its licensees, employees, contractors, 
              agents, officers, and directors from and against any and all claims, damages, obligations, losses, 
              liabilities, costs, or debt arising from your use of the Service or violation of these Terms.
            </p>
          </section>

          {/* Section 12 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Termination</h2>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason, including breach of these Terms.</p>
              <p>Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may do so through the Settings page.</p>
            </div>
          </section>

          {/* Section 13 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Governing Law</h2>
            <p className="text-gray-600 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which 
              SEOPulse operates, without regard to its conflict of law provisions. Any disputes arising from these 
              Terms will be resolved in the courts of that jurisdiction.
            </p>
          </section>

          {/* Section 14 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Changes to Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              We reserve the right to modify or replace these Terms at any time. If a revision is material, we will 
              try to provide at least 30 days&apos; notice prior to any new terms taking effect. What constitutes a 
              material change will be determined at our sole discretion. Your continued use of the Service after 
              changes constitutes acceptance of the new Terms.
            </p>
          </section>

          {/* Section 15 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">15. Severability</h2>
            <p className="text-gray-600 leading-relaxed">
              If any provision of these Terms is held to be unenforceable or invalid, such provision will be changed 
              and interpreted to accomplish the objectives of such provision to the greatest extent possible under 
              applicable law, and the remaining provisions will continue in full force and effect.
            </p>
          </section>

          {/* Section 16 - NEW ACCESSIBILITY */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">16. Accessibility</h2>
            <div className="text-gray-600 leading-relaxed space-y-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p>
                SEOPulse is committed to ensuring digital accessibility for all users. We strive to meet 
                Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards.
              </p>
              <p>
                If you are experiencing accessibility issues or require assistance, please contact us at{" "}
                <a href="mailto:seopulse.help@gmail.com" className="text-blue-600 hover:underline">
                  seopulse.help@gmail.com
                </a>. We will work to address your concerns promptly.
              </p>
              <p>
                While we make every reasonable effort to maintain accessibility, some limitations may exist 
                due to third-party integrations. We appreciate your feedback to help us improve.
              </p>
            </div>
          </section>

          {/* Section 17 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">17. Contact Information</h2>
            <div className="text-gray-600 leading-relaxed">
              <p>If you have any questions about these Terms, please contact us:</p>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p><strong>Email:</strong> <a href="mailto:seopulse.help@gmail.com" className="text-blue-600 hover:underline">seopulse.help@gmail.com</a></p>
                <p className="mt-2"><strong>Website:</strong> <a href="https://seopulse.digital" className="text-blue-600 hover:underline">https://seopulse.digital</a></p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}