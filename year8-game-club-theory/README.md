# Year 8 · Game Club: lists, loops and random choices

A local, buildless GitHub Pages lesson for Week 10 Theory. No ChatGPT Site, server database credentials, build step or external Python CDN is used.

## Open / host

Open `index.html` for a direct-file preview, or serve this folder with any static HTTP server. The worker-based Python runner and storage are most reliable through HTTP/HTTPS. When this folder is separately committed and published by the teacher, its expected path is `/cswithmrdave/year8-game-club-theory/`. Saving this folder does **not** publish it.

Student entry requires a full name and 8T/8E. The app restores the same browser's existing work when the same details are entered. Names are self-entered; this is formative learning evidence, not verified identity or a secure examination platform.

Type `teacher` as the name, or open `?teacher=1`, for unrestricted preview with separate local storage and **no pupil tracking**. This is not permission to read private student records.

## 60-minute teaching spine

| Minutes | Activity | Teacher / student focus |
| --- | --- | --- |
| 0–3 | Mission and target | Read the purpose, inspect final output; captain can vary. |
| 3–8 | Do Now | Four retrieval checks: index, one value, replacement and boundary. |
| 8–11 | Types of Learning | One K, S or U check per card; identify a concrete practice target. |
| 11–25 | Main Task 1 | Four core tasks: append, compare, repair and update a roster. Four further challenges for early finishers. |
| 25–43 | Main Task 2 | Four core tasks: trace, repair the boundary, write a loop, choose a captain. Four further challenges. |
| 43–52 | Extension | Nine challenges across three levels; selection and removal taught before required. |
| 52–55 | Learning Pit Stop | Review task evidence and self-report KSU confidence, learning phase, reason and next step. |
| 55–58 | Plenary | Three fresh transfer questions. |
| 58–60 | Report / Teams | Export progress, attach PDF and select Turn in. |

There are **25 substantive practice tasks** (8 essential, 17 further challenges), excluding starter, diagnostics and plenary. Completion of every challenge is not expected. The clock is guidance, not an enforced time gate. Students can flag help and continue, use Back, or revisit stages. Nothing auto-assigns a learning phase from a score.

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
