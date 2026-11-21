// Ticket fee maths shared by the fee calculators and comparison pages. All amounts are in dollars and rounded to cents per ticket.
// A plan is { percent, fixed, cap?, processing: { percent, fixed } | null, canPassToBuyer }; processing null means the platform fee already includes card processing.

// toFixed first so binary float error can't flip a half cent: 2.9% of $25 + 30¢ is $1.025, which must round to $1.03.
const round = (value) => Math.round(Number((value * 100).toFixed(6))) / 100;

export function platformFee(plan, price) {
  if (price <= 0) return 0;
  const fee = price * (plan.percent / 100) + plan.fixed;
  return round(plan.cap != null ? Math.min(fee, plan.cap) : fee);
}

function processingFee(plan, amount) {
  if (!plan.processing || amount <= 0) return 0;
  return round(amount * (plan.processing.percent / 100) + plan.processing.fixed);
}

// One ticket at `price`. absorb: the buyer pays the price and the organiser covers every fee.
// pass: platform and processing fees are added on top, so the organiser keeps the price.
export function ticketBreakdown(plan, price, passToBuyer = false) {
  const fee = platformFee(plan, price);
  if (passToBuyer && plan.canPassToBuyer) {
    const rate = plan.processing ? plan.processing.percent / 100 : 0;
    const fixed = plan.processing ? plan.processing.fixed : 0;
    // Eventbrite charges processing on ticket + service fee; otherwise gross the card fee up so the buyer's total covers it.
    const buyerPays = price <= 0
      ? 0
      : plan.processingOnSubtotal
        ? round((price + fee) * (1 + rate) + fixed)
        : round((price + fee + fixed) / (1 - rate));
    return { price, platformFee: fee, processing: round(buyerPays - price - fee), buyerPays, organiserGets: price };
  }
  const processing = processingFee(plan, price);
  return { price, platformFee: fee, processing, buyerPays: price, organiserGets: round(price - fee - processing) };
}

// Ticket price needed for the organiser to keep `target` per ticket when absorbing fees; null when a cap or fixed fee makes it unreachable.
export function priceForTarget(plan, target) {
  if (target <= 0) return 0;
  const rate = plan.percent / 100 + (plan.processing ? plan.processing.percent / 100 : 0);
  const fixed = plan.fixed + (plan.processing ? plan.processing.fixed : 0);
  let price = (target + fixed) / (1 - rate);
  // With a cap the percentage stops growing, so solve again with the capped fee.
  if (plan.cap != null && platformFee(plan, price) >= plan.cap) {
    const procRate = plan.processing ? plan.processing.percent / 100 : 0;
    const procFixed = plan.processing ? plan.processing.fixed : 0;
    price = (target + plan.cap + procFixed) / (1 - procRate);
  }
  price = Math.ceil(price * 100) / 100;
  return ticketBreakdown(plan, price).organiserGets >= target - 0.005 ? price : round(price + 0.01);
}

export function formatMoney(value, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value || 0);
}

export function describePlan(plan) {
  const parts = [];
  if (plan.percent || plan.fixed) {
    parts.push([plan.percent ? `${plan.percent}%` : null, plan.fixed ? formatMoney(plan.fixed) : null].filter(Boolean).join(" + "));
  } else {
    parts.push("No platform fee");
  }
  if (plan.cap != null) parts.push(`capped at ${formatMoney(plan.cap)}`);
  const processing = plan.processing ? [`${plan.processing.percent}%`, plan.processing.fixed ? formatMoney(plan.processing.fixed) : null].filter(Boolean).join(" + ") : null;
  parts.push(processing ? `plus card processing ${processing}` : "card processing included");
  return parts.join(", ");
}
