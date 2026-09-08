# Post-redesign learning review

Scope: Year 8 KS3, Week 2 Smart Badge project. This is a design inspection, not an evaluation of learning gains from a classroom trial.

## Overall judgement

The revised lesson is substantially more suitable for a novice physical-computing class. It has one coherent outcome, a working example before independent choices, explicit code placement, a practical test cycle and an honest support route. Students practise the intended computing ideas rather than filling repeated plans.

The principal remaining risk is device setup consuming practical time. The app reduces navigational and syntax confusion, but cannot repair school Bluetooth permissions, a missing iOS app, failed cables or incompatible device firmware. Teacher preparation and an immediate simulator-only contingency remain essential.

## Inspection rubric (1 = weak; 3 = usable with support; 5 = strong)

| Dimension | Revised design | Evidence and remaining limitation |
|---|---:|---|
| KS3 conceptual focus | 4/5 | Input, event, sequence and output applied to one badge. No independent loops/selection assessment; MicroPython loop is supplied and optional. This lesson contributes to, not fulfils, the whole KS3 programme. |
| Cognitive load | 4/5 | One current card; two personal design choices; two concept checks. Technical guides and posters expand on request. Transfer and Python cards may still need some scrolling, especially with bilingual help. |
| Instruction clarity | 4/5 | Every practical card identifies the editor/device location, steps and the expected observable result. Current school-managed iPad screens still need a teacher check. |
| Novice computing pedagogy | 4/5 | Try a model → personalise → run two tests → explain a change. Complete small examples are used to teach code location, not withheld as a puzzle. |
| Assessment validity | 4/5 | Concept checks distinguish startup/event behaviour. Practical results, code/device images and explanations require teacher review. Self-reported success alone is not verification. |
| Progression and recovery | 4/5 | No keyword password, essay-length gate or forced hardware-success checkbox. Missing work can be recorded for review; response edits invalidate stale status. Browser/hardware recovery still needs a real-device trial. |
| Bilingual access | 4/5 | Entry choice, current-card support, translated concept feedback and glossary include Mandarin, Korean and Bahasa Melayu. A bilingual colleague should review terminology in the school context. |
| Stretch and independence | 4/5 | Three distinct extension choices: create, diagnose, evaluate. A4 design tasks require specific outputs and reasoning. Classroom timings still need observation. |
| Visual/accessibility design | 4/5 provisional | Compact KSU, restrained colour, local readable font, responsive columns, keyboard-operable controls, no fixed-height clipping. This score is based on code/markup inspection, not rendered viewport testing. |

No score is raised to 5 without observing students using the real device routes and collecting evidence that the navigation and support actually work for them.

## How the redesign responds to the reported problems

- **“I do not know where to put the code.”** Each build card labels the work location, links to the selected editor, and says where to paste or place the instructions. It explicitly distinguishes the editor from a lesson answer box.
- **“Python is different on my iPad.”** Device and editor are separate choices. MakeCode Python never receives MicroPython imports or display commands. iPad transfer uses the app/Bluetooth route, not a USB drive instruction.
- **“There is too much planning.”** The core plan is now just an icon and a short text choice, immediately used in the generated model and the two expected test results. Repeated IPO tables and a separate multi-step algorithm form are removed from the practical core.
- **“I copied an AI answer to fill the boxes.”** The main evidence is now tied to the student’s actual badge: what appears before and after A, one change or successful check, a screenshot and an explanation. This does not prevent AI use, but generic prose is less useful evidence. Ask each student to demonstrate or explain one line personally.
- **“The checker will not let me through.”** Objective feedback is local to the question. Free writing is not falsely auto-marked. “Continue—mark for review” is always available after a missing-response reminder. Support need and mastery are kept separate.
- **“I finish early.”** Extensions require a purposeful B response, diagnosis of a misplaced instruction, or a user test and improvement. Students can choose another level after finishing one; these are not three additional mandatory worksheets.

## School reflection requirements

Types of learning appears after the starter. It asks students to select a helpful move: recall the concept, practise a small step or predict/explain its result. These are modes of activity, not fixed learner labels.

Learning Pitstop appears after the main practical work. Students choose new learning, consolidating, treading water or drowning, cite a specific test and identify a next action. The app never marks a phase as correct/incorrect. A struggling student is directed to a smaller demonstrated step and human support, not merely told to persist.

## What the teacher should assess

1. **Knowledge:** Can the student identify A as an input and the LEDs as output in their own program?
2. **Skill:** Can they run the startup and A tests, and show code in the correct editor? Physical transfer is recorded separately if unavailable.
3. **Understanding:** Can they explain why the message waits for A and predict what moving it to startup would change?
4. **Improvement:** Can they point to one change, or explain how two successful tests demonstrate the intended behaviour?

Use a brief individual demonstration or oral follow-up for shared-device pairs and for answers that appear copied. A successful screenshot alone is not proof that both students understand the program.

## Before calling this classroom-ready

### Follow-up: genuine block examples and editor visibility

The text-style block diagrams have been replaced with screenshots captured from the real MakeCode editor. Startup and Button A show actual nesting; Button B is an optional close-up; the debugging picture is explicitly labelled as incorrect. The full editor view remains collapsed so orientation support does not turn each card into another long page.

Each practical editor link is now a large, high-contrast button. Nearby wording distinguishes opening the editor from opening a ready-made answer, reminds students to reuse their current project, and preserves the iPad app route. A fixed picture cannot reflect each student's choices, so the main example caption names their saved icon/text and explains what to substitute. Python students keep their correct dialect and optional block comparison.

Review judgement: this addresses the reported uncertainty about what blocks look like and where to put them without adding tasks or gates. Actual MakeCode block rendering and all five screenshot crops have been inspected. The 4/5 ratings above remain provisional: image clarity is not evidence of improved learning or proof of a tested tablet lesson layout.

### Remaining classroom checks

- Try the route with a first-time iPad user: app entry, MakeCode Python switch, copying code, simulator, Bluetooth and return to the lesson.
- Check the full journey and bilingual view on the four requested screen sizes. Allow zoom/reflow rather than forcing no-scroll clipping.
- Upload/paste a real code screenshot; refresh; export/import a backup; inspect the PDF print preview, including CJK text and images.
- During the first lesson, note how many students reach the first simulator success by minute 20, how many need connection help, and whether a “needs review” path gets them back into learning.
- Review exit explanations, not just completion percentage. Use that evidence to adjust the next lesson.
