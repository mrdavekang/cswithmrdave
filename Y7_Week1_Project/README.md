# Year 7 Computer Science — Term 1, Week 1 Project

**From Blocks to Text: Create a Wayfinding Tile**
Unit: Computational Thinking and Python Turtle · Microsoft Teams assignment: *Week 1 Project*

A self-contained, self-directed 60-minute project lesson web app. It runs entirely in the
browser: no server-side code, no database, no accounts, no build step, no CDN.

---

## 1. Extracting the ZIP

1. Save `year7-week1-project.zip` somewhere sensible (a network share, the school web server,
   or your own machine).
2. Right-click ▸ **Extract All** (Windows) or double-click (macOS).
3. You will get a folder called `year7-week1-project` containing `index.html` and the
   supporting folders. Keep the folder structure exactly as it is — the app loads its
   libraries from `python/` and `libraries/`.

Approximate size: **~2.2 MB extracted, ~0.6 MB zipped** (most of it is the Python engine).

## 2. Hosting the app

Any static web host works. Options, easiest first:

| Method | How |
| --- | --- |
| School web server / SharePoint site / IIS | Copy the whole folder into the web root and give students the URL to `index.html`. |
| Local test server (Python) | `cd year7-week1-project` then `python -m http.server 8000` and open `http://localhost:8000/`. |
| Local test server (Node) | `npx serve year7-week1-project` |
| Learning platform | Upload as a static site / SCORM-free web resource; students open `index.html`. |

### Why a web server is normally required

Opening `index.html` directly with a `file://` path works in some browsers but **is not
recommended**. Browsers apply stricter security rules to `file://` pages, which can block:

* IndexedDB (screenshots, sketches and captured evidence),
* reading the bundled Python library files,
* some canvas image exports used for evidence capture and the PDF.

If you must run offline without a server, use Firefox (most permissive) and test first.
A one-line `python -m http.server` is the reliable option.

## 3. The student route

1. Student opens the page and enters **full name** and **class** — both are required.
2. **Start Project** begins the lesson. **Resume Previous Work** appears when saved work is
   found on that computer for that name + class.
3. The journey is: Welcome and setup → Starter → Main Activity 1 → Main Activity 2 →
   Extension (optional) → Plenary → Evidence review → Export and submission.
4. Sections unlock progressively. Opening a section does not complete it; the student must
   submit meaningful work. The extension never blocks the plenary.
5. The student exports the PDF, then uploads three files to Microsoft Teams:
   PDF report, Scratch `.sb3`, Python `.py`.

## 4. Teacher access

Enter **`teacher`** as the name (any capitalisation). No class is required.

* Every section unlocks immediately, so you can walk through or demonstrate any activity.
* Teacher work is saved under a **separate storage key** (`…:__teacher__`) and never touches
  a student's saved progress.
* There is deliberately **no visible teacher panel, button or switch** in the interface.

To disable teacher access, delete the `isTeacher` branch in `recordKey()` / `startSession()`
in `app.js`, or change the trigger word there.

## 5. How progress tracking works

This is a **static app**, so all tracking is local to the student's browser and device.
There is no central dashboard and no way for the app to report to you automatically —
**the PDF and the submitted project files are the official evidence.**

* `localStorage` — name, class, every written answer, every checkbox, quiz attempts,
  section completion, current section, Python code.
  Key: `y7w1:<lessonId>:<class>::<name>` (teacher: `y7w1:<lessonId>:__teacher__`).
* `IndexedDB` (database `y7w1-evidence`) — screenshots, planning sketches, Turtle canvas
  images and captured evidence images, keyed by the same student key.
* Several students can share one computer: each name + class combination gets its own record.
* Saving is automatic (debounced). The header shows a **Saved hh:mm** indicator.
* After a refresh or crash, the student re-enters the same name and class and chooses
  **Resume Previous Work**; images are restored from IndexedDB.

### Resetting progress

* **One student:** enter the same name and class and choose **Start Project** (not Resume) —
  the app asks for confirmation, then clears that student's answers and images.
* **A whole shared computer:** clear site data for the page in browser settings
  (Chrome/Edge: ⋮ ▸ Settings ▸ Privacy ▸ Site settings ▸ View permissions and data stored
  across sites), which removes both localStorage and IndexedDB.

## 6. How the Python runtime works

* **Skulpt** (`python/skulpt/skulpt.min.js` + `python/skulpt-turtle/skulpt-stdlib.js`) compiles
  Python 3 to JavaScript in the browser and provides the `turtle` module, drawing onto
  canvases inside the page.
* **CodeMirror 5** (`python/codemirror/`) provides syntax highlighting, line numbers,
  auto-indent, bracket/quote matching and Tab handling.
* `python/python-runner.js` wires them together: Run / Stop / Reset / Clear / Copy /
  Download `.py` / Open `.py` / full screen / Ctrl + Enter, console output, error messages
  with line numbers, automatic code saving, and evidence capture.
* `t.done()` is a no-op in Skulpt's turtle, so the lesson code runs unchanged and simply
  finishes. `t.shape("turtle")`, `t.speed()`, `t.pensize()`, `t.forward()`, `t.right()`,
  `t.left()`, `t.penup()`, `t.pendown()`, `t.goto()` and friends all work.
* **Runaway programs:** an execution limit (default 20 seconds — see
  `CONFIG.PYTHON_EXEC_LIMIT_SECONDS` in `lesson-data.js`) stops loops that never end, and the
  **Stop** button interrupts at the next drawing step. The page does not freeze.
* A standard Pyodide install does **not** give you the Tkinter turtle window in a browser,
  which is why Skulpt's canvas-backed turtle is used here.

## 7. Changing the lesson

Almost everything is data-driven. Open **`lesson-data.js`**:

* `CONFIG.SCRATCH_EDITOR_URL` — the Scratch editor link used by the **Open Scratch Editor**
  button. Replace it with your school's hosted or offline Scratch if needed.
* `CONFIG.TEAMS_ASSIGNMENT_NAME` — the Microsoft Teams assignment name shown throughout.
* `CONFIG.LESSON_ID` — change this when you reuse the app for another lesson so that new
  progress records are created.
* `CONFIG.PYTHON_EXEC_LIMIT_SECONDS`, `CONFIG.MIN_ANSWER_LENGTH`, `CONFIG.YEAR_GROUP`.
* `LESSON` — title, unit, WAGBA, knowledge, skills, understanding, keywords, challenge,
  folder structure, submission files.
* `SECTIONS` — order, titles, recommended times, and which sections are optional.
* The question arrays (`STARTER_QUESTIONS`, `SCRATCH_PREDICTIONS`, `PYTHON_PREDICTIONS`,
  `PLANNING_QUESTIONS`, `EXPLANATION_QUESTIONS`, `EXIT_TICKET`, …) — `answer` is the index of
  the correct option; use `answer: null` for an ungraded choice.
* Code shown to students: `PYTHON_SQUARE_CODE`, `WAYFINDING_STARTER_CODE`,
  `EXTENSION_STARTER_CODE`, `SCRATCH_SQUARE_BLOCKS`.
* `WORKED_EXAMPLE` — the finished "arrow pointing right" program shown in Main Activity 2
  after planning, with **Copy example** and **Load into the editor** buttons and a list of
  ways students must change it. Collapsed by default; delete this constant's card by removing
  the `codeHelpersCard()` call in `app.js` if you would rather students start from nothing.
* `CODE_HELPERS` — the small snippets (move without drawing, draw a line, turn a corner,
  go back over a line, one side of an arrow head, thicker pen, set a start position). Each has
  **Copy** and **Insert into editor**; inserting drops the code at the cursor, or after the
  "# Add your sequence below" comment if the student has not clicked into the editor yet.

Completion rules live in `RULES` near the top of the section logic in `app.js` if you want to
make a section stricter or more relaxed.

## 8. Filenames

Generated from the student's class and first name, for example for Aisha Khan in 7T:

```
7T_Aisha_W1_ScratchSquare_v01.sb3
7T_Aisha_W1_TurtleSquare_v01.py
7T_Aisha_W1_WayfindingTile_v01.py
7T_Aisha_W1_WayfindingTile_v02.py   (extension)
Year7_7T_Aisha_Week1_Project.pdf
```

## 9. How PDF generation works

* `report.js` builds the report with **jsPDF** (`libraries/jspdf/`), entirely client-side.
* Black-and-white A4 layout, Helvetica for text and **Courier for all Python code**, with
  page-break handling so code blocks and images are never cut off, plus a footer on every page
  showing the student's name, class and page number.
* Students can **Preview report** (rendered in an iframe) before downloading.
* **Print / Save as PDF (fallback)** builds a print-friendly HTML version and calls
  `window.print()`, for browsers where the jsPDF download is blocked.
* `libraries/html2canvas/` and `libraries/zip/` (JSZip) are bundled for offline use by
  extensions to the app; the core lesson does not depend on them.

## 10. How `.py` export works

Each editor has **Download .py**, which creates the file from the current editor contents with
the suggested filename via a Blob download — no server involved. **Open .py** loads a file back
into the editor, so a student can continue work from a saved file. The export page also offers a
one-click re-download of the final wayfinding tile code.

## 11. Known browser limitations

* **Supported:** recent Chrome, Edge, Firefox and Safari on laptops and tablets. Tested layouts:
  1366 × 768, 1920 × 1080, tablet landscape and tablet portrait.
* **Internet Explorer is not supported.**
* **Clipboard paste of screenshots** (Ctrl + V into the evidence box) works in Chrome, Edge and
  Safari; Firefox may require the *Choose image* button instead. Drag-and-drop always works.
* **Private/Incognito windows** may clear localStorage and IndexedDB when the window closes —
  students would lose saved progress, so avoid them.
* If a school policy blocks IndexedDB, images fall back to `sessionStorage` for the session only.
* Very long Turtle animations at `speed(1)` can reach the 20-second execution limit; tell
  students to use a faster speed, or raise `PYTHON_EXEC_LIMIT_SECONDS`.
* `file://` usage is discouraged — see section 2.

## 12. File structure

```
year7-week1-project/
├── index.html                  page shell: landing, lesson frame, learning panel, dialogs
├── styles.css                  black-and-white theme, print styles, responsive layout
├── app.js                      state, storage, navigation, all eight sections, review
├── lesson-data.js              all lesson content and configuration
├── report.js                   jsPDF report + print fallback
├── README.md
├── assets/
│   ├── images/                 wayfinding example symbols (SVG)
│   ├── icons/                  favicon
│   └── evidence-placeholders/  example of a good Scratch screenshot
├── python/
│   ├── codemirror/             editor (CodeMirror 5, MIT)
│   ├── skulpt/                 Python engine (Skulpt, MIT)
│   ├── skulpt-turtle/          Skulpt standard library incl. turtle (MIT)
│   └── python-runner.js        the in-app IDE
└── libraries/
    ├── jspdf/                  PDF generation (MIT)
    ├── html2canvas/            optional DOM capture (MIT)
    └── zip/                    JSZip (MIT/GPL dual)
```

All bundled libraries are open source and are included locally so the lesson works without
internet access (except the Scratch editor link itself, which opens scratch.mit.edu).

## 13. Teacher notes (do not show to students)

* The student interface deliberately contains no teacher instructions, marking guidance or
  answer keys beyond the feedback students see after submitting an attempt.
* The app cannot verify that the Scratch `.sb3` file was downloaded, so students tick a
  confirmation box; check the Teams submission as usual.
* Suggested checks when marking: does the PDF contain the student's name and class, a Scratch
  screenshot, Python code, a Turtle output image, two tests and one improvement?
