import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "About SEOPulse - Our Mission & Story",
  description: "Learn about SEOPulse, our mission to make SEO simple and accessible for everyone, and the team behind the product.",
};

export default function AboutPage() {
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
        <h1 className="text-4xl font-bold text-gray-900 mb-6">About SEOPulse</h1>
        
        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              SEOPulse was born from a simple frustration: SEO tools are too expensive 
              and too complicated for most businesses. We believe that understanding 
              your search performance shouldn't require a $100+/month subscription or 
              a PhD in data analysis.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed mt-4">
              Our mission is to make SEO insights accessible to everyone – from solo 
              entrepreneurs to small agencies – by providing simple, actionable 
              recommendations powered by AI.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What Makes Us Different</h2>
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Simple, Not Simplistic</h3>
                <p className="text-gray-600">
                  We focus on the metrics that matter and present them in a way that's 
                  easy to understand and act upon.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">AI-Powered Insights</h3>
                <p className="text-gray-600">
                  Instead of just showing data, we use AI to analyze your performance 
                  and tell you exactly what to do.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Affordable Pricing</h3>
                <p className="text-gray-600">
                  Enterprise-level insights at a price that makes sense for small 
                  businesses and freelancers.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Privacy First</h3>
                <p className="text-gray-600">
                  We only access what we need to provide insights. Your data is 
                  encrypted and never shared.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Values</h2>
            <ul className="space-y-4 text-gray-600 text-lg">
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold">→</span>
                <span><strong>Simplicity:</strong> We believe the best tools are the ones you actually use.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold">→</span>
                <span><strong>Transparency:</strong> Clear pricing, no hidden fees, no tricks.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold">→</span>
                <span><strong>Action-Oriented:</strong> Data is useless without action. We focus on what to do next.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold">→</span>
                <span><strong>Continuous Improvement:</strong> We ship fast, learn from users, and iterate.</span>
              </li>
            </ul>
          </section>

          <section className="bg-blue-50 p-8 rounded-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
            <p className="text-gray-600 mb-6">
              Join hundreds of businesses using SEOPulse to grow their organic traffic.
            </p>
            <Link href="/signup">
              <Button size="lg">
                Start Free Trial <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
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