"use client";

import { useMemo, useState } from "react";
import { PRODUCT_APPS } from "@/lib/org/product-apps";
import { productLocked, productUsedElsewhere, useEntitlements } from "./entitlements";

const NO_OWN_IDS = [];

// Shared selection state for the create and edit product pickers.
export function useProductPicker({ initialSelected = NO_OWN_IDS, ownProductIds = NO_OWN_IDS } = {}) {
  const entitlements = useEntitlements();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(initialSelected);

  const selectableProducts = useMemo(
    () =>
      PRODUCT_APPS.filter(
        (p) => !productLocked(entitlements, p.id) && !productUsedElsewhere(entitlements, p.id, ownProductIds),
      ),
    [entitlements, ownProductIds],
  );

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return PRODUCT_APPS;
    return PRODUCT_APPS.filter((p) => `${p.name} ${p.detail}`.toLowerCase().includes(q));
  }, [search]);

  const allSelected = selectableProducts.length > 0 && selected.length === selectableProducts.length;

  function toggle(id) {
    if (productLocked(entitlements, id)) return;
    if (productUsedElsewhere(entitlements, id, ownProductIds)) return;
    setSelected((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  }

  function toggleAll() {
    setSelected(allSelected ? [] : selectableProducts.map((p) => p.id));
  }

  // Per-product render state: whether it's pickable, and what to say about it.
  function stateOf(product) {
    const locked = productLocked(entitlements, product.id);
    const usedElsewhere = !locked && productUsedElsewhere(entitlements, product.id, ownProductIds);
    return {
      locked,
      usedElsewhere,
      isBlocked: locked || usedElsewhere,
      isSelected: selected.includes(product.id),
      hint: locked
        ? `${product.name} isn't in your plan`
        : usedElsewhere
          ? `${product.name} is already in another project`
          : undefined,
      description: locked ? "Not in your plan" : usedElsewhere ? "Already in another project" : product.detail,
    };
  }

  return {
    search,
    setSearch,
    selected,
    setSelected,
    selectableProducts,
    filteredProducts,
    allSelected,
    toggle,
    toggleAll,
    stateOf,
  };
}
