"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
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
  "image/jpeg": { label: "JPG", extension: "jpg" },
  "image/png": { label: "PNG", extension: "png" },
  "image/webp": { label: "WebP", extension: "webp" },
};

export function ImageConverterTool() {
  const [source, setSource] = useState(null);
  const [format, setFormat] = useState("image/webp");
  const [quality, setQuality] = useState(88);
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

  const filename = useMemo(() => {
    if (!source) return "";
    return `${getFileStem(source.file.name)}.${formats[format].extension}`;
  }, [format, source]);

  const chooseFile = async (file) => {
    try {
      const nextSource = await loadImageFile(file);
      if (source?.url) URL.revokeObjectURL(source.url);
      if (result?.previewUrl) URL.revokeObjectURL(result.previewUrl);
      setSource(nextSource);
      setResult(null);
      trackToolFileSelected("image-converter", file);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const clear = () => {
    if (source?.url) URL.revokeObjectURL(source.url);
    if (result?.previewUrl) URL.revokeObjectURL(result.previewUrl);
    setSource(null);
    setResult(null);
  };

  const convert = async () => {
    if (!source) return;
    setBusy(true);

    try {
      if (result?.previewUrl) URL.revokeObjectURL(result.previewUrl);
      const nextResult = await renderImage({
        image: source.image,
        width: source.width,
        height: source.height,
        mimeType: format,
        quality: quality / 100,
        background: format === "image/jpeg" ? "#ffffff" : null,
      });
      setResult(nextResult);
      trackToolProcessed("image-converter", {
        output_format: formats[format].extension,
      });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBusy(false);
    }
  };

  if (!source) return <FileDropzone onFile={chooseFile} />;

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
      <ImagePreview source={source} onClear={clear} />
      <aside className="rounded-xl border border-border bg-background/75 p-4">
        <p className="mb-5 text-sm font-medium">Conversion settings</p>
        <div className="space-y-5">
          <Field label="Output format">
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(formats).map(([value, item]) => (
                  <SelectItem value={value} key={value}>
                    {item.label}
                  </SelectItem>
                ))}
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
          <p className="rounded-md bg-surface-subtle p-3 text-xs leading-5 text-muted-foreground">
            {format === "image/jpeg"
              ? "Transparent pixels will use a white background in the JPG."
              : "The original image dimensions will be preserved."}
          </p>
          <ProcessButton busy={busy} label="Convert image" onClick={convert} />
        </div>
        <ResultCard
          result={result}
          filename={filename}
          onDownload={() => {
            trackToolDownload("image-converter", {
              output_format: formats[format].extension,
            });
            downloadBlob(result.blob, filename);
          }}
        />
      </aside>
    </div>
  );
}
