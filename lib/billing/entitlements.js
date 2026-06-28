// Turns an organization's recorded subscription (organizations.metadata.
// subscription, written by lib/billing/store.js on a completed purchase) into
// the concrete entitlements the UI and server actions enforce: which products
// are unlocked and how many projects/seats are allowed.
//
// Grandfathering: an org with NO active subscription is treated as UNRESTRICTED
// (all products, no limits) so organizations that predate billing keep working.
// Flip DEFAULT_UNRESTRICTED to false to lock everything down by default later.

import { getPlan, products as PRODUCT_CATALOG } from "@/lib/pricing/plans";

const ALL_PRODUCT_IDS = PRODUCT_CATALOG.map((p) => p.id);
const DEFAULT_UNRESTRICTED = true;

function readSubscription(organization) {
  const meta =
    organization?.metadata && typeof organization.metadata === "object" ? organization.metadata : {};
  const sub = meta.subscription && typeof meta.subscription === "object" ? meta.subscription : null;
  return sub && sub.status === "active" ? sub : null;
}

export function getOrgEntitlements(organization) {
  const sub = readSubscription(organization);

  if (!sub) {
    return {
      hasSubscription: false,
      unrestricted: DEFAULT_UNRESTRICTED,
      planKey: null,
      planName: null,
      billingInterval: null,
      // null = no restriction (every product unlocked).
      unlockedProducts: DEFAULT_UNRESTRICTED ? null : [],
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

  return {
    hasSubscription: true,
    unrestricted: false,
    planKey: plan.id,
    planName: plan.name,
    billingInterval: sub.billingInterval || "month",
    unlockedProducts,
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
