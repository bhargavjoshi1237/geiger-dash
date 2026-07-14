"use server";

import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { getUser } from "@/supabase/user/getUser";
import { getStripe, isStripeConfigured } from "@/lib/stripe/server";
import { computeEstimate, getPlanRank, YEARLY_MULTIPLIER, products as PRODUCT_CATALOG } from "@/lib/pricing/plans";
import { recordPendingCheckout } from "@/lib/billing/store";
import { getOrgEntitlements } from "@/lib/billing/entitlements";

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

  const { planId, selectedProducts = [], metrics = {}, isYearly = false, organizationId = null } = payload;

  // Coming-soon catalog items aren't purchasable yet — drop them so a tampered
  // payload can't buy an unbuilt add-on (e.g. the "Own domain" product).
  const COMING_SOON = new Set(PRODUCT_CATALOG.filter((p) => p.comingSoon).map((p) => p.id));
  const purchasableProducts = (Array.isArray(selectedProducts) ? selectedProducts : []).filter(
    (id) => !COMING_SOON.has(id),
  );

  // Validate org membership through the user's own (RLS-scoped) client: a select
  // that returns the row proves the user belongs to it. metadata is fetched too
  // so entitlements (current plan/products/metrics) can be re-derived here —
  // the client's view of "what's already owned" is never trusted.
  if (!organizationId) return { error: "invalid_org" };
  const { data: org } = await supabase
    .from("organizations")
    .select("id, metadata")
    .eq("id", organizationId)
    .is("deleted_at", null)
    .maybeSingle();
  if (!org) return { error: "invalid_org" };

  const entitlements = getOrgEntitlements(org);

  // No downgrades: the plan tier, every previously-owned product, and every
  // previously-purchased metric floor must all be present in this submission.
  if (entitlements.hasSubscription) {
    if (getPlanRank(planId) < entitlements.planRank) return { error: "downgrade_blocked" };
    const missingOwnedProduct = entitlements.unlockedProducts.some((id) => !purchasableProducts.includes(id));
    if (missingOwnedProduct) return { error: "downgrade_blocked" };
    const belowMetricFloor = Object.entries(entitlements.currentMetrics || {}).some(
      ([key, ownedValue]) => Number(metrics?.[key]) < Number(ownedValue),
    );
    if (belowMetricFloor) return { error: "downgrade_blocked" };
  }

  const { selectedPlan, total } = computeEstimate({ planId, selectedProducts: purchasableProducts, metrics });
  const multiplier = isYearly ? YEARLY_MULTIPLIER : 1;

  // Charge only the incremental difference over what the org already paid —
  // normalize both totals to a monthly figure before comparing so switching
  // billing interval (monthly <-> yearly) mid-upgrade can't skew the delta.
  const currentMonthlyTotal = entitlements.hasSubscription
    ? entitlements.amountTotal / 100 / (entitlements.billingInterval === "year" ? YEARLY_MULTIPLIER : 1)
    : 0;
  const deltaMonthly = Math.max(0, total - currentMonthlyTotal);
  const amountCents = Math.round(deltaMonthly * multiplier * 100);

  if (entitlements.hasSubscription && deltaMonthly <= 0) {
    return { error: "no_change" };
  }

  // Stripe rejects charges under $0.50.
  if (!Number.isFinite(amountCents) || amountCents < 50) {
    return { error: "amount_too_low" };
  }

  const interval = isYearly ? "year" : "month";
  const productIds = purchasableProducts.filter((id) => PRODUCT_NAMES.has(id));
  const productList = productIds.map((id) => PRODUCT_NAMES.get(id));
  const descriptionPrefix = entitlements.hasSubscription ? "Upgrade — " : "";
  const description = productList.length
    ? `${descriptionPrefix}${selectedPlan.name} foundation · ${productList.join(", ")}`
    : `${descriptionPrefix}${selectedPlan.name} foundation`;

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
        organizationId,
        planId: selectedPlan.id,
        billing: interval,
        products: productList.join(","),
        estimateUsd: String(amountCents / 100),
        isUpgrade: String(entitlements.hasSubscription),
      },
      success_url: `${origin}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing?checkout=canceled`,
    });

    if (!session?.url) return { error: "session_failed" };

    // Record a pending payment + purchase keyed by the session id. The webhook
    // / success-page finalizer flips these to paid/completed and sets the plan.
    // Best-effort: a logging failure must not block the user reaching Stripe.
    await recordPendingCheckout({
      userId: user.id,
      sessionId: session.id,
      amountCents,
      currency: "usd",
      planKey: selectedPlan.id,
      billingInterval: interval,
      products: productIds,
      metrics,
      organizationId,
      customerEmail: user.email || null,
    });

    return { url: session.url };
  } catch (error) {
    console.error("[pricing.checkout]", error?.message || error);
    return { error: "session_failed" };
  }
}
