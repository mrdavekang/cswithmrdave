# Year 7 · Term 1 Week 3 Theory
## Python Turtle: Read, Trace and Predict

Open **index.html** after extracting the complete folder. For a class using iPads, Android tablets or managed devices, host the whole folder on your usual static website host and share the hosted lesson URL. Do not ask students to open JavaScript files or run the app inside a ZIP or Teams file preview. There is no build step or Python installation for students. The browser Python runtime is included in the folder.

## Automatic screen fitting — new in this build

No teacher setup or student device selection is needed for the responsive layout. The page measures the **available browser window** and touch capability, then rearranges content instead of making all text smaller.

- Wide windows keep the goals sidebar and allow code and drawing side by side when the actual editor has enough room.
- Portrait tablets, narrower windows and split-screen views put code above the drawing. A compact stage selector replaces cramped navigation tabs. Narrow trace tables become labelled rows.
- Rotation, window resizing and available visual-viewport changes are handled without reloading the lesson or replacing the editor. Student answers, predictions, code, observations and the current drawing are preserved.
- Default reading text is 17 CSS px on ordinary desktop settings and 18 CSS px for touch screens / wide windows. These defaults respect the browser's base font setting. Form and code input text stays at least 16 CSS px. Touch controls are enlarged.
- **Aa Display** is available on the landing page, lesson header and Python editor. Students can increase text through 115%, 130%, 150%, 175% and 200%, or keep a single-column reading layout. Reset returns to the comfortable automatic default. These preferences are kept in this browser separately from answers.
- A best-effort device/browser suggestion preselects the new student's **PDF saving guide**. Students can correct it. This suggestion does not decide layout and does not overwrite an existing student's selected saving route on resize.
- The expanded editor fits the available visual viewport, with keyboard-aware adjustments where that browser exposes the information. Physical iPad/Android keyboard behaviour still needs testing on school devices.
- PDF preview opens fitted to the available width, with an **Actual size** option. Reading preferences do not enlarge the saved A4 PDF or change its pagination.

Replace the complete deployed folder, keeping your configured **config.js**. The new files **screen-fit.js** and **screen-fit.css** must remain beside index.html. There are no new dependencies, fonts, API keys or external services. Keep the same site URL/origin for access to existing browser-stored work; export important work before updating a live class.

Details and limitations: **teacher/SCREEN_FIT_NOTES.md**. Current validation: **TESTING.md**.

## Before teaching

1. Open index.html and type **teacher** as the name. Teacher mode opens all stages and the teacher tools. It is a classroom convenience, not secure authentication.
2. In Teacher tools, add the exact Teams assignment title and optional assignment URL. Import `teacher/Turtle_Trace_Gimkit_Template1.csv` into Gimkit, review the 15 questions and copy the resulting **Assignment or Practice link** into the Gimkit field. The kit has **not** been published to your account automatically.
3. Save the settings, then **Export config.js** and replace the existing config.js in the deployed folder. Changes saved only in the teacher browser do not automatically reach student devices. A configured student link can carry the title and links; screenshot replacements require config.js deployment.
4. Check the PDF saving and Teams attachment route on one representative school iPad, Android tablet and laptop before using it with the class. The embedded submission pictures are clearly labelled **illustrated walkthroughs, not real operating-system screenshots**. Teacher tools lets you upload genuine student-view screenshots, select the device/browser/Teams route and guide step, add a caption and place a highlight. Remove identifying data from screenshots first. Export config.js again after adding them.
5. Test a report export and the correct Teams assignment with a test student account. Reserve the final ten minutes for saving and submission.

Full teacher instructions, source links and answer keys: **teacher/SETUP.html**. The new editor walkthrough and command reference are in **teacher/PYTHON_IDE_GUIDE.html**.

**Updating an existing deployment:** keep your configured `config.js` if you already added Teams / Gimkit links or genuine device screenshots. Replace the rest of the app together, including `ide/` and `vendor/skulpt/`. Keeping the same lesson URL/origin and browser retains access to existing local progress; the new Python fields are added as needed. Export any important evidence before changing a live lesson.

## Included

- Landing page: name, class, iPad / Android / Windows / Mac / Chromebook, browser and Teams app/browser choice.
- English-first learning with optional Simplified Chinese or Korean support.
- Read now, Do now, Types of learning, Main task 1, Main task 2, optional Extension, Learning pitstop, Plenary, Submit, then optional Turtle challenge.
- Genuine editable Python Turtle labs beside all six Main task 1 questions, the Main task 2 route, both comparison programs, and the saved checkpoint. A separate extension workspace is included.
- Predict → save prediction → run Python → compare. The supplied code is editable, and each question restores its own starting position, heading and pen state on every run.
- Run, Step through Turtle actions, Stop, Reset code, adjustable playback, coordinate grid, position / direction / pen readouts, console output, error-line feedback, touch command buttons and an expanded editor view.
- Variables, expressions, print(), conditions, loops and functions execute in the bundled Skulpt interpreter. A classroom Turtle adapter supplies the canvas drawing commands; this is not full desktop CPython/Tkinter.
- Per-question draft code, run summaries and notes are saved locally. Students can keep up to three short tests, including executed code and actual drawing, in the same lesson PDF. Optional .py export is available but is not another required Teams upload.
- Guided route trace, two-program comparison, and an independent eight-mark checkpoint with click/tap plotting or coordinate selectors.
- Original checkpoint frozen on first submission. Its Python workspace is locked until that first submission is saved. Students can then test and correct; the first prediction is never replaced by executed output. Later corrections and support records remain separate.
- Before/after reflection on the same Knowledge, Skills and Understanding statements.
- Local answer saving and resume, with a warning if browser storage is unavailable.
- Named, locally generated PDF containing questions, original answers, corrections, the predicted plot, reflections and support notes. The PDF is image-based to retain diagrams and multilingual text; its text is not searchable/selectable.
- Nine-step device guide: check report, save, remember folder, find/open, open assignment, attach, verify attachment, turn in, check the submitted status.
- Optional 15-question Gimkit launch; the same question bank is included as a local backup quiz, not a compulsory second quiz.
- Teacher review, marking key, projection overview, screenshot replacement, configured-link/config export, and a local teacher-release control for incomplete evidence.

## Evidence and privacy

The app has no server, class dashboard, analytics or automatic submissions. Student work stays in the current browser until the student saves the PDF and uploads it through Teams. “Saved PDF” and “Turned in” checks are explicitly **student confirmations**. Pressing Download does not prove that a file was saved. The app cannot verify Teams or send a help notification.

Use the same device, browser and lesson URL for resume. Private browsing, school cleanup policies, clearing storage or changing browser/origin can remove or separate local progress. On a shared device, save/submit the PDF, then use the profile panel's End session control to remove that student's local answers. This does not delete saved PDFs or Teams submissions.

A substantive answer change invalidates the prepared PDF and resets local submission confirmations, so the student can prepare and submit the updated report. Editing Python code, running a new test or changing a kept observation also updates lesson evidence. Finish those experiments before PDF preparation and submission. Working in the optional backup quiz does not invalidate evidence or require another upload.

The teacher release is in the student profile panel: **Teacher: release incomplete evidence**. Enter `teacher` and a reason. The student remains named, missing responses stay missing, and the override reason is recorded. This does not bypass the final turn-in confirmation. It is not authenticated.

## Technical notes

All core scripts, the Python interpreter, the classroom Turtle adapter and PDF libraries are local. The lesson does not depend on a CDN. Teams, Gimkit, source links and a hosted initial page load need network access. The app is not an installable PWA and does not promise offline reloads of a hosted site. Once loaded, lesson tasks and PDF preparation do not require external services.

PDF: Prepare PDF first, then Save/share or Download. Two clicks preserve the user action needed for mobile sharing. Where sharing is unavailable, use Download or Open PDF. The report preview also provides a Print / Save PDF fallback. Browser and school policies may restrict saving or pop-ups.

Teacher screenshots are compressed locally and embedded in exported config.js. A large collection may exceed localStorage quota; export config.js immediately if warned. Screenshots in the teacher configuration are served to students, so never include sensitive data.

### Python runtime and limits

Python runs in a disposable Web Worker. Turtle actions are recorded, then played back on the canvas; Step is an action replay, not a full Python source debugger or variable inspector. The control highlights the student code line responsible for each Turtle action. Comments and arithmetic-only statements do not create a drawing action. Each Run starts fresh; later edits do not modify a previously kept test until the student explicitly updates it.

Supported lesson commands include goto/forward/backward, left/right/setheading, penup/pendown, position/heading, colour, pen width, basic shapes, circle, dot, write and fills. See the built-in help and teacher guide for the subset and limitations. Desktop GUI/Tkinter, keyboard/mouse Turtle event bindings, package installation, input(), image assets and external network requests from student Python are not provided. Use the Playback control instead of relying on t.speed(). Coordinates beyond 10,000 units and excessively long programs are rejected by the classroom adapter.

The editor caps source at 200 lines / 12,000 characters, drawing actions at 800 and console output at 12,000 characters. Runtime and worker timeouts stop overlong computations; Stop immediately terminates the running worker. This is a classroom convenience, not a hardened platform for hostile code. It does not promise full compatibility with every desktop Python or Turtle library feature.

Host policies must allow local scripts, Blob-backed workers (`worker-src blob:`) and Skulpt-generated functions (`script-src` permits `'unsafe-eval'`). Other existing parts of this static app use inline styling and event handlers; do not apply a restrictive Content Security Policy without testing the complete lesson. The app shows an error rather than silently substituting a fake interpreter when the runtime cannot start. No runtime CDN requests are made.

No font files are included. The app uses available system fonts. Vendor notices are in THIRD_PARTY_NOTICES.txt.

Testing details and limits: TESTING.md. Native Safari/Android OS menus, real school Teams authentication and an authenticated Gimkit import require a school-device check; responsive browser testing is not a substitute for that.
