"use server";

import { createClient } from "@/utils/supabase/server";
import { getUser } from "@/supabase/user/getUser";
import { sendTemplateEmail } from "@/lib/email/send";
import { BETA_APPS, BETA_LIMITS, BETA_TEAM_SIZES } from "@/lib/pricing/beta";

const BETA_INBOX = "info@geiger.studio";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const clean = (value, max) => (typeof value === "string" ? value.trim().slice(0, max) : "");

// Emails a beta request to the team inbox with replies going to the applicant; returns { ok } or { error } for the dialog.
export async function requestBetaAccessAction(input = {}) {
  // Bots fill the hidden "website" field; report success so they don't retry.
  if (clean(input.website, 200)) return { ok: true };

  const name = clean(input.name, BETA_LIMITS.name);
  const email = clean(input.email, BETA_LIMITS.email).toLowerCase();
  const company = clean(input.company, BETA_LIMITS.company);
  const useCase = clean(input.useCase, BETA_LIMITS.useCase);
  const teamSize = BETA_TEAM_SIZES.includes(input.teamSize) ? input.teamSize : "";
  const picked = Array.isArray(input.apps) ? input.apps : [];
  const apps = BETA_APPS.filter((app) => picked.includes(app.id)).map((app) => app.name);

  if (!name || !email || !useCase) return { error: "missing_fields" };
  if (!EMAIL_PATTERN.test(email)) return { error: "invalid_email" };

  const supabase = await createClient();
  const user = await getUser(supabase);

  const result = await sendTemplateEmail({
    key: "geiger.beta_request",
    to: BETA_INBOX,
    replyTo: email,
    project: "geiger-dash",
    data: {
      name,
      email,
      company,
      teamSize,
      apps: apps.join(", "),
      useCase,
      account: user ? `Signed in as ${user.email}` : "Not signed in",
      submittedAt: new Date().toUTCString(),
    },
  });

  if (!result?.ok) {
    console.error("[pricing.betaRequest]", result?.error);
    return { error: "send_failed" };
  }
  return { ok: true };
}
