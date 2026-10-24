"use client";

import { ArrowDown, ArrowRight, Check, Loader2, Minus, Plus, Sparkles } from "lucide-react";
import { Fragment, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  RollingNumber,
  SegmentedTabs,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@geiger/ui";
import {
  plans,
  products,
  productCategories,
  metricConfig,
  computeEstimate,
  getPlanRank,
  YEARLY_MULTIPLIER,
} from "@/lib/pricing/plans";
// The catalog is icon-free so the server can import it; icons live beside it.
import { PRODUCT_ICONS, FallbackProductIcon } from "@/lib/pricing/product-icons";
import { AVAILABLE_PRODUCT_APPS } from "@/lib/org/product-apps";
import { createCheckoutAction } from "@/app/pricing/actions";
import { startTrialAction } from "@/app/pricing/trial-actions";

const BILLING_TABS = [
  { label: "Monthly", value: "month" },
  { label: "Yearly · 2 months free", value: "year" },
];

// Main apps and tools are the app allowance categories; Notes (cherry) is always included.
const APP_GROUPS = [
  { id: "core", name: "Main apps", blurb: "run a whole area of work", unit: "main apps", extra: ["extra main app", "extra main apps"] },
  { id: "addon", name: "Tools", blurb: "smaller apps that work alongside them", unit: "tools", extra: ["extra tool", "extra tools"] },
];
const EXTRA_CATEGORIES = ["security", "domains", "email"];
const APP_IDS = new Set(products.filter((p) => APP_GROUPS.some((g) => g.id === p.category)).map((p) => p.id));
const EXTRA_PRODUCTS = products.filter((p) => EXTRA_CATEGORIES.includes(p.category));
const EXTRA_IDS = new Set(EXTRA_PRODUCTS.map((p) => p.id));
const AVAILABLE_APP_IDS = new Set(AVAILABLE_PRODUCT_APPS.map((app) => app.id));
const CATEGORY_RATES = Object.fromEntries(productCategories.map((c) => [c.id, c.rate]));
const METRIC_MAX = Object.fromEntries(metricConfig.map((m) => [m.id, m.max]));

const TEAM = [
  { id: "projects", label: "Active projects", help: "Projects running at the same time under seleted organization.", allowance: "projectAllowance", rate: 5, cost: "projectCost" },
  { id: "seats", label: "People", help: "Everyone who signs in to your workspace.", allowance: "seatAllowance", rate: 1, cost: "seatCost" },
];

// Light/Medium/Heavy add a fixed amount on top of what the plan (or the org) already has.
const USAGE_LEVELS = ["Light", "Medium", "Heavy"];
const USAGE_PRESETS = [
  { id: "storage", label: "Storage", help: "Files across every app. Transfer is included at 5× storage.", add: [0, 50, 250], allowance: "storageAllowance", cost: "storageCost" },
  { id: "aiCredits", label: "AI credits", help: "Shared by AI features in every app.", add: [0, 1000, 5000], allowance: "aiAllowance", cost: "aiCost" },
  { id: "emails", label: "Emails sent", help: "One monthly pool for every app that sends email.", add: [0, 10000, 100000], allowance: "emailAllowance", cost: "emailCost" },
  { id: "edgeData", label: "Edge delivery", help: "Serve files from 119 locations worldwide.", add: [0, 100, 1000], allowance: null, cost: "edgeDataCost" },
];
const LIGHT_USAGE = { storage: 0, aiCredits: 0, emails: 0, edgeData: 0 };

const NotesIcon = PRODUCT_ICONS.notes;

// Starter selection when the org has no purchased plan yet.
const DEFAULT_CONFIG = { planId: "plus", apps: ["flow", "campaign", "forms", "grey"], extras: [], projects: 3, seats: 12 };

// A subscribed org opens on what it already owns, so those selections act as floors.
function configForEntitlements(entitlements) {
  if (!entitlements?.hasSubscription) return DEFAULT_CONFIG;
  const owned = entitlements.unlockedProducts;
  return {
    planId: entitlements.planKey,
    apps: owned.filter((id) => APP_IDS.has(id)),
    extras: owned.filter((id) => EXTRA_IDS.has(id)),
    projects: entitlements.currentMetrics.projects,
    seats: entitlements.currentMetrics.seats,
  };
}

// Fills each app group to exactly the plan's allowance: owned apps, then current picks, then launched apps in catalog order.
function appsForPlan(plan, current, owned) {
  return APP_GROUPS.flatMap((group) => {
    const groupIds = products.filter((p) => p.category === group.id).map((p) => p.id);
    const ownedInGroup = owned.filter((id) => groupIds.includes(id));
    const candidates = new Set([
      ...ownedInGroup,
      ...current.filter((id) => groupIds.includes(id)),
      ...groupIds.filter((id) => AVAILABLE_APP_IDS.has(id)),
    ]);
    return [...candidates].slice(0, Math.max(plan.productAllowances[group.id] ?? 0, ownedInGroup.length));
  });
}

const wholeNumber = new Intl.NumberFormat("en-US");
const cents = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const compact = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });

function money(value) {
  const rounded = Math.round(value * 100) / 100;
  return `$${Number.isInteger(rounded) ? wholeNumber.format(rounded) : cents.format(rounded)}`;
}

function plural(count, one, many) {
  return `${count} ${count === 1 ? one : many}`;
}

function usageAmount(id, value) {
  if (id === "aiCredits") return wholeNumber.format(value);
  if (id === "emails") return value ? `${compact.format(value / 1000)}k` : "None";
  if (id === "edgeData" && !value) return "Off";
  return value >= 1000 ? `${compact.format(value / 1000)} TB` : `${wholeNumber.format(value)} GB`;
}

function usageIncluded(preset, plan) {
  return preset.allowance ? plan[preset.allowance] ?? 0 : 0;
}

// The metric a preset level resolves to: the larger of the plan allowance and what the org owns, plus the preset.
function usageMetric(preset, plan, owned, level) {
  return Math.max(usageIncluded(preset, plan), owned?.[preset.id] ?? 0) + preset.add[level];
}

// The suite's skewed "counter click" mark.
function Tick({ className }) {
  return (
    <span
      aria-hidden="true"
      className={cn("inline-block h-3 w-1 shrink-0 rounded-[1px]", className)}
      style={{ transform: "skewX(-30deg)" }}
    />
  );
}

// One tick per allowance slot, solid when used; ticks past the divider are paid extras.
function AllowanceMeter({ used, allowance }) {
  const slots = Math.max(allowance, used);
  if (!slots) return null;
  return (
    <span className="flex items-center gap-1" aria-hidden="true">
      {Array.from({ length: slots }, (_, index) => (
        <Fragment key={index}>
          {index === allowance && allowance > 0 ? (
            <span className="mx-1.5 h-3 w-px bg-border-strong" style={{ transform: "skewX(-30deg)" }} />
          ) : null}
          <Tick className={index < used ? "bg-foreground" : "border border-border-strong"} />
        </Fragment>
      ))}
    </span>
  );
}

function SectionHeading({ step, title, hint }) {
  return (
    <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
      <h2 className="flex items-baseline gap-2.5 text-[15px] font-semibold">
        <span className="font-mono text-xs font-normal text-muted-foreground">0{step}</span>
        {title}
      </h2>
      {hint ? <p className="text-[13px] text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

function Stepper({ label, value, minimum, maximum, onChange }) {
  const stepButton =
    "flex size-[30px] items-center justify-center rounded-md text-foreground transition hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-35";
  return (
    <div className="flex shrink-0 items-center gap-1 rounded-[9px] border border-border bg-surface-subtle p-[3px]">
      <button
        type="button"
        onClick={() => onChange(Math.max(minimum, value - 1))}
        disabled={value <= minimum}
        aria-label={`Decrease ${label}`}
        className={stepButton}
      >
        <Minus className="size-3.5" />
      </button>
      <span className="min-w-8 text-center text-[15px] font-semibold tabular-nums" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(maximum, value + 1))}
        disabled={value >= maximum}
        aria-label={`Increase ${label}`}
        className={stepButton}
      >
        <Plus className="size-3.5" />
      </button>
    </div>
  );
}

export function PlanConfigurator({
  isAuthed,
  organizations = [],
  entitlementsByOrg = {},
  canStartTrial = false,
}) {
  const router = useRouter();
  const initialConfig = configForEntitlements(entitlementsByOrg[organizations[0]?.id]);
  const [billing, setBilling] = useState("month");
  const [selectedOrgId, setSelectedOrgId] = useState(organizations[0]?.id || "");
  const [planId, setPlanId] = useState(initialConfig.planId);
  const [apps, setApps] = useState(initialConfig.apps);
  const [extras, setExtras] = useState(initialConfig.extras);
  const [team, setTeam] = useState({ projects: initialConfig.projects, seats: initialConfig.seats });
  const [usage, setUsage] = useState(LIGHT_USAGE);
  const [checkingOut, setCheckingOut] = useState(false);
  const [trialOpen, setTrialOpen] = useState(false);
  const [trialOrgId, setTrialOrgId] = useState(organizations[0]?.id || "");
  const [startingTrial, setStartingTrial] = useState(false);

  const entitlements = entitlementsByOrg[selectedOrgId] || null;
  const hasSubscription = Boolean(entitlements?.hasSubscription);
  const ownedProducts = useMemo(() => (hasSubscription ? entitlements.unlockedProducts : []), [hasSubscription, entitlements]);
  const ownedMetrics = hasSubscription ? entitlements.currentMetrics : null;
  const plan = plans.find((p) => p.id === planId) || plans[0];
  const isYearly = billing === "year";
  const multiplier = isYearly ? YEARLY_MULTIPLIER : 1;
  const per = isYearly ? "/yr" : "/mo";

  const isDowngrade = (p) => hasSubscription && getPlanRank(p.id) < entitlements.planRank;
  const isCurrent = (p) => hasSubscription && p.id === entitlements.planKey;
  const isOwned = (productId) => ownedProducts.includes(productId);

  // Switching organization re-opens the configurator on that org's own plan.
  function selectOrg(orgId) {
    const config = configForEntitlements(entitlementsByOrg[orgId]);
    setSelectedOrgId(orgId);
    setPlanId(config.planId);
    setApps(config.apps);
    setExtras(config.extras);
    setTeam({ projects: config.projects, seats: config.seats });
    setUsage(LIGHT_USAGE);
  }

  // Switching plan resets apps, team, usage and extras to what that plan includes; owned products and metrics stay as floors.
  function selectPlan(nextPlan) {
    if (nextPlan.id === planId) return;
    setPlanId(nextPlan.id);
    setApps(appsForPlan(nextPlan, apps, ownedProducts));
    setExtras([]);
    setTeam({
      projects: Math.max(nextPlan.projectAllowance, ownedMetrics?.projects ?? 0),
      seats: Math.max(nextPlan.seatAllowance, ownedMetrics?.seats ?? 0),
    });
    setUsage(LIGHT_USAGE);
  }

  const toggleIn = (setter, productId) => {
    if (isOwned(productId)) return; // owned products stay locked on
    setter((current) => (current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId]));
  };

  // Projects/seats below the allowance are sent at the allowance so a purchase records the plan's full grant.
  const metrics = useMemo(() => {
    const usageMetrics = Object.fromEntries(
      USAGE_PRESETS.map((preset) => [preset.id, usageMetric(preset, plan, ownedMetrics, usage[preset.id])]),
    );
    return {
      projects: Math.max(team.projects, plan.projectAllowance),
      seats: Math.max(team.seats, plan.seatAllowance),
      ...usageMetrics,
      bandwidth: Math.max(usageMetrics.storage * 5, ownedMetrics?.bandwidth ?? 0),
    };
  }, [plan, ownedMetrics, team, usage]);

  const selectedProducts = useMemo(
    () => Array.from(new Set([...ownedProducts, ...apps, ...extras, "notes"])),
    [ownedProducts, apps, extras],
  );

  const estimate = useMemo(
    () => computeEstimate({ planId: plan.id, selectedProducts, metrics }),
    [plan.id, selectedProducts, metrics],
  );

  // "Due today" mirrors the server's delta charge: only the increase over what the org already pays is billed.
  const currentMonthlyTotal = hasSubscription
    ? entitlements.amountTotal / 100 / (entitlements.billingInterval === "year" ? YEARLY_MULTIPLIER : 1)
    : 0;
  const dueToday = Math.max(0, estimate.total - currentMonthlyTotal) * multiplier;
  const noChange = hasSubscription && dueToday <= 0;

  // Monthly receipt lines past the plan price; only what's actually charged.
  const lines = useMemo(() => {
    const out = [];
    const push = (label, value) => {
      if (value > 0) out.push({ label, value });
    };
    for (const group of APP_GROUPS) {
      const cost = estimate.productCosts[group.id];
      if (cost) push(plural(cost.billable, ...group.extra), cost.cost);
    }
    const cherry = estimate.productCosts.cherry;
    if (cherry) push(plural(cherry.billable, "extra app", "extra apps"), cherry.cost);
    push(plural(metrics.projects - plan.projectAllowance, "extra project", "extra projects"), estimate.projectCost);
    push(plural(metrics.seats - plan.seatAllowance, "extra person", "extra people"), estimate.seatCost);
    for (const preset of USAGE_PRESETS) {
      const included = usageIncluded(preset, plan);
      const amount = usageAmount(preset.id, metrics[preset.id] - included);
      push(`${preset.label} ${included > 0 ? "+" : ""}${amount}`, estimate[preset.cost]);
    }
    push(`Transfer +${usageAmount("storage", metrics.bandwidth - metrics.storage * 5)}`, estimate.bandwidthCost);
    // Extras carry no plan allowance, so each selected one is billed at its own price.
    for (const product of EXTRA_PRODUCTS) {
      if (product.comingSoon || !selectedProducts.includes(product.id)) continue;
      push(product.shortName ?? product.name, product.price ?? CATEGORY_RATES[product.category]);
    }
    return out;
  }, [estimate, metrics, plan, selectedProducts]);

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
        planId: plan.id,
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

  function openTrial() {
    if (!isAuthed) {
      router.push(`/login?next=${encodeURIComponent("/pricing")}`);
      return;
    }
    if (!organizations.length) {
      toast.error("Create an organization first to start a trial.");
      router.push("/org");
      return;
    }
    setTrialOrgId(organizations[0]?.id || "");
    setTrialOpen(true);
  }

  async function handleStartTrial() {
    if (!trialOrgId) {
      toast.error("Select an organization for your trial.");
      return;
    }
    setStartingTrial(true);
    try {
      const result = await startTrialAction({ organizationId: trialOrgId });
      if (result?.ok) {
        toast.success("Your 15-day Basic trial has started.");
        router.push("/billing");
        return;
      }
      if (result?.error === "auth") {
        router.push(`/login?next=${encodeURIComponent("/pricing")}`);
      } else if (result?.error === "trial_used") {
        toast.error("You've already used your free trial.");
      } else if (result?.error === "already_subscribed") {
        toast.error("You already have an active plan.");
      } else if (result?.error === "invalid_org") {
        toast.error("You don't have access to that organization.");
      } else {
        toast.error("Couldn't start your trial. Please try again.");
      }
    } catch {
      toast.error("Couldn't start your trial. Please try again.");
    } finally {
      setStartingTrial(false);
    }
  }

  const showTrial = !hasSubscription && (!isAuthed || canStartTrial);
  const ctaLabel = hasSubscription
    ? noChange
      ? "No Balance Change"
      : `Upgrade · pay ${money(dueToday)} today`
    : "Continue to checkout";
  const summary = hasSubscription
    ? `Due today ${money(dueToday)}`
    : lines.length
      ? `${plan.name} + ${plural(lines.length, "extra", "extras")}`
      : `${plan.name}, nothing extra`;

  return (
    <>
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
        <div className="max-w-[680px]">
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">Choose a plan</p>
          <h2
            id="plans-heading"
            className="mt-3 text-balance text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] [font-family:var(--font-display)]"
          >
            Pick a plan. Add only what you need.
          </h2>
          <p className="mt-[18px] max-w-[600px] text-pretty text-base leading-[26px] text-muted-foreground">
            Each plan includes a set of apps, people and storage. Anything past that has one fixed price, and the receipt shows exactly what checkout charges.
          </p>
        </div>
        <SegmentedTabs tabs={BILLING_TABS} value={billing} onChange={setBilling} className="shrink-0" />
      </div>

      <div id="plan-builder" className="mt-12 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_352px]">
        <div className="min-w-0">
          <div className="rounded-2xl border border-border bg-surface-subtle">
            <section className="border-b border-border p-5 sm:p-6" aria-label="Plan">
              <SectionHeading step={1} title="Plan" hint="Upgrade any time — you only pay the difference." />
              <div className="grid gap-2 sm:grid-cols-3">
                {plans.map((p) => {
                  const selected = p.id === plan.id;
                  const downgrade = isDowngrade(p);
                  const badge = isCurrent(p)
                    ? entitlements.isTrial ? "On trial" : "Current plan"
                    : p.featured ? "Most popular" : null;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      aria-pressed={selected}
                      disabled={downgrade}
                      title={downgrade ? "Downgrading isn't available — cancel your current plan first." : undefined}
                      onClick={() => selectPlan(p)}
                      className={cn(
                        "flex flex-col gap-2.5 rounded-xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        selected ? "border-foreground bg-surface-active" : "border-border bg-background hover:border-border-strong",
                        downgrade && "cursor-not-allowed opacity-45 hover:border-border",
                      )}
                    >
                      <span className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-2">
                          <span
                            aria-hidden="true"
                            className={cn(
                              "flex size-3.5 items-center justify-center rounded-full border",
                              selected ? "border-foreground" : "border-border-strong",
                            )}
                          >
                            {selected ? <span className="size-1.5 rounded-full bg-foreground" /> : null}
                          </span>
                          <span className="text-[15px] font-semibold">{p.name}</span>
                        </span>
                        {badge ? (
                          <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-muted-foreground">{badge}</span>
                        ) : null}
                      </span>
                      <span className="flex items-baseline gap-1">
                        <span className="text-[30px] font-semibold leading-none tracking-[-0.03em] [font-family:var(--font-display)]">
                          {money(p.price * multiplier)}
                        </span>
                        <span className="text-[13px] text-muted-foreground">{per}</span>
                      </span>
                      <span className="text-pretty text-[13px] leading-[19px] text-muted-foreground">{p.tagline}</span>
                      <span className="border-t border-border pt-2.5 text-xs leading-[17px] text-foreground">
                        {p.productAllowances.core} main · {plural(p.productAllowances.addon, "tool", "tools")} ·{" "}
                        {plural(p.projectAllowance, "project", "projects")} · {p.seatAllowance} people
                      </span>
                    </button>
                  );
                })}
              </div>
              {showTrial ? (
                <p className="mt-3.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-muted-foreground">
                  <Sparkles className="size-3.5" />
                  New to Geiger?
                  <button
                    type="button"
                    onClick={openTrial}
                    className="rounded-sm font-medium text-foreground underline underline-offset-[3px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Try Basic free for 15 days
                  </button>
                  — no card needed.
                </p>
              ) : null}
            </section>

            <section className="border-b border-border p-5 sm:p-6" aria-label="Apps">
              <SectionHeading step={2} title="Apps" hint="Pick the apps your team uses. Swap them any time." />
              <div className="flex flex-col gap-5">
                {APP_GROUPS.map((group) => {
                  const allowance = plan.productAllowances[group.id] ?? 0;
                  const rate = CATEGORY_RATES[group.id];
                  const chosen = apps.filter((id) => products.some((p) => p.id === id && p.category === group.id));
                  const used = chosen.length;
                  return (
                    <div key={group.id}>
                      <div className="mb-2.5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                        <p className="text-sm font-semibold">
                          {group.name} <span className="font-normal text-muted-foreground">{group.blurb}</span>
                        </p>
                        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-muted-foreground">
                          <AllowanceMeter used={used} allowance={allowance} />
                          <span className="font-medium text-foreground">
                            {used <= allowance ? `${used} of ${allowance} included` : `${allowance} Included + ${used - allowance} Extra`}
                          </span>
                          <span>Extra {group.unit} ${rate}/mo each</span>
                        </div>
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                        {products
                          .filter((product) => product.category === group.id)
                          .map((product) => {
                            const Icon = PRODUCT_ICONS[product.id] ?? FallbackProductIcon;
                            const on = chosen.includes(product.id);
                            const owned = isOwned(product.id);
                            const paid = on && chosen.indexOf(product.id) >= allowance;
                            const tag = owned ? "Owned" : paid ? `+$${rate}/mo` : on ? "Included" : "";
                            return (
                              <button
                                key={product.id}
                                type="button"
                                aria-pressed={on}
                                disabled={owned}
                                title={owned ? `${product.name} is already on your plan` : undefined}
                                onClick={() => toggleIn(setApps, product.id)}
                                className={cn(
                                  "flex items-start gap-2.5 rounded-[10px] border px-3 py-2.5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                  on ? "border-foreground bg-surface-active" : "border-border bg-background hover:border-border-strong",
                                  owned && "cursor-not-allowed",
                                )}
                              >
                                <span
                                  className={cn(
                                    "flex size-[30px] shrink-0 items-center justify-center rounded-[7px] transition",
                                    on ? "bg-foreground text-background" : "bg-surface-card text-muted-foreground",
                                  )}
                                >
                                  <Icon className="size-4" />
                                </span>
                                <span className="min-w-0 flex-1">
                                  <span className="flex items-center justify-between gap-1.5">
                                    <span className="text-sm font-semibold">{product.name}</span>
                                    <span className={cn("font-mono text-[11px]", paid ? "text-foreground" : "text-muted-foreground")}>
                                      {tag}
                                    </span>
                                  </span>
                                  <span className="mt-px block text-xs leading-4 text-muted-foreground">{product.blurb}</span>
                                </span>
                              </button>
                            );
                          })}
                      </div>
                    </div>
                  );
                })}
                <div className="flex items-center gap-2.5 rounded-[10px] border border-dashed border-border px-3 py-2.5 text-[13px] text-muted-foreground">
                  <NotesIcon className="size-4 shrink-0" />
                  <span>
                    <span className="font-semibold text-foreground">Notes</span> is included on every plan.
                  </span>
                </div>
              </div>
            </section>

            <section className="border-b border-border p-5 sm:p-6" aria-label="Team">
              <SectionHeading step={3} title="Team" />
              <div className="grid gap-3 sm:grid-cols-2">
                {TEAM.map((item) => {
                  const included = plan[item.allowance];
                  const minimum = ownedMetrics?.[item.id] ?? 1;
                  const cost = estimate[item.cost];
                  return (
                    <div key={item.id} className="flex flex-col gap-3 rounded-xl border border-border bg-background p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <span className="block text-sm font-semibold">{item.label}</span>
                          <span className="mt-0.5 block text-xs text-muted-foreground">{item.help}</span>
                        </div>
                        <Stepper
                          label={item.label}
                          value={team[item.id]}
                          minimum={minimum}
                          maximum={Math.max(METRIC_MAX[item.id], minimum)}
                          onChange={(value) => setTeam((current) => ({ ...current, [item.id]: value }))}
                        />
                      </div>
                      <div className="flex items-center justify-between gap-3 border-t border-border pt-2.5 text-xs">
                        <span className="text-muted-foreground">
                          {included} included, then ${item.rate}/mo each
                        </span>
                        <span className={cn("font-mono", cost > 0 ? "text-foreground" : "text-muted-foreground")}>
                          {cost > 0 ? `+${money(cost * multiplier)}${per}` : "Included"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="border-b border-border p-5 sm:p-6" aria-label="Usage">
              <SectionHeading
                step={4}
                title="Usage"
                hint={hasSubscription ? "Light keeps what you have today. Prices are per month." : "Light is what your plan includes. Prices are per month."}
              />
              <div className="-mt-2.5">
                {USAGE_PRESETS.map((preset, index) => {
                  const included = usageIncluded(preset, plan);
                  return (
                    <div
                      key={preset.id}
                      className={cn(
                        "grid gap-3 py-3.5 md:grid-cols-[minmax(0,1fr)_384px] md:items-center md:gap-6",
                        index > 0 && "border-t border-border",
                      )}
                    >
                      <div>
                        <span className="block text-sm font-semibold">{preset.label}</span>
                        <span className="mt-0.5 block text-xs leading-[17px] text-muted-foreground">{preset.help}</span>
                      </div>
                      <div role="radiogroup" aria-label={preset.label} className="grid grid-cols-3 gap-1 rounded-[10px] border border-border bg-background p-1">
                        {USAGE_LEVELS.map((levelName, level) => {
                          const value = usageMetric(preset, plan, ownedMetrics, level);
                          const cost = computeEstimate({ planId: plan.id, metrics: { ...metrics, [preset.id]: value } })[preset.cost];
                          const selected = usage[preset.id] === level;
                          return (
                            <button
                              key={levelName}
                              type="button"
                              role="radio"
                              aria-checked={selected}
                              onClick={() => setUsage((current) => ({ ...current, [preset.id]: level }))}
                              className={cn(
                                "flex flex-col items-start gap-[3px] rounded-[7px] border px-2.5 py-[7px] text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                selected ? "border-border-strong bg-surface-hover" : "border-transparent hover:bg-surface-hover/60",
                              )}
                            >
                              <span className={cn("text-[11px] font-medium", selected ? "text-foreground" : "text-muted-foreground")}>
                                {levelName}
                              </span>
                              <span className="flex w-full flex-wrap items-baseline justify-between gap-x-1.5">
                                <span className="text-[13px] font-semibold">{usageAmount(preset.id, value)}</span>
                                <span className="font-mono text-[11px] text-muted-foreground">
                                  {cost > 0 ? `+${money(cost)}` : included > 0 ? "Included" : "$0"}
                                </span>
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="p-5 sm:p-6" aria-label="Extras">
              <SectionHeading step={5} title="Extras" hint="Optional. Not included in any plan." />
              <div className="grid gap-2 sm:grid-cols-2">
                {EXTRA_PRODUCTS.map((product) => {
                  const Icon = PRODUCT_ICONS[product.id] ?? FallbackProductIcon;
                  const owned = isOwned(product.id);
                  const soon = Boolean(product.comingSoon) && !owned;
                  const on = owned || extras.includes(product.id);
                  const price = product.price ?? CATEGORY_RATES[product.category];
                  return (
                    <button
                      key={product.id}
                      type="button"
                      role="checkbox"
                      aria-checked={on}
                      disabled={owned || soon}
                      title={owned ? `${product.name} is already on your plan` : soon ? `${product.name} is coming soon` : undefined}
                      onClick={() => toggleIn(setExtras, product.id)}
                      className={cn(
                        "flex items-center gap-3 rounded-[10px] border p-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        soon
                          ? "cursor-not-allowed border-dashed border-border bg-background opacity-55"
                          : on
                            ? "border-foreground bg-surface-active"
                            : "border-border bg-background hover:border-border-strong",
                        owned && "cursor-not-allowed",
                      )}
                    >
                      <span className="flex size-[30px] shrink-0 items-center justify-center rounded-[7px] bg-surface-card text-muted-foreground">
                        <Icon className="size-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold">{product.shortName ?? product.name}</span>
                        <span className="mt-px block truncate text-xs text-muted-foreground">{product.blurb}</span>
                      </span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {owned ? "Owned" : soon ? "Soon" : `$${price}/mo`}
                      </span>
                      <span
                        aria-hidden="true"
                        className={cn(
                          "flex size-[18px] shrink-0 items-center justify-center rounded-[5px] border",
                          on ? "border-foreground bg-foreground text-background" : "border-border-strong",
                        )}
                      >
                        {on ? <Check className="size-3" /> : null}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Mobile-only running total; sticks while the configurator scrolls and parks above the receipt. */}
          <div className="sticky bottom-0 z-20 -mx-4 mt-4 flex items-center justify-between gap-3 border-t border-border bg-background px-4 pb-5 pt-3 sm:-mx-6 sm:px-6 lg:hidden">
            <div className="min-w-0">
              <div className="flex items-baseline gap-1">
                <span className="text-[26px] font-semibold leading-none tracking-[-0.03em] [font-family:var(--font-display)]">
                  {money(estimate.total * multiplier)}
                </span>
                <span className="text-xs text-muted-foreground">{per}</span>
              </div>
              <p className="mt-1 truncate text-xs text-muted-foreground">{summary}</p>
            </div>
            <Button asChild size="lg" className="shrink-0">
              <a href="#pricing-receipt">
                Review
                <ArrowDown className="size-4" />
              </a>
            </Button>
          </div>
        </div>

        <aside
          id="pricing-receipt"
          className="scroll-mt-24 overflow-hidden rounded-2xl border border-border-strong bg-background lg:sticky lg:top-[72px]"
          aria-label="Your total"
        >
          <div className="border-b border-border p-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-muted-foreground">
              {plan.name} · billed {isYearly ? "yearly" : "monthly"}
            </p>
            <div className="mt-3.5 flex items-baseline gap-1.5">
              <RollingNumber
                value={money(estimate.total * multiplier)}
                className="text-[56px] font-semibold leading-none tracking-[-0.04em] [font-family:var(--font-display)]"
              />
              <span className="font-mono text-xs text-muted-foreground">{per}</span>
            </div>
            <p className="mt-2.5 text-xs leading-[18px] text-muted-foreground">
              {isYearly ? "Yearly is 10× the monthly price — two months free." : "Switch to yearly and get two months free."}
            </p>
          </div>

          <div className="flex flex-col gap-2.5 px-6 py-5 text-sm">
            <dl className="contents">
              {[{ label: `${plan.name} plan`, value: plan.price }, ...lines].map((line) => (
                <div key={line.label} className="flex items-baseline justify-between gap-3">
                  <dt>{line.label}</dt>
                  <dd className="font-mono text-[13px]">{money(line.value * multiplier)}</dd>
                </div>
              ))}
            </dl>
            {lines.length === 0 ? <p className="text-xs text-muted-foreground">Nothing extra yet — you&apos;re within the plan.</p> : null}
          </div>

          {hasSubscription ? (
            <div className="mx-6 mb-4 flex flex-col gap-2 rounded-[10px] border border-border bg-surface-subtle px-3.5 py-3 text-[13px]">
              {currentMonthlyTotal > 0 ? (
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">You already pay</span>
                  <span className="font-mono">−{money(currentMonthlyTotal * multiplier)}</span>
                </div>
              ) : null}
              <div className="flex justify-between gap-3 font-semibold">
                <span>Due today</span>
                <span className="font-mono">{money(dueToday)}</span>
              </div>
            </div>
          ) : null}

          <div className="px-6 pb-5">
            <p className="text-xs font-semibold">Included with {plan.name}</p>
            <p className="mt-1 text-xs leading-[18px] text-muted-foreground">
              {plan.productAllowances.core} main + {plural(plan.productAllowances.addon, "tool", "tools")} + Notes ·{" "}
              {plural(plan.projectAllowance, "project", "projects")} · {plan.seatAllowance} People · {plan.storageAllowance} GB
              Storage · {wholeNumber.format(plan.aiAllowance)} AI credits
            </p>
          </div>

          <div className="border-t border-border p-4">
            {isAuthed && organizations.length > 0 ? (
              <Select value={selectedOrgId} onValueChange={selectOrg}>
                <SelectTrigger className="mb-2.5 w-full" aria-label="Organization to apply this plan to">
                  <span className="flex min-w-0 items-center gap-1">
                    <span className="text-muted-foreground mr-2">Apply to</span>
                    <SelectValue placeholder="Select organization" />
                  </span>
                </SelectTrigger>
                <SelectContent>
                  {organizations.map((org) => (
                    <SelectItem key={org.id} value={org.id}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : null}
            {isAuthed && organizations.length === 0 ? (
              <p className="mb-2.5 rounded-lg border border-border bg-surface-subtle px-3 py-2 text-xs text-muted-foreground">
                You&apos;ll need an organization to apply this plan to.{" "}
                <Link href="/org" className="font-medium text-foreground underline-offset-2 hover:underline">
                  Create one
                </Link>
                .
              </p>
            ) : null}
            <Button size="lg" className="w-full" onClick={handleCheckout} disabled={checkingOut || noChange}>
              {checkingOut ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Starting checkout…
                </>
              ) : (
                <>
                  {ctaLabel}
                  {noChange ? null : <ArrowRight className="size-4" />}
                </>
              )}
            </Button>
            <p className="mt-2.5 text-center text-[11px] text-muted-foreground">Secure checkout with Stripe.</p>
          </div>
        </aside>
      </div>

      <Dialog open={trialOpen} onOpenChange={setTrialOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Start your 15-day free trial</DialogTitle>
            <DialogDescription>
              Full Basic access for 15 days. No card required — we won&apos;t charge you.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            {organizations.length > 1 ? (
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Apply trial to organization
                </label>
                <Select value={trialOrgId} onValueChange={setTrialOrgId}>
                  <SelectTrigger className="w-full">
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
            ) : (
              <p className="rounded-lg border border-border bg-surface-subtle px-3 py-2 text-sm text-muted-foreground">
                Trial will apply to{" "}
                <span className="font-medium text-foreground">{organizations[0]?.name}</span>.
              </p>
            )}
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Check className="size-3.5 text-foreground" /> 15 days of Basic access
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-3.5 text-foreground" /> No credit card required
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-3.5 text-foreground" /> Ends automatically — no surprise charge
              </li>
            </ul>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setTrialOpen(false)} disabled={startingTrial}>
              Cancel
            </Button>
            <Button onClick={handleStartTrial} disabled={startingTrial} className="bg-primary text-primary-foreground">
              {startingTrial ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Starting…
                </>
              ) : (
                "Start free trial"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
