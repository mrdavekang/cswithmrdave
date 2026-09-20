# Year 10 — Week 4, Sessions 1 + 2

## Open or host

Open **index.html**. It contains the complete app, styles, JavaScript and Raleway font. There are no external code libraries, build requirements, Python runtimes, analytics or network calls. For GitHub Pages, upload this one file to the desired folder. It is not published automatically.

The neighbouring `app.js`, `styles.css` and `index.template.html` are editable source copies. The delivered `index.html` is bundled: editing a source copy does not automatically rebuild it. For simple deployment, use the delivered index.html unchanged.

Enter a student's name AND class. Enter **teacher** as the name for a separate in-memory preview. This is not authentication and is not intended to protect confidential teacher material. Do not use real personal data for testing on a shared device. Each name/class combination has its own local record; spelling changes create a different record. A student should not use someone else's identity.

## Local saving and evidence

- Text, selections, completion flags, tutor progress, paper handover and every checked attempt are saved in localStorage per learner.
- Original PNG/JPEG/WebP images and captions are kept in IndexedDB (up to six per evidence stage, 8 MB each). No automatic image compression. Images appear in the report at their original aspect ratio, scaled to fit a page.
- Browser privacy settings, private mode, local-file restrictions, cleared storage or school device policies can prevent persistence. Warnings are shown if saving fails. A hosted HTTPS copy is generally preferable for classroom use.
- Download a full JSON backup before changing devices or closing a session when saving is unavailable. Restore it on the landing page. Restore overwrites the matching learner's local record after confirmation.
- Report export opens the browser's print dialog. Choose Save as PDF, A4, all pages; preview images and text before saving. This is not a direct PDF download. No work is uploaded to Microsoft Teams automatically.
- The extension has no answer boxes. Students request the actual paper, raise their hands, and hand their written work to the teacher. The button only records local handover status; it is not a live notification.

## Lesson and accessibility decisions

60-minute supported first encounter. Single-column reading, short sections within each main activity, persistent WAGBA/K/S/U summary, clear scenarios, specific expected actions, large monospaced code, no running editor, a line-pointer model with explicit skipped-branch explanations, optional hints and models, no countdown/leaderboard/forced locking. Keep an individual student's agreed support arrangements; these are not assumptions about all autistic learners.

K/S/U targets appear before Main 1 and after the extension. Students choose not yet / with support / independently for six targets (two per area); counts are self-report, not exam marks or confidence percentages. Each target also has a learning phase at the pit stop. Automatic checks are separately reported with all attempts. Code and open explanations need teacher review.

Read/code-trace before writing and guided modification reflect the Raspberry Pi Foundation's computing pedagogy: https://www.raspberrypi.org/teach/pedagogy . Practice moves from worked example to supported completion to explanation/testing. Nested selection is introduced with support; check independence in the next lesson rather than claiming mastery in one hour.

## Verified curriculum and source mapping

OxfordAQA International GCSE Computer Science 9210, supplied specification v3.3:

- 3.2.2: use/write/interpret selection and combined statements (printed p.12).
- 3.2.4: six relational operations (printed p.14).
- 3.2.5: NOT, AND, OR and combinations in selection conditions (printed p.14).
- 3.1.1: pseudocode/algorithm interpretation (printed p.10).
- 3.2.1 Boolean data is starter retrieval.

Supplied OxfordAQA textbook, **printed** pages (PDF viewer number is +4):

| Reading | Printed pages | PDF viewer pages | Use |
|---|---|---|---|
| Logical tests | 30–31 | 34–35 | Comparisons and True/False |
| Python selection | 32–33 | 36–37 | Python symbols, colon, indentation |
| if/else | 34–35 | 38–39 | Branches and fallback |
| Nested if | 36–37 | 40–41 | Inner decisions and matching else |
| Boolean operators | 38–39 | 42–43 | AND/OR/NOT |
| Pseudocode selection | 40–41 | 44–45 | THEN, ELSE, ENDIF and nesting |

App readings paraphrase and adapt these concepts. They are not verbatim textbook extracts. The workshop scenario, elif chain, scaffold, checks and alternatives are original teacher-created activities. The app does not reproduce the textbook PDF or imply the example came from it.

Past paper verified against both question and mark scheme:
**June 2024 · 9210/2 · Q05.1–05.3 · question pp.8–9 · 4 marks · AO2**.
Official mark scheme: **AQA-9210-2-Final-MS-Jun24-v1.0.pdf, p.10**.
This task contains selection/nesting and arithmetic, no loops. The meaning of <> and output characters is pre-taught. Trace tables are a stretch; use Q05.2, then Q05.3, then Q05.1 if appropriate. Students without trace-table experience may need teacher modelling first. No calculus is required to execute the given algorithm.

The original questions/mark scheme are not embedded or automatically distributed by the app. Teacher: prepare the authorised paper copy from your existing files. See TEACHER-GUIDE.md for exact source filenames and answers.

## Suggested next-lesson check

Use a different age boundary and ask students to predict, explain and complete a short selection chain without the model. Check whether nested decisions are understood independently before recording mastery.

## Verification status

The delivered standalone script parses and exactly matches its source. Offline, non-rendering DOM tests passed for landing entry, all answer keys, incomplete attempts, first-attempt history, K/S/U counts, six tutor routes, subpage navigation, long answers, HTML escaping, complete report markup, print handler, teacher isolation, learner restoration and backup image/caption restoration. Both Python examples were executed across 28 combinations each (ages 12–18 and both values for permission/cancelled).

An initial bundling error found during checking was fixed. The in-app browser blocked the local preview under its URL security policy. No workaround was used. **The final app has not received a successful browser visual review, mobile rendering check or actual PDF-pagination check.** Before classroom use, open index.html in your own browser, try a sample response and screenshot, then check every page in its Save as PDF preview. Function checks do not establish visual layout fidelity or real-browser image-storage compatibility.
