import { NextResponse } from "next/server";
import { getStripe, isStripeConfigured } from "@/lib/stripe/server";

// Stripe needs the Node runtime (raw body + crypto) — not Edge.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Receives Stripe events. Signature is verified against
// GEIGER_STRIPE_WEBHOOK_SECRET (add it in Vercel + via `stripe listen` locally).
// For this one-time-payment demo the success page is the primary confirmation;
// the webhook is the durable, server-trusted record of a completed payment.
export async function POST(request) {
  const stripe = getStripe();
  const secret = process.env.GEIGER_STRIPE_WEBHOOK_SECRET;

  if (!isStripeConfigured() || !stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }
  if (!secret) {
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  const body = await request.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch (error) {
    console.error("[stripe.webhook] signature verification failed:", error?.message || error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        // Payment succeeded. session.metadata carries { userId, planId, billing,
        // products, estimateUsd }. Persist/grant entitlements here when ready.
        console.log("[stripe.webhook] checkout completed", {
          sessionId: session.id,
          email: session.customer_details?.email,
          amountTotal: session.amount_total,
          metadata: session.metadata,
        });
        break;
      }
      case "payment_intent.payment_failed": {
        const intent = event.data.object;
        console.warn("[stripe.webhook] payment failed", intent.id, intent.last_payment_error?.message);
        break;
      }
      default:
        // Other event types are acknowledged but not acted on.
        break;
    }
  } catch (error) {
    console.error("[stripe.webhook] handler error:", error?.message || error);
    return NextResponse.json({ error: "Handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
