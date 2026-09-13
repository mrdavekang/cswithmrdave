# Year 9 Week 2 Project — Message Helper

A self-contained, static GitHub Pages lesson. No accounts, server, build command, API, micro:bit, Bluetooth setup or paid service is required. The Python challenge editor needs HTTP(S) hosting because it runs in a worker.

## What changed

The lesson now moves from reading and a substantial starter to six visual message investigations, a separate pseudocode model, and a short series of student-designed checks for Sam. Students plan up to three focused questions. For each question they keep, they write YES/NO advice and editable pseudocode, predict both outputs, ask a partner to follow the lines, and explain a revision using the recorded feedback. The core outcome is a testable plan; a finished Python program is not required.

The busy explanatory posters are not in the learning pathway. One existing illustration is retained as an optional expandable view beside a readable, fictional message. All functional diagrams, instructions and code are selectable text.

## Suggested lesson sequence (140 minutes, across several sessions)

| Stage | Minutes | Cards |
|---|---:|---|
| Read first | 5 | Phishing, annotated scenario, safe actions, limits and a small program model |
| Do Now | 10 | Twelve questions in Knowledge, Skills and Understanding sets |
| Types of Learning | 3–5 | Use six starting-point checks to recognise prior learning, choose one WAGBA focus and explain it using starter evidence |
| Main Task 1A | 15 | Investigate six visual messages: evidence-based judgment, immediate urgency, clue and safe next step |
| Main Task 1B–1D | 10 | Connect answers with advice; explain Sam’s need; turn observations into focused questions |
| Main Task 1E–1G | 12 | Plan a series of questions, explain YES/NO meanings, write advice and test criteria |
| Main Task 2A–2C | 30 | First pseudocode lesson; three checker models and six message practices; three sequencing activities |
| Main Task 2D–2G | 30 | Write and explain each retained check; partner walkthroughs for YES/NO; feedback and revision |
| Further challenges | Extra time | Explain vocabulary using own code; add an UNSURE route; compare contrasting messages; translate a plan into Python |
| Learning Pit Stop | 3–5 | Choose a current learning phase for each of the six topics; use work evidence and support needed to choose a next action |
| Plenary | 4 | Transfer the idea to a different message; explain the limit |
| Save & submit | 4 | Check the work, save a PDF and submit it in Teams |

These are suggested timings, not a timer or speed target. Read the scenario aloud and discuss it where helpful. Allow longer for reading support and written reasoning; continue the main task in a following session if needed rather than rushing the safety discussion.

Core planning outcome: a problem statement and a short series of checks, each with a focused question, two outputs, a clear decision algorithm and test evidence. The plain-language IPO bridge in 1B uses an urgency question connected to 1A. Formal pseudocode starts in 2A. Do not demand a finished security product or insist everyone writes code. An arbitrary rule cannot prove a message safe or fraudulent.

## Teaching notes

- Show the model before asking students to plan. Ask who reads the message (the person, not the program).
- Begin with one focused check, then add checks for different warning signs using the three planning tabs. Complete and test each retained question; avoid three unfinished drafts. The teacher’s urgency rule models the decision pattern. No aggregate danger score is calculated.
- Require meaning, not matching vocabulary. All written responses are saved without minimum word counts or keyword tests. No correctness checks lock navigation or the report.
- Multiple-choice feedback is formative and tied to the selected answer. Revisions invalidate the current feedback display; earlier checks remain in evidence.
- Three sequencing practices precede writing: a three-line ask/receive/display sequence; a seven-line IF/ELSE checker; and eight blocks comprising two checks in a specified order. Arrow controls work without dragging. A visible model is recorded as example support, not independent success.
- The partner walkthrough preserves the student’s actual pseudocode as a numbered snapshot. Partners read it literally and mark followed/skipped/unclear lines, TRUE/FALSE at each IF, actual advice, comparison and specific feedback. The page does not execute or automatically repair their code. Teacher review remains essential.
- Predict before reading the lines, then save separate YES and NO walkthroughs. Each retains the exact code, source question/advice, reviewer mode and line notes. Revised code or source wording flags earlier walkthroughs for review. Partial records are saved separately from fully recorded reviews; neither is an automatic correctness judgment.
- Two identical predicted/actual outputs show that the plan was followed; they do not establish that the advice is appropriate. Ask whether the output fits the user need and the limits of the check.
- School phases are descriptions of current learning, not permanent labels. “Drowning / need help” opens practical guidance. Help flags are local records, not live teacher alerts.
- Paper and discussion routes are available within relevant activities. Photographs, short notes and test records can all provide evidence. Do not force students who use paper to type every box again.
- Further challenges, for extra time after Main Task 2: an evidence-based vocabulary card, explicit UNSURE and unrecognised-input routes, contrasting fictional messages, and translation of the learner’s own pseudocode into Python. All lead to the Learning Pit Stop.

## Reading support

English, Bahasa Melayu and Simplified Chinese explanations are authored locally. Choose support on entry and a primary reading language. Focus view shows a single reading flow, with passage-level translation controls. Compare view is optional. Choice labels follow the primary language; Compare shows corresponding translations beneath them. Code keywords remain English with explanations around them. Responses may use any language or a mixture.

K/S/U and WAGBA remain visible in a compact header on normal laptop/tablet layouts, with a button to return to the detailed learning guide. On narrow screens (600px or less) and very short viewports the header scrolls normally so it does not cover the activity. Zoom and narrow layouts may use additional scrolling rather than clipped text.

## Student and teacher access

- Students open `index.html`, enter name/class, choose reading support and start. Entering “teacher” as a name does NOT enable preview.
- Teacher preview: `index.html?teacher=1`. It has separate storage and is not advertised on the student landing page. It is not authentication or a secure teacher dashboard.
- Every student can navigate, seek help and export without achieving a score.
- Browser storage is separated by name/class and by teacher mode. It is local, not password-protected; on shared devices export and follow the school’s privacy procedure. This is not a central LMS.

## Saving and reports

- Responses autosave; revisions are recorded on changes/navigation. Checkbox/choice answers, explored model answers, instruction order checks, support requests, tests, Python edits/runs and images are retained.
- Unfinished partner walkthroughs are retained separately for each check and included as in-progress evidence in the report. Earlier automated test records/drafts remain exportable as legacy evidence.
- Reports include only attempted responses and supporting evidence. Blank optional tasks are excluded; viewing a teaching example does not create a student-written answer.
- **Save PDF / Print** uses the browser’s print engine, supporting Unicode text and bilingual responses. Select Save as PDF. On iPad use print preview, then Share / Save to Files. There is no third-party conversion upload.
- A readable HTML report is available as a fallback; open it in a browser and print it to PDF if needed.
- The full JSON backup includes response history and image data; it can be restored in My report. Restoring replaces the redesigned record for the name/class in the backup after confirmation. Download the current backup first.
- Image files are stored in IndexedDB and referenced by the student record. If image storage fails, an explicit warning asks for a backup before leaving. Removing an image removes it from the current report; exported copies remain unaffected.
- The old app’s stored responses are not silently overwritten or incorrectly mapped onto new tasks. If present on the same origin, the landing page offers a separate legacy JSON download, including its old evidence image.
- Submit the resulting PDF to Microsoft Teams → Week 2 Project. Turn in if the teacher has created an assignment.

## GitHub Pages

Keep `index.html`, `styles.css`, `content.js`, `app.js`, `python-worker.js`, `assets/` and `vendor/` together in `year9-week2-project/`. All paths are relative, so the app works in a repository subfolder. It has no build step and no hosting configuration imports. This redesign does not publish or push anything automatically.

Preserve old assets/vendor files if replacing only the app source. The redesigned app does not reference the previous five instructional posters.

## Python challenge

Skulpt is retained from the supplied app. Python runs in an isolated worker with a time limit; Stop terminates that worker. `input()` uses the on-page input field, not a modal prompt. Time spent waiting for a student's input does not count towards execution limits. The run history and `.py` download are recorded separately from the core planning task. Skulpt supports a Python subset; this is not CPython or MicroPython and it has no hardware access. Code and outputs remain local.

## Verification (8 September 2026)

Tested in a local browser: starting/resuming, open navigation after an incorrect answer, own-word writing, Chinese and Malay reading modes, arranging and testing both branches using the learner's advice, image upload/persistence, Python input with thinking time and Stop. Tested Chrome backup download/restore and Save as PDF; the saved PDF was rendered and checked for English, Malay and Chinese text. The source regression suite passed 1,290 checks, including all 720 instruction-order permutations and attempted-only reporting. Physical iPad/Safari testing and the school's deployed GitHub Pages URL have not been verified in this run.

## Earlier worked-example revision (9 September 2026; superseded by 1A/1B below)

The former context-free YES/NO demo is now three short steps within the same lesson card:

1. **Watch Sam:** a visible fictional gaming message, Sam's explanation of the pressure clues, and the advice produced by his YES answer. Viewing this does not create student evidence.
2. **Read the rule:** a six-line pseudocode model, an explanation of INPUT / IF / ELSE / OUTPUT / ENDIF, and an optional check about who reads the message.
3. **Your turn:** a different coding-club message. Students choose an input, predict the advice in their own words, run the model, compare, and explain a limitation. The input and a non-empty prediction are needed only to run this experiment; all lesson navigation remains open. There is no keyword or language requirement.

New passages support English, Bahasa Melayu and Simplified Chinese, using the existing Focus / Compare controls. The model reports the user's observation; it never labels a message definitely safe. A date in a club invitation is distinguished from pressure to act immediately in the post-run explanation.

Every practice run retains its message, input, prediction and actual advice. Revised predictions do not rewrite earlier attempts. Only attempted questions appear in reports; old demo evidence and saved lesson positions remain compatible. Replace `index.html`, `content.js`, `app.js` and `styles.css` together when updating hosting; no student storage reset is required.

Verified locally: the three example steps, an own-word English prediction, a Chinese prediction, both answer routes, continuation without keyword grading, refresh/resume, passage translation, Malay reading, report inclusion of separate run snapshots, and hiding an old output while a prediction is edited. The existing 1,304 regression checks and 156 new worked-example checks passed. The PDF layout engine is unchanged; report contents were checked in the browser. No live GitHub deployment was changed.

## Main Task 1 project-brief revision (9 September 2026)

The vague “Sam needs help to…” prompt has been replaced by a concrete, choice-first brief. Sam's reward message is displayed alongside the task, with an explanation of why he is unsure about following the link and signing in. Students first choose one warning sign, then receive an observation and a thinking prompt specific to that choice. They explain what their check would help Sam notice and why that matters before he acts.

The card distinguishes today's planning from later programming. An optional purpose example uses the teacher's pressure check, not a completed answer for the student's chosen sign. The next question-writing card carries forward the student's own purpose statement. English, Bahasa Melayu and Simplified Chinese are included with existing on-demand translation controls.

Existing `need` and `risk` response identifiers, all 16 card positions and saved histories are preserved. Changing a sign does not erase existing writing. No keyword checker, minimum word count or navigation gate is added. Only attempted responses appear in the report.

Verified locally: selecting a sign, writing in English and Chinese, continuing to the next card, refreshing and resuming, reading the new brief in Malay and Chinese, and the report preserving the latest explanation plus its earlier revision. The 1,304 general checks, 156 worked-example checks and 207 new brief checks passed. The PDF engine is unchanged; report contents were checked, not a new PDF rendering. No live GitHub deployment was changed.

## Sources behind the teaching approach

- School Year 9 scheme: Week 2 identifies user/requirements/IPO/success criteria and produces an initial algorithm before Week 3 implementation.
- Raspberry Pi Foundation computing pedagogy: https://www.raspberrypi.org/teach/pedagogy
- PRIMM research overview: https://www.raspberrypi.org/blog/primm-talk-in-programming-lessons-research-seminar/
- W3C cognitive accessibility, manageable content: https://www.w3.org/WAI/WCAG2/supplemental/patterns/o5p03-manageable-quantity/

The short-card design and reduced project scope are applications of these principles, not claims that this exact interface has been validated experimentally.

## Knowledge, skills and understanding revision (13 September 2026)

The learning header now states concrete actions linked to the day’s WAGBA. The learning header includes a guide to the student’s own message-helper plan:

- **Knowledge:** explain and identify the YES/NO input, IF condition and decision, and two advice outputs; distinguish the person reading the message from the program receiving an answer.
- **Skills:** plan a question and both routes, explain them to a partner, predict and record YES/NO tests, use evidence to revise or review the plan, and retest after changes.
- **Understanding:** justify advice using what the check actually knows. Genuine urgent and fake unhurried message examples explain why correct rule execution cannot establish message authenticity or link safety. Students apply that reasoning to their own YES and NO advice.

Each area includes an explicit task and observable evidence of progress. Introduce the guide in five minutes and return to the relevant section during planning, testing and the plenary; students need not complete every action on the introduction card. The existing lesson cards and paper/discussion route hold the work. All new text is available in English, Bahasa Melayu and Simplified Chinese, including Focus and Compare views.

The 16-card sequence, response identifiers, storage format and report logic are unchanged. The existing learning-focus choice now refers to the fuller tasks. Replace `content.js`, `app.js`, `styles.css` and `index.html` together. No hosting deployment is included.

Verified in local Chrome: all three learning sections and practice choices, header return link, continuation to the worked example, saved-choice refresh/resume and report inclusion, Malay and Chinese Focus/Compare views, and desktop/mobile overflow and header behaviour. JavaScript syntax checks passed and the browser reported no script errors. Physical tablet testing and the deployed site were not part of this revision.

## Reading and expanded Do Now (13 September 2026)

The opening now starts with a reading before any quiz question. Five short sections explain fake messages and phishing, annotate Sam’s scenario, teach pause/independent verification/help-seeking, explain the limits of single clues, and model how an advice program uses input, a decision and outputs. The reading states the complete end-of-lesson outcome and distinguishes the chosen advice helper from other possible educational programs.

The Do Now contains twelve questions, shown four at a time:

- Knowledge (1–4): pressure, evidence and reasoning about another clue, phishing, and an independent safe next step.
- Skills (5–8): a suitable question, the actual input, the selected output, and a test plan for both branches.
- Understanding (9–12): urgency in another context, the limits of passing program tests, rewriting misleading NO advice, and explaining a useful purpose for the student’s own helper.

Nine multiple-choice questions have explanations for every option. Three written questions provide a comparison prompt after a student records an answer; these are not auto-marked. Revising a response hides outdated feedback while preserving earlier response/check history. The written prompts accept any language and do not require keywords or a word count. Students can revisit the reading or move on without passing a quiz.

The first card contains four internal steps (reading then K/S/U), so the existing 16-card indices and original `clue` response are preserved. A new `starterStep` value remembers the internal position; existing records without it start at the reading when returning to the opening. Existing saved design work and report fields remain compatible. All twelve questions are registered with the report; only attempted answers appear, and reading alone does not create student answers.

Safety guidance was checked against these primary sources on 13 September 2026. The scenarios, questions and program model are authored teaching examples, not claims that a single rule can detect all scams:

- NCSC UK, recognising scams and independent verification: https://www.ncsc.gov.uk/collection/phishing-scams/spot-scams
- NCSC Ireland, phishing and impersonation: https://www.ncsc.gov.ie/phishing/
- NCSC UK, action after sharing information: https://www.ncsc.gov.uk/collection/phishing-scams/what-to-do

The same references are available in the reading. No live suspicious links, real personal details or learner passwords are needed. The safety and activity wording is included in English, Bahasa Melayu and Simplified Chinese using the existing Focus/Compare controls.

The student’s response to question 12 is shown alongside Main Task 1 as their starting idea; it does not automatically fill or replace the main-task response.

Verified in local Chrome: reading before questions, all twelve questions and all 27 multiple-choice explanations, written comparison/revision, navigation without passing a quiz, attempted-only reports and prior-answer history, refresh/resume, existing saved lesson positions, Malay/Chinese Focus and Compare, and narrow-screen overflow. JavaScript syntax checks passed. Physical tablets and the deployed site were not tested.

## Earlier nine-check reflection design — superseded by the Year 10 reference adaptation below

Types of Learning follows the starter and precedes Main Task 1. The normal Continue route now runs Main Task 2 → optional extension choices → Learning Pit Stop → plenary → exit. Students may try an extension or continue directly to the Pit Stop. Each extension and the optional Python page also continue to the Pit Stop. The existing 16 numeric card indices are preserved, so saved positions and hard-coded design links are not shifted. Stage navigation and report ordering match this sequence.

Both reflections use the same nine criteria, grouped into three areas:

| Area | Check 1 | Check 2 | Check 3 |
|---|---|---|---|
| Knowledge | Identify and explain two message clues | Explain input, the stored answer and output | Explain the condition and IF/ELSE branches |
| Skills | Write one question and two useful outputs | Arrange instructions and trace both routes | Predict, test YES/NO, compare, improve/review and retest changes |
| Understanding | Justify the user need and useful advice | Explain limits using an example/counterexample | Justify a revision using specific evidence |

Each criterion states what to demonstrate and points to relevant starter answers, planning responses, instruction order, recent tests or extension work. Recorded multiple-choice feedback appears where available; a selected answer is not treated as proof of an explanation or independent performance. The skills prompts explicitly distinguish choosing a good method in the starter from actually writing, tracing or testing a plan. A learner can use a paper/discussion reference or try an example in their evidence note.

For each check, learners independently record one of four statuses: demonstrated independently; demonstrated with an example/reminder; attempted but still needing help; or not yet attempted. Leaving a status blank means no judgment recorded. No evidence is required for an unattempted check. Reading-language support alone does not imply support with the computing concept.

Counts are **self-assessment, not grades**. Each area reports demonstrated out of three, independent/supported counts, help needed, not attempted and unrecorded counts. It separately shows how many demonstrated claims have a non-empty evidence note. Merely citing evidence does not automatically certify correctness; the student/teacher must review what the evidence shows. There is no overall mastery percentage, pass threshold, keyword grading or score-to-phase mapping.

At the starting reflection, a separate prior-learning choice acknowledges what students could already demonstrate. Secure prior knowledge is not automatically made a target. Learners can select multiple particular checks across areas, see context-specific next-step suggestions and use or edit those suggestions. Their chosen targets remain visible at the Pit Stop.

At the Pit Stop, every check can have its own manually chosen phase: new learning (productive struggle and progress), consolidating (using prior learning more accurately/independently), treading water (too easy; useful challenge needed), or drowning/need help (unable to move forward with this part). Students explain the phase using specific work plus effort/difficulty, then identify an action. A correct or supported answer does not choose a phase. An unattempted check may stay unphased while the student plans a first attempt. A free-text comparison for each area supports statements about changed accuracy, reduced support and remaining difficulty.

Starting and later response fields are separate. Evidence snapshots preserve relevant work when a demonstration status or evidence note is committed; revising the original work later does not silently overwrite the earlier snapshot. Reopening and deliberately editing the starting reflection is still possible. Autosave, JSON backup/restore, response history and attempted-only reports include the new reflection data. Reports show the counts, evidence, prior learning/targets, phases, reasons, next steps and captured work. Previous broad `learningFocus`, `phase` and `phaseEvidence` responses remain separately identified in reports and are never reinterpreted as the new judgments. A recorded need for help remains local; students must show the teacher their precise question.

The original lesson guide is still available within Types of Learning. New content and controls support English, Bahasa Melayu and Simplified Chinese with Focus/Compare reading. Suggested pacing now allows seven minutes for the first reflection and eight for the Pit Stop; use extra time or continue in a following session where needed. There is no countdown or completion gate.

Verified locally: 750 combinations of count states, both reflection moments, prior knowledge acknowledgement, multiple targets, evidence snapshots, editable next steps, phases independent of counts, before/after comparisons, extension/Pit Stop/plenary navigation, saved progress and legacy records, report content/order and escaping, three reading languages and narrow-screen layouts. No browser script errors were observed. Physical tablets, a new PDF rendering and the deployed site were not tested. Replace `content.js`, `app.js`, `styles.css` and `index.html` together; the hosting deployment is unchanged.


## Main Task 1A–1G revision (13 September 2026)

The standalone “Try an example” stage is replaced by one Main Task 1 sequence:

- **1A — Investigate messages:** six fictional chats styled to evoke Discord, Instagram and Snapchat. Each has a sender, context, message bubbles and a readable, inert `.example` link preview. Students choose suspected scam, likely genuine in the supplied context, or insufficient information; separately identify immediate urgency; and explain a specific clue plus a safe next step. Feedback distinguishes urgency from authenticity and friendship pressure from immediate urgency. Three suspected scams, two independently contextualised genuine messages and one unverified forwarded school message prevent a rule such as “urgent = scam”.
- **1B — From answers to advice:** a plain-language bridge between the person’s answer, the decision and useful advice. The first formal pseudocode explanation is now in 2A.
- **1C — Sam’s needs:** choose an initial sign and explain what Sam needs before acting.
- **1D — Turn clues into questions:** compare concrete question examples and rewrite a vague “feels dangerous” question using an observable feature. Students can consult their own 1A explanations.
- **1E — Write questions:** up to three focused checks, each with a sign, question and explanation of what YES/NO mean. The student’s 1D wording remains available for reference. Answers are never filled automatically.
- **1F — Design advice:** distinct YES/NO advice for each retained question, with a specific action and an appropriate independent verification route.
- **1G — Set test criteria:** specify input and expected advice; subsequently test both branches for each retained check.

The three planning tabs continue through Main Task 2. Questions, outputs, instruction order, explanations, improvements and test drafts remain separate. Saved tests retain their check number and exact plan snapshot. Editing Check 2 only marks tests against that check as stale. Old single-check work remains Check 1, including tests without a check number. Backups include all new state. Earlier example attempts and pseudocode paper/image evidence remain reportable; a saved position on the previous pseudocode card opens 1B. Reports place 1D in the lesson order, retain the same reflection checks and cite the new work where relevant.

These are fictional platform-inspired teaching layouts, not screenshots or verified platform accounts. No example link can be opened. The decision labels are interpretations of the supplied evidence, not live determinations of sender identity or link safety. Written explanations receive guidance for teacher/student review, not automated correctness marks. Correctness does not determine a learning phase. English, Bahasa Melayu and Simplified Chinese cover the new tasks, feedback, planning controls and model advice in Focus/Compare modes.

Local checks for this revision: all six cases and their urgency feedback; all three languages and both reading modes; desktop and 390px layouts; A–G navigation; three isolated plans; six saved branch tests; pending drafts; plan-specific stale tests; old single-check records; report escaping and evidence; 750 reflection-count combinations. Core activities were tested directly from a file URL, matching classroom preview use. Hosting, Python runtime and physical tablet testing were not part of this revision. Publish the five changed lesson files together when deploying.


## Main Task 2 — first pseudocode lesson and partner review (13 September 2026)

**2A introduces notation.** Students read OUTPUT, USERINPUT, assignment with ←, comparison with =, IF/THEN, ELSE, ENDIF, quotation marks and indentation in everyday language. The question is itself displayed by OUTPUT before USERINPUT receives the answer. YES/NO are answer strings; TRUE/FALSE are results of comparisons. Neither Boolean result is a judgment of message authenticity. ENDIF ends a choice; following instructions can still run. The supplied plans assume the exact answers YES or NO. Unknown, blank or differently written answers are a separate design problem, not a safe NO.

This limited, beginner-friendly notation borrows from [AQA’s 2024 pseudocode guide](https://filestore.aqa.org.uk/resources/computing/AQA-8525-NG-PC.PDF), especially assignment, selection and input/output. The [AQA programming specification](https://www.aqa.org.uk/subjects/computer-science/gcse/computer-science-8525/specification/subject-content/programming) distinguishes the consistent notation used in questions from suitable, unambiguous pseudocode students can write. These are KS3 learning examples, not AQA assessment material or an exam requirement. The lesson uses original message-checker examples and matching double quotation marks for text.

**2B offers three models with six message practices.** Immediate urgency is checked against a genuine urgent club reminder and a scam without immediate urgency. Password/code requests are checked against an account threat and a genuine school-art announcement. Unexpected links are checked against an unsolicited reward and an unverified forwarded school update. Each asks for a justified input, the TRUE/FALSE condition result, the corresponding advice and a reason. A separate, highlighted model trace allows exploration of either hypothetical input, including NO for the unexpected-link checker. This demonstration does not create a completed student answer. Feedback distinguishes following a rule from establishing safety.

**2C provides three sequencing practices.** Order checks compare the visible instruction text, so identical ENDIF cards remain interchangeable. Students can consult a model without their order being overwritten. Attempts, explanations and model support are saved. A correct ordering does not automatically set a reflection phase or prove independence.

**2D–2E produce editable pseudocode.** The three Main Task 1 questions/advice sets remain separate. Students can write directly or deliberately create a starting draft from their own words. Replacing an existing code draft asks for confirmation and keeps the previous version in response history. Later changes to Main Task 1 wording do not silently rewrite code: students are prompted to compare and revise. A combined view displays all written checks in order, helping learners see that ENDIF is followed by the next question. The Python bridge explains print, input, ==, colons and indentation as preparation for the following lesson.

**2F is a literal partner walkthrough.** Students choose a fictional message (1A examples are available), identify who is reviewing, specify YES/NO and predict before beginning. The code snapshot is numbered; one line at a time has a status and note. Every IF has a TRUE/FALSE/unclear choice. Partners must identify branch boundaries and explain skipped instructions, rather than silently fixing the algorithm. They record actual advice, compare it with the prediction, and review sequence, branching and advice quality. Feedback names a line, a reason and a suggested change. Roles can be swapped; solo and teacher-supported reviews are explicitly recorded.

Line-mark counts quantify recorded evidence, not correct performance. A fully recorded review requires all nonblank lines marked, an IF judgment for each IF line, actual/comparison/feedback text and all three quality checks considered. A completed record can still say that revisions or help are needed. Partial records preserve all work and never imply that both routes have been reviewed. Each retained question needs a YES and a NO walkthrough. Saved records and unfinished drafts are isolated by check number, survive refresh, appear in backups/reports and contribute to Learning Pit Stop evidence. **2G** uses these line notes for a reasoned change and another walkthrough.

The old screen-run testing controls are removed from the active student pathway. Old test snapshots, instruction-order responses, earlier examples and paper/image evidence are preserved in reports. Numeric card positions remain compatible; the earlier standalone pseudocode position redirects to 2A. New tutorial destinations precede the student's own plan. Formal pseudocode has been removed from 1B to avoid teaching it before this introduction.

Current revision checks cover: three translated reading languages and Focus/Compare; all six input/condition/advice practices; both hypothetical model branches; three sequences and identical ENDIF equivalence; three editable plans; complete and partial partner reviews; unfinished drafts across check switches and refresh; source-specific stale records; report content and escaping; and all 750 reflection-count combinations. Core tasks are checked from a file URL. Optional Python, physical tablets and the deployed site are unchanged and were not retested as part of this revision.

The final compatibility check also verified migration from the earlier pseudocode position, preservation of old screen-test and paper evidence, recorded scaffold support, escaped review text, and JSON backup/restore of an unfinished line-by-line walkthrough.


## Final hand-in page — Save & submit

The former exit card and report page now lead to one final destination: **Save & submit**. Continue from the plenary opens it directly; earlier saved exit positions also open it. The previous optional `nextStep` response remains in exported evidence but is no longer another question students must pass through.

The default view has one primary action, **Save my work as PDF**, followed by instructions for submitting the saved file to Week 2 Project in Teams. A short pre-save checklist covers name/class, questions/advice/pseudocode, feedback/improvement/reflection, and clarity about unfinished work. It has no required ticks, new writing task or completion gate. A closed preview contains the recorded report and optional paper/photo evidence. Blank activities are excluded as before.

The PDF button uses the existing print export; instructions explain Save as PDF, the Mac PDF menu, finding/opening the saved file, and checking pages/photos. Device-specific help is expandable. The page explicitly distinguishes device autosave/PDF creation from a Teams submission. For an assignment, students attach the PDF using + Add work and then Turn in; teacher-specific destinations take precedence. The instructions link to [Microsoft’s student submission guide](https://support.microsoft.com/en-us/education/assignments/turn-in-an-assignment-in-microsoft-teams). The site does not upload or submit work automatically.

Full backup (.json), readable report (.html) and restore remain inside **Other save options · optional**. Each explains its purpose: JSON restores editable progress/history/images, while HTML is a readable browser copy that can also be printed to PDF. Restore retains its existing replacement confirmation. The duplicate toolbar report button and Continue button are hidden while on this final page; Back returns to the plenary. All new labels, guidance and the submission checklist support English, Bahasa Melayu and Simplified Chinese with Focus/Compare reading.

The final page also hides the lesson-goal banner so the PDF action is easier to find; returning to a learning activity restores it. Verified locally: one visible primary save action, direct plenary/final navigation and old exit-position compatibility, all three languages, narrow layouts, print-only report content while preview is collapsed, readable HTML download, JSON backup/restore, and retention of earlier final-reflection and partner-review evidence. No browser script errors were observed.


## Further challenges — from the student's own plan

The hub introduces extra-time work after Main Task 2, with four clearly described choices before the Learning Pit Stop. Student-facing section and Python headings no longer call the work optional. Each challenge links to the WAGBA and specific knowledge, skills or understanding. Students select one of their own three Main Task 2 plans; its numbered pseudocode is displayed, with an explicit return to 2D if it has not been written.

1. **Explain it on a card:** front-side recall question; back-side definition, actual line number and reason; a near-miss/common misconception; and a partner explanation leading to clarification. INPUT, OUTPUT, IF conditions and sequence are offered. The worked example distinguishes displaying a question from receiving its answer; the further prompt distinguishes TRUE comparisons from genuine messages.
2. **Give safe advice when Sam is unsure:** a forwarded school-bus message makes missing context concrete. The four-route model separates YES, NO, UNSURE and unrecognised input. It explains why ELSE in a two-route checker catches all non-YES answers. Students revise their own question/pseudocode and ask a partner to trace four inputs, recording predictions, lines followed, actual advice and differences. UNSURE leads to independent verification; blank/MAYBE leads to clear input guidance, never a silent NO or a safety verdict.
3. **Same answer, different messages:** the worked pair contrasts an independently confirmed urgent school instruction with an urgent login-code request. Students create their own pair with the same answer to their selected question, identify the current rule's limitation, add an observable question and YES/NO/UNSURE advice, then trace both messages and explain remaining uncertainty. Different answers are not required when the evidence cannot justify them.
4. **Turn my pseudocode into Python:** students translate their selected Main Task 2 plan. The editor starts with guidance comments, preserving any existing saved code. A collapsible comparison table explains print/input, assignment versus comparison, elif, colons, indentation and the absence of ENDIF; a worked link-question program supplies support. Students predict, run contrasting inputs, explain a change and run again. The further prompt uses strip/upper to distinguish tidying text from guessing its meaning. See the official [Python control-flow tutorial](https://docs.python.org/3/tutorial/controlflow.html) and [string method documentation](https://docs.python.org/3/library/stdtypes.html#string-methods).

The three written challenges each have three explicit evidence checks and ask students to cite work and distinguish independent, supported, need-help and unattempted performance. Python asks for the same evidence distinction across input/output translation, branching and suitability of advice. Relevant responses and saved Python runs appear among the existing Learning Pit Stop evidence sources; neither completion nor successful execution chooses a learning phase or proves safe advice.

Each planned check has a separate Python editor, prediction, reflection and support record. Legacy Python responses belong to Check 1. Run records preserve the selected check number, pseudocode at run start, actual Python, inputs and output. Switching checks, leaving the page or applying reading-language changes stops an active worker. Run history can be inspected; revisions are marked for another run. Downloads contain the selected editor's code. Existing extension answers and all new fields/runs remain in reports and JSON backups.

Verification for this revision: all four challenge pages in three languages and Focus/Compare, desktop and 390px layouts, navigation into the Learning Pit Stop, preserved earlier answers, independent Python drafts across switches/reload, real Skulpt YES/NO/UNSURE/MAYBE/blank and normalised-input execution, Stop while awaiting input, stopped runs on check changes, correct check-specific .py download, report/PDF preparation, and full-backup restoration. The browser print action and report content were checked; no claim is made here about a native print-dialog download or physical-device testing. The local preview serves the repository files directly; refresh an already open tab to load the changes.


## Types of Learning and Learning Pit Stop — Year 10 reference adaptation

The supplied `year10_week2_session3/index.html` and `reflections.js` were read as reference material and left unchanged. They distinguish **starting-point reflection and today's focus** from **current learning phases and next actions**. The earlier Year 9 design repeated an extensive demonstration checklist on both pages; that active interface has been replaced.

Six topic-specific checks appear together in a single reading flow, two per area:

| Area | Topic 1 | Topic 2 |
|---|---|---|
| Knowledge | Warning signs and phishing | Input, decision and output, including condition truth |
| Skills | Writing observable questions and useful advice | Sequencing pseudocode and checking both routes with a partner |
| Understanding | Why advice and revisions help Sam | Why a checker cannot prove a message genuine |

**Types of Learning** remains after the starter and before Main Task 1. Students choose already knew/could do independently, with reading/prompting, new to me, or not sure/not checked for each topic. Each prompt names the relevant starter questions and the limits of that evidence. In particular, choosing a testing method is not treated as practical evidence of writing or walking through a plan. The overview counts starting-point choices by K/S/U; possible focuses come from supported/new/unchecked choices, never automatically from secure prior learning. The student chooses one focus and explains it in one evidence note, with a suggested lesson-specific starting action. There is no phase selection here.

**Learning Pit Stop** remains after further challenges and before the plenary. Students see their original WAGBA focus and the starting choice for each topic, then select new learning, consolidating, treading water, drowning/need help, or not attempted. Phase definitions concern effort, progress, security and challenge rather than correctness. Each topic points to actual message investigations, questions/advice, pseudocode, walkthroughs or improvements, and supplies a corresponding next action. The overview counts phase choices by area; it does not repeat the initial demonstration checklist or infer a phase from any mark. Students choose one next priority, state the support needed for the cited piece of work and write one evidence/next-step note. A specific request for help can be recorded, with a reminder to tell the teacher directly.

Both pages can expose relevant saved work for review. Counts remain self-reports, unanswered choices remain separate, and not attempted is never treated as wrong. A correct answer can still involve a good struggle; independently completed work does not automatically mean that a task is stretching the learner. The support choice for the priority evidence is independent of the chosen learning phase. No automatic grade, overall phase, completion gate or teacher notification is added.

New `lt2_` starting-point and `lp2_` phase/focus/evidence fields are stored independently. Existing nine-check `rfl_` answers and their evidence snapshots are retained in the report as an earlier format; they are not reinterpreted as answers to the new questions. New responses, topic comparisons, count summaries, suggested actions and referenced-work snapshots are included in report/PDF preparation and full backups. All student-facing prompts and suggestions have English, Bahasa Melayu and Simplified Chinese versions using the existing Focus/Compare controls.

Verification: rendered reference inspection; all six topics and distinct controls on each page; all 183 combinations of per-area starting-point/phase counts; prior learning excluded from automatic target suggestions; starter limitations; missing and not-attempted states; phase-specific actions; separately recorded support; navigation, autosave/reload, preservation of earlier records, source snapshots, PDF report preparation and JSON backup/restore; all three languages and both reading views, including 390px layouts. No browser script errors were observed. The source reference files were not modified.
