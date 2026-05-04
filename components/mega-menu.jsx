"use client";

import Link from "next/link";
import { ArrowRight, Zap, Layers, Cpu, ContainerIcon, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function MegaMenu({ userId }) {
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
    { label: "Documentation", href: "/docs" },
    { label: "Changelog", href: "/changelog" },
    { label: "Blog", href: "/blog" },
    { label: "GitHub Repository", href: "#" },
    { label: "Self Host Geiger", href: "#" },
  ];

  return (
    <>
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

      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon-sm" className="text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="h-dvh overflow-y-auto border-zinc-800 bg-zinc-950 text-zinc-100">
            <SheetHeader className="border-b border-zinc-800 pb-4">
              <SheetTitle>Geiger Navigation</SheetTitle>
              <SheetDescription className="text-zinc-500">
                Browse products, resources, and pricing.
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-6 px-4 pb-6">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Products</p>
                {products.map((item) => {
                  const Icon = item.icon;
                  return (
                    <SheetClose asChild key={item.label}>
                      <Link
                        href={item.href}
                        className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-200"
                      >
                        <Icon className="h-4 w-4 text-zinc-400" />
                        <div>
                          <p>{item.label}</p>
                          <p className="text-xs text-zinc-500">{item.description}</p>
                        </div>
                      </Link>
                    </SheetClose>
                  );
                })}
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Resources</p>
                {resources.map((item) => (
                  <SheetClose asChild key={item.label}>
                    <Link
                      href={item.href}
                      className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-200"
                    >
                      {item.label}
                      <ArrowRight className="h-4 w-4 text-zinc-500" />
                    </Link>
                  </SheetClose>
                ))}
              </div>

              <SheetClose asChild>
                <Link
                  href="/pricing"
                  className="inline-flex w-full items-center justify-center rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900"
                >
                  View Pricing
                </Link>
              </SheetClose>

              <SheetClose asChild>
                <Link
                  href={userId ? `/notes/${userId}/home` : "/login"}
                  className="inline-flex w-full items-center justify-center rounded-lg border border-zinc-700 bg-transparent px-4 py-2 text-sm font-medium text-zinc-100"
                >
                  {userId ? "Open Dashboard" : "Sign In"}
                </Link>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
