# Year 10 · List values, totals and counts

Week 9 Sessions 2 and 3 merged: revised 60-minute lesson. Static HTML/JS for the existing cswithmrdave GitHub Pages workflow. No build, pupil accounts, live admission, pacing controls or ChatGPT Sites.

## Route

| Stage | Minutes | Evidence |
| --- | ---: | --- |
| Starter | 6 | A fresh index prediction, written indexed assignment and current-value prediction |
| Types of Learning | 3 | K/S/U starting points and one evidence-informed focus |
| Main Activity 1 | 15 | Actual indexed update, genuine FOR traversal and one prior menu-control-flow check |
| Main Activity 2 | 23 | Running-total trace, calculation of 17, second-list test of 12, short explanation; then choose counting or consolidation |
| Extension / supported completion | 5 | Choose one of ten tasks; supported repair through independent combined processing |
| Learning Pit Stop | 4 | K/S/U phases with actual evidence and one next action |
| Plenary | 4 | Fresh-list value and total; explain either counting or initialisation according to the route studied |

29 core pages and ten optional extension pages. The consolidation route omits two next-step counting pages without marking them correct. Every reading/model page has a question or programming goal; no essential model is hidden in a dropdown. Questions are one per page. Correctness is not required to continue: attempt or flag for help. Finish early or when called using Go to plenary at the bottom; earlier work remains unfinished rather than being credited.

Keep the familiar `for amount in donations` pattern. No new `range(len(...))`, minima or maxima. Six diagrams have visible text descriptions and enlarge without cropping. Each example starts from its own displayed list, not the altered state on the preceding page. Written guides use manual line pointers, predictable controls and adjustable source-code size. Quiet support requests are saved for later review, not instant alerts: use the agreed classroom signal or Teams chat for immediate help.

## Entry and teacher preview

Students enter Name and Year 10 Class. Same identity on the same browser resumes that local notebook. Names are labels, not verified identities; another device starts a separate private record rather than retrieving work by guessing a name.

Teacher preview needs no login: use the landing button, name Teacher, or `?preview=1`. `?preview=1&page=m2-total` opens a specific page. Preview uses separate local work and never creates pupil records. It permits all page navigation but grants no private data access.

Private records are at `records.html`, protected by the existing approved teacher Supabase Auth account. Refresh to see newly synced work. Do not project this page. It is read-only and contains no classroom controls.

## Python Editor and Shell

Bundled CPython/Pyodide in a worker, with CodeMirror, F5/Run, Stop, direct `input()` in the Shell, REPL and .py download. These lesson tasks use supplied lists and require no keyboard inputs, but the Shell supports direct input. It is IDLE-style, not desktop IDLE. Serve over HTTPS or localhost, not file://. The scoped isolation service worker may reload once so Python can use SharedArrayBuffer. Keep the whole vendor folder.

The worker parses the unmodified source with Python AST before execution. Test feedback checks actual output plus a small set of required source patterns: indexed assignment, direct traversal, running-total initialisation/update/output, and conditional counter where applicable. It rejects common output-only shortcuts. These are formative checks, not a complete semantic proof, secure examination system or automated judgement of independent mastery. Alternative algorithms outside the stated pattern may need teacher review. All code, errors and attempts are retained for that review.

## Lesson-only Supabase saving

`config.js` contains only the existing public project URL and browser-safe publishable key. `supabase/01-learning-records.sql` adds a separate `y10_totals_records_private` schema and `y10_totals_records_*` access functions. It uses the existing fixed approved teacher account; it does not alter previous schemas, permissions or authentication settings.

The browser creates a per-profile 256-bit private key in its separate IndexedDB outbox. Only its hash is stored server-side. The key is never placed in URLs, notebook downloads, teacher exports or the public repository. Anonymous callers can join/save only a matching keyed record. All tables have RLS and no direct browser-role table grants. Only the approved authenticated teacher can read the class records through owner-checked functions. A teacher preview name grants no such access.

Short-paused drafts, answer attempts, actual program runs and source facts, test checks, Shell input, navigation, support, reflections, evidence metadata and completion are stored. Screenshots save separately. History events are append-only; retry IDs are deduplicated. A durable browser outbox retries failed connections and clears only acknowledged writes. Unusually large latest snapshots compact recent runs; individual run events remain in history.

Offline changes remain on the device and cannot upload after the browser closes. The UI distinguishes local saving, pending school saving and acknowledged school saves. Do not clear browser data before pending work reconnects. No recording of other tabs, clipboard history or unrelated activity. Use school retention rules. Different sessions with the same self-entered name are not automatically merged.

## Export and curriculum

PDF export works throughout, including unfinished pages, current code, checked and edited answers, every recorded run, support, reflections and complete screenshots fitted proportionally. It instructs students to attach and Turn in separately in Teams. Notebook restore is lesson/version/identity checked. Keep pupil PDFs and JSON traces outside this public repository.

OxfordAQA 9210 links: 3.2.2 programming concepts and 3.2.6 data structures. Direct Python list traversal is used deliberately. Class textbook printed pp. 54–57 are the previously verified list/traversal reference. No new unverified page numbers for totals/counts and no reproduced textbook pages are included.

## Maintenance

Run local QA scripts outside this public folder. The database stage whitelist must stay synchronised with lesson page IDs. Do not run old Lists/Menu or classroom SQL here. New database installation requires approval; local app creation does not itself publish to GitHub. Keep QA records visibly labelled and exclude them from assessment analysis.
