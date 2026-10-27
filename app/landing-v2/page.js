import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SessionHeader } from "@/components/session-header";
import { SessionLink } from "@/components/session-link";
import Footer from "@/components/footer";
import { GlassBackdrop } from "@/components/glass-backdrop/glass_backdrop";
import Section from "@/components/section";
import LandingBoardShowcase from "@/components/notes-playground/LandingBoardShowcase";
import EventsPlaygroundShowcase from "@/components/events-playground/EventsPlaygroundShowcase";
import CollaboratorTabsShowcase from "@/components/collaborator-tabs-showcase";
import PlaygroundFrame from "@/components/playground-frame";
import BlogComponent from "@/components/blog_component";
import { displayFont } from "@/components/suite-landing/display_font";
import { StartPaths } from "@/components/suite-landing/start_paths";
import { ShippingLog } from "@/components/suite-landing/shipping_log";
import { SpectrumHeader } from "@/components/why-geiger/why_geiger_kit";
import { getRandomShowcaseBackgrounds } from "@/lib/showcase-backgrounds";
// Statically generated and served from the CDN; the build fails if anything here starts reading request-time data.
export const dynamic = "error";
// ISR window: matches the notice cache so scheduled notices, new posts and the showcase shuffle refresh in the background.
export const revalidate = 60;

// Experimental duplicate of the home page with the fluted-glass hero in place of the grid; kept out of search until it replaces "/".
export const metadata = {
  title: "Landing preview",
  robots: {
    index: false,
    follow: true,
  },
};

export default function LandingV2() {
  const [notesShowcaseBg, eventsShowcaseBg, flowShowcaseBg] =
    getRandomShowcaseBackgrounds(3);

  return (
    <div className={`${displayFont.variable} flex min-h-screen w-full flex-col overflow-x-clip bg-background text-foreground selection:bg-indigo-500/30 font-sans`}>
      <SessionHeader />

      <main className="relative z-10 flex flex-1 flex-col">
        <section className="relative isolate mb-10 flex w-full flex-col items-center px-4 text-center sm:px-6">
          <GlassBackdrop className="absolute inset-0 -z-10 mx-auto w-full max-w-[1200px]" />
          <div className="flex max-w-3xl flex-col items-center pt-[220px] pb-[130px] sm:pt-[330px] sm:pb-[210px]">
            <h1 className="text-4xl leading-[1.02] font-semibold tracking-[-0.035em] text-balance text-foreground [font-family:var(--font-display)] [font-stretch:112%] sm:text-6xl dark:[text-shadow:0_4px_4px_rgb(0_0_0/0.15)]">
              Built to Manage. Designed to Create
            </h1>
            <p className="mt-6 max-w-xl text-sm text-balance text-foreground/85 sm:text-lg dark:[text-shadow:0_4px_4px_rgb(0_0_0/0.25)]">
              Turn your ideas into something real with a single suite that combines solid management tools and
              easy-to-use creative features.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <SessionLink
                label="Log in to Start"
                signedInLabel="Get in Your Workspace"
                className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:text-base"
              >
                <ArrowRight className="h-4 w-4" />
              </SessionLink>
              <Link
                href="/why-geiger"
                className="inline-flex h-10 items-center rounded-full border border-border-strong bg-background/40 px-6 text-sm font-medium text-foreground backdrop-blur-md transition-colors hover:bg-surface-hover/70 sm:text-base"
              >
                Why Geiger
              </Link>
            </div>
          </div>
        </section>

        <Section />

        <div className="mx-auto my-10 w-full max-w-7xl space-y-8 px-4 sm:my-20 sm:space-y-20 sm:px-6">
          <LandingBoardShowcase
            backgroundImage={notesShowcaseBg}
            ctaHref="/login"
            ctaLabel="Checkout Notes"
          />
          <EventsPlaygroundShowcase
            backgroundImage={eventsShowcaseBg}
            ctaHref="/login"
            ctaLabel="Checkout Events"
          />
          <CollaboratorTabsShowcase
            backgroundImage={flowShowcaseBg}
            ctaHref="/login"
            ctaLabel="Checkout Notes"
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
            <div className="relative h-full w-full overflow-hidden rounded-lg border border-border dark:border-[#313131] bg-background shadow-2xl">
              <PlaygroundFrame src="/assets/playground" title="Geiger Assets playground" />
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

        <StartPaths />
        <ShippingLog />

        <div className="flex flex-col gap-10 sm:gap-20 mt-10">




          
          <BlogComponent />

         
        </div>

        <section className="relative z-20 overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:py-32">
          <div className="container mx-auto relative z-10 flex flex-col items-center text-center">
            <div className="mb-12 w-full max-w-6xl sm:mb-16">
              <SpectrumHeader />
            </div>
            <h3 className="mb-4 text-xs font-semibold tracking-widest text-muted-foreground uppercase sm:text-sm">
              Open source from day one
            </h3>
            <h2 className="mb-8 bg-gradient-to-b from-foreground to-text-tertiary bg-clip-text text-3xl font-black tracking-tighter text-transparent drop-shadow-lg sm:mb-10 sm:text-5xl lg:text-6xl">
              TRY GEIGER NOW
            </h2>
            <div className="flex w-full max-w-md flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <SessionLink
                label="Studio"
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:w-auto"
              >
                <ArrowRight className="h-4 w-4" />
              </SessionLink>
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
