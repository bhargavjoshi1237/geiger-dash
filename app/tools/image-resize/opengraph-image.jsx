import {
  createToolSocialImage,
  socialImageContentType,
  socialImageSize,
} from "@/lib/social/create-tool-social-image";

export const alt = "Resize and compress images with Geiger Studios";
export const size = socialImageSize;
export const contentType = socialImageContentType;

export default function Image() {
  return createToolSocialImage({
    eyebrow: "Free image resizer",
    title: "Resize and compress in one pass.",
    detail: "Set exact dimensions, control quality, and download a smaller image.",
    accent: "#22c55e",
  });
}

