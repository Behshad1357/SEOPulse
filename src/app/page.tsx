import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  Sparkles, 
  Zap, 
  Shield,
  ArrowRight,
  Check
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl font-bold text-blue-600">
              SEOPulse
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/pricing" className="text-gray-600 hover:text-gray-900">
                Pricing
              </Link>
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/signup">
                <Button>Get Started Free</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full text-blue-600 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered SEO Insights
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Know What to Do,<br />
            <span className="text-blue-600">Not Just What Happened</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-8">
            SEOPulse transforms complex SEO data into simple, actionable insights. 
            Connect Google Search Console and get AI-powered recommendations instantly.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="text-lg px-8">
                View Pricing
              </Button>
            </Link>
          </div>
          <p className="text-sm text-gray-400 mt-4">
            No credit card required • Free forever plan available
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Grow
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Simple yet powerful tools to understand and improve your search performance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: BarChart3,
                title: "Real-Time Analytics",
                description:
                  "Connect Google Search Console and see your clicks, impressions, and rankings in a beautiful dashboard.",
              },
              {
                icon: Sparkles,
                title: "AI-Powered Insights",
                description:
                  "Our AI analyzes your data and tells you exactly what to do to improve your rankings.",
              },
              {
                icon: Zap,
                title: "Instant Alerts",
                description:
                  "Get notified when something important happens – traffic spikes, ranking drops, or new opportunities.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-sm border border-gray-100"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Get Started in 3 Minutes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Connect Google",
                description: "Sign in with Google and connect your Search Console property.",
              },
              {
                step: "2",
                title: "See Your Data",
                description: "Instantly view your SEO metrics in a clean, simple dashboard.",
              },
              {
                step: "3",
                title: "Get Insights",
                description: "Our AI analyzes your data and gives you actionable recommendations.",
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-500">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Improve Your SEO?
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Join thousands of businesses using SEOPulse to grow their organic traffic.
          </p>
          <Link href="/signup">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <Link href="/" className="text-xl font-bold text-blue-600">
                SEOPulse
              </Link>
              <p className="text-gray-500 text-sm mt-1">
                AI-Powered SEO Insights
              </p>
            </div>
            <div className="flex space-x-6 text-gray-500 text-sm">
              <Link href="/pricing" className="hover:text-gray-900">
                Pricing
              </Link>
              <Link href="/login" className="hover:text-gray-900">
                Login
              </Link>
              <Link href="/signup" className="hover:text-gray-900">
                Sign Up
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-100 text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} SEOPulse. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}