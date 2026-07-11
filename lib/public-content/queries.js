import { unstable_cache } from "next/cache";
import { createClient } from "@supabase/supabase-js";

const PUBLIC_CONTENT_REVALIDATE_SECONDS = 300;

function createPublicClient() {
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    key,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    },
  );
}

export const getHomepageChangelogs = unstable_cache(
  async () => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("dash_changelog")
      .select("id, title, release_date")
      .order("release_date", { ascending: false })
      .limit(3);

    if (error) {
      console.error("Failed to load homepage changelogs:", error);
      return [];
    }

    return data || [];
  },
  ["homepage-changelogs"],
  {
    revalidate: PUBLIC_CONTENT_REVALIDATE_SECONDS,
    tags: ["homepage-content", "changelogs"],
  },
);

export const getHomepageBlogPosts = unstable_cache(
  async () => {
    return getPublishedBlogPosts({ limit: 3, logContext: "homepage blog posts" });
  },
  ["homepage-blog-posts"],
  {
    revalidate: PUBLIC_CONTENT_REVALIDATE_SECONDS,
    tags: ["homepage-content", "blog-posts"],
  },
);

export async function getPublishedBlogPosts({ limit, logContext = "blog posts" } = {}) {
  const supabase = createPublicClient();
  let query = supabase
    .from("dash_blog_posts")
    .select("id,title,excerpt,slug,category,featured_image,published_at,reading_time_minutes")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;

  if (error) {
    console.error(`Failed to load ${logContext}:`, error);
    return [];
  }

  return data || [];
}

export async function getPublishedBlogPostBySlug(slug) {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("dash_blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error) {
    console.error("Failed to load blog post:", error);
    return null;
  }

  return data;
}

const SEO_PAGE_LIST_COLUMNS =
  "id,page_type,product,title,slug,excerpt,hero_heading,hero_subheading,cover_image,is_featured,published_at,updated_at";

// All published SEO pages of a type, newest first — powers the type hub page.
// Pass a product (stored value, e.g. "geiger-events") to scope the list to one
// product's pages for its /<type>/<product> hub.
export async function getPublishedSeoPagesByType(pageType, product) {
  const supabase = createPublicClient();
  let query = supabase
    .from("dash_seo_pages")
    .select(SEO_PAGE_LIST_COLUMNS)
    .eq("page_type", pageType)
    .eq("is_published", true);

  if (product) query = query.eq("product", product);

  const { data, error } = await query.order("published_at", { ascending: false });

  if (error) {
    console.error(`Failed to load ${pageType} pages:`, error);
    return [];
  }

  return data || [];
}

// Every published SEO page across types — used by the sitemap generator.
export async function getPublishedSeoPages() {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("dash_seo_pages")
    .select("page_type,slug,updated_at,published_at")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Failed to load SEO pages:", error);
    return [];
  }

  return data || [];
}

// Fetch one published page by its full identity (product, type, slug) — the
// canonical lookup for the nested /<type>/<product>/<slug> routes.
export async function getPublishedSeoPageByProductSlug(product, pageType, slug) {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("dash_seo_pages")
    .select("*")
    .eq("product", product)
    .eq("page_type", pageType)
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error) {
    console.error("Failed to load SEO page:", error);
    return null;
  }

  return data;
}

// Best-effort lookup by (type, slug) ignoring product — used only to 301 a
// legacy flat /<type>/<slug> URL to its canonical nested path. Returns the
// newest match when more than one product shares a slug.
export async function findPublishedSeoPageBySlug(pageType, slug) {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("dash_seo_pages")
    .select("product, page_type, slug")
    .eq("page_type", pageType)
    .eq("slug", slug)
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .limit(1);

  if (error) {
    console.error("Failed to resolve legacy SEO page:", error);
    return null;
  }

  return data?.[0] || null;
}

export async function getRelatedBlogPosts(post, limit = 3) {
  if (!post?.category || !post?.id) return [];

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("dash_blog_posts")
    .select("id,title,slug,excerpt,category,published_at")
    .eq("is_published", true)
    .eq("category", post.category)
    .neq("id", post.id)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Failed to load related blog posts:", error);
    return [];
  }

  return data || [];
}
