import Link from "next/link";
import { ArrowRight, Box, Zap, Share2, Layers, Cpu, Globe, Workflow, ShieldCheck, Network, Database, Check, Terminal, Github, Figma, Code2 } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import HeroCanvas from "@/components/hero-canvas/HeroCanvas";
import { Header } from "@/components/header";
import  Footer from "@/components/footer";

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
        <section className="relative py-20 px-6 overflow-hidden">
          <div className="container mx-auto max-w-5xl flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900/50 border border-zinc-800 text-xs font-medium text-zinc-300 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 backdrop-blur-sm">
              <span className="relative flex h-2 w-2 mr-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              v1.0 is now live
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-600 animate-in fade-in slide-in-from-bottom-6 duration-1000 fill-mode-both drop-shadow-2xl">
              Build the ideas <br />
              <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-indigo-300 to-emerald-400">Scale to millions</span>
            </h1>          
            <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 fill-mode-both">
              Geiger is the stealth workspace for teams. 
              <span className="text-zinc-100 font-medium"> Infinite canvas</span>, 
              <span className="text-zinc-100 font-medium"> real-time collaboration</span>, 
              and powerful tools to map and manage your next big idea.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both">
                <Link
                  href={userId ? `/notes/${userId}/home` : "/login"}
                  className="h-14 px-8 rounded-full bg-zinc-100 text-zinc-950 font-bold flex items-center justify-center gap-2 hover:bg-white hover:scale-105 transition-all active:scale-95 w-full shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                >
                  Start New Project<ArrowRight className="w-5 h-5 ml-1" />
                </Link>
            </div>
          </div>
        </section>
        <section id="features" className="py-20 px-6 relative">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 auto-rows-min">
                
                {/* 1. Geiger Flow */}
                <div className="col-span-1 md:col-span-2 lg:col-span-6 flex flex-col p-8 rounded-3xl bg-zinc-900/30 border border-zinc-800/50 hover:bg-zinc-900/50 transition-colors group backdrop-blur-sm relative overflow-hidden h-full min-h-[400px]">
                   <div className="absolute -bottom-3 -right-1 opacity-[0.05] md:opacity-20 md:group-hover:opacity-40 transition-opacity duration-700 pointer-events-none z-0">
                       <Workflow className="w-64 h-64 md:w-[300px] md:h-[300px] text-[#e7e7e7] stroke-[0.5]" />
                   </div>
                   <div className="relative z-10">
                       <div className="flex items-center gap-3 mb-4">
                           <Workflow className="w-6 h-6 text-[#e7e7e7] hidden md:block" />
                           <h3 className="text-xl font-bold text-zinc-100">Geiger Flow</h3>
                           <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 tracking-wide uppercase">Flagship</span>
                       </div>
                       <p className="text-zinc-400 font-light text-sm max-w-sm leading-relaxed mb-8">
                           Lightweight creative project manager featuring Kanban and Timeline views. Manage processes and track milestones.
                       </p>
                   </div>
                   <div className="relative z-10 mt-auto space-y-3">
                       {["100% portable views", "Built-in Node discussions", "Easy to orchestrate"].map((feature, i) => (
                           <div key={i} className="flex items-center gap-3 text-sm text-zinc-300">
                               <Check className="w-4 h-4 text-[#e7e7e7]" />
                               <span>{feature}</span>
                           </div>
                       ))}
                   </div>
                </div>

                {/* 2. Geiger Notes */}
                <div className="col-span-1 md:col-span-1 lg:col-span-3 flex flex-col p-8 rounded-3xl bg-zinc-900/30 border border-zinc-800/50 hover:bg-zinc-900/50 transition-colors group backdrop-blur-sm relative overflow-hidden h-full min-h-[400px]">
                    <div className="absolute -bottom-8 -right-8 opacity-[0.05] pointer-events-none md:hidden z-0">
                        <Zap className="w-64 h-64 text-[#e7e7e7] stroke-[0.5]" />
                    </div>
                    <div className="relative z-10 mb-6">
                        <div className="flex items-center gap-3 mb-4">
                           <Zap className="w-5 h-5 text-[#e7e7e7] hidden md:block" />
                           <h3 className="text-xl font-bold text-zinc-100">Geiger Notes</h3>
                        </div>
                        <p className="text-zinc-400 font-light text-sm leading-relaxed">
                           Visual boards for brainstorms. Collaborate in real-time on an infinite canvas.
                        </p>
                    </div>
                    <div className="mt-auto w-full pt-4">
                        <div className="grid grid-cols-2 gap-2">
                           <div className="rounded-lg border border-zinc-800/80 bg-zinc-950/50 px-3 py-4 flex flex-col items-center justify-center text-[10px] sm:text-xs text-zinc-500 font-mono truncate group-hover:border-zinc-600/50 transition-colors group-hover:text-zinc-300">
                             project_alpha
                           </div>
                           <div className="rounded-lg border border-zinc-800/80 bg-zinc-950/50 px-3 py-4 flex flex-col items-center justify-center text-[10px] sm:text-xs text-zinc-500 font-mono truncate group-hover:border-zinc-600/50 transition-colors group-hover:text-zinc-300">
                             q3_roadmap
                           </div>
                           <div className="rounded-lg border border-zinc-800/80 bg-zinc-950/50 px-3 py-4 flex flex-col items-center justify-center text-[10px] sm:text-xs text-zinc-500 font-mono truncate opacity-30 blur-[2px] pointer-events-none">
                             hidden_node
                           </div>
                           <div className="rounded-lg border border-zinc-800/80 bg-zinc-950/50 px-3 py-4 flex flex-col items-center justify-center text-[10px] sm:text-xs text-zinc-500 font-mono truncate opacity-30 blur-[2px] pointer-events-none">
                             hidden_node
                           </div>
                           <div className="rounded-lg border border-zinc-800/80 bg-zinc-950/50 px-3 py-4 flex flex-col items-center justify-center text-[10px] sm:text-xs text-zinc-500 font-mono truncate group-hover:border-zinc-600/50 transition-colors group-hover:text-zinc-300">
                             user_flow_v2
                           </div>
                           <div className="rounded-lg border border-zinc-800/80 bg-zinc-950/50 px-3 py-4 flex flex-col items-center justify-center text-[10px] sm:text-xs text-zinc-500 font-mono truncate group-hover:border-zinc-600/50 transition-colors group-hover:text-zinc-300">
                             design_system
                           </div>
                        </div>
                    </div>
                </div>

                {/* 3. Geiger DAM */}
                <div className="col-span-1 md:col-span-1 lg:col-span-3 flex flex-col p-8 rounded-3xl bg-zinc-900/30 border border-zinc-800/50 hover:bg-zinc-900/50 transition-colors group backdrop-blur-sm relative overflow-hidden h-full min-h-[400px]">
                    <div className="absolute -bottom-8 -right-8 opacity-[0.05] pointer-events-none md:hidden z-0">
                        <Layers className="w-64 h-64 text-[#e7e7e7] stroke-[0.5]" />
                    </div>
                    <div className="relative z-10 mb-6">
                        <div className="flex items-center gap-3 mb-4">
                           <Layers className="w-5 h-5 text-[#e7e7e7] hidden md:block" />
                           <h3 className="text-xl font-bold text-zinc-100">Geiger DAM</h3>
                        </div>
                        <p className="text-zinc-400 font-light text-sm leading-relaxed">
                           Digital Assets Manager. Secure storage, metadata tagging, and CDN configuration.
                        </p>
                    </div>
                    <div className="mt-auto h-32 w-full relative rounded-xl overflow-hidden flex flex-col justify-end">
                        <div className="grid grid-cols-4 gap-2 opacity-50 group-hover:opacity-100 transition-opacity duration-500">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="group aspect-square rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:border-zinc-700 transition-colors">
                                    <Box className="w-4 h-4 text-zinc-700 group-hover:text-[#e7e7e7] transition-colors" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 4. Geiger Grey */}
                <div className="col-span-1 md:col-span-2 lg:col-span-4 flex flex-col p-8 rounded-3xl bg-zinc-900/30 border border-zinc-800/50 hover:bg-zinc-900/50 transition-colors group backdrop-blur-sm relative overflow-hidden h-full min-h-[300px]">
                    <div className="relative z-10 mb-6">
                        <div className="flex items-center gap-3 mb-4">
                           <Network className="w-5 h-5 text-[#e7e7e7] hidden md:block" />
                           <h3 className="text-xl font-bold text-zinc-100">Geiger Grey</h3>
                        </div>
                        <p className="text-zinc-400 font-light text-sm leading-relaxed">
                           Knowledge Graph. Visualize complex data relationships securely within your workspace.
                        </p>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 top-32 overflow-hidden flex items-center justify-center pointer-events-none z-0">
                       <img src="https://supabase.com/images/index/products/vector-dark.svg" alt="Vector Dark" className="w-[120%] h-auto max-w-[320px] object-contain dark:hiddendark:block opacity-70 group-hover:opacity-100 transition-opacity duration-500 scale-105" />
                       <img src="https://supabase.com/images/index/products/vector-light.svg" alt="Vector Light" className="w-[120%] h-auto max-w-[320px] object-contain hidden  opacity-70 group-hover:opacity-100 transition-opacity duration-500 scale-105" />
                    </div>
                </div>

                {/* 5. Self-Hosted */}
                <div className="col-span-1 md:col-span-1 lg:col-span-4 flex flex-col p-8 rounded-3xl bg-zinc-900/30 border border-zinc-800/50 hover:bg-zinc-900/50 transition-colors group backdrop-blur-sm relative overflow-hidden h-full min-h-[300px]">
                    <div className="absolute -bottom-8 -right-8 opacity-[0.05] pointer-events-none md:hidden z-0">
                        <Database className="w-64 h-64 text-[#e7e7e7] stroke-[0.5]" />
                    </div>
                    <div className="relative z-10 mb-6">
                        <div className="flex items-center gap-3 mb-4">
                           <Database className="w-5 h-5 text-[#e7e7e7] hidden md:block" />
                           <h3 className="text-xl font-bold text-zinc-100">Self-Hosted</h3>
                        </div>
                        <p className="text-zinc-400 font-light text-sm leading-relaxed">
                           Deploy with domain configuration, activity logs, and automated backups for ultimate ownership.
                        </p>
                    </div>
                    <div className="mt-auto w-full relative">
                        <div className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-lg p-5 font-mono text-[11px] sm:text-xs text-zinc-500 shadow-inner group-hover:border-zinc-700 transition-colors">
                            <span className="text-zinc-300">$</span> docker-compose up -d<br/>
                            <span className="text-[#e7e7e7]">✔</span> core-node started<br/>
                            <span className="text-[#e7e7e7]">✔</span> db-layer active
                        </div>
                    </div>
                </div>

                {/* 6. Enterprise Ready */}
                <div className="col-span-1 md:col-span-1 lg:col-span-4 flex flex-col p-8 rounded-3xl bg-zinc-900/30 border border-zinc-800/50 hover:bg-zinc-900/50 transition-colors group backdrop-blur-sm relative overflow-hidden h-full min-h-[300px]">
                    <div className="absolute -bottom-8 -right-8 opacity-[0.05] pointer-events-none md:hidden z-0">
                        <ShieldCheck className="w-64 h-64 text-[#e7e7e7] stroke-[0.5]" />
                    </div>
                    <div className="relative z-10 mb-6">
                        <div className="flex items-center gap-3 mb-4">
                           <ShieldCheck className="w-5 h-5 text-[#e7e7e7] hidden md:block" />
                           <h3 className="text-xl font-bold text-zinc-100">Enterprise Ready</h3>
                        </div>
                        <p className="text-zinc-400 font-light text-sm leading-relaxed">
                           Comprehensive admin controls, role-based access, SSO, and compliance standards built natively.
                        </p>
                    </div>
                    <div className="mt-auto w-full flex flex-col gap-2 relative z-10">
                        {["Secure Authentication", "RBAC Policy", "SSO Login enabled"].map((item, i) => (
                            <div key={i} className="w-full flex items-center justify-between p-3 rounded-md border border-zinc-800/30 bg-zinc-950/50 text-xs text-zinc-400 group-hover:border-zinc-700/50 transition-colors">
                                <div className="flex items-center gap-3">
                                   <div className="w-4 h-4 opacity-70"><ShieldCheck className="w-full h-full text-[#e7e7e7]" /></div>
                                   {item}
                                </div>
                                <span className="text-[10px] text-zinc-600 font-mono hidden sm:inline-block">.../v1/policy</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
          </div>
        </section>

        {/* USE WITH ANY FRAMEWORK: Supabase Layout, Geiger Theme */}
        <section className="py-16 border-y border-zinc-800/50 bg-zinc-950/50 backdrop-blur-sm relative z-20">
            <div className="container mx-auto max-w-5xl px-6 flex flex-col md:flex-row items-center justify-between gap-8 py-4">
                <h2 className="text-lg font-medium text-zinc-300 leading-tight">Explore the complete<br/><span className="text-zinc-500">Geiger feature suite</span></h2>
                <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
                    <Workflow className="w-7 h-7 text-zinc-600 hover:text-zinc-300 transition-colors" />
                    <Zap className="w-7 h-7 text-zinc-600 hover:text-zinc-300 transition-colors" />
                    <Layers className="w-7 h-7 text-zinc-600 hover:text-zinc-300 transition-colors" />
                    <Network className="w-7 h-7 text-zinc-600 hover:text-zinc-300 transition-colors" />
                    <Database className="w-7 h-7 text-zinc-600 hover:text-zinc-300 transition-colors" />
                    <ShieldCheck className="w-7 h-7 text-zinc-600 hover:text-zinc-300 transition-colors" />
                    <Share2 className="w-7 h-7 text-zinc-600 hover:text-zinc-300 transition-colors" />
                </div>
            </div>
        </section>

        {/* TRUSTED BY: Supabase Layout, Geiger Theme */}
        <section className="py-24 px-6 text-center relative z-20">
            <h2 className="text-sm font-semibold text-zinc-500 tracking-widest uppercase mb-12">Trusted by the world's most innovative companies</h2>
            <div className="container mx-auto max-w-5xl">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {["Acme Corp", "Globex", "Initech", "Soylent", "Massive Dynamic", "Hooli", "Pied Piper", "Stark Ind"].map(company => (
                        <div key={company} className="h-20 rounded-2xl bg-zinc-900/20 border border-zinc-800/50 flex items-center justify-center text-zinc-600 font-bold text-lg hover:bg-zinc-900/40 hover:text-zinc-400 transition-colors cursor-default backdrop-blur-md">
                            {company}
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* START BUILDING IN SECONDS: Supabase Layout, Geiger Theme */}
        <section className="py-24 px-6 bg-zinc-900/10 border-y border-zinc-800/30 relative z-20">
            <div className="container mx-auto max-w-5xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-500 mb-4 tracking-tighter">Start building in seconds</h2>
                    <p className="text-zinc-400 text-lg">Follow our quick guide to launch your first workspace.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 relative">
                    <div className="hidden md:block absolute top-[28px] left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent z-0"></div>
                    {[
                        { step: "1", title: "Create project", desc: "Sign in to the dashboard, click 'New Project' and setup your workspace structure." },
                        { step: "2", title: "Invite team", desc: "Add your team members and configure role-based access right away." },
                        { step: "3", title: "Build faster", desc: "Map out architectures on the canvas and transition work items to the Flow board." }
                    ].map((item, i) => (
                        <div key={i} className="relative z-10 flex flex-col items-center text-center">
                            <div className="w-14 h-14 rounded-full bg-zinc-950 border border-zinc-700 flex items-center justify-center text-zinc-100 font-bold text-xl mb-6 shadow-xl relative">
                                {item.step}
                                <div className="absolute inset-0 rounded-full ring-1 ring-white/10 ring-inset"></div>
                            </div>
                            <h3 className="text-xl font-bold text-zinc-100 mb-3">{item.title}</h3>
                            <p className="text-zinc-400 font-light text-sm px-4 leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* DASHBOARD PREVIEW: Supabase Structure, Geiger Original Display Component */}
        <section className="py-24 px-6 relative z-20">
          <div className="container mx-auto max-w-6xl">
             <div className="text-center mb-16">
                 <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-500 mb-4 tracking-tighter">Stay productive</h2>
                 <p className="text-zinc-400 text-lg">Manage your app without leaving the dashboard.</p>
             </div>
             <div className="relative rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-xl aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden shadow-2xl group">
                {/* Decorative gradients from original geiger theme */}
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-zinc-500 to-transparent opacity-50" />
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-700" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/20 transition-all duration-700" />
                
                {/* Mock UI Wrapper */}
                <div className="absolute inset-0 flex flex-col">
                  {/* Toolbar */}
                  <div className="h-12 md:h-14 border-b border-zinc-800 flex items-center px-4 md:px-6 bg-zinc-950/50">
                    <div className="flex gap-2">
                       <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                       <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                       <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    </div>
                  </div>
                  <div className="flex-1 relative h-full w-full overflow-hidden bg-zinc-950/20">
                      <HeroCanvas />
                  </div>
                </div>
             </div>
          </div>
        </section>

        {/* COMMUNITY: Supabase Layout, Geiger Theme */}
        <section className="py-24 px-6 relative bg-zinc-900/10 border-t border-zinc-800/30 z-20">
            <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-500 mb-4 tracking-tighter">Join the community</h2>
                    <p className="text-zinc-400 text-lg max-w-xl mx-auto">Discover what our open source community is creating with the Geiger toolkit.</p>
                </div>
                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                    {[
                        { name: "sarah_dev", role: "Frontend Lead", text: "Geiger's canvas feels lightyears ahead of anything else. My team is completely migrated. The workflow is seamless." },
                        { name: "johndoe", role: "Product Manager", text: "The Kanban integration directly into the canvas nodes is the feature I didn't know I needed." },
                        { name: "tech_lead", role: "CTO", text: "Self-hosting Geiger was surprisingly easy. The documentation is top notch and the Docker setup just works out of the box." },
                        { name: "design_system", role: "UX Designer", text: "Finally a workspace alternative that understands design principles. Clean, stealthy, and highly functional." },
                        { name: "alice_b", role: "Data Engineer", text: "I've been using the Knowledge Graph for mapping out our internal services. It's simply stunning." },
                        { name: "mike_codes", role: "Fullstack Developer", text: "Open source, fast, and gorgeous UI. What more could you ask for? Highly recommended for indie hackers." },
                    ].map((item, i) => (
                        <div key={i} className="bg-zinc-900/30 border min-h-42 border-zinc-800/50 rounded-3xl p-6 break-inside-avoid backdrop-blur-sm hover:border-zinc-700/50 transition-colors">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold text-sm shadow-inner">
                                    {item.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-zinc-100">@{item.name}</div>
                                    <div className="text-xs text-zinc-500">{item.role}</div>
                                </div>
                            </div>
                            <p className="text-zinc-400 text-sm leading-relaxed">{item.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* OUTRO: Supabase Layout, Geiger Theme */}
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
