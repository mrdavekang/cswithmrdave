# Year 9 Week 2 Project — Message Helper

A self-contained, static GitHub Pages lesson. No accounts, server, build command, API, micro:bit, Bluetooth setup or paid service is required. The optional Python editor needs HTTP(S) hosting because it runs in a worker.

## What changed

The former Scam Detective planning lesson has been rebuilt around one small, visible example and one student-designed addition. The core task is planning, not completing a full Python program. Students plan a question, write two pieces of advice, arrange pseudocode, predict and test both answers, and improve their work. No scoring thresholds or validation loops are compulsory.

The busy explanatory posters are not in the learning pathway. One existing illustration is retained as an optional expandable view beside a readable, fictional message. All functional diagrams, instructions and code are selectable text.

## Lesson sequence (60 minutes)

| Stage | Minutes | Cards |
|---|---:|---|
| Do Now | 6 | Sam’s message and pressure clue |
| Types of Learning | 3 | Knowledge, skills and understanding with a relevant next action |
| Worked example | 6 | Try both answers; identify input, process and output |
| Main Task 1 | 15 | User need, warning sign, question, advice, success criterion |
| Main Task 2 | 17 | Read a model, arrange instructions, describe, test and improve |
| Learning Pitstop | 4 | Topic-specific phase, evidence and support action |
| Plenary | 4 | Transfer the idea to a different message; explain the limit |
| Exit and report | 5 | Optional reflection, evidence, PDF and Teams |

Core planning outcome: a problem statement, a question and two outputs, a clear algorithm and test evidence. The worked IPO model is explicitly connected to the same example. Do not demand a finished security product or insist everyone writes code. An arbitrary rule cannot prove a message safe or fraudulent.

## Teaching notes

- Show the model before asking students to plan. Ask who reads the message (the person, not the program).
- Keep Sam’s scenario and use one extra warning sign per student. The pressure check is the teacher model; student additions use the same decision pattern with different content.
- Require meaning, not matching vocabulary. All written responses are saved without minimum word counts or keyword tests. No correctness checks lock navigation or the report.
- Multiple-choice feedback is formative and tied to the selected answer. Revisions invalidate the current feedback display; earlier checks remain in evidence.
- The pseudocode builder initially mixes six instruction chunks. Arrow controls work without dragging. The walkthrough requires a complete draft and valid instruction order to produce an output; otherwise it explains the missing part. These checks do not prevent moving to another activity or using a paper/partner route.
- The walkthrough follows the student’s actual question, output text and instruction order. It is a restricted decision-pattern model, NOT a general pseudocode interpreter, Python compiler or judgement of whether advice is sensible. Teacher review is essential.
- Predict before trying the plan. Save YES and NO tests. Each saved test retains the exact plan it tested. When a plan changes, older tests are marked as needing retesting, not erased.
- Two identical predicted/actual outputs show that the plan was followed; they do not establish that the advice is appropriate. Ask whether the output fits the user need and the limits of the check.
- School phases are descriptions of current learning, not permanent labels. “Drowning / need help” opens practical guidance. Help flags are local records, not live teacher alerts.
- Paper and discussion routes are available within relevant activities. Photographs, short notes and test records can all provide evidence. Do not force students who use paper to type every box again.
- Optional challenges: revision card, an UNSURE route, and a counterexample to the rule. Ordinary Python is available separately without completing the challenges first.

## Reading support

English, Bahasa Melayu and Simplified Chinese explanations are authored locally. Choose support on entry and a primary reading language. Focus view shows a single reading flow, with passage-level translation controls. Compare view is optional. Choice labels follow the primary language; Compare shows corresponding translations beneath them. Code keywords remain English with explanations around them. Responses may use any language or a mixture.

K/S/U and WAGBA remain visible in a compact header on normal laptop/tablet layouts. On very short viewports the header scrolls normally so it does not cover the activity. Zoom and narrow layouts may use additional scrolling rather than clipped text.

## Student and teacher access

- Students open `index.html`, enter name/class, choose reading support and start. Entering “teacher” as a name does NOT enable preview.
- Teacher preview: `index.html?teacher=1`. It has separate storage and is not advertised on the student landing page. It is not authentication or a secure teacher dashboard.
- Every student can navigate, seek help and export without achieving a score.
- Browser storage is separated by name/class and by teacher mode. It is local, not password-protected; on shared devices export and follow the school’s privacy procedure. This is not a central LMS.

## Saving and reports

- Responses autosave; revisions are recorded on changes/navigation. Checkbox/choice answers, explored model answers, instruction order checks, support requests, tests, Python edits/runs and images are retained.
- An unfinished test draft is retained and identified separately in the report.
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

## Optional Python

Skulpt is retained from the supplied app. Python runs in an isolated worker with a time limit; Stop terminates that worker. `input()` uses the on-page input field, not a modal prompt. Time spent waiting for a student's input does not count towards execution limits. The run history and `.py` download are recorded separately from the core planning task. Skulpt supports a Python subset; this is not CPython or MicroPython and it has no hardware access. Code and outputs remain local.

## Verification (8 September 2026)

Tested in a local browser: starting/resuming, open navigation after an incorrect answer, own-word writing, Chinese and Malay reading modes, arranging and testing both branches using the learner's advice, image upload/persistence, Python input with thinking time and Stop. Tested Chrome backup download/restore and Save as PDF; the saved PDF was rendered and checked for English, Malay and Chinese text. The source regression suite passed 1,290 checks, including all 720 instruction-order permutations and attempted-only reporting. Physical iPad/Safari testing and the school's deployed GitHub Pages URL have not been verified in this run.

## Worked-example revision (9 September 2026)

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
