import { Metadata } from "next";
import Link from "next/link";

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
          <Link href="/" className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900">Terms of Service</h1>
          <p className="text-gray-500 mt-2">Last updated: January 26, 2026</p>
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
              and Google Analytics to provide insights, recommendations, and tracking for website owners. The Service includes 
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
              <p>SEOPulse uses Google API Services to access your Google Search Console and Google Analytics data. By using our Service, you also agree to be bound by Google&apos;s Terms of Service.</p>
              <p>We access only the data necessary to provide our Service, specifically Google Search Console performance data and Google Analytics metrics. We request read-only access and do not modify your Google data.</p>
              <p>We do not store your raw Google data permanently; it is fetched in real-time and cached temporarily for performance.</p>
              <p>You can revoke our access to your Google data at any time through the Settings page or through your Google Account settings at <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">myaccount.google.com/permissions</a>.</p>
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Subscription and Payments</h2>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p>Some features of SEOPulse require a paid subscription. By subscribing, you agree to pay all fees associated with your chosen plan.</p>
              <p>Subscriptions are billed in advance on a monthly basis and will automatically renew unless cancelled. You may cancel your subscription at any time through your account settings.</p>
              <p>Upon cancellation, you will retain access to paid features until the end of your current billing period.</p>
              <p>We offer a 14-day money-back guarantee for new subscriptions. Refund requests after this period are handled on a case-by-case basis. Contact support at <a href="mailto:seopulse.help@gmail.com" className="text-blue-600 hover:underline">seopulse.help@gmail.com</a> for refund requests.</p>
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
                <li>To scrape, data mine, or use automated systems to access the Service without permission</li>
                <li>To resell or redistribute the Service without authorization</li>
              </ul>
            </div>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Data and Privacy</h2>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p>
                Your privacy is important to us. Please review our{" "}
                <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>, 
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
              <p>You retain ownership of any data you provide to the Service. By using the Service, you grant us a limited license to process your data solely for the purpose of providing the Service.</p>
            </div>
          </section>

          {/* Section 9 - DISCLAIMER */}
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
                ACTUAL RESULTS MAY VARY BASED ON NUMEROUS FACTORS OUTSIDE OUR CONTROL.
              </p>
              <p className="font-semibold text-gray-800">
                SEOPULSE IS NOT A LAW FIRM, FINANCIAL ADVISOR, OR CERTIFIED SEO CONSULTANT. 
                THE SERVICE DOES NOT PROVIDE LEGAL, FINANCIAL, OR PROFESSIONAL ADVICE. 
                CONSULT APPROPRIATE LICENSED PROFESSIONALS FOR SPECIFIC ADVICE REGARDING YOUR SITUATION.
              </p>
              <p>
                No advice or information obtained through the Service shall create any warranty not expressly stated in these Terms.
              </p>
            </div>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Limitation of Liability</h2>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p>
                In no event shall SEOPulse, nor its directors, employees, partners, agents, suppliers, or affiliates, 
                be liable for any indirect, incidental, special, consequential, or punitive damages, including without 
                limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access 
                to or use of or inability to access or use the Service.
              </p>
              <p>
                Our total liability to you for any claims arising from or related to the Service shall not exceed 
                the amount you paid us in the twelve (12) months preceding the claim, or $100 USD, whichever is greater.
              </p>
            </div>
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
              <p>Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may do so through the Settings page or by contacting us.</p>
              <p>All provisions of the Terms which by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, indemnity, and limitations of liability.</p>
            </div>
          </section>

          {/* Section 13 - UPDATED GOVERNING LAW */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Governing Law and Dispute Resolution</h2>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, 
                United States, without regard to its conflict of law provisions.
              </p>
              <p>
                Any disputes arising from these Terms or your use of the Service shall first be attempted to be 
                resolved through good-faith negotiation. If negotiation fails, disputes shall be resolved through 
                binding arbitration in accordance with the rules of the American Arbitration Association.
              </p>
              <p>
                You agree that any arbitration shall be conducted on an individual basis and not as a class action 
                or other representative proceeding.
              </p>
            </div>
          </section>

          {/* Section 14 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Changes to Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              We reserve the right to modify or replace these Terms at any time. If a revision is material, we will 
              try to provide at least 30 days&apos; notice prior to any new terms taking effect by posting the updated 
              Terms on this page and updating the &quot;Last updated&quot; date. What constitutes a material change will be 
              determined at our sole discretion. Your continued use of the Service after changes constitutes 
              acceptance of the new Terms.
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

          {/* Section 16 - ACCESSIBILITY */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">16. Accessibility</h2>
            <div className="text-gray-600 leading-relaxed space-y-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p>
                SEOPulse is committed to ensuring digital accessibility for all users, including those with disabilities. 
                We strive to meet Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards.
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

          {/* Section 17 - NEW DMCA */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">17. DMCA Copyright Policy</h2>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p>
                SEOPulse respects the intellectual property rights of others and expects users of the Service to do the same.
              </p>
              <p>
                If you believe that your copyrighted work has been copied in a way that constitutes copyright infringement 
                and is accessible via the Service, please notify our copyright agent with the following information:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>A physical or electronic signature of the copyright owner or authorized representative</li>
                <li>Identification of the copyrighted work claimed to have been infringed</li>
                <li>Identification of the material that is claimed to be infringing and its location on the Service</li>
                <li>Your contact information (address, telephone number, and email address)</li>
                <li>A statement that you have a good faith belief that the use is not authorized</li>
                <li>A statement that the information in the notification is accurate, under penalty of perjury</li>
              </ul>
              <p>
                Send DMCA notices to: <a href="mailto:seopulse.help@gmail.com" className="text-blue-600 hover:underline">seopulse.help@gmail.com</a> 
                with &quot;DMCA Notice&quot; in the subject line.
              </p>
            </div>
          </section>

          {/* Section 18 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">18. Contact Information</h2>
            <div className="text-gray-600 leading-relaxed">
              <p>If you have any questions about these Terms, please contact us:</p>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p><strong>Email:</strong> <a href="mailto:seopulse.help@gmail.com" className="text-blue-600 hover:underline">seopulse.help@gmail.com</a></p>
                <p className="mt-2"><strong>Website:</strong> <a href="https://seopulse.digital" className="text-blue-600 hover:underline">https://seopulse.digital</a></p>
              </div>
            </div>
          </section>

        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <Link href="/privacy" className="hover:text-gray-700">Privacy Policy</Link>
          <span className="mx-2">•</span>
          <Link href="/contact" className="hover:text-gray-700">Contact Us</Link>
          <span className="mx-2">•</span>
          <Link href="/" className="hover:text-gray-700">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}