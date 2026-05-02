import React from "react";
import { Button } from "@/components/ui/button";
import { LogIn, LucideLogIn } from "lucide-react";
import { cn } from "@/lib/utils";

export default function JoinTab({
  isSessionActive,
  sessionCodeInput,
  setSessionCodeInput,
  joinError,
  joinByCode,
  isJoining,
}) {
  return (
    <div className="flex flex-col items-center justify-center h-[320px] py-6 px-4">
      {isSessionActive ? (
        <div className="text-center space-y-5 animate-in fade-in -mt-10">
          <LucideLogIn className="w-8 h-8 opacity-20 ml-auto mr-auto" />
          <div className="space-y-1">
            <h3 className="text-md font-semibold text-zinc-100">
              Session Active
            </h3>
            <p className="text-xs text-zinc-500 max-w-[260px] mx-auto">
              You are currently in a session. Leave the current session to join
              another.
            </p>
          </div>
        </div>
      ) : (
        <div className="w-full w-full text-center space-y-6 animate-in fade-in -mt-4">
          <div className="space-y-5">
            <LucideLogIn className="w-8 h-8 opacity-20 ml-auto mr-auto" />
            <div className="space-y-1">
              <h3 className="text-md font-semibold text-zinc-100">
                Join a Session
              </h3>
              <p className="text-xs text-zinc-500 w-full  mx-auto">
                Enter a session code to join a live collaborative workspace.
              </p>
            </div>
          </div>

          <div className="space-y-3 ">
            <input
              type="text"
              placeholder="GEIGER-XXXX-XXXX"
              value={sessionCodeInput}
              onChange={(e) => setSessionCodeInput(e.target.value)}
              className={cn(
                "w-full bg-zinc-900 border rounded-md px-3 py-2 text-sm text-center text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700 transition-colors font-mono uppercase",
                joinError
                  ? "border-red-500/50 focus:border-red-500"
                  : "border-zinc-800",
              )}
            />
            {joinError && <p className="text-xs text-red-400">{joinError}</p>}

            <Button
              onClick={joinByCode}
              disabled={isJoining || !sessionCodeInput.trim()}
              className="w-full bg-zinc-100 text-sm text-black hover:bg-zinc-200 transition-all active:scale-95"
            >
              {isJoining ? (
                "Joining..."
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Join Session
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
