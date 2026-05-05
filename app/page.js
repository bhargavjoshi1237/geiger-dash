import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
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

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Geiger Studios",
  url: "https://geiger.studio/",
};

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id;

  return (
    <div className="flex min-h-screen w-full flex-col bg-zinc-950 text-zinc-100 selection:bg-indigo-500/30 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,#80808030_1px,transparent_1px),linear-gradient(to_bottom,#80808030_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <Header />

      <main className="relative z-10 flex flex-1 flex-col pt-16 sm:pt-20">
        <section className="mx-auto mt-10 mb-10 flex w-full max-w-6xl items-start justify-start px-4 sm:mt-16 sm:px-6">
          <div className="max-w-3xl">
            <h1 className="mb-4 text-2xl font-semibold text-white sm:text-3xl">Built to Manage. Designed to Create</h1>
            <p className="mb-6 text-sm text-zinc-400 sm:text-base">
              Turn your ideas into something real with a single suite that combines solid management tools and
              easy-to-use creative features.
            </p>
            <Link
              href="/"
              className="inline-flex h-10 items-center gap-2 rounded-full bg-zinc-100 px-6 text-sm font-medium text-zinc-950 transition-colors hover:bg-white sm:text-base"
            >
              Log in to Start
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <Section />
        
        <div className="mt-22 mb-10 w-full">
          <TrustedByComponent />
        </div>

        <div className="mx-auto my-10 w-full max-w-7xl space-y-8 px-4 sm:my-20 sm:space-y-20 sm:px-6">
          <LandingBoardShowcase ctaHref={userId ? `/notes/${userId}/home` : "/login"} ctaLabel="Start Board Playground" />
          <LandingCanvasShowcase ctaHref={userId ? `/canvas/${userId}/home` : "/login"} ctaLabel="Explore Geiger Canvas" />
          <CollaboratorTabsShowcase ctaHref={userId ? `/notes/${userId}/home` : "/login"} ctaLabel="Open Collaborator Dialogue"/>
        </div>

        <div
          className="relative mx-auto mb-12 h-[520px] w-full max-w-[85%] rounded-sm bg-cover bg-center bg-no-repeat px-3 py-3 sm:mb-20 sm:h-[700px] sm:px-6 sm:py-8 lg:h-[900px]"
          style={{
            backgroundImage:
              "url('https://cursor.com/marketing-static/_next/image?url=https%3A%2F%2Fptht05hbb1ssoooe.public.blob.vercel-storage.com%2Fassets%2Fmisc%2Fasset-00a586c62c8782e65c0a.jpg&w=1920&q=70')",
          }}
        >
          <div className="flex h-full flex-col">
            <div className="relative h-full w-full overflow-hidden rounded-lg border border-[#313131] bg-[#161616] shadow-2xl">
              <ClientAssetsPlayground />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-10 sm:gap-20">
          <ChangeLogComponent />




          
          <BlogComponent />

         
        </div>

        <section className="relative z-20 overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:py-32">
          <div className="container mx-auto relative z-10 flex flex-col items-center text-center">
            <h3 className="mb-4 text-xs font-semibold tracking-widest text-zinc-500 uppercase sm:text-sm">
              Open source from day one
            </h3>
            <h2 className="mb-8 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-3xl font-black tracking-tighter text-transparent drop-shadow-lg sm:mb-10 sm:text-5xl lg:text-6xl">
              TRY GEIGER NOW
            </h2>
            <div className="flex w-full max-w-md flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Link
                href="/"
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-zinc-100 px-6 text-sm font-medium text-zinc-950 transition-colors hover:bg-white sm:w-auto"
              >
                Login To The Studio
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/"
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-zinc-100 px-6 text-sm font-medium text-zinc-950 transition-colors hover:bg-white sm:w-auto"
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
