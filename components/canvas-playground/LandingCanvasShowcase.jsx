import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CanvasPlaygroundEditor from "./excalidraw/CanvasPlaygroundEditor";

export default function LandingCanvasShowcase({ ctaHref, ctaLabel }) {
  return (
    <section className="rounded-sm border border-[#212121] bg-[#161616] px-6 py-0 md:p-8 xl:p-10 mt-20">
      <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        
        {/* Left Content - Mockup Window */}
        <div className="w-full lg:w-[70%] flex-1">
          <div className="relative rounded-xl border border-[#313131] bg-[#222222] p-1.5 shadow-2xl">
            <div className="overflow-hidden rounded-lg border border-[#313131] bg-[#161616] h-[600px]">
              <CanvasPlaygroundEditor />
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="w-full lg:w-[30%] flex flex-col items-start justify-center space-y-6">
          <div className="space-y-4">
            <h3 className="text-3xl leading-snug font-semibold text-[#f5f5f5]">
              Brainstorm and blueprint.
            </h3>
            <p className="text-lg text-[#bcbcbc]">
              Visual communication, diagramming, and wireframes right inside your workspace, with native collaborative features.
            </p>
          </div>

          <Link
            href={ctaHref}
            className="inline-flex items-center gap-2 text-[#ee6b3b] font-medium hover:text-[#ff8052] transition-colors"
          >
            {ctaLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
