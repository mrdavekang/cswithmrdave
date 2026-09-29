# Year 9 — Loops & debugging

A standalone 60-minute theory lesson, designed around the class feedback that previous programming tasks felt overwhelming. It uses the familiar helpdesk context and keeps two Main Tasks.

## Open

Open `index.html` from the full folder, or serve this directory using a static web server. The Python worker and fonts are included locally. When opened as a file, Python uses the included offline worker bundle.

For teacher guidance and answer disclosures, add `?teacher=1` to the lesson URL. This is a teaching view, not a password-protected answer system. The lesson and Python activities work locally. The Blooket game requires internet access; students do not need an account.

## Lesson flow — 8:50–9:50

| Time | Stage | Teaching purpose |
|---|---|---|
| 8:50–8:55 | Read first | Model a two-line loop using the highlighted tutor, live trace row and accumulated output. |
| 8:55–8:59 | Do Now | Three low-stakes checks, with immediate explanation. |
| 8:59–9:01 | Types of Learning | Six concrete starting-point checks; distinguish independent, example-supported, needs demonstration and not tried. |
| 9:01–9:16 | Main Task 1 | Predict → run → investigate → arrange real code → complete one gap → modify → follow and run a while loop. |
| 9:16–9:17 | Pause | One minute of physical rest away from code. |
| 9:17–9:27 | Blooket game | Open the external game, answer 15 questions, then return to Main Task 2. |
| 9:27–9:42 | Main Task 2 | Recognise errors, repair a syntax error, identify a logic repair, arrange a ready-check program, improve its prompt and test it. |
| Within task time | Further challenge | Short vocabulary table; nested loop with an output guide and a runnable editor. |
| 9:42–9:45 | Learning Pit Stop | Separate phase choices for knowledge, skills and understanding; summary of the most-selected phase, including ties. |
| 9:45–9:50 | Plenary and save | Transfer the loop count to a new value; explain loop termination; save PDF and upload to Teams. |

## Teaching decisions

- The minimum achievement is one understood code change and one checked repair. Do not rush pupils through every card to match the clock.
- The code arrangement tasks use actual Python lines, with indentation preserved and no distractors at the entry point.
- The example is visible or available beside the activity. The first modification identifies the exact number to change. No blank-editor task is required.
- PRIMM informs the sequence; additional arrange/complete steps bridge reading and modifying. Independent creation can follow in later lessons rather than being forced into this hour.
- `for` is demonstrated as count-controlled iteration; `while` is demonstrated as condition-controlled iteration. The loop condition is checked before each repetition. An input inside the while loop updates the value that controls it.
- Runtime errors are recognised using `int("two")`; core debugging practice focuses on a missing colon and an incorrect count. The nested-loop task is a stretch.
- This intentionally narrows the earlier merged-session scope. Independent nested validation routines and extended GCSE responses need later practice. Students practise an accepted response, a rejected response followed by acceptance, and an empty response; this is not presented as comprehensive numeric boundary testing.
- Read questions aloud where useful. Ask pupils to point to the relevant line before asking for a written explanation. A short phrase or initial spoken explanation is appropriate.
- Pause the game to discuss misconceptions where useful. After ten minutes, return to the lesson tab and continue Main Task 2.
- Blooket records game results separately. Opening its link is not evidence of completion, and the PDF does not invent a game score.
- Starting-point counts identify the areas where pupils requested support, not attainment percentages. Pit Stop phases are chosen by pupils, not generated from quiz scores.

## Language and support

English, Mandarin and Bahasa Melayu are provided for lesson instructions, questions, feedback and controls. Python keywords and the short program string literals remain English, with contextual explanations in each language.

Name matching normalises case, spacing and punctuation. Names containing `Ng Jun Kai` enable extra guidance automatically. The same guidance can be switched on by any student. It adds Mandarin support, opens the worked Parsons pattern and encourages a spoken explanation before writing. The baseline lesson already uses short tasks and scaffolded responses. No pupil is labelled by ability.

## Python editor

- Run Python examples with interactive `input()` in the console when the program requests it.
- Stop terminates the worker, including a loop waiting for input.
- Navigation also terminates a running program and keeps its code/output.
- Tab inserts four spaces; save a `.py` file; restore the example with an immediate undo option.
- Execution is isolated in a Web Worker, with execution/output limits and a watchdog. Waiting for user input does not consume the watchdog time.
- Uses Skulpt's Python 3-compatible educational subset. It is not a full CPython installation and does not include arbitrary third-party packages. It supports the syntax used by this lesson.

## Saving and privacy

Progress is stored in browser local storage under a normalised student name. A name is a local profile key, not authentication. On shared computers students must use their own name. Lesson work is not uploaded automatically. Blooket records the name and answers students enter into the external game.

The main submission route is **Save PDF → browser Save as PDF → manually upload to the teacher's Teams assignment**. The report contains student responses, code, latest run output, observations and reflections. Full JSON backup and readable text report remain secondary choices. Backups can be restored in the same lesson. Back up before clearing browser data or changing devices.

## Files

- `content.js`: translated lesson content, examples, quiz and task cards.
- `quiz-link.js`: verified Blooket assignment URL and Malaysia-time deadline; update when assigning a new game.
- `game-link.css`: external game button styling.
- `app.js`: navigation, responses, reflections, Python UI and reporting.
- `styles.css`: Raleway lesson styling, code font, responsive layout and print layout.
- `python-worker.js`, `python-runtime.js`, `python-offline-bundle.js`: local Python runtime.
- `build-python-offline.mjs`: rebuild the offline bundle if the worker or libraries change.
- `vendor/` and `assets/`: bundled libraries, font and licences.

## Verification

Browser checks cover the three-line output, live no → yes input sequence, syntax error and successful repair, the external game link and translated return instructions, KSU focus counts and separate Pit Stop phase summary. The application is static and suitable for a static host such as GitHub Pages. No deployment is included with this build.

## Live game

[Play Year 9 — Loops and Debugging](https://play.blooket.com/play?hwId=6abba919ea58c4c69c0172fd). Deadline: 6 October 2026, 10:59 p.m. Malaysia time. Goal: answer 15 questions; all homework game modes enabled. The question set is in English; the lesson navigation and game instructions remain available in English, Mandarin and Malay.
