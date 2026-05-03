import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowLeft, Calendar, Clock, Tag, User, Share2, Twitter, Linkedin, Facebook } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { LogoutButton } from "@/components/logout-button";
import { MegaMenu } from "@/components/mega-menu";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import  Footer from "@/components/footer";

// Make this page dynamic
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from('dash_blog_posts')
    .select('title, excerpt')
    .eq('slug', slug)
    .single();

  if (!post) {
    return {
      title: 'Post not found',
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch the blog post
  const { data: post } = await supabase
    .from('dash_blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (!post) {
    notFound();
  }

  // Fetch related posts
  const { data: relatedPosts } = await supabase
    .from('dash_blog_posts')
    .select('*')
    .eq('is_published', true)
    .eq('category', post.category)
    .neq('id', post.id)
    .limit(3);

  return (
    <div className="flex min-h-screen w-full flex-col bg-zinc-950 text-zinc-100 selection:bg-indigo-500/30 font-sans">
      <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,#80808030_1px,transparent_1px),linear-gradient(to_bottom,#80808030_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between relative">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 flex items-center justify-center">
                <img src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/logo1.svg`} alt="Logo" width={24} height={24} />
              </div>
              <span className="font-bold text-xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-400">Geiger Studios</span>
            </Link>
          </div>
          <MegaMenu />
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link
                  href={`/notes/${user.id}/home`}
                  className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors"
                >
                  Dashboard
                </Link>
                <LogoutButton />
              </>
            ) : (
              <Link
                href="/login"
                className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="relative z-10 pt-32 pb-20 px-6">
        <article className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-zinc-500 mb-8">
            <Link href="/" className="hover:text-zinc-300 transition-colors">Home</Link>
            <ArrowRight className="w-3 h-3" />
            <Link href="/blog" className="hover:text-zinc-300 transition-colors">Blog</Link>
            <ArrowRight className="w-3 h-3" />
            <span className="text-zinc-300">{post.category}</span>
          </div>

          {/* Article Header */}
          <header className="mb-8">
            {post.featured_image && (
              <div className="relative w-full h-64 md:h-96 mb-8 rounded-2xl overflow-hidden">
                <Image
                  src={post.featured_image}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge variant="outline" className="text-xs">
                {post.category}
              </Badge>
              {post.is_featured && (
                <Badge className="bg-indigo-500/15 text-indigo-400 border-indigo-500/30">
                  Featured
                </Badge>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-b from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
              {post.title}
            </h1>

            <p className="text-xl text-zinc-400 mb-8">
              {post.excerpt}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-400 pb-8 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                {post.author_avatar ? (
                  <Image src={post.author_avatar} alt={post.author_name} width={40} height={40} className="rounded-full" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                )}
                <div>
                  <div className="font-medium text-zinc-300">{post.author_name}</div>
                  <div className="text-xs">Author</div>
                </div>
              </div>
              
              <Separator orientation="vertical" className="h-8 bg-zinc-800" />
              
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(post.published_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.reading_time_minutes} min read</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-zinc-500">{post.views} views</span>
              </div>
            </div>

            {/* Tags */}
            {/* {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {post.tags.map((tag, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )} */}
          </header>

          {/* Article Content */}
          <div className="prose prose-invert prose-zinc max-w-none mb-12">
            <div
              className="text-zinc-300 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: /<[^>]+>/.test(post.content || '')
                  ? post.content
                  : String(post.content || '')
                      .split('\n')
                      .map((line) => line.trim())
                      .join('<br />'),
              }}
            />
          </div>

          <div className="p-6 bg-zinc-900/50 rounded-2xl border border-zinc-800 mb-12">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="font-semibold text-zinc-200 mb-1">Share this article</h3>
                <p className="text-sm text-zinc-500">Help others discover this content</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors">
                  <Twitter className="w-5 h-5 text-zinc-400" />
                </button>
                <button className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors">
                  <Linkedin className="w-5 h-5 text-zinc-400" />
                </button>
                <button className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors">
                  <Facebook className="w-5 h-5 text-zinc-400" />
                </button>
                <button className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors">
                  <Share2 className="w-5 h-5 text-zinc-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Related Posts */}
          {relatedPosts && relatedPosts.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-zinc-200 mb-6">Related Articles</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                    <Card className="h-full bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 transition-all duration-300">
                      {relatedPost.featured_image && (
                        <div className="relative h-32 overflow-hidden rounded-t-xl">
                          <Image
                            src={relatedPost.featured_image}
                            alt={relatedPost.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <CardHeader className="p-4">
                        <CardTitle className="text-base line-clamp-2">
                          {relatedPost.title}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          {new Date(relatedPost.published_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Back to Blog */}
          <div className="mt-12 pt-8 border-t border-zinc-800">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
