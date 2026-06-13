import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Calendar, Clock3 } from "lucide-react";
import { Header } from "@/components/header";
import Footer from "@/components/footer";
import { createClient } from "@/utils/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PublicPageHero } from "@/components/public-page-hero";

export const metadata = {
  title: "Blog",
  description: "Articles, product notes, and updates from Geiger Studios.",
};

const placeholderImages = [
  "https://200rfrtp5x71tlmk.public.blob.vercel-storage.com/geiger-dash/cursor-assets/asset-cc24ca462279ca23250c.jpg",
  "https://200rfrtp5x71tlmk.public.blob.vercel-storage.com/geiger-dash/cursor-assets/asset-85923e7fafe00c9c0d1f.jpg",
  "https://200rfrtp5x71tlmk.public.blob.vercel-storage.com/geiger-dash/cursor-assets/internal-brand-023-3291bb4c.jpg",
];

function formatDate(value) {
  if (!value) return "Unpublished";
  return new Date(value).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function getPostImage(post, index) {
  return post.featured_image || placeholderImages[index % placeholderImages.length];
}

function PostMeta({ post }) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
      <span className="inline-flex items-center gap-1.5">
        <Calendar className="size-3.5" />
        {formatDate(post.published_at)}
      </span>
      {post.reading_time_minutes ? (
        <span className="inline-flex items-center gap-1.5">
          <Clock3 className="size-3.5" />
          {post.reading_time_minutes} min
        </span>
      ) : null}
    </div>
  );
}

export default async function BlogPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("dash_blog_posts")
    .select("id,title,excerpt,slug,category,featured_image,published_at,reading_time_minutes")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  const [lead, ...archive] = posts || [];

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(to_right,#80808024_1px,transparent_1px),linear-gradient(to_bottom,#80808024_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_70%_45%_at_50%_0%,#000_55%,transparent_100%)]" />
      <Header />

      <main className="relative z-10 mx-auto w-full max-w-5xl flex-1 px-4 pb-24 pt-28 sm:px-6 sm:pt-36">
        <PublicPageHero
          eyebrow="Field notes"
          title="Blog"
          description="Ideas for teams that make things: product decisions, working methods, and dispatches from inside Geiger Studios."
        />

        {lead ? (
          <Link
            href={`/blog/${lead.slug}`}
            className="group mt-10 grid overflow-hidden rounded-xl border border-border bg-card/70 lg:grid-cols-[1.3fr_0.7fr]"
          >
            <div className="relative min-h-72 overflow-hidden bg-muted lg:min-h-[460px]">
              <Image
                src={getPostImage(lead, 0)}
                alt={lead.title}
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                sizes="(min-width: 1024px) 720px, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <Badge className="absolute left-5 top-5 border-white/15 bg-black/45 text-white backdrop-blur-md">
                Latest dispatch
              </Badge>
            </div>
            <div className="flex flex-col justify-between p-6 sm:p-8">
              <PostMeta post={lead} />
              <div className="mt-16">
                {lead.category ? (
                  <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    {lead.category}
                  </p>
                ) : null}
                <h2 className="text-3xl font-semibold leading-[1.08] tracking-[-0.035em]">{lead.title}</h2>
                <p className="mt-4 line-clamp-4 text-sm leading-6 text-muted-foreground">{lead.excerpt}</p>
                <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium">
                  Read dispatch
                  <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </div>
            </div>
          </Link>
        ) : (
          <div className="mt-10 rounded-xl border border-dashed border-border p-10 text-sm text-muted-foreground">
            No blog posts published yet.
          </div>
        )}

        {archive.length ? (
          <section className="mt-20">
            <div className="mb-5 flex items-center justify-between border-b border-border pb-4">
              <h2 className="text-sm font-medium uppercase tracking-[0.18em]">The archive</h2>
              <span className="font-mono text-xs text-muted-foreground">{String(archive.length).padStart(2, "0")} notes</span>
            </div>
            <div>
              {archive.map((post, index) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group grid gap-5 border-b border-border/70 py-7 transition-colors hover:bg-muted/25 sm:grid-cols-[52px_160px_1fr_auto] sm:items-center sm:px-3"
                >
                  <span className="font-mono text-xs text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="relative hidden aspect-[4/3] overflow-hidden rounded-md bg-muted sm:block">
                    <Image
                      src={getPostImage(post, index + 1)}
                      alt=""
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="160px"
                    />
                  </div>
                  <div>
                    <div className="mb-2 flex items-center gap-3">
                      {post.category ? <Badge variant="outline">{post.category}</Badge> : null}
                      <PostMeta post={post} />
                    </div>
                    <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">{post.title}</h3>
                    <p className="mt-2 line-clamp-2 max-w-2xl text-sm leading-6 text-muted-foreground">{post.excerpt}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="hidden rounded-full sm:inline-flex">
                    <ArrowUpRight className="size-4" />
                  </Button>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </main>
      <Footer />
    </div>
  );
}
