"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, Loader2 } from "lucide-react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@geiger/ui";
import { BETA_APPS } from "@/lib/pricing/beta";
import { PRODUCT_ICONS, FallbackProductIcon } from "@/lib/pricing/product-icons";
import { joinBetaAction } from "@/app/pricing/beta-actions";

const LOGIN_URL = `/login?next=${encodeURIComponent("/pricing")}`;

const ERRORS = {
  no_apps: "Pick at least one app.",
  invalid_org: "You don't have access to that organization.",
  already_subscribed: "This organization already has a plan, so it can't join the beta.",
};

// An org already on the beta reopens with the apps it has.
const betaAppsFor = (entitlements) => (entitlements?.isBeta ? entitlements.unlockedProducts : []);

// The pricing page's beta strip; "Join the beta" opens an app picker that puts the org on the free Beta Tester plan.
export function BetaSignup({ isAuthed = false, organizations = [], entitlementsByOrg = {} }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [orgId, setOrgId] = useState(organizations[0]?.id || "");
  const [apps, setApps] = useState(() => betaAppsFor(entitlementsByOrg[organizations[0]?.id]));
  const [joining, setJoining] = useState(false);

  const entitlements = entitlementsByOrg[orgId] || null;
  const isBeta = Boolean(entitlements?.isBeta);
  const hasPaidPlan = Boolean(entitlements?.hasSubscription) && !isBeta;
  const allPicked = apps.length === BETA_APPS.length;

  function openDialog() {
    if (!isAuthed) {
      router.push(LOGIN_URL);
      return;
    }
    if (!organizations.length) {
      toast.error("Create an organization first to join the beta.");
      router.push("/org");
      return;
    }
    setOpen(true);
  }

  function selectOrg(id) {
    setOrgId(id);
    setApps(betaAppsFor(entitlementsByOrg[id]));
  }

  const toggleApp = (id) =>
    setApps((current) => (current.includes(id) ? current.filter((app) => app !== id) : [...current, id]));

  async function handleSubmit(event) {
    event.preventDefault();
    if (!apps.length) {
      toast.error(ERRORS.no_apps);
      return;
    }
    setJoining(true);
    try {
      const result = await joinBetaAction({ organizationId: orgId, apps });
      if (result?.ok) {
        toast.success(isBeta ? "Beta apps updated." : "You're in the beta. Your apps are unlocked.");
        setOpen(false);
        router.push(`/org/${orgId}`);
        return;
      }
      if (result?.error === "auth") {
        router.push(LOGIN_URL);
        return;
      }
      toast.error(ERRORS[result?.error] ?? "Couldn't join the beta. Please try again.");
    } catch {
      toast.error("Couldn't join the beta. Please try again.");
    } finally {
      setJoining(false);
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
          onClick={openDialog}
          className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-sm text-sm font-semibold transition-colors hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Join the beta
          <ArrowRight className="size-4" />
        </button>
      </div>

      <Dialog open={open} onOpenChange={(next) => !joining && setOpen(next)}>
        <DialogContent className="sm:max-w-xl">
          <form onSubmit={handleSubmit} className="grid gap-5">
            <DialogHeader>
              <DialogTitle>Join the Geiger beta</DialogTitle>
              <DialogDescription>
                Pick the apps you want. They&apos;re free while the beta runs, with 1 project, 3 people, 5 GB storage
                and 50 AI credits.
              </DialogDescription>
            </DialogHeader>

            {organizations.length > 1 ? (
              <Field label="Organization" htmlFor="beta-org">
                <Select value={orgId} onValueChange={selectOrg}>
                  <SelectTrigger id="beta-org" className="w-full">
                    <SelectValue placeholder="Select organization" />
                  </SelectTrigger>
                  <SelectContent>
                    {organizations.map((org) => (
                      <SelectItem key={org.id} value={org.id}>
                        {org.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            ) : null}

            {hasPaidPlan ? (
              <p className="rounded-lg border border-border bg-surface-subtle px-3 py-2 text-xs text-muted-foreground">
                {entitlements.planName} is already active on this organization, so it can&apos;t join the beta.
              </p>
            ) : (
              <div className="grid gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Apps</span>
                  <button
                    type="button"
                    onClick={() => setApps(allPicked ? [] : BETA_APPS.map((app) => app.id))}
                    className="rounded-sm text-xs font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {allPicked ? "Clear all" : "Select all"}
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {BETA_APPS.map((app) => {
                    const on = apps.includes(app.id);
                    const Icon = PRODUCT_ICONS[app.id] ?? FallbackProductIcon;
                    return (
                      <button
                        key={app.id}
                        type="button"
                        aria-pressed={on}
                        onClick={() => toggleApp(app.id)}
                        className={cn(
                          "flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          on
                            ? "border-foreground bg-surface-active"
                            : "border-border bg-surface-card hover:border-border-strong hover:bg-surface-hover",
                        )}
                      >
                        <span
                          className={cn(
                            "flex size-8 shrink-0 items-center justify-center rounded-md border",
                            on ? "border-border-strong bg-background text-foreground" : "border-border text-muted-foreground",
                          )}
                        >
                          <Icon className="size-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-medium">{app.name}</span>
                          <span className="block truncate text-xs text-muted-foreground">{app.detail}</span>
                        </span>
                        <span
                          className={cn(
                            "flex size-4 shrink-0 items-center justify-center rounded-full border",
                            on ? "border-foreground bg-foreground text-background" : "border-border-strong",
                          )}
                        >
                          {on ? <Check className="size-3" /> : null}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <DialogFooter className="items-center sm:justify-between">
              <span className="text-xs text-muted-foreground">
                {hasPaidPlan ? "" : `${apps.length} of ${BETA_APPS.length} apps selected`}
              </span>
              <div className="flex gap-2">
                <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={joining}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={joining || hasPaidPlan || !apps.length}
                  className="bg-primary text-primary-foreground"
                >
                  {joining ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Joining…
                    </>
                  ) : isBeta ? (
                    "Update apps"
                  ) : (
                    "Join beta"
                  )}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
