"use client";

import React, { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel, 
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CircleUserRound,
  Settings,
  Wallet,
  LogOut,
  Moon,
  Sun,
  UsersRound,
  LifeBuoy,
  MessageCircle,
  ShieldCheck,
  BookMarked,
  ExternalLink,
} from "lucide-react";
import { getUser } from "@/lib/supabase/user-demo";
import { logout } from "@/app/login/actions";
import { clearProfileImageCache } from "@/lib/profile-image-cache";

const surfaceStyle = {
  backgroundColor: "var(--surface-dialog)",
  borderColor: "var(--border)",
  color: "var(--foreground)",
};

const itemBaseStyle =
  "flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm cursor-pointer outline-none [&>span]:min-w-0 [&>span]:truncate";

const itemHoverStyle = "text-muted-foreground hover:bg-surface-hover hover:text-foreground focus:bg-surface-hover focus:text-foreground";

export function ProfileDropdown({ children }) {
  const [user, setUser] = useState(null);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    getUser().then((u) => {
      if (u) setUser(u);
    });
  }, []);

  const displayName = user?.name || "User";
  const displayEmail = user?.email || "user@email.com";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children || (
          <button className="w-8 h-8 rounded-full border border-border hover:border-border-strong overflow-hidden ml-1 transition-colors">
            <Avatar className="size-full">
              <AvatarImage src="/cat.jpg" alt={displayName} />
              <AvatarFallback className="bg-border-strong text-white text-[10px] font-semibold border-0">
                {initials}
              </AvatarFallback>
            </Avatar>
          </button>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-[208px] min-w-[208px] max-w-[208px] p-0 rounded-md border shadow-xl"
        style={surfaceStyle}
        sideOffset={8}
        align="end"
      >
        <div className="p-4 pb-3">
          <DropdownMenuLabel className="p-0">
            <div className="flex items-center gap-3">
              <Avatar className="size-10 border border-border">
                <AvatarImage src="/cat.jpg" alt={displayName} />
                <AvatarFallback className="bg-border-strong text-white text-xs font-semibold border-0">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-sm font-semibold text-white truncate">
                  {displayName}
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  {displayEmail}
                </span>
              </div>
            </div>
          </DropdownMenuLabel>
        </div>

        <DropdownMenuSeparator className="bg-surface-strong mx-0" />

        <div className="p-1.5">
          <DropdownMenuGroup>
            <DropdownMenuItem
              className={`${itemBaseStyle} ${itemHoverStyle}`}
            >
              <CircleUserRound className="w-3.5 h-3.5" />
              <span>Profile</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              className={`${itemBaseStyle} ${itemHoverStyle}`}
            >
              <UsersRound className="w-3.5 h-3.5" />
              <span>Organization Settings</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              className={`${itemBaseStyle} ${itemHoverStyle}`}
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>Billing & Plans</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator className="bg-surface-strong my-1" />

          <DropdownMenuGroup>
            <DropdownMenuItem className="hover:bg-transparent focus:bg-transparent p-2 cursor-default">
              <ToggleGroup
                type="single"
                value={theme}
                onValueChange={(value) => { if (value) setTheme(value); }}
                className="bg-surface-subtle flex items-center justify-evenly rounded-md p-0.5 w-full"
              >
                <ToggleGroupItem
                  value="light"
                  className="data-[state=on]:bg-surface-hover data-[state=on]:text-foreground text-muted-foreground rounded-sm hover:bg-surface-hover hover:text-foreground px-3 h-7 text-xs gap-1.5 flex-1 justify-center"
                >
                  <Sun className="size-3.5" />
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="dark"
                  className="data-[state=on]:bg-surface-hover data-[state=on]:text-foreground text-muted-foreground rounded-sm hover:bg-surface-hover hover:text-foreground px-3 h-7 text-xs gap-1.5 flex-1 justify-center"
                >
                  <Moon className="size-3.5" />
                </ToggleGroupItem>
              </ToggleGroup>
            </DropdownMenuItem>

            <DropdownMenuItem
              className={`${itemBaseStyle} ${itemHoverStyle}`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Settings</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              className={`${itemBaseStyle} ${itemHoverStyle}`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Security</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator className="bg-surface-strong my-1" />

          <DropdownMenuGroup>
            <DropdownMenuItem
              className={`${itemBaseStyle} ${itemHoverStyle}`}
            >
              <BookMarked className="w-3.5 h-3.5" />
              <span>Documentation</span>
              <ExternalLink className="size-3 ml-auto text-text-secondary" />
            </DropdownMenuItem>

            <DropdownMenuItem
              className={`${itemBaseStyle} ${itemHoverStyle}`}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Send Feedback</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              className={`${itemBaseStyle} ${itemHoverStyle}`}
            >
              <LifeBuoy className="w-3.5 h-3.5" />
              <span>Help & Support</span>
            </DropdownMenuItem>
            <form action={logout} onSubmit={() => clearProfileImageCache()}>
              <DropdownMenuItem
                asChild
                className={`${itemBaseStyle} text-text-secondary hover:bg-surface-hover hover:text-foreground focus:bg-surface-hover focus:text-foreground`}
              >
                <button type="submit" className="w-full">
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign out</span>
                </button>
              </DropdownMenuItem>
            </form>
          </DropdownMenuGroup>
        </div>

        <div className="px-4 py-2.5 border-t border-border">
          <div className="flex items-center justify-between text-[11px] text-text-secondary">
            <span>Flow v1.0.0</span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Online
            </span>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


