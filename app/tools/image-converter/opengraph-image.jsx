import {
  createToolSocialImage,
  socialImageContentType,
  socialImageSize,
} from "@/lib/social/create-tool-social-image";

export const alt = "Convert PNG, JPG, and WebP images with Geiger Studios";
export const size = socialImageSize;
export const contentType = socialImageContentType;

export default function Image() {
  return createToolSocialImage({
    eyebrow: "Free image converter",
    title: "Convert PNG, JPG, and WebP.",
    detail: "Change image formats directly in your browser, without an upload queue.",
    accent: "#a78bfa",
  });
}

