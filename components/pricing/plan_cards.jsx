"use client";

import {
  ArrowDown,
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  CheckCircle2,
  Code2,
  FileStack,
  FolderKanban,
  HardDrive,
  Image,
  Lock,
  Megaphone,
  MessageSquareText,
  Minus,
  Podcast,
  Plus,
  Radio,
  RadioTower,
  Sparkles,
  Workflow,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  plans,
  products,
  productCategories,
  metricConfig,
  computeEstimate,
  getPlanRank,
  YEARLY_MULTIPLIER,
} from "@/lib/pricing/plans";
import { createCheckoutAction } from "@/app/pricing/actions";

// Pricing data lives in lib/pricing/plans.js (shared with the server checkout
// action). The catalog there is icon-free; map each product id to its Lucide
// icon for rendering here.
const PRODUCT_ICONS = {
  campaign: Megaphone,
  flow: Workflow,
  events: CalendarDays,
  assets: Image,
  comms: RadioTower,
  forms: CheckCircle2,
  grey: Sparkles,
  office: BriefcaseBusiness,
  docs: BookOpen,
  content: Code2,
  pods: Podcast,
  chat: MessageSquareText,
  notes: FileStack,
  canvas: FolderKanban,
};

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value);
}

function RollingDigit({ previousDigit, digit, direction }) {
  const [active, setActive] = useState(false);
  const increasing = direction >= 0;
  const digits = increasing
    ? [previousDigit, digit]
    : [digit, previousDigit];

  useEffect(() => {
    const id = requestAnimationFrame(() => setActive(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <span className="relative inline-block h-[1em] w-[1ch] overflow-hidden">
      <span
        className="absolute inset-x-0 top-0 flex flex-col transition-transform duration-500 ease-out motion-reduce:transition-none"
        style={{
          transform: increasing
            ? `translateY(${active ? "-50%" : "0"})`
            : `translateY(${active ? "0" : "-50%"})`,
        }}
      >
        {digits.map((number, index) => (
          <span
            key={`${number}-${index}`}
            className="block h-[1em] text-center leading-[1em]"
          >
            {number}
          </span>
        ))}
      </span>
    </span>
  );
}

function RollingNumber({ value, className }) {
  const currentValue = String(value);
  const [transition, setTransition] = useState({
    previous: currentValue,
    current: currentValue,
  });

  if (currentValue !== transition.current) {
    setTransition({
      previous: transition.current,
      current: currentValue,
    });
  }

  const previousValue = transition.previous;
  const direction =
    Number(currentValue.replaceAll(",", "")) -
    Number(previousValue.replaceAll(",", ""));

  return (
    <span className={cn("inline-flex h-[1em] items-center leading-[1em] tabular-nums", className)}>
      {currentValue.split("").map((char, index, chars) => {
        const previousIndex = index - (chars.length - previousValue.length);
        const previousChar = previousValue[previousIndex];

        if (/\d/.test(char) && /\d/.test(previousChar) && char !== previousChar) {
          return (
            <RollingDigit
              key={`${index}-${previousChar}-${char}`}
              previousDigit={Number(previousChar)}
              digit={Number(char)}
              direction={direction}
            />
          );
        }
        return <span key={index}>{char}</span>;
      })}
    </span>
  );
}

function RollingPrice({ value, className }) {
  return (
    <span className={cn("inline-flex h-[1em] items-center leading-[1em]", className)}>
      <span className="sr-only">${value}</span>
      <span className="inline-flex h-[1em] items-center leading-[1em]" aria-hidden="true">
        <span className="inline-block h-[1em] leading-[1em]">$</span>
        <RollingNumber value={value} />
      </span>
    </span>
  );
}

function Counter({ label, value, minimum = 1, maximum, onChange }) {
  const atMinimum = value <= minimum;
  const atMaximum = value >= maximum;

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-background/60 p-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(minimum, value - 1))}
          disabled={atMinimum}
          className="flex size-8 items-center justify-center rounded-lg border border-border bg-surface-card text-muted-foreground transition hover:border-border-strong hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-35"
          aria-label={`Decrease ${label}`}
        >
          <Minus className="size-3.5" />
        </button>
        <span className="min-w-8 text-center text-sm font-semibold tabular-nums" aria-live="polite">
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(maximum, value + 1))}
          disabled={atMaximum}
          className="flex size-8 items-center justify-center rounded-lg border border-border bg-surface-card text-muted-foreground transition hover:border-border-strong hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-35"
          aria-label={`Increase ${label}`}
        >
          <Plus className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

// Starter selection when an org has no purchased plan yet — unchanged from
// the previous hardcoded defaults.
const DEFAULT_CONFIG = {
  planId: "plus",
  products: ["campaign", "flow", "forms", "grey", "chat", "notes", "canvas"],
  metrics: { projects: 3, seats: 12, storage: 50, bandwidth: 250, edgeData: 0, aiCredits: 200 },
};

// An org with an active subscription opens the calculator pre-filled with
// what it already owns, so those selections can be locked in as floors.
function configForEntitlements(entitlements) {
  if (!entitlements?.hasSubscription) return DEFAULT_CONFIG;
  return {
    planId: entitlements.planKey,
    products: entitlements.unlockedProducts,
    metrics: entitlements.currentMetrics,
  };
}

export function PlanCards({ isAuthed, organizations = [], entitlementsByOrg = {} }) {
  const router = useRouter();
  const [isYearly, setIsYearly] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [selectedOrgId, setSelectedOrgId] = useState(organizations[0]?.id || "");
  const initialConfig = configForEntitlements(entitlementsByOrg[organizations[0]?.id]);
  const [selectedPlanId, setSelectedPlanId] = useState(initialConfig.planId);
  const [selectedProducts, setSelectedProducts] = useState(initialConfig.products);
  const [metrics, setMetrics] = useState(initialConfig.metrics);

  const currentEntitlements = entitlementsByOrg[selectedOrgId] || null;
  const hasSubscription = Boolean(currentEntitlements?.hasSubscription);

  // Switching organizations re-opens the calculator on that org's own plan —
  // carrying over a different org's configuration would be meaningless.
  useEffect(() => {
    const config = configForEntitlements(entitlementsByOrg[selectedOrgId]);
    setSelectedPlanId(config.planId);
    setSelectedProducts(config.products);
    setMetrics(config.metrics);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOrgId]);

  const selectedPlan = plans.find((plan) => plan.id === selectedPlanId) || plans[0];
  const billingMultiplier = isYearly ? YEARLY_MULTIPLIER : 1;
  const billingPeriod = isYearly ? "year" : "month";

  const ownedMetric = (metricId) =>
    hasSubscription ? currentEntitlements.currentMetrics?.[metricId] ?? 0 : 0;

  const metricFloor = (metricId) => {
    const planFloor =
      metricId === "projects"
        ? selectedPlan.projectAllowance
        : metricId === "seats"
          ? selectedPlan.seatAllowance
          : metricId === "storage"
            ? selectedPlan.storageAllowance
            : metricId === "bandwidth"
              ? metrics.storage * 5
              : metricId === "aiCredits"
                ? selectedPlan.aiAllowance
                : 0;
    return Math.max(planFloor, ownedMetric(metricId));
  };

  const isPlanDowngrade = (plan) => hasSubscription && getPlanRank(plan.id) < currentEntitlements.planRank;
  const isPlanUpgrade = (plan) => hasSubscription && getPlanRank(plan.id) > currentEntitlements.planRank;
  const isCurrentPlan = (plan) => hasSubscription && plan.id === currentEntitlements.planKey;

  async function handleCheckout() {
    if (!isAuthed) {
      router.push(`/login?next=${encodeURIComponent("/pricing")}`);
      return;
    }
    if (!organizations.length) {
      toast.error("Create an organization first to purchase a plan.");
      router.push("/org");
      return;
    }
    if (!selectedOrgId) {
      toast.error("Select an organization for this plan.");
      return;
    }
    setCheckingOut(true);
    try {
      const result = await createCheckoutAction({
        planId: selectedPlanId,
        selectedProducts,
        metrics,
        isYearly,
        organizationId: selectedOrgId,
      });
      if (result?.url) {
        window.location.href = result.url;
        return;
      }
      if (result?.error === "auth") {
        router.push(`/login?next=${encodeURIComponent("/pricing")}`);
      } else if (result?.error === "invalid_org") {
        toast.error("You don't have access to that organization.");
      } else if (result?.error === "stripe_unconfigured") {
        toast.error("Payments aren't enabled yet — add your Stripe keys to finish setup.");
      } else if (result?.error === "amount_too_low") {
        toast.error("That total is below the minimum charge amount.");
      } else if (result?.error === "no_change") {
        toast.error("There's nothing new to purchase for this configuration.");
      } else if (result?.error === "downgrade_blocked") {
        toast.error("Downgrading a plan or removing owned products isn't allowed.");
      } else {
        toast.error("Couldn't start checkout. Please try again.");
      }
    } catch {
      toast.error("Couldn't start checkout. Please try again.");
    } finally {
      setCheckingOut(false);
    }
  }

  const selectPlan = (plan) => {
    if (isPlanDowngrade(plan)) return; // downgrades aren't offered
    setSelectedPlanId(plan.id);
    setMetrics({
      projects: Math.max(plan.projectAllowance, ownedMetric("projects")),
      seats: Math.max(plan.seatAllowance, ownedMetric("seats")),
      storage: Math.max(plan.storageAllowance, ownedMetric("storage")),
      bandwidth: Math.max(plan.storageAllowance * 5, ownedMetric("bandwidth")),
      edgeData: ownedMetric("edgeData"),
      aiCredits: Math.max(plan.aiAllowance, ownedMetric("aiCredits")),
    });
    const planDefaults = products
      .filter((product) => {
        const categoryProducts = products.filter((item) => item.category === product.category);
        return categoryProducts.indexOf(product) < plan.productAllowances[product.category];
      })
      .map((product) => product.id);
    // Already-owned products can never drop out of the selection, even when
    // switching to a foundation whose default mix wouldn't include them.
    const ownedProducts = hasSubscription ? currentEntitlements.unlockedProducts : [];
    setSelectedProducts(Array.from(new Set([...ownedProducts, ...planDefaults])));
  };

  const toggleProduct = (productId) => {
    if (hasSubscription && currentEntitlements.unlockedProducts.includes(productId)) return; // owned, locked on
    setSelectedProducts((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId]
    );
  };

  const estimate = useMemo(
    () => computeEstimate({ planId: selectedPlanId, selectedProducts, metrics }),
    [metrics, selectedPlanId, selectedProducts],
  );

  // "Due today" mirrors the server's delta charge (app/pricing/actions.js):
  // the org already paid currentMonthlyTotal, so only the increase is billed.
  const currentMonthlyTotal = hasSubscription
    ? (currentEntitlements.amountTotal / 100) /
      (currentEntitlements.billingInterval === "year" ? YEARLY_MULTIPLIER : 1)
    : 0;
  const dueTodayMonthly = Math.max(0, estimate.total - currentMonthlyTotal);
  const dueToday = dueTodayMonthly * billingMultiplier;
  const noChangeToUpgrade = hasSubscription && dueTodayMonthly <= 0;

  return (
    <>
      <section aria-labelledby="plans-heading">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Choose a foundation</p>
            <h2 id="plans-heading" className="mt-2 capitalize text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
              Start with a foundation, then customize.
            </h2>
          </div>
          <div className="flex w-full items-center gap-2 rounded-full border border-border bg-surface-card px-3 py-2.5 sm:w-auto sm:gap-3 sm:px-4">
            <span className={`text-xs font-medium sm:text-sm ${isYearly ? "text-muted-foreground" : "text-foreground"}`}>
              Monthly
            </span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
              aria-label="Toggle yearly billing"
            />
            <span className={`text-xs font-medium sm:text-sm ${isYearly ? "text-foreground" : "text-muted-foreground"}`}>
              Yearly
            </span>
            <span className="ml-auto rounded-full bg-surface-active px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground sm:ml-0">
              Save 17%
            </span>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {plans.map((plan) => {
            const currentPlan = isCurrentPlan(plan);
            const upgrade = isPlanUpgrade(plan);
            const downgrade = isPlanDowngrade(plan);
            return (
            <article
              key={plan.id}
              className={`relative flex min-h-[430px] flex-col overflow-hidden rounded-2xl border p-5 transition duration-300 sm:p-6 ${
                downgrade
                  ? "border-border bg-surface-card opacity-60"
                  : plan.featured
                    ? "border-foreground/30 bg-foreground text-background shadow-[0_28px_80px_-48px_rgba(255,255,255,0.4)] dark:bg-[#eeeeec] dark:text-[#151515]"
                    : "border-border bg-surface-card hover:-translate-y-1 hover:border-border-strong"
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${plan.featured && !downgrade ? "text-background/60 dark:text-[#151515]/60" : "text-muted-foreground"}`}>
                  {plan.eyebrow}
                </p>
                {currentPlan ? (
                  <span className="rounded-full bg-background/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider dark:bg-[#151515]/10">
                    Current plan
                  </span>
                ) : plan.featured && !downgrade ? (
                  <span className="rounded-full bg-background/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider dark:bg-[#151515]/10">
                    Recommended
                  </span>
                ) : null}
              </div>

              <h3 className="mt-7 text-2xl font-semibold tracking-tight">{plan.name}</h3>
              <div className="mt-3 flex items-end gap-2">
                <RollingPrice
                  key={plan.price * billingMultiplier}
                  value={formatNumber(plan.price * billingMultiplier)}
                  className="text-5xl font-semibold tracking-[-0.06em]"
                />
                <span className={`pb-1 text-sm ${plan.featured ? "text-background/60 dark:text-[#151515]/60" : "text-muted-foreground"}`}>
                  / {billingPeriod}
                </span>
              </div>
              <p className={`mt-5 min-h-12 text-sm leading-6 ${plan.featured ? "text-background/70 dark:text-[#151515]/70" : "text-muted-foreground"}`}>
                {plan.description}
              </p>

              <ul className="mt-7 space-y-3">
                {plan.included.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm capitalize">
                    <span className={`flex size-5 items-center justify-center rounded-full ${plan.featured ? "bg-background/10 dark:bg-[#151515]/10" : "bg-surface-hover"}`}>
                      <Check className="size-3" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-6">
                {downgrade ? (
                  <span
                    aria-disabled="true"
                    title="Downgrading isn't available — cancel your current plan first."
                    className="flex w-full cursor-not-allowed items-center justify-between rounded-xl border border-border bg-surface-subtle px-4 py-3 text-sm font-semibold text-muted-foreground"
                  >
                    Not available as a downgrade
                  </span>
                ) : (
                  <a
                    href="#plan-calculator"
                    onClick={() => selectPlan(plan)}
                    className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                      plan.featured
                        ? "border-background/15 bg-background text-foreground hover:bg-background/90 dark:border-[#151515]/15 dark:bg-[#151515] dark:text-white"
                        : "border-border bg-surface-subtle hover:border-border-strong hover:bg-surface-hover"
                    }`}
                  >
                    {currentPlan ? "Manage this plan" : upgrade ? `Upgrade to ${plan.name}` : "Configure this plan"}
                    <ArrowDown className="size-4" />
                  </a>
                )}
              </div>
            </article>
            );
          })}
        </div>
      </section>

      <section id="plan-calculator" className="scroll-mt-24 py-20 sm:py-24" aria-labelledby="calculator-heading">
        <div className="mb-8 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Plan calculator</p>
          <h2 id="calculator-heading" className="mt-3 text-3xl font-semibold tracking-[-0.045em] sm:text-5xl">
            Shape the plan around your work.
          </h2>
          <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
            Choose a foundation, select the products you need, then adjust team size and usage. Your estimate updates as you go.
          </p>
        </div>

        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="overflow-hidden rounded-2xl border border-border bg-surface-card">
            <div className="border-b border-border p-5 sm:p-6">
              <p className="text-sm font-semibold">1. Choose a foundation</p>
              <div className="mt-4 grid min-w-0 grid-cols-3 gap-2">
                {plans.map((plan) => {
                  const isSelected = selectedPlanId === plan.id;
                  const downgrade = isPlanDowngrade(plan);
                  return (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => selectPlan(plan)}
                      disabled={downgrade}
                      aria-pressed={isSelected}
                      title={downgrade ? "Downgrading isn't available" : undefined}
                      className={`min-w-0 rounded-xl border p-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:p-4 ${
                        downgrade
                          ? "cursor-not-allowed border-border bg-background/30 opacity-50"
                          : isSelected
                            ? "border-foreground bg-foreground text-background"
                            : "border-border bg-background/50 hover:border-border-strong"
                      }`}
                    >
                      <span className="block truncate text-xs font-semibold sm:text-sm">{plan.name}</span>
                      <span className="mt-2 flex min-w-0 items-end gap-1">
                        <RollingPrice
                          key={plan.price * billingMultiplier}
                          value={formatNumber(plan.price * billingMultiplier)}
                          className={`min-w-0 text-base font-semibold tracking-tight sm:text-lg ${
                            isSelected ? "text-background" : "text-foreground"
                          }`}
                        />
                        <span className={`pb-px text-[10px] ${isSelected ? "text-background/60" : "text-muted-foreground"}`}>
                          /{isYearly ? "yr" : "mo"}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border-b border-border p-5 sm:p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-semibold">2. Choose products for your projects</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Each foundation includes a category allowance. Each products are priced individually.
                  </p>
                </div>
                <p className="w-fit rounded-full border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground">
                  {selectedProducts.length} selected
                </p>
              </div>

              <div className="mt-6 space-y-7">
                {productCategories.map((category) => {
                  const categoryProducts = products.filter(
                    (product) => product.category === category.id
                  );
                  const selectedCount = categoryProducts.filter((product) =>
                    selectedProducts.includes(product.id)
                  ).length;
                  const allowance = selectedPlan.productAllowances[category.id];

                  return (
                    <section key={category.id} aria-labelledby={`${category.id}-products-heading`}>
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between mb-6 mt-6">
                        <div>
                          <h3 id={`${category.id}-products-heading`} className="text-sm font-semibold">
                            {category.name}
                          </h3>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {category.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-[11px]">
                          <span className="rounded-full bg-surface-active px-2.5 py-1 font-medium text-muted-foreground">
                            {selectedCount > allowance
                              ? `${allowance} included / ${selectedCount - allowance} Each`
                              : `${selectedCount}/${allowance} Included`}
                          </span>
                          <span className="rounded-full border border-border px-2.5 py-1 font-semibold">
                            +${category.rate}/Each
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        {categoryProducts.map((product) => {
                          const Icon = PRODUCT_ICONS[product.id];
                          const isOwned = hasSubscription && currentEntitlements.unlockedProducts.includes(product.id);
                          const isEnabled = isOwned || selectedProducts.includes(product.id);
                          return (
                            <button
                              key={product.id}
                              type="button"
                              aria-pressed={isEnabled}
                              disabled={isOwned}
                              title={isOwned ? `${product.name} is already on your plan` : undefined}
                              onClick={() => toggleProduct(product.id)}
                              className={`group flex items-center gap-3 rounded-xl border p-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                                isOwned
                                  ? "cursor-not-allowed border-dashed border-border bg-surface-subtle opacity-70"
                                  : isEnabled
                                    ? "border-foreground/50 bg-surface-active"
                                    : "border-border bg-background/45 hover:border-border-strong"
                              }`}
                            >
                              <span className={`flex size-10 shrink-0 items-center justify-center rounded-lg border ${isOwned ? "border-border bg-surface-card text-muted-foreground" : isEnabled ? "border-foreground/20 bg-foreground text-background" : "border-border bg-surface-card text-muted-foreground"}`}>
                                {isOwned ? <Lock className="size-4" /> : <Icon className="size-4" />}
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block text-sm font-semibold">{product.name}</span>
                                <span className="block truncate text-xs text-muted-foreground">
                                  {isOwned ? "Owned — included in your plan" : product.detail}
                                </span>
                              </span>
                              <span className={`flex size-5 items-center justify-center rounded-full border ${isEnabled ? "border-foreground bg-foreground text-background" : "border-border"}`}>
                                {isEnabled && <Check className="size-3" />}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </section>
                  );
                })}
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <p className="text-sm font-semibold">3. Set your scale</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Each active projects are $5 each and Each collaborators are $1 each.
              </p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {metricConfig.slice(0, 2).map((metric) => (
                  <Counter
                    key={metric.id}
                    label={metric.label}
                    value={metrics[metric.id]}
                    minimum={metricFloor(metric.id)}
                    maximum={metric.max}
                    onChange={(value) => setMetrics((current) => ({ ...current, [metric.id]: value }))}
                  />
                ))}
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-xl border border-border bg-background/60 p-3">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-surface-active text-muted-foreground">
                    <HardDrive className="size-4" />
                  </span>
                  <span>
                    <span className="block text-xs text-muted-foreground">Base storage</span>
                    <span className="mt-0.5 block text-sm font-semibold">
                      {selectedPlan.storageAllowance} GB
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-border bg-background/60 p-3">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-surface-active text-muted-foreground">
                    <Radio className="size-4" />
                  </span>
                  <span>
                    <span className="block text-xs text-muted-foreground">Bandwidth included now</span>
                    <span className="mt-0.5 block text-sm font-semibold">
                      {metrics.storage * 5} GB
                    </span>
                  </span>
                </div>
              </div>

              <div className="mt-6 space-y-6">
                {metricConfig.slice(2).map((metric) => (
                  <label key={metric.id} className="block">
                    <span className="mb-3 flex items-center justify-between gap-4 text-sm">
                      <span className="text-muted-foreground">{metric.label}</span>
                      <span className="font-semibold tabular-nums">
                        {formatNumber(metrics[metric.id])} {metric.suffix}
                      </span>
                    </span>
                    <input
                      type="range"
                      min={metricFloor(metric.id)}
                      max={metric.max}
                      step={metric.step}
                      value={metrics[metric.id]}
                      aria-label={metric.label}
                      onChange={(event) => {
                        const value = Number(event.target.value);
                        setMetrics((current) =>
                          metric.id === "storage"
                            ? {
                                ...current,
                                storage: value,
                                bandwidth: Math.max(current.bandwidth, value * 5),
                              }
                            : { ...current, [metric.id]: value }
                        );
                      }}
                      className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-surface-strong accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-surface-card"
                    />
                    <span className="mt-2 flex justify-between text-[10px] text-muted-foreground/70">
                      <span>
                        {metric.id === "Storage"
                          ? "$0.50 per Each GB"
                          : metric.id === "bandwidth"
                            ? "$0.25 per Each GB"
                            : metric.id === "edgeData"
                              ? "Not included / $0.10 per GB across 119 PoPs"
                              : "$10 per 1,000 Each Credits"}
                      </span>
                      <span>{formatNumber(metric.max)} {metric.suffix}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <aside className="top-24 overflow-hidden rounded-2xl border border-border-strong bg-[#171717] text-white shadow-2xl lg:sticky">
            <div className="border-b border-white/10 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
                Estimated {isYearly ? "yearly" : "monthly"} cost
              </p>
              <div className="mt-4 flex min-w-0 items-end gap-2" aria-live="polite">
                <RollingPrice
                  value={formatNumber(estimate.total * billingMultiplier)}
                  className="text-6xl font-semibold tracking-[-0.065em]"
                />
                <span className="pb-2 text-sm text-white/45">USD</span>
              </div>
              <p className="mt-3 text-xs leading-5 text-white/50 capitalize">
                For {metrics.projects} {metrics.projects === 1 ? "project" : "projects"}, {metrics.seats} collaborators, {selectedProducts.length} products, {metrics.storage} GB storage, {metrics.bandwidth} GB bandwidth, and {metrics.edgeData} GB edge data.
              </p>
              {hasSubscription && (
                <div className="mt-4 flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2.5">
                  <span className="text-xs text-white/55">Due today (upgrade)</span>
                  <RollingPrice value={formatNumber(dueToday)} className="text-base font-semibold" />
                </div>
              )}
            </div>

            <div className="space-y-3 p-6 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-white/55">{selectedPlan.name} foundation</span>
                <RollingPrice
                  value={formatNumber(selectedPlan.price * billingMultiplier)}
                  className="font-medium"
                />
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-white/55">Each products</span>
                <RollingPrice
                  value={formatNumber(estimate.productCost * billingMultiplier)}
                  className="font-medium"
                />
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-white/55">Each projects</span>
                <RollingPrice
                  value={formatNumber(estimate.projectCost * billingMultiplier)}
                  className="font-medium"
                />
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-white/55">Each collaborators</span>
                <RollingPrice
                  value={formatNumber(estimate.seatCost * billingMultiplier)}
                  className="font-medium"
                />
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-white/55">Each storage</span>
                <RollingPrice
                  value={formatNumber(estimate.storageCost * billingMultiplier)}
                  className="font-medium"
                />
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-white/55">Each bandwidth</span>
                <RollingPrice
                  value={formatNumber(estimate.bandwidthCost * billingMultiplier)}
                  className="font-medium"
                />
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-white/55">Edge / CDN usage</span>
                <RollingPrice
                  value={formatNumber(estimate.edgeDataCost * billingMultiplier)}
                  className="font-medium"
                />
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-white/55">Each AI credits</span>
                <RollingPrice
                  value={formatNumber(estimate.aiCost * billingMultiplier)}
                  className="font-medium"
                />
              </div>
            </div>

            <div className="border-t border-white/10 p-4">
              {isAuthed && organizations.length > 0 ? (
                <div className="mb-3">
                  <label className="mb-1.5 block text-xs font-medium text-white/55">
                    Apply to organization
                  </label>
                  <Select value={selectedOrgId} onValueChange={setSelectedOrgId}>
                    <SelectTrigger className="w-full border-white/15 bg-white/5 text-white">
                      <SelectValue placeholder="Select organization" />
                    </SelectTrigger>
                    <SelectContent>
                      {organizations.map((org) => (
                        <SelectItem key={org.id} value={org.id}>
                          {org.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : null}
              {isAuthed && organizations.length === 0 ? (
                <p className="mb-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/55">
                  You&apos;ll need an organization to apply this plan to.{" "}
                  <Link href="/org" className="font-medium text-white underline-offset-2 hover:underline">
                    Create one
                  </Link>
                  .
                </p>
              ) : null}
              <button
                type="button"
                onClick={handleCheckout}
                disabled={checkingOut || noChangeToUpgrade}
                className="flex w-full items-center justify-between rounded-xl bg-white px-4 py-3.5 text-sm font-semibold text-black transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#171717] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {checkingOut
                  ? "Starting checkout…"
                  : noChangeToUpgrade
                    ? "No changes to purchase"
                    : hasSubscription
                      ? `Upgrade to ${selectedPlan.name}`
                      : `Pay for ${selectedPlan.name}`}
                {!checkingOut && !noChangeToUpgrade && <ArrowRight className="size-4" />}
              </button>
              <p className="mt-3 text-center text-[11px] text-white/40">
                Secure checkout via Stripe · estimate excludes taxes.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
