"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { trackToolAssetsClick } from "@/lib/analytics/tools";

export function TrackedAssetsLink({ tool }) {
  return (
    <Link
      href="/assets"
      className="mt-6 inline-flex items-center gap-2 text-sm font-medium"
      onClick={() => trackToolAssetsClick(tool)}
    >
      <Check className="size-4" />
      Organize finished files with Geiger Assets
    </Link>
  );
}

