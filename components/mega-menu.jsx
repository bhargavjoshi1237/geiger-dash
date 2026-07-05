"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Zap, Layers, Cpu, ContainerIcon, Menu, BriefcaseBusiness, FileText, CalendarDays, Megaphone, MessageSquare, PenTool, FileSignature, LayoutGrid, Webhook, Headset, Headphones, ChevronDown } from "lucide-react";
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
  const notesHref = userId ? `/notes/${userId}/home` : "/notes";
  const closeMenuOnMouseLeave = (event) => {
    const focusedElement = document.activeElement;

    if (focusedElement instanceof HTMLElement && event.currentTarget.contains(focusedElement)) {
      focusedElement.blur();
    }
  };

  const products = [
    {
      icon: Zap,
      label: "Notes",
      description: "Write and collaborate.",
      href: notesHref,
    },
    {
      icon: ContainerIcon,
      label: "Flow",
      description: "Plan and track work.",
      href: "/flow",
    },
    {
      icon: Layers,
      label: "Assets",
      description: "Manage your media.",
      href: "/assets",
    },
    {
      icon: Cpu,
      label: "Grey",
      description: "AI workspace tools.",
      href: "/grey",
    },
    {
      icon: BriefcaseBusiness,
      label: "Office",
      description: "Run office workflows.",
      href: "/office",
    },
    {
      icon: FileText,
      label: "Forms",
      description: "Build forms and surveys.",
      href: "/forms",
    },
    {
      icon: CalendarDays,
      label: "Events",
      description: "Organise & Manage events.",
      href: "/events",
    },
    {
      icon: LayoutGrid,
      label: "Content",
      description: "Your content operating system.",
      href: "/content",
    },
    {
      icon: Megaphone,
      label: "Campaign",
      description: "Run marketing campaigns.",
      href: "/campaign",
    },
    {
      icon: Webhook,
      label: "Pods",
      description: "Edge functions for API calls.",
      href: "/pods",
    },
    {
      icon: Headset,
      label: "Comms",
      description: "Message and support customers.",
      href: "/comms",
    },
    {
      icon: MessageSquare,
      label: "Chat",
      description: "Messaging and hangout.",
      href: "/chat",
    },
    {
      icon: PenTool,
      label: "Canvas",
      description: "Visual colab workspace.",
      href: "/canvas",
    },
    {
      icon: FileSignature,
      label: "Docs",
      description: "Send and sign documents.",
      href: "/docs",
    }
  ];

  const resources = [
    { label: "Documentation", href: "/docs" },
    { label: "Changelog", href: "/changelog" },
    { label: "Blog", href: "/blog" },
    { label: "GitHub Repository", href: "#" },
    { label: "Self Host Geiger", href: "#" },
    { label: "Free Image Tools", href: "/tools", },
  ];

  return (
    <>
      <nav className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-8 text-sm font-medium text-muted-foreground">
        <div className="group relative" onMouseLeave={closeMenuOnMouseLeave}>
          <button
            type="button"
            aria-haspopup="true"
            className="flex items-center gap-1 py-6 transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none"
          >
            Products
            <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180" />
          </button>

          <div className="invisible absolute left-1/2 top-[100%] w-[650px] -translate-x-1/2 translate-y-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
            <div className="rounded-xl border border-border bg-surface-subtle p-4 shadow-xl">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-foreground0">Products</p>
              <div className="grid grid-cols-3 gap-1">
                {products.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      href={item.href}
                      key={item.label}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-surface-hover focus-visible:bg-surface-hover focus-visible:outline-none"
                    >
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-foreground">{item.label}</p>
                        <p className="text-xs text-foreground0">{item.description}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="group relative" onMouseLeave={closeMenuOnMouseLeave}>
          <button
            type="button"
            aria-haspopup="true"
            className="flex items-center gap-1 py-6 transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none"
          >
            Resources
            <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180" />
          </button>

          <div className="invisible absolute left-1/2 top-[100%] w-[280px] -translate-x-1/2 translate-y-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
            <div className="rounded-xl border border-border bg-surface-subtle p-3 shadow-xl">
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-foreground0">Resources</p>
              <div className="space-y-1">
                {resources.map((item) => (
                  <Link
                    href={item.href}
                    key={item.label}
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground focus-visible:bg-surface-hover focus-visible:text-foreground focus-visible:outline-none"
                  >
                    <span className="flex items-center gap-2">
                      {item.icon ? <item.icon className="h-4 w-4" /> : null}
                      {item.label}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-foreground0" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Link href="/pricing" className="py-6 transition-colors hover:text-foreground">
          Pricing
        </Link>
      </nav>

      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-foreground hover:bg-surface-hover">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="top" className="max-h-[85dvh] overflow-y-auto border-border bg-background text-foreground">
            <SheetHeader className="border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <Image src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/logo1.svg`} alt="Geiger logo" width={18} height={18} />
                <SheetTitle className="mt-0.5">Geiger Studio</SheetTitle>
              </div>
              <SheetDescription className="text-foreground0">
                Browse products, resources, and pricing.
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-6 px-4 pb-6">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-foreground0">Products</p>
                <div className="flex flex-nowrap gap-2 overflow-x-auto pb-1">
                  {products.map((item) => {
                    const Icon = item.icon;
                    return (
                      <SheetClose asChild key={item.label}>
                        <Link
                          href={item.href}
                          className="flex min-w-[86px] flex-col items-center justify-center gap-2 rounded-lg border border-border bg-surface-subtle/50 px-2 py-3 text-center text-xs text-foreground"
                        >
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          <p className="leading-tight">{item.label}</p>
                        </Link>
                      </SheetClose>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-foreground0">Resources</p>
                {resources.map((item) => (
                  <SheetClose asChild key={item.label}>
                    <Link
                      href={item.href}
                      className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-foreground"
                    >
                      {item.label}
                      <ArrowRight className="h-4 w-4 text-foreground0" />
                    </Link>
                  </SheetClose>
                ))}
              </div>

              <div className="space-y-2">
                <SheetClose asChild>
                  <Link
                    href="/pricing"
                    className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    View Pricing
                  </Link>
                </SheetClose>

                <SheetClose asChild>
                  <Link
                    href={userId ? `/notes/${userId}/home` : "/login"}
                    className="inline-flex w-full items-center justify-center rounded-lg border border-border-strong bg-transparent px-4 py-2 text-sm font-medium text-foreground"
                  >
                    {userId ? "Open Dashboard" : "Sign In"}
                  </Link>
                </SheetClose>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
