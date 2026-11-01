"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@geiger/ui";
import { CONTACT_EMAIL } from "@/lib/contact";
import { trackContactSubmitted } from "@/lib/analytics/funnel";
import { submitSalesRequest } from "../actions";
import { ContactError, ContactSent, CONTACT_LINK, HoneypotField } from "../contact-split";

const TEAM_SIZES = ["Just me", "2–10", "11–50", "51–200", "201–1,000", "1,000+"];
const LABEL = "font-normal text-muted-foreground";
const INPUT = "border-border bg-surface-card";

export default function SalesForm({ identity }) {
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [teamSize, setTeamSize] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setPending(true);
    setError(null);

    const formData = new FormData(event.target);
    formData.set("teamSize", teamSize);

    try {
      const result = await submitSalesRequest(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        trackContactSubmitted();
        setSuccess(true);
      }
    } catch {
      setError(`Something went wrong. Please try again or email us at ${CONTACT_EMAIL}.`);
    } finally {
      setPending(false);
    }
  }

  if (success) return <ContactSent />;

  return (
    <form onSubmit={handleSubmit} className="relative mt-6 space-y-6">
      <HoneypotField />

      <div className="space-y-2">
        <Label htmlFor="fullName" className={LABEL}>Full name</Label>
        <Input id="fullName" name="fullName" defaultValue={identity?.name} required autoComplete="name" className={INPUT} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className={LABEL}>Work email</Label>
        <Input id="email" name="email" type="email" defaultValue={identity?.email} required autoComplete="email" className={INPUT} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="teamSize" className={LABEL}>Company size</Label>
        <Select value={teamSize} onValueChange={setTeamSize} required>
          <SelectTrigger id="teamSize">
            <SelectValue placeholder="Select size" />
          </SelectTrigger>
          <SelectContent>
            {TEAM_SIZES.map((size) => (
              <SelectItem key={size} value={size}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className={LABEL}>Tell us about your requirements</Label>
        <Textarea id="message" name="message" placeholder="I'm interested in Geiger for my team…" rows={4} required />
      </div>

      {error ? <ContactError>{error}</ContactError> : null}

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <Button type="submit" size="lg" className="rounded-full" disabled={pending || !teamSize}>
          {pending ? <Loader2 className="size-4 animate-spin" /> : null}
          Send message
        </Button>
        <p className="text-sm text-muted-foreground">
          You can also email us at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className={CONTACT_LINK}>
            {CONTACT_EMAIL}
          </a>
        </p>
      </div>
    </form>
  );
}
