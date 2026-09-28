# Year 7: loops, patterns and systematic debugging

## Current teaching revision (takes precedence over the original pacing below)

The core route is now 26 cards, with three final questions shown individually within the plenary. It uses one full square Parsons/PRIMM cycle, then Predict–Run–Investigate–Modify for two debugging cases. The debugging Parsons and Make cards remain optional extras. The three other full challenges remain available at Extension. This removes two additional coding products from the required lesson.

Suggested 60 minutes: starter 5; learning types 3; loop guides and Main Task 1 17; Main Task 2 18; partner check/optional extension 5; learning pitstop 3; plenary 4; export/submission 5. This is a teaching estimate, not a tested class completion time. Pause and resume next lesson if needed; do not rush pupils through independent work.

The starter compares repeated code with its loop equivalent. The square prediction now asks about position AND direction after two repeats. Investigate asks which lines repeat. Modify gives the intended outcome, with a three-level hint ladder. Make requires replacing an explicit repeated sequence with one loop. Bug case introductions describe the goal without naming the fault; the later investigation feedback provides guided teaching. The final three questions use different code and record first/latest answers and whether feedback was opened. They cover counting executed commands, identifying an outside-loop command and selecting a repair. These are short transfer checks, not a formal grade.

The square Modify explanation is optional. Each bug still requires one brief explanation and a target-comparison choice. The progress panel defaults to a compact summary. Status separates attempts from student target checks and help/review needs. Help requests are stored, NOT sent live to the teacher. Mandarin prompts accompany key revised instructions; this remains supplementary support, not a complete interface translation.

Earlier square evidence is archived in the learner state and included in report/backup rather than discarded when revised questions reset. Other saved work is retained. The report does not reveal final-question feedback before the learner checks that question. Automatic before/after evidence remains available without device screenshots.

This revision provides **six challenges and 36 distinct challenge cards**. Each challenge uses a Parsons ordering problem, followed by Predict, Run, Investigate, Modify and Make. Setup code is supplied; Python text is editable only when the learner needs to change or create it. Earlier version files are retained but are not loaded by index.html, and their saved learner data is not deleted.

## Challenge progression

| Task | Challenge | Knowledge and application | Make outcome |
|---|---|---|---|
| 1 | Square activity zone | One move–turn pair, four repeats | New square on the positive-x side |
| 1 | Rectangle display panel | Four-command body, two repeats | Tall noticeboard with a new width and height |
| 1 | Robot staircase | Repeated route; reset direction between repeats | Five smaller steps with a specified endpoint |
| 2 | Missing side | Logic error in the repeat count | New correctly closed square badge |
| 2 | Escaped turn | Valid Python with a turn outside the loop | Two squares with separate loops and pen-up movement |
| 2 | Staircase direction | Test successive repeats to find a wrong turn | Downward staircase with reversed turn order |

The arbitrary school map has been removed from these challenges. The staircase is a route with a truly repeated movement pattern. There is no requirement to force an irregular route into a loop.

Parsons strips retain their indentation. The second and third strips of rectangle/staircase problems group two commands; this makes the initial ordering task manageable. Students then write individual lines in Modify and Make. In Task 2, the strips reconstruct the supplied buggy program. The instructions explicitly distinguish correct ordering from a correct final drawing.

## Pacing

Six full PRIMM cycles plus Parsons activities should not be presented as compulsory work for every beginner in one hour. The student route now follows Task 1 Challenge 1, then Task 2 Challenges 1 and 2 in order. The remaining three challenges unlock at Optional extension. Progress is saved between sessions. Recommended 60-minute first session:

- Overview, starter, loop-heading and indentation cards: 8 minutes.
- Types of learning: 2 minutes.
- Task 1 Challenge 1, all six cards: 14 minutes.
- Task 2 Challenges 1 and 2: 22 minutes (11 each; independent Make work can continue next session if needed).
- Partner check and improvement: 4 minutes.
- Learning pitstop: 2 minutes.
- Plenary: 4 minutes.
- Review, export and submit: 4 minutes.

Use remaining challenges across a second session or for learners ready for further practice. For fuller independent Make work across all six challenges, allow two or three sessions depending on prior experience. Each core cycle now requires all six cards, including Make. Allow extra time where needed; do not rush independent coding to fit the hour. Optional challenges do not block reflection or submission. My progress always allows a draft report or backup, even mid-lesson.

## Sequential progress and support

Student menus and stage buttons cannot bypass earlier core cards. Students can revisit earlier cards; if they clear an answer or edit code after running it, the progress checker identifies what needs redoing. Reading cards are acknowledged with Save and continue, without another checkbox. Response cards require an attempt, not a correct answer, special keyword, or minimum word count. Run cards require recorded execution; Modify and Make require running the latest code. A run containing an error still counts as an attempt, with the error retained for teacher review. Help choices are accepted.

The visible progress checker lists missing actions and links directly to the relevant input, highlighted in amber. Core progress excludes optional practice; each optional challenge still follows Parsons then PRIMM in order. Students may pause optional work without blocking the core route. Teacher preview remains unrestricted. Existing answers are retained; restored students resume at the earliest incomplete required card if their previous page is now locked. Completion is evidence collection, not mastery or a verified Teams submission.

## Assessment and support

The app records ordering attempts, original and revised predictions, investigation choices, code runs, drawings, explanations, hint use and self-checks. A successful run is not labelled a correct solution. Teachers assess the drawing and explanation against the specific brief. In Task 2, compare the Run sample and Modify attempt in the PDF; at least two distinct bug records are needed. An open-ended answer is accepted as an attempt without keyword matching. Incomplete cards remain available through named review links.

Mandarin support explains the scenarios and actions at key stages and provides a bilingual vocabulary bank. It is supplementary support, not a full translation of every sentence. Code remains in English. Learners use arrows to move Parsons strips; drag-and-drop is not required. The app collects drawings directly, so there is no device screenshot task.

## Curriculum and pedagogy references

- [Teach Computing: promoting effective computing pedagogy](https://teachcomputing.org/pedagogy). The guidance recommends program comprehension activities including Parsons problems, reading code before writing it, modelling, and PRIMM. The app follows that progression while reducing the amount of new text entry at the start.
- [Oxford International Lower Secondary: KS3 mapping](https://cdn.oxfordowl.co.uk/2020/03/23/10/26/29/c50f1f08-28fc-40fb-8939-9643255fa9e4/ENC-OIC_Mapping_KS3.pdf). Outcomes 7.1c (text-based programming) and 7.1d (removing errors to improve programs) provide the closest explicit Year 7 links. This publicly available lower-secondary mapping is used as a reference; it does not establish coverage of every outcome in the school's specific Oxford International Curriculum edition.
- [OxfordAQA Computer Science 9210 specification](https://www.oxfordaqa.com/wp-content/uploads/2022/08/oxfordaqa-international-gcse-computer-science-specification.pdf). Definite iteration is a longer-term progression link. This lesson limits itself to count-controlled loops, sequence, indentation, prediction and debugging. Nested loops, indefinite iteration and GCSE examination demands are deliberately deferred.

These are original lesson exercises informed by the sources, not copied curriculum worksheets. Sources checked September 2026.

## Running and submission

Upload the full folder to static hosting. Open index.html. Enter `teacher` as the name to preview all cards; it is a convenience route, not access security. No pupil accounts or server database are needed. A local Python 3 runtime (Skulpt with a canvas Turtle subset) runs code in an isolated worker. The standard desktop Turtle library and arbitrary imports are not fully supported.

The report has PDF and print routes. iPad users may need Share → Save to Files, then attach from Files in Teams. No website can silently choose their Files folder. The exact Teams assignment name has not been supplied; the app refers to the teacher's named project assignment. Download each completed Make program using its labelled .py button. Backup/restore uses JSON, and this revision uses separate storage from the earlier route app.
