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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CachedAvatarImage } from "@/components/cached-avatar-image";
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
  backgroundColor: "#202020",
  borderColor: "#333333",
  color: "#ffffff",
};

const itemBaseStyle =
  "flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm cursor-pointer outline-none [&>span]:min-w-0 [&>span]:truncate";

const itemHoverStyle = "text-[#a3a3a3] hover:bg-[#2a2a2a] hover:text-white focus:bg-[#2a2a2a] focus:text-white";

export function ProfileDropdown({ children }) {
  const [user, setUser] = useState(null);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    getUser().then((u) => {
      if (u) setUser(u);
    });
  }, []);

  const pfpUrl = user?.id
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/pfp/${user.id}/latest.jpg`
    : null;

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
          <button className="w-8 h-8 rounded-full border border-[#333333] hover:border-[#474747] overflow-hidden ml-1 transition-colors">
            <Avatar className="size-full">
              {pfpUrl && (
                <CachedAvatarImage src={pfpUrl} cacheKey={user.id} alt={displayName} />
              )}
              <AvatarFallback className="bg-[#474747] text-white text-[10px] font-semibold border-0">
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
              <Avatar className="size-10 border border-[#333333]">
                {pfpUrl && (
                  <CachedAvatarImage src={pfpUrl} cacheKey={user.id} alt={displayName} />
                )}
                <AvatarFallback className="bg-[#474747] text-white text-xs font-semibold border-0">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-sm font-semibold text-white truncate">
                  {displayName}
                </span>
                <span className="text-xs text-[#a3a3a3] truncate">
                  {displayEmail}
                </span>
              </div>
            </div>
          </DropdownMenuLabel>
        </div>

        <DropdownMenuSeparator className="bg-[#333333] mx-0" />

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

          <DropdownMenuSeparator className="bg-[#333333] my-1" />

          <DropdownMenuGroup>
            <DropdownMenuItem className="hover:bg-transparent focus:bg-transparent p-2 cursor-default">
              <ToggleGroup
                type="single"
                value={theme}
                onValueChange={(value) => { if (value) setTheme(value); }}
                className="bg-[#1a1a1a] flex items-center justify-evenly rounded-md p-0.5 w-full"
              >
                <ToggleGroupItem
                  value="light"
                  className="data-[state=on]:bg-[#2a2a2a] data-[state=on]:text-white text-[#a3a3a3] rounded-sm hover:bg-[#2a2a2a] hover:text-white px-3 h-7 text-xs gap-1.5 flex-1 justify-center"
                >
                  <Sun className="size-3.5" />
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="dark"
                  className="data-[state=on]:bg-[#2a2a2a] data-[state=on]:text-white text-[#a3a3a3] rounded-sm hover:bg-[#2a2a2a] hover:text-white px-3 h-7 text-xs gap-1.5 flex-1 justify-center"
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

          <DropdownMenuSeparator className="bg-[#333333] my-1" />

          <DropdownMenuGroup>
            <DropdownMenuItem
              className={`${itemBaseStyle} ${itemHoverStyle}`}
            >
              <BookMarked className="w-3.5 h-3.5" />
              <span>Documentation</span>
              <ExternalLink className="size-3 ml-auto text-[#737373]" />
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
                className={`${itemBaseStyle} text-[#737373] hover:bg-[#2a2a2a] hover:text-white focus:bg-[#2a2a2a] focus:text-white`}
              >
                <button type="submit" className="w-full">
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign out</span>
                </button>
              </DropdownMenuItem>
            </form>
          </DropdownMenuGroup>
        </div>

        <div className="px-4 py-2.5 border-t border-[#333333]">
          <div className="flex items-center justify-between text-[11px] text-[#737373]">
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


