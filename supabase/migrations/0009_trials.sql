-- Trial + expiry lifecycle for user_plan (geiger-dash).
--
-- Adds a per-user trial eligibility stamp and a period-end used to expire both
-- cardless trials and purchased plans. status (a plain text column) now also
-- takes 'trialing' and 'expired' in addition to active | inactive | canceled.
-- Additive + idempotent — safe to re-run.

alter table public.user_plan
  add column if not exists trial_started_at timestamptz;

alter table public.user_plan
  add column if not exists current_period_end timestamptz;

-- Back-fill an end date for existing active paid plans so they acquire the same
-- expiry lifecycle (monthly +30d, yearly +365d from start). Rows left null are
-- treated as non-expiring by the app.
update public.user_plan
set current_period_end = started_at + case
    when billing_interval = 'year' then interval '365 days'
    else interval '30 days'
  end
where current_period_end is null
  and status = 'active';
