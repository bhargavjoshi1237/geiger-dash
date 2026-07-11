-- SEO landing pages (product / solution / feature) written by AI in the studio
-- and rendered publicly under /product, /solutions, /features. Mirrors the
-- dash_blog_posts pattern: published rows readable by everyone, authenticated
-- users manage everything.
CREATE TABLE IF NOT EXISTS public.dash_seo_pages (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  page_type TEXT NOT NULL DEFAULT 'solution',
  product TEXT,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  excerpt TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL,
  hero_heading TEXT,
  hero_subheading TEXT,
  hero_cta_text TEXT,
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT[] DEFAULT '{}',
  cover_image TEXT,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT,
  author_avatar TEXT,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  views INTEGER DEFAULT 0,
  CONSTRAINT dash_seo_pages_pkey PRIMARY KEY (id),
  CONSTRAINT dash_seo_pages_type_check CHECK (page_type IN ('product', 'solution', 'feature'))
);

-- Slug is unique per type so /product/x and /solutions/x can coexist while a
-- given type never has two pages at the same URL.
CREATE UNIQUE INDEX IF NOT EXISTS idx_seo_pages_type_slug ON public.dash_seo_pages(page_type, slug);
CREATE INDEX IF NOT EXISTS idx_seo_pages_published_at ON public.dash_seo_pages(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_seo_pages_is_published ON public.dash_seo_pages(is_published);
CREATE INDEX IF NOT EXISTS idx_seo_pages_product ON public.dash_seo_pages(product);

ALTER TABLE public.dash_seo_pages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Published SEO pages are viewable by everyone" ON public.dash_seo_pages;
CREATE POLICY "Published SEO pages are viewable by everyone"
  ON public.dash_seo_pages FOR SELECT
  USING (is_published = true);

DROP POLICY IF EXISTS "Authenticated users can manage SEO pages" ON public.dash_seo_pages;
CREATE POLICY "Authenticated users can manage SEO pages"
  ON public.dash_seo_pages FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Shared updated_at helper (also defined by blog.sql); redefined here so this
-- file applies standalone.
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_seo_pages_updated_at ON public.dash_seo_pages;
CREATE TRIGGER update_seo_pages_updated_at
  BEFORE UPDATE ON public.dash_seo_pages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
