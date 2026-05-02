"use client";

import { useState, useEffect } from "react";
import { X, Plus, FolderOpen, PenLine } from "lucide-react";

export default function NewBoardDialog({ open, onClose, onSubmit, projects = [] }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState("");
  const [loading, setLoading] = useState(false);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setName("");
      setDescription("");
      setProjectId("");
      setLoading(false);
    }
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    await onSubmit({
      name: name.trim(),
      description: description.trim(),
      projectId: projectId || null,
    });
    setLoading(false);
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-md px-4">
        <div className="bg-[#202020] border border-[#333333] rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#2a2a2a]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#2a2a2a] border border-[#333333] flex items-center justify-center">
                <PenLine className="w-4 h-4 text-[#a3a3a3]" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-[#e7e7e7]">New Board</h2>
                <p className="text-xs text-[#737373]">Create a new Excalidraw canvas</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-[#2a2a2a] text-[#737373] hover:text-[#e7e7e7] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-[#737373] uppercase tracking-wider">
                Board Name <span className="text-red-400">*</span>
              </label>
              <input
                autoFocus
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Product Wireframes"
                className="w-full bg-[#161616] border border-[#2a2a2a] text-[#e7e7e7] text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#474747] placeholder:text-[#525252] transition-colors"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-[#737373] uppercase tracking-wider">
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What is this board for?"
                className="w-full bg-[#161616] border border-[#2a2a2a] text-[#e7e7e7] text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#474747] placeholder:text-[#525252] transition-colors"
              />
            </div>

            {/* Project link */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-[#737373] uppercase tracking-wider flex items-center gap-1.5">
                <FolderOpen className="w-3 h-3" />
                Link to Flow Project
              </label>
              <div className="relative">
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full bg-[#161616] border border-[#2a2a2a] text-[#e7e7e7] text-sm rounded-lg px-3 py-2.5 pr-8 focus:outline-none focus:border-[#474747] transition-colors appearance-none cursor-pointer"
                >
                  <option value="" className="bg-[#161616] text-[#737373]">
                    No project (standalone)
                  </option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id} className="bg-[#1a1a1a]">
                      {p.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                  <svg className="w-3 h-3 text-[#737373]" viewBox="0 0 12 12" fill="none">
                    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <p className="text-[10px] text-[#525252]">
                Associate this board with a Geiger Flow project for cross-tool linking
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#474747] text-[#a3a3a3] hover:text-[#e7e7e7] text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!name.trim() || loading}
                className="flex-1 px-4 py-2.5 rounded-lg bg-[#e7e7e7] hover:bg-white text-[#161616] text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    Create Board
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
