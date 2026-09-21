"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import EventBookingFlow from "./booking/EventBookingFlow";

export default function EventsPlaygroundShowcase({ backgroundImage, ctaHref, ctaLabel }) {
  return (
    <section
      className="relative overflow-hidden rounded-2xl border border-[#212121] bg-background bg-cover bg-center bg-no-repeat px-4 py-4 sm:px-6 md:p-8 xl:p-10"
      style={backgroundImage ? { backgroundImage: `url('${backgroundImage}')` } : undefined}
    >
      <div className="absolute inset-0 bg-[#080808]/75" />
      <div className="relative z-10 flex flex-col items-center gap-12 lg:flex-row lg:gap-16">

        <div className="w-full flex-1 lg:w-[70%]">
          <div className="relative overflow-hidden rounded-2xl border border-[#313131] bg-surface-card p-1.5 shadow-2xl">
            <div className="h-[620px] overflow-hidden rounded-xl border border-[#313131] bg-background sm:h-[680px] lg:h-[720px]">
              <EventBookingFlow />
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col items-start justify-center space-y-6 lg:w-[30%]">
          <div className="space-y-4">
            <h3 className="text-2xl leading-snug font-semibold text-[#f5f5f5] sm:text-3xl">
              The page is the box office
            </h3>
            <p className="text-base text-[#bcbcbc] sm:text-lg">
              Your event gets its own page, and that page takes the money. Pick a tier,
              choose a seat, pay. The ticket is in their inbox before they close the tab.
            </p>
          </div>

          <Link
            href={ctaHref}
            className="inline-flex items-center gap-2 font-medium text-[#ee6b3b] transition-colors hover:text-[#ff8052]"
          >
            {ctaLabel || "Checkout Events"}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
