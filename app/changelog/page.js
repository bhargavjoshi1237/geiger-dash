import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { Header } from "@/components/header";

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
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
    image_url: null,
  };
}

function ChangelogImage({ changelog }) {
  return (
    <div className="mt-7 overflow-hidden rounded-md border border-[#333333] bg-[#202020] shadow-[0_28px_90px_rgba(0,0,0,0.42)]">
      <div className="relative aspect-[704/398] overflow-hidden bg-[#1a1a1a]">
        {changelog.image_url ? (
          <Image
            src={changelog.image_url}
            alt={changelog.title}
            fill
            className="object-cover"
            sizes="(min-width: 768px) 704px, calc(100vw - 40px)"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(145deg,#262626_0%,#1f1f1f_42%,#171717_100%)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.12),transparent_36%)]" />
            <div className="relative flex h-[72%] w-[82%] items-center justify-center rounded-md border border-dashed border-[#474747] bg-[#161616]/70">
              <div className="text-center">
                <p className="text-sm font-semibold text-[#e5e5e5]">Release image</p>
                <p className="mt-2 text-xs font-medium text-[#737373]">Add an image in Studio to feature it here</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default async function ChangelogPage() {
  const supabase = await createClient();

  const { data: changelogs } = await supabase
    .from("dash_changelog")
    .select("*")
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
                <h1 className="max-w-[650px] text-[34px] font-semibold leading-[1.08] text-white sm:text-[38px]">
                  {changelog.title}
                </h1>

                <p className="mt-7 max-w-[680px] text-base font-medium leading-7 text-white">
                  {changelog.description}
                </p>

                <ChangelogImage changelog={changelog} />
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
