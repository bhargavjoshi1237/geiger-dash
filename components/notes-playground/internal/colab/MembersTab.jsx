import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Users2,
  Check,
  Trash2,
  UserMinus,
  LucideDoorClosed,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function MembersTab({
  isSessionActive,
  isHost,
  requestedMembers,
  joinedMembers,
  onAcceptRequest,
  onKickMember,
  handleLeave,
}) {
  return (
    <div className="h-full flex flex-col">
      {!isSessionActive ? (
        <div className="flex flex-col items-center justify-center h-[200px] text-zinc-500 space-y-2">
          <Users2 className="w-8 h-8 opacity-20" />
          <p className="text-sm">No active session</p>
          <p className="text-xs text-zinc-600">
            Start or join a session to see members
          </p>
        </div>
      ) : (
        <div className="flex-1 -mx-2">
          <ScrollArea className="h-[300px] px-2">
            {isHost && requestedMembers.length > 0 && (
              <div className="mb-6">
                <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 px-1 flex items-center justify-between">
                  Requests
                  <Badge
                    variant="secondary"
                    className="bg-zinc-800 text-zinc-400 text-[10px] h-5 px-1.5"
                  >
                    {requestedMembers.length}
                  </Badge>
                </h4>
                <div className="space-y-1">
                  {requestedMembers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-2 rounded bg-zinc-800/30 border border-zinc-800/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-medium text-zinc-400">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-zinc-200">
                            {user.name}
                          </div>
                          <div className="text-xs text-zinc-500">
                            Wants to join
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            onAcceptRequest && onAcceptRequest(user.id)
                          }
                          className="h-7 w-7 p-0 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/20"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 px-1">
                In Session ({joinedMembers.length})
              </h4>
              <div className="space-y-1">
                {joinedMembers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-2 rounded hover:bg-zinc-800/50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div
                          className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-medium text-zinc-300 border border-zinc-700"
                          style={
                            user.color
                              ? {
                                  borderColor: user.color,
                                  color: user.color,
                                }
                              : {}
                          }
                        >
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div
                          className={cn(
                            "absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#1e1e1e]",
                            user.status === "online"
                              ? "bg-emerald-500"
                              : "bg-amber-500",
                          )}
                        />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-zinc-200 flex items-center gap-2">
                          {user.name}
                          {user.isMe && (
                            <span className="text-zinc-500 text-xs">(You)</span>
                          )}
                          {user.role === "Owner" && (
                            <Badge
                              variant="outline"
                              className="text-[10px] h-4 py-0 px-1 border-zinc-700 text-zinc-400 font-normal"
                            >
                              Host
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-zinc-500">{user.role}</div>
                      </div>
                    </div>
                    {isHost && !user.isMe && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onKickMember && onKickMember(user.id)}
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-400 hover:bg-red-900/20"
                      >
                        <UserMinus className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
        </div>
      )}
      {!isHost && isSessionActive && (
        <div className="p-4 mt-auto">
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleLeave}
          >
            <LucideDoorClosed className="w-4 h-4 mr-2" />
            Leave Session
          </Button>
        </div>
      )}
    </div>
  );
}
