import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Sparkles,
  Zap,
  ArrowRight,
  Check,
  Star,
  Shield,
  Clock,
  Users,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl font-bold text-blue-600">
              SEOPulse
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-600 hover:text-gray-900">
                Features
              </Link>
              <Link href="#pricing" className="text-gray-600 hover:text-gray-900">
                Pricing
              </Link>
              <Link href="#faq" className="text-gray-600 hover:text-gray-900">
                FAQ
              </Link>
            </div>
            <div className="flex items-center space-x-4">
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
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            SEOPulse transforms complex SEO data into simple, actionable insights.
            Connect Google Search Console and get AI-powered recommendations instantly.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="#demo">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Watch Demo
              </Button>
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              No credit card required
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              Free forever plan
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              Setup in 2 minutes
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-gray-900">500+</p>
              <p className="text-gray-600">Active Users</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">10K+</p>
              <p className="text-gray-600">Keywords Tracked</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">99.9%</p>
              <p className="text-gray-600">Uptime</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">4.9/5</p>
              <p className="text-gray-600">User Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Grow
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
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
              {
                icon: Shield,
                title: "Secure & Private",
                description:
                  "Your data is encrypted and never shared. We only access what's needed to provide insights.",
              },
              {
                icon: Clock,
                title: "Historical Data",
                description:
                  "Track your progress over time with up to 90 days of historical data on paid plans.",
              },
              {
                icon: Users,
                title: "Team Collaboration",
                description:
                  "Share reports with clients or team members. White-label options available for agencies.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-gray-50">
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
                description:
                  "Sign in with Google and connect your Search Console property securely.",
              },
              {
                step: "2",
                title: "See Your Data",
                description:
                  "Instantly view your SEO metrics in a clean, simple dashboard.",
              },
              {
                step: "3",
                title: "Get AI Insights",
                description:
                  "Our AI analyzes your data and gives you actionable recommendations.",
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Loved by Marketers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Chen",
                role: "Marketing Manager",
                company: "TechStart Inc",
                quote: "SEOPulse helped us identify quick wins that increased our organic traffic by 40% in just 2 months.",
              },
              {
                name: "Michael Torres",
                role: "Freelance SEO",
                company: "Self-employed",
                quote: "Finally an SEO tool that tells me what to do, not just shows me data. The AI insights are incredibly helpful.",
              },
              {
                name: "Emma Wilson",
                role: "Agency Owner",
                company: "Wilson Digital",
                quote: "We switched from expensive tools to SEOPulse. Same insights, 80% less cost. Our clients love the reports.",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-gray-600">Start free. Upgrade when you need more.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Free",
                price: 0,
                description: "Perfect for getting started",
                features: ["1 website", "Basic metrics", "7-day history", "Community support"],
                cta: "Get Started",
                popular: false,
              },
              {
                name: "Pro",
                price: 19,
                description: "For growing businesses",
                features: ["5 websites", "Full AI insights", "90-day history", "PDF reports", "Email alerts", "Priority support"],
                cta: "Start Pro",
                popular: true,
              },
              {
                name: "Agency",
                price: 49,
                description: "For agencies & teams",
                features: ["Unlimited websites", "White-label reports", "Client portals", "API access", "Dedicated support", "Custom integrations"],
                cta: "Start Agency",
                popular: false,
              },
            ].map((plan, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl p-8 ${
                  plan.popular ? "ring-2 ring-blue-600 shadow-lg" : "border border-gray-200"
                }`}
              >
                {plan.popular && (
                  <span className="inline-block bg-blue-600 text-white text-sm font-medium px-3 py-1 rounded-full mb-4">
                    Most Popular
                  </span>
                )}
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                <p className="text-gray-600 mt-1">{plan.description}</p>
                <div className="mt-4 mb-6">
                  <span className="text-5xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/signup">
                  <Button
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            {[
              {
                q: "How does SEOPulse get my SEO data?",
                a: "SEOPulse connects securely to your Google Search Console account using OAuth. We only request read-only access to your search data. Your credentials are never stored.",
              },
              {
                q: "Is there really a free plan?",
                a: "Yes! Our free plan includes 1 website with basic metrics and 7-day history. No credit card required. Use it forever or upgrade when you need more.",
              },
              {
                q: "What makes SEOPulse different from SEMrush or Ahrefs?",
                a: "SEOPulse is simpler, more affordable, and focuses on actionable AI insights. Instead of overwhelming you with data, we tell you exactly what to do to improve.",
              },
              {
                q: "Can I cancel anytime?",
                a: "Absolutely. No contracts, no commitments. Cancel your subscription anytime from your account settings. You'll keep access until the end of your billing period.",
              },
              {
                q: "Do you offer refunds?",
                a: "Yes, we offer a 14-day money-back guarantee. If you're not satisfied, contact us for a full refund, no questions asked.",
              },
              {
                q: "Is my data secure?",
                a: "Yes. We use industry-standard encryption (SSL/TLS) for all data transfers. Your data is stored securely and never shared with third parties.",
              },
            ].map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
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
            Join hundreds of businesses using SEOPulse to grow their organic traffic.
          </p>
          <Link href="/signup">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <p className="text-blue-200 text-sm mt-4">
            No credit card required • Free forever plan available
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <Link href="/" className="text-xl font-bold text-blue-600">
                SEOPulse
              </Link>
              <p className="text-gray-500 text-sm mt-2">
                AI-Powered SEO Insights for growing businesses.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Product</h4>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="#features" className="hover:text-gray-900">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-gray-900">Pricing</Link></li>
                <li><Link href="#faq" className="hover:text-gray-900">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Company</h4>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="/about" className="hover:text-gray-900">About</Link></li>
                <li><Link href="/blog" className="hover:text-gray-900">Blog</Link></li>
                <li><Link href="/contact" className="hover:text-gray-900">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Legal</h4>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="/privacy" className="hover:text-gray-900">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-gray-900">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-100 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} SEOPulse. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}