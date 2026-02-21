import Link from "next/link";
import { ArrowRight, Box, Zap, Layers, Cpu } from "lucide-react";

export function MegaMenu() {
  return (
    <nav className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-8 text-sm font-medium text-zinc-400">
      <div className="group">
        <button className="flex items-center gap-1 hover:text-zinc-100 transition-colors py-6">
          Features
        </button>

        {/* Mega Menu Dropdown */}
        <div className="absolute top-[100%] left-1/2 -translate-x-1/2 w-[900px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 origin-top">
          <div className="bg-zinc-900/95 backdrop-blur-xl border border-zinc-800 rounded-[2rem] p-8 shadow-2xl flex gap-8">
            {/* Left Section */}
            <div className="flex-1">
              <h3 className="text-zinc-400 text-xs font-semibold mb-4 uppercase tracking-wider">
                Features
              </h3>
              <div className="grid grid-cols-4 gap-4 mb-6">
                {[
                  {
                    icon: (
                      <Box className="w-8 h-8 text-zinc-300 group-hover/item:text-zinc-100 transition-colors" />
                    ),
                    label: "Geiger Flow",
                    href: "/flow",
                  },
                  {
                    icon: (
                      <Zap className="w-8 h-8 text-zinc-300 group-hover/item:text-zinc-100 transition-colors" />
                    ),
                    label: "Geiger Notes",
                    href: "/notes",
                  },
                  {
                    icon: (
                      <Layers className="w-8 h-8 text-zinc-300 group-hover/item:text-zinc-100 transition-colors" />
                    ),
                    label: "Geiger DAM",
                  },
                  {
                    icon: (
                      <Cpu className="w-8 h-8 text-zinc-300 group-hover/item:text-zinc-100 transition-colors" />
                    ),
                    label: "Geiger Grey",
                  },
                ].map((item, i) => (
                  <Link
                    href={item.href || "#"}
                    key={i}
                    className="flex flex-col items-center gap-3 group/item"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-zinc-800/50 flex items-center justify-center group-hover/item:bg-zinc-800 transition-colors border border-transparent group-hover/item:border-zinc-700">
                      {item.icon}
                    </div>
                    <span className="text-xs text-zinc-300 text-center leading-tight group-hover/item:text-zinc-100 transition-colors">
                      {item.label}
                    </span>
                  </Link>
                ))}
              </div>
              <Link
                href="#features"
                className="inline-flex items-center justify-center gap-2 w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-xl text-sm font-medium transition-colors"
              >
                Browse all features
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="w-px bg-zinc-800" /> {/* Divider */}
            {/* Middle Section */}
            <div className="w-48">
              <h3 className="text-zinc-400 text-xs font-semibold mb-4 uppercase tracking-wider">
                Explore more
              </h3>
              <div className="flex flex-col gap-2">
                {[
                  "Templates & Guides",
                  "Integrations",
                  "Security & Privacy",
                ].map((item, i) => (
                  <Link
                    href="#"
                    key={i}
                    className="py-3 px-4 bg-zinc-800/30 hover:bg-zinc-800 rounded-xl text-sm text-zinc-300 hover:text-zinc-100 transition-colors"
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>
            <div className="w-px bg-zinc-800" /> {/* Divider */}
            {/* Right Section */}
            <div className="w-56">
              <h3 className="text-zinc-400 text-xs font-semibold mb-4 uppercase tracking-wider">
                Discover
              </h3>
              <Link
                href="#"
                className="block p-4 bg-zinc-800/30 hover:bg-zinc-800 rounded-2xl transition-colors group/card"
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <h4 className="text-sm font-bold text-zinc-100 mb-1">
                      Geiger v1.0
                    </h4>
                    <p className="text-xs text-zinc-400 line-clamp-2">
                      Experience the stealth workspace for high-performance
                      teams.
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex-shrink-0 flex items-center justify-center group-hover/card:scale-110 transition-transform">
                    <Box className="w-5 h-5 text-white" />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Link
        href="#about"
        className="hover:text-zinc-100 transition-colors py-6"
      >
        About
      </Link>
      <Link href="#" className="hover:text-zinc-100 transition-colors py-6">
        Pricing
      </Link>
    </nav>
  );
}
