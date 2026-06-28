import Link from "next/link";
import { ArrowRight, CheckCircle2, CircleAlert } from "lucide-react";
import { Header } from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { getStripe, isStripeConfigured } from "@/lib/stripe/server";

export const dynamic = "force-dynamic";

function formatUsd(amountCents) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "usd" }).format(
    (amountCents || 0) / 100,
  );
}

async function retrieveSession(sessionId) {
  if (!sessionId || !isStripeConfigured()) return null;
  try {
    const stripe = getStripe();
    return await stripe.checkout.sessions.retrieve(sessionId);
  } catch (error) {
    console.error("[pricing.success]", error?.message || error);
    return null;
  }
}

export default async function CheckoutSuccessPage({ searchParams }) {
  const params = await searchParams;
  const sessionId = typeof params?.session_id === "string" ? params.session_id : null;
  const session = await retrieveSession(sessionId);

  const paid = session?.payment_status === "paid";
  const amount = session ? formatUsd(session.amount_total) : null;
  const email = session?.customer_details?.email || null;
  const planName = session?.metadata?.planId
    ? session.metadata.planId.charAt(0).toUpperCase() + session.metadata.planId.slice(1)
    : null;

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <Header />
      <main className="relative flex flex-1 items-center justify-center px-4 py-28 sm:py-36">
        <div className="w-full max-w-md rounded-2xl border border-border bg-surface-card p-8 text-center">
          <span
            className={`mx-auto flex size-14 items-center justify-center rounded-full border ${
              paid
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                : "border-amber-500/20 bg-amber-500/10 text-amber-400"
            }`}
          >
            {paid ? <CheckCircle2 className="size-7" /> : <CircleAlert className="size-7" />}
          </span>

          <h1 className="mt-6 text-2xl font-semibold tracking-tight">
            {paid ? "Payment successful" : "Thanks for your order"}
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {paid
              ? "Your payment has been processed. A receipt is on its way to your inbox."
              : "We're confirming your payment. This can take a moment to settle."}
          </p>

          {session ? (
            <dl className="mt-6 space-y-2.5 rounded-xl border border-border bg-background/50 p-4 text-left text-sm">
              {planName ? (
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted-foreground">Plan</dt>
                  <dd className="font-medium">{planName}</dd>
                </div>
              ) : null}
              {amount ? (
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted-foreground">Amount</dt>
                  <dd className="font-semibold tabular-nums">{amount}</dd>
                </div>
              ) : null}
              {email ? (
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted-foreground">Receipt to</dt>
                  <dd className="truncate font-medium">{email}</dd>
                </div>
              ) : null}
            </dl>
          ) : (
            <p className="mt-6 rounded-xl border border-border bg-background/50 p-4 text-xs text-muted-foreground">
              We couldn&apos;t load the order details, but your payment may still have
              completed. Check your email for a receipt.
            </p>
          )}

          <div className="mt-8 flex flex-col gap-2">
            <Button asChild className="w-full">
              <Link href="/org">
                Go to your workspace
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="ghost" className="w-full">
              <Link href="/pricing">Back to pricing</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
