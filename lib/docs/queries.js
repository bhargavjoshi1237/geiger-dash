import { createClient } from "@/utils/supabase/server";
import { defaultDocsNavigation, getFallbackDocsPage } from "@/lib/docs/default-content";

function normalizeSlug(slug) {
  if (Array.isArray(slug)) return slug.filter(Boolean).join("/") || "welcome";
  return slug || "welcome";
}

function toHref(slug) {
  return slug === "welcome" ? "/docs/welcome" : `/docs/${slug}`;
}

function groupNavigation(groups = []) {
  if (!groups.length) return defaultDocsNavigation;

  return groups.map((group) => ({
    title: group.title,
    links: (group.docs_pages || []).map((page) => ({
      label: page.nav_label || page.title,
      slug: page.slug,
      href: toHref(page.slug),
      chevron: Boolean(page.has_children),
    })),
  }));
}

function formatPage(page, blocks = []) {
  return {
    slug: page.slug,
    groupTitle: page.docs_nav_groups?.title || "Docs",
    title: page.title,
    description: page.description,
    preview: page.preview,
    toc: page.toc || [],
    blocks: blocks.map((block) => ({
      id: block.anchor_id,
      type: block.block_type,
      eyebrow: block.eyebrow,
      title: block.title,
      body: block.body || [],
      cards: block.cards || [],
      features: block.features || [],
      links: block.links || [],
    })),
  };
}

export async function getDocsNavigation() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("docs_nav_groups")
    .select(
      "id,title,sort_order,docs_pages(id,slug,title,nav_label,sort_order,has_children,status)",
    )
    .eq("docs_pages.status", "published")
    .order("sort_order", { ascending: true })
    .order("sort_order", { ascending: true, referencedTable: "docs_pages" });

  if (error) return defaultDocsNavigation;
  return groupNavigation(data);
}

export async function getDocsPage(slug) {
  const normalizedSlug = normalizeSlug(slug);
  const supabase = await createClient();

  const { data: page, error: pageError } = await supabase
    .from("docs_pages")
    .select("*,docs_nav_groups(title)")
    .eq("slug", normalizedSlug)
    .eq("status", "published")
    .single();

  if (pageError || !page) return getFallbackDocsPage(normalizedSlug);

  const { data: blocks, error: blockError } = await supabase
    .from("docs_content_blocks")
    .select("*")
    .eq("page_id", page.id)
    .order("sort_order", { ascending: true });

  if (blockError) return formatPage(page, []);
  return formatPage(page, blocks);
}

export async function getDocsPageWithNavigation(slug) {
  const [navigation, page] = await Promise.all([getDocsNavigation(), getDocsPage(slug)]);
  return { navigation, page };
}
