"use client";

import React from "react";
import {
  StickyNote,
  Link as LinkIcon,
  CheckSquare,
  ArrowRight,
  LayoutGrid,
  Columns,
  MessageSquare,
  Table,
  PencilLine,
  Palette,
  FileText,
  Mic,
  Map as MapIcon,
  Video,
  Type,
  ImagePlus,
  Upload,
  PenTool,
} from "lucide-react";

const TOOL_GROUPS = [
  {
    id: "main",
    items: [
      { id: "note", label: "Note", icon: StickyNote },
      { id: "link", label: "Link", icon: LinkIcon },
      { id: "todo", label: "To-do", icon: CheckSquare },
      { id: "line", label: "Line", icon: ArrowRight },
      { id: "board", label: "Board", icon: LayoutGrid },
      { id: "column", label: "Column", icon: Columns },
      { id: "comment", label: "Comment", icon: MessageSquare },
      { id: "table", label: "Table", icon: Table },
      { id: "sketch", label: "Sketch", icon: PencilLine },
      { id: "color", label: "Color", icon: Palette },
      { id: "document", label: "Document", icon: FileText },
      { id: "audio", label: "Audio", icon: Mic },
      { id: "map", label: "Map", icon: MapIcon },
      { id: "video", label: "Video", icon: Video },
      { id: "heading", label: "Heading", icon: Type },
    ],
  },
];

export default function ToolbarOptions({
  selectedTools = [],
  onToggleTool,
  onReset,
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-6  ">
        {TOOL_GROUPS.map((group, groupIdx) => (
          <React.Fragment key={group.id}>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
              {group.items.map((tool) => {
                const isActive = selectedTools.includes(tool.id);
                const Icon = tool.icon;

                return (
                  <button
                    key={tool.id}
                    onClick={() => onToggleTool(tool.id)}
                    className={`
                      flex flex-col items-center justify-center gap-2 aspect-square rounded-xl transition-all pt-3 pb-3 border-2
                      ${
                        isActive
                          ? "bg-zinc-800 border-zinc-500 text-white"
                          : "bg-zinc-900 border-transparent text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
                      }
                    `}
                  >
                    <Icon
                      className={`w-6 h-6 ${isActive ? "text-[#e7e7e7]" : ""}`}
                    />
                    <span className="text-[10px] font-medium truncate w-full px-1">
                      {tool.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
