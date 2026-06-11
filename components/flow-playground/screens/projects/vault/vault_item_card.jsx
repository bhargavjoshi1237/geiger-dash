"use client";

import React, { useState } from "react";
import {
  Copy,
  Eye,
  EyeOff,
  MoreVertical,
  Shield,
  Clock,
  Lock,
  Unlock,
  Database,
  Key,
  Link,
  Mail,
  Server,
  Terminal,
  Box,
  FingerprintIcon,
  Fingerprint,
  FingerprintPattern,
  Pencil,
  Trash2,
  ScanFace,
} from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

function formatTTL(ttl) {
  if (!ttl) return null;
  const match = ttl.match(/^(\d+)([dhms])$/);
  if (!match) return ttl;
  const [, value, unit] = match;
  const units = { d: "days", h: "hours", m: "min", s: "sec" };
  return `${value}${unit === "d" ? "d" : unit === "h" ? "h" : unit === "m" ? "m" : "s"}`;
}

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function VaultItemCard({
  item,
  onEdit,
  onDelete,
  onDuplicate,
  onAccessCredential,
  onAccessControl,
}) {
  const [showSecret, setShowSecret] = useState(false);
  const [copied, setCopied] = useState(false);

  const getTypeIcon = () => {
    switch (item.type) {
      case 'database': return Database;
      case 'api_key': return Key;
      case 'oauth': return Link;
      case 'smtp': return Mail;
      case 'password': return Key;
      case 'certificate': return Server;
      case 'ssh_key': return Terminal;
      default: return Box;
    }
  };
  const TypeIcon = getTypeIcon();

  const getAccessLabel = () => {
    switch (item.accessControl?.type) {
      case 'team': return 'Team';
      case 'roles': return 'Roles';
      case 'users': return 'Users';
      case 'positions': return 'Positions';
      default: return null;
    }
  };
  const accessLabel = getAccessLabel();

  const typeStyle = { bg: 'bg-surface-card', border: 'border-border', text: 'text-muted-foreground' };

  const handleCopy = () => {
    const textToCopy = item.secret || item.password || item.apiKey || item.username || "";
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const secretValue = item.secret || item.password || item.apiKey || "";
  const hasSecret = secretValue.length > 0;

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div>
          <div className="group bg-surface-subtle border border-border rounded-xl p-5 hover:border-border-strong transition-all duration-200">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                 
                <div className="min-w-0">
                  <h3 className="text-[15px] font-medium text-white truncate">
                    {item.name}
                  </h3>
                  <p className="text-[12px] text-text-secondary truncate">
                    {item.username || item.url || "No details"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap mb-3">
              {accessLabel && (
                <span className="text-[11px] font-medium px-2 py-1 rounded-md bg-surface-card border border-border text-muted-foreground">
                  {accessLabel}
                </span>
              )}
              {item.ttl && (
                <span className=" text-[11px] font-medium px-2 py-1 rounded-md bg-surface-card border border-border text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatTTL(item.ttl)}
                </span>
              )}
              {item.keylessEntry ? (
                <span className="text-[11px] font-medium px-2 py-1.5 rounded-md bg-surface-card border border-border text-muted-foreground flex items-center gap-1">
                  <Unlock className="w-3 h-3" />
                </span>
              ) : (
                <span className="text-[11px] font-medium px-2 py-1.5 rounded-md bg-surface-card border border-border text-text-secondary flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                </span>
              )}
            </div>
            </div>

            {/* Secret Preview */}
            {hasSecret && (
              <div className="flex items-center gap-2 bg-background rounded-lg px-3 py-2.5 mb-4 border border-border">
                <code className="flex-1 text-[12px] text-muted-foreground truncate font-mono">
                  {showSecret ? secretValue : "****************"}
                </code>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setShowSecret(!showSecret);
                    }}
                    className="w-7 h-7 rounded flex items-center justify-center text-text-secondary hover:text-foreground hover:bg-surface-card transition-colors"
                  >
                    {showSecret ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleCopy();
                    }}
                    className="w-7 h-7 rounded flex items-center justify-center text-text-secondary hover:text-foreground hover:bg-surface-card transition-colors"
                  >
                    {copied ? (
                      <span className="text-[11px] font-medium text-muted-foreground">Copied</span>
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Tags */}
            

          

            <div className="flex items-center justify-between pt-3">
               {item.notes && (
              <p className="text-[12px] text-text-secondary line-clamp-2">
                {item.notes}
              </p>
            )}
             <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  onAccessCredential();
                }}
                className="text-[11px] text-text-secondary hover:text-foreground flex items-center gap-1.5 transition-colors"
              >
                <ScanFace className="w-3 h-3" />
                Access
              </button>
            </div>
          </div>
        </div>
     
      </ContextMenuTrigger>
      <ContextMenuContent className="bg-[#212121] border-border text-foreground w-44 p-1">
        <ContextMenuItem onSelect={onEdit} className="cursor-pointer focus:bg-[#323232] focus:text-foreground flex items-center gap-2 px-2 py-1.5">
          <Pencil className="w-3.5 h-3.5" />
          <span className="text-xs">Edit</span>
        </ContextMenuItem>
        <ContextMenuItem onSelect={onDuplicate} className="cursor-pointer focus:bg-[#323232] focus:text-foreground flex items-center gap-2 px-2 py-1.5">
          <Copy className="w-3.5 h-3.5" />
          <span className="text-xs">Duplicate</span>
        </ContextMenuItem>
        <ContextMenuItem onSelect={onAccessControl} className="cursor-pointer focus:bg-[#323232] focus:text-foreground flex items-center gap-2 px-2 py-1.5">
          <Shield className="w-3.5 h-3.5" />
          <span className="text-xs">Access Control</span>
        </ContextMenuItem>
        <ContextMenuSeparator className="bg-surface-hover" />
        <ContextMenuItem onSelect={onDelete} className="cursor-pointer focus:bg-red-500/10 focus:text-red-300 text-red-300 flex items-center gap-2 px-2 py-1.5">
          <Trash2 className="w-3.5 h-3.5" />
          <span className="text-xs">Remove</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}



