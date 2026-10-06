# Mission Loop — Repair the Ship

Year 8, Term 1 Week 7 theory: iteration, counters, stopping conditions and debugging. A 60-minute lesson with original cartoon space-crew artwork, a genuine browser-based CPython editor and short ungraded games. No Among Us artwork or branding is included.

## Open and host

Extract the ZIP. Upload the **whole folder**, including `vendor/`, to a static host such as GitHub Pages. Open `index.html` at its HTTPS address. The files use relative URLs and work inside a repository subfolder. No build, server-side database, accounts or paid services are required. Do not upload only the HTML file.

Double-clicking `index.html` opens the lesson pages, saving and games, but modern browser restrictions prevent the module worker and real Python runtime from loading from `file://`. Use static hosting or a local HTTP server for coding. A friendly explanation appears in the console if Python is unavailable. If Python works at home but not at school, ask IT to permit WebAssembly and web workers for the lesson's domain. There is no CDN dependency.

Bundled runtime files total approximately 14 MB before ZIP compression. The first Python run may take several seconds; later runs reuse the loaded worker. The first run on each new coding card loads a fresh worker so shell variables cannot leak between tasks. Use a modern Chrome, Edge, Firefox or Safari. Browser tests were run in desktop Chrome with tablet-sized viewports; these are not physical iPad tests.

## Student entry and teacher testing

Students enter full name and class. They can choose English, English with Simplified Chinese support, or English with Korean support. English code and instructions remain visible. Language support translates key task guidance and provides a glossary and sentence frames; it is not a certified full translation of every interface label.

The normal route is `index.html`. A teacher can enter **teacher** as the name, or open `index.html?teacher=1`. This unlocks the journey and relaxes progress requirements, with separate teacher storage. No teacher controls are shown on the student landing page. This is a convenience for testing, not access control or authentication.

## Lesson journey

1. Read first: spacecraft briefing.
2. Do Now: comparison, counter update, selection versus repetition.
3. Types of Learning / How to Get Better: KSU readiness with examples.
4. Main Task 1: loop pattern, worked countdown, prediction, repair.
5. Crew Break: Reactor Overdrive, a freely skippable ten-second click-speed game with untimed practice and opt-in sound.
6. Main Task 2: repeated code entry, counter and three test cases.
7. Learning Pit Stop: KSU evidence and learning experience.
8. Go Further: three-attempt limit, launch, abort, unreachable target.
9. Plenary.
10. Review and PDF export.
11. Crew Lounge after the student's Teams-submission confirmation.

Each view contains one card. Learning information and stage progress are visible on the left on laptops. On small screens the panel is placed above the content, not hidden. Reading cards require an acknowledgement; questions require an attempted response, not a perfect answer. Coding cards require a run or test attempt. Written answers are saved for teacher review, not keyword-marked. A failed run/test does not trap the student. The extension can be left using **Go to Plenary**, without being recorded as completed. Revisiting a card is supported; work is retained.

At laptop widths the workspace fits the browser height: Back and Next stay visible and only the current card scrolls if it needs more space. Test details open in a dialog rather than expanding the teaching card. Select Stop before leaving an active Python run, resetting or importing a backup.

Suggested pacing: briefing 4 minutes; Do Now 6; KSU readiness 3; Main Task 1 15; Crew Break 2; Main Task 2 15; pit stop 3; Go Further 6; plenary 4; export 2. Early completers can begin the challenge ladder sooner and continue through its levels. The games are short breaks, not replacements for extension work.

## Python lab

The local Pyodide runtime executes CPython, not a regex-based Python imitation. CodeMirror provides highlighting, line numbers, auto-indent, bracket matching, undo/redo, completion, find/replace and editor font controls. Run (F5 or Ctrl/Command+Enter), Stop, syntax check, `.py` open/download, console inspection and expanded view are included. This is IDLE-inspired, not the desktop IDLE application.

`input()` appears inline after its prompt in the shell. Enter submits; an Enter button supports touch. The shell supports expressions and multiline commands; Shift+Enter adds another line. Running a file resets the namespace. Shell commands after a run retain that run's variables. Restart or Stop terminates the worker and resets its namespace while keeping code. Clearing the display does not clear variables.

Browser stdin is implemented by an AST adapter: direct `input()` calls in the main program are awaited without changing strings, comments or line numbers. **Input inside user-defined functions and aliases of input are outside this lesson's adapter scope.** The adapter rejects function-contained input with a clear message. These lesson tasks use top-level input; normal functions that do not call input still work. Standard browser limitations apply: no native desktop GUI, device connection or direct access to local folders. No extra Pyodide packages are automatically installed. `time.sleep` is not needed for this lesson; the printed countdown does not represent elapsed seconds.

Trace replay displays actual recorded states **before** an executed line. It is not a live step debugger or a prediction animation. Up to 400 trace events and 16 simple variables per event are recorded. Tests use a fresh namespace for each case. Countdown/target tests replace the first assignment to `seconds` or `target` in an in-memory AST; this is labelled in the report and never overwrites the student's code. Output and use of a while loop are checked; passing tests is evidence, not proof that every possible implementation is correct.

The launch and abort upgrades also check that a second `while` exists for the countdown. Test comparison ignores trailing whitespace, not differences in required output words or case. A changed editor version keeps earlier results visibly labelled as earlier; Test checks the new version.

Execution is interrupted after eight seconds of active execution or excessive output. Waiting for a student's console input pauses the execution watchdog. An interruption is reported as a safety limit, not an automatic proof of an infinite loop. Students can Stop themselves at any time. Do not require students to deliberately run an unsafe loop; predict first.

## Saving, backup and privacy

Browser localStorage saves identity, language, current card, responses, submitted corrections, code, run transcripts, test results, reflection and progress. Each name/class combination has a separate key. Teacher work is separate. Reusing a shared browser may expose the previous student's identity through Resume; select your own details or reset. Do not use private browsing for long-term work.

The review page accepts up to three screenshot images by file upload or clipboard paste, compressed to a maximum dimension of 1600 pixels and stored in IndexedDB. Screenshots are supplementary; code and test results are already evidence. Avoid faces or other students' data. Storage is on the device, not in the app folder, and can be cleared by the browser or school management policies.

Work tools → **Backup progress** downloads a JSON file, including compressed images. **Import backup** validates lesson/version and confirms before restoring responses and images. Keep the backup when moving to another device. Reset requires confirmation and deletes the active student's progress and evidence; it cannot restore data without a backup. Save failures are visible. Nothing is sent to a teacher or external service automatically.

## PDF and Teams

Export PDF is available at any time. Partial reports explicitly mark unfinished stages and distinguish submitted attempts from test success. The report contains learning information, student answers, prior submissions, code, runs, input/output transcripts, test cases/results, reflection and uploaded evidence. Client-side canvas text rendering supports English and the device's Chinese/Korean fonts; jsPDF creates A4 pages. This makes the PDF readable but its text is rasterised rather than selectable/searchable. Browser print is a text-based alternative.

The filename includes Year8, class, student name and Week7_Theory. **Print report** opens the browser's print dialogue; select Save as PDF if supported. Printing does not verify that a file was actually saved. After either export method, a guidance dialog explains downloads and Teams attachment/Turn in. The large checkbox is a student's own confirmation, not an integration with Teams. Only then does the Crew Lounge appear for normal students.

The default instruction is **Week 7 Theory**. Timetable shifts can change the module title; update the visible wording in `index.html`, `app.js` and `report.js` before deployment if needed. Nothing has been published to GitHub or posted to Teams by creating this package.

## Games and accessibility

Reactor Overdrive, Remember the Signal and Connect the Wires are short, ungraded breaks. No written response is required and games never gate lesson navigation. Reactor Overdrive starts a ten-second round on the first click/tap or individual Space/Enter press. It shows clicks, remaining time and CPS (clicks ÷ elapsed seconds while playing; clicks ÷ 10 in the final result). Up to three timed rounds per visit encourage a short break. The student's personal best is saved with their own lesson data and JSON backup, not shown in the assessment report or a leaderboard. Mouse and keyboard scores are not compared across students. Untimed ten-tap practice is available without a speed score. Holding a key does not add clicks; completed rounds stop accepting taps. A round is cancelled without updating a best when the tab is hidden, the mode changes, or the student leaves the card. Returning to the lesson is always available.

Sound is **off by default on every visit**. A visible Sound on/off button enables gentle synthesised tap blips, rising charge tones, final-three-second beeps, a short launch whoosh and a personal-best chime. `reactor-game.js` uses the browser's Web Audio API locally, with no audio downloads or CDN. Sound begins only after user interaction, can be muted instantly, and is stopped/released when leaving the game. Unsupported or blocked audio falls back to silent play. Audio API references: [AudioContext.resume](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/resume), [OscillatorNode](https://developer.mozilla.org/en-US/docs/Web/API/OscillatorNode). There are no flashing effects; reduced-motion settings remove the ring/crew/ship animation. Memory and matching games remain untimed. Core editor behaviour is separate from game mechanics.

All controls use text labels and visible focus states. CodeMirror can be left using Escape. Reduced-motion settings disable transitions. External links in the source notes are documentation, not a required student journey. Original scalable artwork is in `assets/crew.svg` and `assets/ship.svg`; replace those files with the same names to change the visuals.

## Assessment and limitations

Students can progress after an unsuccessful attempt so feedback and teacher help are available. This deliberately avoids earlier strict-language blockers. The completion count describes **submitted attempts**, not grades. Review code, test coverage and the learner's explanation when judging understanding. KSU checks and learning phases are self-reports, not automatic ability diagnoses. Codes and output strings should remain unchanged when writing bilingual explanations. A Mandarin/Korean-speaking colleague should review translated teaching guidance before use.

See `TESTING.md` for the verification performed and `SOURCES.md` for curriculum/runtime references.
