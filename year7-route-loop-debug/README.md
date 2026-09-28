# Year 7: Draw with loops and debug

Open **index.html** after extracting the whole folder, or upload the whole folder to static hosting. Hosting is recommended for school tablets. No build step, login service, database or CDN dependency.

## This revision

Focused-screen update: the sidebar, stage-button row and large progress panel are replaced by a compact header and a single task surface. WAGBA and vocabulary remain visible; K/S/U are in Learning goals. Each task has one instruction above its workspace. Typing tools, detailed tracing, grid help and before/after comparison are available in labelled disclosures. Run/Modify/Make response questions appear after a recorded run. Validation opens any relevant disclosure and focuses the missing answer. The complete progress checklist and draft export remain in My progress. `focus-layout.css` provides this layout without changing saved-work keys.

Teaching update: 26 core cards. One full square cycle now includes an explicit repeated-code-to-loop task; two debugging cases require Predict, Run, Investigate and Modify only. Extra Parsons/Make work remains available after the core. Three independent plenary questions appear one at a time, with first and revised answers preserved in the PDF. Key instructions have Mandarin support and graded hints. Progress records attempts, target checks and help/review needs, not an automatic mastery grade. The latest teaching notes are at the top of TEACHER_GUIDE.md. `lesson-refinement.js` updates the lesson data without replacing the original challenge bank.

The visual theme now matches the supplied Year 11 lesson: locally bundled Raleway, pale neutral background, white bordered cards, green headings and accents, amber focus indicators and dark read-only code examples. `year11-theme.css` is a presentation-only layer; lesson text, progression rules and stored answers are unchanged. Year 7 retains larger touch controls and responsive learning information. The Year 11 classroom backend, SQL and teacher tools have not been imported. Font licensing is included in assets/Raleway-OFL.txt.

Two main tasks, three challenges each, with **36 separate Parsons + PRIMM cards**. Each challenge has Order, Predict, Run, Investigate, Modify and Make. Squares, rectangles and staircases give meaningful repeated patterns. Introductory cards explain the loop heading and indentation. See **TEACHER_GUIDE.md** for curriculum sources, assessment and realistic pacing.

Entry requires a name and class. Enter **teacher** to preview every page without a class. This is a convenience route, not authentication. Students follow a sequential core pathway: Task 1 Challenge 1, then Task 2 Challenges 1 and 2. The other three challenges unlock as optional practice at Extension. Each cycle follows Parsons then PRIMM in order. The visible **My progress** checker shows completed, next and locked cards, with links that highlight missing inputs. Short responses and help choices count as attempts; correct answers and exact keywords are not navigation requirements. Code must be run again after editing. Reading cards use Save and continue without extra checkboxes. Draft reports and progress backups are always available from My progress.

WAGBA, K/S/U and vocabulary are in the learning panel. On tablets, WAGBA stays visible above an expandable K/S/U/keywords panel. Optional Mandarin support covers key scenarios, actions and vocabulary. Code stays in English.

## Python and evidence

Bundled Skulpt executes Python in a Web Worker. A canvas Turtle subset supports this lesson's commands, loops and variables, but not all desktop Python libraries. Execution and drawing limits protect the page. Outputs animate and can be revealed one drawn line at a time.

Each run records code, output and errors. Task 2 shows the original bug and correction side by side. Students do not need device screenshots. Download completed Make programs as .py files.

Work saves locally under the learner's name and class. Download a JSON backup to transfer or protect work. Refresh and Resume saved work to continue. This revision uses separate storage and does not overwrite earlier app data. It has no central teacher dashboard.

PDF reports include attempted challenges, Parsons attempts, prediction history, investigation responses, code and drawings, feedback and reflections. When a stage exceeds 15 runs, the first and latest runs are retained. Open-ended responses are evidence for teacher review, not automatically judged correct.

On iPad, use **Share / Save to Files**. If Safari previews the PDF, use its Share menu and Save to Files. In Teams, attach the PDF and required .py files and select Turn in. A website cannot silently choose an iPad Files folder. The app records self-reported submission, not verified Teams status. The exact assignment title was not supplied.

## Active files

- index.html, primm.css, challenges.js, progress.js, primm-app.js: current lesson and shared progress rules.
- runner-bundle.js, animation.js, map.js: Python and drawing utilities. No school-map background is used.
- vendor/: PDF library and dependency notices.
- TEACHER_GUIDE.md: curriculum links, pedagogy and pacing.

The previous app.js, lesson-data.js and styles.css remain as reference files; index.html does not load them.
