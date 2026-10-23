import { cache } from "react";
import { createClient } from "@/utils/supabase/server";
import { fallbackHomePage, fallbackNavigation } from "@/lib/docs/default-content";
import { HELP_HOME_SLUG, helpHref } from "@/lib/docs/paths";
import { htmlToText } from "@/lib/docs/text";

const NAV_PAGE_FIELDS = "id,slug,title,nav_label,sort_order,parent_id,status";
const SECTION_FIELDS = "id,anchor_id,eyebrow,title,content,cards,features,links,sort_order";

const bySortOrder = (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0);

export function normalizeSlug(slug) {
  if (Array.isArray(slug)) return slug.filter(Boolean).join("/") || HELP_HOME_SLUG;
  return slug || HELP_HOME_SLUG;
}

function formatSections(blocks = []) {
  return blocks
    .slice()
    .sort(bySortOrder)
    .map((block) => ({
      id: block.anchor_id,
      eyebrow: block.eyebrow || "",
      title: block.title || "",
      content: block.content || "",
      cards: Array.isArray(block.cards) ? block.cards : [],
      features: Array.isArray(block.features) ? block.features : [],
      links: Array.isArray(block.links) ? block.links : [],
    }));
}

function formatPage(page) {
  const sections = formatSections(page.docs_content_blocks);
  return {
    slug: page.slug,
    groupTitle: page.docs_nav_groups?.title || "Help Center",
    title: page.title,
    description: page.description || "",
    preview: page.preview,
    status: page.status,
    updatedAt: page.updated_at,
    sections,
    // The "On this page" list is derived from section titles, so it can't drift from the content.
    toc: sections.filter((section) => section.title).map((section) => ({ label: section.title, href: `#${section.id}` })),
  };
}

// Groups -> top-level pages -> one level of child pages; groups with nothing visible are dropped.
function buildNavigation(groups, preview) {
  return groups
    .slice()
    .sort(bySortOrder)
    .map((group) => {
      const pages = (group.docs_pages || []).slice().sort(bySortOrder);
      const links = new Map(
        pages.map((page) => [
          page.id,
          {
            label: page.nav_label || page.title,
            slug: page.slug,
            href: helpHref(page.slug, { preview }),
            draft: page.status !== "published",
            children: [],
          },
        ]),
      );
      const topLevel = [];
      for (const page of pages) {
        const parent = page.parent_id ? links.get(page.parent_id) : null;
        if (parent) parent.children.push(links.get(page.id));
        else topLevel.push(links.get(page.id));
      }
      return { title: group.title, links: topLevel };
    })
    .filter((group) => group.links.length);
}

// Sidebar navigation. In preview mode editors also see drafts — RLS hides them from everyone else.
export const getDocsNavigation = cache(async (preview = false) => {
  const supabase = await createClient();
  let query = supabase
    .from("docs_nav_groups")
    .select(`id,title,sort_order,docs_pages(${NAV_PAGE_FIELDS})`)
    .is("docs_pages.deleted_at", null);
  if (!preview) query = query.eq("docs_pages.status", "published");

  const { data, error } = await query;
  if (error) {
    console.error("[docs.navigation]", error.message);
    return fallbackNavigation;
  }
  return buildNavigation(data || [], preview);
});

// One page with its sections, or null when it doesn't exist or isn't visible to the viewer.
export const getDocsPage = cache(async (slug, preview = false) => {
  const normalizedSlug = normalizeSlug(slug);
  const supabase = await createClient();
  let query = supabase
    .from("docs_pages")
    .select(`id,slug,title,description,preview,status,updated_at,docs_nav_groups(title),docs_content_blocks(${SECTION_FIELDS})`)
    .eq("slug", normalizedSlug)
    .is("deleted_at", null);
  if (!preview) query = query.eq("status", "published");

  const { data: page, error } = await query.maybeSingle();
  if (error) {
    console.error("[docs.page]", error.message);
    if (normalizedSlug === HELP_HOME_SLUG) return fallbackHomePage;
    throw new Error("The help center is temporarily unavailable.");
  }
  return page ? formatPage(page) : null;
});

export async function getDocsPageWithNavigation(slug, preview = false) {
  const [navigation, page] = await Promise.all([getDocsNavigation(preview), getDocsPage(slug, preview)]);
  return { navigation, page };
}

// Every published page with its sections as plain text; feeds ⌘K search and Ask AI.
export async function getPublishedDocsCorpus() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("docs_pages")
    .select("slug,title,description,sort_order,docs_nav_groups(title,sort_order),docs_content_blocks(anchor_id,title,content,sort_order)")
    .eq("status", "published")
    .is("deleted_at", null);

  if (error) {
    console.error("[docs.corpus]", error.message);
    return [];
  }

  return (data || [])
    .sort(
      (a, b) =>
        (a.docs_nav_groups?.sort_order ?? 0) - (b.docs_nav_groups?.sort_order ?? 0) || bySortOrder(a, b),
    )
    .map((page) => ({
      slug: page.slug,
      title: page.title,
      description: page.description || "",
      groupTitle: page.docs_nav_groups?.title || "Help Center",
      sections: (page.docs_content_blocks || [])
        .slice()
        .sort(bySortOrder)
        .map((block) => ({ id: block.anchor_id, title: block.title || "", text: htmlToText(block.content) })),
    }));
}

// ⌘K entries: each page, plus each titled section with a short snippet to match on.
export async function getDocsSearchEntries() {
  const corpus = await getPublishedDocsCorpus();
  return corpus.flatMap((page) => [
    {
      id: page.slug,
      title: page.title,
      group: page.groupTitle,
      keywords: page.description,
      href: helpHref(page.slug),
      kind: "page",
    },
    ...page.sections
      .filter((section) => section.title)
      .map((section) => ({
        id: `${page.slug}#${section.id}`,
        title: section.title,
        group: page.title,
        keywords: section.text.slice(0, 160),
        href: helpHref(page.slug, { anchor: section.id }),
        kind: "section",
      })),
  ]);
}

// Studio reads. Non-editors get published rows only, because RLS hides drafts from them.

export async function listDocsGroups() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("docs_nav_groups")
    .select("id,title,slug,sort_order")
    .order("sort_order", { ascending: true });
  if (error) {
    console.error("[docs.listGroups]", error.message);
    return [];
  }
  return data || [];
}

export async function listDocsPagesForStudio() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("docs_pages")
    .select("id,nav_group_id,parent_id,slug,title,nav_label,status,sort_order,updated_at")
    .is("deleted_at", null)
    .order("sort_order", { ascending: true });
  if (error) {
    console.error("[docs.listPages]", error.message);
    return [];
  }
  return data || [];
}

export async function getDocsPageForStudio(id) {
  if (!/^[0-9a-f-]{36}$/i.test(String(id || ""))) return null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("docs_pages")
    .select(`id,nav_group_id,parent_id,slug,title,nav_label,description,status,sort_order,updated_at,docs_content_blocks(${SECTION_FIELDS})`)
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle();
  if (error) {
    console.error("[docs.getPageForStudio]", error.message);
    return null;
  }
  if (!data) return null;

  const { docs_content_blocks: blocks, ...page } = data;
  return {
    ...page,
    sections: (blocks || [])
      .slice()
      .sort(bySortOrder)
      .map((block) => ({
        id: block.id,
        anchorId: block.anchor_id,
        eyebrow: block.eyebrow || "",
        title: block.title || "",
        content: block.content || "",
        cards: Array.isArray(block.cards) ? block.cards : [],
        features: Array.isArray(block.features) ? block.features : [],
        links: Array.isArray(block.links) ? block.links : [],
      })),
  };
}
