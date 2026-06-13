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
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("dash_blog_posts")
      .select("id,title,excerpt,slug,category,featured_image,published_at,reading_time_minutes")
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .limit(3);

    if (error) {
      console.error("Failed to load homepage blog posts:", error);
      return [];
    }

    return data || [];
  },
  ["homepage-blog-posts"],
  {
    revalidate: PUBLIC_CONTENT_REVALIDATE_SECONDS,
    tags: ["homepage-content", "blog-posts"],
  },
);
