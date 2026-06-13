import { ImageCropTool } from "@/components/tools/image-crop-tool";
import { ToolPage } from "@/components/tools/tool-page";
import { toolPages } from "@/lib/tools/tool-content";

const content = toolPages.crop;

export const metadata = {
  title: "Crop Image Online Free",
  description: content.description,
  keywords: ["crop image", "image cropper", "crop photo online", "crop PNG", "crop JPG", "crop WebP"],
  alternates: { canonical: `/tools/${content.slug}` },
  openGraph: {
    title: "Crop Image Online Free | Geiger Studios",
    description: content.description,
    url: `/tools/${content.slug}`,
    type: "website",
    images: [`/tools/${content.slug}/opengraph-image`],
  },
  twitter: {
    card: "summary_large_image",
    title: "Crop Image Online Free | Geiger Studios",
    description: content.description,
    images: [`/tools/${content.slug}/opengraph-image`],
  },
};

export default function ImageCropPage() {
  return <ToolPage content={content}><ImageCropTool /></ToolPage>;
}
