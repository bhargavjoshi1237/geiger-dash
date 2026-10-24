-- Help grey playground page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the grey/playground draft outline
-- (20261024191700_help_grey_structure) with the full Playground guide and publishes it.
-- Written from a survey of C:\Pro\geiger-grey (components/internal/screens/playground/*, lib/grey/playground.js,
-- prompt.js, lib/supabase/conversations.js, app/api/chat/route.js, lib/engine/turn.js, lib/engine/usage.js,
-- supabase/migrations/20261010120600_pipelines.sql, geiger-rbac.config.js).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Playground',
    description = 'Ask a pipeline questions, check each answer''s citations and the passages it was given, rate answers, and read past conversations.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'grey/playground' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'grey/playground' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.sort_order
from (
  values
    (
      'asking-a-question',
      'Basics',
      'Asking a question',
      $html$<p>To chat with a pipeline, go to <strong>Playground → Chat</strong>. A new chat starts on the project's first live pipeline; pick another from the pipeline menu at the top before you send. Type your question and press <code>Enter</code>, or click one of the example questions. <code>Shift Enter</code> starts a new line, and a message can be up to 8,000 characters.</p><p>The answer streams in under the pipeline's name. To stop it early, press <code>Esc</code> or choose the stop button; Grey keeps what it wrote so far. Once you send the first message, the chat stays on that pipeline: choose <strong>New chat</strong> to switch.</p><p>Chat runs the pipeline's saved settings, including changes that aren't published yet, so you can test a pipeline before you publish it. Every built-in role can use the Playground.</p><p>If the project has no pipelines, Chat offers <strong>Go to pipelines</strong>. If the pipeline has no knowledge bases, it offers <strong>Attach a knowledge base</strong>. See <a href="/help/grey/pipelines">Pipelines and model providers</a>.</p>$html$,
      '[]',
      10
    ),
    (
      'knowledge-base-only',
      'Concepts',
      'Knowledge base only answers',
      $html$<p><strong>Knowledge base only</strong>, beside the message box, decides what the model can answer from. It's on by default, and Grey remembers your choice in this browser.</p><ul><li>On: answers use only passages from the pipeline's knowledge bases. When nothing relevant is found, the answer says so and is marked <strong>Not found in the knowledge base</strong>.</li><li>Off: the model can add general knowledge where the knowledge bases fall short, and says when it does. Those answers are marked <strong>General knowledge allowed</strong>, or <strong>Answered from general knowledge</strong> when no passage was found.</li></ul><p>If the project's monthly soft cap is set to <strong>Pause ingestion, keep retrieval</strong> and spending reaches it, answers are replaced by the most relevant passages under the note <strong>Monthly budget reached</strong>. See <a href="/help/grey/usage#soft-cap">Monthly soft cap</a>.</p>$html$,
      '[]',
      20
    ),
    (
      'citations-and-context',
      'Chat',
      'Citations and context',
      $html$<p>Answers cite their sources with numbered markers, and a <strong>Sources</strong> row under the answer lists them. Click a marker or a source to see its title, page or timestamp, and the passage it came from. <strong>Open source</strong> opens that source's details in Sources, and audio and video start at the quoted moment.</p><p>The answer's header shows how many passages were sent to the model and roughly how many tokens they used, like <code>6 passages · ~2,100 tokens</code>. Click it to see each passage as the model received it, with its retrieval score and whether the answer cited it, and a summary such as how many of the top matches fit the token budget. <strong>Copy</strong> copies the whole context.</p><p>The header also shows how long the question's embedding and the model's reply took. Hover over them for the model, token counts and time to the first token.</p>$html$,
      '[]',
      30
    ),
    (
      'rating-answers',
      'Chat',
      'Rating answers',
      $html$<p>Hover over an answer to see its actions:</p><ul><li><strong>Copy</strong>: copies the answer.</li><li><strong>Ask again</strong>: sends the same question again. Only on the latest answer.</li><li><strong>Helpful</strong> and <strong>Not helpful</strong>: rate the answer. <strong>Not helpful</strong> asks <strong>What was wrong?</strong>, with an optional note, then <strong>Send feedback</strong>. Choose a rating again to clear it.</li><li><strong>Mark unanswered</strong>: flags a question the pipeline couldn't answer.</li></ul><p>Ratings and unanswered questions go to <strong>Quality → Feedback</strong> for review. See <a href="/help/grey/quality">Evaluations and feedback</a>. Your own messages have <strong>Copy</strong> and <strong>Edit in composer</strong>, which puts the text back in the message box.</p>$html$,
      '[]',
      40
    ),
    (
      'run-settings',
      'Chat',
      'Run settings',
      $html$<p>The <strong>Run settings</strong> button at the top of Chat opens a panel showing the pipeline's status (Live or Draft) and configuration: its model, knowledge bases, search type and number of passages, minimum similarity, rerank, graph, citations and maximum tokens. <strong>Edit pipeline</strong> opens it in Pipelines.</p><p>Under <strong>Session overrides</strong>, try different values without changing the pipeline:</p><ul><li><strong>Temperature</strong>: from 0 to 2, in steps of 0.1.</li><li><strong>Passages (top K)</strong>: from 1 to 20.</li></ul><p>Overrides apply to this browser tab only and are never saved to the pipeline. The reset button beside <strong>Session overrides</strong> goes back to the pipeline's values.</p>$html$,
      '[]',
      50
    ),
    (
      'your-chats',
      'Chat',
      'Your chats',
      $html$<p>The list beside Chat holds your own Playground chats, grouped into Today, Yesterday, Previous 7 days, Previous 30 days and Older. A chat is named after its first question. Search them with <strong>Search chats</strong>, and choose <strong>New chat</strong> to start another.</p><p>Each chat's <strong>⋯</strong> menu has <strong>Rename</strong> and <strong>Delete</strong>. Delete asks you to confirm, then removes the chat and its messages from your history. Its request logs and usage stay.</p>$html$,
      '[]',
      60
    ),
    (
      'conversations',
      'Conversations',
      'Conversations',
      $html$<p><strong>Playground → Conversations</strong> lists every conversation in the project: Playground chats from everyone on the team, plus visitors' conversations with your widgets. Calls to the API aren't saved as conversations; they appear in Request Logs. Each row shows the title, pipeline, channel, number of messages, feedback (helpful, not helpful and unanswered counts), who started it and when it was last active.</p><p>Search by title, and filter by channel and by pipeline. Click a conversation to read its transcript with citations and the feedback it received. The transcript is read-only.</p>$html$,
      '[]',
      70
    ),
    (
      'reply-notices',
      'Troubleshooting',
      'An answer is cut off or missing',
      $html$<p>A note under an answer explains when it didn't finish:</p><ul><li><strong>Cut off at the pipeline's Max tokens limit</strong>, or no answer because the model used its whole output limit: raise <strong>Max tokens</strong> on the pipeline. <strong>Open pipeline</strong> takes you there.</li><li><strong>The reply stopped early because of an error</strong>: the model provider returned an error part-way. Try again with <strong>Ask again</strong>.</li><li><strong>Stopped before it finished</strong>: you stopped it.</li></ul><p>If nothing comes back at all, Grey puts your question back in the message box so you can send it again.</p>$html$,
      '[]',
      80
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"Workflow","label":"Pipelines & model providers","href":"/help/grey/pipelines"},{"icon":"ShieldCheck","label":"Evaluations & feedback","href":"/help/grey/quality"},{"icon":"Library","label":"Knowledge bases","href":"/help/grey/knowledge-bases"},{"icon":"Network","label":"Knowledge graph","href":"/help/grey/knowledge-graph"},{"icon":"Send","label":"API keys, MCP servers & widgets","href":"/help/grey/delivery"},{"icon":"Gauge","label":"Usage & request logs","href":"/help/grey/usage"}]',
      90
    )
) as v(anchor_id, eyebrow, title, content, links, sort_order)
cross join (select id from public.docs_pages where slug = 'grey/playground' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Playground',
    nav_label = null,
    description = 'Chat with a pipeline, inspect the context behind each answer, and revisit past conversations.',
    status = 'draft',
    published_at = null
where slug = 'grey/playground' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'grey/playground' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Chat</li><li>Run settings</li><li>Context and citations</li><li>Conversations</li></ul>',
  10
from public.docs_pages p
where p.slug = 'grey/playground' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
