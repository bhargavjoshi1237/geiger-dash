import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/header";
import Footer from "@/components/footer";
import Section from "@/components/section";
import LandingBoardShowcase from "@/components/notes-playground/LandingBoardShowcase";
import LandingCanvasShowcase from "@/components/canvas-playground/LandingCanvasShowcase";
import CollaboratorTabsShowcase from "@/components/canvas-playground/CollaboratorTabsShowcase";
import ClientAssetsPlayground from "@/components/assets-playground/ClientAssetsPlayground";
import ChangeLogComponent from "@/components/change_log_component";
import BlogComponent from "@/components/blog_component";
import TrustedByComponent from "@/components/trusted_by_component";
import { createClient } from "@/utils/supabase/server";
import { getUser } from "@/supabase/user/getUser";

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Geiger Studios",
  url: "https://geiger.studio/",
};

export const metadata = {
  alternates: {
    canonical: "/",
  },
};

const showcaseBackgroundImages = [
  "https://200rfrtp5x71tlmk.public.blob.vercel-storage.com/geiger-dash/cursor-assets/asset-00a586c62c8782e65c0a.jpg",
  "https://200rfrtp5x71tlmk.public.blob.vercel-storage.com/geiger-dash/cursor-assets/internal-brand-023-3291bb4c.jpg",
  "https://200rfrtp5x71tlmk.public.blob.vercel-storage.com/geiger-dash/cursor-assets/asset-0ec1f3ba625f482c9dc3.jpg",
  "https://200rfrtp5x71tlmk.public.blob.vercel-storage.com/geiger-dash/cursor-assets/asset-85923e7fafe00c9c0d1f.jpg",
  "https://200rfrtp5x71tlmk.public.blob.vercel-storage.com/geiger-dash/cursor-assets/asset-8e2e88cff7f33224ddd7.jpg",
  "https://200rfrtp5x71tlmk.public.blob.vercel-storage.com/geiger-dash/cursor-assets/asset-0a66efa21dd4b7e6c526.jpg",
  "https://200rfrtp5x71tlmk.public.blob.vercel-storage.com/geiger-dash/cursor-assets/asset-cc24ca462279ca23250c.jpg",
];

function getRandomShowcaseBackgrounds(count) {
  const shuffledImages = [...showcaseBackgroundImages].sort(() => Math.random() - 0.5);

  return Array.from(
    { length: count },
    (_, index) => shuffledImages[index % shuffledImages.length],
  );
}

export default async function Home() {
  const supabase = await createClient();
  const user = await getUser(supabase);

  const [notesShowcaseBg, canvasShowcaseBg, flowShowcaseBg] =
    getRandomShowcaseBackgrounds(3);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground selection:bg-indigo-500/30 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,#80808030_1px,transparent_1px),linear-gradient(to_bottom,#80808030_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <Header />

      <main className="relative z-10 flex flex-1 flex-col pt-16 sm:pt-20">
        <section className="mx-auto mt-10 mb-10 flex w-full max-w-6xl items-start justify-start px-4 sm:mt-16 sm:px-6">
          <div className="max-w-3xl">
            <h1 className="mb-4 text-2xl font-semibold text-foreground sm:text-3xl">Built to Manage. Designed to Create</h1>
            <p className="mb-6 text-sm text-muted-foreground sm:text-base">
              Turn your ideas into something real with a single suite that combines solid management tools and
              easy-to-use creative features.
            </p>
            <Link
              href={user ? "/org" : "/login"}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:text-base"
            >
              {user ? "Get in Your Workspace" : "Log in to Start"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <Section />
        
        <div className="mt-22 mb-10 w-full">
          <TrustedByComponent />
        </div>

        <div className="mx-auto my-10 w-full max-w-7xl space-y-8 px-4 sm:my-20 sm:space-y-20 sm:px-6">
          <LandingBoardShowcase
            backgroundImage={notesShowcaseBg}
            ctaHref="/login"
            ctaLabel="Checkout Notes"
          />
          <LandingCanvasShowcase
            backgroundImage={canvasShowcaseBg}
            ctaHref="/login"
            ctaLabel="Checkout Canvas"
          />
          <CollaboratorTabsShowcase
            backgroundImage={flowShowcaseBg}
            ctaHref="/login"
            ctaLabel="Checkout Flow"
          />
        </div>

        <div
          className="relative mx-auto mb-12 h-[520px] w-full max-w-[85%] rounded-sm bg-cover bg-center bg-no-repeat px-3 py-3 sm:mb-20 sm:h-[700px] sm:px-6 sm:py-8 lg:h-[900px]"
          style={{
            backgroundImage:
              "url('https://200rfrtp5x71tlmk.public.blob.vercel-storage.com/geiger-dash/cursor-assets/asset-00a586c62c8782e65c0a.jpg')",
          }}
        >
          <div className="flex h-full flex-col">
            <div className="relative h-full w-full overflow-hidden rounded-lg border border-[#313131] bg-background shadow-2xl">
              <ClientAssetsPlayground />
            </div>
          </div>
        </div>

        <section className="mx-auto mb-10 w-full max-w-6xl px-4 sm:mb-16 sm:px-6">
          <p className="mb-2 text-xs font-semibold tracking-widest text-muted-foreground uppercase">Made for how you work</p>
          <h2 className="mb-8 text-2xl font-semibold text-foreground sm:text-3xl">Your whole team, one workspace</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
            {[
              {
                image: "https://200rfrtp5x71tlmk.public.blob.vercel-storage.com/geiger-dash/data_curv_assets/role-swe.jpg",
                label: "Corporate",
                desc: "Structured workflows and shared visibility across every department.",
              },
              {
                image: "https://200rfrtp5x71tlmk.public.blob.vercel-storage.com/geiger-dash/data_curv_assets/role-research.jpg",
                label: "Creative",
                desc: "A workspace that moves as faster as your ideas. & help you focus on what matters most.",
              },
              {
                image: "https://200rfrtp5x71tlmk.public.blob.vercel-storage.com/geiger-dash/data_curv_assets/role-ops.jpg",
                label: "Management",
                desc: "Full project visibility and team progress — from a single view.",
              },
            ].map(({ image, label, desc }) => (
              <div key={label} className="group relative h-[420px] overflow-hidden rounded-xl sm:h-[520px]">
                <img
                  src={image}
                  alt={label}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 p-5 sm:p-6">
                  <p className="text-lg font-semibold text-white sm:text-xl">{label}</p>
                  <p className="mt-1 text-sm text-white/65">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="flex flex-col gap-10 sm:gap-20 mt-10">
          <ChangeLogComponent />




          
          <BlogComponent />

         
        </div>

        <section className="relative z-20 overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:py-32">
          <div className="container mx-auto relative z-10 flex flex-col items-center text-center">
            <h3 className="mb-4 text-xs font-semibold tracking-widest text-foreground0 uppercase sm:text-sm">
              Open source from day one
            </h3>
            <h2 className="mb-8 bg-gradient-to-b from-foreground to-text-tertiary bg-clip-text text-3xl font-black tracking-tighter text-transparent drop-shadow-lg sm:mb-10 sm:text-5xl lg:text-6xl">
              TRY GEIGER NOW
            </h2>
            <div className="flex w-full max-w-md flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Link
                href={user ? "/org" : "/login"}
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:w-auto"
              >
                Studio
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:w-auto"
              >
                Contact Sales
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
