import Link from "next/link";
import Image from "next/image";
import BlogWidget from "./blog_widget";
import { createClient } from "@/utils/supabase/server";

const PLACEHOLDER_IMAGES = [
  "https://cursor.com/marketing-static/_next/image?url=https%3A%2F%2Fptht05hbb1ssoooe.public.blob.vercel-storage.com%2Fassets%2Fmisc%2Fasset-cc24ca462279ca23250c.jpg&w=1920&q=70",
  "https://cursor.com/marketing-static/_next/image?url=https%3A%2F%2Fptht05hbb1ssoooe.public.blob.vercel-storage.com%2Fassets%2Fmisc%2Fasset-85923e7fafe00c9c0d1f.jpg&w=1920&q=70",
  "https://cursor.com/marketing-static/_next/image?url=https%3A%2F%2Fptht05hbb1ssoooe.public.blob.vercel-storage.com%2Fassets%2Finternal-brand%2Finternal-brand-023-3291bb4c.jpg&w=1920&q=70",
];

function getRandomPlaceholder() {
  const index = Math.floor(Math.random() * PLACEHOLDER_IMAGES.length);
  return PLACEHOLDER_IMAGES[index];
}

export default async function BlogComponent() {
  const supabase = await createClient();

  const { data: posts } = await supabase
    .from("dash_blog_posts")
    .select("id, title, excerpt, slug, featured_image")
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .limit(3);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-7xl px-4 sm:px-6">
        <p className="text-2xl">Stay on the frontier</p>
      </div>
      <div className="grid w-full max-w-7xl grid-cols-1 gap-4 px-4 py-6 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
        {(posts || []).map((post) => (
          <BlogWidget
            key={post.id}
            title={post.title}
            description={post.excerpt}
            linkText="Read post ->"
            linkHref={post.slug ? `/blog/${post.slug}` : "/blog"}
          >
            <div className="relative h-40 rounded-md mt-4 border border-zinc-800/50 overflow-hidden">
              <Image
                src={post.featured_image || getRandomPlaceholder()}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
              />
            </div>
          </BlogWidget>
        ))}
        {(!posts || posts.length === 0) && (
          <p className="text-sm text-zinc-400">No blog posts published yet.</p>
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
