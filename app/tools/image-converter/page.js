import { ImageConverterTool } from "@/components/tools/image-converter-tool";
import { ToolPage } from "@/components/tools/tool-page";
import { toolPages } from "@/lib/tools/tool-content";

const content = toolPages.convert;

export const metadata = {
  title: "PNG, JPG and WebP Image Converter",
  description: content.description,
  keywords: ["PNG to JPG", "JPG to PNG", "image converter", "convert image to WebP", "WebP converter"],
  alternates: { canonical: `/tools/${content.slug}` },
  openGraph: {
    title: "PNG, JPG and WebP Image Converter | Geiger Studios",
    description: content.description,
    url: `/tools/${content.slug}`,
    type: "website",
    images: [`/tools/${content.slug}/opengraph-image`],
  },
  twitter: {
    card: "summary_large_image",
    title: "PNG, JPG and WebP Image Converter | Geiger Studios",
    description: content.description,
    images: [`/tools/${content.slug}/opengraph-image`],
  },
};

export default function ImageConverterPage() {
  return <ToolPage content={content}><ImageConverterTool /></ToolPage>;
}
