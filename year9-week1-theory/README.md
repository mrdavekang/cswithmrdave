# Year 9 Week 1 Theory Web App

## Lesson

**Year group:** Year 9  
**Week:** 1  
**Lesson:** Becoming a Year 9 Computer Scientist  
**Key topic:** Year 9 Computer Science readiness

The app follows the planned Week 1 theory lesson from the Year 9 curriculum map: a low-stakes baseline on Year 8 Python, algorithms and technical vocabulary, followed by AO1/AO2/AO3, file/evidence routines, a genuine browser-based Python workspace, optional extension work and a reflective plenary.

## Open and host

1. Extract the ZIP without changing the folder structure.
2. For static hosting, upload the complete `year9-week1-theory` folder to GitHub Pages, Vercel, Netlify, a school web server, or another static host.
3. Open `index.html` through the hosted URL.

The lesson interface itself does not require a server, database, account, API key, package installation or build step. However, most browsers restrict Web Workers and WebAssembly when a site is opened directly with `file://`. The locally packaged Python runtime therefore works most reliably through static hosting.

**Approximate package size:** 13 MB as a ZIP and 21 MB after extraction. Most of the size is the locally packaged Python/WebAssembly runtime and the four lesson visuals.

For local testing, serve the extracted folder with any simple static server already available on the computer. For example, from inside the folder, Python users can run:

```text
python -m http.server 8000
```

Then open `http://localhost:8000/`.

## Routes

- **Normal student route:** `index.html`
- **Hidden testing route:** `index.html?teacher=1`

The hidden route unlocks every section, uses sample responses and stores data under a separate local-storage key. No teacher controls or teacher-mode labels appear in the student interface.

## Lesson journey

1. Do Now — classify productive and unproductive Computer Science habits.
2. Main Task 1 — AO1/AO2/AO3, class expectations and file routines.
3. Main Task 2 — vocabulary, IPO, code tracing, debugging and programming.
4. Extension — optional early-completer challenge.
5. Plenary — confidence, reflection and algorithm-versus-program explanation.
6. Review — completion warnings, PDF, print fallback and optional submission ZIP.

Core sections unlock progressively. Opening a section does not mark it complete; students must submit meaningful evidence. The extension never blocks the plenary.

## Progress saving

The app saves automatically in browser local storage, including:

- name and class
- current section and completion state
- attempted and corrected answers
- Python source code, run counts and selected output
- test evidence and debugging notes
- optional extension work
- plenary responses and timestamps

Students can refresh or close the page and resume on the same browser profile and device. The reset button in the header asks for confirmation before deleting work.

## Python runtime

> **Runtime fix in this package:** the included Pyodide build requires an ES module Web Worker. The app now starts `python/worker.js` with `{ type: "module" }`; the previous classic-worker launch caused the red **Python failed to load** status.

The ZIP includes a local Pyodide runtime under `python/runtime/`. Student code runs in an ES module Web Worker and is not sent to an external server.

The workspace includes:

- Ace code editor with line numbers, Python highlighting and indentation
- bracket and quote pairing
- cursor position
- Run with `Ctrl+Enter` or `Command+Enter`
- Stop / Restart by terminating and rebuilding the worker
- console output and repeated interactive `input()` prompts
- syntax and runtime errors with line highlighting
- separate task files
- automatic code recovery
- `.py` download, upload and copy controls
- full-screen editor
- visible and hidden behaviour-based checks

The app transforms calls to Python `input()` into an asynchronous browser bridge before running the code in real Python. This allows execution to pause, request one or more values, and continue the same program without sending code away from the device.

An infinite loop cannot permanently freeze the lesson page because Python runs in an isolated worker. The Stop / Restart control terminates that worker.

## PDF and submission bundle

The final PDF is generated locally with jsPDF and contains:

- lesson and student details
- WAGBA, Knowledge, Skills, Understanding and Keywords
- attempted core responses and corrections
- final Python code in a monospaced format
- selected outputs, tests and debugging evidence
- optional extension evidence when attempted
- plenary and completion summary

The filename follows this pattern:

```text
Year9_Class_Name_Week1_Theory.pdf
```

The print-friendly fallback uses the browser print dialog.

The optional submission ZIP contains:

- the PDF
- `debug_task.py`
- `number_challenge.py`
- optional `extension_task.py`
- output log
- metadata JSON

## Images

Lesson images are stored in `assets/images/` and inserted into the relevant lesson stages:

- `starter-successful-cs-habits.png`
- `activity1-think-like-computer-scientist.png`
- `activity2-baseline-challenge.png`
- `plenary-reflection.png`

To replace an image, keep the same filename and aspect ratio where possible. To add a new image, place it in `assets/images/` and reference the relative path in `index.html`. Every image has alt text, preserves its aspect ratio and can be enlarged. A visible fallback appears if an image is missing.

## Local libraries

Essential libraries are packaged locally:

- Ace Editor
- jsPDF
- JSZip
- Pyodide and Python standard library

No CDN is required for lesson functionality.

## Browser and hosting limitations

- Direct `file://` opening will usually block the module worker or WebAssembly files; use static hosting.
- Clipboard access may require HTTPS or a browser permission.
- Upload and download behaviour depends on browser file permissions.
- Large or highly recursive programs may use significant memory.
- Stop / Restart deliberately clears the current Python process but retains saved source code.
- The app uses the local Raleway font when installed and falls back to Segoe UI or Arial; no font files are distributed.

## File structure

```text
year9-week1-theory/
├── index.html
├── styles.css
├── app.js
├── README.md
├── assets/
│   ├── images/
│   ├── icons/
│   └── fonts/
├── python/
│   ├── runtime/
│   ├── worker.js
│   └── task-files/
├── libraries/
│   ├── ace/
│   ├── jspdf.umd.min.js
│   └── jszip.min.js
└── student-files/
```

## Testing checklist completed during packaging

- HTML, JavaScript and worker syntax checks
- student and teacher storage separation
- required student-name and class fields
- progressive section unlocking
- optional extension behaviour
- response persistence and reset confirmation
- image paths and missing-image fallback
- local library presence
- genuine local Python runtime loading and execution
- asynchronous Python input bridge
- syntax and runtime error handling logic
- `.py` file controls
- PDF and submission-bundle code paths
- Microsoft Teams wording for **Week 1 Theory**
- responsive CSS breakpoints for laptop and tablet dimensions

The local automated browser in the build environment was restricted by administrator policy, so final visual smoke testing should also be performed on the intended school browser after upload.
