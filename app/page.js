import Link from "next/link";
import { ArrowRight, Box, Zap, Share2, Layers, Cpu, Globe } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { LogoutButton } from "@/components/logout-button";
import HeroCanvas from "@/components/hero-canvas/HeroCanvas";

export default async function Home() {
  const supabase =  await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id;

  return (
    <div className="flex min-h-screen w-full flex-col bg-zinc-950 text-zinc-100 selection:bg-indigo-500/30 font-sans">
      <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,#80808030_1px,transparent_1px),linear-gradient(to_bottom,#80808030_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between relative">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center">
              <img src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/logo1.svg`} alt="Logo" width={24} height={24} />
            </div>
            <span className="font-bold text-xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-400">Geiger Studios</span>
          </div>
          <nav className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-8 text-sm font-medium text-zinc-400">
            <Link href="#features" className="hover:text-zinc-100 transition-colors">Features</Link>
            <Link href="#about" className="hover:text-zinc-100 transition-colors">About</Link>
            <Link href="#" className="hover:text-zinc-100 transition-colors">Pricing</Link>
          </nav>
          <div className="flex items-center gap-4">
            {userId ? (
              <>
                <Link
                  href={`/notes/${userId}/home`}
                  className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors"
                >
                  Dashboard
                </Link>
                <LogoutButton />
              </>
            ) : (
              <Link
                href="/login"
                className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col pt-20">
        <section className="relative py-20 md:py-32 px-6 overflow-hidden">
          <div className="container mx-auto max-w-6xl flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900/50 border border-zinc-800 text-xs font-medium text-zinc-300 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 backdrop-blur-sm">
              <span className="relative flex h-2 w-2 mr-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              v1.0 is now live
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-600 animate-in fade-in slide-in-from-bottom-6 duration-1000 fill-mode-both drop-shadow-2xl">
              Think at the speed <br /> of Light.
            </h1>          
            <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 fill-mode-both font-light">
              Geiger is the stealth workspace for high-performance teams. 
              <span className="text-zinc-100 font-medium"> Infinite canvas</span>, 
              <span className="text-zinc-100 font-medium"> real-time collaboration</span>, 
              and powerful tools to map out your next big idea.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both w-full max-w-md mx-auto">
              {userId ? (
                <Link
                  href={`/notes/${userId}/home`}
                  className="h-14 px-8 rounded-full bg-zinc-100 text-zinc-950 font-bold flex items-center justify-center gap-2 hover:bg-white hover:scale-105 transition-all active:scale-95 w-full shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                >
                  Dashboard
                  <ArrowRight className="w-5 h-5" />
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="h-14 px-8 rounded-full bg-zinc-100 text-zinc-950 font-bold flex items-center justify-center gap-2 hover:bg-white hover:scale-105 transition-all active:scale-95 w-full shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                >
                  Start
                  <ArrowRight className="w-5 h-5" />
                </Link>
              )}
              <Link
                href="#features"
                className="h-14 px-8 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 font-medium flex items-center justify-center gap-2 hover:bg-zinc-800 hover:border-zinc-600 transition-all w-full"
              >
                View Features
              </Link>
            </div>
            
          </div>
        </section>
        
        <section className="-mt-16 py-12 md:py-24 px-6 relative z-10">
          <div className="container mx-auto max-w-6xl">
             <div className="relative rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-xl aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden shadow-2xl group">
                {/* Decorative gradients */}
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-zinc-500 to-transparent opacity-50" />
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-zinc-500 to-transparent opacity-20" />
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-700" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/20 transition-all duration-700" />
                
                {/* Mock UI */}
                <div className="absolute inset-0 flex flex-col">
                  {/* Toolbar */}
                  <div className="h-12 md:h-14 border-b border-zinc-800 flex items-center justify-between px-4 md:px-6 bg-zinc-950/50">
                    <div className="flex gap-2">
                       <div className="w-2.5 md:w-3 h-2.5 md:h-3 rounded-full bg-zinc-700" />
                       <div className="w-2.5 md:w-3 h-2.5 md:h-3 rounded-full bg-zinc-800" />
                       <div className="w-2.5 md:w-3 h-2.5 md:h-3 rounded-full bg-zinc-800" />
                    </div>
                    <div className="h-2 w-24 md:w-32 bg-zinc-800/50 rounded-full opacity-0 md:opacity-100" />
                    <div className="w-6 md:w-8 h-6 md:h-8 rounded-full bg-zinc-800/50" />
                  </div>
                  <div className="flex-1 relative h-full w-full overflow-hidden bg-zinc-950/20">
                      <HeroCanvas />
                  </div>
                </div>
             </div>
          </div>
        </section>

        <section id="features" className="py-32 px-6 relative bg-zinc-950">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-24">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Everything you need.</h2>
              <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
                Built for speed and extensibility. Geiger adapts to your workflow, not the other way around.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[
                {
                  icon: <Box className="w-6 h-6" />,
                  title: "Infinite Canvas",
                  desc: "A boundless space for your ideas. Zoom in for details, zoom out for the big picture.",
                  color: "bg-blue-500/10 text-blue-400"
                },
                {
                  icon: <Zap className="w-6 h-6" />,
                  title: "Real-time Sync",
                  desc: "Collaborate with your team seamlessly. Changes reflect instantly across all devices.",
                   color: "bg-yellow-500/10 text-yellow-400"
                },
                {
                  icon: <Layers className="w-6 h-6" />,
                  title: "Version History",
                  desc: "Never lose a thought. Time travel through your workspace's evolution with ease.",
                   color: "bg-green-500/10 text-green-400"
                },
                {
                  icon: <Share2 className="w-6 h-6" />,
                  title: "Easy Sharing",
                  desc: "Share your workspace with a single link. Control permissions and access levels.",
                   color: "bg-purple-500/10 text-purple-400"
                },
                {
                  icon: <Cpu className="w-6 h-6" />,
                  title: "High Performance",
                  desc: "Engineered for speed. Handles complex diagrams and thousands of nodes without lag.",
                   color: "bg-red-500/10 text-red-400"
                },
                {
                  icon: <Globe className="w-6 h-6" />,
                  title: "Cloud Native",
                  desc: "Access your work from anywhere. Your data is secure and always available.",
                   color: "bg-cyan-500/10 text-cyan-400"
                }
              ].map((feature, i) => (
                <div key={i} className="flex gap-8 p-8 rounded-2xl bg-zinc-900/20">
                  <div className="flex items-center justify-center">
                    {feature.icon}
                  </div>
                 <div className="">
                  <h3 className="text-xl font-bold mb-3 text-zinc-100">{feature.title}</h3>
                  <p className="text-zinc-400 leading-relaxed font-light">
                    {feature.desc}
                  </p>
                 </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="py-20 border-y border-zinc-900 bg-zinc-900/20">
             <div className="container mx-auto max-w-6xl px-6">
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                     {[
                         { label: "Active Users", value: "10k+" },
                         { label: "Diagrams Created", value: "1M+" },
                         { label: "Uptime", value: "99.9%" },
                         { label: "Countries", value: "150+" }
                     ].map((stat, i) => (
                         <div key={i}>
                             <div className="text-3xl md:text-4xl font-black text-white mb-2">{stat.value}</div>
                             <div className="text-xs uppercase tracking-widest text-zinc-500 font-semibold">{stat.label}</div>
                         </div>
                     ))}
                 </div>
             </div>
        </section>
        <section className="py-32 px-6 relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-900/50" />
             <div className="container mx-auto text-center relative z-10">
                <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter">Ready to start building?</h2>
                <p className="text-zinc-400 mb-10 max-w-xl mx-auto text-lg">
                    Join thousands of developers and designers using Geiger to map their future.
                    Free forever for individuals.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                    href={"/login"}
                    className="inline-flex h-14 px-10 items-center justify-center rounded-full bg-white text-zinc-950 font-bold text-lg hover:bg-zinc-200 transition-colors shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 duration-200"
                    >
                    Launch Workspace
                    </Link>
                    <Link
                    href="#"
                    className="inline-flex h-14 px-10 items-center justify-center rounded-full bg-transparent border border-zinc-700 text-zinc-100 font-medium text-lg hover:bg-zinc-800 transition-colors"
                    >
                    Read Documentation
                    </Link>
                </div>
             </div>
        </section>
      </main>
      <div className="mt-10 flex justify-center"><h1 className="text-[13vw] font-bold text-gray-900/5 dark:text-white/5 leading-none tracking-tighter select-none pointer-events-none">GEIGER STUDIO</h1></div>
    </div>
  );
}
