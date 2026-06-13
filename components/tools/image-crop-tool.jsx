"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { FileDropzone } from "@/components/tools/file-dropzone";
import { ImagePreview } from "@/components/tools/image-preview";
import {
  Field,
  NumberInput,
  ProcessButton,
  RangeInput,
  ResultCard,
  SelectInput,
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

  const overlay = (
    <>
      <div className="pointer-events-none absolute inset-0 bg-black/55" />
      <div
        className="pointer-events-none absolute border-2 border-white shadow-[0_0_0_1px_rgb(0_0_0/0.3),0_10px_35px_rgb(0_0_0/0.35)]"
        style={{
          left: `${crop.x}%`,
          top: `${crop.y}%`,
          width: `${crop.width}%`,
          height: `${crop.height}%`,
          backgroundImage: `url("${source.url}")`,
          backgroundSize: `${10000 / crop.width}% ${10000 / crop.height}%`,
          backgroundPosition: `${crop.width === 100 ? 0 : (crop.x / (100 - crop.width)) * 100}% ${crop.height === 100 ? 0 : (crop.y / (100 - crop.height)) * 100}%`,
        }}
      >
        <span className="absolute -left-1 -top-1 size-2 rounded-full bg-white" />
        <span className="absolute -right-1 -top-1 size-2 rounded-full bg-white" />
        <span className="absolute -bottom-1 -left-1 size-2 rounded-full bg-white" />
        <span className="absolute -bottom-1 -right-1 size-2 rounded-full bg-white" />
      </div>
    </>
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
              <RangeInput min="0" max={100 - crop.width} value={crop.x} onChange={(event) => updateCrop("x", event.target.value)} />
            </Field>
            <Field label="Top" hint={`${crop.y}%`}>
              <RangeInput min="0" max={100 - crop.height} value={crop.y} onChange={(event) => updateCrop("y", event.target.value)} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Width" hint="%">
              <NumberInput min="5" max="100" value={crop.width} onChange={(event) => updateCrop("width", event.target.value)} />
            </Field>
            <Field label="Height" hint="%">
              <NumberInput min="5" max="100" value={crop.height} onChange={(event) => updateCrop("height", event.target.value)} />
            </Field>
          </div>
          <Field label="Output format">
            <SelectInput value={format} onChange={(event) => setFormat(event.target.value)}>
              <option value="image/png">PNG</option>
              <option value="image/jpeg">JPG</option>
              <option value="image/webp">WebP</option>
            </SelectInput>
          </Field>
          {format !== "image/png" ? (
            <Field label="Quality" hint={`${quality}%`}>
              <RangeInput min="35" max="100" value={quality} onChange={(event) => setQuality(Number(event.target.value))} />
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
