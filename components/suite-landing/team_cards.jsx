import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { findTeamPage } from "@/components/product-pages/tours";

const ASSET_BASE = "https://200rfrtp5x71tlmk.public.blob.vercel-storage.com/geiger-dash/data_curv_assets";

// One photo card per team shape, each opening its /teams/<id> page.
const CARDS = [
  { id: "corporate", image: `${ASSET_BASE}/role-swe.jpg`, label: "Corporate", desc: "Structured workflows and shared visibility across every department." },
  { id: "creative", image: `${ASSET_BASE}/role-research.jpg`, label: "Creative", desc: "A workspace that moves as fast as your ideas and helps you focus on what matters most." },
  { id: "management", image: `${ASSET_BASE}/role-ops.jpg`, label: "Management", desc: "Full project visibility and team progress, from a single view." },
];

export function TeamCards() {
  return (
    <section className="mx-auto mb-10 w-full max-w-6xl px-4 sm:mb-16 sm:px-6">
      <p className="mb-2 text-xs font-semibold tracking-widest text-muted-foreground uppercase">Made for how you work</p>
      <h2 className="mb-8 text-2xl font-semibold text-foreground sm:text-3xl">Your whole team, one workspace</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
        {CARDS.map(({ id, image, label, desc }) => (
          <Link
            key={id}
            href={findTeamPage(id).href}
            className="group relative block h-[420px] overflow-hidden rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:h-[520px]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- remote blob photo, same as the rest of the landing */}
            <img src={image} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-6">
              <div>
                <p className="text-lg font-semibold text-white sm:text-xl">{label}</p>
                <p className="mt-1 text-sm text-white/65">{desc}</p>
              </div>
              <span
                aria-hidden="true"
                className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md transition-colors duration-300 group-hover:bg-white group-hover:text-black"
              >
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-px group-hover:translate-x-px" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default TeamCards;
