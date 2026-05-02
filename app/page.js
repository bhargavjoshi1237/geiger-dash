import Link from "next/link";
import { ArrowRight, Box, Zap, Share2, Layers, Cpu, Globe, Workflow, ShieldCheck, Network, Database, Check, Terminal, Github, Figma, Code2 } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import HeroCanvas from "@/components/hero-canvas/HeroCanvas";
import { Header } from "@/components/header";
import  Footer from "@/components/footer";
import Section from "@/components/section";
import LandingBoardShowcase from "@/components/notes-playground/LandingBoardShowcase";
import LandingCanvasShowcase from "@/components/canvas-playground/LandingCanvasShowcase";
import ClientAssetsPlayground from "@/components/assets-playground/ClientAssetsPlayground";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id;

  return (
    <div className="flex min-h-screen w-full flex-col bg-zinc-950 text-zinc-100 selection:bg-indigo-500/30 font-sans">
      <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,#80808030_1px,transparent_1px),linear-gradient(to_bottom,#80808030_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      
      <Header />

      <main className="relative z-10 flex-1 flex flex-col pt-20">
        <section className="mb-10 mt-16 items-start justify-start w-[70%] ml-auto mr-auto flex">
          <div>
            <h1 className="text-3xl font-semibold text-white mb-4">
            Built to Manage. Designed to Create
          </h1>
          <p className="text-zinc-400 mb-6 max-w-2xl">
            Turn your ideas into something real with a single suite that combines solid management tools and easy-to-use creative features.
          </p><Link
            href="/"
            className="inline-flex items-center gap-2 h-10 px-6 rounded-full bg-zinc-100 text-zinc-950 font-medium hover:bg-white transition-colors"
          >
           Log in to Start
            <ArrowRight className="h-4 w-4" />
          </Link>
          </div>
        </section>       
          <Section  />
       
          <div className="my-20 mx-auto w-[80%] max-w-7xl space-y-20">
            <LandingBoardShowcase ctaHref={userId ? `/notes/${userId}/home` : "/login"} ctaLabel="Start Board Playground" />
            <LandingCanvasShowcase ctaHref={userId ? `/canvas/${userId}/home` : "/login"} ctaLabel="Explore Geiger Canvas" />
          </div>

          <div className="h-[900px] ml-auto mr-auto mb-20 w-[80%] relative rounded-sm bg-cover bg-center bg-no-repeat" style={{backgroundImage: "url('https://cursor.com/marketing-static/_next/image?url=https%3A%2F%2Fptht05hbb1ssoooe.public.blob.vercel-storage.com%2Fassets%2Fmisc%2Fasset-00a586c62c8782e65c0a.jpg&w=1920&q=70')"}}>
            <div className="absolute inset-0 flex flex-col mx-10 mt-14 mb-18">
              <div className="flex-1 relative h-full w-full rounded-lg overflow-hidden border border-[#313131] shadow-2xl bg-[#161616]">
                  <ClientAssetsPlayground />
              </div>
            </div>
          </div>

    
        <section className="py-32 px-6 relative overflow-hidden z-20">
             <div className="container mx-auto text-center relative z-10 flex flex-col items-center">
                <h3 className="text-sm font-semibold text-zinc-500 tracking-widest uppercase mb-4">Open source from day one</h3>
                <h2 className="text-4xl md:text-6xl font-black mb-10 tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500 drop-shadow-lg">
                    Build in a weekend, <br className="hidden md:block"/><span className="text-zinc-300">scale to millions</span>
                </h2>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
                    <Link
                    href={userId ? `/notes/${userId}/home` : "/login"}
                    className="inline-flex h-14 w-full px-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-950 font-bold text-lg hover:bg-white transition-colors shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95 duration-200"
                    >
                    Start                    </Link>
                    <Link
                    href="#"
                    className="inline-flex h-14 w-full px-8 items-center justify-center rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-300 font-medium text-lg hover:bg-zinc-800 transition-colors backdrop-blur-sm"
                    >
                    Request a demo
                    </Link>
                </div>
             </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
