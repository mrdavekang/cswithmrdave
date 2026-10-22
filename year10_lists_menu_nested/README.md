# Year 10 · Week 9 Session 3 · Lists and nested menus

Static HTML/JavaScript lesson for the existing GitHub Pages permalink. No build, Vercel, pupil account, live room, admission or teacher pacing controls.

## Student entry

Enter Name and Class, then Start lesson. Work opens immediately and saves on the device while school records sync in the background. Enter the same identity on the same browser to resume. A name is a label, not a verified login: another device starts a separate record and cannot retrieve another pupil's work by guessing their name. Backups contain no save key. Keep shared-device/browser data private.

The loading gate prevents the entry form sending names in URL query strings before JavaScript loads. Existing Teams links, including old `classId`/`room` query parameters, still open this same self-paced lesson; those parameters no longer select a live room.

Enter Teacher as the name (with a Year 10 class) to preview every page without recording pupil work. This is not authentication and grants no access to pupil records. The separate **Teacher records** page is `records.html`; sign in with the existing verified teacher account to review privately. No live controls remain on that page. Refresh records manually; do not project private pupil records.

## Sixty-minute learning route

| Stage | Minutes | Evidence |
| --- | ---: | --- |
| Starter | 5 | FOR stop values and WHILE exit behaviour |
| Types of Learning | 3 | K/S/U starting points and a chosen focus |
| Main Activity 1 | 20 | Run a model, select Wonder, replace it with Holes, traverse the updated list |
| Main Activity 2 | 20 | Rehearse, complete Display, complete Update, test persistence, explain WHILE/FOR |
| Extension | 5 | Choose one of ten challenges with requirements and exact expected input/output |
| Learning Pit Stop | 3 | Evidence-informed K/S/U phases and next action |
| Plenary and export | 4 | Transfer checks; export and submit in Teams |

One question/programming goal per page; 27 core pages and ten optional challenges. Answer or flag a page before continuing; correctness is not required to proceed. Scored MCQ positions shuffle once per notebook. Five described/enlargeable visuals, numbered examples, manual line pointers, adjustable code size, written hints and agreed-pause support remain. Optional independent/hint/model self-reports are separate from correctness. Help requests are saved for later review, not instant alerts: use Teams chat or an agreed classroom signal for help now.

The real Python Editor/Shell uses bundled Pyodide. Run/F5, direct `input()` in the Shell, REPL, Stop and `.py` download remain. No separate input queue. Use HTTPS or a localhost server; `file://` does not support this runtime correctly. The scoped Python isolation service worker may refresh once. This is IDLE-style, not desktop IDLE.

## Passive Supabase records

`supabase/03-learning-records.sql` is the current additive setup. It uses a separate `y10_lists_records_private` schema and existing verified Auth owner, without modifying the FOR/WHILE/classroom schemas or Auth settings. Earlier `01`/`02` SQL files and `cloud.js` are legacy references, not loaded or required by the current app. Do not rerun legacy setup to start a lesson.

`config.js` contains only the public project URL and browser-safe publishable key. The browser creates an unguessable 256-bit key for each local student profile. Keys stay in that browser's separate IndexedDB outbox; only hashes are held server-side. Public callers can register/save only their keyed session. All tables have RLS and no direct browser-role grants. Reading any pupil record, history or screenshot requires the fixed owner’s verified Supabase Auth account; typing Teacher never grants that access.

`records-cloud.js` stores a durable outbox and retries after connection failures. Drafts are grouped after short pauses (not recorded per keystroke); separate events retain submitted answers, corrections, program runs, Shell inputs, test checks, page visits, support, evidence, reflections and completion. History is append-only and retry IDs are deduplicated. Latest snapshots aid review; unusually large snapshots compact recent runs while individual run events preserve their evidence. Screenshots save separately, up to eight per notebook, and can be loaded individually in teacher review. Only server-acknowledged outbox events are cleared. If offline/blocked, the UI says pending/paused rather than claiming a school save. Unsynced work cannot upload after the browser is closed and must remain in that browser until it reconnects. Follow school data-retention policy.

No capture of other apps, tabs, clipboard history, credentials or unrelated device activity. Self-entered names are not attendance, verified identity or secure examination accounts. A labelled QA setup record is not a pupil assessment.

Teacher review shows latest per-page answers, source, runs, support and reflections, plus a paginated timeline and private JSON trace download. Old classroom records remain untouched and are not silently merged by name into new records. This change cannot reconstruct past edits that were never synced.

## PDF and curriculum

Export PDF remains available throughout, even unfinished. It includes actual source, inputs, outputs/errors, reflections and whole screenshots, with instructions to attach and Turn in separately in Teams. Notebook backups remain lesson/identity checked. Keep pupil PDFs/JSON outside this public repository.

OxfordAQA 9210: 3.2.2 programming concepts/nested iteration; 3.2.6 one-dimensional arrays/Python lists; 3.2.8 string indexing as retrieval. Class textbook printed pp. 48–49 (nested loops), 54–57 (lists and traversal), 28–29 (string recap); PDF pages are four higher. Original explanations are used; textbook pages are not redistributed.

Private QA outside the public folder includes content/output checks, passive-tracking checks, browser checks and rollback-only SQL tests for token isolation, anonymous read denial and owner-only review. Test actual sign-in with your approved teacher account before using private records in class.
