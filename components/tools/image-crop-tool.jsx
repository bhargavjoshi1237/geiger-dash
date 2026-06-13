"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { toast } from "sonner";
import { FileDropzone } from "@/components/tools/file-dropzone";
import { ImagePreview } from "@/components/tools/image-preview";
import {
  Field,
  ProcessButton,
  ResultCard,
} from "@/components/tools/tool-controls";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  downloadBlob,
  getFileStem,
  loadImageFile,
  renderImage,
} from "@/lib/tools/image-tools";
import {
  trackToolDownload,
  trackToolFileSelected,
  trackToolProcessed,
} from "@/lib/analytics/tools";

const formats = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};

export function ImageCropTool() {
  const [source, setSource] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 100, height: 100 });
  const [format, setFormat] = useState("image/png");
  const [quality, setQuality] = useState(90);
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [dragMode, setDragMode] = useState(null);
  const dragStart = useRef({ mx: 0, my: 0, crop: { x: 0, y: 0, width: 0, height: 0 } });
  const containerRef = useRef(null);

  useEffect(() => {
    const url = source?.url;
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [source?.url]);

  useEffect(() => {
    const url = result?.previewUrl;
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [result?.previewUrl]);

  const outputSize = useMemo(
    () =>
      source
        ? {
            width: Math.max(1, Math.round((source.width * crop.width) / 100)),
            height: Math.max(1, Math.round((source.height * crop.height) / 100)),
          }
        : { width: 0, height: 0 },
    [crop.height, crop.width, source],
  );

  const filename = source
    ? `${getFileStem(source.file.name)}-cropped.${formats[format]}`
    : "";

  const chooseFile = async (file) => {
    try {
      const nextSource = await loadImageFile(file);
      if (source?.url) URL.revokeObjectURL(source.url);
      setSource(nextSource);
      setCrop({ x: 0, y: 0, width: 100, height: 100 });
      setResult(null);
      trackToolFileSelected("image-crop", file);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const updateCrop = (key, value) => {
    setCrop((current) => {
      const parsed = Number(value);
      const max = key === "x" ? 100 - current.width : key === "y" ? 100 - current.height : 100;
      const minimum = key === "width" || key === "height" ? 5 : 0;
      const next = Math.max(minimum, Math.min(max, parsed));
      const updated = { ...current, [key]: next };

      if (key === "width" && updated.x + next > 100) updated.x = 100 - next;
      if (key === "height" && updated.y + next > 100) updated.y = 100 - next;
      return updated;
    });
  };

  const clear = () => {
    if (source?.url) URL.revokeObjectURL(source.url);
    if (result?.previewUrl) URL.revokeObjectURL(result.previewUrl);
    setSource(null);
    setResult(null);
  };

  const handleMouseDown = useCallback((e, mode) => {
    e.preventDefault();
    e.stopPropagation();
    setDragMode(mode);
    dragStart.current = {
      mx: e.clientX,
      my: e.clientY,
      crop: { ...crop },
    };
  }, [crop]);

  const handleMouseMove = useCallback((e) => {
    if (!dragMode || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const dx = ((e.clientX - dragStart.current.mx) / rect.width) * 100;
    const dy = ((e.clientY - dragStart.current.my) / rect.height) * 100;
    const prev = dragStart.current.crop;

    setCrop((current) => {
      let updated = { ...current };

      if (dragMode === "move") {
        updated.x = Math.max(0, Math.min(100 - prev.width, prev.x + dx));
        updated.y = Math.max(0, Math.min(100 - prev.height, prev.y + dy));
      } else if (dragMode === "nw") {
        const newX = Math.max(0, prev.x + dx);
        const newY = Math.max(0, prev.y + dy);
        updated.x = newX;
        updated.y = newY;
        updated.width = Math.max(5, prev.x + prev.width - newX);
        updated.height = Math.max(5, prev.y + prev.height - newY);
      } else if (dragMode === "ne") {
        const newY = Math.max(0, prev.y + dy);
        updated.y = newY;
        updated.width = Math.max(5, Math.min(100 - prev.x, prev.width + dx));
        updated.height = Math.max(5, prev.y + prev.height - newY);
      } else if (dragMode === "sw") {
        const newX = Math.max(0, prev.x + dx);
        updated.x = newX;
        updated.width = Math.max(5, prev.x + prev.width - newX);
        updated.height = Math.max(5, Math.min(100 - prev.y, prev.height + dy));
      } else if (dragMode === "se") {
        updated.width = Math.max(5, Math.min(100 - prev.x, prev.width + dx));
        updated.height = Math.max(5, Math.min(100 - prev.y, prev.height + dy));
      } else if (dragMode === "n") {
        const newY = Math.max(0, prev.y + dy);
        updated.y = newY;
        updated.height = Math.max(5, prev.y + prev.height - newY);
      } else if (dragMode === "s") {
        updated.height = Math.max(5, Math.min(100 - prev.y, prev.height + dy));
      } else if (dragMode === "w") {
        const newX = Math.max(0, prev.x + dx);
        updated.x = newX;
        updated.width = Math.max(5, prev.x + prev.width - newX);
      } else if (dragMode === "e") {
        updated.width = Math.max(5, Math.min(100 - prev.x, prev.width + dx));
      }

      return updated;
    });
  }, [dragMode]);

  const handleMouseUp = useCallback(() => {
    setDragMode(null);
  }, []);

  useEffect(() => {
    if (dragMode) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [dragMode, handleMouseMove, handleMouseUp]);

  const cropImage = async () => {
    if (!source) return;
    setBusy(true);
    try {
      if (result?.previewUrl) URL.revokeObjectURL(result.previewUrl);
      const nextResult = await renderImage({
          image: source.image,
          source: {
            x: Math.round((source.width * crop.x) / 100),
            y: Math.round((source.height * crop.y) / 100),
            width: outputSize.width,
            height: outputSize.height,
          },
          width: outputSize.width,
          height: outputSize.height,
          mimeType: format,
          quality: quality / 100,
          background: format === "image/jpeg" ? "#ffffff" : null,
        });
      setResult(nextResult);
      trackToolProcessed("image-crop", {
        output_format: formats[format],
        output_width: outputSize.width,
        output_height: outputSize.height,
      });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBusy(false);
    }
  };

  if (!source) return <FileDropzone onFile={chooseFile} />;

  const handleStyle = "absolute w-3 h-3 bg-white rounded-full border border-gray-400 z-10";

  const overlay = (
    <div
      ref={containerRef}
      className="absolute inset-0"
      style={{ cursor: dragMode ? "grabbing" : "default" }}
    >
      <div className="pointer-events-none absolute inset-0 bg-black/55" />
      <div
        className="absolute border-2 border-white shadow-[0_0_0_1px_rgb(0_0_0/0.3),0_10px_35px_rgb(0_0_0/0.35)]"
        style={{
          left: `${crop.x}%`,
          top: `${crop.y}%`,
          width: `${crop.width}%`,
          height: `${crop.height}%`,
          cursor: "move",
          backgroundImage: `url("${source.url}")`,
          backgroundSize: `${10000 / crop.width}% ${10000 / crop.height}%`,
          backgroundPosition: `${crop.width === 100 ? 0 : (crop.x / (100 - crop.width)) * 100}% ${crop.height === 100 ? 0 : (crop.y / (100 - crop.height)) * 100}%`,
        }}
        onMouseDown={(e) => handleMouseDown(e, "move")}
      >
        {/* Corner handles */}
        <span
          className={`${handleStyle} -left-1.5 -top-1.5 cursor-nw-resize`}
          onMouseDown={(e) => handleMouseDown(e, "nw")}
        />
        <span
          className={`${handleStyle} -right-1.5 -top-1.5 cursor-ne-resize`}
          onMouseDown={(e) => handleMouseDown(e, "ne")}
        />
        <span
          className={`${handleStyle} -bottom-1.5 -left-1.5 cursor-sw-resize`}
          onMouseDown={(e) => handleMouseDown(e, "sw")}
        />
        <span
          className={`${handleStyle} -bottom-1.5 -right-1.5 cursor-se-resize`}
          onMouseDown={(e) => handleMouseDown(e, "se")}
        />

        {/* Edge handles */}
        <span
          className={`${handleStyle} top-1/2 -left-1.5 -translate-y-1/2 cursor-w-resize`}
          onMouseDown={(e) => handleMouseDown(e, "w")}
        />
        <span
          className={`${handleStyle} top-1/2 -right-1.5 -translate-y-1/2 cursor-e-resize`}
          onMouseDown={(e) => handleMouseDown(e, "e")}
        />
        <span
          className={`${handleStyle} left-1/2 -top-1.5 -translate-x-1/2 cursor-n-resize`}
          onMouseDown={(e) => handleMouseDown(e, "n")}
        />
        <span
          className={`${handleStyle} left-1/2 -bottom-1.5 -translate-x-1/2 cursor-s-resize`}
          onMouseDown={(e) => handleMouseDown(e, "s")}
        />

        {/* Rule of thirds grid */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/30" />
          <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/30" />
          <div className="absolute top-1/3 left-0 right-0 h-px bg-white/30" />
          <div className="absolute top-2/3 left-0 right-0 h-px bg-white/30" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_310px]">
      <ImagePreview source={source} onClear={clear} overlay={overlay} />
      <aside className="rounded-xl border border-border bg-background/75 p-4">
        <p className="mb-1 text-sm font-medium">Crop area</p>
        <p className="mb-5 text-xs text-muted-foreground">
          Output: {outputSize.width} x {outputSize.height} px
        </p>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Left" hint={`${crop.x}%`}>
              <Slider
                min={0}
                max={100 - crop.width}
                value={[crop.x]}
                onValueChange={([val]) => updateCrop("x", val)}
              />
            </Field>
            <Field label="Top" hint={`${crop.y}%`}>
              <Slider
                min={0}
                max={100 - crop.height}
                value={[crop.y]}
                onValueChange={([val]) => updateCrop("y", val)}
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Width" hint="%">
              <Input
                type="number"
                min={5}
                max={100}
                value={crop.width}
                onChange={(e) => updateCrop("width", e.target.value)}
              />
            </Field>
            <Field label="Height" hint="%">
              <Input
                type="number"
                min={5}
                max={100}
                value={crop.height}
                onChange={(e) => updateCrop("height", e.target.value)}
              />
            </Field>
          </div>
          <Field label="Output format">
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="image/png">PNG</SelectItem>
                <SelectItem value="image/jpeg">JPG</SelectItem>
                <SelectItem value="image/webp">WebP</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          {format !== "image/png" ? (
            <Field label="Quality" hint={`${quality}%`}>
              <Slider
                min={35}
                max={100}
                value={[quality]}
                onValueChange={([val]) => setQuality(val)}
              />
            </Field>
          ) : null}
          <ProcessButton busy={busy} label="Crop image" onClick={cropImage} />
        </div>
        <ResultCard
          result={result}
          filename={filename}
          onDownload={() => {
            trackToolDownload("image-crop", {
              output_format: formats[format],
            });
            downloadBlob(result.blob, filename);
          }}
        />
      </aside>
    </div>
  );
}
