import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PublicHeader } from "@/components/header";
import Footer from "@/components/footer";
import { tools, toolsIndexFeatures } from "@/lib/tools/tool-content";

export const metadata = {
  title: "Free Image Tools",
  description:
    "Crop, resize, compress, and convert PNG, JPG, and WebP images with free browser-based tools. No uploads, account, or watermark.",
  alternates: { canonical: "/tools" },
  openGraph: {
    title: "Free Image Tools | Geiger Studios",
    description:
      "Private browser-based tools for cropping, resizing, compressing, and converting images.",
    url: "/tools",
    type: "website",
    images: ["/tools/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Image Tools | Geiger Studios",
    description:
      "Crop, resize, compress, and convert images privately in your browser.",
    images: ["/tools/opengraph-image"],
  },
};

export default function ToolsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Geiger Image Tools",
    url: "https://geiger.studio/tools",
    description: metadata.description,
    hasPart: tools.map((tool) => ({
      "@type": "WebApplication",
      name: tool.name,
      url: `https://geiger.studio/tools/${tool.slug}`,
      applicationCategory: "MultimediaApplication",
    })),
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(to_right,#80808024_1px,transparent_1px),linear-gradient(to_bottom,#80808024_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_70%_45%_at_50%_0%,#000_55%,transparent_100%)]" />
      <PublicHeader />
      <main className="relative z-10">
        <section className="border-b border-border px-4 pb-12 pt-28 sm:px-6 sm:pb-16 sm:pt-32">
          <div className="mx-auto max-w-6xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Image utilities
            </p>
            <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Fast image tools, built into Geiger.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              Crop, resize, compress, and convert images without sending them to a server. Free to use, no account required, and no watermark added.
            </p>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="grid gap-4 lg:grid-cols-3">
            {tools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.slug}
                  href={`/tools/${tool.slug}`}
                  className="group relative min-h-64 overflow-hidden rounded-xl border border-border bg-surface-subtle p-5 transition-colors hover:border-border-strong hover:bg-surface-card"
                >
                  <span className="font-mono text-xs text-muted-foreground">0{index + 1}</span>
                  <div className="absolute right-5 top-5 flex size-10 items-center justify-center rounded-xl border border-border bg-background">
                    <Icon className="size-4 text-muted-foreground" />
                  </div>
                  <div className="absolute inset-x-6 bottom-6">
                    <h2 className="text-lg font-semibold tracking-tight">{tool.name}</h2>
                    <p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">{tool.shortDescription}</p>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium">
                      Open tool <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="border-y border-border bg-surface-subtle/50">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:grid-cols-3 sm:px-6 sm:py-20">
            {toolsIndexFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title}>
                  <Icon className="size-5 text-muted-foreground" />
                  <h2 className="mt-7 text-base font-medium">{feature.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </section>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
