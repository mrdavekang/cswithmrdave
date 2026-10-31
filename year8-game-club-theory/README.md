# Year 8 · Game Club: lists, loops and random choices

A local, buildless GitHub Pages lesson for Week 10 Theory. No ChatGPT Site, server database credentials, build step or external Python CDN is used.

## Open / host

Open `index.html` for a direct-file preview, or serve this folder with any static HTTP server. The worker-based Python runner and storage are most reliable through HTTP/HTTPS. When this folder is separately committed and published by the teacher, its expected path is `/cswithmrdave/year8-game-club-theory/`. Saving this folder does **not** publish it.

Student entry requires a full name and 8T/8E. The app restores the same browser's existing work when the same details are entered. Names are self-entered; this is formative learning evidence, not verified identity or a secure examination platform.

Type `teacher` as the name, or open `?teacher=1`, for unrestricted preview with separate local storage and **no pupil tracking**. This is not permission to read private student records.

## 60-minute teaching spine

| Minutes | Activity | Teacher / student focus |
| --- | --- | --- |
| 0–7 | Starting drill | Fun word typing, Python punctuation, then type and run a complete list program and change one name. |
| 7–9 | Mission and target | Inspect the club purpose and final output. |
| 9–16 | Do Now | Four retrieval checks plus a guided len introduction: read, run the supplied example and explain with nearby word banks before the final-index question. |
| 16–18 | Types of Learning | One K, S or U check per card; identify a concrete practice target. |
| 18–30 | Main Task 1 | All original programming questions and guide, followed by four added practices. |
| 30–33 | Loop typing reset | Type and run a complete, safely stopping while program; change one name and run again. |
| 33–47 | Main Task 2 | All original trace, repair, loop and captain questions, plus four added programming practices. |
| 47–52 | Extension | All nine original challenges remain visible in the same sequence. |
| 52–55 | Learning Pit Stop | Review task evidence and self-report KSU confidence, learning phase, reason and next step. |
| 55–58 | Plenary | Three fresh transfer questions. |
| 58–60 | Report / Teams | Export progress, attach PDF and select Turn in. |
| After submission / at home | Review game | 15 unique questions; Blooket assignment or built-in repetition towards 50 correct answers. |

There are **33 substantive programming/interpretation practices** (the original 25 plus four in each main task), excluding the editor guide, starter, diagnostics and plenary. Main Task 1 has 12 questions plus its retained guide; Main Task 2 has 12 questions. The two warm-up exercises, two type-and-run activities and guided len introduction are additional and do not replace programming questions. There are 54 total activities including guides, reflections, export and the final review.

The sticky progress strip counts all 54 activities, not only the eight original core checks. Every stage shows its complete count; every activity in the current stage is directly visible with a number, title and honest status. Next always follows the full linear order, including former stretch tasks, the loop reset and extensions. There are no skip-stretch buttons. Back, direct navigation and code drafts are preserved. The clearly labelled lesson-ending Plenary shortcut allows a time-limited wrap-up without falsely completing unfinished work.

Completion of every challenge is not expected in 60 minutes. The clock is guidance, not a gate. Mistakes and help requests never lock navigation. Nothing assigns a learning phase from typing speed or a score. Existing student responses, original IDs and Supabase permissions are unchanged. The new activities use the existing field/attempt/action events and snapshot format; no database migration is needed.

## Type-and-run and review

The new len tutor precedes the original safe-index question. It runs a supplied model (not assessed as pupil-written code) and saves two guided sentence frames. Each blank has an adjacent word bank; ordinary synonyms and Mandarin/Korean equivalents are accepted. Checks give feedback beside each sentence and never block navigation. Original question IDs, responses and histories are retained; the new card adds one unfinished activity for existing pupils. A visible return link on the index question reopens the introduction. Existing field/attempt events and snapshots handle its evidence without new database permissions.

The append drill prints the original list before append and the updated list afterwards. Its visual comparison and two-line expected output distinguish the unchanged first two players from the new final element. Both the Orbit model and Comet variation require those two output lines; existing code drafts and attempt histories are retained.

Typing statistics use three colourful arcade meters with brief number transitions and milestone bursts. Effects are confined to the stats area: no sound, flashing, speed ranking or navigation gates. The Calm effects toggle is saved per drill, and the device's reduced-motion preference is respected. Text matching is not treated as programming success: code drills celebrate execution separately. Warm-up pace freezes when the full text matches; pasted text is not speed-scored.

`practice-content.js` adds the linear activities without replacing the original `lesson.js` questions. `drills.js` supplies character feedback, Backspace correction, four-space Tab indentation and actual Python execution. Warm-up speed is personal practice only; pasted text is not speed-scored. Code correctness is checked by execution/output, not exact spacing or quote style. Each type-and-run drill has two clearly described parts: run the complete model, then modify one name and run the changed version. The counter increment is included in the loop model; Stop and execution limits remain available.

`review-questions.js` contains the 15-question English/Mandarin/Korean bank and verified Blooket link: https://play.blooket.com/play?hwId=6ae434e780592497bc3178ba . Goal: 50 **correct** answers, not attempts. The current free account permits up to 14 days; the published deadline is 13 November 2026, 2:09 p.m. Malaysia time. The question set is https://dashboard.blooket.com/set/6ae433ef06e5602dbefe6b9a . The built-in review remains usable if Blooket is unavailable or the assignment expires. It shows distinct-question coverage separately from the accumulated correct count. Opening Blooket never marks an assignment complete in the app; Blooket records that outcome separately.

Typing drafts, type-and-run attempts/changes and built-in quiz responses are included in existing local saving, lesson tracing, backups and PDF reports. Teacher detail views distinguish typing from programming evidence. After doing further work, export a fresh report if it needs to be submitted too. No pupil records were used in QA or removed.

## Visuals and EAL

Ten large instructional visuals, including an authentic editor screenshot, plus five manually stepped loop frames. Each visual enlarges. English + Simplified Mandarin or English + Korean can be selected at entry or changed later. Core readings, questions, goals, diagnostic feedback, captions and reflection frames have bilingual support; code, names, Python messages and some detailed interface/checker wording remain in English. Translations are instructional support, not an externally certified translation service. Reading support does not set ability level. Guided and independent modes share the same goals and checks.

The code examples use different data from the student tasks. Expected outputs are explicit. A random captain is checked against the current list, not one fixed expected name. Every code task is run by real local Skulpt Python 3; the worker has time/output limits. Stop terminates the worker. The direct-file fallback has an interpreter time limit but cannot offer identical worker isolation. This educational interpreter is not full CPython; unsupported modules may fail.

## Private Supabase tracking

Configuration: `cloud-config.js` (only a **public publishable browser key**). The separate schema `y8_gameclub_private` contains `settings`, `sessions` and `events`. The additive migration is in `supabase/01-learning-records.sql`. It does not modify previous lesson schemas or teacher ownership.

Lesson ID: `y8-game-club-lists-v1`. Four public RPC functions register/save a pupil session and list/read teacher records. Private tables are not exposed; RLS is enabled and direct grants revoked. Pupil writes require their random browser-held 256-bit session secret; only its SHA-256 hash is stored remotely. Only the pre-existing approved teacher Auth UUID can read class history. `teacher` and URL flags never grant database access. No service-role key is present.

The app queues events in IndexedDB (`y8-gameclub-learning-records`) and stores lightweight/current work in localStorage (`gameclub-student-v1`, separate teacher key). It records answers, meaningful field revisions, code runs and changed-data tests, errors, hints, help flags, navigation, language choices, console input, reflection, export and self-confirmed Teams turn-in. Typing is grouped after short pauses, not monitored as unrelated keyboard activity. Only acknowledged queued events are removed. Saves retry automatically; the visible school-sync indicator distinguishes pending, offline, errors and acknowledged saves. Avoid using multiple devices/tabs for one session simultaneously. Names alone cannot retrieve somebody else's records.

### Teacher records

1. Open `?teacher=1` (or enter `teacher`).
2. Select **Teacher records** in the header.
3. Sign in with the **existing approved Supabase teacher email/password**.
4. Filter 8T/8E, select **View work**, inspect current answers/code and the learning timeline.
5. Select **Download full learning trace** for a private JSON export. Sign out on shared devices.

Teacher passwords are submitted only to Supabase Auth, not lesson event capture, backups or reports. Auth persistence is disabled for this dashboard. An unapproved signed-in account cannot list records. The dashboard refreshes on demand; student saves sync in short batches rather than a websocket live feed.

The database migration was activated on 27 October 2026 with the teacher's approval. Synthetic verification records, if present, are clearly labelled `QA - Game Club verification`, not real pupils. Never delete lesson records without an explicit retention/deletion decision from the teacher. Existing lessons and pupil records remain untouched.

## Reports and backups

Export PDF is available at any stage. It includes identity, WAGBA/KSU, completion status, answers, current drafts, run attempts, changed-data results, console input, support/reflection and meaningful input history. Unfinished core stages say **Not completed**; unattempted further challenges say **Not attempted**. The report is rendered locally page-by-page using installed device fonts so Chinese/Korean are retained. It is image-based rather than selectable PDF text. Long histories can create large reports; a print-to-PDF fallback is available. Keep downloaded pupil work private.

JSON backup/import includes lesson work/history but excludes the cloud write secret, teacher credentials and the existing cloud session ID. Import on another browser therefore makes a **new** school session rather than gaining access to an old record. Back up before clearing browser storage. Clearing local storage does not delete remote records. Import validates lesson/version and asks before replacing the current view. No camera or screenshot is required for this theory lesson.

Teams guidance is a manual instruction popup. The app cannot inspect Teams, confirm a successful OS download or verify an actual Turn in. The final checkbox is explicitly a student's own confirmation.

## References / licenses

- Python list methods and random.choice: https://docs.python.org/3/tutorial/datastructures.html and https://docs.python.org/3/library/random.html#random.choice
- Computing pedagogy: https://teachcomputing.org/pedagogy
- Progressive exercises inspiration: https://programming-25.mooc.fi/part-4/3-lists/
- Skulpt, jsPDF, html2canvas and Supabase browser SDK are local in `vendor/`; license notices are included.
- Raleway font and OFL notice are in `assets/fonts/`.
- Original mission artwork and instructional SVGs were prepared for this lesson. The annotated editor capture shows this local app; it is not a fictional interface mock-up.
# Live classroom, private dashboard and house points (31 October 2026)

The existing 54-activity lesson and its individual learning-record outbox remain intact. The additional live classroom uses separate lesson-only tables in `y8_gameclub_live`. No Route Rescue or other lesson records are changed.

## Teacher workflow

1. Open `teacher.html` (also linked from teacher preview). Sign in with the existing approved Supabase teacher account. Typing `teacher` on the lesson entry page is **preview only**, never database authentication.
2. Choose **8E** or **8T**, then **Open / resume live class**. Opening an already-active class resumes it rather than clearing the work. Students use the existing lesson link, enter their own name and class and register automatically—no join code.
3. Open **safe TTA projector** on the board. Never project the private dashboard. It retains the TTA-style Topic, WAGBA, Keywords, KSU and Challenge boxes, a visible current stage and lesson/response clocks. Enable gentle sounds once if wanted (browser autoplay rules require a click); mute and volume controls are supplied.
4. Start the lesson clock. Its 60-minute plan suggests stages but does not move students or automatically start a response window. Use the projected-stage selector when teaching at a different pace.
5. Around minutes **25–30**, invite checkpoint 1, **A late player joins** (print original list, append Orbit, print changed list and length). Around **41–46**, invite checkpoint 2, **Give every player a turn** (complete the while-loop counter). Aim for 3 min responding, 1 min discussion and 1 min improvement; extend or pause when needed.
6. Pupils click their invitation when ready. Start the response timer when the class is ready. After sending, they can return to precisely the same lesson card while classmates finish. The invitation stays available.
7. **Discuss** gives an eyes-to-board cue. **Reveal worked model** shares the teacher example. **Follow along** lets students edit an improvement copy while watching live teacher edits/output on their device. The first-response workspace and improvement workspace are separate; the append-only history retains earlier saved versions. This is formative evidence, not a secure independent test.
8. **Invite / reopen** returns to that checkpoint without clearing its saved answers. **Return everyone to independent work** releases the discussion but keeps the invitation/records available to reopen. **End class** stops the live session, retaining its records. A later class can be opened separately.

## Reading responses and recognising learning

- Student tiles stay in **joining order**, with a stable ID tie-breaker—not answer/heartbeat/score order. Polling updates their contents without rebuilding tiles, stealing button focus or reshuffling names. The sticky dashboard links jump to questions, demonstrations or responses/points.
- Each tile shows code, output/error, sent/draft state and an obvious **★ +1 house point** button. First responses remain visible while an improvement is still being written. Search hides non-matching tiles but does not reorder the others.
- **View history** shows first response, model-supported improvement and all live Run/Send/draft events. A custom point amount/reason and live-access/help controls are in the detail panel. Expanded unchanged history is not rebuilt on every poll.
- The **All lesson answers & progress** tab uses the existing private record functions. It includes all activities, code attempts, hints, support choices, KSU reflections and the input timeline. Page through sessions; view a pupil and refresh or download their complete private trace. Missing work is not evidence of misunderstanding. The eight original core checks are not a grade.
- House points are a **classroom ledger only**, not an iSAMS transaction. Undo reverses this ledger. Awards show a brief top-right star/confetti celebration on the pupil device, including above the live coding dialog. The safe projector shows anonymous **“A learner +1”** celebrations; it does not expose pupil names. Reduced-motion users receive a static celebration.

## Student behaviour and safety

- The connection notice disappears after five seconds; a compact live status remains in the toolbar. Invitations are a bottom dock and never replace the current lesson card.
- Both task prompts and expected outputs are prominent. Live prompts, numbered steps and key controls support Mandarin and Korean. Python syntax/names remain unchanged. The live editor is a real Python runner with Stop, Tab indentation and Ctrl/Command+Enter.
- Response countdowns use the server deadline. Below half the allotted time they turn red and nudge briefly; reduced-motion users get no shake. Paused timers do not accept submissions. Teachers can add time. A stale/lost connection releases the board-attention cue; local work remains available.
- Live drafts/runs are also included in the local JSON/PDF report and normal school-save snapshot. Typed edits are grouped after short pauses, not keylogged. Pending local drafts are retained on errors; use Send again in an open window. Use **one active live-response tab** per student. A conflicting write from a second tab is rejected rather than silently overwriting a newer server version.
- Names/classes are self-entered, **not verified school identities**. The teacher can pause unfamiliar live entries. This is not an attendance or high-stakes assessment system.

## Database and privacy

- Apply `supabase/01-learning-records.sql` first if setting up a new project, then `supabase/02-live-classroom.sql` as the database owner after access review. The second migration is additive/idempotent. It reuses the existing approved Game Club owner check and does not alter Auth, Realtime publications or exposed schemas.
- All six new private tables have RLS enabled and no direct grants to anonymous/authenticated web clients. Narrow security-definer functions validate each operation. Only the approved teacher can list/read class answers or award points. A random device capability permits pupils to read/write **their own** live work only; tokens never enter backups/reports.
- The safe projector uses an opaque capability URL and receives only lesson state, teacher examples and recent anonymous awards—never the roster or student answers/code. Keep that URL within the classroom.
- Teacher authentication is scoped to session storage for this lesson; sign out on shared devices. A pupil name/URL preview flag cannot grant teacher rights.
- Active classes expire after eight hours. Teacher heartbeat loss pauses live access; no stored pupil work is deleted. Live clients poll every few seconds rather than enabling a global Realtime feed.
- Private class JSON exports contain pupil work. Keep them outside this public repository, restrict access and follow school retention policy. Do not put service-role keys or passwords into browser files.

## Clear controls and dashboard layout

- **Teach live** and **Review saved work** switch dashboard areas; the fixed **GO TO** links only move within the dashboard. They do not move pupil devices.
- The lesson clock sits in its own column. It controls the 60-minute cue plan, not the answering deadline. The answering timer is labelled separately inside **Teach a checkpoint**.
- Invite checkpoint 1 or 2, then follow **Your next action**: start answering time → stop answering and discuss → show the worked answer → let pupils improve → return to lesson activities. Each button states its effect underneath. Reopening an invitation keeps saved work.
- Purple means the next classroom action, green means run code, blue links open views, gold awards points, and red ends the live session. Words, placement and explanations carry the meaning independently of colour. Ending the session is separated from returning pupils after a discussion.
- **★ Give +1** stays beside each pupil’s name; **Read answer & history** opens their detail. **Reverse this award** corrects the classroom ledger only, not iSAMS.
- Pupil live controls distinguish **Run my code** (test/output) from **Send answer to teacher** (submission). Visible Mandarin and Korean explanations support these actions. **Back to my lesson task** returns to the saved activity; it does not advance to a different question.
- There is one teacher-dashboard entry in lesson preview. **Download report · PDF** and **Save / restore work** name their purpose without opening an ambiguous tools menu. The lesson activities and permissions are unchanged.

## Verification

The lesson regression suite preserves the 54 activities. The live SQL migration was tested in an isolated in-memory PostgreSQL database for owner checks, anonymous isolation, token scoping, duplicate commands, retained/reopened responses, separate improvements, timer boundaries, award undo and denied direct table access. Real Python runs verify both supplied models and one-player/empty-roster loops. Browser QA uses dummy identities against that isolated database, never real pupils or the production class roster.
