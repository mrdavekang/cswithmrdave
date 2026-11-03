# Year 10 - Search confidence and bubble sort (blended responses)

New, separate, buildless lesson. Use GitHub Pages or a local HTTP server. Live controls need an internet connection. No build step is required.

## Classroom use

- 60-minute plan: starter 0-6; Types of Learning 6-8; Main Task 1 8-20; three bubble-sort facts 20-30; Main Task 2 30-50; extension/support 50-54; Learning Pit Stop 54-57; plenary 57-60.
- Only Main Tasks 1 and 2 (Q2-Q7) go in the six-page printed booklet. Print A4, actual size; duplex long edge if preferred (three sheets per pupil).
- Starter Q1, Types of Learning, extension Q8, Learning Pit Stop and plenary Q9 have on-screen responses. Each page clearly labels its response mode. Question numbers are retained across the app, booklet and teacher key.
- Students enter Name and Class (10E or 10T), with no password. Digital answers and short-paused drafts save locally and to a separate Supabase lesson record. Device keys restrict each device to its own saved work; names are self-entered, not verified attendance. Keep the same name/class to resume in this browser.
- `teacher.html` is the linear teacher dashboard: exact student content, bottom Previous/Next, right-side class/display/discussion/timer controls and written teaching prompts. Private pupil records require the existing approved teacher account. The no-login quick preview is separate and never saves pupil work.
- `teacher.html?view=responses` opens the separate private response grid: stable cards, individual answers, first/latest starter checks, written feedback, lesson house points and JSON records download. These are saved drafts, not a keystroke monitor or automatic judgement of mastery. Paper tasks must still be collected.
- `projector.html` is opened from the signed-in dashboard with a temporary projector capability. It shows WAGBA, KSU, keywords and challenge throughout. Names, drafts and private feedback are excluded; discussion answers use stable anonymous numbers after review begins. Use the projector, not the private teacher dashboard, for screen sharing.
- Projector-only controls are separate from pupil control. Show this slide on projector, automatic projector following and projector answer reveals never move or pause student screens. Only Bring students to this page + pause opens the pupil attention overlay. Release returns pupils to their own saved progress. The projector keeps its selected slide.\n- All 21 pages have individual suggested durations totalling 60 minutes, visible in the page chooser and preview heading. The projected page has its own adjustable timer. Show a page, then click Start / restart slide timer; navigation alone does not start it. Changing projected pages pauses and preserves the previous timer. Returning restores that timer. Discussion countdowns are separate and pause the slide timer.
- Discussions have a visible response countdown. Submitted pupils can return to their paper work before time ends. Reinvite keeps the deadline and saved answers; reopen gives the same question a new window without erasing responses or points. A complete response window closes automatically into model feedback. One house point per student per discussion is idempotent; celebrations honour reduced-motion settings. These are lesson awards, not iSAMS entries.
- Main-task worked answers are hidden until a learner says they have attempted the paper question. This is a self-check, not proof that an answer was written. Starter checks require an entry first and retain first/latest checked attempts. Written explanations require teacher review. Independent Q3/Q5b/Q6/Q7 answers remain in the separate teacher PDF.
- Use a pencil for initial paper answers and a different colour for corrections. Hand in the booklet. Digital work uses Export on-screen answers PDF, then Save as PDF in the browser print dialog. The export includes all entered digital answers, attempts and reflections without truncation; it explicitly excludes handwritten paper evidence. Attach the PDF to the teacher's Teams lesson assignment and select Turn in. Exporting is not submission.
- Teacher preview uses isolated temporary data and cannot overwrite a pupil's saved responses. It is a navigation mode, not authenticated access to class records.
- No student names or private learning profiles are embedded in this package.

## Technical / curriculum choices

- Fixed index/value cells and prepared boundary states avoid renumbering or counting errors.
- The binary-search model uses target 13 in [5,9,13,18,24,31,42]. A fresh independent task uses target 26 in [4,8,12,19,26,33,40].
- Bubble sort uses a swap-controlled WHILE loop and a definite FOR loop, aligned to OxfordAQA 9210 3.1.4. Every pass checks all adjacent pairs, including the final pass with no swaps. No shrinking-end optimisation is introduced.
- Paper Python completion develops algorithm implementation but is not independent IDE execution. The walkthrough is a prepared trace, not an executable Python runtime.
- Teacher key is intentionally not included in the student website folder. The teacher should keep the separately delivered PDF private.
- Raleway fonts are included under the accompanying OFL licence. Program code uses the device monospace font.

Student lesson URL: https://mrdavekang.github.io/cswithmrdave/year10_search_confidence_bubble/

Teacher dashboard URL: https://mrdavekang.github.io/cswithmrdave/year10_search_confidence_bubble/teacher.html

Rehearsal: `teacher.html?demo=1`. Clearly labelled synthetic records; no school writes or live student control. The bundled Supabase browser client is reused from the established lesson vendor file; no service-role key is included. Database schema, tests and QA outputs stay outside this public folder. The separate teacher mark scheme stays outside the public repository. No Teams publication is included.
