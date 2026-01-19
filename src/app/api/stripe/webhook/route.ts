import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase/admin";
import Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    console.error("Webhook: No signature provided");
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  console.log(`Webhook received: ${event.type}`);

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const plan = session.metadata?.plan;

        if (userId && plan) {
          await supabaseAdmin
            .from("profiles")
            .update({ plan })
            .eq("id", userId);

          if (session.subscription) {
            const subscriptionId = typeof session.subscription === "string" 
              ? session.subscription 
              : session.subscription.id;
              
            const subscriptionData = await stripe.subscriptions.retrieve(subscriptionId);
            const subAny = subscriptionData as any;

            await supabaseAdmin.from("subscriptions").upsert({
              user_id: userId,
              stripe_subscription_id: subscriptionData.id,
              stripe_price_id: subscriptionData.items.data[0]?.price?.id || null,
              status: "active",
              current_period_start: subAny.current_period_start 
                ? new Date(subAny.current_period_start * 1000).toISOString() 
                : new Date().toISOString(),
              current_period_end: subAny.current_period_end 
                ? new Date(subAny.current_period_end * 1000).toISOString() 
                : new Date().toISOString(),
            });
          }
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as any;

        const statusMap: Record<string, string> = {
          active: "active",
          past_due: "past_due",
          canceled: "canceled",
          unpaid: "inactive",
          trialing: "trialing",
          incomplete: "inactive",
          incomplete_expired: "inactive",
          paused: "paused",
        };

        const status = statusMap[subscription.status] || "inactive";

        await supabaseAdmin
          .from("subscriptions")
          .update({
            status,
            current_period_start: subscription.current_period_start 
              ? new Date(subscription.current_period_start * 1000).toISOString()
              : undefined,
            current_period_end: subscription.current_period_end
              ? new Date(subscription.current_period_end * 1000).toISOString()
              : undefined,
          })
          .eq("stripe_subscription_id", subscription.id);
        
        if (["canceled", "unpaid", "inactive"].includes(status)) {
          const { data: sub } = await supabaseAdmin
            .from("subscriptions")
            .select("user_id")
            .eq("stripe_subscription_id", subscription.id)
            .single();

          if (sub?.user_id) {
            await supabaseAdmin
              .from("profiles")
              .update({ plan: "free" })
              .eq("id", sub.user_id);
          }
        }
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as any;
        console.log(`Invoice paid: ${invoice.id}`);
        
        // Update subscription dates on successful renewal
        if (invoice.subscription) {
          const subscriptionId = typeof invoice.subscription === "string"
            ? invoice.subscription
            : invoice.subscription.id;
          
          const subscription = await stripe.subscriptions.retrieve(subscriptionId) as any;
          
          await supabaseAdmin
            .from("subscriptions")
            .update({
              status: "active",
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            })
            .eq("stripe_subscription_id", subscriptionId);
        }
        break;
      }
      
      case "invoice.payment_failed": {
        const invoice = event.data.object as any;
        
        if (invoice.subscription) {
          const subscriptionId = typeof invoice.subscription === "string"
            ? invoice.subscription
            : invoice.subscription.id;

          await supabaseAdmin
            .from("subscriptions")
            .update({ status: "past_due" })
            .eq("stripe_subscription_id", subscriptionId);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as any;

        await supabaseAdmin
          .from("subscriptions")
          .update({ status: "canceled" })
          .eq("stripe_subscription_id", subscription.id);

        const { data: sub } = await supabaseAdmin
          .from("subscriptions")
          .select("user_id")
          .eq("stripe_subscription_id", subscription.id)
          .single();

        if (sub?.user_id) {
          await supabaseAdmin
            .from("profiles")
            .update({ plan: "free" })
            .eq("id", sub.user_id);
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}