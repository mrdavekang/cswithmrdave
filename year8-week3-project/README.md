# Year 8 · Week 3 Project — Make it remember

Visual revision, 24 September 2026. Open index.html after extracting the complete folder. For GitHub Pages, upload the entire folder, including assets, libraries, visual-lesson.js and visual-lesson.css. No build step is needed. This release is not a single-file HTML edition.

## Teaching flow

Read now → Do now → Types of learning → Main task 1 → Main task 2 → Learning Pitstop → Go Further → Plenary / report.

WAGBA and KSU are retained. The main build now has three linear cards: open the right editor, follow the working reference, and run the first test. Next no longer skips hidden build tabs.

Suggested 60-minute allocation: Read/Do now 8 min; KSU 5; build 14; test/evidence 12; Pitstop 4; challenge time 10; plenary/save 7. Adjust for hardware difficulties. Do not require the full challenge bank in one lesson.

## Go Further

Four projects, each using Explore → Build → Play & change:

1. Movement detective: shake events increment a count; B resets it. Based on micro:bit Step counter.
2. Two-player scorekeeper: separate A/B totals, then change one player's points. Adapted from MakeCode Scorekeeper.
3. Grove signal counter: red LED module at P2 confirms each increment with a pulse.
4. Grove dial snapshot: rotary sensor at P0; A stores a reading and B recalls it. Compare saved values with live tracking.

Each includes a real MakeCode screenshot, matching MakeCode Python and MicroPython, exact toolbox instructions, expected results and a concrete modification. The short outcome/observation replaces long extension planning forms. Concept previews do not execute student code or confirm hardware performance. Exploring a preview alone does not mark a build complete.

Next advances through every card. Back and the journey remain available. “Time to stop? Go to plenary” bypasses challenge time without blocking core work. All core cards are still navigable; incorrect answers do not hard-lock students.

## Editor routes

- Blocks: MakeCode → Blocks. Rebuild the named blocks from the screenshot.
- MakeCode Python: MakeCode → language menu beside JavaScript → Python. Do not paste MicroPython here.
- MicroPython: https://python.microbit.org/v/3 — not ordinary desktop Python.
- iPad/tablet: Blocks or MakeCode Python. Open the installed micro:bit app → Create Code → MakeCode, then use its current Bluetooth/Download instructions. The website button opens a browser, not the app.

Save the badge before creating a separate challenge project. Full examples replace that new project's code; never append duplicate handlers or a second infinite loop. Wait for each display to finish before the next input. Python event/loop syntax is scaffolding, not a memorisation target.

## Grove preparation

Use the Grove Inventor Kit for micro:bit, its shield, keyed four-wire cables, red LED module and rotary angle sensor. Power off before connecting or removing anything. Grip plastic plugs, follow printed P2/P0 labels, and get a teacher check before using approved power. No crocodile clips or bare-LED substitution. Do not force rotary end stops. Keep liquids away.

Connection diagrams are not exact socket-position drawings. A real kit photo and plug guide support identification. Standard digital/analog pin commands need no Grove software extension. Readings 0–1023 are raw values, not angles or percentages. Without a kit, choose the movement/scorekeeper projects; a preview cannot prove physical wiring works.

## Saving and submission

The existing localStorage name/class profiles and backup schema are preserved. New extension notes, outcome choices and concept-preview records appear in reports and backups. Prior extension notes remain reportable. Uploaded/pasted/camera evidence remains on the evidence card with a no-photo alternative.

Menu → Save JSON backup lets students move work between devices; Restore validates it. Save a backup before clearing browser data or resetting. Images share browser storage limits; heed save-failure warnings.

The header exports a partial/final PDF; Menu → Print / Save as PDF is the fallback. Tests and reflection remain student-reported where not objectively checked. Submit the PDF to the Week 3 Project Teams assignment specified by the teacher; exporting is not automatic submission.

## Teacher and language support

Enter teacher as the name, or use index.html?teacher=1 to prefill it. Teacher mode uses a separate profile and can display suggested answers. It does not fabricate student answers.

Mandarin and Korean remain available at entry and in the header. New key instructions are translated; exact code/toolbox names remain English. Short observations in any language and an oral demonstration are appropriate.

## Limitations and files

External editors require internet. Lesson images and jsPDF are local; Raleway has a system-font fallback. Local-file saving, clipboard access, downloads and new tabs depend on browser policy; static HTTPS hosting is recommended. Never put student submissions or backups into the public repository.

visual-lesson.js and visual-lesson.css implement the visual build/challenges. assets/guides contains actual MakeCode captures, original wiring diagrams, the Seeed kit photo and plug/Pins guides. Read SOURCES.md and TEST_REPORT.md for sources and verification limits.

Developer check (not required to use the lesson): JSDOM_PATH=/path/to/jsdom node test-visual.cjs.


## Class Remote (September 2026)

Use the same lesson URL for students; open `?teacher=1` and sign in with the approved Supabase classroom teacher account for the control dock. The name field alone does not authorize remote controls. Student names, class, code and answers remain local for their PDF.

Before publishing, run `supabase/20-year8-week3-class-remote.sql` once in Supabase SQL Editor. It extends the existing shared setup, preserves other lesson routes and adds a teacher-only control function. Do not rerun older allowlist migrations afterwards. The result should show `class_remote_ready = true`.

The bottom dock stays visible when viewing the lesson or presentation:
- **Start classroom** opens a live self-paced session. LIVE / connecting status and anonymous device counts show whether the session is active. “Received this update” confirms delivery, not student attention.
- **Screens down** covers student pages with an attention message.
- **Show only** follows the teacher and allows scrolling, while blocking answering and other lesson interactions.
- **Let students answer** follows the teacher while allowing responses; navigation stays locked.
- While any of those three modes is active, changing the teacher's lesson page or public slide automatically moves students too.
- **Self-paced** restores navigation. **Return to own work** also restores each student's saved page and scroll position from before the interruption. Answers are preserved.
- **Bring here once** sends the current public page without changing the mode.
- **End classroom** releases students. Sessions expire after two hours; missed broadcasts recover through polling, normally within ten seconds.

Choose a lesson page or teaching slide from the dock. Back to lesson returns to the teacher's underlying activity. Three facts cover storing values, updating versus assigning a fixed value, and reset. Their response boxes save locally and student responses appear in the report.

Two teacher-reference slides include the original TTA Types of Learning and Learning Pitstop images. They are excluded from student menus and server broadcast destinations. Public slides can be shared; private references leave students where they are. GitHub Pages assets are public files, so hidden reference slides are not confidential storage.

The controls operate within the lesson website; they cannot prevent a student closing the browser or switching apps.

Checks: `JSDOM_PATH=/path/to/jsdom node test-visual.cjs` and `JSDOM_PATH=/path/to/jsdom node test-classroom.cjs`. The database upgrade was also checked locally against prior classroom migrations. Browser visual review remains pending because the browser tool's security check was unavailable.
