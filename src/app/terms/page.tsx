import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Terms of Service | SEOPulse",
  description: "Read the terms and conditions for using SEOPulse services.",
};

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
        <p className="text-gray-500 mb-8">Last updated: January 1, 2024</p>

        <div className="prose prose-lg max-w-none text-gray-600">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing or using SEOPulse ("Service"), you agree to be bound by these 
              Terms of Service ("Terms"). If you do not agree to these Terms, do not use 
              the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
            <p>
              SEOPulse provides SEO analytics and insights by connecting to your Google 
              Search Console account. The Service includes:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>SEO performance dashboards</li>
              <li>AI-powered insights and recommendations</li>
              <li>Keyword and ranking tracking</li>
              <li>Report generation</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Account Registration</h2>
            <p>To use the Service, you must:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate and complete registration information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorized use</li>
              <li>Be at least 18 years old or have parental consent</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Subscription and Payments</h2>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">4.1 Free Plan</h3>
            <p>
              The free plan provides limited access to the Service at no cost. 
              We reserve the right to modify free plan features at any time.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-2 mt-4">4.2 Paid Plans</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Paid subscriptions are billed monthly or annually</li>
              <li>Payments are processed securely through Stripe</li>
              <li>Subscriptions auto-renew unless cancelled</li>
              <li>No refunds for partial months</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-2 mt-4">4.3 Refund Policy</h3>
            <p>
              We offer a 14-day money-back guarantee for first-time subscribers. 
              Contact us within 14 days of your first payment for a full refund.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Violate any laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Attempt to gain unauthorized access to the Service</li>
              <li>Use the Service to harm others</li>
              <li>Resell or redistribute the Service without permission</li>
              <li>Use automated tools to scrape or extract data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Intellectual Property</h2>
            <p>
              The Service, including all content, features, and functionality, is owned 
              by SEOPulse and protected by copyright, trademark, and other laws. You may 
              not copy, modify, or distribute any part of the Service without our written 
              consent.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Data and Privacy</h2>
            <p>
              Your use of the Service is also governed by our{" "}
              <Link href="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>
              . By using the Service, you consent to our collection and use of data 
              as described in the Privacy Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Third-Party Services</h2>
            <p>
              The Service integrates with third-party services including Google Search 
              Console. Your use of these services is subject to their respective terms 
              and privacy policies. We are not responsible for third-party services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Disclaimer of Warranties</h2>
            <p>
              THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DO NOT 
              GUARANTEE THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR THAT IT 
              WILL MEET YOUR REQUIREMENTS.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Limitation of Liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, SEOPULSE SHALL NOT BE LIABLE FOR 
              ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, 
              INCLUDING LOSS OF PROFITS, DATA, OR BUSINESS OPPORTUNITIES.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Termination</h2>
            <p>
              We may terminate or suspend your account at any time for violation of these 
              Terms. You may cancel your account at any time through your account settings. 
              Upon termination, your right to use the Service will cease immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Changes to Terms</h2>
            <p>
              We may modify these Terms at any time. We will notify you of significant 
              changes by email or through the Service. Continued use of the Service after 
              changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact Information</h2>
            <p>
              For questions about these Terms, please contact us at:
            </p>
            <p className="mt-2">
              <strong>Email:</strong>{" "}
              <a href="mailto:legal@seopulse.app" className="text-blue-600 hover:underline">
                legal@seopulse.app
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