import Link from "next/link";
import { ArrowRight, Zap, Layers, Cpu, ContainerIcon } from "lucide-react";

export function MegaMenu() {
  const products = [
    {
      icon: ContainerIcon,
      label: "Geiger Flow",
      description: "Plan and track work.",
      href: "/flow",
    },
    {
      icon: Zap,
      label: "Geiger Notes",
      description: "Write and collaborate.",
      href: "/notes",
    },
    {
      icon: Layers,
      label: "Geiger DAM",
      description: "Manage your media.",
      href: "#",
    },
    {
      icon: Cpu,
      label: "Geiger Grey",
      description: "AI workspace tools.",
      href: "#",
    },
  ];

  const resources = [
    { label: "Changelog", href: "/changelog" },
    { label: "Blog", href: "/blog" },
    { label: "GitHub Repository", href: "#" },
    { label: "Self Host Geiger", href: "#" },
  ];

  return (
    <nav className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-8 text-sm font-medium text-zinc-400">
      <div className="group">
        <button className="flex items-center gap-1 py-6 transition-colors hover:text-zinc-100">
          Features
        </button>

        <div className="invisible absolute left-1/2 top-[100%] w-[640px] -translate-x-1/2 translate-y-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 shadow-xl">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">Products</p>
                <div className="space-y-1">
                  {products.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        href={item.href}
                        key={item.label}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-zinc-800"
                      >
                        <Icon className="h-4 w-4 text-zinc-400" />
                        <div>
                          <p className="text-sm text-zinc-100">{item.label}</p>
                          <p className="text-xs text-zinc-500">{item.description}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">Resources</p>
                <div className="space-y-1">
                  {resources.map((item) => (
                    <Link
                      href={item.href}
                      key={item.label}
                      className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
                    >
                      {item.label}
                      <ArrowRight className="h-3.5 w-3.5 text-zinc-500" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Link href="/pricing" className="py-6 transition-colors hover:text-zinc-100">
        Pricing
      </Link>
    </nav>
  );
}
