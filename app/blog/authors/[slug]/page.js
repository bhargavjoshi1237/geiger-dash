import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Header } from "@/components/header";
import Footer from "@/components/footer";
import { getBlogAuthorBySlug, getPublishedPostsByAuthor } from "@/lib/public-content/queries";
import { authorSameAs } from "@/lib/posts/authors";

export const dynamic = "force-dynamic";

const SITE_URL = "https://geiger.studio";

function formatDate(value) {
  if (!value) return null;
  return new Date(value).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const author = await getBlogAuthorBySlug(slug);
  if (!author) return { title: "Author not found" };

  const description = author.bio.length > 160 ? `${author.bio.slice(0, 157).trimEnd()}...` : author.bio;
  return {
    title: author.name,
    description,
    alternates: { canonical: `/blog/authors/${author.slug}` },
    openGraph: {
      title: author.name,
      description,
      url: `/blog/authors/${author.slug}`,
      type: "profile",
      images: author.avatar_url ? [{ url: author.avatar_url }] : undefined,
    },
  };
}

export default async function BlogAuthorPage({ params }) {
  const { slug } = await params;
  const author = await getBlogAuthorBySlug(slug);
  if (!author) notFound();

  const posts = await getPublishedPostsByAuthor(author.id);
  const links = Array.isArray(author.links) ? author.links : [];
  const profileUrl = `${SITE_URL}/blog/authors/${author.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: profileUrl,
    mainEntity: {
      "@type": "Person",
      name: author.name,
      url: profileUrl,
      jobTitle: author.role || undefined,
      description: author.bio,
      image: author.avatar_url || undefined,
      sameAs: authorSameAs(author),
    },
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(to_right,#80808024_1px,transparent_1px),linear-gradient(to_bottom,#80808024_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_70%_45%_at_50%_0%,#000_55%,transparent_100%)]" />
      <Header />

      <main className="relative z-10 mx-auto w-full max-w-5xl flex-1 px-4 pb-24 pt-28 sm:px-6 sm:pt-36">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="size-4" />
          Back to Blog
        </Link>

        <header className="mt-10 flex flex-col gap-6 border-b border-border/70 pb-10 sm:flex-row sm:items-start sm:pb-12">
          {author.avatar_url ? (
            <Image src={author.avatar_url} alt={author.name} width={96} height={96} priority className="size-24 shrink-0 rounded-full border border-border object-cover" />
          ) : null}
          <div className="min-w-0">
            <h1 className="text-4xl font-semibold leading-[1.03] tracking-[-0.045em] sm:text-5xl">{author.name}</h1>
            {author.role ? <p className="mt-3 text-sm text-muted-foreground">{author.role}</p> : null}
            <p className="mt-5 max-w-3xl whitespace-pre-line text-base leading-7 text-muted-foreground">{author.bio}</p>
            {links.length ? (
              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                {links.map((link) => (
                  <a key={link.url} href={link.url} target="_blank" rel="me noopener noreferrer" className="inline-flex items-center gap-1 font-medium text-foreground underline-offset-4 hover:underline">
                    {link.label}
                    <ArrowUpRight className="size-3.5" />
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </header>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold tracking-tight">Articles</h2>
          {posts.length ? (
            <div className="mt-6 grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-2">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group flex min-h-48 flex-col bg-background p-6 transition-colors hover:bg-muted/50">
                  <span className="text-xs text-muted-foreground">{post.category}</span>
                  <h3 className="mt-4 text-xl font-semibold leading-snug tracking-tight">{post.title}</h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{post.excerpt}</p>
                  <time className="mt-auto pt-6 text-xs text-muted-foreground">{formatDate(post.published_at)}</time>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">No articles published yet.</p>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
