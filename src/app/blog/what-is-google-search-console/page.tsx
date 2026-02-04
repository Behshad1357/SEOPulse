import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { NewsletterSignup } from "@/components/newsletter-signup";

export const metadata = {
  title: "Google Search Console Guide 2026: Setup & Use GSC [Beginner Tutorial]",
  description: "Learn how to set up Google Search Console in 5 minutes. Monitor rankings, fix errors & grow organic traffic. Free step-by-step tutorial with screenshots.",
  keywords: ["Google Search Console", "GSC tutorial", "search console setup", "GSC guide 2026"],
  openGraph: {
    title: "Google Search Console Guide 2026: Setup & Use GSC",
    description: "Learn how to set up Google Search Console in 5 minutes. Free tutorial.",
    type: "article",
  },
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
            Beginner
          </span>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Google Search Console Guide 2026: Setup & Use GSC for Beginners
        </h1>

        <div className="flex items-center gap-4 text-gray-500 mb-8">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            January 15, 2026
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            5 min read
          </span>
        </div>

        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-600 mb-8">
            Google Search Console is a free tool from Google that helps you monitor, maintain, and troubleshoot your website&apos;s presence in Google Search results. Whether you&apos;re a beginner or an experienced SEO professional, understanding GSC is essential for improving your search visibility.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What is Google Search Console?</h2>
          <p className="text-gray-600 mb-4">
            Google Search Console (formerly known as Google Webmaster Tools) is a free service offered by Google that helps you monitor and troubleshoot your website&apos;s appearance in Google Search results. It provides valuable insights into how Google sees your site and helps you optimize your visibility.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Key Features of Google Search Console</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-4">
            <li><strong>Performance Reports:</strong> See which queries bring users to your site, your click-through rates, and average position in search results.</li>
            <li><strong>Index Coverage:</strong> Understand which pages are indexed and identify any indexing issues.</li>
            <li><strong>URL Inspection:</strong> Check how Google sees a specific URL on your site.</li>
            <li><strong>Mobile Usability:</strong> Identify mobile-specific issues affecting your site.</li>
            <li><strong>Core Web Vitals:</strong> Monitor your page experience metrics.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">How to Set Up Google Search Console</h2>
          <ol className="list-decimal pl-6 space-y-2 text-gray-600 mb-4">
            <li>Go to <a href="https://search.google.com/search-console" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Google Search Console</a></li>
            <li>Click &quot;Start Now&quot; and sign in with your Google account</li>
            <li>Add your property (website) using either Domain or URL prefix method</li>
            <li>Verify ownership through one of the available methods (HTML file, DNS record, etc.)</li>
            <li>Wait for Google to collect data (usually 24-48 hours)</li>
          </ol>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Why Use SEOPulse with Google Search Console?</h2>
          <p className="text-gray-600 mb-4">
            While Google Search Console provides raw data, SEOPulse transforms this data into actionable insights. Our AI-powered dashboard helps you understand what the data means and provides specific recommendations to improve your rankings.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to supercharge your SEO?</h3>
            <p className="text-gray-600 mb-4">
              Connect your Google Search Console to SEOPulse and get AI-powered insights to grow your organic traffic.
            </p>
            <Link href="/signup">
              <Button>Start Free Trial</Button>
            </Link>
          </div>
        </div>
        {/* Newsletter Signup */}
        <div className="mt-12 border-t pt-12">
          <NewsletterSignup 
            source="blog-gsc-guide"
            title="Want More SEO Tips?"
            description="Get weekly insights on how to grow your organic traffic with Google Search Console."
          />
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