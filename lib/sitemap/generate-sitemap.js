import { resolveProductApp } from "@/lib/pages-studio/products";

const SITE_URL = "https://geiger.studio";

// Public URL segment each SEO page type renders under (see lib/pages-studio/skills).
const SEO_PAGE_SEGMENT = { solution: "solutions", product: "product", feature: "features" };

const staticRoutes = [
  { path: "", lastModified: "2026-06-13", changeFrequency: "weekly", priority: 1 },
  { path: "/tools", lastModified: "2026-06-13", changeFrequency: "monthly", priority: 0.9 },
  { path: "/tools/image-crop", lastModified: "2026-06-13", changeFrequency: "monthly", priority: 0.8 },
  { path: "/tools/image-resize", lastModified: "2026-06-13", changeFrequency: "monthly", priority: 0.8 },
  { path: "/tools/image-converter", lastModified: "2026-06-13", changeFrequency: "monthly", priority: 0.8 },
  { path: "/solutions", lastModified: "2026-06-13", changeFrequency: "weekly", priority: 0.8 },
  { path: "/product", lastModified: "2026-06-13", changeFrequency: "weekly", priority: 0.8 },
  { path: "/features", lastModified: "2026-06-13", changeFrequency: "weekly", priority: 0.8 },
  { path: "/blog", lastModified: "2026-06-13", changeFrequency: "weekly", priority: 0.7 },
  { path: "/changelog", lastModified: "2026-06-13", changeFrequency: "weekly", priority: 0.6 },
  { path: "/pricing", lastModified: "2026-06-13", changeFrequency: "monthly", priority: 0.6 },
  { path: "/privacy", lastModified: "2026-06-13", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", lastModified: "2026-06-13", changeFrequency: "yearly", priority: 0.3 },
];

const toDate = (value, fallback) => {
  const date = value ? new Date(value) : fallback;
  return Number.isNaN(date.getTime()) ? fallback : date;
};

async function getPublishedBlogPosts() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) return [];

  const query = new URL("/rest/v1/dash_blog_posts", supabaseUrl);
  query.searchParams.set("select", "slug,updated_at,published_at");
  query.searchParams.set("is_published", "eq.true");
  query.searchParams.set("slug", "not.is.null");
  query.searchParams.set("order", "published_at.desc");

  try {
    const response = await fetch(query, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
      next: {
        revalidate: 86400,
        tags: ["sitemap-content"],
      },
    });

    if (!response.ok) {
      throw new Error(`Supabase returned ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Could not load blog URLs for the sitemap:", error);
    return [];
  }
}

async function getPublishedSeoPages() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) return [];

  const query = new URL("/rest/v1/dash_seo_pages", supabaseUrl);
  query.searchParams.set("select", "page_type,product,slug,updated_at,published_at");
  query.searchParams.set("is_published", "eq.true");
  query.searchParams.set("slug", "not.is.null");
  query.searchParams.set("order", "published_at.desc");

  try {
    const response = await fetch(query, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
      next: {
        revalidate: 86400,
        tags: ["sitemap-content"],
      },
    });

    if (!response.ok) {
      throw new Error(`Supabase returned ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Could not load SEO page URLs for the sitemap:", error);
    return [];
  }
}

export async function generateSitemap() {
  const generatedAt = new Date();
  const [blogPosts, seoPages] = await Promise.all([
    getPublishedBlogPosts(),
    getPublishedSeoPages(),
  ]);

  const latestBlogDate = blogPosts.reduce((latest, post) => {
    const postDate = toDate(post.updated_at || post.published_at, latest);
    return postDate > latest ? postDate : latest;
  }, new Date("2026-06-13T00:00:00.000Z"));

  const permanentEntries = staticRoutes.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified:
      route.path === "/blog"
        ? latestBlogDate
        : new Date(`${route.lastModified}T00:00:00.000Z`),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const blogEntries = blogPosts.map((post) => ({
    url: `${SITE_URL}/blog/${encodeURIComponent(post.slug)}`,
    lastModified: toDate(post.updated_at || post.published_at, generatedAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const seoPageEntries = seoPages
    .filter((page) => SEO_PAGE_SEGMENT[page.page_type])
    .map((page) => {
      const segment = SEO_PAGE_SEGMENT[page.page_type];
      const productId = resolveProductApp(page.product)?.id;
      const path = productId
        ? `/${segment}/${productId}/${encodeURIComponent(page.slug)}`
        : `/${segment}/${encodeURIComponent(page.slug)}`;
      return {
        url: `${SITE_URL}${path}`,
        lastModified: toDate(page.updated_at || page.published_at, generatedAt),
        changeFrequency: "monthly",
        priority: 0.7,
      };
    });

  return [...permanentEntries, ...blogEntries, ...seoPageEntries];
}
