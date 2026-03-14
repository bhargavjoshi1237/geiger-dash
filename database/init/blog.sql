-- Blog posts table
CREATE TABLE IF NOT EXISTS public.dash_blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  author_avatar TEXT,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  featured_image TEXT,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  reading_time_minutes INTEGER DEFAULT 5,
  views INTEGER DEFAULT 0,
  CONSTRAINT dash_blog_posts_pkey PRIMARY KEY (id)
);

-- Blog categories table
CREATE TABLE IF NOT EXISTS public.dash_blog_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT DEFAULT '#10b981',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT dash_blog_categories_pkey PRIMARY KEY (id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.dash_blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON public.dash_blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON public.dash_blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_is_published ON public.dash_blog_posts(is_published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_is_featured ON public.dash_blog_posts(is_featured);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON public.dash_blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON public.dash_blog_categories(slug);

-- Enable Row Level Security
ALTER TABLE public.dash_blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dash_blog_categories ENABLE ROW LEVEL SECURITY;

-- Create policies for blog posts
CREATE POLICY "Published blog posts are viewable by everyone" 
  ON public.dash_blog_posts FOR SELECT 
  USING (is_published = true);

CREATE POLICY "Blog categories are viewable by everyone" 
  ON public.dash_blog_categories FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can manage blog posts" 
  ON public.dash_blog_posts FOR ALL 
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage blog categories" 
  ON public.dash_blog_categories FOR ALL 
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Insert sample blog categories
INSERT INTO public.dash_blog_categories (name, slug, description, color) VALUES
('Product Updates', 'product-updates', 'Latest features and improvements to Geiger products', '#3b82f6'),
('Tutorials', 'tutorials', 'Step-by-step guides and how-to articles', '#10b981'),
('Case Studies', 'case-studies', 'Real-world examples and success stories', '#8b5cf6'),
('Company News', 'company-news', 'Announcements and updates from Geiger Studios', '#f59e0b');

-- Insert sample blog posts
INSERT INTO public.dash_blog_posts (title, slug, excerpt, content, author_name, category, tags, is_published, is_featured, published_at, reading_time_minutes) VALUES
('Introducing Geiger Flow 2.0', 'introducing-geiger-flow-2', 'We''re excited to announce the release of Geiger Flow 2.0 with revolutionary new features for workflow automation.', 
'# Geiger Flow 2.0

We are thrilled to introduce **Geiger Flow 2.0**, our most significant update yet! This release brings powerful new features designed to revolutionize your workflow automation experience.

## What''s New

### Enhanced Node System
Our completely redesigned node system now supports:
- Custom node creation
- Dynamic data binding
- Improved connection handling

### Real-time Collaboration
Work together seamlessly with:
- Live cursor tracking
- Instant updates
- Comment threads

## Getting Started
Upgrade to Geiger Flow 2.0 today and experience the future of workflow automation!', 
'Geiger Team', 'Product Updates', ARRAY['workflow', 'automation', 'releases'], true, true, '2026-03-14 00:00:00+00', 5),

('Getting Started with Geiger Notes', 'getting-started-geiger-notes', 'Learn how to make the most of Geiger Notes with this comprehensive beginner''s guide.', 
'# Getting Started with Geiger Notes

Welcome to Geiger Notes! This guide will help you get up and running quickly with our powerful note-taking application.

## Setting Up Your Workspace

1. **Create your first notebook** - Click the "+" button to create a new notebook
2. **Organize with folders** - Use folders to keep related notes together
3. **Use tags** - Add tags for easy searching and filtering

## Pro Tips

- Use keyboard shortcuts for faster navigation
- Enable dark mode for comfortable nighttime work
- Connect your notes to Geiger Flow for powerful integrations

Happy note-taking!', 
'Geiger Team', 'Tutorials', ARRAY['beginner', 'notes', 'tutorial'], true, false, '2026-03-12 00:00:00+00', 8),
('How Acme Corp Saved 40% Development Time', 'acme-corp-case-study', 'Discover how Acme Corporation streamlined their development workflow using Geiger products.', 
'# How Acme Corp Saved 40% Development Time

At Acme Corporation, managing complex development workflows was becoming increasingly challenging...

## The Challenge

Acme Corp''s development team was struggling with:
- Manual process coordination
- Scattered documentation
- Slow feedback loops

## The Solution

After implementing Geiger Flow and Geiger Notes, the team achieved:
- 40% reduction in development time
- 60% improvement in team collaboration
- 90% increase in documentation coverage

## Results

"The Geiger suite has transformed how our team works together" - Sarah Chen, Lead Developer', 
'Geiger Team', 'Case Studies', ARRAY['case-study', 'enterprise', 'success'], true, false, '2026-03-10 00:00:00+00', 12);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to auto-update updated_at
CREATE TRIGGER update_changelog_updated_at 
    BEFORE UPDATE ON public.dash_changelog 
    FOR EACH ROW 
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at 
    BEFORE UPDATE ON public.dash_blog_posts 
    FOR EACH ROW 
    EXECUTE FUNCTION public.update_updated_at_column();
