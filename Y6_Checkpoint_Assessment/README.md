# Year 6 — Explorer's Mission Checkpoint

Static, one-card-at-a-time assessment for the first three taught Term 1 lessons. No installation, accounts, passwords, build process or pupil screenshots are required. Open `index.html` locally or serve this folder on GitHub Pages. Scratch is the practical programming environment, not the answer webpage.

## One connected project

Pupils plan a route, implement that same route in the supplied Scratch starter, test it and explain it. The starter includes the map, Explorer and a green-flag/reset stack only. It does not contain the journey solution.

- `mission.js` defines the exact coordinates used in the webpage, exported map and generated Scratch backdrop.
- START: (-160, -80); key: (-40, 40); portal: (160, 40).
- Each square is 40 Scratch steps. Three wall squares have x=-80 and y=-80/-40/0.
- Pupils need not implement wall detection, locks, selection, variables or loops. Assess planned movement, not untaught code.
- The map does not run the plan or reveal a successful answer. Practical tests happen in Scratch.
- A separate genuine Scratch screenshot assesses code reading, not the project solution.
- Genuine interface screenshot: the new starter open in Scratch. Genuine negative-x screenshot supports the optional return journey.

## Create-first changes (English / Mandarin / Korean)

The warm-up is now compact. Scratch opens on card four, before the full planning task. Programming is split into two bite-sized tasks: code and test the key journey, then extend that SAME program to the portal. File questions happen beside saving, not before pupils begin creating. Definitions and interface help are optional expandable hints.

Reading support can be English, English + Simplified Chinese, or English + Korean. English Scratch block/menu names remain visible. Pupils may think, talk and answer in either language or a mix; language choice is not a grade. Korean wording uses short, age-appropriate explanations, including the technical term in English where useful. A fluent Korean educator should review the draft wording before classroom use.

The optional creation card offers a reverse journey OR a target sprite with pupil-chosen coordinates and a pupil-coded route. It supplies a genuine Scratch block sample and practical steps, not just a sentence asking for a new project. Keep the main SB3 and save the extra version separately. Neither challenge requires loops, sensors or other untaught concepts.

## Suggested 60-minute allocation

| Stage | Minutes | Evidence |
| --- | ---: | --- |
| Ready + short warm-up | 6 | Learning types, precise move, algorithm choice, read real code |
| Open Scratch | 4 | Load mission and verify reset |
| Plan | 5 | Two subgoals, ordered movements, reason for key first |
| Code Part 1 | 10 | Create and test START → key |
| Code Part 2 | 10 | Extend the same code: key → portal; ungraded pitstop |
| Test and improve | 8 | Run, compare with goals, change and retest |
| Create more / improve more | 6 | Optional return route or pupil-designed target; otherwise continue core testing |
| Explain | 4 | Short explanations of the pupil's actual code |
| Save/hand in | 7 | File routines, PDF and actual SB3 in Teams |

The optional extension uses the same movement concepts, with a real block example and numbered instructions. It is not required for secure core evidence.

## Access and navigation

- Name and typed class; no class dropdown.
- English, English + Simplified Chinese, or English + Korean, changeable without losing work. Instructions, choices, navigation and support are bilingual. Canonical Scratch block/menu terms remain alongside explanations. No machine translation of pupil answers is attempted.
- Stages open in order. Visited stages and review links allow returns. Missing answers prompt, but never trap a pupil.
- `teacher` in the name field previews all stages without a password or class. This is a convenience, not secure authentication.
- Help markers, short responses and a teacher-recorded oral explanation alternative support access without long English paragraphs.
- Pitstop self-reports are ungraded, not attainment evidence or fixed learner ability.

## Evidence boundaries

The PDF includes the map, answers, current plan, saved-plan count, all retained tests (up to ten), explanation and code details read from the chosen `.sb3`. “Recorded” does not mean correct. Confirmations that Scratch was opened or code built are not independent verification.

The SB3 reader runs locally with bundled JSZip, checks the archive and extracts a sprite's top-level command chains. It does not execute the project, fully reconstruct nested structures or grade it. A likely unchanged starter triggers a reminder, not a false pass. Teachers must run the actual SB3 and judge it against the pupil's plan and requirements.

Latin-text reports download through bundled jsPDF with an embedded map. Bilingual reports or non-Latin names/answers use the browser print window: choose Save as PDF to retain characters. An explicit Print / Save as PDF option is also provided. The site cannot submit to Teams for pupils.

## Save and restore

- Auto-save uses a new v2 name/class storage key; v1 local records are not overwritten.
- The latest record format is version 3, using that SAME v2 storage key. Version 2 plans, answers, tests and saved code details are retained. Because the card order changed, an older v2 restore starts at the new first card with prior inputs filled in, rather than accidentally jumping past Scratch. Version 3 restores the current card normally.
- JSON restores webpage answers, plan, tests and code-summary evidence, NOT the Scratch project. Keep the SB3 separately.
- V1 backups are supported: older answers are preserved separately in the report; the new mission starts at its first card. Old-task answers are not new-task attainment evidence.
- After restoring, select the latest SB3 again to refresh its code record. The site does not retain the uploaded binary across sessions.
- Previous assets and route engine remain for history but are not loaded by the new page.
- Local asset URLs are versioned to avoid cached old JavaScript running against redesigned HTML. A visible loading-error notice replaces silent blank cards if a required script fails.

## Curriculum and assessment

Core evidence targets progress towards OIC 6.1a (logical algorithm), 6.1b (programmed movement), and 6.1c (decomposition and assembled solution), within the first-three-lessons study-guide scope. This is an early checkpoint, not all year-end outcomes.

Design follows NCCE's emphasis on concrete contexts, code comprehension, structured progression and design/create/evaluate project work:

- https://teachcomputing.org/pedagogy
- https://teachcomputing.org/blog/project-based-learning/
- https://static.teachcomputing.org/pedagogy/QR11-PRIMM.pdf

Separate concepts, practical work and explanation. Reflection is not a grade. Do not mark speed, number of blocks, amount of text, decoration or clicking all cards.

### Teacher judgement: observable evidence

| Criterion | Evidence of success in this early checkpoint | Do not infer from |
| --- | --- | --- |
| Logical planning (6.1a) | Ordered moves form a safe route; pupil gives a meaningful reason for visiting the key first | A definition or final screen position alone |
| Decomposition (6.1c) | Two useful subgoals appear in the plan and are implemented together in the same program | Selecting the word decomposition alone |
| Programmed movement (6.1b) | Pupil's saved code controls Explorer through both parts; the green flag resets its start | Reading an unchanged starter or counting blocks |
| Code comprehension | Prediction follows the shown code; the explanation identifies the unchanged coordinate | Repeating a memorised sentence |
| Testing and improvement | Expected and actual behaviour compared; a reasoned fix is retested, or a successful first run is checked again | Claiming “done” or requiring everyone to invent a mistake |
| Explanation | Pupil connects an input, program action and visible output, and explains one movement value | Long English paragraphs or confidence self-reports |
| File routines | Sensible file choice/name plus the actual saved SB3 and PDF; observe folder organisation separately if needed | A folder MCQ as proof of creating a folder |

Use the school's developing/secure/extending descriptors for the taught scope. These are not automatic end-of-year OIC ratings. If code works but an explanation is unclear, ask one neutral question before deciding whether the issue is computing understanding or language access. Record support given. Do not require a partner for independent assessment.

## Optional creation worlds

The Create card offers two unfinished Scratch 3 templates: **Comet Courier** (Nova rover, fuel dock, launch pad) and **Moon Garden** (Pip garden bug, star seed, moon flower). All six sprites have original, editable SVG costumes. Each moving sprite has only green flag → go to its start. Pupils choose movements, visit the first stop, pause, and reach FINISH without crossing striped walls. Markers do not disappear automatically: pupils check coordinates and the route themselves.

Save the main Explorer assessment file before opening a new Scratch tab. Extra worlds are optional, not a substitute for the main file. Existing return/own-target choices remain available and saved answers are preserved. Real Scratch screenshots show each template and three small block examples (right/up, left/down, wait). Their example start at (0,0) is not the template start or a completed mission route.

The templates and screenshots were opened and inspected in Scratch. Private completed routes and QA files remain outside the public app folder.

## Dependencies and privacy

Raleway with OFL license, bundled jsPDF, bundled JSZip (license notice in distribution), local visual assets. No analytics or automatic cloud upload. Keep pupil files and QA outputs outside the public folder. Saving locally does not publish; commit/push only when requested.
