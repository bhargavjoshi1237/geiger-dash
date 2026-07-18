import Link from "next/link";
import { AlertTriangle, ArrowRight, CreditCard, ReceiptText, Sparkles } from "lucide-react";
import { Header } from "@/components/header";
import Footer from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { requireUser } from "@/supabase/user/getUser";
import { getPlan, products as PRODUCT_CATALOG } from "@/lib/pricing/plans";
import { getUserPlan, listPurchases } from "@/lib/billing/store";
import { derivePlanState } from "@/lib/billing/plan_state";

export const dynamic = "force-dynamic";

const DAY_MS = 24 * 60 * 60 * 1000;

const PRODUCT_META = new Map(PRODUCT_CATALOG.map((p) => [p.id, p]));

// Product families rendered as grouped rows in the plan card, in display order.
const PRODUCT_GROUPS = [
  { key: "core", label: "Core", dot: "bg-emerald-400" },
  { key: "addon", label: "Add-ons", dot: "bg-blue-400" },
  { key: "cherry", label: "Cherry", dot: "bg-violet-400" },
  { key: "security", label: "Security", dot: "bg-amber-400" },
  { key: "domains", label: "Domains", dot: "bg-sky-400" },
];

const PURCHASE_STATUS = {
  completed: { label: "Completed", variant: "success" },
  pending: { label: "Pending", variant: "secondary" },
  refunded: { label: "Refunded", variant: "secondary" },
  canceled: { label: "Canceled", variant: "secondary" },
};

const PLAN_PHASE_BADGE = {
  trialing: { label: "Trial", variant: "warning" },
  active: { label: "Active", variant: "success" },
  grace: { label: "Ended", variant: "destructive" },
  expired: { label: "Expired", variant: "secondary" },
  none: { label: "Inactive", variant: "secondary" },
};

// Phase-driven accent for the plan icon and the billing-period meter fill.
const PHASE_ACCENT = {
  trialing: { icon: "border-amber-500/20 bg-amber-500/10 text-amber-400", bar: "bg-amber-400" },
  active: { icon: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400", bar: "bg-emerald-400" },
  grace: { icon: "border-red-500/20 bg-red-500/10 text-red-400", bar: "bg-red-400" },
  expired: { icon: "border-border bg-surface-subtle text-muted-foreground", bar: "bg-surface-strong" },
  none: { icon: "border-border bg-surface-subtle text-muted-foreground", bar: "bg-surface-strong" },
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
  return (Array.isArray(ids) ? ids : []).map((id) => PRODUCT_META.get(id)?.name || id);
}

// Groups the plan's product ids into catalog families, dropping empty groups.
function groupProducts(ids) {
  const list = Array.isArray(ids) ? ids : [];
  return PRODUCT_GROUPS.map((group) => ({
    ...group,
    items: list
      .map((id) => PRODUCT_META.get(id))
      .filter((p) => p && p.category === group.key),
  })).filter((group) => group.items.length);
}

// Progress through the current billing cycle: fill %, cycle start, and days left.
function billingCycle(plan, planState) {
  const periodEnd = planState.periodEnd;
  if (!periodEnd) return null;
  const intervalDays = plan.billingInterval === "year" ? 365 : 30;
  const cycleStart = new Date(periodEnd.getTime() - intervalDays * DAY_MS);
  const now = new Date();
  const span = periodEnd.getTime() - cycleStart.getTime();
  const elapsed = now.getTime() - cycleStart.getTime();
  const pct = Math.min(100, Math.max(0, span > 0 ? (elapsed / span) * 100 : 0));
  return { cycleStart, periodEnd, pct, daysRemaining: planState.daysRemaining };
}

function StatCell({ label, value }) {
  return (
    <div className="px-5 py-4 first:pl-6 last:pr-6">
      <p className="text-xs uppercase tracking-wider text-text-tertiary">{label}</p>
      <p className="mt-1 text-xl font-semibold tabular-nums tracking-tight">{value}</p>
    </div>
  );
}

export default async function BillingPage() {
  const supabase = await createClient();
  const user = await requireUser(supabase, "/login?next=/billing");

  const [plan, purchases] = await Promise.all([getUserPlan(user.id), listPurchases(user.id)]);
  const planState = derivePlanState(plan);
  const phaseBadge = PLAN_PHASE_BADGE[planState.phase] || PLAN_PHASE_BADGE.none;
  const accent = PHASE_ACCENT[planState.phase] || PHASE_ACCENT.none;

  const cycle = plan ? billingCycle(plan, planState) : null;
  const productGroups = plan ? groupProducts(plan.products) : [];
  const totalSpent = purchases
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + (p.amountTotal || 0), 0);
  const paymentCount = purchases.filter((p) => p.status === "completed").length;

  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-clip bg-background text-foreground">
      {/* Suite-consistent grid wash, masked to the top, echoing the pricing page. */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(to_right,#80808014_1px,transparent_1px),linear-gradient(to_bottom,#80808014_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_40%_at_50%_0%,#000_50%,transparent_100%)]" />
      <Header />
      <main className="relative z-10 mx-auto w-full max-w-4xl flex-1 px-4 pb-20 pt-24 sm:px-6 lg:px-8">
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
            <div className="relative overflow-hidden rounded-2xl border border-border bg-surface-card">
              {/* Soft top-light so the hero card lifts off the canvas. */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-primary/[0.05] to-transparent" />
              <div className="relative p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span
                      className={`flex size-12 shrink-0 items-center justify-center rounded-xl border ${accent.icon}`}
                    >
                      <Sparkles className="size-6" />
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold">{planLabel(plan.planKey)}</h3>
                        <Badge variant={phaseBadge.variant}>{phaseBadge.label}</Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {planState.isTrial
                          ? "Free trial"
                          : `${formatUsd(plan.amountTotal, plan.currency)} / ${plan.billingInterval}`}{" "}
                        · member since {formatDate(plan.startedAt)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-semibold tabular-nums tracking-tight">
                      {planState.isTrial ? "Free" : formatUsd(plan.amountTotal, plan.currency)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {planState.isTrial ? "during trial" : `per ${plan.billingInterval}`}
                    </p>
                  </div>
                </div>

                {/* Billing-period meter — the at-a-glance "where am I in this cycle". */}
                {cycle && (planState.phase === "active" || planState.phase === "trialing") ? (
                  <div className="mt-6">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-text-secondary">
                        {planState.phase === "trialing" ? "Trial period" : "Current billing period"}
                      </span>
                      <span className="text-muted-foreground">
                        {cycle.daysRemaining} {cycle.daysRemaining === 1 ? "day" : "days"} left
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-strong">
                      <div
                        className={`h-full rounded-full ${accent.bar}`}
                        style={{ width: `${cycle.pct}%` }}
                      />
                    </div>
                    <div className="mt-1.5 flex items-center justify-between text-xs text-muted-foreground">
                      <span>{formatDate(cycle.cycleStart)}</span>
                      <span>
                        {planState.phase === "trialing" ? "Trial ends " : "Renews "}
                        {formatDate(cycle.periodEnd)}
                      </span>
                    </div>
                  </div>
                ) : null}

                {planState.phase === "grace" ? (
                  <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                    <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium">
                        Your plan ended. Your data will be deleted in{" "}
                        {planState.deletionDaysRemaining}{" "}
                        {planState.deletionDaysRemaining === 1 ? "day" : "days"} (
                        {formatDate(planState.deletionDate)}) unless you renew.
                      </p>
                      <Button asChild size="sm" variant="destructive" className="mt-3">
                        <Link href="/pricing">Renew plan</Link>
                      </Button>
                    </div>
                  </div>
                ) : null}

                {/* Product access, grouped by catalog family. */}
                {productGroups.length ? (
                  <div className="mt-6 border-t border-border pt-5">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                        Product access
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {plan.products.length} {plan.products.length === 1 ? "product" : "products"}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {productGroups.map((group) => (
                        <div key={group.key} className="flex flex-col gap-1.5 sm:flex-row sm:gap-4">
                          <span className="flex w-20 shrink-0 items-center gap-1.5 pt-1 text-xs font-medium text-text-secondary">
                            <span className={`size-1.5 rounded-full ${group.dot}`} />
                            {group.label}
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {group.items.map((product) => (
                              <span
                                key={product.id}
                                title={product.detail}
                                className="rounded-md border border-border bg-surface-subtle px-2 py-1 text-xs text-text-secondary"
                              >
                                {product.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
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

        {/* Account summary */}
        {plan ? (
          <section className="mt-6">
            <div className="grid grid-cols-2 divide-x divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface-card sm:grid-cols-4 sm:divide-y-0">
              <StatCell label="Total spent" value={formatUsd(totalSpent)} />
              <StatCell label="Payments" value={paymentCount} />
              <StatCell label="Products" value={plan.products.length} />
              <StatCell label="Member since" value={formatDate(plan.startedAt)} />
            </div>
          </section>
        ) : null}

        {/* Purchase history */}
        <section className="mt-10">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
            Purchase history
          </h2>
          {purchases.length ? (
            <div className="overflow-hidden rounded-2xl border border-border bg-surface-card">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface-subtle text-left text-xs text-muted-foreground">
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Plan</th>
                    <th className="hidden px-4 py-3 font-medium sm:table-cell">Products</th>
                    <th className="px-4 py-3 text-right font-medium">Amount</th>
                    <th className="px-4 py-3 text-right font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {purchases.map((purchase) => {
                    const status = PURCHASE_STATUS[purchase.status] || PURCHASE_STATUS.pending;
                    const names = productNames(purchase.products);
                    return (
                      <tr
                        key={purchase.id}
                        className="border-b border-border transition-colors last:border-b-0 hover:bg-surface-hover"
                      >
                        <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                          {formatDate(purchase.createdAt)}
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-medium">{planLabel(purchase.planKey)}</span>
                          <span className="ml-1 text-xs text-muted-foreground">
                            /{purchase.billingInterval}
                          </span>
                        </td>
                        <td className="hidden max-w-[16rem] px-4 py-3 text-muted-foreground sm:table-cell">
                          {names.length ? (
                            <span className="flex items-baseline gap-1.5">
                              <span className="font-medium tabular-nums text-text-secondary">
                                {names.length}
                              </span>
                              <span className="truncate">{names.join(", ")}</span>
                            </span>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-right font-medium tabular-nums">
                          {formatUsd(purchase.amountTotal, purchase.currency)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end">
                            <Badge variant={status.variant}>{status.label}</Badge>
                          </div>
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
