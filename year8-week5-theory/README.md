# Year 8 Week 5 Theory — Choose the path

Selection and comparison operators: predict and explain program paths. Based on the supplied 16-page `Year 8 Week 5 Theory.pdf` sketch. This is new learning, not a review of a checkpoint that has not taken place.

## Open or host

Extract the complete ZIP and open `index.html`. Keep the supporting files alongside it. No installation, student account, API key, database or build step is needed.

For dependable school use, upload the whole folder to GitHub Pages, Netlify or an ordinary static web host. The app and Python libraries have no CDN dependency. The two external micro:bit editor links are reference links, not required for the lesson. No hardware is needed today.

The local-file fallback is implemented but was not browser-verified because the testing browser blocked file URLs. Local storage, downloads and local scripts can also be restricted by school/device policy. Test on a student device before the lesson; prefer a hosted HTTPS link on iPad.

## Student entry and teacher preview

Students enter a name and class, choose language support, then start. Resume saved work appears when a session is available.

Enter `teacher` as the name (class may be blank), or open `index.html?teacher=1`, for a separate testing storage area. Teacher preview is a convenience, not secure authentication. Student navigation also deliberately has no correctness locks.

## Lesson route

One active learning card is shown at a time. The left panel keeps WAGBA, Knowledge, Skills, Understanding and progress visible on laptop/tablet widths. The narrow-screen layout keeps the goals expanded above the cards.

| Stage | Suggested time | Focus |
|---|---:|---|
| Read first | 4 min | Smart Badge purpose and comparison result |
| Do Now | 6 min | Two core predictions and one Parsons ordering task |
| Types of Learning | 4 min | Starting-point K/S/U reflection |
| Operator reference | 3 min | Six operators and `=` versus `==` |
| Main Task 1 | 10 min | Operator meanings, boundaries, worked trace, prediction |
| Syntax reading | 3 min | Colons, indentation and branch membership |
| Main Task 2 | 16 min | Arrange, debug a boundary, use console input |
| Extension | If time | Three increasingly demanding programs |
| Learning Pit Stop | 4 min | Evidence of change in K/S/U and next practice |
| Plenary | 5 min | Operator recall and independent explanation |
| Review and PDF | 5 min | Check evidence, export, submit to Teams |

There are 48 cards in the full bank, including review. There are 19 core learning cards plus review. Continue always follows all ten Do Now questions in order, including its extra practice, before Types of Learning. Other stages retain the shorter core route, with extension before the Pit Stop. Do not expect students to finish the whole bank in 60 minutes. For a six-minute starter, the teacher may direct students to move on using the lesson menu after the core questions. Use the stage/card selectors or All practice for the remaining questions.

All five starter MCQs and five starter Parsons tasks, the additional Main Task 1 conditions and predictions, three Main Task 2 Parsons tasks, two indentation predictions, two debugging tasks, two scenario Parsons tasks, three programming challenges and three extensions are retained. Extension is before reflection/plenary to respect the established lesson sequence.

Progress means an attempt was recorded, not mastery. A wrong answer never traps a student. Checks retain earlier attempts and corrections. Open explanations and reflections need teacher review; automated output checks do not establish full understanding.

## Python console

Students edit `main.py` on the card, click Run code and type immediately after the prompt inside the dark console. Enter submits that response. Multiple prompts are supported; the program pauses while waiting. Prompt text, typed responses, printed output, errors and code snapshots are included in saved runs and PDF evidence.

Tab inserts four spaces in the editor; Escape then Tab leaves it. Run, Stop, Hint, Reset starter and Test examples are provided. The sample tests use the task's listed values. In fixed-score tasks they substitute the first `score = ...` line. Passing these examples does not prove correctness for all inputs or prove that selection was used: teachers should inspect the code and ask students to explain a branch.

The bundled Skulpt runtime implements a classroom Python 3 subset, not full CPython. This lesson uses assignment, comparisons, `if`/`else`, `print`, `input`, strings and integer conversion. It does not run MakeCode or micro:bit hardware commands. No packages can be installed. Hosted execution runs in a Web Worker; runtime and output limits stop runaway code. A local-file fallback runs on the main thread and may pause the interface briefly for a tight loop until the execution limit is reached.

The input conversion `int(input(...))` is supplied and explained, rather than assumed prior knowledge. Students should enter whole numbers in numeric tasks; invalid text produces an error they can correct.

## Saving, backup and images

Answers, selected choices, current code, last ordering, checks, reflections, runs and images are stored in localStorage on this browser/origin. They are not sent to a server. Merely editing an answer does not create a separate snapshot of every keystroke: current drafts are saved and submitted checks/runs preserve the history.

Use Backup to download one JSON file. Import backup validates the lesson/version and asks before replacing current work. Keep backups when changing device, browser or URL. Clear-browser-data operations can erase local work. On shared computers, export the student's backup before starting a new session.

Evidence uploads accept PNG, JPEG or WebP up to 12 MB, resized to a maximum 1100 pixels and compressed. Two images per card; a conservative total evidence limit protects browser storage. Paste a copied screenshot into a lesson page as an alternative. Include only work, not faces or personal messages. The app cannot write uploads into its own assets folder.

Save failures are shown explicitly. Download a backup if browser storage is full. JSON import is limited to 8 MB.

## Languages and accessibility

English remains the teaching language, with optional Mandarin, Korean or Bahasa Melayu glossary, guidance and sentence frames. These are scaffolds, not complete translations of every question. Students may write explanations in their preferred language. A fluent educator should review terminology for local classroom usage.

Controls use labels, keyboard access and visible focus. Parsons tasks have up/down buttons, not drag-only interaction. Feedback uses text as well as colour. Font and libraries are local. Raleway is used for the interface; code uses a monospace font. CJK scripts use device font fallback.

## PDF and Teams

Export PDF is available at any point. It includes identity, objectives, attempted core and additional work, checks, changes, code runs with console input/output, images, reflection and completion status. Untouched core cards are marked not completed; untouched extra practice is omitted.

Filename: `Year8_Class_Name_Week5_Theory.pdf` (unsafe filename characters are replaced).

Direct export renders A4 pages to images inside a PDF, preserving device-rendered Mandarin/Korean glyphs. This makes the direct PDF readable but not searchable or screen-reader tagged. Use Menu → Print / Save PDF for a text-based browser-print alternative. Print output varies by browser; select A4 and check the preview.

After export, students receive download-location and Teams instructions. The actual assignment title must be confirmed by the teacher because the timetable and Classwork labels may differ. The final checkbox is self-reported: this app cannot verify download success or Teams submission.

## Files and editing

- `lesson.js`: goals, readings, questions, examples, tests and translations.
- `app.js`: cards, saving, evidence, report and navigation.
- `runner.js` / `python-worker.js`: Python execution and prompt handling.
- `styles.css`: responsive layout and print style.
- `vendor/`: local runtime/PDF libraries and licences.
- `assets/fonts/`: Raleway and its licence.
- `tests/content.test.cjs`: development-only content checks.
- `TESTING.md`: verification coverage and limitations.

The application has not been published to GitHub or Teams. No existing classroom app was overwritten.
