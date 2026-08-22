# Year 9 Week 1 Theory — Code Quest

A static, GitHub Pages-ready learning app for the first Year 9 Computer Science theory lesson.

## Learning design

The redesign prioritises teaching before checking. Every core stage follows a short cycle:

1. Read a clear explanation.
2. Inspect a visual or worked example.
3. Complete guided practice.
4. Attempt a short independent check.
5. Receive feedback and improve.

The 60-minute journey is:

- Do Now — one model, two contextual choices and one evidence-based response (8 minutes)
- Plan → Program — shuffled representations and a charity-points improvement-cycle investigation (15 minutes)
- Trace — worked example, guided table and three compulsory traces that record intermediate values (17 minutes; Levels 4–5 are stretch)
- Debug — taught syntax structure, three evidence types and controlled one-change testing (13 minutes)
- Extension Lab — optional, levelled choice of quiz, flashcards/paper, algorithm design or Python
- Plenary — retrieval, confidence and one specific next action (7 minutes)
- Evidence Report — PDF/ZIP export and Microsoft Teams instructions

## Language support

Students choose support on the starting page and can change it during the lesson:

- English only
- Plain English
- Bahasa Melayu
- Simplified Chinese
- Korean

English Computer Science terminology remains visible. Support adds bilingual or simplified explanations, question guidance, sentence frames and vocabulary definitions. All students complete the same core objectives.

The vocabulary drawer also includes a read-aloud control using the browser's available speech voices.

## Teacher preview

Two hidden methods unlock every page:

- Open index.html?teacher=1
- Enter teacher as the name on the normal starting page

The student-facing entry page does not advertise either method. Teacher preview uses separate browser storage.

## Saving and evidence

The app saves locally in the browser, including:

- name, class and language-support choice
- every selection and written response
- attempts, exact correction history, feedback scores and completion times
- confidence ratings and next target
- Python source code, latest output and run count
- optional compressed image evidence
- selected extension routes and meaningful attempts only; untouched or empty routes are excluded from the review and PDF

The final report is rendered to canvas before being placed in the PDF. This preserves multilingual student responses without relying on a downloadable web font.

Students are instructed to upload the PDF to the Microsoft Teams assignment named **Week 1 Theory**.

## Extension Lab

Early completers may choose one or combine several routes:

- Level 1 Quiz Quest — 20 self-marking retrieval checkpoints
- Level 2 Flashcard Forge — four digital cards or paper evidence
- Level 3 Algorithm Architect — a structured-English solution with tests
- Level 4 Python Builder — an edited, tested program with reflection

A route is included in the review and exported report only after the student selects it and records sufficient evidence. An unchecked quiz choice, empty form or untouched Python starter is not included.

## Python Builder

The optional Python editor uses the bundled Ace editor and local Pyodide runtime. Code runs in an ES module Web Worker and does not leave the browser.

Python Builder includes:

- syntax highlighting and line numbers
- interactive input()
- Run and Stop/Restart
- error-line highlighting
- local progress recovery
- code download
- full-screen mode

It must be opened through static hosting. Browsers normally block the module worker and WebAssembly runtime when the page is opened directly through file://.

## Hosting on GitHub Pages

Upload the complete folder without changing its internal structure. No package installation or build command is required.

For a local check, serve the folder through an existing static server and open the resulting HTTP address.

## Important files

- index.html — lesson content and structure
- styles.css — responsive high-contrast theme
- app.js — saving, support, feedback, Python and export logic
- assets/images/ — reviewed lesson visuals
- python/runtime/ — local Python/WebAssembly runtime
- libraries/ — Ace, jsPDF and JSZip

## Reviewed visuals

- code-quest-welcome.png
- problem-scenarios.png
- algorithm-to-program.png
- code-tracing.png
- debugging-cycle.png

The core improvement-cycle visual is built directly into the page and uses the same charity-points scenario as the guided activity, avoiding split attention between unrelated programs.
