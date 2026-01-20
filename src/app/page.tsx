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
  TrendingUp,
  AlertCircle,
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
              <Link href="/pricing" className="text-gray-600 hover:text-gray-900">
                Pricing
              </Link>
              <Link href="/blog" className="text-gray-600 hover:text-gray-900">
                Blog
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
                <Button>Start Free →</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - OPTIMIZED */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-green-50 border border-green-200 rounded-full text-green-700 text-sm font-medium mb-6">
            <TrendingUp className="w-4 h-4 mr-2" />
            Users report 25% avg traffic increase in 60 days
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Turn Messy GSC Data Into<br />
            <span className="text-blue-600">AI Action Items That Grow Traffic</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Connect Google Search Console in 30 seconds. Get instant AI insights on which pages to fix, 
            what keywords to target, and exactly how to grow your organic traffic.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8 bg-blue-600 hover:bg-blue-700">
                Connect GSC Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <p className="text-sm text-gray-500">1 site, 7-day history. No card required.</p>
          </div>

          {/* Trust Badges - ENHANCED */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 mb-12">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              No credit card required
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              Setup in 30 seconds
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              Free forever plan
            </div>
          </div>

          {/* Testimonial Highlight - NEW */}
          <div className="max-w-xl mx-auto bg-gray-50 rounded-xl p-6 border border-gray-100">
            <div className="flex items-center justify-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-gray-700 italic mb-3">
              &quot;SEOPulse found 3 pages losing traffic that I completely missed. Fixed them and saw a 40% traffic lift in 6 weeks.&quot;
            </p>
            <p className="text-sm text-gray-500">— Sarah Chen, Marketing Manager at TechStart Inc</p>
          </div>
        </div>
      </section>

      {/* Problem/Solution Section - NEW */}
      <section className="py-16 px-4 bg-red-50 border-y border-red-100">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-2 text-red-600 font-medium mb-4">
                <AlertCircle className="w-5 h-5" />
                The Problem
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Google Search Console is powerful but overwhelming
              </h2>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">✗</span>
                  Hours spent staring at charts with no clear action
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">✗</span>
                  Missing traffic drops until it&apos;s too late
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">✗</span>
                  No idea which pages or keywords to prioritize
                </li>
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-2 text-green-600 font-medium mb-4">
                <Sparkles className="w-5 h-5" />
                The Solution
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                SEOPulse tells you exactly what to do
              </h2>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  AI analyzes your data and prioritizes actions
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  Instant alerts when pages need attention
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  Clear recommendations: &quot;Fix this title tag&quot;
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof - ENHANCED */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-gray-900">500+</p>
              <p className="text-gray-600">SEOs & Marketers</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">10h+</p>
              <p className="text-gray-600">Saved Per Week</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">25%</p>
              <p className="text-gray-600">Avg Traffic Increase</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">4.9/5</p>
              <p className="text-gray-600">User Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - OPTIMIZED */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Grow Organic Traffic
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Stop guessing. Start growing with AI-powered insights from your own GSC data.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: BarChart3,
                title: "Smart Dashboard",
                description:
                  "See clicks, impressions, CTR, and rankings in a clean dashboard. No more spreadsheet chaos.",
              },
              {
                icon: Sparkles,
                title: "AI Page Audits",
                description:
                  "Our AI identifies your worst-performing pages and tells you exactly how to fix them.",
              },
              {
                icon: Zap,
                title: "Traffic Alerts",
                description:
                  "Get notified instantly when pages drop in rankings or traffic spikes unexpectedly.",
              },
              {
                icon: TrendingUp,
                title: "Keyword Opportunities",
                description:
                  "Discover keywords you're ranking for but not optimizing. Easy wins waiting to be claimed.",
              },
              {
                icon: Clock,
                title: "90-Day History",
                description:
                  "Track trends over time. See what's working and what's not with historical data.",
              },
              {
                icon: Users,
                title: "Client Reports",
                description:
                  "Generate beautiful PDF reports for clients in one click. White-label available.",
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

      {/* How It Works - OPTIMIZED */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Get Your First AI Insight in 60 Seconds
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Connect GSC",
                description:
                  "One click to securely connect your Google Search Console. Read-only access, your data stays yours.",
              },
              {
                step: "2",
                title: "AI Analyzes Data",
                description:
                  "Our AI scans your pages, keywords, and trends to find issues and opportunities.",
              },
              {
                step: "3",
                title: "Take Action",
                description:
                  "Get a prioritized list: 'Fix this page title', 'Target this keyword', 'Check this drop'.",
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

          <div className="text-center mt-12">
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8">
                Connect GSC Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials - ENHANCED */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Trusted by SEOs Who Get Results
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Chen",
                role: "Marketing Manager",
                company: "TechStart Inc",
                quote: "Found 3 pages losing traffic that I missed. Fixed them and saw 40% lift in 6 weeks. SEOPulse pays for itself.",
                result: "40% traffic increase",
              },
              {
                name: "Michael Torres",
                role: "Freelance SEO",
                company: "Self-employed",
                quote: "I was spending 5+ hours per client on GSC reports. Now it takes 10 minutes. My clients love the AI insights.",
                result: "10+ hours saved weekly",
              },
              {
                name: "Emma Wilson",
                role: "Agency Owner",
                company: "Wilson Digital",
                quote: "Switched from $200/mo tools to SEOPulse. Same insights, better UX, 80% less cost. No-brainer for agencies.",
                result: "80% cost reduction",
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
                <p className="text-gray-700 mb-4">&quot;{testimonial.quote}&quot;</p>
                <div className="bg-green-50 text-green-700 text-sm font-medium px-3 py-1 rounded-full inline-block mb-4">
                  {testimonial.result}
                </div>
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

      {/* Pricing Section - OPTIMIZED */}
      <section id="pricing" className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Start Free, Upgrade When Ready
            </h2>
            <p className="text-gray-600">No credit card required. No surprises. Cancel anytime.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Free",
                price: 0,
                description: "Perfect for trying it out",
                features: ["1 website", "Basic metrics", "7-day history", "Community support"],
                cta: "Start Free",
                popular: false,
              },
              {
                name: "Pro",
                price: 19,
                description: "For serious SEOs",
                features: ["5 websites", "Full AI insights", "90-day history", "PDF reports", "Email alerts", "Priority support"],
                cta: "Start Pro Trial",
                popular: true,
              },
              {
                name: "Agency",
                price: 49,
                description: "For agencies & teams",
                features: ["Unlimited websites", "White-label reports", "Client portals", "API access", "Dedicated support", "Custom integrations"],
                cta: "Start Agency Trial",
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
                <Link href={plan.price === 0 ? "/signup" : "/pricing"}>
                  <Button
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.cta}
                  </Button>
                </Link>
                {plan.price > 0 && (
                  <p className="text-xs text-center text-gray-500 mt-3">
                    14-day money-back guarantee
                  </p>
                )}
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
                q: "How does SEOPulse connect to my data?",
                a: "SEOPulse connects securely to your Google Search Console using OAuth. We only request read-only access. Your credentials are never stored, and you can revoke access anytime from your Google account.",
              },
              {
                q: "Is the free plan really free forever?",
                a: "Yes! Our free plan includes 1 website with basic metrics and 7-day history. No credit card required, no trial period. Use it forever or upgrade when you need more.",
              },
              {
                q: "What makes SEOPulse different from SEMrush or Ahrefs?",
                a: "SEOPulse focuses specifically on Google Search Console data and AI-powered actionable insights. We're simpler, more affordable ($19 vs $100+), and tell you exactly what to do—not just show you data.",
              },
              {
                q: "Can I cancel anytime?",
                a: "Absolutely. No contracts, no commitments. Cancel anytime from your dashboard. You'll keep access until the end of your billing period.",
              },
              {
                q: "Do you offer refunds?",
                a: "Yes! We offer a 14-day money-back guarantee. If you're not satisfied, email us and we'll refund you immediately, no questions asked.",
              },
              {
                q: "Is my data secure?",
                a: "Yes. We use industry-standard encryption (SSL/TLS) for all data transfers. Your data is stored securely on encrypted servers and never shared with third parties.",
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

      {/* Final CTA Section - OPTIMIZED */}
      <section className="py-20 px-4 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Grow Your Organic Traffic?
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Join 500+ SEOs and marketers using SEOPulse to turn GSC data into traffic growth.
          </p>
          <Link href="/signup">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Connect GSC Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <p className="text-blue-200 text-sm mt-4">
            No credit card required • Free forever plan • Setup in 30 seconds
          </p>
        </div>
      </section>

      {/* Footer - ENHANCED */}
      <footer className="py-12 px-4 border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <Link href="/" className="text-xl font-bold text-blue-600">
                SEOPulse
              </Link>
              <p className="text-gray-500 text-sm mt-2">
                AI-Powered Google Search Console insights for growing businesses.
              </p>
              <p className="text-gray-400 text-sm mt-4">
                Questions? <a href="mailto:seopulse.help@gmail.com" className="text-blue-600 hover:underline">seopulse.help@gmail.com</a>
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Product</h4>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="#features" className="hover:text-gray-900">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-gray-900">Pricing</Link></li>
                <li><Link href="#faq" className="hover:text-gray-900">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Resources</h4>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="/blog" className="hover:text-gray-900">Blog</Link></li>
                <li><Link href="/blog/what-is-google-search-console" className="hover:text-gray-900">GSC Guide</Link></li>
                <li><Link href="/contact" className="hover:text-gray-900">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Legal</h4>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="/privacy" className="hover:text-gray-900">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-gray-900">Terms of Service</Link></li>
                <li><Link href="/about" className="hover:text-gray-900">About</Link></li>
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