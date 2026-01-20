"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Check, Shield, Zap, ArrowRight } from "lucide-react";
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
      "Community support",
    ],
    cta: "Start Free",
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: 19,
    description: "For SEOs who want results",
    features: [
      "5 websites",
      "Full AI insights & recommendations",
      "90-day data history",
      "PDF reports (unlimited)",
      "Email alerts for traffic drops",
      "Priority email support",
    ],
    cta: "Start 14-Day Trial",
    popular: true,
  },
  {
    id: "agency",
    name: "Agency",
    price: 49,
    description: "For teams & client work",
    features: [
      "Unlimited websites",
      "White-label PDF reports",
      "Client access portals",
      "API access",
      "Dedicated support",
      "Custom integrations",
    ],
    cta: "Start 14-Day Trial",
    popular: false,
  },
];

const faqs = [
  {
    q: "Can I cancel anytime?",
    a: "Yes! No contracts. Cancel from your dashboard anytime. You keep access until the end of your billing period.",
  },
  {
    q: "What's your refund policy?",
    a: "We offer a 14-day money-back guarantee. Not satisfied? Email us and we'll refund you immediately.",
  },
  {
    q: "Can I upgrade or downgrade later?",
    a: "Absolutely. Change your plan anytime. Upgrades take effect immediately, downgrades at the next billing cycle.",
  },
  {
    q: "Do you offer annual billing?",
    a: "Not yet, but it's coming soon! Annual plans will include 2 months free.",
  },
];

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);
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
        body: JSON.stringify({ plan: planId }),
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
    <div className="min-h-screen bg-gray-50">
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
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Simple Pricing, Powerful Results
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Start free, upgrade when you need more. All paid plans include a 14-day money-back guarantee.
            </p>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6 mb-12 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-500" />
              14-day money-back guarantee
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-green-500" />
              No credit card for free plan
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              Cancel anytime
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative flex flex-col ${
                  plan.popular ? "border-blue-500 border-2 shadow-xl scale-105" : "border-gray-200"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white text-sm font-medium px-4 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader className="text-center pb-2 pt-8">
                  <CardTitle className="text-2xl font-bold text-gray-900">{plan.name}</CardTitle>
                  <CardDescription className="text-gray-600">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center flex-grow">
                  <div className="mb-6">
                    <span className="text-5xl font-bold text-gray-900">${plan.price}</span>
                    <span className="text-gray-600 text-lg">/month</span>
                  </div>
                  <ul className="space-y-3 text-left">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="pt-4 flex flex-col gap-3">
                  <button
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={loading === plan.id}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                      plan.popular
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "border-2 border-gray-300 bg-white text-gray-900 hover:bg-gray-100"
                    } ${loading === plan.id ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    {loading === plan.id ? "Loading..." : plan.cta}
                    {!loading && <ArrowRight className="w-4 h-4" />}
                  </button>
                  {plan.price > 0 && (
                    <p className="text-xs text-center text-gray-500">
                      14-day money-back guarantee
                    </p>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Comparison Note */}
          <div className="max-w-2xl mx-auto text-center mb-16 bg-blue-50 rounded-xl p-6 border border-blue-100">
            <p className="text-blue-800 font-medium mb-2">
              💡 How we compare to enterprise tools
            </p>
            <p className="text-blue-700 text-sm">
              SEMrush costs $129/mo. Ahrefs costs $99/mo. SEOPulse gives you AI-powered GSC insights for just $19/mo—or free forever on our starter plan.
            </p>
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
              Common Questions
            </h2>
            <div className="grid gap-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-lg p-6 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                  <p className="text-gray-600">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center mt-16">
            <p className="text-gray-600 mb-4">Still have questions?</p>
            <Link href="/contact" className="text-blue-600 hover:underline font-medium">
              Contact us →
            </Link>
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