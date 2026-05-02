import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History, ArrowLeft, Undo, GitMerge } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar";
export default function MergeTab({
  selectedMergeSession,
  mergeSessions,
  handleMergeSessionSelect,
  mergeDiff,
  confirmMerge,
  setSelectedMergeSession,
  handleRollback,
  currentUser,
}) {
  const hasRollback = !!selectedMergeSession?.rollback;

  return (
    <ScrollArea className="h-full flex flex-col h-full ">
      {!selectedMergeSession ? (
        <div className="h-full flex flex-col">
          <ScrollArea className="flex-1 px-4 pb-4">
            {mergeSessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-zinc-500">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <History className="w-8 h-8 opacity-20 ml-auto mr-auto" />
                </div>
                <p className="text-sm font-medium">No hosted sessions found</p>
                <p className="text-xs mt-1 w-full mx-auto opacity-70">
                  Past sessions you've hosted will appear here for merging.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {mergeSessions.map((session) => (
                  <button
                    key={session.id}
                    onClick={() => handleMergeSessionSelect(session)}
                    className="w-full flex flex-col gap-1 p-3 rounded-lg bg-zinc-800/40 hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-700 transition-all text-left group"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">
                        {session.code || "Untitled Session"}
                      </span>
                      <span>
                        <AvatarGroup className="grayscale">
                          {currentUser && (
                            <Avatar
                              size="sm"
                              className="border-2 border-zinc-900"
                            >
                              <AvatarImage
                                src={currentUser?.user_metadata?.avatar_url}
                                alt={currentUser?.user_metadata?.name || "Host"}
                              />
                              <AvatarFallback>
                                {currentUser?.user_metadata?.name
                                  ? currentUser.user_metadata.name
                                      .substring(0, 2)
                                      .toUpperCase()
                                  : "H"}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          {session.joiners &&
                            Object.values(session.joiners)
                              .filter((j) => j.status === "joined")
                              .slice(0, 2)
                              .map((joiner, index) => (
                                <Avatar
                                  key={index}
                                  size="sm"
                                  className="border-2 border-zinc-900"
                                >
                                  <AvatarImage
                                    src={joiner.avatar_url}
                                    alt={joiner.name}
                                  />
                                  <AvatarFallback>
                                    {joiner.name
                                      ? joiner.name
                                          .substring(0, 2)
                                          .toUpperCase()
                                      : "U"}
                                  </AvatarFallback>
                                </Avatar>
                              ))}
                          {session.joiners &&
                            Object.values(session.joiners).filter(
                              (j) => j.status === "joined",
                            ).length > 2 && (
                              <AvatarGroupCount>
                                +
                                {Object.values(session.joiners).filter(
                                  (j) => j.status === "joined",
                                ).length - 2}
                              </AvatarGroupCount>
                            )}
                        </AvatarGroup>
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <div className="text-xs text-zinc-500 group-hover:text-zinc-400">
                        {session.rollback ? (
                          <div className="text-[10px] text-amber-500/90 flex items-center gap-1 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                            <GitMerge className="w-3 h-3" /> Merged
                          </div>
                        ) : (
                          <div className="text-[10px] text-zinc-500 flex items-center gap-1 bg-zinc-800/50 px-1.5 py-0.5 rounded border border-zinc-700/50">
                            <GitMerge className="w-3 h-3" /> Not Merged
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-zinc-500 group-hover:text-zinc-400">
                        {new Date(session.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          <ScrollArea className="flex-1">
            {hasRollback ? (
              <div className="flex flex-col items-center justify-center p-8 text-center space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-zinc-100">
                    Undo Merge
                  </h3>
                  <p className="text-sm text-zinc-400 max-w-[260px] mx-auto leading-relaxed">
                    Merged on{" "}
                    <span className="text-zinc-300">
                      {new Date(
                        selectedMergeSession.rollback.merged_at,
                      ).toLocaleDateString()}
                    </span>{" "}
                    at{" "}
                    <span className="text-zinc-300">
                      {new Date(
                        selectedMergeSession.rollback.merged_at,
                      ).toLocaleTimeString()}
                    </span>
                  </p>
                </div>
                <div className="text-xs text-zinc-500 bg-zinc-900/50 px-4 py-3 rounded-md border border-zinc-800 w-full">
                  Rolling back will restore the board state to exactly how it
                  was before the merge.
                </div>
              </div>
            ) : (
              <div className="p-6 space-y-6">
                {mergeDiff && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-zinc-800/30 border-2 border-zinc-800 border-dashed rounded-xl p-4 text-center flex flex-col items-center justify-center gap-1 group hover:border-emerald-500/30 transition-colors">
                        <div className="text-2xl font-bold text-emerald-400">
                          {mergeDiff.newNodes.length}
                        </div>
                        <div className="text-xs font-medium text-zinc-400 group-hover:text-zinc-300">
                          New Nodes
                        </div>
                      </div>
                      <div className="bg-zinc-800/30 border-2 border-zinc-800 border-dashed rounded-xl p-4 text-center flex flex-col items-center justify-center gap-1 group hover:border-blue-500/30 transition-colors">
                        <div className="text-2xl font-bold text-blue-400">
                          {mergeDiff.changedNodes.length}
                        </div>
                        <div className="text-xs font-medium text-zinc-400 group-hover:text-zinc-300">
                          Modified
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="text-sm text-zinc-400 leading-relaxed">
                        Merging will combine these changes into your current
                        board. Your local unique nodes will be preserved.
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </ScrollArea>

          <div className="p-4 border-t border-zinc-800 flex gap-2">
            <Button
              variant="ghost"
              onClick={() => setSelectedMergeSession(null)}
              className="w-[30%] bg-zinc-800 text-zinc-200 hover:bg-zinc-700 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            {hasRollback ? (
              <Button
                onClick={handleRollback}
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-900/20"
              >
                <Undo className="w-4 h-4 mr-2" />
                Rollback
              </Button>
            ) : (
              <Button
                onClick={confirmMerge}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-900/20"
              >
                Merge Changes
              </Button>
            )}
          </div>
        </div>
      )}
    </ScrollArea>
  );
}
