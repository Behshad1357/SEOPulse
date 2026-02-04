"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Check, Shield, Zap, ArrowRight, Clock, Users, Star } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    id: "free",
    name: "Free",
    price: 0,
    description: "Try it out, no commitment",
    features: [
      "1 website",
      "Basic metrics dashboard",
      "7-day data history",
      "5 page scores",
      "Community support",
    ],
    limitations: [
      "Limited AI insights",
      "No PDF reports",
      "No email alerts",
    ],
    cta: "Start Free",
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: 19,
    originalPrice: 38,
    description: "For SEOs who want results",
    features: [
      "5 websites",
      "Full AI insights & recommendations",
      "90-day data history",
      "50 page scores with fix priorities",
      "PDF reports (unlimited)",
      "Email alerts for traffic drops",
      "Priority email support",
    ],
    cta: "Start 14-Day Free Trial",
    popular: true,
  },
  {
    id: "agency",
    name: "Agency",
    price: 49,
    originalPrice: 99,
    description: "For teams & client work",
    features: [
      "Unlimited websites",
      "500 page scores",
      "White-label PDF reports",
      "Client access portals",
      "API access",
      "Dedicated support",
      "Custom integrations",
    ],
    cta: "Start 14-Day Free Trial",
    popular: false,
  },
];

// Countdown timer component
function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-2 justify-center">
      <Clock className="w-4 h-4" />
      <span className="font-mono">
        {String(timeLeft.hours).padStart(2, '0')}:
        {String(timeLeft.minutes).padStart(2, '0')}:
        {String(timeLeft.seconds).padStart(2, '0')}
      </span>
    </div>
  );
}

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState("LAUNCH50");
  const router = useRouter();

  const handleSubscribe = async (planId: string) => {
    if (planId === "free") {
      router.push("/signup");
      return;
    }

    setLoading(planId);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          plan: planId,
          coupon: couponCode 
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else if (data.error) {
        if (data.error === "Unauthorized") {
          router.push("/signup");
        } else {
          alert("Error: " + data.error);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Urgency Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 text-center">
          <span className="font-semibold">🚀 Launch Special: 50% OFF first month!</span>
          <span className="text-purple-200">|</span>
          <span>Code: <code className="bg-white/20 px-2 py-1 rounded font-mono">LAUNCH50</code></span>
          <span className="text-purple-200">|</span>
          <span className="text-yellow-300"><CountdownTimer /></span>
        </div>
      </div>

      {/* Header */}
      <nav className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-blue-600">
            SEOPulse
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-gray-600 hover:text-gray-900">
              Login
            </Link>
            <Link href="/signup">
              <Button>Start Free</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Users className="w-4 h-4" />
              500+ SEOs trust SEOPulse
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Stop Guessing. Start Ranking.
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get AI-powered insights that tell you exactly what to fix.
              <span className="text-purple-600 font-semibold"> 14-day free trial, cancel anytime.</span>
            </p>
          </div>

          {/* Social Proof */}
          <div className="flex flex-wrap justify-center gap-6 mb-12 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <span>4.9/5 from 127 reviews</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-500" />
              14-day money-back guarantee
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-green-500" />
              No credit card for free plan
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative flex flex-col ${
                  plan.popular 
                    ? "border-purple-500 border-2 shadow-2xl shadow-purple-500/20 scale-105" 
                    : "border-gray-200"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-medium px-4 py-1.5 rounded-full shadow-lg">
                      ⭐ Most Popular
                    </span>
                  </div>
                )}
                
                <CardHeader className="text-center pb-2 pt-8">
                  <CardTitle className="text-2xl font-bold text-gray-900">{plan.name}</CardTitle>
                  <CardDescription className="text-gray-600">{plan.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="text-center flex-grow">
                  <div className="mb-6">
                    {plan.originalPrice && (
                      <span className="text-lg text-gray-400 line-through mr-2">
                        ${plan.originalPrice}
                      </span>
                    )}
                    <span className="text-5xl font-bold text-gray-900">${plan.price}</span>
                    <span className="text-gray-600 text-lg">/month</span>
                    {plan.popular && (
                      <div className="mt-2">
                        <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded">
                          Save $19/mo with LAUNCH50
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <ul className="space-y-3 text-left">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                    {plan.limitations?.map((limitation, index) => (
                      <li key={`lim-${index}`} className="flex items-start text-gray-400">
                        <span className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5 text-center">✗</span>
                        <span>{limitation}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                
                <CardFooter className="pt-4 flex flex-col gap-3">
                  <button
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={loading === plan.id}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                      plan.popular
                        ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl"
                        : "border-2 border-gray-300 bg-white text-gray-900 hover:bg-gray-50"
                    } ${loading === plan.id ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    {loading === plan.id ? "Loading..." : plan.cta}
                    {!loading && <ArrowRight className="w-4 h-4" />}
                  </button>
                  {plan.price > 0 && (
                    <p className="text-xs text-center text-gray-500">
                      14-day free trial • Cancel anytime • No questions asked
                    </p>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Comparison Note */}
          <div className="max-w-2xl mx-auto text-center mb-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
            <p className="text-blue-800 font-semibold mb-2 text-lg">
              💡 Why pay $129/mo for SEMrush?
            </p>
            <p className="text-blue-700">
              SEOPulse gives you AI-powered GSC insights, page-by-page fix recommendations, 
              and PDF reports for just <span className="font-bold">$19/mo</span>. 
              That's <span className="font-bold">85% less</span> than enterprise tools.
            </p>
          </div>

          {/* Testimonials */}
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
              What SEOs Are Saying
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-white">
                <CardContent className="pt-6">
                  <div className="flex mb-2">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4">
                    "Finally, an SEO tool that tells me exactly what to fix instead of just showing data. 
                    The page scores feature alone saved me hours of analysis."
                  </p>
                  <p className="text-sm font-medium text-gray-900">— Sarah K., Freelance SEO</p>
                </CardContent>
              </Card>
              <Card className="bg-white">
                <CardContent className="pt-6">
                  <div className="flex mb-2">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4">
                    "The AI insights are spot-on. It caught a traffic drop before I even noticed 
                    and told me exactly which pages to optimize. Worth every penny."
                  </p>
                  <p className="text-sm font-medium text-gray-900">— Mike R., Agency Owner</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
              Common Questions
            </h2>
            <div className="grid gap-4">
              {[
                {
                  q: "Do I need a credit card to start?",
                  a: "No! The free plan requires no credit card. Paid plans include a 14-day free trial."
                },
                {
                  q: "Can I cancel anytime?",
                  a: "Yes, cancel with one click from your dashboard. No questions asked, no cancellation fees."
                },
                {
                  q: "What if SEOPulse doesn't work for me?",
                  a: "We offer a 14-day money-back guarantee. If you're not satisfied, email us and we'll refund you immediately."
                },
                {
                  q: "How is this different from SEMrush/Ahrefs?",
                  a: "Those tools show you data. SEOPulse tells you exactly what to DO. Our AI analyzes your GSC data and gives specific, actionable fixes for each page."
                }
              ].map((faq, index) => (
                <Card key={index} className="bg-white">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                    <p className="text-gray-600">{faq.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center mt-16 py-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Rank Higher?</h2>
            <p className="text-purple-100 mb-6 max-w-md mx-auto">
              Join 500+ SEOs who are using AI to get better rankings with less guesswork.
            </p>
            <Button 
              size="lg" 
              className="bg-white text-purple-600 hover:bg-purple-50 font-semibold"
              onClick={() => router.push('/signup')}
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <p className="text-sm text-purple-200 mt-4">
              No credit card required • Setup in 2 minutes
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} SEOPulse. All rights reserved.
          <span className="mx-2">•</span>
          <Link href="/privacy" className="hover:text-gray-900">Privacy</Link>
          <span className="mx-2">•</span>
          <Link href="/terms" className="hover:text-gray-900">Terms</Link>
        </div>
      </footer>
    </div>
  );
}