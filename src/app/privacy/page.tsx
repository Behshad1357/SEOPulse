import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PrivacyPage() {
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
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-gray-500 mb-8">Last updated: January 18, 2026</p>

        <div className="space-y-8 text-gray-600">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p className="leading-relaxed">
              SEOPulse (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains
              how we collect, use, disclose, and safeguard your information when you use our
              website and services located at seopulse.digital (the &quot;Service&quot;).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-2">2.1 Information You Provide</h3>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Account information (name, email address)</li>
              <li>Payment information (processed securely through Stripe - we do not store your card details)</li>
              <li>Website URLs you add to track</li>
              <li>Communications you send to us</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-2">2.2 Information from Google</h3>
            <p className="mb-2">When you connect your Google Search Console account, we access:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Search performance data (clicks, impressions, CTR, position)</li>
              <li>Keyword data</li>
              <li>Page performance data</li>
            </ul>
            <p className="font-medium">We only request read-only access and never modify your Google data.</p>

            <h3 className="text-xl font-semibold text-gray-900 mb-2 mt-4">2.3 Automatically Collected Information</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>IP address and approximate location</li>
              <li>Browser type and version</li>
              <li>Device information</li>
              <li>Usage data and analytics</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide and maintain our Service</li>
              <li>To generate SEO insights and recommendations</li>
              <li>To process payments and manage subscriptions</li>
              <li>To send you important updates about the Service</li>
              <li>To send marketing communications (only with your consent)</li>
              <li>To improve our services and develop new features</li>
              <li>To respond to your inquiries and provide customer support</li>
              <li>To detect, prevent, and address technical issues or fraud</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Sharing</h2>
            <p className="mb-2 font-medium">We do not sell, rent, or trade your personal information. We may share data with:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Service Providers:</strong> Stripe (payments), Supabase (database), Vercel (hosting), Google (authentication and Search Console API)</li>
              <li><strong>Legal Requirements:</strong> When required by law, court order, or to protect our rights and safety</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets (you will be notified)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Security</h2>
            <p className="mb-2">We implement industry-standard security measures including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>SSL/TLS encryption for all data transfers</li>
              <li>Encrypted database storage</li>
              <li>Secure authentication through Supabase</li>
              <li>Regular security monitoring</li>
              <li>Limited access to personal data</li>
            </ul>
            <p className="mt-4 text-sm">
              While we strive to protect your information, no method of transmission over the Internet
              is 100% secure. We cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Retention</h2>
            <p>
              We retain your personal data for as long as your account is active or as needed to provide
              you services. You can request deletion of your account and data at any time by contacting us.
              We will delete your data within 30 days of your request, unless we are required to retain it
              for legal purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Your Rights</h2>
            <p className="mb-2">You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Access</strong> - Request a copy of your personal data</li>
              <li><strong>Correction</strong> - Request correction of inaccurate data</li>
              <li><strong>Deletion</strong> - Request deletion of your account and data</li>
              <li><strong>Export</strong> - Request a copy of your data in a portable format</li>
              <li><strong>Opt-out</strong> - Unsubscribe from marketing communications at any time</li>
              <li><strong>Revoke Access</strong> - Disconnect your Google account at any time</li>
            </ul>
            <p className="mt-4">
              To exercise any of these rights, please contact us at the email address below.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Cookies</h2>
            <p>
              We use essential cookies to maintain your session and preferences.
              We may also use analytics cookies (with your consent) to understand
              how you use our service. You can control cookies through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Children&apos;s Privacy</h2>
            <p>
              Our Service is not intended for children under 18 years of age. We do not knowingly
              collect personal information from children. If you are a parent or guardian and believe
              your child has provided us with personal information, please contact us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than your own.
              These countries may have different data protection laws. By using the Service, you consent
              to the transfer of your information to the United States and other countries where our
              service providers operate.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy or wish to exercise your rights, please contact us at:{" "}
              <a href="mailto:seopulse.help@gmail.com" className="text-blue-600 hover:underline">
                seopulse.help@gmail.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you
              of any material changes by posting the new policy on this page, updating the
              &quot;Last updated&quot; date, and sending you an email notification if required by law.
              Your continued use of the Service after changes constitutes acceptance of the updated policy.
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
