# Year 7 — Week 2 Practical: My first Python route

This redesigned lesson introduces Python for the first time. It deliberately replaces long planning forms and a multi-stop tour with small coding actions and a single chosen destination.

## Open and review

Extract the ZIP and keep all files together. Open `index.html`. For reliable school deployment, serve the folder on standard static HTTPS hosting; no build, student account, database or paid API is needed. All essential libraries, fonts and map assets are local. No data is sent to an external service.

Enter **teacher** as the name, with no class, to open every stage. This uses a separate local record. There are no teacher-control panels. This is a convenience for review, **not authentication**: students who know the name can also unlock the pages. Do not use the interface as a secure examination.

The normal student route requires name and class. Use the same spelling and browser to resume. Students may choose English or English + Simplified Chinese, and can change it from the always-visible header. Device help and word help remain visible.

## Suggested 60-minute classroom use

- 0–6 minutes: concrete story, start/destination and what the program will produce.
- 6–8 minutes: learning-strategy pitstop — knowledge, skills and understanding.
- 8–28 minutes: Main Task 1, ten short checkpoints. Run before typing; learn `t.goto`, x, y, sequence, punctuation, pen up/down, then explain.
- 28–46 minutes: Main Task 2, ten scaffolded checkpoints on the supplied map. The shared route workspace persists across these cards. Reception is a shorter route; C1 is the standard route; Library is an alternative.
- 46–51 minutes: spoken peer check. Extensions are for spare time, not additional compulsory work.
- 51–55 minutes: learning-phase pitstop and three short plenary checks.
- 55–60 minutes: prepare PDF and Python file, save, then turn in to Teams.

This is a pacing suggestion, not a deadline. Students learning typing and coordinates may need more time. Do not rush them through all checkpoints at the expense of understanding. The **I need teacher help** button records support and lets a learner move on from a coding barrier. The learner must raise a hand; no alert is sent to the teacher. Required choices still need an attempt, not a particular answer or keyword.

## Learning design and assessment

- Persistent WAGBA, keywords and concise Knowledge / Skills / Understanding are never hidden behind a drawer.
- Each card separates a short blue reading passage from an amber action. Instructions say where to type and what to press.
- Examples lead to small changes, then independent use on the map. Students are not asked to type imports or set up folders first.
- One `t` name and the same coordinate system are used throughout. `goto` means an absolute position, not extra steps.
- Peer assessment is **point to a line → predict → run → explain**, with a sentence stem. The app records the selected line and the student's account, not an audio recording.
- Multiple-choice feedback does not trap a learner after an incorrect answer. The report retains attempts and indicates when feedback/support was used.
- Route checks test start, destination, corridor boundaries and continuity. They are feedback, not a keyword gate or a substitute for teacher judgement.
- Missing work is highlighted with an actionable message. Merely opening a card does not complete it.
- Three independent extension workspaces preserve the main route. Each extension visit and its finish/return state is recorded.
- The **Types of learning** check now sits immediately after the Starter. It uses three matched, Year 7-friendly checks: reading a Turtle command (Knowledge), writing/testing a command (Skills), and explaining why route points are needed (Understanding). Pupils choose one starting point for each and one focus for the lesson; “This is new” and “Not sure / not checked yet” are valid learning evidence.
- The **Learning pitstop** now sits after the extension choices and before the plenary. It revisits those same three statements with “New learning”, “Consolidating”, “Treading water”, “Drowning — I need help” and “Not attempted yet”, then asks for one practical next step and one piece of evidence. The pupil can open their latest code/drawing while reflecting.
- Reflections are shown as short one-topic cards instead of a long form. The report records the before/after comparison, phase-specific next action, evidence choice and optional note; these are self-reports, not marks or fixed learner labels.
- Progress is evidence of participation, not a grade. Assess whether students can explain a `goto` command, predict a coordinate change, and connect their code to their route.

## Tablets, language support and PDF saving

English + Chinese support is human-readable lesson scaffolding, not a live translation service. Python tokens stay in English. Full-width brackets, commas, curly quotes and minus signs are visibly normalised before running to reduce keyboard-related errors. A Mandarin-speaking member of staff should review the phrasing for your class.

The controls have large touch targets. Point buttons provide an alternative to tapping the map; there is no drag-only or hover-only interaction. Punctuation buttons help with tablet keyboards. Laptop and iPad-sized layouts are responsive, with normal scrolling where needed; the learning header remains visible. Very small screens with a software keyboard may require closing the keyboard to see the full drawing.

On the final page:

1. Tap **Prepare my files** and wait for the ready message.
2. On an iPad, tap **Save / share PDF → Save to Files → Save**. On a computer, use **Download PDF**.
3. Save the Python `.py` file too.
4. In Teams, open **Week 2 Practical**, attach both files, and tap **Turn in**.

A website **cannot silently choose an iPad folder or force Safari to save rather than preview a PDF**. This app prepares the file first, then offers native sharing on a separate tap so the save operation retains the browser's required user gesture. If a browser opens a preview, the app explains **Share → Save to Files**. A download fallback and print-friendly report are included. Browser settings and in-app browsers can still change the behaviour; test on one actual school iPad before class.

Students do not need to take device screenshots: each Turtle run captures its output and code. The report includes responses, corrections, code, route drawing, reflection, attempted extensions, run history and interaction evidence. A teacher appendix may make an active learner's PDF fairly long. PDF pages preserve bilingual text as rendered images; the print-friendly report retains browser text.

Teams checkboxes are the student's own confirmations. The site cannot inspect Teams or verify a submission, and students do not have to regenerate the PDF after ticking them.

## Saving, privacy and existing work

Small records use localStorage; drawings use IndexedDB. Records are separated by lesson version, name and class; teacher work has its own key. This is **local progress only**, not a class dashboard. Private browsing, clearing browser data or changing device/browser may lose access to the record.

Use **Device help → Download backup** to keep a transferable JSON backup containing code, progress and drawing evidence. Import requires the same name and class and offers a safety backup before replacing that learner's redesigned record. The Reset action likewise preserves a backup and affects only this version's record.

The earlier Week 2 application's storage key is not deleted or migrated destructively. Where a matching earlier record is found, the final page offers **Download earlier work**. Existing records from different browser origins cannot be read automatically; use their original export first.

Names, class and student work appear in downloaded reports. Use school-approved storage and Teams; do not publish student evidence or backups publicly. There is no analytics service, camera access, advertising or external sign-in.

## Python implementation and safety

The app uses the included Skulpt Python interpreter in Python 3 mode, with a canvas-backed Turtle subset. This is genuine execution of Python expressions, variables, loops and functions, not a matcher for pre-written answers. It is **not full desktop IDLE / CPython / Tkinter**.

The Turtle subset includes `goto`, `forward`, `backward`, `right`, `left`, `setheading`, `penup`, `pendown`, `pensize`, `color`, `circle`, `home`, `position`, `xcor`, `ycor`, `heading`, `clear`, `reset` and usual short aliases. `done`, `shape`, `speed`, and visibility calls are harmless compatibility no-ops. Drawing is shown after execution rather than animating according to `speed`. Arbitrary Tkinter windows, packages, file/network access and interactive input are outside this lesson.

On HTTP/HTTPS, code runs in a Web Worker with termination, execution-time and drawing-count limits. A sandboxed frame with no connection permission is the fallback for direct local opening. It has interpreter limits; browser support for file URLs varies. **Static hosting is recommended**, especially for reliable PDF/ZIP export. The runtime is intended for classroom code, not as a hardened security service for hostile programs.

The map is a simplified **practice map**, not a map for real-world navigation. Students stay seated, avoid the marked staff-only area in their drawing, and do not undertake a physical walk around school.

The exported Route.py adds ordinary desktop Turtle setup and uses `school_map.gif`. The optional all-files ZIP contains this GIF and any attempted extension `.py` files. Keep the GIF beside Route.py when opening it in desktop Python with Tk installed. In the website, the background is loaded automatically.

## Files and maintenance

- `lesson.js`: English/Chinese lesson cards, objectives, destinations and route checks.
- `app.js`: navigation, input, local saving, editor, evidence capture and device-specific export flow.
- `model.js`: isolated progress/validation rules.
- `runtime.js`, `runner-worker.js`, `runner-frame.*`: Python execution.
- `report.js`: report generation and block-based PDF pagination.
- `assets/school-map.svg`, `.png`, `school_map.gif`: the same map for web and desktop use.
- `vendor/`: bundled Skulpt, html2canvas, jsPDF and JSZip. Retain their licence notices.

If changing the map, update its geometry, destination coordinates and corridor checker together. Do not simply swap a differently scaled image. The drawing coordinate origin is the centre of an 800 × 600 canvas; positive y points up.

## Verification

Unit checks cover every card's language content and validation, teacher separation, varied quiz answer positions, code-change detection, Unicode punctuation, filename safety, corridor routes, genuine Python execution, syntax/runtime errors, time limits and recovery.

Browser review covers the student journey, refresh recovery, map insertion, peer checks, optional extensions, reports, teacher access, and responsive layouts. These are browser checks, **not physical iPad/Safari certification**. Before use, confirm one actual classroom iPad can save both files and attach them in your school's Teams setup.
