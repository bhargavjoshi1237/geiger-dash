// Derives the effective lifecycle phase of a user's plan from its timestamps.
// No cron/job flips status — reads compute the phase from current_period_end, so
// a lapsed trial/plan is recognized lazily. Consumed by the billing page and the
// global plan banner. Input is the normalized user_plan view model from
// lib/billing/store.js (or null).

const DAY_MS = 24 * 60 * 60 * 1000;
export const DELETION_GRACE_DAYS = 30;

function daysUntil(now, target) {
  return Math.max(0, Math.ceil((target.getTime() - now.getTime()) / DAY_MS));
}

// phase:
//   'none'     no live plan (never subscribed, or inactive/canceled)
//   'trialing' cardless trial, access granted
//   'active'   paid plan, access granted
//   'grace'    period ended; access revoked; 30-day deletion countdown running
//   'expired'  grace elapsed; conceptually deleted (UI-only, no destructive job)
export function derivePlanState(userPlan, now = new Date()) {
  const base = {
    phase: "none",
    planKey: userPlan?.planKey ?? null,
    isTrial: userPlan?.status === "trialing",
    periodEnd: null,
    daysRemaining: 0,
    deletionDate: null,
    deletionDaysRemaining: 0,
    trialUsed: Boolean(userPlan?.trialStartedAt),
  };

  if (!userPlan) return base;

  const { status, currentPeriodEnd } = userPlan;
  const live = status === "active" || status === "trialing";
  if (!live) {
    return { ...base, phase: status === "expired" ? "expired" : "none" };
  }

  const periodEnd = currentPeriodEnd ? new Date(currentPeriodEnd) : null;
  base.periodEnd = periodEnd;

  // A paid plan without an end date (legacy row) never expires.
  if (!periodEnd) {
    return { ...base, phase: status === "trialing" ? "trialing" : "active" };
  }

  if (now < periodEnd) {
    return {
      ...base,
      phase: status === "trialing" ? "trialing" : "active",
      daysRemaining: daysUntil(now, periodEnd),
    };
  }

  const deletionDate = new Date(periodEnd.getTime() + DELETION_GRACE_DAYS * DAY_MS);
  base.deletionDate = deletionDate;

  if (now < deletionDate) {
    return { ...base, phase: "grace", deletionDaysRemaining: daysUntil(now, deletionDate) };
  }

  return { ...base, phase: "expired" };
}
