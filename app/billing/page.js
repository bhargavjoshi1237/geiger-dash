import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/header";
import Footer from "@/components/footer";
import { ProductAccess, titleCaseId } from "@/components/billing/product-access";
import { Button, ScreenHeader, SectionCard, cn } from "@geiger/ui";
import { createClient } from "@/utils/supabase/server";
import { requireUser } from "@/supabase/user/getUser";
import { getPlan, planPrice, products as PRODUCT_CATALOG } from "@/lib/pricing/plans";
import { getUserPlan, listPurchases } from "@/lib/billing/store";
import { derivePlanState } from "@/lib/billing/plan_state";

export const dynamic = "force-dynamic";

const DAY_MS = 24 * 60 * 60 * 1000;

const PRODUCT_META = new Map(PRODUCT_CATALOG.map((p) => [p.id, p]));

const PURCHASE_STATUS = {
  completed: { label: "Paid", muted: false },
  pending: { label: "Pending", muted: true },
  refunded: { label: "Refunded", muted: true },
  canceled: { label: "Canceled", muted: true },
};

// Status dot per plan phase; the theme's destructive token is the only non-neutral colour.
const PHASE = {
  trialing: { label: "Trial", dot: "bg-foreground" },
  active: { label: "Active", dot: "bg-foreground" },
  grace: { label: "Ended", dot: "bg-destructive" },
  expired: { label: "Expired", dot: "bg-muted-foreground/50" },
  none: { label: "Inactive", dot: "bg-muted-foreground/50" },
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
  return (Array.isArray(ids) ? ids : []).map((id) => PRODUCT_META.get(id)?.name || titleCaseId(id));
}

// How far through the current cycle we are, for the active/trial progress line.
function cycleProgress(plan, planState) {
  if (!planState.periodEnd) return null;
  const totalDays = plan.billingInterval === "year" ? 365 : 30;
  const start = planState.periodEnd.getTime() - totalDays * DAY_MS;
  const pct = Math.min(100, Math.max(0, ((Date.now() - start) / (totalDays * DAY_MS)) * 100));
  return { pct, daysRemaining: planState.daysRemaining };
}

// The plan's key date and how to label it for the current phase.
function keyDate(plan, planState) {
  switch (planState.phase) {
    case "trialing":
      return { label: "Trial ends", value: planState.periodEnd };
    case "active":
      return { label: "Renews on", value: planState.periodEnd };
    case "grace":
      return { label: "Ended on", value: planState.periodEnd };
    case "expired":
      return { label: "Expired on", value: plan.currentPeriodEnd };
    default:
      return null;
  }
}

// "Campaign, Flow, Events and 14 more" — what the plan actually covers, in one line.
function includesLine(names) {
  if (!names.length) return "";
  if (names.length <= 3) return names.join(", ");
  return `${names.slice(0, 3).join(", ")} and ${names.length - 3} more`;
}

// "$174" set large with a small currency sign and interval, cents only when the price has them.
function PriceFigure({ cents, currency = "usd", interval }) {
  const parts = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: cents % 100 ? 2 : 0,
  }).formatToParts(cents / 100);
  const symbol = parts.filter((p) => p.type === "currency").map((p) => p.value).join("");
  const whole = parts.filter((p) => p.type === "integer" || p.type === "group").map((p) => p.value).join("");
  const fraction = parts.find((p) => p.type === "fraction")?.value;

  return (
    <p className="flex items-start leading-none sm:justify-end">
      <span className="mt-1.5 text-2xl font-medium text-muted-foreground">{symbol}</span>
      <span className="text-6xl font-semibold tracking-[-0.045em] tabular-nums">{whole}</span>
      {fraction ? <span className="mt-1.5 text-2xl font-semibold tabular-nums">.{fraction}</span> : null}
      <span className="ml-1.5 self-end pb-1 text-base text-muted-foreground">
        /{interval === "year" ? "yr" : "mo"}
      </span>
    </p>
  );
}

// "Pro $119 · 17 products $50 · Usage $5" — only the parts that cost something.
function PriceBreakdown({ price, planName, productCount, currency }) {
  const parts = [
    { label: planName, cents: price.baseCents },
    { label: `${productCount} ${productCount === 1 ? "product" : "products"}`, cents: price.productsCents },
    { label: "Usage", cents: price.usageCents },
  ].filter((part) => part.cents > 0);
  if (parts.length < 2) return null;

  return (
    <p className="mt-3 text-xs text-muted-foreground sm:text-right">
      {parts.map((part, index) => (
        <span key={part.label}>
          {index ? " · " : null}
          {part.label}{" "}
          <span className="tabular-nums text-foreground">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency,
              minimumFractionDigits: part.cents % 100 ? 2 : 0,
            }).format(part.cents / 100)}
          </span>
        </span>
      ))}
    </p>
  );
}

// Phase tint faded down from the card's top edge: green while active, amber in the final week, red once ended.
function planTint(planState, progress) {
  if (planState.phase === "grace" || planState.phase === "expired") return "from-red-500/10";
  if (!progress) return null;
  return progress.daysRemaining <= 7 ? "from-amber-500/10" : "from-emerald-500/10";
}

function RenewButton({ label = "Renew plan" }) {
  return (
    <Button asChild className="shrink-0">
      <Link href="/pricing">
        {label}
        <ArrowRight className="size-4" />
      </Link>
    </Button>
  );
}

// The page's focal point: plan and price set large, with a footer that changes with the plan's phase.
function PlanPanel({ plan, planState, phase, progress, date, price, productNames: names }) {
  const needsRenewal = planState.phase === "grace" || planState.phase === "expired";
  const isGrace = planState.phase === "grace";
  const tint = planTint(planState, progress);

  if (!plan) {
    return (
      <section className="overflow-hidden rounded-xl border border-border bg-surface-subtle">
        <div className="p-6 sm:p-8">
          <p className="text-sm text-muted-foreground">No plan yet</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">Pick your plan</h2>
          <p className="mt-3 max-w-md text-sm text-muted-foreground">
            Choose a plan and the products your team works in. You can change it any time.
          </p>
        </div>
        <footer className="flex justify-end border-t border-border bg-background/60 px-6 py-4 sm:px-8">
          <RenewButton label="View plans" />
        </footer>
      </section>
    );
  }

  return (
    <section
      aria-label="Your plan"
      className={cn(
        "relative overflow-hidden rounded-xl border bg-surface-subtle",
        isGrace ? "border-destructive/40" : "border-border",
      )}
    >
      {tint ? (
        <div className={cn("pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b to-transparent", tint)} />
      ) : null}
      <div className="relative flex flex-col gap-8 p-6 sm:flex-row sm:items-end sm:justify-between sm:p-8">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <span className={cn("size-1.5 rounded-full", phase.dot)} />
            {phase.label} plan
          </p>
          <h2 className="mt-3 text-5xl font-semibold leading-none tracking-[-0.045em] sm:text-6xl">
            {planLabel(plan.planKey)}
          </h2>
          {names.length ? (
            <p className="mt-4 max-w-md text-sm text-muted-foreground">
              {needsRenewal ? `${names.length} products, locked until you renew` : `Includes ${includesLine(names)}`}
            </p>
          ) : null}
        </div>

        <div className="sm:self-center sm:text-right">
          <PriceFigure cents={price.totalCents} currency={plan.currency} interval={plan.billingInterval} />
          <PriceBreakdown
            price={price}
            planName={planLabel(plan.planKey)}
            productCount={names.length}
            currency={plan.currency}
          />
        </div>
      </div>

      <footer
        className={cn(
          "relative flex flex-col gap-4 border-t px-6 py-4 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-8",
          isGrace ? "border-destructive/30 bg-destructive/5" : "border-border bg-background/60",
        )}
      >
        {progress ? (
          <>
            <div className="w-full max-w-sm">
              <div className="h-1 w-full overflow-hidden rounded-full bg-surface-strong">
                <div className="h-full rounded-full bg-foreground" style={{ width: `${progress.pct}%` }} />
              </div>
              <p className="mt-2 text-muted-foreground">
                <span className="font-medium text-foreground">
                  {progress.daysRemaining} {progress.daysRemaining === 1 ? "day" : "days"} left
                </span>
                {date ? ` · ${date.label.toLowerCase()} ${formatDate(date.value)}` : null}
              </p>
            </div>
            <p className="text-muted-foreground">Member since {formatDate(plan.startedAt)}</p>
          </>
        ) : null}

        {isGrace ? (
          <>
            <p className="text-pretty">
              <span className="font-medium">Your plan ended on {formatDate(planState.periodEnd)}.</span>{" "}
              <span className="text-muted-foreground">
                Workspace data will be deleted on {formatDate(planState.deletionDate)} (
                {planState.deletionDaysRemaining} {planState.deletionDaysRemaining === 1 ? "day" : "days"}) unless
                you renew.
              </span>
            </p>
            <RenewButton />
          </>
        ) : null}

        {planState.phase === "expired" ? (
          <>
            <p className="text-pretty">
              <span className="font-medium">Expired on {formatDate(date?.value)}.</span>{" "}
              <span className="text-muted-foreground">Renew to unlock your products. Everything is restored.</span>
            </p>
            <RenewButton />
          </>
        ) : null}

        {!progress && !needsRenewal ? (
          <>
            <p className="text-muted-foreground">
              {planState.phase === "none" ? "This plan is inactive." : `Member since ${formatDate(plan.startedAt)}`}
            </p>
            {planState.phase === "none" ? <RenewButton label="Choose a plan" /> : null}
          </>
        ) : null}
      </footer>
    </section>
  );
}

export default async function BillingPage() {
  const supabase = await createClient();
  const user = await requireUser(supabase, "/login?next=/billing");

  const [plan, purchases] = await Promise.all([getUserPlan(user.id), listPurchases(user.id)]);
  const planState = derivePlanState(plan);
  const phase = PHASE[planState.phase] || PHASE.none;

  const progress =
    plan && (planState.phase === "active" || planState.phase === "trialing")
      ? cycleProgress(plan, planState)
      : null;
  const date = plan ? keyDate(plan, planState) : null;
  const planProducts = Array.isArray(plan?.products) ? plan.products : [];
  const completed = purchases.filter((p) => p.status === "completed");
  const totalSpent = completed.reduce((sum, p) => sum + (p.amountTotal || 0), 0);
  // Priced from the plan's configuration: user_plan.amount_total can hold the last upgrade delta, not the plan price.
  const currentPurchase = purchases.find((p) => p.id === plan?.currentPurchaseId);
  const price = plan
    ? planPrice({
        planId: plan.planKey,
        billingInterval: plan.billingInterval,
        selectedProducts: planProducts,
        metrics: currentPurchase?.metrics || {},
      })
    : null;

  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-clip bg-background text-foreground">
      {/* Suite grid wash, masked to the top like the pricing page. */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(to_right,#80808014_1px,transparent_1px),linear-gradient(to_bottom,#80808014_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_40%_at_50%_0%,#000_50%,transparent_100%)]" />
      <Header />
      <main className="relative z-10 mx-auto w-full max-w-4xl flex-1 px-4 pb-24 pt-24 sm:px-6 lg:px-8">
        <ScreenHeader
          title="Billing"
          description={user.email ? `Plan, products and payments for ${user.email}.` : "Plan, products and payments."}
          actions={
            <Button asChild variant={plan ? "outline" : "default"}>
              <Link href="/pricing">
                {plan ? "Change plan" : "Choose a plan"}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          }
        />

        <div className="mt-10">
          <PlanPanel
            plan={plan}
            planState={planState}
            phase={phase}
            progress={progress}
            date={date}
            price={price}
            productNames={productNames(planProducts)}
          />
        </div>

        {planProducts.length ? (
          <SectionCard
            bare
            title="Products"
            className="mt-12"
          >
            <ProductAccess productIds={planProducts} />
          </SectionCard>
        ) : null}

        <SectionCard
          bare
          title="Payment history"
          description={
            completed.length
              ? `${completed.length} ${completed.length === 1 ? "payment" : "payments"} · ${formatUsd(totalSpent)} total`
              : undefined
          }
          className="mt-12"
        >
          {purchases.length ? (
            <div className="-mx-1 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-muted-foreground">
                    <th className="px-1 pb-2 font-medium">Date</th>
                    <th className="px-1 pb-2 font-medium">Description</th>
                    <th className="px-1 pb-2 text-right font-medium">Amount</th>
                    <th className="px-1 pb-2 text-right font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border border-t border-border">
                  {purchases.map((purchase) => {
                    const status = PURCHASE_STATUS[purchase.status] || PURCHASE_STATUS.pending;
                    const names = productNames(purchase.products);
                    return (
                      <tr key={purchase.id} className="align-top">
                        <td className="whitespace-nowrap px-1 py-3 text-muted-foreground">
                          {formatDate(purchase.createdAt)}
                        </td>
                        <td className="max-w-0 px-1 py-3 sm:w-1/2">
                          <span className="font-medium">{planLabel(purchase.planKey)}</span>
                          <span className="text-muted-foreground"> · {purchase.billingInterval}ly</span>
                          {names.length ? (
                            <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                              {names.length} {names.length === 1 ? "product" : "products"}: {names.join(", ")}
                            </span>
                          ) : null}
                        </td>
                        <td className="whitespace-nowrap px-1 py-3 text-right font-medium tabular-nums">
                          {formatUsd(purchase.amountTotal, purchase.currency)}
                        </td>
                        <td
                          className={cn(
                            "whitespace-nowrap px-1 py-3 text-right",
                            status.muted ? "text-muted-foreground" : "text-foreground",
                          )}
                        >
                          {status.label}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No payments yet. Receipts appear here after checkout.</p>
          )}
        </SectionCard>
      </main>
      <Footer />
    </div>
  );
}
