"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Building2, Plus, Shield, UserCheck, Users, X } from "lucide-react";
import { cn } from "@/lib/utils";
import FilterDropdown from "../overview/filter_dropdown";

const ALL_ROLES = ["admin", "member", "viewer", "devops", "billing", "security"];
const ALL_POSITIONS = [
  "CTO",
  "Engineering Manager",
  "Tech Lead",
  "Senior Engineer",
  "DevOps Engineer",
  "CFO",
  "Finance Manager",
  "VP of Engineering",
  "Product Manager",
];

const TTL_OPTIONS = [
  { value: "none", label: "Never" },
  { value: "1h", label: "1 hour" },
  { value: "6h", label: "6 hours" },
  { value: "24h", label: "24 hours" },
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
  { value: "90d", label: "90 days" },
];

const DEFAULT_ACCESS_CONTROL = {
  type: "team",
  allowedRoles: [],
  allowedUsers: [],
  allowedPositions: [],
};

function buildAccessState(item) {
  return {
    ...DEFAULT_ACCESS_CONTROL,
    ...(item?.accessControl || {}),
  };
}

export function VaultAccessControl({
  item,
  open = false,
  onOpenChange = () => {},
  onSave = () => {},
}) {
  const [accessControl, setAccessControl] = useState(() => buildAccessState(item));
  const [ttl, setTtl] = useState(item?.ttl || "none");
  const [keylessEntry, setKeylessEntry] = useState(Boolean(item?.keylessEntry));
  const [userInput, setUserInput] = useState("");

  const handleTypeChange = (type) => {
    setAccessControl((current) => ({
      ...current,
      type,
      allowedRoles: type === "roles" ? current.allowedRoles : [],
      allowedUsers: type === "users" ? current.allowedUsers : [],
      allowedPositions: type === "positions" ? current.allowedPositions : [],
    }));
  };

  const handleRoleToggle = (role) => {
    setAccessControl((current) => ({
      ...current,
      allowedRoles: current.allowedRoles.includes(role)
        ? current.allowedRoles.filter((item) => item !== role)
        : [...current.allowedRoles, role],
    }));
  };

  const handlePositionToggle = (position) => {
    setAccessControl((current) => ({
      ...current,
      allowedPositions: current.allowedPositions.includes(position)
        ? current.allowedPositions.filter((item) => item !== position)
        : [...current.allowedPositions, position],
    }));
  };

  const handleUserAdd = () => {
    const nextUser = userInput.trim();
    if (!nextUser || accessControl.allowedUsers.includes(nextUser)) return;

    setAccessControl((current) => ({
      ...current,
      allowedUsers: [...current.allowedUsers, nextUser],
    }));
    setUserInput("");
  };

  const handleUserRemove = (email) => {
    setAccessControl((current) => ({
      ...current,
      allowedUsers: current.allowedUsers.filter((item) => item !== email),
    }));
  };

  const handleSave = () => {
    onSave({
      ...item,
      accessControl,
      ttl: ttl === "none" ? null : ttl,
      keylessEntry,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px] max-h-[85vh] overflow-y-auto bg-[#161616] text-[#ededed] border border-[#2a2a2a]">
        <DialogHeader>
          <DialogTitle className="font-semibold flex items-center gap-2.5 text-white">
            <Shield className="w-5 h-5 text-[#737373]" />
            Access Control
          </DialogTitle>
          <DialogDescription className="text-[#737373] pt-1 text-xs">
            Configure who can reveal {item?.name || "this secret"}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="space-y-3">
            <Label className="text-xs font-semibold text-[#a3a3a3] uppercase tracking-wide">
              Access Type
            </Label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { value: "team", label: "Team", icon: Users },
                { value: "roles", label: "Roles", icon: Shield },
                { value: "users", label: "Users", icon: UserCheck },
                { value: "positions", label: "Positions", icon: Building2 },
              ].map((option) => {
                const OptionIcon = option.icon;
                const isActive = accessControl.type === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleTypeChange(option.value)}
                    className={cn(
                      "flex flex-col items-center justify-center gap-2 rounded-lg border px-2 py-3 text-xs font-medium transition-colors",
                      isActive
                        ? "border-[#474747] bg-[#242424] text-white"
                        : "border-[#2a2a2a] bg-[#1a1a1a] text-[#737373] hover:border-[#3a3a3a] hover:text-[#a3a3a3]",
                    )}
                  >
                    <OptionIcon className="size-4" />
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          {accessControl.type === "roles" && (
            <div className="space-y-3">
              <Label className="text-xs font-semibold text-[#a3a3a3] uppercase tracking-wide">
                Allowed Roles
              </Label>
              <div className="flex flex-wrap gap-2">
                {ALL_ROLES.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleRoleToggle(role)}
                    className={cn(
                      "rounded-md border px-3 py-1 text-xs font-medium transition-colors",
                      accessControl.allowedRoles.includes(role)
                        ? "border-[#474747] bg-[#242424] text-white"
                        : "border-[#2a2a2a] bg-[#1a1a1a] text-[#737373] hover:border-[#3a3a3a]",
                    )}
                  >
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {accessControl.type === "users" && (
            <div className="space-y-3">
              <Label className="text-xs font-semibold text-[#a3a3a3] uppercase tracking-wide">
                Allowed Users
              </Label>
              <div className="space-y-2">
                {accessControl.allowedUsers.map((email) => (
                  <div
                    key={email}
                    className="flex items-center gap-3 rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-3 py-2"
                  >
                    <UserCheck className="size-4 text-[#737373]" />
                    <span className="min-w-0 flex-1 truncate text-sm text-[#ededed]">
                      {email}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleUserRemove(email)}
                      className="text-[#737373] hover:text-red-300"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="email@example.com"
                    value={userInput}
                    onChange={(event) => setUserInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        handleUserAdd();
                      }
                    }}
                    className="bg-[#1a1a1a] border-[#2a2a2a] text-[#ededed] placeholder:text-[#525252] h-9"
                  />
                  <Button
                    type="button"
                    onClick={handleUserAdd}
                    className="bg-[#ededed] text-[#161616] hover:bg-white h-9 px-3"
                  >
                    <Plus className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {accessControl.type === "positions" && (
            <div className="space-y-3">
              <Label className="text-xs font-semibold text-[#a3a3a3] uppercase tracking-wide">
                Positions
              </Label>
              <div className="flex flex-wrap gap-2">
                {ALL_POSITIONS.map((position) => (
                  <button
                    key={position}
                    type="button"
                    onClick={() => handlePositionToggle(position)}
                    className={cn(
                      "rounded-md border px-3 py-1 text-xs font-medium transition-colors",
                      accessControl.allowedPositions.includes(position)
                        ? "border-[#474747] bg-[#242424] text-white"
                        : "border-[#2a2a2a] bg-[#1a1a1a] text-[#737373] hover:border-[#3a3a3a]",
                    )}
                  >
                    {position}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4 rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <Label className="text-sm text-[#a3a3a3]">Keyless Entry</Label>
                <p className="mt-1 text-xs text-[#737373]">
                  Allow trusted sessions to skip repeated verification.
                </p>
              </div>
              <Switch
                checked={keylessEntry}
                onCheckedChange={setKeylessEntry}
                className="data-[state=checked]:bg-[#ededed] data-[state=unchecked]:bg-[#333333]"
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div>
                <Label className="text-sm text-[#a3a3a3]">Time To Live</Label>
                <p className="mt-1 text-xs text-[#737373]">
                  Expire granted access automatically.
                </p>
              </div>
              <FilterDropdown
                value={ttl}
                onValueChange={setTtl}
                options={TTL_OPTIONS}
                placeholder="Select expiration"
                height="h-9"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="gap-3 pt-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 border-[#2a2a2a] text-[#737373] hover:text-white hover:bg-[#202020] hover:border-[#3a3a3a] h-9"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 bg-[#ededed] text-[#161616] hover:bg-white h-9"
          >
            Save Access Control
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
