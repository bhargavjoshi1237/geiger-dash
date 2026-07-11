// Adapts the benchmark-blog-rewriter skill (SKILL.md + references/voice.md +
// references/structure.md) into a system prompt for an OpenAI-compatible model.
// The skill writes markdown to disk in Claude Code; here we keep its editorial
// rules but ask for HTML output + a full post payload so it drops straight into
// the studio editor and the public renderer.

export const BLOG_IMPORT_SYSTEM_PROMPT = `You turn a source benchmark/model article into an original, human-voiced review blog post written from an independent reviewer's perspective.

THE FRAMING (get this right or the post is unusable). Three parties:
1. The benchmark runner (e.g. Artificial Analysis) — ran the tests, published the data.
2. The publisher (our site) — READ the data and is writing commentary on it.
3. The model vendor — shipped the thing being measured.
The post is the publisher reviewing the benchmark runner's results.
- NEVER imply the publisher ran the tests. No "our results", "we evaluated", "in our testing", "we found". Strip the source's first-person voice completely.
- ALWAYS attribute specific figures to the benchmark runner, varying the phrasing ("according to Artificial Analysis", "per their numbers", "the breakdown shows..."). Two or three attributions across the post is enough — place them where a reader asks "says who?".
- PARAPHRASE, never reproduce. Restate findings in different words and a different structure. Numbers and model names are facts and can be used freely; sentences cannot. Never reproduce the source's section order.

THE ANGLE. Before writing, find the one thing in the data that's genuinely interesting or uncomfortable — the tension a thoughtful reader notices. It's almost never the headline number (a hidden cost, a tradeoff, a contradiction). The angle becomes the H1 and the opening.

STRUCTURE. Target 800–1200 words. Use <h2> headers that state a claim, not a topic. Open with the finding or tension (a real number + a reason to keep reading in the first two sentences) — never a definition or "in the rapidly evolving world of AI". Walk the benchmark deltas grouped by theme; give the honest tradeoff its own section and name the specific cheaper/better alternative when the data supports it. Close with a decision (who should test it, who should stay put, what number to watch), not a summary.

VOICE. Read like a working analyst wrote it in one sitting — opinionated, specific, slightly impatient with hype. Vary sentence length. Avoid AI tells: hollow connectives ("it's worth noting that", "notably", "furthermore"), hedged nothing-claims, converting every finding into bullets, concluding by restating. Use bullets only for genuinely list-shaped content (a specs list). A number without a comparison is useless — always pair a figure with its rival.

DOMAIN VOCABULARY (use correctly, don't over-explain): Intelligence Index, GDPval-AA, AA-Briefcase, AA-Omniscience, HLE, GPQA Diamond, SciCode, TerminalBench, tau-bench, Pareto frontier, open weights (not "open source"), active vs total parameters, cost per task, agentic turns.

HARD RULES:
- Never invent numbers. Use only figures present in the source; if a figure isn't there, leave it out. Never round or estimate.
- No sentence lifted or near-lifted from the source.
- The content field must be a clean semantic HTML fragment: use <h2>, <h3>, <p>, <ul>, <ol>, <li>, <strong>, <em>, <blockquote>, <hr>, and <img> for supplied images. No <html>, <head>, <body>, no markdown, no code fences.`

// Build the user message: the extracted source text plus the exact output
// contract (JSON with every field the studio needs filled in).
export function buildBlogImportUserPrompt({ sourceText, categories = [], images = [] }) {
  const categoryList = categories.filter(Boolean)
  const categoryLine = categoryList.length
    ? `Choose the single best-fit category from this exact list (return its name verbatim): ${categoryList.join(', ')}.`
    : 'Suggest a short category name (1-3 words).'

  // Offer images as placeholder tokens so the model can place the source's
  // charts/screenshots without us shipping long or base64 URLs into the prompt.
  const imageBlock = images.length
    ? `\nIMAGES FROM THE SOURCE (charts, screenshots, figures). Place the relevant ones in the content where they support a point, using the EXACT placeholder token as the src — e.g. <img src="{{IMAGE_1}}" alt="short description">. Use each token at most once, keep them in a sensible order, and skip any that don't add value. Do NOT invent image URLs and do NOT use a token that isn't listed.\n${images
        .map((img, index) => `{{IMAGE_${index + 1}}} — ${img.alt ? `alt: "${img.alt}"` : 'no alt text'}`)
        .join('\n')}\n`
    : ''

  return `Here is the source article to review. Read it, find the angle, and write an original review post.

SOURCE ARTICLE:
"""
${sourceText}
"""
${imageBlock}
${categoryLine}

Respond with ONLY a JSON object (no prose, no code fences) in this exact shape:
{
  "title": "editorial H1 for the post — the angle, not the score",
  "slug": "url-friendly-slug",
  "seoTitle": "SEO meta title: front-load the entity people search, then the angle",
  "excerpt": "150-160 char meta description: lead with a concrete number, then the tension that makes someone click",
  "category": "one category name",
  "tags": ["3-6", "lowercase", "topical tags"],
  "readingTimeMinutes": 6,
  "coverImage": "${images.length ? 'the placeholder token of the best hero image for the cover, e.g. {{IMAGE_1}}, or empty string if none fits' : 'empty string'}",
  "content": "the full article body as an HTML fragment"
}`
}

// Swap the {{IMAGE_n}} placeholders in generated HTML back to real image URLs,
// then drop any placeholder the model referenced but we couldn't fill.
export function applySourceImages(content, images = []) {
  let out = String(content || '')
  images.forEach((img, index) => {
    if (img?.src) out = out.split(`{{IMAGE_${index + 1}}}`).join(img.src)
  })
  // Remove <img> tags (and stray tokens) that still point at an unresolved slot.
  out = out.replace(/<img\b[^>]*\{\{IMAGE_\d+\}\}[^>]*>/gi, '')
  out = out.replace(/\{\{IMAGE_\d+\}\}/g, '')
  return out
}

// Normalise the model's JSON into a create-post payload. Returns null when the
// essential fields are missing so the caller can surface a retry.
export function normalizeImportedPost(result, { categories = [], images = [] } = {}) {
  if (!result || typeof result !== 'object') return null

  const title = String(result.title || '').trim()
  const content = applySourceImages(String(result.content || '').trim(), images)
  if (!title || !content) return null

  const tags = Array.isArray(result.tags)
    ? result.tags.map((tag) => String(tag || '').trim()).filter(Boolean)
    : String(result.tags || '')
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean)

  // Prefer a model-picked category that matches our list; fall back to the
  // first known category, then to the model's free-text suggestion.
  const suggested = String(result.category || '').trim()
  const matched = categories.find((name) => name.toLowerCase() === suggested.toLowerCase())
  const category = matched || suggested || categories[0] || 'Uncategorized'

  const readingTime = Number(result.readingTimeMinutes)

  // Resolve the cover: a raw URL or a model-picked {{IMAGE_n}} token wins,
  // otherwise fall back to the first source image so imported posts still get a
  // featured image.
  const coverRaw = String(result.coverImage || '').trim()
  let featuredImage = ''
  if (/^https?:\/\//i.test(coverRaw) || /^data:image\//i.test(coverRaw)) {
    featuredImage = coverRaw
  } else if (coverRaw) {
    const resolved = applySourceImages(coverRaw, images).trim()
    if (resolved && resolved !== coverRaw) featuredImage = resolved
  }
  if (!featuredImage) featuredImage = images[0]?.src || ''

  return {
    title,
    slug: String(result.slug || '').trim(),
    excerpt: String(result.excerpt || result.seoTitle || '').trim(),
    seoTitle: String(result.seoTitle || '').trim(),
    category,
    tags,
    content,
    featuredImage,
    readingTimeMinutes: Number.isFinite(readingTime) && readingTime > 0 ? Math.round(readingTime) : 0,
  }
}
