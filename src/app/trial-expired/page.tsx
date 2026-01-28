import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Clock, Zap, CheckCircle, ArrowRight } from "lucide-react";

export default function TrialExpiredPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        <div className="bg-white rounded-2xl shadow-xl border p-8 text-center">
          {/* Icon */}
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-10 h-10 text-orange-600" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Your Free Trial Has Ended
          </h1>
          <p className="text-gray-600 mb-8">
            You've experienced the power of AI-driven SEO insights. 
            Upgrade now to continue growing your traffic!
          </p>

          {/* What you'll get */}
          <div className="bg-blue-50 rounded-xl p-6 mb-8 text-left">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-600" />
              Upgrade to Pro and get:
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Unlimited AI insights & recommendations</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">90-day historical data tracking</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Up to 5 websites</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Priority email support</span>
              </li>
            </ul>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <Link href="/pricing" className="block">
              <Button size="lg" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                View Plans & Upgrade
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <p className="text-sm text-gray-500">
              Starting at just $19/month • Cancel anytime
            </p>
          </div>

          {/* Alternative */}
          <div className="mt-8 pt-6 border-t">
            <p className="text-sm text-gray-500">
              Need more time?{" "}
              <a href="mailto:seopulse.help@gmail.com" className="text-blue-600 hover:underline">
                Contact us
              </a>{" "}
              for a trial extension.
            </p>
          </div>
        </div>

        {/* Back to home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
            ← Back to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}