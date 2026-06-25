// The single send path: render -> log -> deliver via Resend -> update log.
//
// Every send is recorded in email.messages first (status "queued"), so a failed
// delivery is still auditable. The API route and the admin "send test" action
// both funnel through here.

import { Resend } from "resend";
import { emailServiceClient } from "./service.js";
import { renderForSend } from "./render.js";

const DEFAULT_FROM = process.env.EMAIL_FROM || "Geiger <noreply@geiger.studio>";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  return key ? new Resend(key) : null;
}

export async function sendTemplateEmail({
  key,
  to,
  data = {},
  from,
  subject,
  project,
  apiKeyId = null,
}) {
  if (!key || !to) {
    return { ok: false, error: "Both `template` and `to` are required." };
  }

  const supabase = emailServiceClient();
  const fromAddress = from || DEFAULT_FROM;

  let rendered;
  try {
    rendered = await renderForSend({ key, data, subject });
  } catch (err) {
    return { ok: false, error: err.message };
  }

  const { data: message, error: logError } = await supabase
    .from("messages")
    .insert({
      template_key: key,
      project: project || null,
      to_address: to,
      from_address: fromAddress,
      subject: rendered.subject,
      html: rendered.html,
      status: "queued",
      data,
      api_key_id: apiKeyId,
    })
    .select("id")
    .single();

  if (logError) {
    console.error("[email.send] log insert failed", logError.message);
  }
  const messageId = message?.id || null;

  const resend = getResend();
  if (!resend) {
    await markFailed(supabase, messageId, "RESEND_API_KEY is not configured");
    return { ok: false, error: "RESEND_API_KEY is not configured", id: messageId };
  }

  try {
    const { data: sent, error } = await resend.emails.send({
      from: fromAddress,
      to,
      subject: rendered.subject,
      html: rendered.html,
    });
    if (error) throw new Error(error.message || "Resend rejected the message");

    if (messageId) {
      await supabase
        .from("messages")
        .update({
          status: "sent",
          provider_id: sent?.id || null,
          sent_at: new Date().toISOString(),
        })
        .eq("id", messageId);
    }
    return { ok: true, id: messageId, providerId: sent?.id || null };
  } catch (err) {
    await markFailed(supabase, messageId, err.message);
    return { ok: false, error: err.message, id: messageId };
  }
}

async function markFailed(supabase, messageId, error) {
  if (!messageId) return;
  await supabase.from("messages").update({ status: "failed", error }).eq("id", messageId);
}
