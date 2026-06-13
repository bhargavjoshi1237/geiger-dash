import {
  createToolSocialImage,
  socialImageContentType,
  socialImageSize,
} from "@/lib/social/create-tool-social-image";

export const alt = "Free browser-based image tools from Geiger Studios";
export const size = socialImageSize;
export const contentType = socialImageContentType;

export default function Image() {
  return createToolSocialImage({
    eyebrow: "Geiger utility desk",
    title: "Free image tools, without the upload queue.",
    detail: "Crop, resize, compress, and convert PNG, JPG, and WebP images.",
    accent: "#38bdf8",
  });
}

