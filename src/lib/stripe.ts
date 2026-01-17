import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil" as any,
  typescript: true,
});

export const PLANS = {
  free: {
    name: "Free",
    price: 0,
    priceId: null,
    websites: 1,
    features: ["1 website", "Basic metrics", "7-day data history"],
  },
  pro: {
    name: "Pro",
    price: 19,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    websites: 5,
    features: [
      "5 websites",
      "Full AI insights",
      "90-day data history",
      "PDF reports",
      "Email alerts",
    ],
  },
  agency: {
    name: "Agency",
    price: 49,
    priceId: process.env.STRIPE_AGENCY_PRICE_ID,
    websites: -1,
    features: [
      "Unlimited websites",
      "White-label reports",
      "Client access",
      "Priority support",
      "API access",
    ],
  },
};

export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  userId: string
) {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    // FIXED: Changed from /dashboard/settings to /checkout/success
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
    metadata: {
      userId,
    },
  });

  return session;
}

export async function createCustomer(email: string, name?: string) {
  const customer = await stripe.customers.create({
    email,
    name: name || undefined,
  });

  return customer;
}

export async function getOrCreateCustomer(
  email: string,
  customerId?: string | null,
  name?: string
) {
  if (customerId) {
    try {
      const customer = await stripe.customers.retrieve(customerId);
      if (!customer.deleted) {
        return customer as Stripe.Customer;
      }
    } catch (error) {
      // Customer not found, create new one
    }
  }

  return createCustomer(email, name);
}

export async function cancelSubscription(subscriptionId: string) {
  return stripe.subscriptions.cancel(subscriptionId);
}

export async function getSubscription(subscriptionId: string) {
  return stripe.subscriptions.retrieve(subscriptionId);
}