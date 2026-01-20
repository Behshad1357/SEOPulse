import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock } from "lucide-react";

export const metadata = {
  title: "The Complete SEO Guide for Small Businesses | SEOPulse",
  description: "A step-by-step guide to improving your small business's search visibility without expensive tools or agencies.",
};

export default function BlogPost() {
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

      {/* Article */}
      <article className="max-w-4xl mx-auto px-4 py-12">
        <Link href="/blog" className="inline-flex items-center text-blue-600 hover:underline mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </Link>

        <div className="mb-8">
          <span className="text-sm font-medium px-3 py-1 bg-blue-100 text-blue-600 rounded">
            Guide
          </span>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          The Complete SEO Guide for Small Businesses
        </h1>

        <div className="flex items-center gap-4 text-gray-500 mb-8">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            January 1, 2026
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            10 min read
          </span>
        </div>

        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-600 mb-8">
            SEO doesn&apos;t have to be complicated or expensive. This guide will walk you through the essential steps to improve your small business&apos;s search visibility and attract more customers online.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Why SEO Matters for Small Businesses</h2>
          <p className="text-gray-600 mb-4">
            93% of online experiences begin with a search engine. For small businesses, appearing in search results means free, targeted traffic from people actively looking for your products or services. Unlike paid ads, SEO continues to drive traffic long after the initial effort.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Step 1: Set Up Google Search Console</h2>
          <p className="text-gray-600 mb-4">
            Google Search Console is a free tool that shows you how your site performs in search. It&apos;s essential for any SEO strategy. Set it up by verifying your website ownership and let it collect data for a few days.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Step 2: Do Basic Keyword Research</h2>
          <p className="text-gray-600 mb-4">
            Start by listing what your customers might search for. Think about:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-4">
            <li>Your products or services</li>
            <li>Problems you solve</li>
            <li>Questions customers frequently ask</li>
            <li>Your location (for local businesses)</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Step 3: Optimize Your Website</h2>
          <p className="text-gray-600 mb-4">
            Focus on these key areas:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-4">
            <li><strong>Title tags:</strong> Include your main keyword and location</li>
            <li><strong>Meta descriptions:</strong> Write compelling summaries of each page</li>
            <li><strong>Headers:</strong> Use H1, H2, H3 tags to structure your content</li>
            <li><strong>Content:</strong> Create helpful, relevant content for your audience</li>
            <li><strong>Images:</strong> Add alt text describing each image</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Step 4: Claim Your Google Business Profile</h2>
          <p className="text-gray-600 mb-4">
            For local businesses, Google Business Profile is crucial. Claim and optimize your listing with accurate information, photos, business hours, and encourage customers to leave reviews.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Step 5: Build Local Citations</h2>
          <p className="text-gray-600 mb-4">
            List your business on relevant directories like Yelp, Yellow Pages, and industry-specific sites. Ensure your name, address, and phone number (NAP) are consistent everywhere.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Step 6: Create Valuable Content</h2>
          <p className="text-gray-600 mb-4">
            Start a blog answering common customer questions. This helps you rank for more keywords and establishes your expertise. Aim for one quality post per week or every two weeks.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Step 7: Monitor and Improve</h2>
          <p className="text-gray-600 mb-4">
            SEO is an ongoing process. Regularly check your Google Search Console data to see what&apos;s working, identify opportunities, and fix any issues.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Simplify Your SEO with SEOPulse</h3>
            <p className="text-gray-600 mb-4">
              SEOPulse connects to your Google Search Console and turns complex data into simple, actionable insights. Perfect for small business owners who want results without the complexity.
            </p>
            <Link href="/signup">
              <Button>Start Free Trial</Button>
            </Link>
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer className="border-t py-8 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center text-gray-500">
          © {new Date().getFullYear()} SEOPulse. All rights reserved.
        </div>
      </footer>
    </div>
  );
}