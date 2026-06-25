// Cross-app transactional email API.
//
// Other suite apps (geiger-flow, geiger-notes, ...) POST here instead of running
// their own email stack. geiger-dash owns the templates, editing, and sending.
//
//   POST /api/email/send
//   Authorization: Bearer gk_live_xxx        (or x-api-key: gk_live_xxx)
//   Content-Type: application/json
//   {
//     "template": "flow.issue_assigned",
//     "to": "person@example.com",
//     "data": { "recipientName": "Alex", "issueTitle": "...", "issueUrl": "..." },
//     "subject": "optional subject override",
//     "from": "optional From override"
//   }
//
// Returns 200 { id, providerId, status } on success.

import { NextResponse } from "next/server";
import { extractApiKey, verifyApiKey } from "@/lib/email/auth";
import { sendTemplateEmail } from "@/lib/email/send";

export const runtime = "nodejs";

export async function POST(request) {
  const apiKey = await verifyApiKey(extractApiKey(request));
  if (!apiKey) {
    return NextResponse.json(
      { error: "Invalid or missing API key." },
      { status: 401 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { template, to, data, from, subject } = body || {};
  if (!template || !to) {
    return NextResponse.json(
      { error: "`template` and `to` are required." },
      { status: 400 }
    );
  }

  const result = await sendTemplateEmail({
    key: template,
    to,
    data: data || {},
    from,
    subject,
    project: apiKey.project,
    apiKeyId: apiKey.id,
  });

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error, id: result.id },
      { status: 502 }
    );
  }

  return NextResponse.json({
    id: result.id,
    providerId: result.providerId,
    status: "sent",
  });
}
