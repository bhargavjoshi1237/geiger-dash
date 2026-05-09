import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  Facebook,
  Linkedin,
  Share2,
  Twitter,
  User,
} from "lucide-react";
import Footer from "@/components/footer";
import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("dash_blog_posts")
    .select("title, excerpt")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (!post) {
    return {
      title: "Post not found",
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
  };
}

function formatPostContent(content) {
  if (/<[^>]+>/.test(content || "")) {
    return content;
  }

  return String(content || "")
    .split("\n")
    .map((line) => line.trim())
    .join("<br />");
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("dash_blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (!post) {
    notFound();
  }

  const { data: relatedPosts } = await supabase
    .from("dash_blog_posts")
    .select("id,title,slug,category,featured_image,published_at")
    .eq("is_published", true)
    .eq("category", post.category)
    .neq("id", post.id)
    .limit(3);

  return (
    <div className="flex min-h-screen w-full flex-col bg-zinc-950 text-zinc-100 selection:bg-indigo-500/30 font-sans">
      <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,#80808030_1px,transparent_1px),linear-gradient(to_bottom,#80808030_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      <Header />

      <main className="relative z-10 px-4 pb-20 pt-28 sm:px-6 sm:pt-32">
        <article className="mx-auto max-w-4xl">
          <div className="mb-8 flex items-center gap-2 text-sm text-zinc-500">
            <Link href="/" className="transition-colors hover:text-zinc-300">
              Home
            </Link>
            <ArrowRight className="h-3 w-3" />
            <Link href="/blog" className="transition-colors hover:text-zinc-300">
              Blog
            </Link>
            {post.category ? (
              <>
                <ArrowRight className="h-3 w-3" />
                <span className="text-zinc-300">{post.category}</span>
              </>
            ) : null}
          </div>

          <header className="mb-8">
            {post.featured_image ? (
              <div className="relative mb-8 h-64 w-full overflow-hidden rounded-lg md:h-96">
                <Image src={post.featured_image} alt={post.title} fill className="object-cover" priority />
              </div>
            ) : null}

            <div className="mb-4 flex flex-wrap items-center gap-3">
              {post.category ? (
                <Badge variant="outline" className="text-xs">
                  {post.category}
                </Badge>
              ) : null}
              {post.is_featured ? (
                <Badge className="border-indigo-500/30 bg-indigo-500/15 text-indigo-400">Featured</Badge>
              ) : null}
            </div>

            <h1 className="mb-6 bg-gradient-to-b from-zinc-100 to-zinc-400 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
              {post.title}
            </h1>

            <p className="mb-8 text-xl text-zinc-400">{post.excerpt}</p>

            <div className="flex flex-wrap items-center gap-6 border-b border-zinc-800 pb-8 text-sm text-zinc-400">
              <div className="flex items-center gap-3">
                {post.author_avatar ? (
                  <Image src={post.author_avatar} alt={post.author_name} width={40} height={40} className="rounded-full" />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800">
                    <User className="h-5 w-5" />
                  </div>
                )}
                <div>
                  <div className="font-medium text-zinc-300">{post.author_name}</div>
                  <div className="text-xs">Author</div>
                </div>
              </div>

              <Separator orientation="vertical" className="h-8 bg-zinc-800" />

              {post.published_at ? (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(post.published_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              ) : null}

              {post.reading_time_minutes ? (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{post.reading_time_minutes} min read</span>
                </div>
              ) : null}

              {typeof post.views === "number" ? <span className="text-zinc-500">{post.views} views</span> : null}
            </div>
          </header>

          <div className="prose prose-invert prose-zinc mb-12 max-w-none">
            <div
              className="leading-relaxed text-zinc-300"
              dangerouslySetInnerHTML={{
                __html: formatPostContent(post.content),
              }}
            />
          </div>

          <div className="mb-12 rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="mb-1 font-semibold text-zinc-200">Share this article</h3>
                <p className="text-sm text-zinc-500">Help others discover this content</p>
              </div>
              <div className="flex items-center gap-3">
                {[Twitter, Linkedin, Facebook, Share2].map((Icon, index) => (
                  <button key={index} className="rounded-lg bg-zinc-800 p-3 transition-colors hover:bg-zinc-700">
                    <Icon className="h-5 w-5 text-zinc-400" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {relatedPosts && relatedPosts.length > 0 ? (
            <div>
              <h2 className="mb-6 text-2xl font-bold text-zinc-200">Related Articles</h2>
              <div className="grid gap-6 md:grid-cols-3">
                {relatedPosts.map((relatedPost) => (
                  <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                    <Card className="h-full border-zinc-800 bg-zinc-900/50 transition-all duration-300 hover:border-zinc-700">
                      {relatedPost.featured_image ? (
                        <div className="relative h-32 overflow-hidden rounded-t-lg">
                          <Image src={relatedPost.featured_image} alt={relatedPost.title} fill className="object-cover" />
                        </div>
                      ) : null}
                      <CardHeader className="p-4">
                        <CardTitle className="line-clamp-2 text-base">{relatedPost.title}</CardTitle>
                        <CardDescription className="text-xs">
                          {relatedPost.published_at
                            ? new Date(relatedPost.published_at).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "Unpublished"}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-12 border-t border-zinc-800 pt-8">
            <Link href="/blog" className="inline-flex items-center gap-2 text-zinc-400 transition-colors hover:text-zinc-100">
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
