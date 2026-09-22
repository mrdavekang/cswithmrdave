# Year 9 · Helpdesk Python Workshop

A static website redesigned from the supplied handwritten page concepts in **Year 9 Week 5 Project.pdf**, applied to the existing **Year 9 Week 3 helpdesk project**. The topic remains input, variables, constants, calculations, conditions and two advice paths. The filename of the sketch does not change the lesson's identity.

## Open

Serve this directory with HTTP/HTTPS; all runtime files, fonts and assets are local. Direct `file://` opening can prevent Python workers from starting.

```sh
python3 -m http.server 8775 --bind 127.0.0.1
```

- Student landing page: `/`
- Teacher notebook: `/?teacher=1`
- Supported teacher preview: `/?teacher=1&guided=1`

Teacher notebooks are separate from student notebooks. Teacher mode provides reference solutions and a button to switch between standard and supported previews. This is a teaching convenience, not authentication.

## Pages from the sketch

The landing page places the topic, WAGBA, knowledge, skills, understanding and a short definition of learning beside name/class entry and backup loading.

1. Read first: Sam's situation and connection to earlier input/rule/advice work.
2. Do Now: reading reminders beside six recall questions with feedback.
3. Types of Learning: six specific checks, two per K/S/U, then a practice choice.
4. Main Task 1: examples and reading.
5. Main Task 1: input and variables — two Parsons problems and three editable Python exercises.
6. Main Task 1: constants and variables — two Parsons problems and one Python exercise.
7. Main Task 1: conditions — two Parsons problems and one Python exercise.
8. Main Task 2: calculation reading, operator/function tables, a highlighted tutor and two if/else examples.
9. Main Task 2: calculations — two Parsons problems and three Python exercises.
10. Main Task 2: if/else — two Parsons problems and a complete helpdesk program. An assembly button joins the completed calculation and decision blocks; students can also write code directly.
11. Learning Pit Stop: choose a confidence/learning phase for each of six lesson topics.
12. Plenary: input/int recall, trace a completed program, distinguish constants/variables, and save/submit.
13. Further challenge: a busy-day version with a buffer and invalid-number guard, sample outputs and a separate editor.

The page order follows the sketch, including the further challenge after plenary. There are exactly two Main Task groups. Exercise tabs show one editor at a time while preserving each exercise's code. No fixed completion time is imposed on the larger set of practice pages.

## Supported learning route

The landing name field recognises the full name **Ng Jun Kai** case-insensitively, including surrounding text, punctuation separators and full-width characters. It does not match unrelated longer surnames or given names merely containing a partial fragment.

This route uses the same pages and goals with short instructions, English/Mandarin support, word/symbol banks and code with small gaps. It uses choices rather than paragraph responses. No reason for the adaptation or personal difficulty is displayed. Selecting English, Malay or Chinese remains possible; the supported route keeps Mandarin help (or English alongside Chinese).

Each normalised name has its own browser notebook; teacher and student storage are separate. This is local convenience, not a secure identity system. There is no server upload, analytics or external student-data transmission.

## Python editor

- Syntax-coloured code, line numbers, four-space Tab, Shift+Tab to remove four leading spaces, automatic indentation after a colon, Ctrl/Command+Enter to run.
- Code and console appear side by side on wide screens and stack on smaller screens. An expand control enlarges the editor.
- `input()` pauses the actual running program. Its prompt appears inside the console, after previous output. Students type at that prompt and press Enter. There is no separate input-preparation panel.
- Run, Stop, `.py` download, starter replacement with confirmation, console-display clearing, saved execution history and source snapshots.
- Main-program and exercise editors save separately. Moving pages or changing language stops an active run and saves its transcript.
- Test cards give sample inputs and expected outputs. Matching uses the current source code and exact input sequence; output checks ignore only leading/trailing whitespace. “Output differs” asks students to compare, rather than claiming that every differently worded solution is incorrect.
- The bundled worker runs Skulpt's Python 3 subset. It supports the lesson's input, arithmetic, comparison, control flow and ordinary print operations; it is not full CPython and does not install packages or access the filesystem.
- Input waits pause execution timing. The worker limits execution to four seconds of active time, while the page has a 6.5-second watchdog. Code, output, input count and run histories are bounded. Stop terminates a waiting or executing worker.

Core programs expect non-negative whole-number inputs. `int()` converts text but does not validate negative values. The extension adds a negative-number guard; arbitrary words still need additional conversion handling. The 4-minute service estimate is a fictional classroom model, not school policy or a guarantee of help.

## Reflection

Types of Learning displays the student's starter answers beside the six checks. Independent, supported, help-needed and untried are separate. Counts suggest the area with the most practice needs and distinguish ties and untried work. No paragraph is required.

Learning Pit Stop asks only for a learning phase for each of six topics: new learning, consolidating, treading water, or drowning / need help. Short descriptions explain the choices. Untried topics can be left blank. There are no current-ability checks, evidence-source questions, written explanations or next-action questions on this page. The summary counts phase choices, distinguishing a majority, the highest count and a tie. Correctness never automatically assigns a phase. Reports include phase-only responses even when no old ability/evidence fields exist; older fields remain in backups for compatibility.

## Saving and migration

- New notebooks use the `year9-helpdesk-sketch` namespace and version 2.
- Existing version-1 notebooks are not deleted. The welcome page offers “Continue my earlier notebook” when one exists on the same origin.
- Version-1 JSON backups can be imported. Existing code and run transcripts are retained, and the complete older notebook is embedded in the new backup.
- Loading a backup downloads the current notebook first. If a different existing named notebook will be replaced, that notebook is downloaded too.
- Reload returns through the name/class welcome page and resumes the named learner's saved page on entry.
- The primary submission action builds a printable report. Choose Save as PDF in the browser's print dialog, check it, then upload it to Teams. This app does not submit to Teams.
- Reports include attempted code, execution transcripts, ordered code, answers, reflection judgements, evidence choices and next steps. Earlier full data remains available in the editable JSON backup. A readable HTML report and `.py` downloads are also available.

## Validation

Automated checks cover all 156 page/route/language/view combinations, block-order validation, name matching, migration, report escaping and phase summaries. All 22 reference-program test cases passed in the bundled worker, including both advice paths, equality and negative-number handling. Additional checks cover zero, invalid text, empty input and delayed successive prompts.

Browser checks cover moving and checking Parsons blocks, assembling the final program, two sequential live inputs, Enter submission, expected-output matching, the supported name route, translated pages and highlighted tutor. Responsive layouts are inspected at desktop, tablet and phone widths. Browser report construction is verified; the native print dialog and PDF pagination depend on the browser and are not claimed as tested PDF exports.

## Files

`content.js` contains the multilingual curriculum and tasks; `app.js` provides navigation, exercises, storage and editor behaviour; `styles.css` provides the responsive card layout. `python-worker.js`, `vendor/` and `assets/` retain their bundled runtime/font licences. `build-steps.js` is superseded and is no longer loaded by this design.
