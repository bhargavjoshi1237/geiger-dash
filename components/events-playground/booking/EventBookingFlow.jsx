"use client";

import { useMemo, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Button, Input, Label } from "@geiger/ui";
import { cn } from "@/lib/utils";
import EventPage from "./EventPage";
import SeatMap from "./SeatMap";
import TicketQr from "./TicketQr";
import {
  DEMO_EVENT,
  SERVICE_FEE_RATE,
  TICKET_TIERS,
  currency,
} from "./event-booking-data";

const LABEL = "text-[10px] font-medium uppercase tracking-[0.16em] text-text-tertiary";

// The tear line between the booking panel and its stub, notched at both edges.
function Perforation() {
  return (
    <div className="relative -mx-5 my-4">
      <div className="border-t border-dashed border-border" />
      <span className="absolute -left-1.5 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-background" />
      <span className="absolute -right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-background" />
    </div>
  );
}

export default function EventBookingFlow() {
  const [stage, setStage] = useState("tickets");
  const [tierId, setTierId] = useState("priority");
  const [quantity, setQuantity] = useState(2);
  const [seats, setSeats] = useState([]);
  const [name, setName] = useState("Aanya Raghavan");
  const [email, setEmail] = useState("aanya@northwind.co");

  const tier = TICKET_TIERS.find((item) => item.id === tierId) ?? TICKET_TIERS[0];
  const maxQuantity = Math.min(6, tier.remaining ?? 6);
  // Clamp on read so switching to a scarcer tier can't strand an over-large order.
  const count = Math.min(quantity, maxQuantity);
  const reserved = Boolean(tier.zone);

  const totals = useMemo(() => {
    const subtotal = tier.price * count;
    const fee = Math.round(subtotal * SERVICE_FEE_RATE * 100) / 100;
    return { subtotal, fee, total: subtotal + fee };
  }, [tier.price, count]);

  // Seats belong to a tier's zone and its quantity, so any change to either
  // clears the picks rather than carrying invalid ones forward.
  const chooseTier = (id) => {
    setTierId(id);
    setSeats([]);
  };

  const changeQuantity = (next) => {
    setQuantity(next);
    setSeats([]);
  };

  const toggleSeat = (id) => {
    setSeats((current) =>
      current.includes(id)
        ? current.filter((seat) => seat !== id)
        : current.length >= count
          ? current
          : [...current, id],
    );
  };

  const steps = reserved
    ? ["tickets", "seats", "details", "payment"]
    : ["tickets", "details", "payment"];

  const seatsReady = !reserved || seats.length === count;

  const advance = {
    tickets: () => setStage(reserved ? "seats" : "details"),
    seats: () => setStage("details"),
    details: () => setStage("payment"),
    payment: () => setStage("done"),
  };

  const ctaLabel = {
    tickets: reserved ? "Choose seats" : "Continue",
    seats: seatsReady ? "Continue" : `Pick ${count - seats.length} more`,
    details: "Continue",
    payment: `Pay ${currency(totals.total)}`,
  };

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-2">
        <span className="truncate text-[11px] text-text-tertiary">
          geiger.events/e/{DEMO_EVENT.slug}
        </span>
        <span className={cn(LABEL, "shrink-0")}>Public page</span>
      </div>

      <div className="grid min-h-0 flex-1 overflow-y-auto lg:grid-cols-[1.25fr_1fr] lg:overflow-hidden">
        <EventPage />

        <div className="flex min-w-0 flex-col border-border bg-surface-card px-5 py-5 lg:border-l">
          <div className="flex items-baseline justify-between gap-3">
            <p className={LABEL}>{stage === "done" ? "Your ticket" : "Admission"}</p>
            {stage === "done" ? null : (
              <p className="truncate text-[11px] capitalize text-text-tertiary">
                {steps.map((id, index) => (
                  <span key={id}>
                    {index > 0 ? <span className="px-1 text-border-strong">/</span> : null}
                    <span className={id === stage ? "text-foreground" : undefined}>{id}</span>
                  </span>
                ))}
              </p>
            )}
          </div>

          <div className="mt-5 min-h-0 flex-1 lg:overflow-y-auto">
            {stage === "tickets" ? (
              <div>
                {TICKET_TIERS.map((item) => {
                  const selected = item.id === tier.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => chooseTier(item.id)}
                      aria-pressed={selected}
                      className="flex w-full items-center gap-3 border-b border-border py-3 text-left last:border-0"
                    >
                      <span
                        className={cn(
                          "h-8 w-0.5 shrink-0 rounded-full transition-colors",
                          selected ? "bg-rose-400" : "bg-transparent",
                        )}
                      />
                      <span className="min-w-0 flex-1">
                        <span
                          className={cn(
                            "block truncate text-sm transition-colors",
                            selected ? "text-foreground" : "text-text-secondary",
                          )}
                        >
                          {item.name}
                        </span>
                        <span className="block truncate text-[11px] text-text-tertiary">
                          {item.perk}
                          {item.remaining !== null && item.remaining <= 20 ? (
                            <span className="text-amber-300"> · {item.remaining} left</span>
                          ) : null}
                        </span>
                      </span>
                      <span
                        className={cn(
                          "shrink-0 text-sm tabular-nums transition-colors",
                          selected ? "text-foreground" : "text-text-secondary",
                        )}
                      >
                        {currency(item.price)}
                      </span>
                    </button>
                  );
                })}

                <div className="mt-4 flex items-center justify-between">
                  <p className={LABEL}>Quantity</p>
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      size="icon-xs"
                      variant="ghost"
                      aria-label="Remove one ticket"
                      disabled={count <= 1}
                      onClick={() => changeQuantity(Math.max(1, count - 1))}
                    >
                      <Minus />
                    </Button>
                    <span className="w-4 text-center text-sm text-foreground tabular-nums">
                      {count}
                    </span>
                    <Button
                      type="button"
                      size="icon-xs"
                      variant="ghost"
                      aria-label="Add one ticket"
                      disabled={count >= maxQuantity}
                      onClick={() => changeQuantity(Math.min(maxQuantity, count + 1))}
                    >
                      <Plus />
                    </Button>
                  </div>
                </div>
              </div>
            ) : null}

            {stage === "seats" ? (
              <div>
                <BackLink onClick={() => setStage("tickets")}>Tickets</BackLink>
                <div className="mt-3">
                  <SeatMap
                    zone={tier.zone}
                    capacity={count}
                    selected={seats}
                    onToggle={toggleSeat}
                  />
                </div>
                <p className="mt-4 text-[11px] text-text-tertiary">
                  {seats.length ? `Row ${seats.join(", ")}` : `Pick ${count} seats`}
                </p>
              </div>
            ) : null}

            {stage === "details" ? (
              <div>
                <BackLink onClick={() => setStage(reserved ? "seats" : "tickets")}>
                  {reserved ? "Seats" : "Tickets"}
                </BackLink>
                <div className="mt-4 space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="booking-name" className={LABEL}>
                      Name
                    </Label>
                    <Input
                      id="booking-name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      className="h-9 border-0 border-b border-border bg-transparent px-0 text-sm focus-visible:ring-0"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="booking-email" className={LABEL}>
                      Email
                    </Label>
                    <Input
                      id="booking-email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="h-9 border-0 border-b border-border bg-transparent px-0 text-sm focus-visible:ring-0"
                    />
                    <p className="text-[11px] text-text-tertiary">The passes go here.</p>
                  </div>
                </div>
              </div>
            ) : null}

            {stage === "payment" ? (
              <div>
                <BackLink onClick={() => setStage("details")}>Details</BackLink>
                <dl className="mt-4">
                  <Row label="Card" value="4242 4242 4242 4242" />
                  <Row label="Expires" value="06 / 29" />
                  <Row label="Security code" value="•••" />
                </dl>
                <p className="mt-4 text-[11px] text-text-tertiary">
                  Test card. Nothing is charged.
                </p>
              </div>
            ) : null}

            {stage === "done" ? (
              <div>
                <p className="text-2xl font-semibold tracking-tight text-foreground">
                  You&apos;re in.
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Sent to <span className="text-foreground">{email}</span>. Show the code at
                  the door.
                </p>
                <dl className="mt-5">
                  <Row label="Admits" value={`${count} × ${tier.name}`} />
                  {seats.length ? <Row label="Seats" value={seats.join(", ")} /> : null}
                  <Row label="Entry" value={`${DEMO_EVENT.dateLabel}, ${DEMO_EVENT.doors}`} />
                </dl>
              </div>
            ) : null}
          </div>

          <Perforation />

          {stage === "done" ? (
            <div>
              <div className="flex items-center gap-4">
                <TicketQr size={72} />
                <div className="min-w-0">
                  <p className={LABEL}>Order</p>
                  <p className="mt-1 text-sm text-foreground tabular-nums">GE-4417-2026</p>
                  <p className="text-sm text-muted-foreground tabular-nums">
                    Paid {currency(totals.total)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSeats([]);
                  setStage("tickets");
                }}
                className="mt-4 text-[11px] text-text-tertiary underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                Book another
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-baseline justify-between">
                <p className={LABEL}>Total</p>
                <p className="text-xl font-semibold text-foreground tabular-nums">
                  {currency(totals.total)}
                </p>
              </div>
              <p className="mt-1 text-right text-[11px] text-text-tertiary tabular-nums">
                {count} × {currency(tier.price)} plus {currency(totals.fee)} fee
              </p>
              <Button
                type="button"
                className="mt-4 w-full"
                disabled={stage === "seats" && !seatsReady}
                onClick={advance[stage]}
              >
                {ctaLabel[stage]}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BackLink({ onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-[11px] text-text-tertiary underline-offset-4 transition-colors hover:text-foreground hover:underline"
    >
      ← {children}
    </button>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border py-2.5 last:border-0">
      <dt className={cn(LABEL, "shrink-0")}>{label}</dt>
      <dd className="min-w-0 truncate text-sm text-foreground tabular-nums">{value}</dd>
    </div>
  );
}
