import Link from "next/link";
import { ArrowRight } from "lucide-react";
import BoardPlaygroundCanvas from "@/components/notes-playground/internal/canvas/BoardPlaygroundCanvas";

export default function LandingBoardShowcase({ backgroundImage, ctaHref, ctaLabel }) {
  return (
    <section
      className="relative overflow-hidden rounded-2xl border border-[#212121] bg-background bg-cover bg-center bg-no-repeat px-4 py-4 sm:px-6 md:p-8 xl:p-10"
      style={backgroundImage ? { backgroundImage: `url('${backgroundImage}')` } : undefined}
    >
      <div className="absolute inset-0 bg-[#080808]/75" />
      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

        <div className="w-full lg:w-[30%] flex flex-col items-start justify-center space-y-6">
          <div className="space-y-4">
            <h3 className="text-2xl leading-snug font-semibold text-[#f5f5f5] sm:text-3xl">
              Notes turn ideas into Plans
            </h3>
            <p className="text-base text-[#bcbcbc] sm:text-lg">
              Accelerate execution by turning your ideas into actionable plans. while you focus on making decisions.
            </p>
          </div>

          <Link
            href={ctaHref}
            className="inline-flex items-center gap-2 text-[#ee6b3b] font-medium hover:text-[#ff8052] transition-colors"
          >
            {ctaLabel || "Learn about agentic development"}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="w-full lg:w-[70%] flex-1 ">
          <div className="relative overflow-hidden rounded-2xl border border-[#313131] bg-surface-card p-1.5 shadow-2xl">
            <div className="h-[340px] overflow-hidden rounded-xl border border-[#313131] bg-background sm:h-[460px] lg:h-[600px]">
              <BoardPlaygroundCanvas />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
