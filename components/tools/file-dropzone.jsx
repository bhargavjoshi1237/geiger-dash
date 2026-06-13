"use client";

import { useRef, useState } from "react";
import { FileImage, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { IMAGE_ACCEPT, MAX_IMAGE_SIZE } from "@/lib/tools/image-tools";

export function FileDropzone({ onFile, compact = false }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file) => {
    if (file) onFile(file);
  };

  return (
    <div
      className={cn(
        "group relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-border-strong bg-background/55 text-center transition-colors hover:border-foreground/40 hover:bg-surface-hover/50",
        compact ? "min-h-36 p-5" : "min-h-72 p-8",
        isDragging && "border-foreground bg-surface-hover",
      )}
      role="button"
      tabIndex={0}
      data-testid="image-dropzone"
      onClick={() => inputRef.current?.click()}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          inputRef.current?.click();
        }
      }}
      onDragEnter={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragOver={(event) => event.preventDefault()}
      onDragLeave={(event) => {
        event.preventDefault();
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsDragging(false);
        }
      }}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragging(false);
        handleFile(event.dataTransfer.files?.[0]);
      }}
    >
      <input
        ref={inputRef}
        className="sr-only"
        type="file"
        accept={IMAGE_ACCEPT}
        aria-label="Choose an image"
        onChange={(event) => {
          handleFile(event.target.files?.[0]);
          event.target.value = "";
        }}
      />
      <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 [background:radial-gradient(circle_at_50%_0%,rgb(255_255_255/0.08),transparent_52%)]" />
      <div className="relative mb-5 flex size-12 items-center justify-center rounded-xl border border-border bg-card shadow-sm">
        {isDragging ? (
          <FileImage className="size-5 text-foreground" />
        ) : (
          <Upload className="size-5 text-muted-foreground" />
        )}
      </div>
      <p className="relative text-sm font-semibold tracking-tight text-foreground">
        {isDragging ? "Drop the image here" : "Drop an image or choose a file"}
      </p>
      <p className="relative mt-2 text-xs leading-5 text-muted-foreground">
        PNG, JPG, or WebP up to {MAX_IMAGE_SIZE / 1024 / 1024} MB
        <br />
        Processed locally in your browser
      </p>
    </div>
  );
}
