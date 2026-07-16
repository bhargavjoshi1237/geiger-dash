# Cardless 15-day Trial + Plan Expiry & Deletion Countdown

**Date:** 2026-07-16
**Status:** Approved (design)

## Goal

Add a cardless free-trial tier and a plan-expiry lifecycle to geiger-dash billing:

- The **$19 "Basic" plan** (`id: "basic"`) card gets a **"Start free trial"** button
  beside its existing buy button. No new plan tile is added.
- The trial grants **15 days** of Basic-tier access with **no card required** (no Stripe
  session at all).
- When the trial's 15 days elapse, the subscription **ends** (entitlements revoked) and a
  **30-day data-deletion countdown** begins ("your data will be deleted in N days unless
  you renew").
- The **same expiry + 30-day countdown** applies to **purchased plans** once they end.
  Paid plans end by **billing interval**: monthly = start + 30 days, yearly = start + 365
  days.

## Non-goals (this pass)

- **No real data deletion.** The 30-day countdown is UI + status only; no destructive cron
  job runs. Status simply reaches an `expired` phase.
- **No Stripe-native subscriptions / auto-renew.** The trial is fully app-managed; the buy
  flow stays a one-time `mode: "payment"` checkout. "Renew" = buy again.

## Decisions (locked with user)

| Question | Decision |
|---|---|
| When does a paid plan "end"? | Expire by billing interval (monthly +30d, yearly +365d). |
| Trial re-use | **One trial per user, ever** (gated on `user_plan.trial_started_at`). |
| Deletion at day 30 | UI countdown only; no destructive job. |
| Where surfaced | `/billing` full status **+** persistent global banner. |
| Trial scope | Basic **tier** access only (plan-level limits); add-on products are chosen when converting to paid. |
| Banner reach | App-wide (authenticated app + marketing pages). |

## Data model

Additive migration `supabase/migrations/0006_trials.sql`. No new tables. `user_plan.status`
is a plain `text` column (no DB enum/check to alter), so new status values need no
constraint change — only documentation.

Add to `public.user_plan`:

- `trial_started_at timestamptz` — set **once** when the user starts a trial; **never
  cleared** (per-user eligibility gate).
- `current_period_end timestamptz` — trial: `now + 15d`; paid: `started_at + interval`.

New `status` values used (documented, not constrained): `trialing`, `expired` (in addition
to existing `active | inactive | canceled`).

Idempotent (`alter table ... add column if not exists`). Include an optional back-fill:
set `current_period_end` on existing `active` rows from `started_at + interval` so already
purchased plans acquire an expiry; rows left null are treated as non-expiring.

**Org mirror:** `organizations.metadata.subscription` bag gains `status: "trialing"`,
`currentPeriodEnd` (ISO string), and `isTrial: true` so per-org gating understands trials.

## Lifecycle — computed lazily on read (no cron)

New helper `derivePlanState(userPlan)` in `lib/billing/plan_state.js`. Given a normalized
`user_plan` (which now carries `trialStartedAt`, `currentPeriodEnd`), it returns:

```
{
  phase,                 // 'none' | 'trialing' | 'active' | 'grace' | 'expired'
  planKey,
  isTrial,               // status === 'trialing'
  periodEnd,             // Date | null
  daysRemaining,         // whole days until periodEnd (trialing/active), else 0
  deletionDate,          // periodEnd + 30d (grace/expired), else null
  deletionDaysRemaining, // whole days until deletionDate (grace), else 0
  trialUsed,             // trialStartedAt != null
}
```

Phase derivation from `now`:

- No plan / `status` inactive/canceled → `none`.
- `now < periodEnd` → `trialing` or `active` (from stored status). Access granted.
- `periodEnd <= now < periodEnd + 30d` → `grace`. **Access revoked**; deletion countdown runs.
- `now >= periodEnd + 30d` → `expired`. Conceptually deleted; UI shows expired.
- Missing `periodEnd` on an `active` paid plan → treat as non-expiring `active` (back-compat).

Renewing (a completed purchase) writes a fresh `active` period + new `periodEnd`, clearing
grace/expired naturally.

## Entitlements

`getOrgEntitlements` (`lib/billing/entitlements.js`):

- `readSubscription` starts honoring `status ∈ {active, trialing}` **and** requires
  `now < currentPeriodEnd` when `currentPeriodEnd` is present. A lapsed trial/plan (grace
  or expired) returns the no-subscription entitlements (access ends — matches "end the
  subscription").
- During a trial, entitlements reflect the **Basic plan's** limits (projects/seats) with
  `unlockedProducts: []` (no add-on products). `hasSubscription: true`, `isTrial: true`.

## Starting a trial (cardless — no Stripe)

New server action `startTrialAction({ organizationId })` in `app/pricing/actions.js`
(or a sibling `app/pricing/trial-actions.js`), `"use server"`:

1. `getUser`; return `{ error: "auth" }` if not signed in.
2. Verify org membership via an RLS-scoped select of the org row; `{ error: "invalid_org" }`
   otherwise.
3. **Eligibility:** read `user_plan` for the user; if `trial_started_at` is already set,
   return `{ error: "trial_used" }`. If the user currently has an `active` paid plan, return
   `{ error: "already_subscribed" }` (a trial would be a downgrade).
4. Write (service-role, via a new `startTrial(...)` in `lib/billing/store.js`):
   - `user_plan` upsert: `plan_key: "basic"`, `billing_interval: "month"`,
     `status: "trialing"`, `products: []`, `amount_total: 0`, `trial_started_at: now`,
     `current_period_end: now + 15d`, `started_at: now`, `current_purchase_id: null`.
   - `organizations.metadata.subscription`: `{ planKey: "basic", status: "trialing",
     isTrial: true, currentPeriodEnd: now+15d ISO, products: [], amountTotal: 0, ... }`
     via a new `applyOrgTrial(sb, { organizationId, currentPeriodEnd })`.
5. Return `{ ok: true }`; the client redirects to `/billing`.

Pure data layer as always (returns null/false, console.error, no throw/toast).

## Basic plan card — two buttons

`components/pricing/plan_cards.jsx`:

- Only the plan with `id === "basic"` renders a secondary **"Start free trial"** button next
  to the existing plan/buy CTA. Copy: "15 days free — no card required". The existing buy
  button is unchanged.
- Clicking opens a small shadcn `Dialog`:
  - If the user has multiple `organizations`, a select to choose which org; single org is
    preselected; unauthenticated users are sent to login (mirror the buy flow's `auth`
    handling).
  - Confirm → `startTrialAction({ organizationId })`; on `{ ok }` redirect to `/billing`;
    on error map codes to `toast.error` (`trial_used` → "You've already used your free
    trial.", `already_subscribed`, `invalid_org`, `auth`).
- The trigger is **disabled with a hint** when the user has already used the trial
  (`entitlementsByOrg`/a passed `trialUsed` flag) — the pricing page computes `trialUsed`
  from `getUserPlan` and passes it to `PlanCards`.

## Paid-plan expiry stamping

`lib/billing/store.js`:

- `completeCheckout` — when upserting `user_plan`, also set
  `current_period_end = started_at + (billing_interval === 'year' ? 365d : 30d)` and clear
  `trial_started_at` is **not** touched (eligibility persists).
- `applyOrgSubscription` — add `currentPeriodEnd` (same computation) and `isTrial: false`
  to the org subscription bag.

## Surfacing

**Global banner** — `components/billing/plan_banner.jsx` (server component) reads
`getUserPlan(user.id)` + `derivePlanState`, rendered in the app layout (`app/layout.js` or
the shared shell) so it spans authenticated app + marketing:

- `trialing` → "Your Basic trial ends in N days." + **Upgrade** → `/pricing`.
- `grace` → "Your plan ended. Your data will be deleted in N days unless you renew." +
  **Renew** → `/pricing`. Destructive styling (`text-red-400`, amber/red accents).
- `active` / `none` / `expired` → render nothing.

Uses semantic color tokens only; dismissible-per-session is optional (not required).

**`/billing` page** (`app/billing/page.js`) — the current-plan card:

- Shows a `trialing` / `expired` badge alongside the existing Active/inactive badge.
- Shows the `current_period_end` date ("Trial ends" / "Renews / ends on").
- In `grace`, shows the 30-day deletion countdown prominently with a Renew CTA.

## Files touched

| File | Change |
|---|---|
| `supabase/migrations/0006_trials.sql` | **New** — add `trial_started_at`, `current_period_end`; back-fill. |
| `lib/billing/plan_state.js` | **New** — `derivePlanState(userPlan)`. |
| `lib/billing/store.js` | `normalizeUserPlan` add `trialStartedAt`/`currentPeriodEnd`; new `startTrial`, `applyOrgTrial`; stamp `current_period_end` in `completeCheckout` + `applyOrgSubscription`. |
| `lib/billing/entitlements.js` | Honor `trialing` + `currentPeriodEnd` in `readSubscription`; surface `isTrial`. |
| `app/pricing/actions.js` (or `trial-actions.js`) | **New** `startTrialAction`. |
| `app/pricing/page.js` | Compute `trialUsed` from `getUserPlan`; pass to `PlanCards`. |
| `components/pricing/plan_cards.jsx` | Basic-card "Start free trial" button + confirm dialog; `trialUsed` disabled state. |
| `components/billing/plan_banner.jsx` | **New** global banner. |
| `app/layout.js` (or shared shell) | Mount the banner. |
| `app/billing/page.js` | Trial/expiry badge, period-end date, deletion countdown. |

## Testing / verification

- `npm run db:push` (or apply `0006_trials.sql`) succeeds and is re-runnable (idempotent).
- Start trial → `user_plan` row `status=trialing`, `current_period_end ≈ now+15d`,
  `trial_started_at` set; org metadata mirrors it; `/billing` + banner show "ends in 15
  days"; Basic-tier entitlements active.
- Second trial attempt (same user) → `trial_used` error, button disabled.
- Simulate elapsed trial (`current_period_end` in the past) → entitlements revoked; banner
  + `/billing` show the 30-day deletion countdown; buying restores `active`.
- Simulate elapsed paid plan → same grace/countdown behavior.
- `npx eslint` clean on all changed files.
