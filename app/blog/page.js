import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { Header } from "@/components/header";
import Footer from "@/components/footer";
import { createClient } from "@/utils/supabase/server";

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
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getPostImage(post, index) {
  return post.featured_image || placeholderImages[index % placeholderImages.length];
}

export default async function BlogPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("dash_blog_posts")
    .select("id,title,excerpt,slug,category,featured_image,published_at,reading_time_minutes")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground selection:bg-indigo-500/30 font-sans">
      <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,#80808030_1px,transparent_1px),linear-gradient(to_bottom,#80808030_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      <Header />

      <main className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-24 pt-32 sm:px-6 sm:pt-40">
        <section className="max-w-3xl">
          <p className="mb-3 text-sm font-medium text-muted-foreground">Blog</p>
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">Latest from Geiger</h1>
          <p className="mt-5 text-base leading-7 text-muted-foreground">
            Product updates, workflow ideas, and notes from the Geiger Studio team.
          </p>
        </section>

        <section className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {(posts || []).map((post, index) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group overflow-hidden rounded-lg border border-border bg-surface-subtle transition-colors hover:bg-surface-card"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-surface-subtle">
                <Image
                  src={getPostImage(post, index)}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 92vw, (max-width: 1024px) 46vw, 30vw"
                />
              </div>
              <div className="p-5">
                <div className="mb-4 flex flex-wrap items-center gap-3 text-xs font-medium text-foreground0">
                  {post.category ? <span>{post.category}</span> : null}
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(post.published_at)}
                  </span>
                  {post.reading_time_minutes ? <span>{post.reading_time_minutes} min read</span> : null}
                </div>
                <h2 className="text-xl font-semibold leading-tight text-white">{post.title}</h2>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{post.excerpt}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-foreground">
                  Read post
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </section>

        {(!posts || posts.length === 0) && (
          <div className="mt-12 rounded-lg border border-border bg-surface-subtle/40 p-6 text-sm text-muted-foreground">
            No blog posts published yet.
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
