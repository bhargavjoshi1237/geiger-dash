"use server";

import { sendTemplateEmail } from "@/lib/email/send";
import { CONTACT_EMAIL, MAX_ATTACHMENT_BYTES, MAX_ATTACHMENT_FILES, isAllowedAttachment } from "@/lib/contact";
import { getContactIdentity } from "./queries";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SEND_FAILED = `We couldn't send your message. Please email us at ${CONTACT_EMAIL}.`;

// Single-line fields lose their line breaks so nothing can reach the email subject on a new line.
const field = (formData, name, maxLength) => {
  const value = formData.get(name)?.toString() ?? "";
  return (name === "message" ? value : value.replace(/[\r\n]+/g, " ")).trim().slice(0, maxLength);
};

async function sendRequest({ kind, name, email, account, teamSize, message, attachments = [] }) {
  const result = await sendTemplateEmail({
    key: "geiger.contact_request",
    to: CONTACT_EMAIL,
    project: "geiger-dash",
    replyTo: email,
    attachments,
    data: {
      kind,
      name,
      email,
      teamSize,
      message,
      account,
      attachments: attachments.map((file) => file.filename).join(", "),
      submittedAt: new Date().toUTCString(),
    },
  });

  if (!result.ok) {
    console.error(`[contact] ${kind} request failed`, result.error);
    return { error: SEND_FAILED };
  }
  return { success: true };
}

export async function submitSalesRequest(formData) {
  // Bots fill the hidden field; let them think it worked.
  if (formData.get("website")) return { success: true };

  const name = field(formData, "fullName", 120);
  const email = field(formData, "email", 254);
  const teamSize = field(formData, "teamSize", 40);
  const message = field(formData, "message", 5000);

  if (!name || !email || !teamSize || !message) return { error: "All fields are required." };
  if (!EMAIL_PATTERN.test(email)) return { error: "Please enter a valid email address." };

  const identity = await getContactIdentity();
  return sendRequest({
    kind: "Sales",
    name,
    email,
    teamSize,
    message,
    account: identity ? `Signed in as ${identity.email}` : "Not signed in",
  });
}

export async function submitSupportRequest(formData) {
  if (formData.get("website")) return { success: true };

  // A signed-in visitor is answered at their account email, whatever the form sent.
  const identity = await getContactIdentity();
  const email = identity?.email || field(formData, "email", 254);
  const name = identity?.name || field(formData, "fullName", 120) || email;
  const message = field(formData, "message", 5000);

  if (!email || !message) return { error: "Please add your email and a message." };
  if (!EMAIL_PATTERN.test(email)) return { error: "Please enter a valid email address." };

  const files = formData.getAll("attachments").filter((file) => file instanceof File && file.size > 0);
  if (files.length > MAX_ATTACHMENT_FILES) return { error: `Attach up to ${MAX_ATTACHMENT_FILES} files.` };
  if (!files.every(isAllowedAttachment)) return { error: "Only images and videos can be attached." };
  if (files.reduce((total, file) => total + file.size, 0) > MAX_ATTACHMENT_BYTES) {
    return { error: "Attachments can be up to 4 MB in total." };
  }

  const attachments = await Promise.all(
    files.map(async (file) => ({ filename: file.name, content: Buffer.from(await file.arrayBuffer()) })),
  );

  return sendRequest({
    kind: "Support",
    name,
    email,
    message,
    attachments,
    account: identity ? `Signed in as ${identity.email}` : "Not signed in",
  });
}
