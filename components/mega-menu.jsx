import Link from "next/link";
import { ArrowRight, Box, Zap, Layers, Cpu, ContainerIcon, LucideComponent } from "lucide-react";

export function MegaMenu() {
  return (
    <nav className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-8 text-sm font-medium text-[#a3a3a3]">
      <div className="group">
        <button className="flex items-center gap-1 hover:text-[#e7e7e7] transition-colors py-6">
          Features
        </button>

        {/* Mega Menu Dropdown */}
        <div className="absolute top-[100%] left-1/2 -translate-x-1/2 w-[900px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 origin-top">
          <div className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-8 shadow-2xl flex gap-8">
            {/* Left Section */}
            <div className="flex-1">
              <h3 className="text-[#a3a3a3] text-xs font-semibold mb-4 uppercase tracking-wider">
                Products
              </h3>
              <div className="grid grid-cols-4 gap-4 mb-6">
                {[
                  {
                    icon: (
                      <ContainerIcon className="w-8 h-8 text-[#a3a3a3] group-hover/item:text-[#e7e7e7] transition-colors" />
                    ),
                    label: "Geiger Flow",
                    href: "/flow",
                  },
                  {
                    icon: (
                      <Zap className="w-8 h-8 text-[#a3a3a3] group-hover/item:text-[#e7e7e7] transition-colors" />
                    ),
                    label: "Geiger Notes",
                    href: "/notes",
                  },
                  {
                    icon: (
                      <Layers className="w-8 h-8 text-[#a3a3a3] group-hover/item:text-[#e7e7e7] transition-colors" />
                    ),
                    label: "Geiger DAM",
                  },
                  {
                    icon: (
                      <LucideComponent className="w-8 h-8 text-[#a3a3a3] group-hover/item:text-[#e7e7e7] transition-colors" />
                    ),
                    label: "Geiger Grey",
                  },
                ].map((item, i) => (
                  <Link
                    href={item.href || "#"}
                    key={i}
                    className="flex flex-col items-center gap-3 group/item"
                  >
                    <div className="w-16 h-16 rounded-xl bg-[#202020] flex items-center justify-center group-hover/item:bg-[#2a2a2a] transition-colors border border-transparent group-hover/item:border-[#333333]">
                      {item.icon}
                    </div>
                    <span className="text-xs text-[#a3a3a3] text-center leading-tight group-hover/item:text-[#e7e7e7] transition-colors">
                      {item.label}
                    </span>
                  </Link>
                ))}
              </div>
              <Link
                href="#features"
                className="inline-flex items-center justify-center gap-2 w-full py-3 bg-[#202020] hover:bg-[#2a2a2a] text-[#e7e7e7] rounded-lg text-sm font-medium transition-colors border border-transparent hover:border-[#333333]"
              >
                Browse All Products
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="w-px bg-[#2a2a2a]" /> {/* Divider */}
            {/* Middle Section */}
            <div className="w-48">
              <h3 className="text-[#a3a3a3] text-xs font-semibold mb-4 uppercase tracking-wider">
                Explore more
              </h3>
              <div className="flex flex-col gap-2">
                <Link
                  href="/changelog"
                  className="py-3 px-4 bg-[#202020] hover:bg-[#2a2a2a] rounded-lg text-sm text-[#a3a3a3] hover:text-[#e7e7e7] transition-colors border border-transparent hover:border-[#333333]"
                >
                  Change Logs
                </Link>
                <Link
                  href="/blog"
                  className="py-3 px-4 bg-[#202020] hover:bg-[#2a2a2a] rounded-lg text-sm text-[#a3a3a3] hover:text-[#e7e7e7] transition-colors border border-transparent hover:border-[#333333]"
                >
                  Blogs
                </Link>
                <Link
                  href="#"
                  className="py-3 px-4 bg-[#202020] hover:bg-[#2a2a2a] rounded-lg text-sm text-[#a3a3a3] hover:text-[#e7e7e7] transition-colors border border-transparent hover:border-[#333333]"
                >
                  Github Repository
                </Link>
              </div>
            </div>
            <div className="w-px bg-[#2a2a2a]" /> {/* Divider */}
            {/* Right Section */}
            <div className="w-56">
              <h3 className="text-[#a3a3a3] text-xs font-semibold mb-4 uppercase tracking-wider">
                Host
              </h3>
              <Link
                href="#"
                className="block p-4 bg-[#202020] hover:bg-[#2a2a2a] rounded-xl transition-colors group/card border border-transparent hover:border-[#333333]"
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <h4 className="text-sm font-bold text-[#e7e7e7] mb-1">
                      Geiger v1.0
                    </h4>
                    <p className="text-xs text-[#a3a3a3] line-clamp-2">
                     Self Host Geiger on your own infrastructure and take full control of your data and privacy.
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

      <Link href="/pricing" className="hover:text-[#e7e7e7] transition-colors py-6">
        Pricing
      </Link>
    </nav>
  );
}
