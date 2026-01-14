import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe, getOrCreateCustomer, PLANS } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const { plan } = await request.json();

    if (!plan || !["pro", "agency"].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_customer_id, full_name")
      .eq("id", user.id)
      .single();

    // Get or create Stripe customer
    const customer = await getOrCreateCustomer(
      user.email!,
      profile?.stripe_customer_id,
      profile?.full_name || undefined
    );

    // Update customer ID in profile if new
    if (!profile?.stripe_customer_id) {
      await supabase
        .from("profiles")
        .update({ stripe_customer_id: customer.id })
        .eq("id", user.id);
    }

    // Create checkout session
    const selectedPlan = PLANS[plan as keyof typeof PLANS];
    
    if (!selectedPlan.priceId) {
      return NextResponse.json({ error: "Price ID not configured" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ["card"],
      line_items: [
        {
          price: selectedPlan.priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?success=subscribed`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
      metadata: {
        userId: user.id,
        plan,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}