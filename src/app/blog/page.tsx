import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { BlogNewsletter } from "@/components/blog-newsletter";

export const metadata = {
  title: "SEO Blog - Tips & Strategies | SEOPulse",
  description: "Learn SEO strategies, tips, and best practices to grow your organic traffic. Expert insights from the SEOPulse team.",
};

const blogPosts = [
  {
    slug: "what-is-google-search-console",
    title: "What is Google Search Console? A Complete Beginner's Guide",
    description: "Learn how to use Google Search Console to monitor your website's search performance, fix issues, and improve your SEO.",
    date: "January 15, 2026",
    readTime: "5 min read",
    category: "Beginner",
  },
  {
    slug: "improve-click-through-rate",
    title: "10 Proven Ways to Improve Your Click-Through Rate (CTR)",
    description: "Discover actionable strategies to get more clicks from search results and boost your organic traffic without changing your rankings.",
    date: "January 10, 2026",
    readTime: "7 min read",
    category: "Strategy",
  },
  {
    slug: "ai-seo-tools-2026",
    title: "How AI is Transforming SEO: Tools and Strategies for 2026",
    description: "Explore how artificial intelligence is changing the SEO landscape and how you can leverage AI tools to stay ahead of the competition.",
    date: "January 5, 2026",
    readTime: "6 min read",
    category: "Trends",
  },
  {
    slug: "small-business-seo-guide",
    title: "The Complete SEO Guide for Small Businesses",
    description: "A step-by-step guide to improving your small business's search visibility without expensive tools or agencies.",
    date: "January 1, 2026",
    readTime: "10 min read",
    category: "Guide",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-blue-600">
            SEOPulse
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/pricing" className="text-gray-600 hover:text-gray-900">
              Pricing
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-white py-16 border-b">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">SEO Blog</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tips, strategies, and insights to help you grow your organic traffic
            and improve your search rankings.
          </p>
        </div>
      </section>

      {/* Blog Posts */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {blogPosts.map((post) => (
            <Card key={post.slug} className="hover:shadow-lg transition-shadow bg-white">
              <CardHeader>
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-600 rounded">
                    {post.category}
                  </span>
                </div>
                <CardTitle className="text-xl">
                  <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
                    {post.title}
                  </Link>
                </CardTitle>
                <CardDescription className="text-base text-gray-600">
                  {post.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {post.readTime}
                    </span>
                  </div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-blue-600 font-medium inline-flex items-center hover:underline"
                  >
                    Read <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Newsletter CTA */}
        <BlogNewsletter source="blog-listing" />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-500">
          © {new Date().getFullYear()} SEOPulse. All rights reserved.
        </div>
      </footer>
    </div>
  );
}