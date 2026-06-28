import Stripe from "stripe";

// Server-only Stripe client. The secret key lives in Vercel as
// GEIGER_STRIPE_SECRET_KEY (Production + Preview). When it is absent/empty the
// helpers degrade gracefully — callers return a "not configured" result and the
// UI shows a clear message instead of crashing. Mirror of the Supabase
// isConfigured() guard pattern used across the data layer.

let cached = null;

export function isStripeConfigured() {
  return Boolean(process.env.GEIGER_STRIPE_SECRET_KEY);
}

export function getStripe() {
  if (!isStripeConfigured()) return null;
  if (!cached) {
    // No apiVersion override — use the version pinned by this SDK release.
    cached = new Stripe(process.env.GEIGER_STRIPE_SECRET_KEY);
  }
  return cached;
}
