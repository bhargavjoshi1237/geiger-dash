import { createClient } from '@supabase/supabase-js'
import { getBlogAutomationConfig, profileForRole } from './config'
import { callAutomationLlm, extractJson } from './llm'
import { formatResearch, searchTopic } from './research'

const PRODUCT_CONTEXT = `
Geiger Studio is a connected work suite covering projects, docs, notes, forms,
assets, chat, knowledge, events, campaigns, content, and collaborative canvases.
Articles must help readers solve a real problem before mentioning Geiger.
`

function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.')
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  })
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 180)
}

function stripFences(value) {
  return String(value || '')
    .replace(/^```(?:html)?\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim()
}

function textWordCount(html) {
  return String(html || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .split(/\s+/)
    .filter(Boolean).length
}

async function runRole({ supabase, config, runId, topicId, role, messages, temperature }) {
  return callAutomationLlm({
    supabase,
    runId,
    topicId,
    role,
    profile: profileForRole(config, role),
    messages,
    temperature,
  })
}

async function getDailyRunCount(supabase) {
  const start = new Date()
  start.setUTCHours(0, 0, 0, 0)
  const { count, error } = await supabase
    .from('dash_blog_automation_runs')
    .select('id', { count: 'exact', head: true })
    .gte('started_at', start.toISOString())
  if (error) throw error
  return count || 0
}

async function recentContext(supabase) {
  const [{ data: posts }, { data: changelogs }, { data: topics }] = await Promise.all([
    supabase.from('dash_blog_posts').select('title,slug,category,tags').order('created_at', {
      ascending: false,
    }).limit(50),
    supabase.from('dash_changelog').select('title,product,description').order('release_date', {
      ascending: false,
    }).limit(20),
    supabase.from('dash_blog_topics').select('topic,status').order('created_at', {
      ascending: false,
    }).limit(100),
  ])
  return { posts: posts || [], changelogs: changelogs || [], topics: topics || [] }
}

export async function runBlogAutomation({ trigger = 'cron', force = false } = {}) {
  const config = getBlogAutomationConfig()
  if (!config.enabled && !force) {
    return { ok: true, skipped: true, reason: 'BLOG_AUTOMATION_ENABLED is false' }
  }

  const supabase = createServiceClient()
  const dailyRuns = await getDailyRunCount(supabase)
  if (!force && dailyRuns >= config.dailyLimit) {
    return { ok: true, skipped: true, reason: 'Daily automation limit reached', dailyRuns }
  }

  const { data: run, error: runError } = await supabase
    .from('dash_blog_automation_runs')
    .insert({ trigger, status: 'running', metadata: { daily_run_number: dailyRuns + 1 } })
    .select('id')
    .single()
  if (runError) throw runError

  let topicId
  try {
    const context = await recentContext(supabase)
    const discovery = await runRole({
      supabase,
      config,
      runId: run.id,
      role: 'strategist',
      temperature: 0.5,
      messages: [
        {
          role: 'system',
          content: `You are Geiger Studio's content strategist. ${PRODUCT_CONTEXT}
Choose one high-value topic that is not duplicated in the supplied history.
Return JSON only with: topic, primary_keyword, intent, cluster, angle,
business_relevance (0-100), search_gap (0-100), priority (0-100), rationale.`,
        },
        {
          role: 'user',
          content: JSON.stringify({
            seed_topics: config.seedTopics,
            existing_posts: context.posts,
            recent_topics: context.topics,
            recent_product_updates: context.changelogs,
          }),
        },
      ],
    })

    const topic = extractJson(discovery.text)
    if (!topic?.topic || !topic?.primary_keyword) {
      throw new Error('The strategist did not return a valid topic.')
    }

    const { data: topicRecord, error: topicError } = await supabase
      .from('dash_blog_topics')
      .insert({
        run_id: run.id,
        topic: topic.topic,
        primary_keyword: topic.primary_keyword,
        search_intent: topic.intent || 'informational',
        cluster_name: topic.cluster || null,
        angle: topic.angle || null,
        business_relevance: Number(topic.business_relevance || 0),
        search_gap: Number(topic.search_gap || 0),
        priority_score: Number(topic.priority || 0),
        status: 'researching',
        metadata: { rationale: topic.rationale || '' },
      })
      .select('id')
      .single()
    if (topicError) throw topicError
    topicId = topicRecord.id

    let sources = []
    let researchError = ''
    try {
      sources = await searchTopic(
        config,
        `${topic.primary_keyword} ${topic.angle || topic.topic}`
      )
    } catch (error) {
      researchError = error.message
    }
    if (sources.length > 0) {
      const { error: sourceError } = await supabase.from('dash_blog_research_sources').insert(
        sources.map((source) => ({
          run_id: run.id,
          topic_id: topicId,
          title: source.title,
          url: source.url,
          snippet: source.snippet,
          source_type: source.sourceType,
          relevance_score: source.score,
        }))
      )
      if (sourceError) throw sourceError
    }

    const researchPackage = await runRole({
      supabase,
      config,
      runId: run.id,
      topicId,
      role: 'researcher',
      temperature: 0.2,
      messages: [
        {
          role: 'system',
          content: `Build a factual research brief for a people-first article.
Separate sourced facts from recommendations. Never invent statistics.
Include reader questions, definitions, examples, counterpoints, and a unique
framework or workflow Geiger can contribute. Cite source URLs inline.`,
        },
        {
          role: 'user',
          content: `Topic: ${JSON.stringify(topic)}\n\nResearch:\n${formatResearch(sources)}`,
        },
      ],
    })

    const critique = await runRole({
      supabase,
      config,
      runId: run.id,
      topicId,
      role: 'critic',
      temperature: 0.2,
      messages: [
        {
          role: 'system',
          content: `Audit this research brief for weak claims, missing perspectives,
search-intent mismatch, generic advice, and opportunities for original value.
Return a concise correction plan for the writer.`,
        },
        { role: 'user', content: researchPackage.text },
      ],
    })

    const article = await runRole({
      supabase,
      config,
      runId: run.id,
      topicId,
      role: 'writer',
      temperature: 0.55,
      messages: [
        {
          role: 'system',
          content: `Write a substantial, practical article for Geiger Studio.
${PRODUCT_CONTEXT}
Return JSON only with title, slug, excerpt, category, tags (array),
content_html, meta_title, meta_description, and reading_time_minutes.
content_html must be semantic HTML without h1/html/body tags. Include a direct
40-60 word answer near the start, useful headings, a table when appropriate,
step-by-step guidance, an original framework or workflow, FAQs, and a Sources
section linking only to supplied URLs. Do not fabricate experience, quotes,
benchmarks, features, or facts. Product references must be relevant and restrained.`,
        },
        {
          role: 'user',
          content: `TOPIC\n${JSON.stringify(topic)}

RESEARCH BRIEF
${researchPackage.text}

CRITIC CORRECTIONS
${critique.text}`,
        },
      ],
    })

    const draft = extractJson(article.text)
    if (!draft?.title || !draft?.excerpt || !draft?.content_html) {
      throw new Error('The writer did not return a valid article draft.')
    }

    const review = await runRole({
      supabase,
      config,
      runId: run.id,
      topicId,
      role: 'reviewer',
      temperature: 0.1,
      messages: [
        {
          role: 'system',
          content: `Act as a strict editorial gate. Return JSON only:
{"score":0-100,"approved":boolean,"issues":[],"strengths":[]}.
Reject unsupported claims, fake citations, thin content, keyword stuffing,
generic filler, misleading product claims, or content that does not satisfy intent.`,
        },
        { role: 'user', content: JSON.stringify(draft) },
      ],
    })
    const quality = extractJson(review.text) || {
      score: 0,
      approved: false,
      issues: ['Reviewer returned invalid output'],
    }

    const slugBase = slugify(draft.slug || draft.title)
    const { count: slugCount } = await supabase
      .from('dash_blog_posts')
      .select('id', { count: 'exact', head: true })
      .eq('slug', slugBase)
    const slug = slugCount ? `${slugBase}-${new Date().toISOString().slice(0, 10)}` : slugBase
    const content = stripFences(draft.content_html)
    const approved =
      quality.approved === true && Number(quality.score || 0) >= config.qualityThreshold
    const publish = config.autoPublish && approved
    const wordCount = textWordCount(content)

    const { data: post, error: postError } = await supabase
      .from('dash_blog_posts')
      .insert({
        title: draft.title,
        slug,
        excerpt: draft.excerpt,
        content,
        author_name: config.authorName,
        category: draft.category || config.defaultCategory,
        tags: Array.isArray(draft.tags) ? draft.tags.slice(0, 12) : [],
        is_published: publish,
        is_featured: false,
        published_at: publish ? new Date().toISOString() : null,
        reading_time_minutes:
          Number(draft.reading_time_minutes) || Math.max(1, Math.ceil(wordCount / 220)),
      })
      .select('id,slug,is_published')
      .single()
    if (postError) throw postError

    await Promise.all([
      supabase
        .from('dash_blog_topics')
        .update({
          status: publish ? 'published' : approved ? 'approved' : 'needs_review',
          quality_score: Number(quality.score || 0),
          metadata: {
            rationale: topic.rationale || '',
            review: quality,
            research_error: researchError,
            seo: {
              meta_title: draft.meta_title || '',
              meta_description: draft.meta_description || '',
            },
          },
        })
        .eq('id', topicId),
      supabase
        .from('dash_blog_automation_runs')
        .update({
          status: publish ? 'published' : 'drafted',
          topic_id: topicId,
          blog_post_id: post.id,
          quality_score: Number(quality.score || 0),
          completed_at: new Date().toISOString(),
          metadata: {
            daily_run_number: dailyRuns + 1,
            source_count: sources.length,
            research_error: researchError,
            word_count: wordCount,
            approved,
            auto_published: publish,
            review_issues: quality.issues || [],
          },
        })
        .eq('id', run.id),
    ])

    return {
      ok: true,
      runId: run.id,
      topicId,
      post,
      qualityScore: Number(quality.score || 0),
      approved,
      sourceCount: sources.length,
      wordCount,
    }
  } catch (error) {
    await supabase
      .from('dash_blog_automation_runs')
      .update({
        status: 'failed',
        topic_id: topicId || null,
        error_message: error.message,
        completed_at: new Date().toISOString(),
      })
      .eq('id', run.id)
    if (topicId) {
      await supabase.from('dash_blog_topics').update({ status: 'failed' }).eq('id', topicId)
    }
    throw error
  }
}
