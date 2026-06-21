"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { submitContactForm } from "./actions";

const TEAM_SIZES = [
  "Just me",
  "2–10",
  "11–50",
  "51–200",
  "201–1,000",
  "1,000+",
];

const INQUIRY_TYPES = [
  "Sales inquiry",
  "Enterprise pricing",
  "Technical question",
  "Partnership",
  "Other",
];

export default function ContactForm() {
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const [teamSize, setTeamSize] = useState("");
  const [inquiryType, setInquiryType] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setPending(true);
    setError(null);

    const formData = new FormData(e.target);
    formData.set("teamSize", teamSize);
    formData.set("inquiryType", inquiryType);

    try {
      const result = await submitContactForm(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess(true);
      }
    } catch {
      setError("Something went wrong. Please try again or email us directly.");
    } finally {
      setPending(false);
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-start gap-4 rounded-2xl border border-border bg-card p-8 sm:p-10">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle className="size-5 text-primary" />
        </div>
        <div>
          <p className="text-base font-semibold">Message received</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Thanks for reaching out. Someone from our team will get back to you
            within one business day.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full name</Label>
          <Input
            id="fullName"
            name="fullName"
            placeholder="Alex Johnson"
            required
            autoComplete="name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Work email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="alex@company.com"
            required
            autoComplete="email"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            name="company"
            placeholder="Acme Inc."
            required
            autoComplete="organization"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="teamSize">Team size</Label>
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
      </div>

      <div className="space-y-2">
        <Label htmlFor="inquiryType">What can we help with?</Label>
        <Select value={inquiryType} onValueChange={setInquiryType} required>
          <SelectTrigger id="inquiryType">
            <SelectValue placeholder="Select a topic" />
          </SelectTrigger>
          <SelectContent>
            {INQUIRY_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Tell us about your team, your use case, and anything else that would help us prepare."
          rows={5}
          required
        />
      </div>

      {error && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" disabled={pending || !teamSize || !inquiryType}>
        {pending ? "Sending…" : "Send message"}
        {!pending && <ArrowRight className="size-4" />}
      </Button>
    </form>
  );
}
