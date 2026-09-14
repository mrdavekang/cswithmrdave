# Year 9 Week 3 Theory — Data & decisions

A self-contained, static classroom lesson for **T1.1 Robust Algorithms & Python**. It builds on the Week 2 plan for Sam’s message checker.

**WAGBA:** Choose suitable data and operators, then trace a short program to explain how its values and outputs are produced.

## Curriculum alignment

Based on the supplied *Year 9 KS3 Computing Scheme of Learning AY 2026–2027*, Weekly Curriculum, Week 3 (row 7): variables, constants, data types, arithmetic/relational/Boolean operators, meaningful identifiers and tracing short code segments. Evidence includes an annotated code task, trace tables and reasoned explanations. The subsequent project lesson implements input, variables, calculations and decision paths.

## Suggested 60-minute sequence

| Section | Minutes | Student evidence |
|---|---:|---|
| Read first | 5 | Worked update, constants and four data types |
| Do Now | 6 | Six diagnostics and answer feedback |
| Types of Learning | 3 | Six starting points and one evidence-based focus |
| Main 1: Data & names | 12 | Data choices, repaired identifier, annotated assignments |
| Main 2: Operators | 10 | Predictions and explanation of `or` versus `and` |
| Main 3: Trace a program | 13 | Sequence, three trace tables and explanations |
| Further challenges | 3 | Vocabulary, changed rule or an unsure input |
| Learning Pit Stop | 3 | Topic-specific phases, evidence and next action |
| Plenary & hand in | 5 | Fresh independent check and PDF for Teams |

Times are guidance, not countdowns or completion gates. Students can navigate freely. Further challenges are for extra time; the teacher can direct students to the most useful one.

## Reflection design

The six checks comprise two knowledge, two skills and two understanding statements.

- **Types of Learning** comes after the starter. It distinguishes independent prior learning, supported work, new content and unchecked content. Counts are shown out of two for each area. Students select a useful focus and cite their starter evidence. Secure prior knowledge is acknowledged.
- **Learning Pit Stop** comes after challenges. It returns to the same checks and displays earlier choices. Each check receives a student-selected learning phase: new learning, consolidating, treading water, drowning/need help, or not attempted. A summary counts the six self-selected phases and explains the highest count, ties and incomplete checks; correct-answer scores do not assign phases. Students select a priority and explain what their work shows and what to do next.

Correct answers, support used and learning experience are separate. Counts and feedback are formative self-checks, not formal marks. “Not attempted” is never counted as an incorrect trace response. A request for help in the reflection does not notify a teacher; students are told to ask their teacher or partner.

## Language and interaction

English, Bahasa Melayu and Simplified Chinese are available throughout. Focus view shows the chosen language. Compare view shows English beside Malay or Chinese. Python identifiers, literals and output tokens remain unchanged so students trace the actual code. Students can write answers in any language.

The trace walkthrough is a deliberately controlled model. Separate, short Python writing tasks in Main Task 2 run student code in an isolated browser worker. Students record predictions, then advance line by line. The code, memory values and explanation stay together. First answers present when feedback or a walkthrough is opened are retained in the report and backup. These snapshots do not prove independent work. Changing a prediction clears stale feedback.

## Saving and submission

Open `index.html` in a modern browser or serve this directory with the existing static website. There are no package installations or external assets required. The operator coding tasks use the bundled Skulpt interpreter in a worker; serve the lesson over HTTP/HTTPS for the runner, as browser restrictions may block workers when opening a file directly. The source link to Python documentation is optional reading; the lesson itself runs offline after its files have loaded.

Responses save to browser local storage under `year9-week3-theory-student`. Teacher preview (`index.html?teacher=1`) uses a separate `year9-week3-theory-teacher` key. This does not provide accounts or server storage. Different devices, browser profiles and origins have separate records.

The primary completion action is **Save my work as PDF**. It opens the browser print window with a full learning record. Students choose Save as PDF, check the saved document, upload it to the Teams assignment and select Turn in. The app does not upload or submit to Teams.

Other saving options explain:

- Full JSON backup, for restoring editable answers here.
- Readable HTML report, for opening a copy in a browser.
- Restore backup, validating the lesson/version and known answer fields. A backup of the current work downloads before a valid restore replaces it.

Reports include recorded answers, both reflections, trace code, and first attempts before feedback where available. Incomplete work can be exported. User responses are escaped in HTML reports.

## Teaching accuracy

- `=` assigns; `==` compares.
- Python uppercase constant names express intent, not enforced immutability.
- `input()` returns a string. `"12"`, `12`, `"YES"` and `True` are distinguished.
- Python uses `float` for the real-number examples.
- `//` is floor division, `%` is remainder and `**` is power.
- Boolean explanations here concern Boolean conditions. `or` needs at least one True; `and` needs both.
- Warning counts are classroom rules, not validated safety scores. True and False do not prove a message is fraudulent or safe. Advice prompts independent verification.

Official reading: [Python introduction](https://docs.python.org/3/tutorial/introduction.html) and [control flow](https://docs.python.org/3/tutorial/controlflow.html).

## Validation

JavaScript syntax, all 54 section/language/view combinations, translation completeness, distinct reflection controls, answer changes, trace checking, escaping and backup validation were checked without browser automation. The three trace tables and walkthrough values were verified against actual Python execution. No browser visual QA or end-to-end print-dialog test has been performed.

A feature-detected WebMCP surface exposes read-only lesson progress and navigation to existing sections. It never answers for the student or assigns learning phases. Browsers without it work normally. No supported live WebMCP validation context was available, so this optional integration has not been verified in a live context.

## Welcome page

The lesson now opens with the familiar introduction and notebook form used in Week 2: a lesson-specific outcome and WAGBA, full name, class and reading language. The chosen name and class label the existing report and backup. Both entry actions preserve answers: open at Read first, or resume the last saved section. Resume appears when learning work exists. Reloading returns to the welcome page, and the lesson toolbar includes a Welcome page button. Teacher preview still opens directly into the lesson with its separate storage. Existing version-1 backups remain compatible; older combined name fields are preserved and offered as a prefill.

The repeated “How did you do this?” dropdowns have been removed from all questions, trace activities and the Pit Stop. Existing support-choice data remains compatible with old backups but is no longer requested or included in the readable/PDF report. The Types of Learning starting-point checks and topic-specific learning phases remain.

## Main Task 1 worked teaching and practice

Four visible teaching sections precede all five questions: labelled assignment parts; invalid, vague and meaningful names side by side; a three-line variable/constant example with line explanations; and four data-type examples with named values and purposes. These use different contexts, identifiers and values from the written practice. The three MCQs are unchanged. Question 4 explains the beginner's faulty link-count assignment and separates corrected code from the explanation. Question 5 displays its Python on separate numbered lines, explains the reminder-program context, and provides a three-row annotation table plus an explanation field. All new content is translated. New answers are included in PDF/HTML reports and backups; existing d4/d5 answers remain intact.

## Main Task 2 operator teaching and code practice

The arithmetic section now uses a seven-row operator table, fraction/÷ notation, worked whole-number and decimal long division for 11 ÷ 4, a / versus // versus % comparison, and an order-of-operations table. Comparison operators have meaning and True/False example columns, an assignment-versus-comparison table and a complete worked program. Boolean teaching includes meanings, AND/OR and NOT truth tables, a NOT program, and complete OR/AND programs compared by condition, executed line and output. Explanations include colon, four-space indentation and the fact that only one branch runs.

The six MCQs retain their answer logic, with Python statements separated into numbered code lines. Question 7 has a different message context, two complete programs, a prediction table and an explanation. Questions 8 and 9 add editable Python: // and % calculations for two message totals, and a not/if/else program tested with False and True. Students predict, run and explain. Latest output, the code used for it, predictions and explanations appear in backups and reports. Changing code marks the previous output as stale. Running successfully is not treated as proof of correctness.

The runner reuses Skulpt from the existing Week 2 lesson, loads only local vendored files, caps output and uses an isolated worker with execution limits. These tasks use given values rather than input(). Runtime errors receive a translated explanation around Python's own message. Ten example/practice outputs and syntax-error, output-limit and execution-limit paths were checked using the actual bundled interpreter. The expanded teaching is a reference students can return to; adjust classroom pacing for the worked division and code-writing tasks.

## Main Task 3 worked trace tutors

Two complete worked examples now precede the sequence task. Example A assigns a name and count at the top, then prints their values on separate lines. Example B updates a count and takes one if/else branch. Each shows its completed trace table, a step-by-step tutor, synchronised code-line/table-row highlighting, emphasised changed cells, cumulative printed output, and previous/replay controls. Tutor explanations distinguish unchanged stored values, unassigned values, new output and skipped branches. The existing independent sequence and three trace tasks are unchanged. All teaching is available in the three lesson languages.

## Further Challenges: three levels

Students use extra time before the Learning Pit Stop to work through three clear levels. Level 1 pairs a visible program with a five-term table: variable, Boolean, assignment, comparison and output. Each row asks for an explanation in the student's own words and specific code evidence. Level 2 shows the whole original Trace 3, highlights line 3 and compares the OR/AND change. Its prefilled Python editor and two-case prediction/output table support changing and checking the rule. Level 3 shows a different worked link-question example, explains if/elif/else and the string "unsure", then asks students to build an urgency checker. Four cases cover yes, no, unsure and unexpected text, with required advice, prediction and actual-output columns.

Both programming levels use the same local Python runner as Main Task 2. Students change the initial values, run, record each result and explain it. Code, latest run output, code used for that run, vocabulary and case-table responses are saved and included in reports/backups. Earlier written challenge responses remain available. Instructions and labels are translated into English, Bahasa Melayu and Simplified Chinese.

Validation for this update: all 54 page/language/view combinations, all translations, new-field persistence and report escaping passed. The bundled interpreter passed both changed Trace 3 cases and all four uncertainty routes. Live browser checks confirmed both editors run, edits mark output stale, and translated controls render. Challenge layout was inspected in the narrow in-app preview.

## Pit Stop summary and explanatory plenary

The Pit Stop now totals all six selected learning phases and highlights the most selected phase or tied phases. It distinguishes a highest count from a majority, separates not-attempted and unselected checks, and marks incomplete results provisional. Stage meanings accompany the totals; any drowning/need-help topic remains visible with specific next-action advice. The summary is included in reports and updates immediately when a phase changes.

The plenary asks students to explain one learning gain with evidence, complete a three-row assignment/type/reason table for int, float and str, recall a Boolean assignment and False versus "False", and write three assignments demonstrating a constant limit and changing count. Guidance explains naming, quotation marks, assignment and Python's uppercase constant convention. All content is translated. Thirteen new answer fields persist in backups/reports, while earlier p1–p3 answers remain available. The PDF-to-Teams hand-in controls are unchanged.
