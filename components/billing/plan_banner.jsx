// App-wide banner surfacing a live trial's remaining days and, once a trial or
// paid plan ends, the 30-day data-deletion countdown. Server component: reads
// the signed-in user's plan and derives the phase; renders nothing for signed-out
// users or a healthy active/none/expired plan. Fixed to the bottom so it never
// collides with the fixed page headers.

import Link from "next/link";
import { AlertTriangle, Clock } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { getUser } from "@/supabase/user/getUser";
import { getUserPlan } from "@/lib/billing/store";
import { derivePlanState } from "@/lib/billing/plan_state";

function pluralDays(n) {
  return `${n} ${n === 1 ? "day" : "days"}`;
}

export async function PlanBanner() {
  const supabase = await createClient();
  const user = await getUser(supabase);
  if (!user) return null;

  const plan = await getUserPlan(user.id);
  const state = derivePlanState(plan);

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
