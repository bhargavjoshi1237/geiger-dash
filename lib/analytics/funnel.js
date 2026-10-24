"use client";

import { capture } from "./capture";

// Acquisition funnel events. Never attach emails, org ids or form values — the privacy policy promises no account identity.
const NOW = { send_instantly: true };

export function trackSignupCompleted({ needsConfirmation }) {
  capture("signup_completed", { method: "password", needs_confirmation: needsConfirmation }, NOW);
}

// Password and passkey sign-ins finish in the browser.
export function trackLoginCompleted(method) {
  capture("login_completed", { method }, NOW);
}

// OAuth and SSO leave for the provider, so only the start is visible client-side.
export function trackLoginStarted(method) {
  capture("login_started", { method }, NOW);
}

export function trackCheckoutStarted({ planId, isYearly, productCount }) {
  capture(
    "checkout_started",
    { plan: planId, billing: isYearly ? "yearly" : "monthly", product_count: productCount },
    NOW,
  );
}

export function trackCheckoutCompleted({ planId, amountUsd }) {
  capture("checkout_completed", { plan: planId, amount_usd: amountUsd });
}

export function trackTrialStarted() {
  capture("trial_started", { plan: "basic" });
}

export function trackContactSubmitted() {
  capture("contact_submitted");
}
