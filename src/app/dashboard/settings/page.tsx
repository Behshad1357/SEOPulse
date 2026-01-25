import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ConnectGoogleButton } from "@/components/dashboard/connect-google-button";
import { CancelSubscriptionButton } from "@/components/dashboard/cancel-subscription-button";
import { User, CreditCard, Link, CheckCircle, AlertCircle, Check, Shield } from "lucide-react";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: { success?: string; error?: string; google?: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get user's profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  // Get subscription details
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user?.id)
    .eq("status", "active")
    .single();

  // Check if Google is connected
  const isGoogleConnected = !!profile?.google_refresh_token;

  // Await searchParams for Next.js 15
  const params = await searchParams;
  const showSuccess = params?.success === "subscribed";
  const googleConnected = params?.google === "connected";
  const googleError = params?.error;

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Success Messages */}
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <div>
            <p className="font-medium text-green-800">Subscription Successful!</p>
            <p className="text-sm text-green-600">
              Your account has been upgraded. Thank you for subscribing!
            </p>
          </div>
        </div>
      )}

      {googleConnected && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <div>
            <p className="font-medium text-green-800">Google Account Connected!</p>
            <p className="text-sm text-green-600">
              Your Google Search Console and Analytics data is now accessible.
            </p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {googleError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div>
            <p className="font-medium text-red-800">Connection Failed</p>
            <p className="text-sm text-red-600">
              {googleError === "no_code"
                ? "Authorization was cancelled or failed."
                : googleError === "token_exchange_failed"
                ? "Failed to exchange authorization code."
                : googleError === "save_failed"
                ? "Failed to save credentials."
                : "An error occurred while connecting Google."}
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account settings and connections</p>
      </div>

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            Profile
          </CardTitle>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-gray-900">{user?.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Name</label>
              <p className="text-gray-900">{profile?.full_name || "Not set"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Member since</label>
              <p className="text-gray-900">
                {new Date(user?.created_at || "").toLocaleDateString()}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Account ID</label>
              <p className="text-gray-500 text-sm font-mono">{user?.id?.slice(0, 8)}...</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscription Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Subscription
          </CardTitle>
          <CardDescription>Manage your subscription plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-gray-900 capitalize text-lg">
                  {profile?.plan || "Free"} Plan
                </p>
                {profile?.plan !== "free" && (
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    Active
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {profile?.plan === "free"
                  ? "1 website, basic features"
                  : profile?.plan === "pro"
                  ? "5 websites, full AI insights, priority support"
                  : "Unlimited websites, white-label reports"}
              </p>
              {subscription?.current_period_end && profile?.plan !== "free" && (
                <p className="text-xs text-gray-400 mt-2">
                  Next billing: {new Date(subscription.current_period_end).toLocaleDateString()}
                </p>
              )}
            </div>
            {profile?.plan === "free" ? (
              <a href="/pricing">
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-lg hover:from-blue-700 hover:to-purple-700 font-medium shadow-md transition-all">
                  Upgrade to Pro
                </button>
              </a>
            ) : (
              <CancelSubscriptionButton />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Connections Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Link className="w-5 h-5 mr-2" />
            Connections
          </CardTitle>
          <CardDescription>Connect your accounts to access data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Google Search Console */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
            <div className="flex items-center">
              <svg className="w-10 h-10 mr-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <div>
                <p className="font-medium text-gray-900">Google Search Console</p>
                <p className="text-sm text-gray-500">
                  {isGoogleConnected
                    ? "Connected - Access your search performance data"
                    : "Connect to view search analytics and keywords"}
                </p>
              </div>
            </div>
            <ConnectGoogleButton isConnected={isGoogleConnected} />
          </div>

          {/* Google Analytics 4 */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
            <div className="flex items-center">
              <div className="w-10 h-10 mr-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-900">Google Analytics 4</p>
                  <span className="px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded text-xs font-medium">
                    NEW
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  {isGoogleConnected
                    ? "Available - View traffic, users, and behavior data"
                    : "Connect Google first to access Analytics"}
                </p>
              </div>
            </div>
            {isGoogleConnected ? (
              <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
                <Check className="w-4 h-4" />
                Available
              </span>
            ) : (
              <span className="text-sm text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full">
                Connect Google first
              </span>
            )}
          </div>

          {/* Coming Soon - AI Content Writer */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-dashed border-gray-200 opacity-70">
            <div className="flex items-center">
              <div className="w-10 h-10 mr-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-900">AI Content Writer</p>
                  <span className="px-1.5 py-0.5 bg-purple-100 text-purple-600 rounded text-xs font-medium">
                    COMING SOON
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  Generate SEO-optimized titles, descriptions, and content
                </p>
              </div>
            </div>
            <span className="text-sm text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full">
              Coming soon
            </span>
          </div>

          {/* Coming Soon - Competitor Tracking */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-dashed border-gray-200 opacity-70">
            <div className="flex items-center">
              <div className="w-10 h-10 mr-4 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-900">Competitor Tracking</p>
                  <span className="px-1.5 py-0.5 bg-green-100 text-green-600 rounded text-xs font-medium">
                    COMING SOON
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  Compare your rankings against competitors
                </p>
              </div>
            </div>
            <span className="text-sm text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full">
              Coming soon
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Data & Privacy Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Data & Privacy
          </CardTitle>
          <CardDescription>How we handle your data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Your data is secure</p>
                <ul className="space-y-1 text-blue-700">
                  <li>• Read-only access to Google Search Console & Analytics</li>
                  <li>• Data is fetched in real-time, not permanently stored</li>
                  <li>• Disconnect anytime to revoke access immediately</li>
                  <li>• We never share your data with third parties</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="flex gap-4 text-sm">
            <a href="/privacy" className="text-blue-600 hover:underline font-medium">
              Privacy Policy
            </a>
            <a href="/terms" className="text-blue-600 hover:underline font-medium">
              Terms of Service
            </a>
            <a href="mailto:seopulse.help@gmail.com" className="text-blue-600 hover:underline font-medium">
              Contact Support
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}