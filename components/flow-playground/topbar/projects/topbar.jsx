"use client";

import React from "react";
import { Search, Bell, HelpCircle, ChevronsUpDown, Plug } from "lucide-react";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { useProject } from "@/components/flow-playground/context/project-context-demo";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { NotificationsDropdown } from "../../topbar/dialogue/notifications_dropdown";
import { ProfileDropdown } from "../../topbar/dialogue/profile_dropdown";
import { useIsMobile } from "@/lib/hooks/use-mobile";

export function ProjectTopbar() {
  const { project } = useProject();
  const isMobile = useIsMobile();
  return (
    <header className="h-14 px-4 flex items-center justify-between border-b border-border bg-background text-white z-20 w-full shrink-0">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="md:hidden -ml-2 text-white" />
          <div className="w-8 h-8 rounded flex items-center justify-center shrink-0 md:-ml-1.5">
            <img
              src="/logo1.svg"
              alt=""
              className="w-7 h-7 -mr-0.5 hover:bg-[#282828] rounded-md p-1"
              onClick={() => {
                window.location.href = "/";
              }}
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.parentElement.innerHTML =
                  '<div class="w-2 h-2 bg-white rounded-full"></div>';
              }}
            />
          </div>
          <div className="flex items-center gap-1 cursor-pointer group group-data-[collapsible=icon]:hidden md:border-l md:border-border pl-2 hidden sm:flex">
            <span className="text-white font-semibold text-sm ml-1 truncate max-w-[150px] md:max-w-xs">
              {project?.name || "Project"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-between gap-4 md:gap-8 sm:mr-2">
        <div className="flex items-center gap-2 sm:gap-3">
          <button className="relative hidden items-center bg-surface-active border border-border hover:border-border-strong transition-colors rounded-md h-8 px-2 sm:flex sm:px-2.5 w-8 sm:w-[240px] justify-center sm:justify-start text-sm text-muted-foreground shadow-sm group">
            <Search className="w-4 h-4 sm:mr-2 text-muted-foreground group-hover:text-foreground transition-colors" />
            <span className="hidden sm:inline-block text-muted-foreground group-hover:text-foreground transition-colors">
              Search project...
            </span>
            <div className="flex items-center justify-end w-8 h-8 ml-auto hidden sm:flex">
              <KbdGroup>
                <Kbd className="bg-surface-subtle border-border text-muted-foreground group-hover:bg-surface-hover group-hover:text-foreground transition-colors">
                  ⌘
                </Kbd>
              </KbdGroup>
            </div>
          </button>

          <div className="flex items-center gap-0 sm:gap-1 ml-0 sm:ml-1">
            <button className="w-8 h-8 rounded-full border border-transparent hover:bg-surface-hover hidden sm:flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground">
              <HelpCircle className="w-[18px] h-[18px]" strokeWidth={2} />
            </button>
            {!isMobile && (
              <>
                <NotificationsDropdown>
                  <button className="w-8 h-8 rounded-full border border-transparent hover:bg-surface-hover hidden items-center justify-center transition-colors text-muted-foreground hover:text-foreground relative sm:flex">
                    <Bell className="w-[18px] h-[18px]" strokeWidth={2} />
                  </button>
                </NotificationsDropdown>
                <ProfileDropdown />
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}



