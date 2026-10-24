-- Help comms ai providers page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the comms/ai-providers draft outline from
-- 20261024191800_help_comms_structure with the full AI providers guide (Settings → AI Providers). Comms isn't deployed
-- yet, so the page stays a draft. Left out: the Answers in the Messenger switch ("Arrives with the Messenger update.")
-- and the local presets (Ollama, vLLM, LM Studio), which only a self-hosted deployment allows.
-- Written from a survey of C:\Pro\geiger-comms (components/internal/screens/settings/ai_providers.jsx, settings/ai/*,
-- components/internal/shared/ai_unavailable.jsx, lib/ai/features.js, provider_kinds.js, url_guard.js,
-- lib/server/ai_quota.js, app/api/ai/providers/**, app/api/ai/settings/route.js, lib/hooks/use-ai-status.js).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'AI providers',
    description = 'Connect your own AI provider, choose the default chat and embedding models, confirm data sharing, and switch each AI feature on or off.'
where slug = 'comms/ai-providers' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'comms/ai-providers' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.sort_order
from (
  values
    (
      'connecting-a-provider',
      'Basics',
      'Connecting a provider',
      $html$<p>Comms's AI features run on your own AI provider account, with your key, and your provider bills you directly. To connect one, go to <strong>Settings → AI Providers</strong> and choose <strong>Connect provider</strong>.</p><ol><li>Pick the <strong>Provider</strong>, or one of the <strong>Presets</strong>.</li><li>Give the connection a <strong>Name</strong>.</li><li>Paste the <strong>API key</strong>.</li><li>Check the <strong>Base URL</strong> and models, as the provider needs.</li><li>Choose <strong>Connect</strong>.</li></ol><p>Comms tests the key straight away. When the test passes and there's no default chat or embedding model, the new provider fills that default. Keys are stored encrypted, and only their last four characters are ever shown.</p><p>Connecting and changing providers needs the <strong>Manage settings</strong> permission, which the Owner and Admin roles have. Roles that can open Settings but can't manage it, such as Manager, see the providers read-only.</p>$html$,
      '[]',
      10
    ),
    (
      'providers-and-models',
      'Reference',
      'Providers and their settings',
      $html$<ul><li><strong>OpenAI</strong> and <strong>Google Gemini</strong>: chat and embeddings.</li><li><strong>Anthropic</strong> and <strong>OpenRouter</strong>: chat.</li><li><strong>Cohere</strong> and <strong>Voyage AI</strong>: embeddings.</li><li><strong>OpenAI-compatible</strong>: any server with an OpenAI-style API. It needs a <strong>Base URL</strong>, such as <code>https://api.groq.com/openai/v1</code>, and under <strong>Capabilities</strong> you pick Chat, Embeddings or both.</li><li><strong>Presets</strong>: Groq, Together AI, Fireworks, Mistral, DeepSeek and xAI, set up as OpenAI-compatible chat providers.</li></ul><p>A base URL must be a public <code>https://</code> address. Changing it asks for the API key again. <strong>Chat models</strong> lists the models the connection offers; the first one is its default, and you can add another by its model id.</p>$html$,
      '[]',
      20
    ),
    (
      'default-models',
      'Concepts',
      'Default models',
      $html$<p>Every AI feature in the project uses the defaults under <strong>Default Models</strong>:</p><ul><li><strong>Chat</strong>: the <strong>Chat provider</strong> and <strong>Chat model</strong> used for drafting, rewriting, summaries, translation and knowledge gap clustering. Without a default chat model, AI features stay off.</li><li><strong>Embeddings</strong>: the <strong>Embedding provider</strong> and model used to index your articles and match customer questions for knowledge gaps. Without one, knowledge gaps match questions by text search.</li></ul><p>You can also set a provider as a default from its row: <strong>Use for chat</strong> or <strong>Use for embeddings</strong>. Comms checks an embedding model's size before saving it. Switching the embedding model when articles are already indexed asks you to confirm, then deletes the index and rebuilds it with the new model.</p>$html$,
      '[]',
      30
    ),
    (
      'data-sharing',
      'Concepts',
      'Data sharing',
      $html$<p>Before any content goes to your provider, someone who manages settings has to confirm data sharing. Until then, every AI feature stays off. Comms asks for it when you set your first default, or you can choose <strong>Review & confirm</strong> beside <strong>Data sharing</strong> under <strong>AI Features</strong>.</p><p>Confirming means article text, customer questions and the inbox conversations teammates use AI on are sent to your provider to generate results. Conversation summaries include internal notes. Your provider's terms and data retention apply. The row then shows who confirmed it and when, and <strong>Withdraw</strong> turns every AI feature off again.</p>$html$,
      '[]',
      40
    ),
    (
      'ai-features',
      'Concepts',
      'AI features and daily limits',
      $html$<p>Under <strong>AI Features</strong>, each feature has its own switch and daily limit. All of them start on:</p><ul><li><strong>Article writing assistant</strong>: drafting and rewriting in the article editor. Daily limit 300.</li><li><strong>Article translation</strong>: machine-translating articles into drafts. Daily limit 100.</li><li><strong>Knowledge gap clustering</strong>: grouping unanswered questions into topics. Without it, gaps are grouped by keywords. Daily limit 40.</li><li><strong>Inbox copilot</strong>: conversation summaries and reply rewrites. Daily limit 300.</li><li><strong>Inbox translation</strong>: translating reply drafts and customer messages. Daily limit 100.</li></ul><p>Type a limit from 0 to 100,000 and press <code>Enter</code> or leave the field; 0 turns the feature off. Each row shows how many requests it has used today, and the count resets within 24 hours. Each teammate can also make up to 10 AI requests a minute.</p>$html$,
      '[]',
      50
    ),
    (
      'managing-providers',
      'AI Providers',
      'Managing providers',
      $html$<p>The providers list shows each connection's capabilities, chat models, status, what it's used for, its key's last four characters, its requests over the last 30 days and when it was last checked. The figures across the top show how many are connected, the default chat model, and the requests and error rate over the last 30 days.</p><p>Each row's <strong>⋯</strong> menu has <strong>Test connection</strong>, <strong>Edit</strong>, <strong>Rotate key</strong>, <strong>Use for chat</strong>, <strong>Use for embeddings</strong> and <strong>Delete</strong>. <strong>Rotate key</strong> replaces the stored key and tests the connection right away. <strong>Delete</strong> asks you to confirm first; features that use it as a default turn off until you choose another provider, and its key is erased.</p>$html$,
      '[]',
      60
    ),
    (
      'usage',
      'AI Providers',
      'Usage',
      $html$<p><strong>Usage</strong> charts your AI requests per day over the last 30 days, split into succeeded and failed, with a list of requests by feature. Requests appear once a provider is tested or an AI feature runs.</p>$html$,
      '[]',
      70
    ),
    (
      'ai-unavailable',
      'Troubleshooting',
      'An AI control says it isn''t available',
      $html$<p>When an AI control can't run, it shows why, and how to fix it:</p><ul><li>No provider is connected: connect one under <strong>Settings → AI Providers</strong>.</li><li>A provider is connected but there's no default chat model: choose one under <strong>Default Models</strong>.</li><li>The feature is turned off: turn its switch on, or set its daily limit higher than 0, under <strong>AI Features</strong>.</li><li>Data sharing hasn't been confirmed: confirm it under <strong>AI Features → Data sharing</strong>.</li><li>The provider isn't responding: it returned an error, which the notice quotes. Choose <strong>Test connection</strong> on it, and rotate the key if it's been revoked.</li><li>Today's limit for the feature is used up: it resets within 24 hours, or someone who manages settings can raise it.</li></ul><p>Teammates who can't manage settings see who to ask instead of a setup button.</p>$html$,
      '[]',
      80
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"Inbox","label":"Inbox","href":"/help/comms/inbox"},{"icon":"FileText","label":"Articles","href":"/help/comms/articles"},{"icon":"FileQuestionMark","label":"Knowledge gaps","href":"/help/comms/knowledge-gaps"}]',
      90
    )
) as v(anchor_id, eyebrow, title, content, links, sort_order)
cross join (select id from public.docs_pages where slug = 'comms/ai-providers' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'AI providers',
    description = 'Connect your own AI provider and choose which AI features Comms uses.'
where slug = 'comms/ai-providers' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'comms/ai-providers' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Connecting a provider</li><li>Default models</li><li>AI features and limits</li><li>Data sharing</li><li>Usage</li></ul>',
  10
from public.docs_pages p
where p.slug = 'comms/ai-providers' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
