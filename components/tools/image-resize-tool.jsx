"use client";

import { useEffect, useMemo, useState } from "react";
import { Link2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileDropzone } from "@/components/tools/file-dropzone";
import { ImagePreview } from "@/components/tools/image-preview";
import {
  Field,
  ProcessButton,
  ResultCard,
} from "@/components/tools/tool-controls";
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
  "image/webp": "webp",
  "image/jpeg": "jpg",
  "image/png": "png",
};

export function ImageResizeTool() {
  const [source, setSource] = useState(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [locked, setLocked] = useState(true);
  const [format, setFormat] = useState("image/webp");
  const [quality, setQuality] = useState(82);
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);

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

  const filename = useMemo(
    () =>
      source
        ? `${getFileStem(source.file.name)}-${width}x${height}.${formats[format]}`
        : "",
    [format, height, source, width],
  );

  const chooseFile = async (file) => {
    try {
      const nextSource = await loadImageFile(file);
      if (source?.url) URL.revokeObjectURL(source.url);
      setSource(nextSource);
      setWidth(nextSource.width);
      setHeight(nextSource.height);
      setResult(null);
      trackToolFileSelected("image-resize", file);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const updateWidth = (nextWidth) => {
    const safeWidth = Math.max(1, Math.min(12000, Number(nextWidth) || 1));
    setWidth(safeWidth);
    if (locked && source) {
      setHeight(Math.max(1, Math.round(safeWidth / (source.width / source.height))));
    }
  };

  const updateHeight = (nextHeight) => {
    const safeHeight = Math.max(1, Math.min(12000, Number(nextHeight) || 1));
    setHeight(safeHeight);
    if (locked && source) {
      setWidth(Math.max(1, Math.round(safeHeight * (source.width / source.height))));
    }
  };

  const clear = () => {
    if (source?.url) URL.revokeObjectURL(source.url);
    if (result?.previewUrl) URL.revokeObjectURL(result.previewUrl);
    setSource(null);
    setResult(null);
  };

  const resize = async () => {
    if (!source) return;
    setBusy(true);
    try {
      if (result?.previewUrl) URL.revokeObjectURL(result.previewUrl);
      const nextResult = await renderImage({
          image: source.image,
          width,
          height,
          mimeType: format,
          quality: quality / 100,
          background: format === "image/jpeg" ? "#ffffff" : null,
        });
      setResult(nextResult);
      trackToolProcessed("image-resize", {
        output_format: formats[format],
        output_width: width,
        output_height: height,
      });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBusy(false);
    }
  };

  if (!source) return <FileDropzone onFile={chooseFile} />;

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
      <ImagePreview source={source} onClear={clear} />
      <aside className="rounded-xl border border-border bg-background/75 p-4">
        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm font-medium">Resize settings</p>
          <Button
            type="button"
            size="icon-sm"
            variant={locked ? "secondary" : "ghost"}
            aria-label={locked ? "Unlock aspect ratio" : "Lock aspect ratio"}
            onClick={() => setLocked((value) => !value)}
          >
            <Link2 />
          </Button>
        </div>
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Width" hint="px">
              <Input
                type="number"
                min={1}
                max={12000}
                value={width}
                onChange={(e) => updateWidth(e.target.value)}
              />
            </Field>
            <Field label="Height" hint="px">
              <Input
                type="number"
                min={1}
                max={12000}
                value={height}
                onChange={(e) => updateHeight(e.target.value)}
              />
            </Field>
          </div>
          <Field label="Output format">
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="image/webp">WebP</SelectItem>
                <SelectItem value="image/jpeg">JPG</SelectItem>
                <SelectItem value="image/png">PNG</SelectItem>
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
          <ProcessButton busy={busy} label="Resize image" onClick={resize} />
        </div>
        <ResultCard
          result={result}
          filename={filename}
          onDownload={() => {
            trackToolDownload("image-resize", {
              output_format: formats[format],
            });
            downloadBlob(result.blob, filename);
          }}
        />
      </aside>
    </div>
  );
}
