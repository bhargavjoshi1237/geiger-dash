const SITE_URL = "https://geiger.studio";

const staticRoutes = [
  { path: "", lastModified: "2026-06-13", changeFrequency: "weekly", priority: 1 },
  { path: "/tools", lastModified: "2026-06-13", changeFrequency: "monthly", priority: 0.9 },
  { path: "/tools/image-crop", lastModified: "2026-06-13", changeFrequency: "monthly", priority: 0.8 },
  { path: "/tools/image-resize", lastModified: "2026-06-13", changeFrequency: "monthly", priority: 0.8 },
  { path: "/tools/image-converter", lastModified: "2026-06-13", changeFrequency: "monthly", priority: 0.8 },
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

export async function generateSitemap() {
  const generatedAt = new Date();
  const blogPosts = await getPublishedBlogPosts();

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

  return [...permanentEntries, ...blogEntries];
}
