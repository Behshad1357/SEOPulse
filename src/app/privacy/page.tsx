import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Privacy Policy | SEOPulse",
  description: "Learn how SEOPulse collects, uses, and protects your personal information.",
};

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
        <p className="text-gray-500 mb-8">Last updated: January 1, 2024</p>

        <div className="prose prose-lg max-w-none text-gray-600">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p>
              SEOPulse ("we," "our," or "us") is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard 
              your information when you use our website and services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">2.1 Information You Provide</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Account information (name, email address)</li>
              <li>Payment information (processed securely through Stripe)</li>
              <li>Website URLs you add to track</li>
              <li>Communications you send to us</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-2 mt-4">2.2 Information from Google</h3>
            <p>
              When you connect your Google Search Console account, we access:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Search performance data (clicks, impressions, CTR, position)</li>
              <li>Keyword data</li>
              <li>Page performance data</li>
            </ul>
            <p className="mt-2">
              We only request read-only access and never modify your Google data.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-2 mt-4">2.3 Automatically Collected Information</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Device information (browser type, operating system)</li>
              <li>Log data (IP address, access times, pages viewed)</li>
              <li>Cookies and similar technologies</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide and maintain our service</li>
              <li>To generate SEO insights and recommendations</li>
              <li>To process payments and manage subscriptions</li>
              <li>To send you updates and marketing communications (with your consent)</li>
              <li>To improve our services</li>
              <li>To respond to your inquiries</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Sharing</h2>
            <p>We do not sell your personal information. We may share data with:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Service Providers:</strong> Stripe (payments), Supabase (database), Vercel (hosting)</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Security</h2>
            <p>
              We implement industry-standard security measures including:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>SSL/TLS encryption for all data transfers</li>
              <li>Encrypted database storage</li>
              <li>Regular security audits</li>
              <li>Limited employee access to personal data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Delete your account and data</li>
              <li>Export your data</li>
              <li>Opt-out of marketing communications</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cookies</h2>
            <p>
              We use essential cookies to maintain your session and preferences. 
              We may also use analytics cookies (with your consent) to understand 
              how you use our service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at:
            </p>
            <p className="mt-2">
              <strong>Email:</strong>{" "}
              <a href="mailto:privacy@seopulse.app" className="text-blue-600 hover:underline">
                privacy@seopulse.app
              </a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you 
              of any changes by posting the new policy on this page and updating the 
              "Last updated" date.
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