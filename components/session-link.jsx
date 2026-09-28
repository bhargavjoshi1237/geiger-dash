"use client";

import Link from "next/link";
import { useSessionUser } from "@/lib/hooks/use-session-user";

// A CTA that points signed-out visitors at login and signed-in users at their workspace, resolved client-side so the page stays static.
export function SessionLink({
  href = "/login",
  signedInHref = "/org",
  label,
  signedInLabel = label,
  className,
  children,
}) {
  const signedIn = Boolean(useSessionUser());

  return (
    <Link href={signedIn ? signedInHref : href} className={className}>
      {signedIn ? signedInLabel : label}
      {children}
    </Link>
  );
}
