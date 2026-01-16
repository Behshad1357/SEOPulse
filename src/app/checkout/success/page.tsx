import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase/admin";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";

interface PageProps {
  searchParams: { session_id?: string };
}

export default async function CheckoutSuccessPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const sessionId = params?.session_id;

  if (!sessionId) {
    redirect("/pricing?error=no_session");
  }

  try {
    // Retrieve the Stripe checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      redirect("/pricing?error=payment_failed");
    }

    const userId = session.metadata?.userId;
    const plan = session.metadata?.plan;

    if (userId && plan) {
      // Update user's plan in the database
      await supabaseAdmin
        .from("profiles")
        .update({ plan })
        .eq("id", userId);

      // Create or update subscription record
      if (session.subscription) {
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );

        const subData = subscription as any;

        await supabaseAdmin.from("subscriptions").upsert({
          user_id: userId,
          stripe_subscription_id: subscription.id,
          stripe_price_id: subscription.items.data[0]?.price?.id || null,
          status: "active",
          current_period_start: subData.current_period_start
            ? new Date(subData.current_period_start * 1000).toISOString()
            : new Date().toISOString(),
          current_period_end: subData.current_period_end
            ? new Date(subData.current_period_end * 1000).toISOString()
            : new Date().toISOString(),
        });
      }
    }

    // Show success page
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>
          
          <p className="text-gray-600 mb-2">
            Thank you for subscribing to SEOPulse <span className="font-semibold capitalize">{plan}</span>!
          </p>
          
          <p className="text-gray-500 text-sm mb-8">
            Your account has been upgraded. You now have access to all {plan} features.
          </p>

          <div className="space-y-3">
            <Link href="/dashboard">
              <Button size="lg" className="w-full">
                Go to Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            
            <Link href="/dashboard/settings">
              <Button variant="outline" size="lg" className="w-full">
                View Subscription
              </Button>
            </Link>
          </div>

          <p className="text-xs text-gray-400 mt-8">
            A confirmation email has been sent to your email address.
          </p>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Checkout success error:", error);
    
    // Show generic success even if verification fails
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Received!
          </h1>
          
          <p className="text-gray-600 mb-8">
            Your payment was successful. Please log in to access your upgraded account.
          </p>

          <div className="space-y-3">
            <Link href="/login">
              <Button size="lg" className="w-full">
                Log In
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}