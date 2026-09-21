# Year 9: build a helpdesk adviser

A static 60-minute Python project lesson following **Data & decisions**. It uses the agreed two-main-task plan: collect and calculate; decide, test and improve.

## Open the lesson

Serve this directory over HTTP or HTTPS. All assets and the Python interpreter are bundled, so no package installation or external asset request is needed. On GitHub Pages, keep the folder structure and relative paths intact. Opening `index.html` as a file may prevent the browser from starting the Python worker.

The local preview created for this task uses `http://127.0.0.1:8775/`. This address only works on the computer running the preview server; it is not a class sharing link. The build has not been published to GitHub.

For another local preview:

```sh
python3 -m http.server 8775 --bind 127.0.0.1
```

Student view opens with name, class and reading-language entry. `?teacher=1` opens a separate teacher notebook directly in the lesson.

## Lesson journey

| Stage | Minutes |
|---|---:|
| Read first: Sam's situation and highlighted trace tutor | 5 |
| Do Now: six starting checks | 5 |
| Types of Learning: evidence and development focus | 3 |
| Main Task 1: collect input and calculate time | 13 |
| Main Task 2: advice, partner walkthrough and three tests | 22 |
| Further Challenges: use extra time | 5 |
| Learning Pit Stop: current evidence, learning phases and action | 3 |
| Plenary and submission | 4 |

The model estimates four minutes per person. Waiting time is `people_ahead * MINUTES_PER_PERSON`; total time also includes the user's own help. One `if/else` produces the two required decision paths. The estimate and advice are classroom modelling choices, not real helpdesk policy or a promise that an account will be fixed.

The core task expects non-negative whole numbers. `int()` performs conversion, not complete input validation. Further Challenges include a two-minute buffer and a guard against negative numbers. Handling arbitrary text and repeated re-entry can be developed later.

## Python IDE

- Real `input()` questions appear in an inline console, one at a time. Text is sent unchanged to Python, including zero or an empty response.
- Main Tasks 1 and 2 share the same saved core program. Challenge editors keep separate copies, explicitly copied by the learner.
- Numbered code editor, four-space Tab indentation, automatic indentation after a colon, Ctrl/Command + Enter to run, Stop and `.py` download.
- Editor is read-only during a run. Stop terminates its worker, including a run awaiting input. Moving stages or changing reading view stops an active run and preserves the code and transcript.
- A dedicated worker runs the bundled Skulpt Python 3 subset. This covers the lesson's input, conversion, arithmetic and selection tasks; it is not a full CPython installation and does not offer package installation or filesystem access.
- Four-second interpreter execution limit, six-second active watchdog, bounded output/code/input sizes. Waiting for a pupil to answer pauses both timing mechanisms. Forty input responses are permitted per run.
- Run history records source code, entered values, output, status and time. Each editor retains the latest 30 runs; explicitly attached core test runs are preserved separately.
- Test A is `(2, 15)`, B is `(4, 15)` and C is `(2, 12)`. A learner can attach a completed run only when both inputs match and the run used the current code. This confirms the run identity, not semantic correctness.
- Predictions are copied when a run starts. Test cards show that saved prediction separately from later edits. Changing code marks prior output and attached tests as belonging to an earlier version.

## Language and reflection design

English, Bahasa Melayu and Simplified Chinese are available throughout. Focus shows one reading flow. Compare shows English alongside the selected support language. Python identifiers and worked-example prompts remain stable; untouched code-scaffold comments follow the reading language. Once the learner writes or runs code, changing language does not rewrite it.

The WAGBA and lesson-specific knowledge, skills and understanding remain on the left on desktop; on smaller screens they sit above the lesson.

Types of Learning uses six checks, two per KSU area. Independent, supported, not-yet-demonstrated and unattempted evidence are separate. Counts explain the highest development area with an action relevant to this lesson. Recognising a correct starter option is explicitly distinguished from demonstrating code-writing skill.

Learning Pit Stop returns to the same checks, showing earlier judgements and new evidence. Learners separately identify a phase for each topic. The summary distinguishes a highest count, a tie and a majority, keeps pending checks separate and retains specific help needs. Correctness does not automatically assign a phase. No help notification is sent to a teacher.

Open responses have no minimum-word or keyword gate. Unfinished work can be navigated, saved and exported.

## Saving and submitting

Local storage keys are `year9-helpdesk-project-student` and `year9-helpdesk-project-teacher`. Different browsers, devices and website origins have separate notebooks. A visible warning appears if browser saving is unavailable.

The main submission action is **Save my work as PDF**, which prepares a project-first report and opens the browser print command. Select Save as PDF in a browser with printing support. Then download the Python file, check the PDF, and submit both to the Teams assignment. This app does not submit to Teams.

Secondary controls download an editable JSON backup or a readable HTML report. Restoring a matching, validated backup first downloads the current notebook. Unknown fields are discarded and inputs are bounded. Reports escape pupil text and omit unattempted activities. Code and historical run versions remain visible where they differ.

## Validation

The build was checked across 48 page/language/view combinations, with unique page IDs and no missing rendered translations. Automated checks exercised reflection priorities, phase ties and majority, retained help needs, backup validation and report escaping/omission.

The actual bundled interpreter passed both decision branches, equality, zero and below-boundary cases; two delayed successive inputs; an empty response; invalid numeric text; syntax error; infinite-loop execution limit; and output limit.

Live in-app browser checks confirmed two real input prompts, correct outputs for A/B/C and zero, matching test records and prediction snapshots, Stop while waiting, stale-output warnings, reload persistence, shared code between tasks, independent challenge execution, JSON backup restoration, Malay comparison and Chinese views. The landing page was also inspected at tablet width. The browser reported no errors. Report generation was checked; a native print dialog was not exposed by the in-app test browser, so the final PDF pagination and physical iPad/Safari behavior are not certified by these checks.

## Files and licences

`index.html`, `content.js`, `app.js`, `styles.css` and `python-worker.js` make up the lesson. Skulpt files and their licence are in `vendor/`. Raleway and its Open Font Licence are in `assets/`.

The source curriculum used for the plan is *Year 9 KS3 Computing Curriculum AY 2026–2027 Assessment Aligned (2)*, Weekly Curriculum G7:K7. No historical curriculum assessment dates are imposed by the app.
