// Billing data layer — the only place that writes payments/purchases/user_plan.
// Uses the service-role client (bypasses RLS) because writes originate from the
// checkout action, the Stripe webhook, and the success-page finalizer — none of
// which should depend on the end user's RLS context. Pure: returns null/false on
// failure, console.error, never throws.

import { createAdminClient } from '@/utils/supabase/admin'

function normalizePurchase(row) {
  if (!row) return null
  return {
    id: row.id,
    userId: row.user_id,
    paymentId: row.payment_id,
    organizationId: row.organization_id,
    planKey: row.plan_key,
    billingInterval: row.billing_interval,
    amountTotal: row.amount_total,
    currency: row.currency,
    products: Array.isArray(row.products) ? row.products : [],
    metrics: row.metrics && typeof row.metrics === 'object' ? row.metrics : {},
    status: row.status,
    createdAt: row.created_at,
  }
}

function normalizeUserPlan(row) {
  if (!row) return null
  return {
    userId: row.user_id,
    planKey: row.plan_key,
    billingInterval: row.billing_interval,
    status: row.status,
    products: Array.isArray(row.products) ? row.products : [],
    amountTotal: row.amount_total,
    currency: row.currency,
    currentPurchaseId: row.current_purchase_id,
    startedAt: row.started_at,
    updatedAt: row.updated_at,
  }
}

// Called when a Checkout Session is created: records a pending payment + a
// pending purchase keyed by the Stripe session id. Idempotent on session id.
export async function recordPendingCheckout({
  userId,
  sessionId,
  amountCents,
  currency = 'usd',
  planKey,
  billingInterval = 'month',
  products = [],
  metrics = {},
  organizationId = null,
  customerEmail = null,
}) {
  const sb = createAdminClient()
  if (!sb || !sessionId) return null

  try {
    const { data: payment, error: payErr } = await sb
      .from('payments')
      .upsert(
        {
          user_id: userId,
          stripe_session_id: sessionId,
          amount_total: amountCents,
          currency,
          status: 'pending',
          customer_email: customerEmail,
          metadata: { planKey, billingInterval, products },
        },
        { onConflict: 'stripe_session_id' },
      )
      .select('*')
      .single()
    if (payErr) {
      console.error('[billing.recordPendingCheckout.payment]', payErr.message)
      return null
    }

    // Avoid duplicate purchase rows if the action is retried for one session.
    const { data: existing } = await sb
      .from('purchases')
      .select('id')
      .eq('payment_id', payment.id)
      .maybeSingle()

    if (!existing) {
      const { error: purErr } = await sb.from('purchases').insert({
        user_id: userId,
        payment_id: payment.id,
        organization_id: organizationId,
        plan_key: planKey,
        billing_interval: billingInterval,
        amount_total: amountCents,
        currency,
        products,
        metrics,
        status: 'pending',
      })
      if (purErr) {
        console.error('[billing.recordPendingCheckout.purchase]', purErr.message)
        return null
      }
    }

    return payment.id
  } catch (e) {
    console.error('[billing.recordPendingCheckout]', e)
    return null
  }
}

// Record the purchased plan on the organization's metadata.subscription bag so
// the org "has" the plan. Best-effort; never blocks payment finalization.
async function applyOrgSubscription(sb, purchase) {
  try {
    const { data: org, error } = await sb
      .from('organizations')
      .select('metadata')
      .eq('id', purchase.organization_id)
      .maybeSingle()
    if (error) {
      console.error('[billing.applyOrgSubscription.read]', error.message)
      return
    }
    if (!org) return

    const metadata = org.metadata && typeof org.metadata === 'object' ? org.metadata : {}
    const next = {
      ...metadata,
      subscription: {
        planKey: purchase.plan_key,
        billingInterval: purchase.billing_interval,
        status: 'active',
        products: Array.isArray(purchase.products) ? purchase.products : [],
        amountTotal: purchase.amount_total,
        currency: purchase.currency,
        purchaseId: purchase.id,
        updatedAt: new Date().toISOString(),
      },
    }

    const { error: upErr } = await sb
      .from('organizations')
      .update({ metadata: next })
      .eq('id', purchase.organization_id)
    if (upErr) console.error('[billing.applyOrgSubscription.write]', upErr.message)
  } catch (e) {
    console.error('[billing.applyOrgSubscription]', e)
  }
}

// Called when payment is confirmed (webhook or success-page finalizer). Flips
// payment -> paid and purchase -> completed, then upserts the user's current
// plan. Idempotent: a no-op if the payment is already paid.
export async function completeCheckout({
  sessionId,
  paymentIntent = null,
  amountCents = null,
  customerEmail = null,
}) {
  const sb = createAdminClient()
  if (!sb || !sessionId) return false

  try {
    const { data: payment, error: payErr } = await sb
      .from('payments')
      .select('*')
      .eq('stripe_session_id', sessionId)
      .maybeSingle()
    if (payErr) {
      console.error('[billing.completeCheckout.lookup]', payErr.message)
      return false
    }
    if (!payment) return false
    if (payment.status === 'paid') return true // already finalized

    const { error: upPayErr } = await sb
      .from('payments')
      .update({
        status: 'paid',
        stripe_payment_intent: paymentIntent ?? payment.stripe_payment_intent,
        amount_total: amountCents ?? payment.amount_total,
        customer_email: customerEmail ?? payment.customer_email,
      })
      .eq('id', payment.id)
    if (upPayErr) {
      console.error('[billing.completeCheckout.payment]', upPayErr.message)
      return false
    }

    const { data: purchase, error: purErr } = await sb
      .from('purchases')
      .update({ status: 'completed' })
      .eq('payment_id', payment.id)
      .select('*')
      .maybeSingle()
    if (purErr) {
      console.error('[billing.completeCheckout.purchase]', purErr.message)
      return false
    }

    if (purchase) {
      const { error: planErr } = await sb.from('user_plan').upsert(
        {
          user_id: purchase.user_id,
          plan_key: purchase.plan_key,
          billing_interval: purchase.billing_interval,
          status: 'active',
          products: purchase.products,
          amount_total: purchase.amount_total,
          currency: purchase.currency,
          current_purchase_id: purchase.id,
          started_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' },
      )
      if (planErr) {
        console.error('[billing.completeCheckout.user_plan]', planErr.message)
        return false
      }

      // Apply the plan to the organization the buyer selected. Recorded on the
      // org's metadata.subscription bag (the plan table is per-project via
      // organization_project, so a standalone row there would be orphaned).
      if (purchase.organization_id) {
        await applyOrgSubscription(sb, purchase)
      }
    }

    return true
  } catch (e) {
    console.error('[billing.completeCheckout]', e)
    return false
  }
}

export async function getUserPlan(userId) {
  const sb = createAdminClient()
  if (!sb || !userId) return null
  try {
    const { data, error } = await sb
      .from('user_plan')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()
    if (error) {
      console.error('[billing.getUserPlan]', error.message)
      return null
    }
    return normalizeUserPlan(data)
  } catch (e) {
    console.error('[billing.getUserPlan]', e)
    return null
  }
}

export async function listPurchases(userId) {
  const sb = createAdminClient()
  if (!sb || !userId) return []
  try {
    const { data, error } = await sb
      .from('purchases')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) {
      console.error('[billing.listPurchases]', error.message)
      return []
    }
    return (data || []).map(normalizePurchase)
  } catch (e) {
    console.error('[billing.listPurchases]', e)
    return []
  }
}
