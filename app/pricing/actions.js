"use server";

import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { getUser } from "@/supabase/user/getUser";
import { getStripe, isStripeConfigured } from "@/lib/stripe/server";
import { computeEstimate, YEARLY_MULTIPLIER, products as PRODUCT_CATALOG } from "@/lib/pricing/plans";

const PRODUCT_NAMES = new Map(PRODUCT_CATALOG.map((p) => [p.id, p.name]));

// Resolve the absolute origin for Stripe success/cancel redirects. Prefer the
// live request host (so preview deployments work), fall back to the configured
// app URL, then localhost for dev.
async function resolveOrigin() {
  const h = await headers();
  const origin = h.get("origin");
  if (origin) return origin;
  const host = h.get("x-forwarded-host") || h.get("host");
  if (host) {
    const proto = h.get("x-forwarded-proto") || "https";
    return `${proto}://${host}`;
  }
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

// Creates a one-time Checkout Session for the configured plan. The total is
// recomputed here from the same pricing module the UI uses — the client-sent
// amount is never trusted. Returns { url } on success, or { error } the client
// maps to a redirect / toast.
export async function createCheckoutAction(payload = {}) {
  const supabase = await createClient();
  const user = await getUser(supabase);
  if (!user) return { error: "auth" };

  if (!isStripeConfigured()) return { error: "stripe_unconfigured" };

  const { planId, selectedProducts = [], metrics = {}, isYearly = false } = payload;

  const { selectedPlan, total } = computeEstimate({ planId, selectedProducts, metrics });
  const multiplier = isYearly ? YEARLY_MULTIPLIER : 1;
  const amountCents = Math.round(total * multiplier * 100);

  // Stripe rejects charges under $0.50.
  if (!Number.isFinite(amountCents) || amountCents < 50) {
    return { error: "amount_too_low" };
  }

  const interval = isYearly ? "year" : "month";
  const productList = (Array.isArray(selectedProducts) ? selectedProducts : [])
    .map((id) => PRODUCT_NAMES.get(id))
    .filter(Boolean);
  const description = productList.length
    ? `${selectedPlan.name} foundation · ${productList.join(", ")}`
    : `${selectedPlan.name} foundation`;

  try {
    const stripe = getStripe();
    const origin = await resolveOrigin();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: user.email || undefined,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: amountCents,
            product_data: {
              name: `Geiger ${selectedPlan.name} (${interval}ly estimate)`,
              description,
            },
          },
        },
      ],
      // Surfaced back to us on the webhook / success page so a payment can be
      // tied to the account and the configured plan.
      metadata: {
        userId: user.id,
        planId: selectedPlan.id,
        billing: interval,
        products: productList.join(","),
        estimateUsd: String(amountCents / 100),
      },
      success_url: `${origin}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing?checkout=canceled`,
    });

    if (!session?.url) return { error: "session_failed" };
    return { url: session.url };
  } catch (error) {
    console.error("[pricing.checkout]", error?.message || error);
    return { error: "session_failed" };
  }
}
