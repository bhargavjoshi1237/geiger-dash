"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Users,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Check,
  Search,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/app/login/actions";
import {
  createOrganization,
  findOrganization,
  joinOrganization,
  inviteTeammates,
} from "./actions";

const TEAM_SIZES = ["Just me", "2–10", "11–50", "51–200", "200+"];

function slugPreview(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

// Small stepped progress indicator (the bar Linear shows up top).
function StepDots({ count, active }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "h-1 rounded-full transition-all duration-300",
            i === active ? "w-6 bg-foreground" : "w-3 bg-surface-strong"
          )}
        />
      ))}
    </div>
  );
}

function PathCard({ icon: Icon, title, description, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "group flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-all",
        selected
          ? "border-foreground/40 bg-surface-card ring-1 ring-foreground/20"
          : "border-border bg-surface-card/50 hover:border-border-strong hover:bg-surface-card"
      )}
    >
      <span
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition-colors",
          selected
            ? "border-foreground/30 bg-foreground/10 text-foreground"
            : "border-border bg-surface-subtle/50 text-muted-foreground group-hover:text-foreground"
        )}
      >
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium text-foreground">{title}</span>
        <span className="mt-0.5 block text-xs text-muted-foreground">{description}</span>
      </span>
      <span
        className={cn(
          "mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all",
          selected ? "border-foreground bg-foreground" : "border-border-strong"
        )}
      >
        {selected && <Check className="h-3 w-3 text-background" />}
      </span>
    </button>
  );
}

export function OnboardingWizard({ email }) {
  const router = useRouter();

  // step: "choose" | "create" | "join" | "invite"
  const [step, setStep] = useState("choose");
  const [path, setPath] = useState("create");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [teamSize, setTeamSize] = useState("");

  const [joinQuery, setJoinQuery] = useState("");
  const [found, setFound] = useState(null);

  const [created, setCreated] = useState(null); // { id, name } after org creation
  const [inviteEmails, setInviteEmails] = useState("");

  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(null); // { label } once onboarding completes

  const nameRef = useRef(null);
  const joinRef = useRef(null);

  const stepCount = path === "create" ? 3 : 2;
  const activeIndex = step === "choose" ? 0 : step === "invite" ? 2 : 1;

  useEffect(() => {
    if (step === "create") nameRef.current?.focus();
    if (step === "join") joinRef.current?.focus();
  }, [step]);

  function goToPath() {
    setError("");
    setStep(path);
  }

  function back() {
    setError("");
    setFound(null);
    setStep("choose");
  }

  function finish(label) {
    setDone({ label });
    // Let the success state paint, then hand off to the dashboard.
    void Promise.resolve().then(() => {
      setTimeout(() => {
        router.push("/org");
        router.refresh();
      }, 650);
    });
  }

  async function handleCreate() {
    if (pending) return;
    if (!name.trim()) {
      setError("Please enter an organization name.");
      nameRef.current?.focus();
      return;
    }
    setPending(true);
    setError("");
    const result = await createOrganization({ name, description, teamSize });
    if (!result?.ok) {
      setPending(false);
      setError(result?.error || "Something went wrong. Please try again.");
      return;
    }
    // Org exists — move to the (skippable) invite step.
    setCreated({ id: result.organizationId, name: name.trim() });
    setPending(false);
    setError("");
    setStep("invite");
  }

  async function handleInvite(skip) {
    if (pending) return;
    const emails = skip
      ? []
      : inviteEmails.split(/[\s,;]+/).map((e) => e.trim()).filter(Boolean);

    if (emails.length === 0) {
      finish(created?.name || "your organization");
      return;
    }

    setPending(true);
    setError("");
    const result = await inviteTeammates({
      organizationId: created?.id,
      organizationName: created?.name,
      emails,
    });
    if (!result?.ok) {
      setPending(false);
      setError(result?.error || "Could not send invites. You can invite people later from settings.");
      return;
    }
    finish(created?.name || "your organization");
  }

  async function handleFind() {
    if (pending) return;
    if (!joinQuery.trim()) {
      setError("Enter an organization ID or workspace URL.");
      return;
    }
    setPending(true);
    setError("");
    setFound(null);
    const result = await findOrganization(joinQuery);
    setPending(false);
    if (!result?.ok) {
      setError(result?.error || "Could not find that organization.");
      return;
    }
    setFound(result.organization);
  }

  async function handleJoin() {
    if (pending || !found) return;
    setPending(true);
    setError("");
    const result = await joinOrganization(found.id);
    if (!result?.ok) {
      setPending(false);
      setError(result?.error || "Could not join that organization.");
      return;
    }
    finish(found.name || "your organization");
  }

  // ----- success splash -----
  if (done) {
    return (
      <Shell email={email}>
        <div className="flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-300">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-foreground/10 ring-1 ring-foreground/20">
            <Check className="h-7 w-7 text-foreground" />
          </span>
          <h1 className="mt-6 text-xl font-medium text-foreground">You&apos;re all set</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Taking you to <span className="text-foreground">{done.label}</span>…
          </p>
          <Loader2 className="mt-6 h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      </Shell>
    );
  }

  return (
    <Shell email={email}>
      <div className="mb-8 flex flex-col items-center gap-4">
        <StepDots count={stepCount} active={activeIndex} />
      </div>

      {step === "choose" && (
        <div
          key="choose"
          className="animate-in fade-in slide-in-from-bottom-2 duration-300"
          onKeyDown={(e) => e.key === "Enter" && goToPath()}
        >
          <Heading
            title="Welcome to Geiger"
            subtitle="Set up a workspace to bring your team's work together."
          />
          <div className="mt-8 space-y-3">
            <PathCard
              icon={Building2}
              title="Create a new organization"
              description="Start fresh and invite your team."
              selected={path === "create"}
              onSelect={() => setPath("create")}
            />
            <PathCard
              icon={Users}
              title="Join an existing organization"
              description="Use an organization ID or workspace URL."
              selected={path === "join"}
              onSelect={() => setPath("join")}
            />
          </div>
          <PrimaryButton className="mt-8" onClick={goToPath}>
            Continue
            <ArrowRight className="h-4 w-4" />
          </PrimaryButton>
        </div>
      )}

      {step === "create" && (
        <div
          key="create"
          className="animate-in fade-in slide-in-from-right-2 duration-300"
        >
          <Heading
            title="Create your organization"
            subtitle="This is the home for your team across the Geiger suite."
          />
          <div className="mt-8 space-y-5 text-left">
            <Field label="Organization name">
              <TextInput
                ref={nameRef}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Acme Inc."
                maxLength={60}
              />
              <p className="mt-2 text-xs text-tertiary">
                geiger.app/
                <span className="text-muted-foreground">
                  {slugPreview(name) || "your-org"}
                </span>
              </p>
            </Field>
            <Field label="Description" optional>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What does your team do?"
                rows={3}
                className="flex w-full resize-none rounded-md border border-border bg-surface-card px-3 py-2 text-sm text-foreground placeholder:text-tertiary outline-none transition-colors focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              />
            </Field>
            <Field label="How many people will use this?" optional>
              <div className="flex flex-wrap gap-2">
                {TEAM_SIZES.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setTeamSize((cur) => (cur === size ? "" : size))}
                    className={cn(
                      "rounded-md border px-3 py-1.5 text-sm transition-colors",
                      teamSize === size
                        ? "border-foreground/40 bg-foreground/10 text-foreground"
                        : "border-border bg-surface-card text-muted-foreground hover:border-border-strong hover:text-foreground"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </Field>
          </div>

          <ErrorNote error={error} />

          <div className="mt-8 flex items-center gap-3">
            <BackButton onClick={back} disabled={pending} />
            <PrimaryButton onClick={handleCreate} disabled={pending} className="flex-1">
              {pending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating…
                </>
              ) : (
                <>
                  Create organization
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </PrimaryButton>
          </div>
        </div>
      )}

      {step === "join" && (
        <div
          key="join"
          className="animate-in fade-in slide-in-from-right-2 duration-300"
          onKeyDown={(e) => e.key === "Enter" && (found ? handleJoin() : handleFind())}
        >
          <Heading
            title="Join an organization"
            subtitle="Paste the organization ID or workspace URL your team shared."
          />
          <div className="mt-8 space-y-5 text-left">
            <Field label="Organization ID or URL">
              <div className="flex gap-2">
                <TextInput
                  ref={joinRef}
                  value={joinQuery}
                  onChange={(e) => {
                    setJoinQuery(e.target.value);
                    setFound(null);
                  }}
                  placeholder="acme  or  3f2a…-…"
                />
                <button
                  type="button"
                  onClick={handleFind}
                  disabled={pending}
                  aria-label="Find organization"
                  className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md border border-border bg-surface-card px-3 text-sm font-medium text-foreground transition-colors hover:bg-surface-hover disabled:opacity-50"
                >
                  {pending && !found ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                  Find
                </button>
              </div>
            </Field>

            {found && (
              <div className="flex items-center gap-3 rounded-xl border border-foreground/30 bg-surface-card p-4 ring-1 ring-foreground/10 animate-in fade-in zoom-in-95 duration-200">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-foreground/10 text-sm font-semibold text-foreground">
                  {(found.name || "?").slice(0, 1).toUpperCase()}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-foreground">
                    {found.name || "Untitled organization"}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {found.memberCount} member{found.memberCount === 1 ? "" : "s"}
                  </span>
                </span>
                <Check className="h-4 w-4 text-foreground" />
              </div>
            )}
          </div>

          <ErrorNote error={error} />

          <div className="mt-8 flex items-center gap-3">
            <BackButton onClick={back} disabled={pending} />
            <PrimaryButton
              onClick={found ? handleJoin : handleFind}
              disabled={pending}
              className="flex-1"
            >
              {pending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {found ? "Joining…" : "Finding…"}
                </>
              ) : found ? (
                <>
                  Join {found.name}
                  <ArrowRight className="h-4 w-4" />
                </>
              ) : (
                <>
                  Find organization
                  <Search className="h-4 w-4" />
                </>
              )}
            </PrimaryButton>
          </div>
        </div>
      )}

      {step === "invite" && (
        <div
          key="invite"
          className="animate-in fade-in slide-in-from-right-2 duration-300"
        >
          <Heading
            title="Invite your team"
            subtitle={`Add people to ${created?.name || "your organization"}. You can always do this later.`}
          />
          <div className="mt-8 space-y-5 text-left">
            <Field label="Email addresses" optional>
              <textarea
                value={inviteEmails}
                onChange={(e) => setInviteEmails(e.target.value)}
                placeholder="anna@acme.com, sam@acme.com"
                rows={4}
                className="flex w-full resize-none rounded-md border border-border bg-surface-card px-3 py-2 text-sm text-foreground placeholder:text-tertiary outline-none transition-colors focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              />
              <p className="mt-2 text-xs text-tertiary">
                Separate addresses with commas, spaces, or new lines.
              </p>
            </Field>
          </div>

          <ErrorNote error={error} />

          <div className="mt-8 flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleInvite(true)}
              disabled={pending}
              className="inline-flex h-10 shrink-0 items-center justify-center rounded-md border border-border bg-surface-card px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground disabled:opacity-50"
            >
              Skip for now
            </button>
            <PrimaryButton onClick={() => handleInvite(false)} disabled={pending} className="flex-1">
              {pending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending…
                </>
              ) : (
                <>
                  Send invites
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </PrimaryButton>
          </div>
        </div>
      )}
    </Shell>
  );
}

// ----- layout + primitives -----

function Shell({ email, children }) {
  return (
    <div className="geiger-flow-palette relative flex min-h-screen w-full flex-col bg-background text-foreground">
      <header className="flex items-center justify-between px-6 py-5">
        <span className="text-sm font-medium tracking-tight text-foreground">Geiger</span>
        {email && (
          <form action={logout}>
            <span className="mr-3 text-xs text-tertiary">{email}</span>
            <button
              type="submit"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Sign out
            </button>
          </form>
        )}
      </header>
      <main className="flex flex-1 items-center justify-center px-4 pb-16">
        <div className="w-full max-w-[420px]">{children}</div>
      </main>
    </div>
  );
}

function Heading({ title, subtitle }) {
  return (
    <div className="text-center">
      <h1 className="text-2xl font-medium tracking-tight text-foreground">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}

function Field({ label, optional, children }) {
  return (
    <div className="space-y-2">
      <label className="ml-0.5 flex items-center gap-2 text-xs font-medium text-muted-foreground">
        {label}
        {optional && <span className="text-tertiary">optional</span>}
      </label>
      {children}
    </div>
  );
}

const TextInput = ({ ref, className, ...props }) => (
  <input
    ref={ref}
    className={cn(
      "flex h-9 w-full rounded-md border border-border bg-surface-card px-3 py-1 text-sm text-foreground placeholder:text-tertiary outline-none transition-colors focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
      className
    )}
    {...props}
  />
);

function PrimaryButton({ className, children, ...props }) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-60",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

function BackButton({ onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label="Go back"
      className="inline-flex h-10 shrink-0 items-center justify-center rounded-md border border-border bg-surface-card px-3 text-foreground transition-colors hover:bg-surface-hover disabled:opacity-50"
    >
      <ArrowLeft className="h-4 w-4" />
    </button>
  );
}

function ErrorNote({ error }) {
  if (!error) return null;
  return (
    <div className="mt-5 flex items-center gap-2 rounded-md border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400 animate-in fade-in duration-200">
      <AlertCircle className="h-4 w-4 shrink-0" />
      {error}
    </div>
  );
}
