# Year 7 Week 5 Theory: Repeat, check and fix

Built around the supplied 18-page lesson sketch. The first PDF page is a cover; the app has a landing page and 18 activity cards. Reading precedes Do Now. The sequence includes Types of Learning, PRIMM stages, shape levels, guided and independent debugging, Learning Pitstop, five plenary questions, optional drawing/poster extensions, and submission.

## Open and host
Extract the complete ZIP. Upload the contents to a static web host, retaining the folder structure. Open index.html. Essential assets are local; no CDN or remote Python service is used. Direct file opening can work in some desktop browsers but hosting is recommended, especially for tablets and browser worker restrictions.

Students enter a name and class. Enter `teacher` as the name (class optional) to bypass completion checks. This is a testing convenience, NOT authentication. No teacher controls are shown. Navigation permits revisiting/skipping to any card; final review lists missing core work rather than trapping students in a locked path. Core Continue checks attempted MCQs, run attempts and nonblank short explanations. Wrong answers receive feedback and do not lock students out.

## Lesson timing
Core card estimates total approximately 59 minutes; these are guide times, not timers. The opening now explicitly teaches move, turn and a two-command pair before loop syntax. Use teacher judgement to carry an independent challenge forward if students need more reading time. Optional star/house and poster activities are for spare time or a later session. Students choose one shape level and one independent debugging level. No Week 4 checkpoint assessment is assumed.

## Saving and evidence
Names, answers, checked attempts, self-ratings, latest code, all recorded run code/results and drawings, and key interaction events are saved locally under a name/class-specific key. Use Save backup for a portable JSON copy. Restore it on the landing page. Resume last saved work is provided after reopening. Local storage is not confidential on a shared browser; use individual school device profiles and the school's data retention procedure. There is no central teacher dashboard or server upload. Browser clearing, private browsing, or quotas can remove/prevent saved work; visible save status warns about failure.

The PDF contains attempted work, run histories, latest output drawings, self-ratings and the interaction record. A successful run is not marked as proven task success. Mandarin answers/names are rendered as images in the report so characters are preserved (those portions are not selectable text). The poster is optional and has its own print preview. Teacher awards of house points are not automatic.

## Python
Genuine Skulpt Python 3 execution runs in a terminable Web Worker with the existing canvas Turtle bridge. Supported lesson commands include forward, backward, left, right, goto, penup, pendown, pensize, color, position, heading, circle and reset. This is an educational Turtle subset, not desktop IDLE/Tkinter. `import turtle as t` is supplied; .py downloads include the import and t.done(). Python execution is followed by animated drawing playback. Next instruction is a guided trace of the specific square example, not an arbitrary-code debugger. Stop terminates execution or playback. Execution/drawing limits prevent runaway loops. Speed selector controls playback; t.speed is a compatibility no-op.

## Tablet and multilingual support
English + Mandarin explanation and bilingual vocabulary are selectable and visible. This is curated language support, not automatic translation of every interface label or Python error. Four-space and new-line buttons support touch keyboards. No student screenshots are required. PDF downloads depend on the browser: use Share PDF / Save to Files when supported. Safari may open a PDF preview; Share → Save to Files is then necessary. Websites cannot force a device folder or confirm a Teams upload. Teams instructions target `Week 5 Theory`; students must attach the file and select Turn in themselves.

## Verification
Browser checks cover required-field guidance, MCQ attempts, Python execution, syntax errors and corrections, refresh/resume, teacher access, PDF generation, and responsive dimensions. Real iPad Safari and school Teams integration still require a device check before class. Vendor licence notes are in vendor/THIRD_PARTY_NOTICES.txt.
