"use client";

// App-wide trial / data-deletion countdown banner, fixed to the bottom; resolved client-side so the root layout never reads cookies and pages can stay static.

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, Clock } from "lucide-react";
import { getPlanBannerState } from "@/lib/billing/actions";
import { useSessionUser } from "@/lib/hooks/use-session-user";

function pluralDays(n) {
  return `${n} ${n === 1 ? "day" : "days"}`;
}

export function PlanBanner() {
  const userId = useSessionUser()?.id;
  const [result, setResult] = useState(null);

  // Signed-out visitors never hit the server; the action re-checks auth before reading the plan.
  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    getPlanBannerState()
      .then((state) => {
        if (!cancelled) setResult({ userId, state });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [userId]);

  // Only show a result fetched for the current session, so a sign-out hides it immediately.
  const state = result && result.userId === userId ? result.state : null;
  if (!state) return null;

  if (state.phase === "trialing") {
    return (
      <Banner
        tone="info"
        icon={Clock}
        message={`Your Basic trial ends in ${pluralDays(state.daysRemaining)}.`}
        cta="Upgrade"
      />
    );
  }

  if (state.phase === "grace") {
    return (
      <Banner
        tone="danger"
        icon={AlertTriangle}
        message={`Your plan ended. Your data will be deleted in ${pluralDays(
          state.deletionDaysRemaining,
        )} unless you renew.`}
        cta="Renew"
      />
    );
  }

  return null;
}

function Banner({ tone, icon: Icon, message, cta }) {
  const toneClasses =
    tone === "danger"
      ? "border-red-500/30 bg-red-500/10 text-red-500"
      : "border-border-strong bg-surface-strong text-foreground";

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center p-4">
      <div
        className={`pointer-events-auto flex w-full max-w-2xl items-center gap-3 rounded-xl border px-4 py-3 shadow-lg backdrop-blur ${toneClasses}`}
      >
        <Icon className="size-4 shrink-0" />
        <p className="flex-1 text-sm font-medium">{message}</p>
        <Link
          href="/pricing"
          className="shrink-0 rounded-lg bg-foreground px-3 py-1.5 text-xs font-semibold text-background transition hover:opacity-90"
        >
          {cta}
        </Link>
      </div>
    </div>
  );
}
