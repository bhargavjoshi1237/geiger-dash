-- Changelog table for tracking product updates and releases
CREATE TABLE IF NOT EXISTS public.dash_changelog (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  version TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('feature', 'improvement', 'bugfix', 'breaking')),
  product TEXT NOT NULL CHECK (product IN ('geiger-flow', 'geiger-notes', 'geiger-dash', 'geiger-dam', 'geiger-grey')),
  release_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT dash_changelog_pkey PRIMARY KEY (id)
);

-- Changelog items for detailed updates
CREATE TABLE IF NOT EXISTS public.dash_changelog_items (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  changelog_id UUID NOT NULL REFERENCES public.dash_changelog(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('added', 'changed', 'fixed', 'removed', 'deprecated')),
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT dash_changelog_items_pkey PRIMARY KEY (id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_changelog_product ON public.dash_changelog(product);
CREATE INDEX IF NOT EXISTS idx_changelog_category ON public.dash_changelog(category);
CREATE INDEX IF NOT EXISTS idx_changelog_date ON public.dash_changelog(release_date DESC);
CREATE INDEX IF NOT EXISTS idx_changelog_featured ON public.dash_changelog(is_featured);
CREATE INDEX IF NOT EXISTS idx_changelog_items_changelog_id ON public.dash_changelog_items(changelog_id);

-- Enable Row Level Security
ALTER TABLE public.dash_changelog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dash_changelog_items ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (changelogs are public)
CREATE POLICY "Public changelogs are viewable by everyone" 
  ON public.dash_changelog FOR SELECT 
  USING (true);

CREATE POLICY "Public changelog items are viewable by everyone" 
  ON public.dash_changelog_items FOR SELECT 
  USING (true);

-- Create policies for authenticated users to manage changelogs
CREATE POLICY "Authenticated users can insert changelogs" 
  ON public.dash_changelog FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update changelogs" 
  ON public.dash_changelog FOR UPDATE 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete changelogs" 
  ON public.dash_changelog FOR DELETE 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert changelog items" 
  ON public.dash_changelog_items FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update changelog items" 
  ON public.dash_changelog_items FOR UPDATE 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete changelog items" 
  ON public.dash_changelog_items FOR DELETE 
  USING (auth.role() = 'authenticated');

-- Insert sample changelog data
INSERT INTO public.dash_changelog (version, title, description, category, product, release_date, is_featured) VALUES
('1.2.0', 'Enhanced Collaboration Features', 'Introducing real-time collaboration tools and improved sharing capabilities across all products.', 'feature', 'geiger-flow', '2026-03-14 00:00:00+00', true),
('1.1.5', 'Performance Improvements', 'Major performance optimization across all modules with 40% faster load times.', 'improvement', 'geiger-notes', '2026-03-10 00:00:00+00', false),
('1.1.4', 'Bug Fixes and Stability', 'Fixed various UI glitches and improved application stability.', 'bugfix', 'geiger-dash', '2026-03-05 00:00:00+00', false);

-- Insert sample changelog items
INSERT INTO public.dash_changelog_items (changelog_id, type, description) VALUES
((SELECT id FROM public.dash_changelog WHERE version = '1.2.0'), 'added', 'Real-time cursor tracking and collaboration'),
((SELECT id FROM public.dash_changelog WHERE version = '1.2.0'), 'added', 'New sharing panel with granular permissions'),
((SELECT id FROM public.dash_changelog WHERE version = '1.2.0'), 'changed', 'Improved notification system for collaborative actions'),
((SELECT id FROM public.dash_changelog WHERE version = '1.1.5'), 'changed', 'Optimized database queries for faster data fetching'),
((SELECT id FROM public.dash_changelog WHERE version = '1.1.5'), 'changed', 'Implemented lazy loading for better performance'),
((SELECT id FROM public.dash_changelog WHERE version = '1.1.4'), 'fixed', 'Fixed sidebar navigation issues on mobile devices'),
((SELECT id FROM public.dash_changelog WHERE version = '1.1.4'), 'fixed', 'Resolved memory leaks in canvas components');
