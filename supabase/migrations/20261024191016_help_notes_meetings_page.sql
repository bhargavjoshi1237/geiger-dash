-- Help notes meetings page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the notes/meetings draft outline with the
-- full Meetings & huddles guide and publishes it. Live sessions, which share the Collaborate dialog, have their own
-- page (20261024191015).
-- Written from a survey of C:\Pro\geiger-notes (components/internal/colab/MeetTab.jsx, components/internal/meet/*,
-- lib/meet/* (access, ice, useMediaTracks, useMeetRoom, usePeerMesh), app/api/meet/{create,lookup}/route.js,
-- components/internal/nodes/huddle/HuddleNode.jsx, components/internal/layout/{Topbar,CollaborateDilouge}.jsx,
-- lib/playground/api_routes.js, supabase/migrations/20260812061930_meet_rooms.sql).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Meetings & huddles',
    description = 'Start or join a video meeting from any board, share your screen, run the call as host, and add a huddle node that opens a meeting from the board.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'notes/meetings' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'notes/meetings' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'starting-a-meeting',
      'Basics',
      'Starting a meeting',
      $html$<p>A meeting is a video call with audio and screen sharing, started from any board. To start one, choose the people icon (<strong>Collaborate</strong>) in the top bar, open the <strong>Meeting</strong> tab, then choose <strong>Start Meeting</strong>. You're the meeting's host.</p><p>Your browser asks to use your camera and microphone, and both start on. The meeting fills the space under the top bar, over the board, until you leave it. The top bar shows LIVE, how long the call has run, how many people are in it, and, on a wide screen, the meeting's code, like <code>MEET-4HXQ-T7PA</code>. Click the code to copy it, then send it to the people you want to invite. While you're alone in the meeting, the code also shows in the middle of the screen.</p><p>A meeting doesn't need a live session. If you start one during a live session, <strong>Use the collab session</strong> is selected: everyone in the session who chooses <strong>Start Meeting</strong> joins the same call without a code. Clear it to start a separate meeting.</p><p>You need to be signed in to start or join a meeting. The playground can't start one.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'joining-a-meeting',
      'Basics',
      'Joining a meeting',
      $html$<p>To join a meeting, choose <strong>Collaborate</strong> in the top bar of any board, open the <strong>Meeting</strong> tab, choose <strong>Join</strong>, type the code, then choose <strong>Join Meeting</strong> or press <code>Enter</code>. Letter case doesn't matter. You go straight in: there's no waiting for the host.</p><p>If Notes can't let you in, it says why:</p><ul><li><strong>Meeting not found</strong>: the code is wrong, or the meeting has ended.</li><li><strong>The host has locked this meeting</strong>: nobody new can join until the host unlocks it.</li><li><strong>The host removed you from this meeting</strong>: you can't rejoin it with the code.</li></ul>$html$,
      '[]',
      null,
      20
    ),
    (
      'in-a-meeting',
      'Meetings',
      'In a meeting',
      $html$<p>Everyone in a meeting appears as a tile with their video, or their picture or initial when the camera is off, and a crossed-out microphone when they're muted. Your own tile is labeled You. When someone shares their screen, the share fills the stage and everyone's tiles line up under it. The host can do the same for one person with a spotlight.</p><p>The buttons along the bottom are, in order:</p><ul><li><strong>Mute</strong> or <strong>Unmute</strong> your microphone</li><li><strong>Stop video</strong> or <strong>Start video</strong></li><li><strong>Share screen</strong> or <strong>Stop sharing</strong>: your browser asks which screen or window to share</li><li><strong>Raise hand</strong> or <strong>Lower hand</strong>, which puts a hand on your tile and in the host's list</li><li><strong>React</strong>: 👍, 👏, 🎉, ❤️, 😂 or 😮, shown on your tile for everyone</li><li><strong>Leave</strong>, which takes you out of the call and back to the board</li></ul><p>Leaving doesn't end the meeting for anyone else. The host can turn off unmuting, video or screen sharing for participants, and then Notes tells you when you try.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'host-tools',
      'Host tools',
      'Hosting a meeting',
      $html$<p>The person who starts a meeting is its host, and stays host after leaving and rejoining. The host has <strong>Host tools</strong>, the button after <strong>React</strong> in the bottom bar, which shows a count when hands are raised, or a lock while the meeting is locked.</p><ul><li><strong>Mute all</strong> and <strong>Lower all hands</strong>.</li><li><strong>Participants can</strong>: switches for <strong>Unmute themselves</strong>, <strong>Start their video</strong> and <strong>Share their screen</strong>, all on to start with.</li><li><strong>Lock the meeting</strong>: nobody new can join with the code while it's locked.</li><li><strong>Raised hands</strong>: everyone with a raised hand, in order, each with <strong>Lower</strong>.</li></ul><p>Each person's tile also has a <strong>⋯</strong> menu for the host. <strong>Mute</strong>, <strong>Stop video</strong> and <strong>Stop their share</strong> act straight away. <strong>Ask to unmute</strong> and <strong>Ask to start video</strong> send a request the person accepts with <strong>Unmute</strong> or <strong>Start video</strong>. The menu also has <strong>Lower hand</strong>, <strong>Spotlight for everyone</strong> (or <strong>Remove spotlight</strong>), <strong>Make host</strong> and <strong>Remove from meeting</strong>.</p><p><strong>End for all</strong>, beside <strong>Leave</strong>, closes the meeting for everyone at once, without asking first. The code stops working, and everyone else sees The host ended the meeting.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'huddle-nodes',
      'Huddles',
      'Huddle nodes',
      $html$<p>A huddle node puts a meeting on the board, so people can meet around one part of it. Drag <strong>Huddle</strong> from <strong>More tools</strong> in the toolbar onto the board. Select the node to type its title and what the huddle is about. Without a topic, it reads "Drop in to talk it through."</p><p>Choose <strong>Start huddle</strong> to start a meeting from the node. The node keeps the meeting's code, shown after Room, and its button changes to <strong>Join huddle</strong>, so anyone who can see the board joins the same call from it. While you're in that call, the node shows Live and its button reads You're in this huddle.</p><p>If the huddle's meeting has ended, <strong>Join huddle</strong> starts a new one, and the node keeps the new code. A locked meeting, or one you were removed from, shows the same messages as joining by code. You need to be signed in to start or join a huddle, and huddles aren't available in the playground.</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'camera-or-microphone-not-working',
      'Troubleshooting',
      'Camera or microphone doesn''t work',
      $html$<p>When Notes can't use your camera or microphone, the meeting shows why along its top, and you can still hear and see everyone else.</p><ul><li><strong>Camera and microphone are blocked for this site</strong>: your browser refused access. Allow the camera and microphone in the browser's site settings, then leave and rejoin the meeting.</li><li><strong>No camera or microphone available</strong>, <strong>Camera is unavailable</strong> or <strong>Microphone is unavailable</strong>: the device is missing or in use by another app. Connect it or close the other app, then turn it on again from the bottom bar.</li><li><strong>Screen sharing isn't available in this browser</strong>: use a desktop browser that supports sharing.</li></ul><p>Meetings connect people's browsers directly to each other. If a tile says Couldn't connect to and a name, the network between you blocked the call, which a strict company firewall can do. The top bar shows connecting while your own connection is being set up.</p>$html$,
      '[]',
      null,
      60
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"Users","label":"Live sessions","href":"/help/notes/live-sessions"},{"icon":"Ellipsis","label":"More tools","href":"/help/notes/more-tools"},{"icon":"LayoutDashboard","label":"Boards","href":"/help/notes/boards"}]',
      null,
      70
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'notes/meetings' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Meetings & huddles',
    description = 'Start or join a video meeting from any board, and add a huddle node to meet around part of the board.',
    status = 'draft',
    published_at = null
where slug = 'notes/meetings' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'notes/meetings' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Starting a meeting</li><li>Joining by code</li><li>The meeting stage</li><li>Host tools</li><li>Huddle nodes</li></ul>',
  10
from public.docs_pages p
where p.slug = 'notes/meetings' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
