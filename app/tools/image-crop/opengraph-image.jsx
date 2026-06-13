import {
  createToolSocialImage,
  socialImageContentType,
  socialImageSize,
} from "@/lib/social/create-tool-social-image";

export const alt = "Crop images online with Geiger Studios";
export const size = socialImageSize;
export const contentType = socialImageContentType;

export default function Image() {
  return createToolSocialImage({
    eyebrow: "Free image cropper",
    title: "Crop an image without uploading it.",
    detail: "Choose the exact area and export PNG, JPG, or WebP in seconds.",
    accent: "#f59e0b",
  });
}

