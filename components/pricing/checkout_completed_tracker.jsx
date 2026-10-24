"use client";

import { useEffect } from "react";
import { trackCheckoutCompleted } from "@/lib/analytics/funnel";

// Fires once per paid Stripe session; the server-rendered success page can't call PostHog itself.
export function CheckoutCompletedTracker({ sessionId, planId, amountUsd }) {
  useEffect(() => {
    const key = `geiger_checkout_tracked_${sessionId}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {}
    trackCheckoutCompleted({ planId, amountUsd });
  }, [sessionId, planId, amountUsd]);

  return null;
}
