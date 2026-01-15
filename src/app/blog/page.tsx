import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const blogPosts = [
  {
    slug: "what-is-google-search-console",
    title: "What is Google Search Console? A Beginner's Guide",
    description: "Learn how to use Google Search Console to improve your website's SEO and track your search performance.",
    date: "2024-01-15",
    readTime: "5 min read",
  },
  {
    slug: "improve-ctr-seo",
    title: "10 Ways to Improve Your Click-Through Rate (CTR)",
    description: "Discover proven strategies to get more clicks from search results and boost your organic traffic.",
    date: "2024-01-10",
    readTime: "7 min read",
  },
  {
    slug: "ai-seo-tools",
    title: "How AI is Changing SEO: Tools and Strategies for 2024",
    description: "Explore how artificial intelligence is transforming SEO and how you can leverage AI tools to stay ahead.",
    date: "2024-01-05",
    readTime: "6 min read",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link href="/" className="text-xl font-bold text-blue-600">
            SEOPulse
          </Link>
        </div>
      </header>

      {/* Blog Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">SEO Blog</h1>
        <p className="text-gray-600 mb-12">
          Tips, strategies, and insights to help you grow your organic traffic.
        </p>

        <div className="space-y-8">
          {blogPosts.map((post) => (
            <Card key={post.slug} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
                <CardTitle className="text-2xl">
                  <Link href={`/blog/${post.slug}`} className="hover:text-blue-600">
                    {post.title}
                  </Link>
                </CardTitle>
                <CardDescription className="text-base">
                  {post.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-blue-600 font-medium inline-flex items-center hover:underline"
                >
                  Read more <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}