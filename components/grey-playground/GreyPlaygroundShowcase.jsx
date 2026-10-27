import Link from "next/link";
import { ArrowRight } from "lucide-react";
import GreyPlayground from "./GreyPlayground";

export default function GreyPlaygroundShowcase({ backgroundImage, ctaHref, ctaLabel }) {
  return (
    <section
      className="relative overflow-hidden rounded-2xl border border-[#212121] bg-background bg-cover bg-center bg-no-repeat px-4 py-4 sm:px-6 md:p-8 xl:p-10"
      style={backgroundImage ? { backgroundImage: `url('${backgroundImage}')` } : undefined}
    >
      <div className="absolute inset-0 bg-[#080808]/75" />
      <div className="relative z-10 flex flex-col items-center gap-12 lg:flex-row lg:gap-16">

        <div className="flex w-full flex-col items-start justify-center space-y-6 lg:w-[30%]">
          <div className="space-y-4">
            <h3 className="text-2xl leading-snug font-semibold text-[#f5f5f5] sm:text-3xl">
              Ask what your team already knows
            </h3>
            <p className="text-base text-[#bcbcbc] sm:text-lg">
              Grey reads your documents, recordings and pages, maps the people and things they mention,
              and answers with the sources it used. Spin the graph, click a node, or ask it something.
            </p>
          </div>

          <Link
            href={ctaHref}
            className="inline-flex items-center gap-2 font-medium text-[#ee6b3b] transition-colors hover:text-[#ff8052]"
          >
            {ctaLabel || "Checkout Grey"}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="w-full flex-1 lg:w-[70%]">
          <div className="relative overflow-hidden rounded-2xl border border-[#313131] bg-surface-card p-1.5 shadow-2xl">
            <div className="h-[520px] overflow-hidden rounded-xl border border-[#313131] bg-background sm:h-[560px] lg:h-[600px]">
              <GreyPlayground />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
