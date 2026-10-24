"use client";

import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Field,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@geiger/ui";
import { BETA_APPS, BETA_LIMITS, BETA_TEAM_SIZES } from "@/lib/pricing/beta";
import { requestBetaAccessAction } from "@/app/pricing/beta-actions";

const ERRORS = {
  missing_fields: "Add your name, email and what you'd use Geiger for.",
  invalid_email: "Enter a valid email address.",
};

// The pricing page's beta strip; "Join the beta" opens a request form that emails the team.
export function BetaSignup({ defaultName = "", defaultEmail = "" }) {
  const emptyDraft = { name: defaultName, email: defaultEmail, company: "", teamSize: "", apps: [], useCase: "", website: "" };
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(emptyDraft);
  const [sending, setSending] = useState(false);
  const set = (key) => (value) => setDraft((current) => ({ ...current, [key]: value }));

  const toggleApp = (id) =>
    setDraft((current) => ({
      ...current,
      apps: current.apps.includes(id) ? current.apps.filter((app) => app !== id) : [...current.apps, id],
    }));

  async function handleSubmit(event) {
    event.preventDefault();
    setSending(true);
    try {
      const result = await requestBetaAccessAction(draft);
      if (result?.ok) {
        toast.success("Request sent. We'll email you about beta access.");
        setDraft(emptyDraft);
        setOpen(false);
        return;
      }
      toast.error(ERRORS[result?.error] ?? "Couldn't send your request. Please try again.");
    } catch {
      toast.error("Couldn't send your request. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <div className="mt-6 flex flex-col gap-3 rounded-xl border border-dashed border-border-strong px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <p className="flex flex-col gap-1 text-sm sm:flex-row sm:items-baseline sm:gap-3.5">
          <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-muted-foreground">Beta tester</span>
          Every app for $0 while the beta runs — 1 project, 3 people, 5 GB storage, 50 AI credits.
        </p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-sm text-sm font-semibold transition-colors hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Join the beta
          <ArrowRight className="size-4" />
        </button>
      </div>

      <Dialog open={open} onOpenChange={(next) => !sending && setOpen(next)}>
        <DialogContent className="sm:max-w-lg">
          <form onSubmit={handleSubmit} className="grid gap-4">
            <DialogHeader>
              <DialogTitle>Join the Geiger beta</DialogTitle>
              <DialogDescription>
                Tell us a little about your team. We read every request and reply by email.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name" htmlFor="beta-name">
                <Input
                  id="beta-name"
                  value={draft.name}
                  onChange={(e) => set("name")(e.target.value)}
                  maxLength={BETA_LIMITS.name}
                  autoComplete="name"
                  required
                />
              </Field>
              <Field label="Email" htmlFor="beta-email">
                <Input
                  id="beta-email"
                  type="email"
                  value={draft.email}
                  onChange={(e) => set("email")(e.target.value)}
                  maxLength={BETA_LIMITS.email}
                  autoComplete="email"
                  required
                />
              </Field>
              <Field label="Company (optional)" htmlFor="beta-company">
                <Input
                  id="beta-company"
                  value={draft.company}
                  onChange={(e) => set("company")(e.target.value)}
                  maxLength={BETA_LIMITS.company}
                  autoComplete="organization"
                />
              </Field>
              <Field label="Team size (optional)" htmlFor="beta-team-size">
                <Select value={draft.teamSize} onValueChange={set("teamSize")}>
                  <SelectTrigger id="beta-team-size" className="w-full">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {BETA_TEAM_SIZES.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <Field label="Apps you'd use first (optional)">
              <div className="flex flex-wrap gap-1.5 pt-1">
                {BETA_APPS.map((app) => {
                  const on = draft.apps.includes(app.id);
                  return (
                    <button
                      key={app.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggleApp(app.id)}
                      className={cn(
                        "rounded-full border px-3 py-1 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        on
                          ? "border-foreground bg-surface-active text-foreground"
                          : "border-border bg-background text-muted-foreground hover:border-border-strong",
                      )}
                    >
                      {app.name}
                    </button>
                  );
                })}
              </div>
            </Field>

            <Field label="What would you use Geiger for?" htmlFor="beta-use-case">
              <Textarea
                id="beta-use-case"
                value={draft.useCase}
                onChange={(e) => set("useCase")(e.target.value)}
                maxLength={BETA_LIMITS.useCase}
                rows={4}
                placeholder="The work your team would run in Geiger, and what you use for it today."
                required
              />
            </Field>

            {/* Hidden from people; bots that fill it are dropped server-side. */}
            <input
              type="text"
              name="website"
              value={draft.website}
              onChange={(e) => set("website")(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="hidden"
            />

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={sending}>
                Cancel
              </Button>
              <Button type="submit" disabled={sending} className="bg-primary text-primary-foreground">
                {sending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Sending…
                  </>
                ) : (
                  "Send request"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
