# Geiger launch films

Two films are composed in code and share one engine:
- **Suite film** (`?film=suite`, the default): 93 s in 4K, dark, covering the whole suite.
- **Events film** (`?film=events`): 63 s in 1080p, light, covering Geiger Events alone. It also has a 15 s cut, `?film=events-15`.

The Events film is documented [at the end](#geiger-events-film).

## Suite film

A 93-second launch film for the whole suite, composed in code. It follows one request, "Can we get 40 seats together for Fight Night 12?", through Comms, Forms, Flow, Notes, Grey, Events, Content, Assets and Pods. It ends on the suite's colours and a call to action.

### Where things live

| Part | Location |
|---|---|
| The edit: tempo grid, shot list, chapters | `components/film/timeline.js` |
| Shots, one file per act | `components/film/shots/*.jsx` |
| Camera (3D moves, depth of field), type, cursor, typing | `components/film/camera.jsx`, `components/film/kinetic.jsx` |
| Frame clock: per-frame callbacks, seeks CSS animations | `components/film/clock.js` |
| Player and preview | `components/film/film_player.jsx`, served at `/film` in development only |
| Renderer: Chrome to ffmpeg, parallel workers | `scripts/film/render.mjs` |
| Soundtrack: music, synthesised effects, loudness | `scripts/film/audio.mjs` |
| Music | `scripts/film/music/track.mp3` |

The shots reuse the area-page renders in `components/product-pages/`, so the film shows the same UI as the site. Every value on screen is a function of time, so each frame renders identically every time.

### Preview

Run `npm run dev` and open http://localhost:3000/film.
- **Playback:** Space plays with music, and the chapter buttons jump to an act.
- **Stepping:** ← and → step one frame; add Shift to step one second.
- **One shot:** `/film?solo=<shot id>` shows a single shot.
- **Thumbnail:** `/film?solo=thumbnail` shows the thumbnail.

### Render

All renders need the dev server running, plus Chrome and ffmpeg on the machine.

```bash
node scripts/film/render.mjs                  # out/film/geiger-suite-film.mp4: 3840×2160, 30 fps, about 6 min
node scripts/film/render.mjs --scale 1        # 1080p draft, about 2 min
node scripts/film/render.mjs --from 14 --to 30 --scale 1   # one stretch only
node scripts/film/render.mjs --preview 10,26.2,80          # PNG stills
node scripts/film/render.mjs --thumbnail      # out/film/geiger-suite-film-thumbnail.jpg (1280×720)
```

Frames stream straight from Chrome into ffmpeg, so no image sequence is written to disk.

**Video:** H.264 High, 4:2:0, BT.709, with a closed GOP of 15 frames.

**Audio:** AAC at 384 kbps and 48 kHz, mixed to −14 LUFS with peaks under −1 dBTP. This matches YouTube's recommended upload settings.

### Music

"Ramp It Up" by Ahjay Stelino, from Mixkit (https://mixkit.co/free-stock-music/tag/technology/). It is used under the Mixkit Stock Music Free License (https://mixkit.co/license/#musicFree).
- **Allowed:** commercial use on websites and social platforms, including YouTube, with no attribution required.
- **Not allowed:** TV and radio broadcast, or registering the track with a rights management service such as Content ID.
- **If YouTube raises a claim:** forward it to team@mixkit.co.

The tracks are not in git: the repo is public, and the license does not allow redistributing them as standalone files. Download "Ramp It Up" and "Your Breath" from Mixkit, then save them as `scripts/film/music/track.mp3` and `scripts/film/music/your-breath.mp3` (that folder is gitignored). Renders land in `out/film/`, which is also gitignored. Move finished films off the repo drive.

The edit is cut to the track's grid: 120 BPM, with the kick on 16.12 s. The track starts at 6.12 s, which puts these sections on film bars:

| Section | Film time (bar) |
|---|---|
| Drop | 10 s (bar 5) |
| Lift | 26 s (bar 13) |
| Breakdown | 42–58 s (bars 21–29) |
| Peak | 74 s (bar 37) |
| Final hit | 90 s (bar 45) |

To use another track, change `MUSIC` in `timeline.js` and re-check the bar placements in `EDIT`.

### YouTube upload kit

**File:** `out/film/geiger-suite-film.mp4`. Upload it as-is.

**Thumbnail:** `out/film/geiger-suite-film-thumbnail.jpg`

**Title:** Geiger Studios — One suite for all of it

**Description:**

```
Geiger Studios is one suite for the whole job: a shared inbox, forms, issues and roadmaps, live whiteboards, an AI knowledge base, event ticketing, content, media approvals and API gateways, all on one account.

In 90 seconds, follow one request from the first message to a sold-out night:
• Comms: answer every customer from one shared inbox
• Forms: collect the details, one question at a time
• Flow: plan the work in issues, cycles and roadmaps
• Notes: think it through together on a live board
• Grey: answers grounded in your own documents, with citations
• Events: event pages, tickets, checkout and QR check-in
• Content, Assets and Pods: publish, approve and deploy

Try Geiger free for 15 days, no card needed: https://geiger.studio

0:00 Intro
0:14 Intake: every request has somewhere to land
0:30 Plan: from first sketch to launch
0:42 AI: put your team's knowledge to work
0:58 Launch: ship it to the people it's for
1:14 One account, every app

Names, events and figures in the film are illustrative.
Music: "Ramp It Up" by Ahjay Stelino (Mixkit).
```

**Tags:** Geiger Studios, business software, software suite, shared inbox, help desk, form builder, project management, issue tracking, whiteboard, AI knowledge base, event ticketing, QR check-in, headless CMS, digital asset management, API gateway

**Category:** Science & Technology

**End screen:** add it from 1:26 to 1:33. The end card leaves the right half of the frame clear for two elements, such as a video or playlist and Subscribe.

**Captions:** the film has no speech, so it needs none. The on-screen type carries the story with the sound off.

## Geiger Events film

A 63-second film for Geiger Events alone. It follows one fictional night, "Fight Night 12: Reyes vs Moreau", from a blank page to a full house. The film is light: a paper-white stage with the app in its light theme and the buyer's checkout in the event's imported dark brand. Rose, the Events colour, is the accent.

| Part | Location |
|---|---|
| The edit, the 15 s cut and the music splice | `components/film/events/timeline.js` |
| Shots by act: create, sell, door, finale | `components/film/events/shots/*.jsx` |
| The cast, the imported brand, app and phone frames | `components/film/events/events_kit.jsx` |
| Public page layouts, checkout, arena seat map, ticket pass | `components/film/events/page_layouts.jsx`, `checkout_kit.jsx`, `arena.js`, `pass.jsx` |
| Which films exist and their themes | `components/film/films.js` |

Every screen is redrawn from the real Events app (geiger-events), and the film shows only what ships:
- Event details, page layouts, brand import from a URL, and the bowl generator in the seat map editor.
- Seat picking with holds, the early-bird credit and a discount code, Stripe checkout, the ticket email, the Overview, the mobile pass, the staff scanner and Real-time Attendance.

It leaves out what isn't real yet: dynamic pricing, wallet passes, the Analytics dashboards, campaign sending and the Event Design area.

The ticket email in the film has no QR code. Real sends currently drop the QR block because `lib/stripe/fulfill-checkout.js` in geiger-events sends `qrCodeUrl` while the template reads `qrUrl`, so the QR is shown on the phone pass instead.

### Preview and render

```bash
# Preview with music (needs npm run dev)
http://localhost:3000/film?film=events
http://localhost:3000/film?film=events-15

# Render
node scripts/film/render.mjs --film events                 # out/film/geiger-events-film.mp4, 1920×1080, 30 fps
node scripts/film/render.mjs --film events-15              # out/film/geiger-events-film-15s.mp4
node scripts/film/render.mjs --film events --thumbnail     # out/film/geiger-events-film-thumbnail.jpg
node scripts/film/render.mjs --film events --preview 6.5,21.5,55   # PNG stills
```

### Music

"Your Breath" by Eugenio Mininni, from Mixkit, used under the same Mixkit Stock Music Free License as the suite film's track.
- **Tempo:** 119.72 BPM. Measured kick onsets put track bar n at 2.888 s + n × 2.0047 s.
- **The 63 s film** plays track bars 3–23, then 31 onwards. The splice is a 30 ms crossfade on a downbeat, and it skips eight bars of repeated peak. This lands the sections on the edit:

| Section | Film time | Shot |
|---|---|---|
| Drop | 6.0 s | The layouts start switching |
| Lift | 20.0 s | The buyer opens the seat map |
| Peak | 36.1 s | The Overview sells out |
| Breakdown | 56.1 s | The end card |

- **The 15 s cut** plays track bars 19–27, so the peak lands on its third bar, when the night sells out.

### YouTube upload kit

**File:** `out/film/geiger-events-film.mp4`. The 15 s cut, `geiger-events-film-15s.mp4`, is for ads and social.

**Thumbnail:** `out/film/geiger-events-film-thumbnail.jpg`

**Title:** Geiger Events — Sell the tickets and run the door

**Description:**

```
Geiger Events takes a night from a blank page to a full house: design the event page, build your venue's seat map, sell every seat, and scan guests in from any phone.

In 60 seconds:
• Event pages: 19 layouts, or import your logo, colours and fonts from your website
• Venues: generate a seated bowl, then edit every section, row and seat
• Seated checkout: buyers pick seats on your map and they're held while they pay; early-bird prices and discount codes apply at checkout; payments by Stripe
• Tickets by email, with a QR pass for the door
• Live sales on the Overview
• The door: a staff QR scanner on any phone, with real-time attendance

Try Geiger free for 15 days, no card needed: https://geiger.studio

0:00 Create the page
0:20 Sell every seat
0:42 Run the door

Names, events and figures in the film are illustrative.
Music: "Your Breath" by Eugenio Mininni (Mixkit).
```

**Tags:** Geiger Events, event ticketing, ticketing software, seated ticketing, seat map, event registration, event page builder, QR check-in, ticket scanner, box office, venue management, Stripe checkout

**Category:** Science & Technology

**End screen:** add it from 0:57 to 1:03. The end card leaves the right half of the frame clear.
