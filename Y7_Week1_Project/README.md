# Year 7 Computer Science — Term 1, Week 1 Project

**From Blocks to Text: Create a Wayfinding Tile**  
Microsoft Teams assignment: **Week 1 Project**

This is a self-directed, static 60-minute lesson app. It combines Scratch, an in-browser Python Turtle editor, two school Learning Pit Stops, evidence capture and a PDF report. No database, account, build step or CDN is required.

## Open and host

Keep the extracted folder structure intact. Host the whole folder on a school web server, GitHub Pages, Netlify, Vercel or another static host. For local testing, serve the folder through a simple static web server and open its `index.html` route.

Direct `file://` opening is not recommended. Browser security can block the Python libraries, IndexedDB screenshots, canvas evidence and PDF features.

## Student journey

1. Enter full name and class.
2. Choose **English** or **English + language support**.
3. Read the project, privacy guidance and three required filenames.
4. Complete the starter and Learning Pit Stop 1.
5. Build and modify the same square in Scratch and Python Turtle.
6. Choose a Guided, Core or Independent pathway and create one clear wayfinding sign.
7. Complete the optional extension if time remains.
8. Use Learning Pit Stop 2, complete the plenary, preview/export the PDF and follow the Teams submission checklist.

Core lesson time totals 60 minutes. The extension is optional and never blocks later core sections.

## Teacher access

Enter `teacher` as the name; class is optional. All pages unlock immediately and teacher work uses separate browser storage. There is no visible teacher switch or teacher control panel.

## Progress and missing-task guidance

Answers and code are saved in `localStorage`; images are saved in IndexedDB. A student can re-enter the same name and class and choose **Resume Previous Work**.

Core sections unlock in sequence. If **Next** is selected before a section is complete, the app lists each missing task. **Go to task** opens the correct lesson card, scrolls to the required response and highlights it. Students are never expected to guess which checkbox or answer is blocking progress.

Meaningful tracked evidence includes:

- saved responses and quiz checks/attempt counts;
- Scratch and Python predictions;
- uploaded Scratch screenshot;
- Python code, run count, output and captured evidence;
- selected support pathway;
- one Predict → Run → Improve test;
- both Learning Pit Stop choices, evidence and next actions;
- plenary explanations and submission confirmations.

The app has no central teacher dashboard. The PDF, `.sb3` and `.py` files uploaded to Teams are the official evidence.

## Language and vocabulary support

English remains visible for every student. Optional short summaries and vocabulary support are available in Bahasa Melayu, Simplified Chinese, Korean and Arabic. Students can change the setting from **Language help**. **Vocabulary** opens English definitions and, when selected, the support-language meaning.

Translations support access to the English Computer Science vocabulary; they do not translate or write student answers.

## Python Turtle environment

The local Python workspace uses:

- CodeMirror 5 for line numbers, syntax highlighting, indentation and editing;
- Skulpt with canvas-backed Turtle for Python execution;
- `python/python-runner.js` for Run, Stop, Reset, Clear Output, `.py` open/download, full screen, error messages, run counts and evidence capture.

The workspace supports the lesson commands including `forward`, `backward`, `left`, `right`, `penup`, `pendown`, `goto`, `pensize`, `speed`, `shape` and `done`. A 20-second execution limit protects the page from runaway programs.

## PDF and Teams submission

The client-side PDF includes student details, WAGBA, Knowledge, Skills, Understanding, quiz evidence, both pit stops, Scratch evidence, Python code/output, test/improvement evidence, optional extension work and plenary responses. A print/save fallback is included.

Students are instructed to upload:

1. PDF evidence report;
2. Scratch `.sb3` file;
3. final Python `.py` file;

to the Teams assignment **Week 1 Project**.

## Main configuration

Edit `lesson-data.js` to change the Scratch URL, Teams assignment, WAGBA, K/S/U, questions, feedback, multilingual support, pathway code, extension choices and submission wording. Completion and missing-task rules are in `app.js`.

## Browser notes

Use a recent version of Chrome, Edge, Firefox or Safari. Avoid private/incognito windows because local progress can be cleared when the window closes. Clipboard screenshot paste varies by browser; **Choose image** is always available. Scratch itself requires internet access unless the configured URL is replaced with a school-hosted/offline editor.

## File structure

```text
year7-week1-project/
├── index.html
├── styles.css
├── app.js
├── lesson-data.js
├── report.js
├── README.md
├── assets/
├── python/
└── libraries/
```
