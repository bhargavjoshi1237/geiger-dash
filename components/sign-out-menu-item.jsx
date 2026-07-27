"use client";

import { useState } from "react";
import { LogOut, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { logout } from "@/app/login/actions";
import { clearProfileImageCache } from "@/lib/profile-image-cache";
import { cn } from "@/lib/utils";

// Radix closes (and unmounts) the menu as soon as an item is selected, which
// cancelled the old `<form action={logout}>` submit before it ever fired. Hold
// the menu open with preventDefault, run the sign-out here, and let the action's
// redirect do the navigation.
export function SignOutMenuItem({ className }) {
  const [pending, setPending] = useState(false);

  const handleSelect = async (event) => {
    event.preventDefault();
    if (pending) return;
    setPending(true);

    try {
      await clearProfileImageCache();
      await logout();
    } catch (error) {
      console.error("[auth.signOut]", error);
      toast.error("Couldn't sign you out. Please try again.");
      setPending(false);
    }
  };

  return (
    <DropdownMenuItem
      onSelect={handleSelect}
      disabled={pending}
      className={cn("cursor-pointer gap-2", className)}
    >
      {pending ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <LogOut className="w-3.5 h-3.5" />
      )}
      <span>{pending ? "Signing out…" : "Sign out"}</span>
    </DropdownMenuItem>
  );
}
