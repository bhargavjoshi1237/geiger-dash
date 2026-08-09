"use client";

import { createContext, useContext } from "react";

export const EntitlementsContext = createContext(null);

export function useEntitlements() {
  return useContext(EntitlementsContext);
}

// null unlockedProducts => everything unlocked (grandfathered / no plan).
export function productLocked(entitlements, productId) {
  const unlocked = entitlements?.unlockedProducts;
  if (unlocked == null) return false;
  return !unlocked.includes(productId);
}

// ownIds exempts the current project's own products from the "taken" check.
export function productUsedElsewhere(entitlements, productId, ownIds = []) {
  const used = entitlements?.usedProductIds;
  if (!used || !used.length) return false;
  if (ownIds.includes(productId)) return false;
  return used.includes(productId);
}
