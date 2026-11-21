"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Switch } from "@geiger/ui";
import { formatMoney, priceForTarget, ticketBreakdown } from "@/lib/resources/fee-math";

const toNumber = (value, fallback = 0) => {
  const number = Number.parseFloat(value);
  return Number.isFinite(number) && number >= 0 ? number : fallback;
};

function Field({ id, label, children, hint }) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id} className="text-xs text-muted-foreground">{label}</Label>
      {children}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

function Row({ label, value, strong, muted }) {
  return (
    <div className={`flex items-baseline justify-between gap-4 py-2.5 text-sm ${strong ? "font-semibold text-foreground" : muted ? "text-muted-foreground" : "text-foreground"}`}>
      <span>{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}

// One platform's calculator: per-ticket breakdown, totals, the price needed to net a target, and the same sale on Geiger Events.
export function FeeCalculator({ platform, geiger }) {
  const initialPlan = platform.plans.find((plan) => plan.isDefault) ?? platform.plans[0];
  const [planId, setPlanId] = useState(initialPlan.id);
  const [price, setPrice] = useState("25");
  const [quantity, setQuantity] = useState("100");
  // Buyer-pays platforms (Posh, DICE) start with fees on top, as they sell by default.
  const [pass, setPass] = useState(Boolean(initialPlan.defaultPass));
  const [target, setTarget] = useState("25");

  const plan = platform.plans.find((entry) => entry.id === planId) ?? platform.plans[0];
  const ticketPrice = toNumber(price);
  const tickets = Math.round(toNumber(quantity));
  const passToBuyer = pass && plan.canPassToBuyer;

  const result = useMemo(() => {
    const ticket = ticketBreakdown(plan, ticketPrice, passToBuyer);
    const onGeiger = ticketBreakdown(geiger.plan, ticketPrice);
    const platformTotal = ticket.organiserGets * tickets;
    const geigerTotal = onGeiger.organiserGets * tickets;
    const perTicketGain = onGeiger.organiserGets - ticket.organiserGets;
    // Both monthly plans count, so Luma Plus's subscription is compared against Geiger's.
    const planGap = geiger.monthly - (plan.monthly ?? 0);
    return {
      ticket,
      onGeiger,
      platformTotal,
      geigerTotal,
      feesTotal: (ticket.platformFee + ticket.processing) * tickets,
      gainAfterPlan: geigerTotal - platformTotal - planGap,
      breakEven: perTicketGain > 0 && planGap > 0 ? Math.ceil(planGap / perTicketGain) : null,
    };
  }, [plan, ticketPrice, passToBuyer, tickets, geiger]);

  const targetPrice = priceForTarget(plan, toNumber(target));

  return (
    <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
      <div className="grid content-start gap-5 rounded-xl border border-border bg-background p-5">
        {platform.plans.length > 1 ? (
          <Field id="fee-plan" label={`${platform.name} plan`}>
            <Select value={planId} onValueChange={setPlanId}>
              <SelectTrigger id="fee-plan" className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {platform.plans.map((entry) => <SelectItem key={entry.id} value={entry.id}>{entry.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
        ) : null}
        <div className="grid grid-cols-2 gap-4">
          <Field id="fee-price" label="Ticket price (USD)">
            <Input id="fee-price" type="number" inputMode="decimal" min="0" step="0.01" value={price} onChange={(event) => setPrice(event.target.value)} />
          </Field>
          <Field id="fee-quantity" label="Tickets sold">
            <Input id="fee-quantity" type="number" inputMode="numeric" min="0" step="1" value={quantity} onChange={(event) => setQuantity(event.target.value)} />
          </Field>
        </div>
        {plan.canPassToBuyer ? (
          <div className="flex items-center justify-between gap-4 rounded-lg border border-border px-4 py-3">
            <Label htmlFor="fee-pass" className="text-sm">Pass fees on to buyers</Label>
            <Switch id="fee-pass" checked={pass} onCheckedChange={setPass} />
          </div>
        ) : (
          <p className="rounded-lg border border-border px-4 py-3 text-xs leading-5 text-muted-foreground">{platform.name} doesn&apos;t let you add fees on top here, so they come out of the ticket price.</p>
        )}
        <div className="border-t border-border pt-5">
          <Field id="fee-target" label="I want to receive per ticket (USD)" hint={targetPrice ? `Charge ${formatMoney(targetPrice)} on ${plan.label} to keep ${formatMoney(toNumber(target))} after fees.` : null}>
            <Input id="fee-target" type="number" inputMode="decimal" min="0" step="0.01" value={target} onChange={(event) => setTarget(event.target.value)} />
          </Field>
        </div>
        {plan.estimate ? <p className="text-xs leading-5 text-muted-foreground">{platform.name} doesn&apos;t publish this fee, so this plan uses the best public estimate. See the notes below.</p> : null}
      </div>

      <div className="grid gap-4">
        <div className="rounded-xl border border-border bg-background p-5">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Per ticket on {plan.label}</p>
          <div className="mt-3 divide-y divide-border">
            <Row label="Ticket price" value={formatMoney(result.ticket.price)} />
            <Row label={`${platform.name} fee`} value={`−${formatMoney(result.ticket.platformFee)}${passToBuyer ? " (paid by buyer)" : ""}`} muted />
            <Row label={plan.processing ? "Card processing" : "Card processing (included in fee)"} value={`−${formatMoney(result.ticket.processing)}${passToBuyer ? " (paid by buyer)" : ""}`} muted />
            <Row label="Buyer pays" value={formatMoney(result.ticket.buyerPays)} />
            <Row label="You receive" value={formatMoney(result.ticket.organiserGets)} strong />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-surface-subtle p-4">
              <p className="text-xs text-muted-foreground">Fees on {tickets.toLocaleString("en-US")} tickets</p>
              <p className="mt-1 text-xl font-semibold tabular-nums">{formatMoney(result.feesTotal)}</p>
            </div>
            <div className="rounded-lg bg-surface-subtle p-4">
              <p className="text-xs text-muted-foreground">You receive in total</p>
              <p className="mt-1 text-xl font-semibold tabular-nums">{formatMoney(result.platformTotal)}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface-subtle p-5">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">The same sale on {geiger.name}</p>
          <div className="mt-3 divide-y divide-border">
            <Row label="Geiger platform fee" value={`${formatMoney(0)} (none)`} muted />
            <Row label="Stripe card fee (2.9% + 30¢), charged by Stripe" value={`−${formatMoney(result.onGeiger.processing)}`} muted />
            <Row label="You receive per ticket" value={formatMoney(result.onGeiger.organiserGets)} />
            <Row label={`You receive on ${tickets.toLocaleString("en-US")} tickets`} value={formatMoney(result.geigerTotal)} strong />
          </div>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            {passToBuyer && result.ticket.buyerPays > result.onGeiger.buyerPays
              ? `Here your buyers pay ${formatMoney(result.ticket.buyerPays)} a ticket. On Geiger they pay the ${formatMoney(result.onGeiger.buyerPays)} ticket price with no fee added, ${formatMoney(result.ticket.buyerPays - result.onGeiger.buyerPays)} less each, and you keep ${formatMoney(result.onGeiger.organiserGets)} after Stripe's card fee. Geiger itself takes nothing per ticket.`
              : result.gainAfterPlan > 0
              ? `Counting the ${formatMoney(geiger.monthly)} Geiger Basic plan${plan.monthly ? ` and the ${formatMoney(plan.monthly)} ${platform.name} plan` : ""}, that's ${formatMoney(result.gainAfterPlan)} more than ${plan.label} for this sale.`
              : result.breakEven
                ? `At this volume ${plan.label} costs less once the ${formatMoney(geiger.monthly)} Geiger plan is counted. Geiger comes out ahead from about ${result.breakEven.toLocaleString("en-US")} tickets a month at this price.`
                : `On this plan ${platform.name} takes no more per ticket than Stripe alone, so the difference comes down to the monthly plan prices.`}
          </p>
          <Link href={geiger.href} className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-foreground underline-offset-4 hover:underline">
            How Geiger Events ticketing works <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// Every platform's default plan side by side for one ticket price, sorted by what the organiser keeps.
export function FeeComparisonTable({ platforms, geiger }) {
  const [price, setPrice] = useState("25");
  const [quantity, setQuantity] = useState("100");
  const ticketPrice = toNumber(price);
  const tickets = Math.round(toNumber(quantity));

  const rows = useMemo(() => {
    const entries = platforms.flatMap((platform) =>
      platform.plans.map((plan) => ({ key: `${platform.id}-${plan.id}`, name: plan.label, href: `/tools/${platform.id}-fee-calculator`, plan, estimate: plan.estimate, monthly: plan.monthly ?? 0 }))
    );
    entries.push({ key: "geiger", name: geiger.name, href: geiger.href, plan: geiger.plan, monthly: geiger.monthly, isGeiger: true });
    return entries
      .map((entry) => {
        const ticket = ticketBreakdown(entry.plan, ticketPrice);
        return { ...entry, ticket, total: ticket.organiserGets * tickets - entry.monthly };
      })
      .sort((a, b) => b.total - a.total);
  }, [platforms, geiger, ticketPrice, tickets]);

  return (
    <div className="grid gap-4">
      <div className="grid max-w-md grid-cols-2 gap-4">
        <Field id="hub-price" label="Ticket price (USD)">
          <Input id="hub-price" type="number" inputMode="decimal" min="0" step="0.01" value={price} onChange={(event) => setPrice(event.target.value)} />
        </Field>
        <Field id="hub-quantity" label="Tickets sold a month">
          <Input id="hub-quantity" type="number" inputMode="numeric" min="0" step="1" value={quantity} onChange={(event) => setQuantity(event.target.value)} />
        </Field>
      </div>
      <div className="overflow-x-auto rounded-xl border border-border bg-background">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground">
              <th className="px-4 py-3 font-medium">Platform and plan</th>
              <th className="px-4 py-3 text-right font-medium">Fees per ticket</th>
              <th className="px-4 py-3 text-right font-medium">You receive per ticket</th>
              <th className="px-4 py-3 text-right font-medium">Monthly plan</th>
              <th className="px-4 py-3 text-right font-medium">You keep in total</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key} className={`border-b border-border last:border-0 ${row.isGeiger ? "bg-surface-subtle" : ""}`}>
                <td className="px-4 py-3">
                  <Link href={row.href} className="font-medium text-foreground underline-offset-4 hover:underline">{row.name}</Link>
                  {row.estimate ? <span className="ml-2 text-xs text-muted-foreground">estimate</span> : null}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                  {formatMoney(row.ticket.platformFee + row.ticket.processing)}
                  {row.isGeiger ? <span className="block text-[11px]">Stripe fee only</span> : null}
                </td>
                <td className="px-4 py-3 text-right tabular-nums">{formatMoney(row.ticket.organiserGets)}</td>
                <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">{row.monthly ? formatMoney(row.monthly) : "—"}</td>
                <td className="px-4 py-3 text-right font-semibold tabular-nums">{formatMoney(row.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs leading-5 text-muted-foreground">Organiser absorbs all fees. Geiger Events takes no platform fee; its row is Stripe&apos;s card processing fee only. Standard US card rates; taxes, international cards and currency conversion are excluded. Monthly plan prices are subtracted once from the total.</p>
    </div>
  );
}
