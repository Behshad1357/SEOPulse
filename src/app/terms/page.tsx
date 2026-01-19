import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-4xl mx-auto px-4 py-6 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-blue-600">
            SEOPulse
          </Link>
          <Link href="/signup">
            <Button>Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-gray-500 mb-8">Last updated: January 18, 2025</p>

        <div className="space-y-8 text-gray-600">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="leading-relaxed">
              By accessing or using SEOPulse (the &quot;Service&quot;), located at seopulse.digital, you agree to be bound by these Terms of Service (&quot;Terms&quot;).
              If you do not agree to these Terms, do not use the Service. These Terms constitute a legally binding agreement between you and SEOPulse.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
            <p className="mb-2">
              SEOPulse provides SEO analytics and insights by connecting to your Google
              Search Console account. The Service includes:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>SEO performance dashboards</li>
              <li>AI-powered insights and recommendations</li>
              <li>Keyword and ranking tracking</li>
              <li>Report generation</li>
            </ul>
            <p className="mt-4">
              We reserve the right to modify, suspend, or discontinue any part of the Service at any time with or without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Account Registration</h2>
            <p className="mb-2">To use the Service, you must:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate and complete registration information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
              <li>Be at least 18 years old</li>
              <li>Not share your account with others</li>
            </ul>
            <p className="mt-4">
              You are responsible for all activities that occur under your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Subscription and Payments</h2>

            <h3 className="text-xl font-semibold text-gray-900 mb-2">4.1 Free Plan</h3>
            <p className="mb-4">
              The free plan provides limited access to the Service at no cost.
              We reserve the right to modify free plan features at any time.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-2">4.2 Paid Plans</h3>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Paid subscriptions are billed monthly</li>
              <li>Payments are processed securely through Stripe</li>
              <li>Subscriptions auto-renew unless cancelled before the next billing date</li>
              <li>Prices are in US Dollars (USD) and exclude applicable taxes</li>
              <li>You can cancel your subscription at any time through your account settings</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-2">4.3 Refund Policy</h3>
            <p className="mb-2">
              We offer a <strong>14-day money-back guarantee</strong> for first-time subscribers.
              Contact us within 14 days of your first payment for a full refund.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Refund requests must be made within 14 days of the initial purchase</li>
              <li>Refunds are only available for first-time subscribers</li>
              <li>After 14 days, no refunds will be issued for the current billing period</li>
              <li>Cancelled subscriptions remain active until the end of the current billing period</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Acceptable Use</h2>
            <p className="mb-2">You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights of others</li>
              <li>Attempt to gain unauthorized access to the Service or its systems</li>
              <li>Use the Service to harm, harass, or defraud others</li>
              <li>Resell, redistribute, or sublicense the Service without our written permission</li>
              <li>Use automated tools, bots, or scripts to access or scrape the Service</li>
              <li>Interfere with or disrupt the Service or servers</li>
              <li>Transmit viruses, malware, or other harmful code</li>
              <li>Impersonate another person or entity</li>
            </ul>
            <p className="mt-4">
              Violation of these terms may result in immediate termination of your account without refund.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Intellectual Property</h2>
            <p>
              The Service, including all content, features, functionality, software, text, images, and design, is owned
              by SEOPulse and protected by copyright, trademark, and other intellectual property laws. You may
              not copy, modify, distribute, sell, or lease any part of the Service without our written
              consent. You retain ownership of any data you provide to the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Data and Privacy</h2>
            <p>
              Your use of the Service is also governed by our{" "}
              <Link href="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>
              , which is incorporated into these Terms by reference. By using the Service, you consent to our collection and use of data
              as described in the Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Third-Party Services</h2>
            <p>
              The Service integrates with third-party services including Google Search Console and Stripe.
              Your use of these services is subject to their respective terms and privacy policies.
              We are not responsible for the content, privacy practices, or actions of third-party services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Disclaimer of Warranties</h2>
            <p className="uppercase text-sm">
              THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED,
              INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, SECURE, OR THAT IT WILL MEET YOUR SPECIFIC REQUIREMENTS.
              SEO RESULTS AND RECOMMENDATIONS ARE PROVIDED FOR INFORMATIONAL PURPOSES ONLY AND ARE NOT GUARANTEED.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Limitation of Liability</h2>
            <p className="uppercase text-sm">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, SEOPULSE AND ITS OWNERS, EMPLOYEES, AND AFFILIATES SHALL NOT BE LIABLE FOR
              ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO
              LOSS OF PROFITS, DATA, BUSINESS OPPORTUNITIES, GOODWILL, OR OTHER INTANGIBLE LOSSES,
              RESULTING FROM YOUR USE OF OR INABILITY TO USE THE SERVICE. OUR TOTAL LIABILITY SHALL NOT EXCEED
              THE AMOUNT YOU PAID US IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless SEOPulse and its owners, employees, and affiliates from
              any claims, damages, losses, liabilities, and expenses (including reasonable attorneys&apos; fees) arising out of
              your use of the Service, violation of these Terms, or infringement of any rights of another party.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Termination</h2>
            <p className="mb-2">
              We may terminate or suspend your account at any time, with or without cause, with or without notice, for violation of these
              Terms or for any other reason. You may cancel your account at any time through your account settings or by contacting us.
            </p>
            <p>
              Upon termination:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Your right to use the Service will cease immediately</li>
              <li>You will not be entitled to any refund for the current billing period</li>
              <li>We may delete your data after a reasonable period (typically 30 days)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the United States.
              Any disputes arising from these Terms or the Service shall be resolved through binding arbitration
              or in the courts located in the United States, and you consent to the jurisdiction of such courts.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will notify you of material changes by
              posting the updated Terms on this page and updating the &quot;Last updated&quot; date. Your continued use of
              the Service after changes constitutes acceptance of the modified Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Contact Information</h2>
            <p>
              For questions about these Terms, please contact us at:{" "}
              <a href="mailto:davoodshadmani1978@gmail.com" className="text-blue-600 hover:underline">
                davoodshadmani1978@gmail.com
              </a>
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 mt-16">
        <div className="max-w-4xl mx-auto px-4 text-center text-gray-500">
          © {new Date().getFullYear()} SEOPulse. All rights reserved.
        </div>
      </footer>
    </div>
  );
}