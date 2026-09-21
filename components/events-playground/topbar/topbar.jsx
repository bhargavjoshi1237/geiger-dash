"use client";

import React from "react";
import { Topbar as SuiteTopbar } from "@geiger/ui";
import { SidebarTrigger } from "@geiger/ui/sidebar";
import { useVisibleNav } from "../hooks/use-visible-nav";

// The real Events topbar wired for the landing embed: the command palette still
// navigates the playground's tabs, but the notifications, profile and Supabase
// activity slots stay empty — there is no session behind this demo.
export function Topbar({ onTabChange = () => {} }) {
  const visibleNav = useVisibleNav();

  return (
    <SuiteTopbar
      label="Events"
      logoSrc="/logo1.svg"
      homeHref="/"
      searchPlaceholder="Search Events..."
      searchNav={visibleNav}
      searchRecentsKey="geiger:dash:events-playground-recents"
      onSearchSelect={(item) => onTabChange(item.title)}
      sidebarTrigger={
        <SidebarTrigger className="md:hidden -ml-2 text-foreground" />
      }
    />
  );
}

export default Topbar;
