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
import { User, CreditCard, Link, CheckCircle, AlertCircle } from "lucide-react";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: { success?: string; error?: string; google?: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
            <p className="font-medium text-green-800">
              Subscription Successful!
            </p>
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
            <p className="font-medium text-green-800">
              Google Account Connected!
            </p>
            <p className="text-sm text-green-600">
              Your Google Search Console data is now accessible.
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
        <p className="text-gray-500 mt-1">Manage your account settings</p>
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
          <div>
            <label className="text-sm font-medium text-gray-500">Email</label>
            <p className="text-gray-900">{user?.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Name</label>
            <p className="text-gray-900">{profile?.full_name || "Not set"}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">
              Member since
            </label>
            <p className="text-gray-900">
              {new Date(user?.created_at || "").toLocaleDateString()}
            </p>
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
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900 capitalize">
                {profile?.plan || "Free"} Plan
              </p>
              <p className="text-sm text-gray-500">
                {profile?.plan === "free"
                  ? "1 website, basic features"
                  : profile?.plan === "pro"
                  ? "5 websites, full AI insights"
                  : "Unlimited websites, white-label"}
              </p>
              {subscription?.current_period_end && profile?.plan !== "free" && (
                <p className="text-sm text-gray-500 mt-1">
                  Next billing:{" "}
                  {new Date(subscription.current_period_end).toLocaleDateString()}
                </p>
              )}
            </div>
            {profile?.plan === "free" ? (
              <a href="/pricing">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium">
                  Upgrade to Pro
                </button>
              </a>
            ) : (
              <div className="flex flex-col items-end gap-2">
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  Active
                </span>
                <CancelSubscriptionButton />
              </div>
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
          <CardDescription>
            Connect your accounts to access data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <svg className="w-8 h-8 mr-3" viewBox="0 0 24 24">
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
                <p className="font-medium text-gray-900">
                  Google Search Console
                </p>
                <p className="text-sm text-gray-500">
                  {isGoogleConnected
                    ? "Access your search performance data"
                    : "Connect to view search analytics"}
                </p>
              </div>
            </div>
            <ConnectGoogleButton isConnected={isGoogleConnected} />
          </div>

          {/* Future connections placeholder */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg opacity-60">
            <div className="flex items-center">
              <div className="w-8 h-8 mr-3 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-gray-400 text-xs">GA</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Google Analytics</p>
                <p className="text-sm text-gray-500">Coming soon</p>
              </div>
            </div>
            <span className="text-sm text-gray-400">Coming soon</span>
          </div>
        </CardContent>
      </Card>

      {/* Data & Privacy Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            Data & Privacy
          </CardTitle>
          <CardDescription>Manage your data preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Your Google Search Console data is fetched in real-time and cached
              temporarily for performance. We do not permanently store your
              search analytics data. Disconnecting your Google account will
              immediately revoke our access to your data.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}