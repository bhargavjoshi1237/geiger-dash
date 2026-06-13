-- Geiger automatic blog research, generation, review, and usage tracking.
-- Run after database/init/blog.sql.

CREATE TABLE IF NOT EXISTS public.dash_blog_automation_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trigger TEXT NOT NULL DEFAULT 'cron' CHECK (trigger IN ('cron', 'manual')),
  status TEXT NOT NULL DEFAULT 'running' CHECK (
    status IN ('running', 'drafted', 'published', 'failed', 'skipped')
  ),
  topic_id UUID,
  blog_post_id UUID REFERENCES public.dash_blog_posts(id) ON DELETE SET NULL,
  quality_score NUMERIC(5,2),
  error_message TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.dash_blog_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID REFERENCES public.dash_blog_automation_runs(id) ON DELETE SET NULL,
  topic TEXT NOT NULL,
  primary_keyword TEXT NOT NULL,
  search_intent TEXT NOT NULL DEFAULT 'informational',
  cluster_name TEXT,
  angle TEXT,
  business_relevance NUMERIC(5,2) NOT NULL DEFAULT 0,
  search_gap NUMERIC(5,2) NOT NULL DEFAULT 0,
  priority_score NUMERIC(5,2) NOT NULL DEFAULT 0,
  quality_score NUMERIC(5,2),
  status TEXT NOT NULL DEFAULT 'discovered' CHECK (
    status IN (
      'discovered', 'researching', 'approved', 'needs_review',
      'published', 'failed', 'rejected'
    )
  ),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.dash_blog_automation_runs
  DROP CONSTRAINT IF EXISTS dash_blog_automation_runs_topic_id_fkey;
ALTER TABLE public.dash_blog_automation_runs
  ADD CONSTRAINT dash_blog_automation_runs_topic_id_fkey
  FOREIGN KEY (topic_id) REFERENCES public.dash_blog_topics(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS public.dash_blog_research_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID REFERENCES public.dash_blog_automation_runs(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES public.dash_blog_topics(id) ON DELETE CASCADE,
  source_type TEXT NOT NULL DEFAULT 'web',
  title TEXT,
  url TEXT NOT NULL,
  snippet TEXT,
  relevance_score NUMERIC(8,6),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.dash_llm_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID REFERENCES public.dash_blog_automation_runs(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES public.dash_blog_topics(id) ON DELETE SET NULL,
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  role TEXT NOT NULL,
  prompt_tokens BIGINT NOT NULL DEFAULT 0,
  completion_tokens BIGINT NOT NULL DEFAULT 0,
  total_tokens BIGINT NOT NULL DEFAULT 0,
  estimated_cost_usd NUMERIC(14,8) NOT NULL DEFAULT 0,
  duration_ms INTEGER,
  success BOOLEAN NOT NULL DEFAULT TRUE,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_automation_runs_started
  ON public.dash_blog_automation_runs(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_automation_runs_status
  ON public.dash_blog_automation_runs(status);
CREATE INDEX IF NOT EXISTS idx_blog_topics_priority
  ON public.dash_blog_topics(priority_score DESC, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_topics_status
  ON public.dash_blog_topics(status);
CREATE INDEX IF NOT EXISTS idx_blog_research_topic
  ON public.dash_blog_research_sources(topic_id);
CREATE INDEX IF NOT EXISTS idx_llm_usage_run
  ON public.dash_llm_usage(run_id);
CREATE INDEX IF NOT EXISTS idx_llm_usage_created
  ON public.dash_llm_usage(created_at DESC);

ALTER TABLE public.dash_blog_automation_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dash_blog_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dash_blog_research_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dash_llm_usage ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view automation runs"
  ON public.dash_blog_automation_runs;
CREATE POLICY "Authenticated users can view automation runs"
  ON public.dash_blog_automation_runs FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can view blog topics"
  ON public.dash_blog_topics;
CREATE POLICY "Authenticated users can view blog topics"
  ON public.dash_blog_topics FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can view research sources"
  ON public.dash_blog_research_sources;
CREATE POLICY "Authenticated users can view research sources"
  ON public.dash_blog_research_sources FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can view LLM usage"
  ON public.dash_llm_usage;
CREATE POLICY "Authenticated users can view LLM usage"
  ON public.dash_llm_usage FOR SELECT
  USING (auth.role() = 'authenticated');

DROP TRIGGER IF EXISTS update_blog_topics_updated_at ON public.dash_blog_topics;
CREATE TRIGGER update_blog_topics_updated_at
  BEFORE UPDATE ON public.dash_blog_topics
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

