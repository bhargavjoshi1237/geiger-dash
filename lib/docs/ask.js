import { getPublishedDocsCorpus } from "@/lib/docs/queries";
import { helpHref } from "@/lib/docs/paths";
import { callChatCompletion } from "@/lib/llm/chat-completions";

const MAX_CONTEXT_SECTIONS = 6;
const MAX_SECTION_CHARS = 2500;
const MAX_HISTORY_TURNS = 6;
const STOP_WORDS = new Set(
  "a an and are as at be but by can do does for from get how i if in is it me my of on or so that the this to what when where which who why will with you your".split(" "),
);

const SYSTEM_PROMPT = [
  "You are the assistant for the Geiger Help Center, the documentation for the Geiger product suite.",
  "Answer only from the help center excerpts in the latest user message. If they don't cover the question, say so plainly and suggest browsing the help center or contacting Geiger support; never guess at features, prices or steps.",
  "Be concise. Write plain text: short paragraphs, '- ' bullet lists, numbered steps, and `backticks` for literal values. No HTML and no markdown headings.",
].join(" ");

// DOCS_LLM_* configures Ask AI; without it, the changelog pipeline's provider is reused.
export function getDocsLlmConfig() {
  const docs = {
    baseUrl: process.env.DOCS_LLM_BASE_URL,
    apiKey: process.env.DOCS_LLM_API_KEY,
    model: process.env.DOCS_LLM_MODEL,
  };
  if (docs.baseUrl && docs.apiKey && docs.model) return docs;

  const changelog = {
    baseUrl: process.env.CHANGELOG_LLM_BASE_URL,
    apiKey: process.env.CHANGELOG_LLM_API_KEY,
    model: process.env.CHANGELOG_LLM_MODEL,
  };
  return changelog.baseUrl && changelog.apiKey && changelog.model ? changelog : null;
}

function terms(text) {
  return (String(text || "").toLowerCase().match(/[a-z0-9]+/g) || []).filter(
    (term) => term.length > 1 && !STOP_WORDS.has(term),
  );
}

// Keyword relevance per section; heading hits outweigh body hits and the reader's current page gets a boost.
function rankSections(corpus, question, pageSlug) {
  const queryTerms = [...new Set(terms(question))];
  const ranked = [];
  for (const page of corpus) {
    for (const section of page.sections) {
      if (!section.text) continue;
      const heading = `${page.title} ${section.title}`.toLowerCase();
      const body = section.text.toLowerCase();
      let score = page.slug === pageSlug ? 3 : 0;
      for (const term of queryTerms) {
        if (heading.includes(term)) score += 4;
        score += Math.min(body.split(term).length - 1, 5);
      }
      if (score > 0) ranked.push({ page, section, score });
    }
  }
  return ranked.sort((a, b) => b.score - a.score).slice(0, MAX_CONTEXT_SECTIONS);
}

// Answers a reader's question from published help pages only; returns the pages it drew on as sources.
export async function answerDocsQuestion({ question, pageSlug = "", history = [] }) {
  const config = getDocsLlmConfig();
  if (!config) return { ok: false, error: "Ask AI isn't set up yet." };

  const corpus = await getPublishedDocsCorpus();
  const matches = rankSections(corpus, question, pageSlug);
  const context = matches.length
    ? matches
        .map(
          ({ page, section }, index) =>
            `[${index + 1}] ${page.title}${section.title ? ` / ${section.title}` : ""}\n${section.text.slice(0, MAX_SECTION_CHARS)}`,
        )
        .join("\n\n")
    : "(No help center pages matched this question.)";

  const priorTurns = (Array.isArray(history) ? history : [])
    .filter((turn) => (turn?.role === "user" || turn?.role === "assistant") && turn.content)
    .slice(-MAX_HISTORY_TURNS)
    .map((turn) => ({ role: turn.role, content: String(turn.content).slice(0, 2000) }));

  const raw = await callChatCompletion(
    config,
    [
      { role: "system", content: SYSTEM_PROMPT },
      ...priorTurns,
      { role: "user", content: `Help center excerpts:\n\n${context}\n\nQuestion: ${question}` },
    ],
    { title: "Geiger Help Center", temperature: 0.2, timeoutMs: 60_000 },
  );

  const seen = new Set();
  const sources = [];
  for (const { page, section } of matches) {
    if (seen.has(page.slug)) continue;
    seen.add(page.slug);
    sources.push({ title: page.title, href: helpHref(page.slug, { anchor: section.id }) });
  }

  // Some reasoning models inline their thinking ahead of the answer.
  return { ok: true, answer: raw.replace(/<think>[\s\S]*?<\/think>/gi, "").trim(), sources };
}
