import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",  // Updated to 2026-compatible version
});

function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

async function getUserFromCookies() {
  const cookieStore = await cookies();
  const possibleCookieNames = [
    'sb-egislyqtbkxqbbtjcktv-auth-token',
  ];
  
  for (const cookieName of possibleCookieNames) {
    const sessionCookie = cookieStore.get(cookieName)?.value;
    if (sessionCookie) {
      try {
        const session = JSON.parse(sessionCookie);
        const userId = session?.user?.id || session?.[0]?.user?.id;
        const email = session?.user?.email || session?.[0]?.user?.email;
        if (userId) return { userId, email };
      } catch (e) {
        continue;
      }
    }
  }
  return null;
}

const PRICE_IDS: Record<string, string> = {
  pro: process.env.STRIPE_PRO_PRICE_ID!,
  agency: process.env.STRIPE_AGENCY_PRICE_ID!,
};

export async function POST(req: NextRequest) {
  try {
    const userInfo = await getUserFromCookies();
    
    if (!userInfo) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan, coupon } = await req.json();

    if (!plan || !PRICE_IDS[plan]) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    // Get or create Stripe customer
    const adminClient = createAdminClient();
    const { data: profile } = await adminClient
      .from('profiles')
      .select('stripe_customer_id, email')
      .eq('id', userInfo.userId)
      .single();

    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: userInfo.email || profile?.email,
        metadata: { supabase_user_id: userInfo.userId }
      });
      customerId = customer.id;

      await adminClient
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', userInfo.userId);
    }

    // Create checkout session
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: PRICE_IDS[plan],
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true&plan=${plan}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
      subscription_data: {
        trial_period_days: 14,
        metadata: {
          plan,
          user_id: userInfo.userId
        }
      },
      allow_promotion_codes: true, // Allow any coupon code
    };

    // Apply specific coupon if provided
    if (coupon) {
      try {
        const promotionCodes = await stripe.promotionCodes.list({
          code: coupon,
          active: true,
          limit: 1
        });
        
        if (promotionCodes.data.length > 0) {
          sessionParams.discounts = [{ promotion_code: promotionCodes.data[0].id }];
          delete sessionParams.allow_promotion_codes; // Can't use both
        }
      } catch (e) {
        // Coupon not found, continue without it
        console.log('Coupon not found:', coupon);
      }
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({ url: session.url });

  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}