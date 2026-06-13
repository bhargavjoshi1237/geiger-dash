export const MAX_IMAGE_SIZE = 25 * 1024 * 1024;

export const IMAGE_ACCEPT = "image/png,image/jpeg,image/webp";

export const formatBytes = (bytes) => {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";

  const units = ["B", "KB", "MB", "GB"];
  const unitIndex = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );
  const value = bytes / 1024 ** unitIndex;

  return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
};

export const getFileStem = (filename = "image") =>
  filename.replace(/\.[^/.]+$/, "") || "image";

export const loadImageFile = (file) =>
  new Promise((resolve, reject) => {
    const supportedTypes = ["image/png", "image/jpeg", "image/webp"];

    if (!file || !supportedTypes.includes(file.type)) {
      reject(new Error("Choose a PNG, JPG, or WebP image."));
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      reject(new Error("Images must be 25 MB or smaller."));
      return;
    }

    const url = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      resolve({
        file,
        image,
        url,
        width: image.naturalWidth,
        height: image.naturalHeight,
      });
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("This image could not be opened."));
    };
    image.decoding = "async";
    image.src = url;
  });

export const canvasToBlob = (canvas, mimeType, quality) =>
  new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("The browser could not create the image."));
      },
      mimeType,
      quality,
    );
  });

export const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export const renderImage = async ({
  image,
  source,
  width,
  height,
  mimeType,
  quality,
  background,
}) => {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));

  const context = canvas.getContext("2d", { alpha: mimeType !== "image/jpeg" });
  if (!context) {
    throw new Error("Your browser could not start the image processor.");
  }

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";

  if (background) {
    context.fillStyle = background;
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  context.drawImage(
    image,
    source?.x ?? 0,
    source?.y ?? 0,
    source?.width ?? image.naturalWidth,
    source?.height ?? image.naturalHeight,
    0,
    0,
    canvas.width,
    canvas.height,
  );

  const blob = await canvasToBlob(canvas, mimeType, quality);
  return { blob, previewUrl: URL.createObjectURL(blob) };
};
