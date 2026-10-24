-- Help notes live sessions page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the notes/live-sessions draft outline with
-- the full Live sessions guide and publishes it. Meetings, which share the Collaborate dialog, have their own page
-- (20261024191016). Left out: the session toolbar's More tools entries for Board, Document and Draw (dropping them
-- does nothing in a session) and the Collaborate dialog's Members-tab remove button (the Session Members list is the
-- documented route).
-- Written from a survey of C:\Pro\geiger-notes (app/colab/[id]/page.js, components/internal/layout/{CollaborateDilouge,
-- UserDrawer,NotificationDropdown,Topbar}.jsx, components/internal/colab/{HostTab,JoinTab,MembersTab,MergeTab}.jsx,
-- components/internal/colab/live/*, lib/collab/** (session.js, utils.js, hooks/*), lib/realtime/*, app/api/collab/*,
-- utils/supabase/middleware.js, lib/playground/api_routes.js).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Live sessions',
    description = 'Work on a copy of a board with other people in real time: start a session, let people join by code, run it as host, and merge the result into your board.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'notes/live-sessions' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'notes/live-sessions' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'starting-a-session',
      'Basics',
      'Starting a live session',
      $html$<p>A live session puts a copy of a board online so other people can work on it with you at the same time. To start one, open the board, choose the people icon (<strong>Collaborate</strong>) in the top bar, then choose <strong>Start Session</strong> on the <strong>Host</strong> tab. Notes copies the board's nodes and connections into the session and opens it, with you as its host.</p><p>The session is a separate copy. Nothing done in it changes your board until you merge it back with <strong>Merge</strong>, described in <a href="#merging-a-session">Merging a session into your board</a>.</p><p>Every session has a code, like <code>GEIGER-7KQ2-M9TX</code>. While you're in the session, the <strong>Collaborate</strong> dialog shows it on the <strong>Session</strong> tab, with a Live badge. Click the code to copy it, then send it to the people you want to invite. Anyone signed in to Geiger who has the code can ask to join.</p><p>You need to be signed in to start a session. The playground can't start one.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'joining-a-session',
      'Basics',
      'Joining a session',
      $html$<p>To join a session, choose <strong>Collaborate</strong> in the top bar of any board, open the <strong>Join</strong> tab, type the code you were given, then choose <strong>Join Session</strong>. Letter case doesn't matter.</p><p>Notes opens the session and sends the host a request, so you start as Waiting and can look but not edit. Once a host or co-host admits you, you're in as an editor or a viewer, and Notes tells you which. If the code is wrong, Notes says Session not found. A session that has ended says This session has ended, and a locked one says The host has locked this session.</p><p>While you're in a session, the <strong>Join</strong> tab asks you to leave it before joining another.</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'session-roles',
      'Concepts',
      'Session roles',
      $html$<p>Everyone in a live session has one role. The <strong>Session Members</strong> list shows it beside each name.</p><ul><li><strong>Host</strong>: the person running the session, at first whoever started it. The host has every host control, can make co-hosts, can hand the host role to someone else, and is the only one who can end the session.</li><li><strong>Co-host</strong>: has the host controls and manages editors, viewers and requests. A co-host can't end the session or change another co-host.</li><li><strong>Editor</strong>: changes the board, unless a host has turned off editing for participants.</li><li><strong>Viewer</strong>: sees the board and everyone's activity but can't change it. A viewer can choose <strong>Ask to edit</strong> in <strong>Session Members</strong>.</li><li><strong>Waiting</strong>: has asked to join and hasn't been admitted yet.</li></ul><p>If the host hands the role to someone else, the person who started the session stays its owner and can take it back with <strong>Reclaim host</strong> in <strong>Session Members</strong>.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'managing-people',
      'Members',
      'Admitting and managing people',
      $html$<p>When someone asks to join, the host gets a notification, New request from and their name, and the bell icon in the top bar shows a dot. The host's bell lists each Access Request with <strong>Accept</strong>, which admits the person as an editor, and <strong>Decline</strong>. Hosts and co-hosts also see requests on the <strong>Members</strong> tab of the <strong>Collaborate</strong> dialog, with a check mark to accept and a trash icon to decline.</p><p>To change someone's role, open <strong>Session Members</strong> with the stack of avatars at the bottom right of the session, then use the <strong>⋯</strong> menu beside their name. The same menu opens when you click someone's avatar in the top bar.</p><ul><li><strong>Admit as editor</strong> or <strong>Admit as viewer</strong> for a request</li><li><strong>Let them edit</strong> or <strong>Make view-only</strong></li><li><strong>Make co-host</strong> or <strong>Revoke co-host</strong> (host only)</li><li><strong>Make host</strong> (host only), which asks you to confirm and makes you an editor</li><li><strong>Remove from session</strong>, or <strong>Decline request</strong> for someone waiting</li></ul><p><strong>Session Members</strong> also shows how many people are online, marks people who are offline, and shows a hand beside anyone who has raised theirs. A removed person sees You were removed from this session, with <strong>Ask to rejoin</strong> unless the session is locked.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'host-controls',
      'Host controls',
      'Host controls',
      $html$<p>Hosts and co-hosts run a session from <strong>Host controls</strong>, a button in the top bar labeled <strong>Host</strong> on wide screens. It shows a count when hands are raised.</p><ul><li><strong>Bring everyone</strong>: moves everyone's view to yours. Each person gets four seconds to choose <strong>Not now</strong>, and can look around again by panning.</li><li><strong>Spotlight node</strong>: select a node first, then fly everyone to it.</li><li><strong>Lock everyone's view to mine</strong>: participants follow your view and can't look around until you turn it off or leave.</li><li><strong>Announce to everyone</strong>: type a message of up to 280 characters and press <code>Enter</code>. It shows on everyone's screen.</li><li><strong>Raised hands</strong>: everyone with a raised hand, in the order they raised it. <strong>Lower</strong> lowers one, and <strong>Lower all</strong> lowers every hand.</li></ul><p>Under <strong>Participants can</strong>, five switches set what editors and viewers can do, and all start on: <strong>Edit the board</strong>, <strong>Ask to join</strong>, <strong>Use the laser pointer</strong>, <strong>Run polls and timers</strong> and <strong>See each other's cursors</strong>. Turning off <strong>Ask to join</strong> locks the session, so only people already in it can come back. Hosts and co-hosts aren't limited by these switches.</p><p><strong>Pause all</strong> turns all five off at once, and <strong>Resume all</strong> turns them back on. The host also has <strong>End for all</strong>, covered in <a href="#leaving-and-ending">Leaving or ending a session</a>.</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'presence-and-following',
      'Presence',
      'Cursors, following and reactions',
      $html$<p>In a live session, you see everyone's cursor with their name, in their own color. A node someone has selected shows their name and color on its border. The top bar shows the avatars of the people online, up to four and then a count.</p><ul><li><strong>Following</strong>: click someone's avatar and choose <strong>Follow their view</strong>, and your view moves with theirs. A bar at the top of the board says who you're following, with <strong>Stop</strong>. Panning or zooming also stops it, and so does that person leaving. You can't follow someone who's already following you.</li><li><strong>Laser pointer</strong>: the wand icon in the top bar draws a fading trail wherever you move the pointer, for everyone to see. <code>Esc</code> turns it off.</li><li><strong>Raise hand</strong>: the hand icon raises your hand so the hosts can see it. Choose it again to lower it. Hosts and co-hosts don't have it.</li><li><strong>React</strong>: the smiley icon sends 👍, 👏, 🎉, ❤️, 😂 or 🤔, which floats up on everyone's screen.</li></ul><p>When people follow you, the bar says so, and hosts can choose <strong>Stop leading</strong> to release them.</p>$html$,
      '[]',
      null,
      60
    ),
    (
      'editing-together',
      'Concepts',
      'Editing together',
      $html$<p>Everyone who can edit a live session works on the same board, and each change reaches the others as it's saved. A node you drag saves when you drop it. Other changes to a node save once nothing is selected, so click an empty part of the board when you finish an edit.</p><p>The session's toolbar has a fixed set of tools, whatever your own toolbar shows, and boards, documents and sketches can't be added in a session. Changes you make in the <strong>Settings</strong> dialog during a session aren't saved.</p><p>A host or co-host can pin a node in place for everyone: in the node's Node Settings panel, the padlock reads <strong>Lock for everyone</strong>. Other people then see <strong>Locked by the host</strong> and can't move, delete or unlock it. <a href="/help/notes/nodes#arranging-and-locking">Nodes</a> covers locking.</p><p>When a host turns off editing, editors see The host paused editing, and Notes refuses their changes. If a change can't be saved, Notes says why, or Failed to save changes.</p>$html$,
      '[]',
      null,
      70
    ),
    (
      'leaving-and-ending',
      'Sessions',
      'Leaving or ending a session',
      $html$<p>To leave a session, choose <strong>Leave Session</strong> on the <strong>Session</strong> tab of the <strong>Collaborate</strong> dialog. Notes takes you to your personal board. To come back, join again with the code. The host has no <strong>Leave Session</strong>: to leave a session running, first make someone else the host.</p><p>Only the host can end a session, and ending it affects everyone: they're sent out, the code stops working and the board can't be changed. There are two ways:</p><ul><li>On the <strong>Session</strong> tab, choose <strong>End Session</strong>, then choose it again within four seconds, when it reads Click again to end for everyone.</li><li>In <strong>Host controls</strong>, choose <strong>End for all</strong>, then <strong>End session</strong> to confirm.</li></ul><p>An ended session shows its ended screen to everyone in it, with <strong>Go home</strong>. The host's screen also has <strong>Reopen</strong>, which opens the session again with the same code. To keep the work, merge the ended session into your board.</p>$html$,
      '[]',
      null,
      80
    ),
    (
      'merging-a-session',
      'Merge',
      'Merging a session into your board',
      $html$<p>Merging brings the work from a session you hosted into the board that's open. Open the board you started the session from, choose <strong>Collaborate</strong>, then the <strong>Merge</strong> tab. It lists every session you've hosted, by code and date, marked Merged or Not Merged. The tab is there only while you're not in a session.</p><ol><li>Choose a session. Notes counts its <strong>New Nodes</strong> and the nodes it <strong>Modified</strong>.</li><li>Choose <strong>Merge Changes</strong>.</li></ol><p>The merge adds the session's new nodes and connections to your board. Where a node is on both, the session's version replaces yours, even if you changed it on your board since. Nodes and connections that are only on your board stay, so a node deleted in the session stays on your board too.</p><p>To undo a merge, choose the same session on the <strong>Merge</strong> tab, which now shows when it was merged, and choose <strong>Rollback</strong>. Notes puts the board back exactly as it was before the merge. <strong>Back</strong> returns to the list.</p>$html$,
      '[]',
      null,
      90
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"LayoutDashboard","label":"Boards","href":"/help/notes/boards"},{"icon":"Video","label":"Meetings & huddles","href":"/help/notes/meetings"},{"icon":"Ellipsis","label":"More tools","href":"/help/notes/more-tools"}]',
      null,
      100
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'notes/live-sessions' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Live sessions',
    description = 'Start a live session on a board, let people join by code, manage their roles, and merge the session back into your board.',
    status = 'draft',
    published_at = null
where slug = 'notes/live-sessions' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'notes/live-sessions' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Starting a session</li><li>Joining by code</li><li>Members and roles</li><li>Host controls</li><li>Following and presence</li><li>Ending a session</li><li>Merging a session into your board</li></ul>',
  10
from public.docs_pages p
where p.slug = 'notes/live-sessions' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
