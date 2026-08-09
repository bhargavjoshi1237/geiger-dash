"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { updateProjectAvatarAction } from "../actions";
import { projectAvatarColor } from "./constants";

export function ProjectAvatarField({ project, organizationId, fallbackLabel }) {
  const [preview, setPreview] = useState(project.avatarUrl || null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);
  const [, startTransition] = useTransition();
  const color = projectAvatarColor(project.projectId || project.id);

  async function handleChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    const fd = new FormData();
    fd.append("project_id", project.projectId || "");
    fd.append("organization_id", organizationId);
    fd.append("avatar", file);
    startTransition(async () => {
      const result = await updateProjectAvatarAction(fd);
      setUploading(false);
      if (result?.ok) {
        setPreview(result.url);
        toast.success("Avatar updated");
      } else {
        setPreview(project.avatarUrl || null);
        toast.error(result?.error || "Upload failed");
      }
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        aria-label="Upload project avatar"
        className="group relative flex size-16 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-xl transition-opacity hover:opacity-90"
      >
        <span className={cn("absolute inset-0 flex items-center justify-center", preview ? "bg-surface-subtle" : color.bg)}>
          {preview ? (
            <Image src={preview} alt="" fill className="object-cover" unoptimized />
          ) : (
            <span className={cn("text-xl font-semibold", color.text)}>{fallbackLabel}</span>
          )}
        </span>
        {uploading ? (
          <span className="absolute inset-0 flex items-center justify-center bg-black/60">
            <Loader2 className="size-4 animate-spin text-white" />
          </span>
        ) : (
          <span className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
            <Camera className="size-5 text-white" />
          </span>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={handleChange}
      />
    </>
  );
}
