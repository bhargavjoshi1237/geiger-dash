import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar } from "lucide-react";
import { getHomepageBlogPosts } from "@/lib/public-content/queries";

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

export default async function BlogComponent() {
  const posts = await getHomepageBlogPosts();

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-7xl px-4 sm:px-6">
        <p className="text-2xl">Stay on the frontier</p>
      </div>
      <div className="grid w-full max-w-7xl grid-cols-1 gap-4 px-4 py-6 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
        {(posts || []).map((post, index) => (
          <Link
            key={post.id}
            href={post.slug ? `/blog/${post.slug}` : "/blog"}
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
              <h3 className="text-xl font-semibold leading-tight text-white">{post.title}</h3>
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{post.excerpt}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-foreground">
                Read post
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        ))}
        {(!posts || posts.length === 0) && (
          <p className="text-sm text-muted-foreground">No blog posts published yet.</p>
        )}
      </div>
      <div className="w-full max-w-7xl px-4 sm:px-6">
        <Link href="/blog" className="mt-12 text-white hover:underline">
          Explore all blog posts -&gt;
        </Link>
      </div>
    </div>
  );
}
