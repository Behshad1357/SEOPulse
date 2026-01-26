"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";
import { trackPlanUpgrade } from "@/lib/analytics";

export default function CheckoutSuccessPage() {
  // Track plan upgrade on mount
  useEffect(() => {
    // Get plan details from URL or localStorage if available
    const urlParams = new URLSearchParams(window.location.search);
    const plan = urlParams.get("plan") || "Pro";
    const price = parseFloat(urlParams.get("price") || "19");
    
    // Track the successful upgrade
    trackPlanUpgrade(plan, price, "USD");
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Payment Successful!
        </h1>

        <p className="text-gray-600 mb-8">
          Thank you for subscribing! Your account is being upgraded.
        </p>

        <div className="space-y-3">
          <Link href="/dashboard">
            <Button size="lg" className="w-full">
              Go to Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        <p className="text-xs text-gray-400 mt-8">
          A confirmation email has been sent to your email address.
        </p>
      </div>
    </div>
  );
}