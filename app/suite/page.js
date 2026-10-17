import { SessionHeader } from "@/components/session-header";
import Footer from "@/components/footer";
import { landingFont } from "@/components/landing/landing_font";
import { LandingHero } from "@/components/landing/hero";
import { LaunchSequence } from "@/components/landing/launch_sequence";
import { SharedLayer } from "@/components/landing/shared_layer";
import { PlanGlance } from "@/components/landing/plan_glance";
import { RecentReleases } from "@/components/landing/recent_releases";
import { LandingClosing } from "@/components/landing/closing";

// Statically generated and served from the CDN; the build fails if anything here starts reading request-time data.
export const dynamic = "error";
// ISR window: matches the public-content cache so new changelog entries refresh in the background.
export const revalidate = 60;

export const metadata = {
  title: "The Suite",
  description: "Every Geiger app on one account: events, campaigns, projects, forms, media, AI search and more, sharing one sign-in, one team and one bill.",
  alternates: {
    canonical: "/suite",
  },
};

export default function SuitePage() {
  return (
    <div className={`${landingFont.variable} flex min-h-screen w-full flex-col bg-background font-sans text-foreground`}>
      <SessionHeader />

      <main className="relative flex flex-1 flex-col pt-16 sm:pt-20">
        <LandingHero />
        <LaunchSequence />
        <SharedLayer />
        <PlanGlance />
        <RecentReleases />
        <LandingClosing />
      </main>

      <Footer />
    </div>
  );
}
