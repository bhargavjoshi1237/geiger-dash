// Turns an organization's recorded subscription (organizations.metadata.
// subscription, written by lib/billing/store.js on a completed purchase) into
// the concrete entitlements the UI and server actions enforce: which products
// are unlocked and how many projects/seats are allowed.
//
import { getPlan, getPlanRank, products as PRODUCT_CATALOG } from "@/lib/pricing/plans";

const ALL_PRODUCT_IDS = PRODUCT_CATALOG.map((p) => p.id);
const DEFAULT_UNRESTRICTED = false;

function readSubscription(organization) {
  const meta =
    organization?.metadata && typeof organization.metadata === "object" ? organization.metadata : {};
  const sub = meta.subscription && typeof meta.subscription === "object" ? meta.subscription : null;
  if (!sub) return null;
  // A trial grants the same live access as an active plan for its window.
  if (sub.status !== "active" && sub.status !== "trialing") return null;
  // Once the current period has elapsed the subscription ends — grace/expired
  // orgs get no entitlements until they renew.
  if (sub.currentPeriodEnd && Date.now() >= new Date(sub.currentPeriodEnd).getTime()) return null;
  return sub;
}

export function getOrgEntitlements(organization) {
  const sub = readSubscription(organization);

  if (!sub) {
    return {
      hasSubscription: false,
      isTrial: false,
      unrestricted: DEFAULT_UNRESTRICTED,
      planKey: null,
      planName: null,
      planRank: 0,
      billingInterval: null,
      // null = no restriction (every product unlocked).
      unlockedProducts: DEFAULT_UNRESTRICTED ? null : [],
      currentMetrics: null,
      amountTotal: 0,
      limits: {
        projects: DEFAULT_UNRESTRICTED ? Infinity : 0,
        seats: DEFAULT_UNRESTRICTED ? Infinity : 0,
      },
    };
  }

  const plan = getPlan(sub.planKey);
  const unlockedProducts = Array.isArray(sub.products)
    ? sub.products.filter((id) => ALL_PRODUCT_IDS.includes(id))
    : [];
  const storedMetrics = sub.metrics && typeof sub.metrics === "object" ? sub.metrics : {};

  return {
    hasSubscription: true,
    isTrial: sub.status === "trialing",
    unrestricted: false,
    planKey: plan.id,
    planName: plan.name,
    planRank: getPlanRank(plan.id),
    billingInterval: sub.billingInterval || "month",
    unlockedProducts,
    // Previously purchased scale — used as floors so the calculator can't be
    // dragged below what the org already paid for.
    currentMetrics: {
      projects: storedMetrics.projects ?? plan.projectAllowance,
      seats: storedMetrics.seats ?? plan.seatAllowance,
      storage: storedMetrics.storage ?? plan.storageAllowance,
      bandwidth: storedMetrics.bandwidth ?? plan.storageAllowance * 5,
      edgeData: storedMetrics.edgeData ?? 0,
      aiCredits: storedMetrics.aiCredits ?? plan.aiAllowance,
      emails: storedMetrics.emails ?? plan.emailAllowance ?? 0,
    },
    amountTotal: sub.amountTotal ?? 0,
    limits: {
      projects: plan.projectAllowance ?? Infinity,
      seats: plan.seatAllowance ?? Infinity,
    },
  };
}

// null unlockedProducts => everything unlocked (grandfathered/unrestricted).
export function isProductUnlocked(entitlements, productId) {
  if (!entitlements || entitlements.unlockedProducts == null) return true;
  return entitlements.unlockedProducts.includes(productId);
}

export function canAddProject(entitlements, currentCount) {
  const limit = entitlements?.limits?.projects ?? Infinity;
  if (limit === Infinity) return true;
  return currentCount < limit;
}
