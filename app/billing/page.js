import Link from "next/link";
import { ArrowRight, CreditCard, ReceiptText, Sparkles } from "lucide-react";
import { Header } from "@/components/header";
import Footer from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { requireUser } from "@/supabase/user/getUser";
import { getPlan, products as PRODUCT_CATALOG } from "@/lib/pricing/plans";
import { getUserPlan, listPurchases } from "@/lib/billing/store";

export const dynamic = "force-dynamic";

const PRODUCT_NAMES = new Map(PRODUCT_CATALOG.map((p) => [p.id, p.name]));

const PURCHASE_STATUS = {
  completed: { label: "Completed", variant: "success" },
  pending: { label: "Pending", variant: "secondary" },
  refunded: { label: "Refunded", variant: "secondary" },
  canceled: { label: "Canceled", variant: "secondary" },
};

function formatUsd(cents, currency = "usd") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format((cents || 0) / 100);
}

function formatDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(
    new Date(value),
  );
}

function planLabel(planKey) {
  if (!planKey) return "—";
  const plan = getPlan(planKey);
  return plan?.id === planKey ? plan.name : planKey.charAt(0).toUpperCase() + planKey.slice(1);
}

function productNames(ids) {
  return (Array.isArray(ids) ? ids : []).map((id) => PRODUCT_NAMES.get(id) || id);
}

export default async function BillingPage() {
  const supabase = await createClient();
  const user = await requireUser(supabase, "/login?next=/billing");

  const [plan, purchases] = await Promise.all([getUserPlan(user.id), listPurchases(user.id)]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <Header />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 pb-20 pt-24 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Billing</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Your current plan and purchase history.
            </p>
          </div>
          <Button asChild variant="outline" className="shrink-0">
            <Link href="/pricing">
              {plan ? "Change plan" : "Choose a plan"}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </header>

        {/* Current plan */}
        <section className="mt-8">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
            Current plan
          </h2>
          {plan ? (
            <div className="rounded-2xl border border-border bg-surface-card p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                    <Sparkles className="size-6" />
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold">{planLabel(plan.planKey)}</h3>
                      <Badge variant={plan.status === "active" ? "success" : "secondary"}>
                        {plan.status === "active" ? "Active" : plan.status}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatUsd(plan.amountTotal, plan.currency)} / {plan.billingInterval} · since{" "}
                      {formatDate(plan.startedAt)}
                    </p>
                  </div>
                </div>
              </div>
              {plan.products?.length ? (
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {productNames(plan.products).map((name) => (
                    <span
                      key={name}
                      className="rounded-md border border-border bg-surface-subtle px-2 py-1 text-xs text-text-secondary"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface-card py-12 text-center">
              <span className="mb-4 flex size-12 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                <CreditCard className="size-6" />
              </span>
              <h3 className="text-base font-semibold">No active plan</h3>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                You haven&apos;t purchased a plan yet. Pick a foundation to get started.
              </p>
              <Button asChild className="mt-5">
                <Link href="/pricing">
                  View plans
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          )}
        </section>

        {/* Purchase history */}
        <section className="mt-10">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
            Purchase history
          </h2>
          {purchases.length ? (
            <div className="overflow-hidden rounded-2xl border border-border bg-surface-card">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-muted-foreground">
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Plan</th>
                    <th className="hidden px-4 py-3 font-medium sm:table-cell">Products</th>
                    <th className="px-4 py-3 font-medium">Amount</th>
                    <th className="px-4 py-3 text-right font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {purchases.map((purchase) => {
                    const status = PURCHASE_STATUS[purchase.status] || PURCHASE_STATUS.pending;
                    const names = productNames(purchase.products);
                    return (
                      <tr key={purchase.id} className="border-b border-border last:border-b-0">
                        <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                          {formatDate(purchase.createdAt)}
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-medium">{planLabel(purchase.planKey)}</span>
                          <span className="ml-1 text-xs text-muted-foreground">
                            /{purchase.billingInterval}
                          </span>
                        </td>
                        <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                          {names.length ? `${names.length} (${names.slice(0, 3).join(", ")}${names.length > 3 ? "…" : ""})` : "—"}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 font-medium tabular-nums">
                          {formatUsd(purchase.amountTotal, purchase.currency)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface-card py-12 text-center">
              <span className="mb-4 flex size-12 items-center justify-center rounded-xl bg-surface-subtle text-muted-foreground">
                <ReceiptText className="size-6" />
              </span>
              <h3 className="text-base font-semibold">No purchases yet</h3>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Your completed payments will appear here.
              </p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
