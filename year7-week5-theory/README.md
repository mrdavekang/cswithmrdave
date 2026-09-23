# Year 7 Week 5 Theory: Repeat, check and fix

Built around the supplied 18-page lesson sketch. The first PDF page is a cover; the app has a landing page and 18 activity cards. Reading precedes Do Now. The sequence includes Types of Learning, PRIMM stages, shape levels, guided and independent debugging, Learning Pitstop, five plenary questions, optional drawing/poster extensions, and submission.

## Open and host
Extract the complete ZIP. Upload the contents to a static web host, retaining the folder structure. Open index.html. Essential assets are local; no CDN or remote Python service is used. Direct file opening can work in some desktop browsers but hosting is recommended, especially for tablets and browser worker restrictions.

Students enter a name and class. Enter `teacher` as the name (class optional) to bypass completion checks. This is a testing convenience, NOT authentication. Authenticated teacher controls are available at `index.html?teacher=1`; the name shortcut does not grant classroom permissions. Navigation permits revisiting/skipping to any card; final review lists missing core work rather than trapping students in a locked path. Core Continue checks attempted MCQs, run attempts and nonblank short explanations. Wrong answers receive feedback and do not lock students out.

## Lesson timing
Core card estimates total 54 minutes. The live clock uses a 60-minute schedule, including six extra minutes for fact discussions and practice. The opening now explicitly teaches move, turn and a two-command pair before loop syntax. Use teacher judgement to carry an independent challenge forward if students need more reading time. Optional star/house and poster activities are for spare time or a later session. Students choose one shape level and one independent debugging level. No Week 4 checkpoint assessment is assumed.

## Saving and evidence
Names, answers, checked attempts, self-ratings, latest code, all recorded run code/results and drawings, and key interaction events are saved locally under a name/class-specific key. Use Save backup for a portable JSON copy. Restore it on the landing page. Resume last saved work is provided after reopening. Local storage is not confidential on a shared browser; use individual school device profiles and the school's data retention procedure. Supabase Classroom Mode shows anonymous device counts and navigation controls. Student names, answers, code and drawings are not uploaded. Browser clearing, private browsing, or quotas can remove/prevent saved work; visible save status warns about failure.

The PDF contains attempted work, run histories, latest output drawings, self-ratings and the interaction record. A successful run is not marked as proven task success. Mandarin answers/names are rendered as images in the report so characters are preserved (those portions are not selectable text). The poster is optional and has its own print preview. Teacher awards of house points are not automatic.

## Python
Genuine Skulpt Python 3 execution runs in a terminable Web Worker with the existing canvas Turtle bridge. Supported lesson commands include forward, backward, left, right, goto, penup, pendown, pensize, color, position, heading, circle and reset. This is an educational Turtle subset, not desktop IDLE/Tkinter. `import turtle as t` is supplied; .py downloads include the import and t.done(). Python execution is followed by animated drawing playback. Next instruction is a guided trace of the specific square example, not an arbitrary-code debugger. Stop terminates execution or playback. Execution/drawing limits prevent runaway loops. Speed selector controls playback; t.speed is a compatibility no-op.

## Tablet and multilingual support
English + Mandarin explanation and bilingual vocabulary are selectable and visible. This is curated language support, not automatic translation of every interface label or Python error. Four-space and new-line buttons support touch keyboards. No student screenshots are required. PDF downloads depend on the browser: use Share PDF / Save to Files when supported. Safari may open a PDF preview; Share → Save to Files is then necessary. Websites cannot force a device folder or confirm a Teams upload. Teams instructions target `Week 5 Theory`; students must attach the file and select Turn in themselves.

## Verification
Browser checks cover required-field guidance, MCQ attempts, Python execution, syntax errors and corrections, refresh/resume, teacher access, PDF generation, and responsive dimensions. Real iPad Safari and school Teams integration still require a device check before class. Vendor licence notes are in vendor/THIRD_PARTY_NOTICES.txt.

## Classroom Mode
Open `index.html?teacher=1` and use your approved Supabase teacher email/password. Start classroom, Lock navigation, Bring Everyone Here, Unlock / Self-Paced, and End classroom work with the 18 existing activity cards. The plain lesson URL connects students automatically to this lesson’s permanent classroom. Other lessons remain separate; no new link or student account is needed. Student names/classes still stay local for their reports.

Before using this lesson live, run `18-year7-week5-classroom.sql` in Supabase SQL Editor. Expect `year7_classroom_ready = true`. This extends the existing stage allowlist and preserves earlier lessons, including Year 11 shared slides. It works even if the previous step 17 has not been run; do not rerun older stage-allowlist scripts afterwards. Publish the updated folder to GitHub Pages separately.

## TTA presentation and class discussion
After teacher sign-in, choose **Open teacher presentation**. There are 21 slides: the 18 existing activity cards and three facts about repetition, indentation and debugging. Topic, WAGBA, knowledge/skills/understanding, keywords and challenge sit alongside the instructions. Mandarin explanations appear when the lesson language is English + 中文.

Previewing or changing slides does not move students. **Bring everyone to this slide** sends the chosen slide once. Close the presentation and use the usual classroom button to bring students to a normal activity card. Students have no slide selector or presentation menu. When navigation is locked, students can answer but cannot dismiss the shared slide; Unlock allows returning to the lesson. A teacher-directed normal-page move also closes the slide.

Each fact has a discussion answer box. Student responses save in their notebook and full backup, and appear in the report/PDF. Teacher responses are separate local notes and are not broadcast. Nothing written in these boxes goes to Supabase. Students still at the landing page receive the chosen slide after starting their notebook. Static assets remain publicly downloadable; the teacher-only menu is interface access control, not confidential file storage.

## Circular lesson clock: 1:00–2:00 p.m.
The circle shows the current time, remaining activity time and suggested activity. Drag it to any corner; it snaps there and remembers the choice. Click the circle to open the schedule. Four corner buttons provide a keyboard-friendly alternative. Students can turn guidance off. The suggested-page button is an explicit choice and respects teacher navigation locks. The clock never moves anyone automatically.

The schedule uses the device clock in Asia/Kuala_Lumpur, repeats daily and works without an active classroom. It is not a stopwatch. Before 13:00 it counts down to the start; after 14:00 it shows that time has ended. Extra-time drawing/poster slides are available within task time. The scheduled blocks are in `session-plan.js`; extra discussion time is included in loop reading, error reading, shape-making and independent debugging.

## Classroom verification
`node tests/classroom.test.cjs` checks the anonymous bridge, 18 cards and 21 slides, local response/report integration, navigation locks, remote routing, teacher-name privilege separation, all schedule boundaries and optional clock following. Local PostgreSQL-compatible tests passed all allowed stages, invalid-stage rejection, denied anonymous/other-teacher commands, repeat migration and earlier-lesson compatibility. Browser checks covered pending fact delivery, Mandarin responses, response persistence and report review, hidden student slide controls, locked Escape/close, teacher send controls and a Turtle square run. Live Supabase sharing still needs the migration and a signed-in teacher check; it has not yet been tested for Year 7.
