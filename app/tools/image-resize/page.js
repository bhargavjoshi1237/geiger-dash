import { ImageResizeTool } from "@/components/tools/image-resize-tool";
import { ToolPage } from "@/components/tools/tool-page";
import { toolPages } from "@/lib/tools/tool-content";

const content = toolPages.resize;

export const metadata = {
  title: "Resize and Compress Image Online",
  description: content.description,
  keywords: ["resize image", "compress image", "image resizer", "reduce image size", "resize photo"],
  alternates: { canonical: `/tools/${content.slug}` },
  openGraph: {
    title: "Resize and Compress Image Online | Geiger Studios",
    description: content.description,
    url: `/tools/${content.slug}`,
    type: "website",
    images: [`/tools/${content.slug}/opengraph-image`],
  },
  twitter: {
    card: "summary_large_image",
    title: "Resize and Compress Image Online | Geiger Studios",
    description: content.description,
    images: [`/tools/${content.slug}/opengraph-image`],
  },
};

export default function ImageResizePage() {
  return <ToolPage content={content}><ImageResizeTool /></ToolPage>;
}
