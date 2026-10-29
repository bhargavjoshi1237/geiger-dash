import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SessionHeader } from "@/components/session-header";
import { SessionLink } from "@/components/session-link";
import Footer from "@/components/footer";
import { GridBackdrop } from "@/components/grid-backdrop";
import Section from "@/components/section";
import LandingBoardShowcase from "@/components/notes-playground/LandingBoardShowcase";
import EventsPlaygroundShowcase from "@/components/events-playground/EventsPlaygroundShowcase";
import GreyPlaygroundShowcase from "@/components/grey-playground/GreyPlaygroundShowcase";
import PlaygroundFrame from "@/components/playground-frame";
import BlogComponent from "@/components/blog_component";
import { displayFont } from "@/components/suite-landing/display_font";
import { StartPaths } from "@/components/suite-landing/start_paths";
import { TeamCards } from "@/components/suite-landing/team_cards";
import { ShippingLog } from "@/components/suite-landing/shipping_log";
import { SpectrumHeader } from "@/components/why-geiger/why_geiger_kit";
import { getRandomShowcaseBackgrounds } from "@/lib/showcase-backgrounds";
// Statically generated and served from the CDN; the build fails if anything here starts reading request-time data.
export const dynamic = "error";
// ISR window: matches the notice cache so scheduled notices, new posts and the showcase shuffle refresh in the background.
export const revalidate = 60;

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

export default function Home() {
  const [notesShowcaseBg, eventsShowcaseBg, greyShowcaseBg] =
    getRandomShowcaseBackgrounds(3);

  return (
    <div className={`${displayFont.variable} flex min-h-screen w-full flex-col overflow-x-clip bg-background text-foreground selection:bg-indigo-500/30 font-sans`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <GridBackdrop />

      <SessionHeader />

      <main className="relative z-10 flex flex-1 flex-col pt-16 sm:pt-20">
        <section className="mx-auto mt-10 mb-10 flex w-full max-w-6xl items-start justify-start px-4 sm:mt-16 sm:px-6">
          <div className="max-w-3xl">
            <h1 className="mb-4 text-2xl font-semibold text-foreground sm:text-3xl">Built to Manage. Designed to Create</h1>
            <p className="mb-6 text-sm text-muted-foreground sm:text-base">
              Turn your ideas into something real with a single suite that combines solid management tools and
              easy-to-use creative features.
            </p>
            <div className="flex flex-wrap items-center gap-3">
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
          <GreyPlaygroundShowcase
            backgroundImage={greyShowcaseBg}
            ctaHref="/login"
            ctaLabel="Checkout Grey"
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

        <TeamCards />

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
