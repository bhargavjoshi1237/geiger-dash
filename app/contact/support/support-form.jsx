"use client";

import { useRef, useState } from "react";
import { Loader2, Paperclip, X } from "lucide-react";
import { Button, Input, Label, Textarea } from "@geiger/ui";
import { CONTACT_EMAIL, MAX_ATTACHMENT_BYTES, MAX_ATTACHMENT_FILES, isAllowedAttachment } from "@/lib/contact";
import { trackContactSubmitted } from "@/lib/analytics/funnel";
import { submitSupportRequest } from "../actions";
import { ContactError, ContactSent, HoneypotField } from "../contact-split";

const LABEL = "font-normal text-muted-foreground";
const INPUT = "border-border bg-surface-card";

export default function SupportForm({ identity }) {
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [files, setFiles] = useState([]);
  const fileInput = useRef(null);

  function addFiles(event) {
    const next = [...files, ...event.target.files];
    event.target.value = "";

    if (!next.every(isAllowedAttachment)) {
      setError("Only images and videos can be attached.");
    } else if (next.length > MAX_ATTACHMENT_FILES) {
      setError(`Attach up to ${MAX_ATTACHMENT_FILES} files.`);
    } else if (next.reduce((total, file) => total + file.size, 0) > MAX_ATTACHMENT_BYTES) {
      setError("Attachments can be up to 4 MB in total.");
    } else {
      setError(null);
      setFiles(next);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setPending(true);
    setError(null);

    const formData = new FormData(event.target);
    files.forEach((file) => formData.append("attachments", file));

    try {
      const result = await submitSupportRequest(formData);
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
    <form onSubmit={handleSubmit} className="relative mt-6 space-y-4">
      <HoneypotField />

      {identity ? null : (
        <div className="grid gap-4 pb-2 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="fullName" className={LABEL}>Full name</Label>
            <Input id="fullName" name="fullName" required autoComplete="name" className={INPUT} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className={LABEL}>Email</Label>
            <Input id="email" name="email" type="email" required autoComplete="email" className={INPUT} />
          </div>
        </div>
      )}

      <Label htmlFor="message" className="block text-sm leading-6 font-normal text-muted-foreground">
        Please share any relevant information we may need to answer your question.
        {identity?.email ? ` We'll reply to ${identity.email}.` : ""}
      </Label>
      <Textarea id="message" name="message" placeholder="How do I…" rows={6} required />

      {files.length ? (
        <ul className="space-y-1.5">
          {files.map((file, index) => (
            <li key={`${file.name}-${index}`} className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
              <span className="truncate">{file.name}</span>
              <button
                type="button"
                onClick={() => setFiles(files.filter((_, fileIndex) => fileIndex !== index))}
                aria-label={`Remove ${file.name}`}
                className="shrink-0 rounded-sm transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <X className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {error ? <ContactError>{error}</ContactError> : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <input ref={fileInput} type="file" accept="image/*,video/*" multiple onChange={addFiles} className="hidden" />
        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          className="inline-flex items-center gap-2 rounded-sm text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <Paperclip className="size-3.5" aria-hidden="true" />
          Attach images or videos
        </button>
        <Button type="submit" className="rounded-full" disabled={pending}>
          {pending ? <Loader2 className="size-4 animate-spin" /> : null}
          Send message
        </Button>
      </div>
    </form>
  );
}
