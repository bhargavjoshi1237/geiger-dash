import Link from "next/link";
import { ArrowRight, ChevronRight, Sparkles } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { Header } from "@/components/header";

const categoryLabels = {
  feature: "Feature",
  improvement: "Improvement",
  bugfix: "Fix",
  breaking: "Breaking",
};

const typeLabels = {
  added: "Added",
  changed: "Changed",
  fixed: "Fixed",
  removed: "Removed",
  deprecated: "Deprecated",
};

const productLabels = {
  "geiger-flow": "Flow",
  "geiger-notes": "Notes",
  "geiger-dash": "Dash",
  "geiger-dam": "Assets",
  "geiger-grey": "Grey",
};

const previewTabs = {
  "geiger-flow": ["Planning", "Timeline", "Risk"],
  "geiger-notes": ["Board", "Canvas", "Review"],
  "geiger-dash": ["Usage", "Teams", "Reports"],
  "geiger-dam": ["Library", "Renditions", "Rights"],
  "geiger-grey": ["Agent", "Context", "Runs"],
};

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function ProductPreview({ product = "geiger-dash", featured }) {
  const tabs = previewTabs[product] || previewTabs["geiger-dash"];
  const label = productLabels[product] || "Dash";

  return (
    <div className="mt-7 overflow-hidden rounded-md border border-[#333333] bg-[#202020] shadow-[0_28px_90px_rgba(0,0,0,0.42)]">
      <div className="relative aspect-[704/398] overflow-hidden bg-[#1a1a1a]">
        <div className="absolute inset-0 bg-[linear-gradient(145deg,#2e2e2e_0%,#242424_38%,#1a1a1a_64%,#161616_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_52%_0%,rgba(255,255,255,0.14),transparent_36%)]" />
        <div className="absolute inset-x-[3.5%] top-[6%] h-[88%] overflow-hidden rounded-md border border-[#d4d4d4] bg-white shadow-2xl">
          <div className="flex h-8 items-center justify-between border-b border-[#e5e5e5] bg-white px-3 text-[8px] text-[#a3a3a3]">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </div>
            <span className="rounded border border-[#e5e5e5] bg-[#f9fafb] px-2 py-0.5 text-[#525252]">
              geiger.studio/{label.toLowerCase()}
            </span>
            <span className="rounded bg-[#f3f4f6] px-2 py-0.5 text-[#525252]">Work</span>
          </div>

          <div className="grid h-[calc(100%-2rem)] grid-cols-[27%_73%] bg-[#f9fafb] text-[#525252]">
            <aside className="border-r border-[#e5e5e5] bg-white p-3">
              <div className="mb-4 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded border border-[#e5e5e5] bg-[#f3f4f6] text-[9px] font-semibold text-[#171717]">
                  G
                </span>
                <div>
                  <p className="text-[8px] font-semibold text-[#171717]">Geiger {label}</p>
                  <p className="text-[7px] text-[#a3a3a3]">{featured ? "Featured release" : "Release preview"}</p>
                </div>
              </div>
              <div className="space-y-1.5">
                {["Overview", ...tabs, "Settings", "Members"].map((item, index) => (
                  <div
                    key={item}
                    className={`rounded px-2 py-1 text-[7px] ${
                      index === 1 ? "bg-[#f3f4f6] font-semibold text-[#171717]" : "text-[#737373]"
                    }`}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </aside>

            <section className="p-5">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <p className="text-[8px] font-medium text-[#737373]">Release workspace</p>
                  <h3 className="mt-1 text-[16px] font-semibold leading-tight text-[#171717]">{label} updates</h3>
                </div>
                <button className="rounded-md bg-[#171717] px-3 py-1.5 text-[8px] font-semibold text-white">
                  Apply
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {["Velocity", "Adoption", "Quality"].map((metric, index) => (
                  <div key={metric} className="rounded border border-[#e5e5e5] bg-white p-3">
                    <p className="text-[7px] text-[#a3a3a3]">{metric}</p>
                    <p className="mt-1 text-[13px] font-semibold text-[#171717]">{index === 0 ? "+32%" : index === 1 ? "84%" : "99.9%"}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded border border-[#e5e5e5] bg-white p-4">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-[8px] font-semibold text-[#171717]">Usage by surface</p>
                  <span className="rounded border border-[#e5e5e5] bg-[#f9fafb] px-2 py-1 text-[7px] text-[#737373]">Last 30 days</span>
                </div>
                <div className="flex h-28 items-end gap-2 border-b border-l border-[#e5e5e5] pl-3">
                  {[36, 52, 48, 66, 58, 78, 71, 88, 82].map((height, index) => (
                    <div key={index} className="flex flex-1 flex-col justify-end gap-1">
                      <span className="rounded-t-sm bg-[#22c55e]/70" style={{ height: `${height * 0.42}px` }} />
                      <span className="bg-[#2563eb]/55" style={{ height: `${height * 0.28}px` }} />
                      <span className="bg-[#f59e0b]/55" style={{ height: `${height * 0.14}px` }} />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

function FallbackRelease() {
  return {
    id: "fallback-release",
    version: "1.2.0",
    title: "Enhanced collaboration features",
    description:
      "Introducing real-time collaboration tools, sharper planning views, and improved sharing controls across the Geiger product suite.",
    category: "feature",
    product: "geiger-flow",
    release_date: "2026-03-14T00:00:00.000Z",
    is_featured: true,
    items: [
      { id: "fallback-1", type: "added", description: "Real-time cursor tracking and collaboration presence." },
      { id: "fallback-2", type: "changed", description: "New sharing panel with granular workspace permissions." },
      { id: "fallback-3", type: "fixed", description: "Improved notification behavior during collaborative edits." },
    ],
  };
}

export default async function ChangelogPage() {
  const supabase = await createClient();

  const { data: changelogs } = await supabase
    .from("dash_changelog")
    .select(`
      *,
      items:dash_changelog_items (
        id,
        type,
        description
      )
    `)
    .order("release_date", { ascending: false });

  const releases = changelogs?.length ? changelogs : [FallbackRelease()];

  return (
    <div className="flex min-h-screen w-full flex-col bg-zinc-950 font-sans text-zinc-100 antialiased selection:bg-indigo-500/30">
      <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,#80808030_1px,transparent_1px),linear-gradient(to_bottom,#80808030_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      <Header />

      <main className="relative z-10 mx-auto w-full max-w-[1300px] px-5 pb-28 pt-36 sm:pt-44">
        <div className="space-y-28">
          {releases.map((changelog, index) => (
            <article
              key={changelog.id}
              className={`grid gap-8 md:grid-cols-[250px_minmax(0,704px)] lg:grid-cols-[280px_minmax(0,704px)] ${
                index === 0 ? "" : "border-t border-[#2a2a2a] pt-24"
              }`}
            >
              <time className="text-base font-semibold text-[#737373]" dateTime={changelog.release_date}>
                {formatDate(changelog.release_date)}
              </time>

              <div>
                {index === 0 ? <p className="mb-4 text-sm font-medium text-[#a3a3a3]">Changelog</p> : null}
                <div className="mb-5 flex flex-wrap items-center gap-2 text-xs font-medium text-[#a3a3a3]">
                  <span className="rounded-md border border-[#333333] bg-[#202020] px-2 py-1">
                    {productLabels[changelog.product] || changelog.product}
                  </span>
                  <span className="rounded-md border border-[#333333] bg-[#202020] px-2 py-1">
                    v{changelog.version}
                  </span>
                  <span className="rounded-md border border-[#333333] bg-[#202020] px-2 py-1">
                    {categoryLabels[changelog.category] || changelog.category}
                  </span>
                  {changelog.is_featured ? (
                    <span className="inline-flex items-center gap-1 rounded-md border border-[#474747] bg-[#242424] px-2 py-1 text-white">
                      <Sparkles className="h-3 w-3" />
                      Featured
                    </span>
                  ) : null}
                </div>

                <h1 className="max-w-[650px] text-[34px] font-semibold leading-[1.08] text-white sm:text-[38px]">
                  {changelog.title}
                </h1>

                <p className="mt-7 max-w-[680px] text-base font-medium leading-7 text-white">
                  {changelog.description}
                </p>

                {changelog.items?.length ? (
                  <div className="mt-10 space-y-7">
                    {changelog.items.map((item, itemIndex) => (
                      <section key={item.id}>
                        <h2 className="text-2xl font-semibold leading-tight text-[#e5e5e5]">
                          {itemIndex === 0 ? `${categoryLabels[changelog.category] || "Release"} highlights` : typeLabels[item.type] || item.type}
                        </h2>
                        <p className="mt-3 max-w-[680px] text-base font-medium leading-7 text-white">
                          {item.description}
                        </p>
                      </section>
                    ))}
                  </div>
                ) : null}

                <ProductPreview product={changelog.product} featured={changelog.is_featured} />
              </div>
            </article>
          ))}
        </div>

        <div className="mt-28 border-t border-[#2a2a2a] pt-10">
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 rounded-md border border-[#2a2a2a] bg-[#202020] px-4 py-2 text-sm font-medium text-[#e5e5e5] transition-colors hover:border-[#474747] hover:bg-[#242424] hover:text-white"
          >
            Read the docs
            <ChevronRight className="h-4 w-4" />
          </Link>
          <Link
            href="/"
            className="ml-3 inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-[#a3a3a3] transition-colors hover:bg-[#202020] hover:text-white"
          >
            Back home
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}
