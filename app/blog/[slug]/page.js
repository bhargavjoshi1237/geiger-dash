import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Calendar, Clock3, User } from "lucide-react";
import { Header } from "@/components/header";
import Footer from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import {
  getPublishedBlogPostBySlug,
  getRelatedBlogPosts,
} from "@/lib/public-content/queries";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

function formatDate(value) {
  if (!value) return null;

  return new Date(value).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatPostContent(content) {
  const value = String(content || "").trim();
  if (!value) return "";
  if (/<[a-z][\s\S]*>/i.test(value)) return value;

  return value
    .split(/\n{2,}/)
    .map((block) => `<p>${escapeHtml(block).replaceAll("\n", "<br />")}</p>`)
    .join("");
}

async function getPost(slug) {
  return getPublishedBlogPostBySlug(slug);
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return { title: "Post not found" };
  }

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `/blog/${post.slug}`,
      type: "article",
      publishedTime: post.published_at || undefined,
      images: post.featured_image ? [{ url: post.featured_image }] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  const relatedPosts = await getRelatedBlogPosts(post);

  const publishedDate = formatDate(post.published_at);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(to_right,#80808024_1px,transparent_1px),linear-gradient(to_bottom,#80808024_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_70%_45%_at_50%_0%,#000_55%,transparent_100%)]" />
      <Header />

      <main className="relative z-10 mx-auto w-full max-w-5xl flex-1 px-4 pb-24 pt-28 sm:px-6 sm:pt-36">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Blog
        </Link>

        <article className="mt-10">
          <header className="border-b border-border/70 pb-10 sm:pb-12">
            <div className="flex flex-wrap items-center gap-3">
              {post.category ? <Badge variant="outline">{post.category}</Badge> : null}
              {post.is_featured ? <Badge variant="secondary">Featured</Badge> : null}
            </div>

            <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[1.03] tracking-[-0.045em] sm:text-6xl">
              {post.title}
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
              {post.excerpt}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <User className="size-3.5" />
                {post.author_name || "Geiger Studios"}
              </span>
              {publishedDate ? (
                <time className="inline-flex items-center gap-2" dateTime={post.published_at}>
                  <Calendar className="size-3.5" />
                  {publishedDate}
                </time>
              ) : null}
              {post.reading_time_minutes ? (
                <span className="inline-flex items-center gap-2">
                  <Clock3 className="size-3.5" />
                  {post.reading_time_minutes} min read
                </span>
              ) : null}
            </div>
          </header>

          {post.featured_image ? (
            <div className="relative mt-10 aspect-[16/8.5] overflow-hidden rounded-xl border border-border bg-muted">
              <Image
                src={post.featured_image}
                alt={post.title}
                fill
                priority
                className="object-cover"
                sizes="(min-width: 1024px) 1024px, 100vw"
              />
            </div>
          ) : null}

          <div
            className="mx-auto mt-12 max-w-3xl text-[1rem] leading-8 text-muted-foreground [&_a]:break-words [&_a]:font-medium [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4 [&_blockquote]:my-8 [&_blockquote]:border-l-2 [&_blockquote]:border-foreground/30 [&_blockquote]:pl-6 [&_blockquote]:italic [&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.875em] [&_h1]:mt-12 [&_h1]:text-3xl [&_h1]:font-semibold [&_h1]:tracking-tight [&_h1]:text-foreground [&_h2]:mt-12 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-foreground [&_h3]:mt-10 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-foreground [&_hr]:my-12 [&_hr]:border-border [&_img]:my-10 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-lg [&_img]:border [&_img]:border-border [&_li]:mt-2 [&_ol]:my-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mt-6 [&_pre]:my-8 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:border-border [&_pre]:bg-muted [&_pre]:p-5 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:my-6 [&_ul]:list-disc [&_ul]:pl-6"
            dangerouslySetInnerHTML={{ __html: formatPostContent(post.content) }}
          />
        </article>

        {relatedPosts?.length ? (
          <section className="mt-20 border-t border-border/70 pt-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Keep reading
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">Related articles</h2>
            <div className="mt-6 grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/blog/${relatedPost.slug}`}
                  className="group flex min-h-56 flex-col bg-background p-6 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center justify-between gap-4 text-xs text-muted-foreground">
                    <span>{relatedPost.category}</span>
                    <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                  <h3 className="mt-8 text-xl font-semibold leading-snug tracking-tight">
                    {relatedPost.title}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
                    {relatedPost.excerpt}
                  </p>
                  <time className="mt-auto pt-6 text-xs text-muted-foreground">
                    {formatDate(relatedPost.published_at)}
                  </time>
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
