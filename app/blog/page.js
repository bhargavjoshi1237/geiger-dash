import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, Clock, Tag, User } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { LogoutButton } from "@/components/logout-button";
import { MegaMenu } from "@/components/mega-menu";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import  Footer from "@/components/footer";

export default async function BlogPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch published blog posts
  const { data: posts } = await supabase
    .from('dash_blog_posts')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false });

  // Fetch categories
  const { data: categories } = await supabase
    .from('dash_blog_categories')
    .select('*')
    .order('name');

  // Featured post
  const featuredPost = posts?.find(post => post.is_featured);

  return (
    <div className="flex min-h-screen w-full flex-col bg-zinc-950 text-zinc-100 font-sans">
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
      <main className="relative z-10 pt-32 pb-20 px-6 mt-18">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-b from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
              Blog
            </h1>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
              Explore tutorials, product updates, and insights from the Geiger team.
            </p>
          </div>

          {/* Featured Post */}
          {featuredPost && (
            <Card className="mb-12 bg-zinc-900/50 border-zinc-800 hover:border-zinc-500/40 transition-all duration-300 overflow-hidden">
              <div className="grid md:grid-cols-2 gap-6">
                {featuredPost.featured_image && (
                  <div className="relative h-64 md:h-full min-h-[250px]">
                    <Image
                      src={featuredPost.featured_image}
                      alt={featuredPost.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className={featuredPost.featured_image ? "" : "col-span-2"}>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-4">
                      <Badge className="bg-zinc-500/15 text-zinc-400 border-zinc-500/30">
                        Featured
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {featuredPost.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-3xl mb-3">
                      <Link href={`/blog/${featuredPost.slug}`} className="hover:text-zinc-400 transition-colors">
                        {featuredPost.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="text-base line-clamp-2">
                      {featuredPost.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-6 text-sm text-zinc-400">
                      <div className="flex items-center gap-2">
                        {featuredPost.author_avatar ? (
                          <Image src={featuredPost.author_avatar} alt={featuredPost.author_name} width={24} height={24} className="rounded-full" />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center">
                            <User className="w-3 h-3" />
                          </div>
                        )}
                        <span>{featuredPost.author_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(featuredPost.published_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{featuredPost.reading_time_minutes} min read</span>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </div>
            </Card>
          )}

          {/* Blog Posts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts?.filter(post => !post.is_featured).map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <Card className="h-full bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 transition-all duration-300 ">
                  {post.featured_image && (
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={post.featured_image}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <Badge variant="outline" className="w-fit mb-3 text-xs">
                      {post.category}
                    </Badge>
                    <CardTitle className="text-xl line-clamp-2 mb-2">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-zinc-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(post.published_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{post.reading_time_minutes} min</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}

            {(!posts || posts.length === 0) && (
              <Card className="col-span-full bg-zinc-900/50 border-zinc-800">
                <CardContent className="py-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-800/50 flex items-center justify-center">
                    <Tag className="w-8 h-8 text-zinc-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-400 mb-2">No posts yet</h3>
                  <p className="text-sm text-zinc-500">Check back soon for new content!</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Footer CTA */}
          <div className="mt-16 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-xl text-sm font-medium transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
