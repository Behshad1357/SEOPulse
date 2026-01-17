import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's subscription
    const { data: subscription } = await supabaseAdmin
      .from("subscriptions")
      .select("stripe_subscription_id")
      .eq("user_id", user.id)
      .eq("status", "active")
      .single();

    if (!subscription?.stripe_subscription_id) {
      return NextResponse.json({ error: "No active subscription found" }, { status: 400 });
    }

    // Cancel subscription in Stripe
    await stripe.subscriptions.cancel(subscription.stripe_subscription_id);

    // Update subscription status in database
    await supabaseAdmin
      .from("subscriptions")
      .update({ status: "canceled" })
      .eq("stripe_subscription_id", subscription.stripe_subscription_id);

    // Downgrade user to free plan
    await supabaseAdmin
      .from("profiles")
      .update({ plan: "free" })
      .eq("id", user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cancel subscription error:", error);
    return NextResponse.json({ error: "Failed to cancel subscription" }, { status: 500 });
  }
}