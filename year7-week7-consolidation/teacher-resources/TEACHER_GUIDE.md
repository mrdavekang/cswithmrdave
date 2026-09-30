# Teacher guide · revised Year 7 consolidation

WAGBA: Plan a drawing, use loops to create different shapes, debug one change at a time and credit a source.

## Connected purpose

The school computing club needs a small graphics collection for a digital noticeboard: a triangle badge, hexagon tile and zigzag divider. Pupils plan and repair the drawings, not a complete website. This is consolidation after introductory sequence, decomposition, flowcharts, loops and debugging, not a first encounter with all topics.

## Suggested 60-minute flow

| Minutes | Stage | Teaching focus |
|---|---|---|
| 0–6 | Read first and Do Now | Establish the graphics brief; predict move/turn movement. |
| 6–9 | Types of Learning | Discuss the definition; rate K/S/U with honest self-reports. |
| 9–13 | Read first | Break a collection into drawing jobs; review flowchart symbols. |
| 13–24 | Main task 1 | Choose three jobs, arrange the triangle algorithm, complete its flowchart. |
| 24–29 | Read first | Identify move, turn and a repeated group; revisit loop syntax and three error kinds. |
| 29–47 | Main task 2 | Predict, run, inspect target/output, make one change, rerun and compare: triangle, hexagon, zigzag; acknowledge the lesson source. |
| 47–50 | Learning Pitstop | Choose phase and next step based on actual work. |
| 50–53 | Extension | Select a pentagon, star, fan, rainbow or sparkle if ready. May continue next lesson. |
| 53–60 | Plenary and Finish | Five short retrieval/transfer questions and one sentence starter; save and review evidence. |

If setup takes longer, prioritize a fully discussed drawing over rushing all three. The stage bar permits navigation; unfinished activities remain listed. Read cards are preparation, not assessments. Do not require every pupil to finish every extra design.

## What each programming practice teaches

- Triangle: change range(2) to range(3), keeping a 100-unit move and a 120-degree right turn. Three sides close at the start.
- Hexagon: six 80-unit moves need 60-degree exterior turns. Using 120 degrees repeats a triangle path; repair the angle, not every line.
- Zigzag: one repeated group is forward → right → forward → left. Four groups make four peaks. Indent the last left turn so it happens inside every repeat. This is an open pattern; it must not finish at the start.
- Extra pentagon: five sides and 72-degree right turns.
- Extra star: five 140-unit moves with 144-degree right turns; crossings are intentional.
- Extra fan: forward/backward and a left turn, repeated six times. Retracing is intentional; it is not automatically a bug.
- Extra rainbow: change the prepared circle angle from 120 to 180 degrees. Seven upper arcs have radii 110 to 50. The size calculation and colour list are provided, not new required learning.
- Extra sparkle: change range(4) to range(8). A 55-unit forward/backward pair and 45-degree left turn creates eight rays. Retracing returns Turtle to the centre each time.

All target drawings use the same camera/coordinate scale as the associated output. A program running successfully only means Python executed; pupils and teachers still compare it with the goal. The app does not reject alternate valid code.

## Student creative choice

Use Colour studio to let pupils make a working drawing their own. Choose a single colour first, Apply, then Run. Rainbow uses a different colour per loop repeat. The tool changes real Python rather than adding a cosmetic filter to screenshots. Ask: "What stayed the same when you changed the colour?" Link the answer to movement, turns and repetition.

Colour is not a reward for correctness and never adds a progression gate. Prepared lists, indexing and modulo in rainbow examples are not assessed; pupils can use the colour buttons without mastering them. Do not require every pupil to finish the new art challenges or explain all the provided code. Sparkles are static rays with ordinary drawing animation, not flashing effects. Keep correct/review feedback colours separate from creative accents.

## Assessment and feedback

Use starter predictions, chosen decomposition, arranged sequence, flowchart selections, first/latest code and output, error records and independent plenary answers. The triangle flowchart explicitly counts sides from zero, adds one after each side and uses a Yes/No decision. K/S/U and Pitstop are self-reports, not grades. Observation choices are saved neutrally even when a pupil says the output does not match.

Incorrect answers are amber with actionable explanations. Students can correct them or continue with an attempt. Editing an answer clears old marking so a wrong choice cannot inherit green feedback. Missing responses get a precise link/highlight, but students can use the stage bar and return. No secret keyword, exact-code, correct-shape or help-form gate is used.

## Year 7 and EAL access

Keep the current goal and target in view. Ask a pupil to explain one line aloud before asking for a long written explanation. Core questions use selections, ordering and short guided phrases. Mandarin readings and vocabulary support access, while Python is untranslated. Model clockwise turns, the difference between side length and turn angle, and four spaces for indentation. A translation does not replace explanation of a new concept.

## Evidence and safety

No device screenshots are required: compact code/output evidence is automatic. With the private class link, responses save to Supabase after about five seconds idle; Finish confirms submission after the server acknowledges it. This does not automatically grade work or upload to Teams. The top-right button saves a private recovery JSON at any stage; PDF remains a backup. Keep JSON private because it contains the saved attempt's recovery key.

This permanent-link build requires the separate database migration 06 and rollback tests 07/04 before deployment; that update is not yet installed as of 1 October 2026. Once installed, open teacher.html on the hosted app and sign in with your existing approved classroom teacher account. Select 7T and Copy permanent link; post it once in the class's private Teams space. Viewing/copying the link does not open entry. Use Open entry · 2 hours when the class starts. Opening/reopening keeps the same class-and-lesson link. Stop new entries closes admission but not existing saves; expiry also affects new entry only. Existing pupils resume with their private key. Add other actual class labels when needed. Review individual answers, first/latest code and drawings; a submitted partial lesson is still clearly incomplete. Sign out on shared computers. The teacher-name preview never authorizes database review. Verify your teacher login and published URL on a real school iPad before class.

A permanent link cannot list pupils/read their work, but anyone given it could join during an open window. Keep it in private class resources. If leaked, deliberately replace it using the advanced link section and update Teams; existing pupil work/private keys remain intact. The hosting URL must stay available. Different registered lessons have different links.

Typed names are labels, not secure logins. Private device keys scope each attempt; a class link cannot list pupils. On shared browsers, use Leave a shared device safely and keep its private backup in the pupil's own school storage, not shared Downloads. A different device requires that backup; entering a name alone cannot recover cloud work. Closed/expired links, storage failures or revision conflicts produce non-blocking notices, not impossible task checks. Observe school device/account and retention policies, and avoid untrusted code/files.

## Sources

- National Curriculum computing: https://www.gov.uk/government/publications/national-curriculum-in-england-computing-programmes-of-study/national-curriculum-in-england-computing-programmes-of-study
- Teach Computing, KS3 programming essentials: https://teachcomputing.org/curriculum/key-stage-3/programming-essentials-in-scratch-part-i
- Intellectual property in education: https://www.gov.uk/government/publications/intellectual-property-education-resources/ip-in-education
- Supplied Year 7 Scheme of Learning: consolidation of sequence, decomposition, flowcharts, simple loops, debugging and responsible use of sources. No new checkpoint assumptions are added.

Worked examples, Parsons ordering, PRIMM-style practice, retrieval and feedback inform the design. The app is not an official or endorsed curriculum-publisher product.
