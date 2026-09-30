# Year 7 · Week 7 · Consolidation theory · revised build

## Open and host

Extract the ZIP and open index.html, or upload the whole folder to a school-approved static host. No build step or CDN is required. All essential runtime, font and PDF files are local. Static HTTPS hosting is recommended for classroom use and native file sharing. Test the published URL on a real school iPad before class. School policies may restrict Blob Web Workers, which the Python runner requires.

## Entry and saving

Students enter a name and class and choose English or English with Mandarin support. Enter teacher (case-insensitive), without a class, for preview. This shortcut is NOT secure authentication and must never authorize future cloud pupil access.

Work saves only in this browser on this device. Supabase is not connected. Finishing does not send work to a teacher or Teams. Collect a JSON or PDF backup if evidence is needed during this pilot. Typed names are not secure identities or cross-device logins; each local profile has an opaque generated ID. Shared-device users can see local saved profiles. Do not use a public kiosk for sensitive records, and keep backups in school-approved storage.

Download backup is visible at the top right throughout the lesson. It saves JSON for recovery; Restore JSON backup is on the landing page. Click your displayed name for learner settings, switching profiles or resetting the current profile after confirmation. Browser data clearing and private browsing may remove local work.

## Lesson structure

Read first → Do Now → Types of Learning → Read first → Main task 1 → Read first → Main task 2 → Learning Pitstop → Extension → Plenary → Finish.

The stage bar and response-based progress bar stay visible. Each main task groups its smaller practice cards beneath the stage heading. Current stages and current practice cards are labelled. All stages can be revisited or opened directly. Save and continue asks for missing responses, but never requires a correct answer, specific wording or exact code. Any recorded Python run, including an error, is an attempt. Incomplete work remains visible at Finish.

Main task 1 decomposes a small graphics collection and orders/plans a triangle. Main task 2 repairs three different outputs: a triangle, hexagon and zigzag. Extra designs are a pentagon, star, ray fan, rainbow arc and rainbow sparkle. Every programming card keeps a labelled target beside actual output. The target is a reference drawing, not an automatic pass/fail checker.

## Colour studio

Every Python editor has a visible Colour studio button beside the coding area. Students can choose eight named colours, a custom colour or rainbow colours. Apply changes their real Python code; they then tap Run to inspect it. Closing without Apply leaves the code unchanged. Reapplying or switching styles replaces only the tool's tagged colour instructions, not movements or turns. Existing manually written colour commands are preserved; commands later in the drawing can still change colour.

Rainbow changes colour on each repeat of a multi-line for/range loop. If no suitable loop is present, the studio gives a local explanation and offers a single colour or the rainbow challenge; lesson navigation remains available. Colour does not determine completion or correctness. Keep the shape as the goal and choose a colour visible on white. The prepared colour list and indexing/modulo lines are not assessed in this lesson.

The rainbow challenge repairs a circle angle to make seven upper half-circles. The sparkle challenge repeats an out/back/turn group eight times. Sparkles are drawn rays, not flashing particles. Gentle coloured accents distinguish creative choices from green correct and amber review feedback. Chosen styles, actual coloured output and code persist locally and are included in JSON/PDF and .py exports. This is an additive build: existing lesson-version-2 progress is retained.

Correct checked answers are green. Incorrect checked answers are amber with an explanation. Unchecked selections and self-observations are blue/neutral. Editing a response clears its previous feedback. The former help-reason form and help-and-continue panel are removed. Students can tell the teacher and use the stage bar without filling in a help form.

## Evidence and backup

Code/output evidence is captured automatically from genuine Python execution. No manual screenshots are needed. The record includes responses and bounded first/recent answer histories, arranged algorithms, code drafts, first/recent runs with compact coordinates and errors, K/S/U ratings, Pitstop, quiz rounds and local finish time. No help-reason or page-visit logging is added. Progress is participation evidence, not a grade.

PDF is available at Finish or through learner settings; JSON remains available at all times. On iPad Safari, Download may preview a PDF: choose Share / Save to Files, then attach it in Teams if requested. A website cannot force an iPad folder. Native file sharing depends on the browser and hosting context. Teams confirmation is a pupil self-report, not an independently verified upload. The named assignment is Week 7 Theory.

## Python

The local Skulpt worker and canvas Turtle bridge run actual Python. Supported lesson features include movement, turning, pen control, colours and simple loops. This is not full desktop CPython IDLE; Tkinter, network/file access, arbitrary modules and some advanced Turtle methods are unavailable. The editor provides line numbers, indentation, Run/Stop, drawing speed and .py import/export. Code uses a monospaced font; the interface uses local Raleway.

Time, output and movement limits protect normal classroom use, not hostile-code security. Do not ask pupils to run untrusted downloaded programs. Vendor licences are included.

## Quiz resources

The same 15 questions are available in the app and teacher-resources/Year7_Week7_Gimkit_15_Questions.csv, Year7_Week7_Blooket_15_Questions.csv and Year7_Week7_Answer_Key.csv. Blooket uses the supplied eight-column template format. Game links require internet and a teacher-hosted code; external results do not return to this app automatically.

## Maintenance and checks

lesson-data.js defines content and stable response IDs; progress.js defines attempt requirements; app.js handles local state and interaction; report.js exports evidence; lesson-layout.css refines the visible stages and target layout; colour-studio.js/CSS provides the creative colour tool. Keep these scripts together. Changing response meaning requires a lesson-version update and deliberate migration. V1 backups preserve legacy data and restart the revised lesson at Welcome; changed quiz attempts are archived separately.

Read teacher-resources/TEACHER_GUIDE.md and TEST_REPORT.md. Mandarin support covers core readings, vocabulary and selected instructions, not every interface string or automatic translation. Have a bilingual colleague check terminology. Actual Safari/iPad, Teams upload, school filtering and live quiz imports still require school-device testing. No cloud credentials or database changes are included.
