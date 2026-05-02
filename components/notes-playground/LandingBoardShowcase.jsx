import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import BoardPlaygroundCanvas from "@/components/notes-playground/internal/canvas/BoardPlaygroundCanvas";

export default function LandingBoardShowcase({ ctaHref, ctaLabel }) {
  return (
    <section className="rounded-sm border border-[#212121] bg-[#161616] p-6 md:p-8  xl:p-10">
      <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

        <div className="w-full lg:w-[30%] flex flex-col items-start justify-center space-y-6">
          <div className="space-y-4">
            <h3 className="text-3xl leading-snug font-semibold text-[#f5f5f5]">
              Agents turn ideas into code
            </h3>
            <p className="text-lg text-[#bcbcbc]">
              Accelerate development by handing off tasks to Cursor, while you focus on making decisions.
            </p>
          </div>

          <Link
            href={ctaHref}
            className="inline-flex items-center gap-2 text-[#ee6b3b] font-medium hover:text-[#ff8052] transition-colors"
          >
            Learn about agentic development
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="w-full lg:w-[70%] flex-1 ">
          <div className="relative rounded-xl border border-[#313131] bg-[#222222] p-1.5 shadow-2xl">
            <div className="overflow-hidden rounded-lg border border-[#313131] bg-[#161616] h-[600px]">
              <BoardPlaygroundCanvas />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}