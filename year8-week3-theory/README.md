# Year 8 · Term 1 Week 3 Theory

Smart Badge: Remembering and Changing Information. Based on the Year 8 Scheme of Learning: variables, assignment, strings, integers, meaningful identifiers and trace-table evidence. This is a theory lesson, not the micro:bit hardware session.

## Open or host

Extract the ZIP and open `index.html`. Keep all folders together. It also works as a static site on GitHub Pages, Netlify, Vercel or a school web server. Upload the files in this folder, including assets and libraries. No accounts, server, installation, database service or paid API are required. A separately provided private Sites preview is for the teacher only; the downloadable folder is the student-hostable version.

## Student entry and lesson order

Enter full name, class and optional English + Mandarin, Korean or Bahasa Melayu support. On returning, choose Resume. The lesson follows: Do Now → Types of Learning → Main Task 1 (read, trace, repair) → Main Task 2 (welcome points) → **Extension** → Learning Pitstop → Plenary → Review.

Extension is deliberately visible BEFORE plenary. Choose a level, finish and choose another if time allows. It is optional; Next continues to the Pitstop without a passing-test requirement. The school guides are supplementary and all essential instructions appear as text.

## Teacher testing

Enter `teacher` as the name (case-insensitive). Class is optional. All cards unlock and testing progress is stored separately. Alternatively open `index.html?teacher=1`. This is an inspection shortcut, not secure authentication. No teacher controls are shown in the student route.

## Teaching notes and 60-minute timing

- Do Now: 8 minutes. Retrieve output, code vs plan, and text vs numbers.
- Types of Learning: 3 minutes. Choose one actionable strategy.
- Main Task 1: 18 minutes. Short explanations, worked example, guided trace and repair challenge.
- Main Task 2: 21 minutes, including early-finisher extension time. Update the existing score and test different starting values.
- Learning Pitstop: 4 minutes. Current phase, evidence and next action.
- Plenary: 6 minutes. Individual answers before next week's checkpoint.

Do not turn the types/phases into fixed ability labels. Oral explanation can supplement short writing. Extensions cover a useful message, adjustable bonus and copied value. A4 layout: My code / Predicted output / What I changed or learned.

KSU and WAGBA are always accessible through the header. The full-name and class entry requirement is the only mandatory gate. Moving forwards opens the next card but DOES NOT imply successful learning. Status distinguishes not attempted, saved responses, code edited, attempted/review needed and tests passed. Explanations are not auto-marked by keywords.

## Python runner and tests

Skulpt is bundled locally; the app does not load a runner from a CDN. It executes Python 3-style assignments, strings, numbers, simple arithmetic and print(). For this short lesson an AST allow-list deliberately excludes imports, functions, loops and other features. Error messages state the lesson scope; progress is never locked by a runner error. Do not paste MakeCode or micro:bit MicroPython display commands here: these are ordinary console Python examples.

Tests parse code, execute it and vary the initial assignments. Keep one instruction per line and the task's named starting variables. Ordinary spacing, single/double quotes and equivalent arithmetic forms are accepted. The repair task is tested with NOVA and ECHO to catch a fixed printout. The score task checks starting scores 2, 5 and 0, including the updated variable value. The bonus task varies score and bonus. Blank lines at the edges of output and surrounding whitespace are ignored; meaningful output and order still matter.

The tests are formative, not a secure examination system or proof of complete understanding. The copied-value extension and explanations require teacher review. Record an individual trace/explanation even if students discuss in pairs.

## Saving, backups and privacy

All student data stays in this browser. Lightweight progress is saved to localStorage immediately. IndexedDB stores the full session, including compressed evidence images. No names, answers or images are uploaded to a server. Save status reports storage failures. Private browsing, cleared data or a changed site address can remove access to saved work. Use Save & export → Download JSON backup before switching device or browser.

Import validates the lesson and version, asks before replacement and restores text, code, results, histories and evidence. Keep a backup before starting another student's session on a shared browser. Teacher storage is separate. Reset asks for confirmation; recovery requires an existing JSON backup. A backup contains personal work and should not be shared publicly.

Uploads accept PNG/JPEG/WebP, up to 10 MB each and six images per session. Images are resized to 1500 pixels maximum and compressed. Students can paste screenshots into a labelled paste area or select a file. On iPad, file upload is the fallback when clipboard images are not exposed. Photograph only the work, not faces. If IndexedDB is unavailable, text can still save locally but images need a JSON backup before leaving.

## PDF and Teams

Export current progress at any time from Save & export, or use the review card. The report includes identity, dates, consistent learning information, all core answers (unanswered items marked Not completed), code, outputs, test results, hints, reflection, evidence images and a chronological attempts/corrections appendix. Optional extensions appear only when attempted. It is a marking report, not a grade.

Filename: `Year8_Class_FullName_T1W3_Theory.pdf`. Unicode letters are preserved; unsafe punctuation is replaced. The locally bundled jsPDF library creates A4 pages. Report body text is drawn at readable resolution to support Mandarin/Korean and preserve code; those body regions are images and are not searchable/selectable text. Headers and page numbers are PDF text. Use the print fallback for selectable text and screen-reader-friendly browser content. Browser fonts must support the student's writing system.

If downloading is blocked, choose Print / Save as PDF. The app prepares a complete print report and calls window.print(). Browser print settings control the final filename and headers/footers. After export, students are reminded to upload the **PDF** to the Microsoft Teams Assignment **02 Submit your Week 3 Theory assignment here**. The app does not submit to Teams automatically.

## Language and access

Language support is available at entry and throughout. It consists of translated task guidance plus an English/Mandarin/Korean/Bahasa glossary, not a full translation of every dynamic test message. English code and task vocabulary remain visible. Students may draft a short explanation in their stronger language. Review school terminology/translations with language staff as appropriate.

Controls support keyboard access, visible focus, labelled fields, reduced motion and responsive layouts. No drag-and-drop interaction is required. The app uses locally installed Raleway and a monospace code font, with system fallbacks for other scripts. Missing school images fall back to written guidance.

## References and local assets

- Year 8 SoL, Lesson-Level SoL row 7 and Weekly Curriculum row 7.
- Helsinki Python MOOC: https://programming-26.mooc.fi/part-1/3-more-about-variables/ (exercise-format inspiration; these Smart Badge challenges are original adaptations, not an official Helsinki course).
- Raspberry Pi Foundation pedagogy: https://www.raspberrypi.org/teach/pedagogy
- Teach Computing: https://teachcomputing.org/curriculum/key-stage-3/introduction-to-python-programming

`assets/images/types-of-learning.png` and `learning-pitstop.png` reuse the school-provided guides. Replace with like-named images if necessary. `assets/fonts/raleway.ttf` is the installed Raleway font. Local third-party libraries are in `libraries`; see `LIBRARIES.md`.

The optional read-only WebMCP tool `read_lesson_progress` is feature-detected. It exposes current card and status only, not student answers or completion mutations. It is not required for the lesson to run. A supported WebMCP browser context was unavailable during validation, so that optional integration was not verified.

## Validation completed

Chrome tests covered blank name/class validation, entry replacing the landing screen, teacher-name and URL shortcuts, separate testing storage, incorrect answers without navigation locks, trace answers, variable-based code tests, equivalent spacing/quotes/augmented assignment, rejection of fixed-output and comment-only solutions, saving and refresh, uploaded images, pasted screenshots, JSON export/import with image restoration, reset cancellation/confirmation, missing images, partial/full PDF export, Unicode filename/content, Teams wording and the print fallback. Layouts were checked at 1366×768, 1920×1080, 1024×768, 768×1024 and 390×844. Local file opening and keyboard focus were also checked. Actual iPad Safari was not available; test it on a managed school iPad before class, particularly download, storage and clipboard policies.
