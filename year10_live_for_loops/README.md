# Year 10 live lesson: Book-Donation Drive

Static GitHub Pages lesson. No build step or student account signup. The permanent entry update is scoped to this lesson; existing teacher accounts, class ownership and other lessons are unchanged.

## 60-minute teaching flow

| Stage | Minutes | Evidence / teaching move |
|---|---:|---|
| Starter | 5 | Integer input and the inclusive six-book comparison |
| Types of Learning | 3 | Three KSU starting points; choose one concrete target |
| Main 1: model | 7 | Predict four group numbers; compare Python and OxfordAQA loop bounds |
| Main 1: repair | 8 | Fix the excluded stop; verify all four group outputs |
| Main 2 | 20 | First build the total, then the qualifying-group counter; compare two tests |
| Optional extension | 7 | Choose one of ten scoped adaptations; unfinished work is acceptable |
| Learning Pit Stop | 4 | KSU evidence, learning phase, one next step; self-report is not a grade |
| Plenary | 4 | Explain the two updates and matching pseudocode bounds |
| Export / Teams | 2 | Check PDF and Turn in separately in Teams |

Get ready is a brief orientation, not an additional timed activity. Readings and questions are original, not textbook or past-paper extracts. Scope follows OxfordAQA 9210 programming concepts (definite iteration, selection and assignment), input/output, and algorithm tracing. References are linked in Finish.

Core Test A: 2, 6, 3, 8 -> 19 books, 2 groups. Test B: 5, 6, 7, 0 -> 18 books, 2 groups. Assume non-negative integer donations. No lists, functions, WHILE loops or new validation algorithms are required.

## Editor and Shell

- Bundled Pyodide executes unchanged Python in a module worker.
- Run / F5 executes the Editor and creates a fresh module namespace. `>>>` then inspects its variables or evaluates actual Python. Multiline statements use `...` and a blank line, as in a Python console.
- `input()` waits at its actual prompt. Type in the Shell and press Enter; blank Enter is a genuine empty string, not EOF. There is no pre-filled input queue.
- Output and typed inputs appear progressively. Stop / Ctrl+C interrupts; hard termination is used only if Python does not respond promptly. Code is preserved.
- The execution budget is suspended while waiting for human input. Limits: 10 seconds active execution, 100 input calls, 7 KB combined input, 12,000 output characters per execution, 20,000 source characters. Shell display keeps the latest 40,000 characters; individual run records retain each bounded execution.
- This is an IDLE-style browser experience, not desktop Tk IDLE. tkinter, turtle, operating-system integrations and arbitrary desktop packages are not provided.
- A prepared, pupil-controlled pointer explains the total through all four repetitions. It is not a debugger for arbitrary pupil code.

## Isolation on GitHub Pages

Interactive synchronous stdin needs SharedArrayBuffer. `isolation.js` registers `python-isolation-sw.js` with scope `./`. It adds COOP/COEP response headers to this lesson's same-origin resources without caching or intercepting Supabase. A first-load refresh establishes isolation before Python is used. Upload the complete folder, not just index.html. HTTPS or localhost is required; `file://` cannot run the browser interpreter. Embedded browsers that do not support isolation should open the lesson directly in a current full browser. Written work, PDF export and .py download remain available.

## Live teacher workflow

1. Sign in through Teacher using the existing approved Classroom account. Typing `teacher` as a pupil name opens preview only, never class access.
2. Share the same permanent lesson URL each time. For a new delivery choose Lesson setup -> Start fresh book-donation lesson. This ends the previous room but retains its database work. Students choose Start lesson, enter their name and wait for admission. If no class is running, the entry page checks again every eight seconds; they can stop waiting or choose independent practice. A fresh room still requires fresh admission.
3. Preview a page, select Bring class to this page, then Work. Watch and Pause protect pupil drafts. Prior released pages remain available; Bring recalls the class, including to the same page.
4. Show class responses beside the lesson; click a card for full code, answers, Shell snapshot and run evidence. Private feedback gives one written next step. A snapshot is not an assertion that a student is typing or understands the task.
5. In coding activities, open the optional live demonstration, choose a clearly named prepared model or use workspace code. Share code / Run and share. Students see the read-only model and streamed Shell directly, without opening a dropdown; their source is never overwritten.
6. Share-safe hides private pupil information but leaves teaching controls and the demonstration available. Do not share the private response pane on screen.

Transport still polls at 2.5-second intervals. Demo updates are batched briefly, so it is live classroom synchronization, not zero-latency keystroke streaming. Install `supabase/02-student-permalink.sql` after the original setup: it adds a fixed-class entry RPC and masks live code/released pages for pending or declined pupils in both join and poll. No new tables, teacher grants or sign-in settings are required. Legacy room-specific bookmarks still work, but distribute the permanent URL without query parameters. Previously saved room metadata does not override permanent-link routing to the current class.

## Evidence and notebook safety

The new lesson uses a separate `y10-live-for-notebook-books-v2` local key and `_lesson` metadata in cloud answers. Older sponsored-run notebooks are not overwritten or treated as book-donation answers. Keep old backups; restore only matching-version backups into this lesson. Screenshots remain device-local and are included complete in PDF, not sent to the class board.

PDF export includes all visited sections, every recorded local execution's source, actual inputs/output/diagnostics, current Shell, all attempted extension work, KSU reflections, optional screenshots and private feedback. Unattempted sections are labelled. Export during a running program includes its partial execution. Cloud previews retain the latest eight bounded runs; keep PDF/backup for the full device history. Exporting is not Teams submission.

Support is written, literal and optional: predictable steps, readable numbered code, one-line model pointer, visible test results, private help/pause, and no obligation to speak. Offer smaller tasks and individual support based on pupil needs; do not infer ability from a learning-phase choice.

## Hosting and references

Keep `vendor/`, fonts, runtime modules and isolation files alongside the page. No credentials or service-role keys belong in public files. This worker is not a malicious-code sandbox; do not put privileged data in the Python program.

- https://www.oxfordaqa.com/wp-content/uploads/2025/02/oxfordaqa-gcse-computer-science-specification.pdf
- https://docs.python.org/3/library/idle.html
- https://pyodide.org/en/stable/usage/streams.html
- https://pyodide.org/en/stable/usage/keyboard-interrupts.html

Saving local files does not by itself authorize committing, pushing, publishing or posting to Teams. Development tests use synthetic pupils and a private mock classroom; no test data belongs in this public lesson folder.
