# Year 7 Turtle Rescue: paper-led practical workspace

The practical paper holds all assessment questions, PRIMM instructions, partner/group guidance and answer spaces. The app is only a Python Turtle editor and coordinate drawing workspace. It contains no digital questions, completion checkboxes, correctness gates, marks, or mandatory screenshot/PDF submission.

## Classroom use

1. Give each pupil their own revised practical paper. Teach its picture guide before the 40-minute assessment timer starts.
2. Open the hosted app. Enter a name and class, then choose **Open Task 1**. Enter `teacher` with no class to preview; there are no hidden assessment pages to unlock.
3. Keep the paper beside the screen. Pupils follow Predict, Run, Investigate, Modify and Make on paper, using the same editable workspace throughout each task.
4. Choose **Task 2** only when the paper directs it. Each task retains its own code when pupils switch or refresh.
5. After both core tasks, use **Extra challenges**, then Rectangle, Triangle or My drawing, with the matching extra-challenge sheet.
6. The teacher observes runs, and every pupil hands in their own paper. Downloading code or a JSON backup is available but is not an extra assessment requirement.

Partner/group discussion is permitted. Pupils predict individually before running, discuss changes, and run their own group's chosen repair. No driver/navigator role system is added. The app does not judge correctness; the paper and separate teacher mark scheme remain the assessment record.

## Maps and starters

- Task 1, paper pages 4-5: START (-120, -80), A (-120, 20), B (40, 20).
- Task 2, paper pages 6-7: B, corner 1 (120, 20), corner 2 (120, 100), EXIT (40, 100). The blocked room is x = 20-100, y = 40-80.
- Extra challenges, pages 8-10: move and change a square into a rectangle; move and enlarge a triangle; reflect a corner and create a drawing.

The original starter code and line numbers match the paper. The target map is supplied, but no completed route is drawn before running. Run starts a fresh Turtle facing right at (0, 0). The starter uses penup/goto/pendown to begin at the task's START. The coordinate grid, target labels and actual endpoint help pupils inspect their output; they never lock navigation or award marks.

All workspaces are available without correctness checks. This is deliberate: pupils need the paper to know the next assessment step, while device or syntax problems must not trap them on an app page. Restore starter asks for confirmation; Undo edit restores earlier edits made during the current visit.

## Hosting

Extract the ZIP and upload the whole folder, including assets, vendor and resources, to a static HTTPS host. Open index.html through the hosted URL. No build, student accounts, database, external Python editor, paid service or CDN is required. The revised student paper is included as resources/Practical-Test-Paper.pdf; teacher answers are deliberately excluded.

For local preview, serve the folder using a static web server. Direct file opening was tested in desktop Chrome, but worker, storage and download behaviour varies by browser. Use hosted HTTPS for managed iPads and confirm school browser/download restrictions before the lesson.

Saving the updated folder locally does not publish it. A previously published GitHub Pages URL will continue showing its old version until the new files are explicitly committed and pushed. The current Y7T Classwork module does not yet contain a practical app resource. The paper uses genuine Teams class/navigation screenshots and a direct URL/QR fallback. Add the actual resource and verify its destination before replacing that guide with a screenshot of the final link.

## Python and drawing

The locally bundled Skulpt Python 3 interpreter executes in a separate Web Worker. A canvas-backed Turtle bridge supports import turtle as t, goto, forward, backward, left, right, penup, pendown, done and common commands including color, pensize, circle, home, clear and reset. This is a real Python interpreter, not a sample-only command parser. It is not desktop IDLE, full CPython or Tkinter.

Execution produces real movement segments, then the canvas plays them back at Slow / Normal / Fast speed. Replay shows the last output, not newly edited code. Stop interrupts execution or drawing playback. Reduced-motion settings show the completed output immediately. Worker startup and execution have separate limits; infinite loops can be stopped without blocking subsequent runs. Syntax/runtime errors appear in red and never prevent changing tasks.

The editor has line numbers, syntax highlighting, indentation, desktop Tab support and Ctrl/Cmd+Enter to run. Touch buttons insert punctuation and spaces, not solutions. Download .py exports the current draft, including the student's edits. The downloaded code runs in a normal Python Turtle installation with a desktop graphical environment. The worker cannot access the device filesystem; it is not a general-purpose hostile-code security sandbox.

## Language, access and devices

WAGBA, Knowledge, Skills, Understanding and keywords remain in the compact learning header. Language help and Device help are visible on the landing page and workspace. English + Chinese adds Mandarin navigation and vocabulary scaffolding; it is not a complete translated assessment or mark scheme. Python commands and numerical targets are unchanged.

Desktop and iPad landscape use editor/map columns; smaller screens stack them. Controls are touch-friendly and code remains horizontally scrollable rather than wrapping incorrectly. Essential operations do not require dragging. The coordinate canvas can be tapped to show a point; its visual output is not a screen-reader equivalent of the drawing, so pupils needing nonvisual access should use a teacher-assisted coordinate trace.

Browsers cannot guarantee saving to a named folder on iPad/Safari. Device help explains using Share > Save to Files if a download opens as a preview. No pupil needs to create, save or upload a PDF for this assessment, and no manual screenshot is required.

## Local saving and privacy

Code, run count, first/last run code, output, errors and vector movement data save in localStorage for this lesson/name/class on this browser/device. Entering the same name/class resumes that local work. Teacher preview uses a separate key. Earlier Turtle Rescue drafts are migrated without the former digital answers or checks.

Save backup, visible at the top, exports JSON. Open a JSON backup on the landing page restores a valid backup, including on another device. Imports are size-limited and validated; they do not automatically execute code. There is no cloud sync, Supabase connection, central teacher dashboard or authenticated account. A name is not a secure identity, and shared-browser users may access saved local work; follow school privacy/device policy. Do not put personal details in code.

Storage may be cleared, full or unavailable. A failed save shows a warning instead of Saved. Keep the paper as the official record; use JSON/.py backups when desired. No pupil data or test exports are packaged with the app.

## Files and maintenance

- lesson-data.js: learning statements, task labels and exact starter code; no questions.
- app.js: entry, editor, local saving, downloads, execution controls and animation.
- map.js: coordinate maps and drawing.
- vendor/runner-bundle.js: local Python worker and Turtle bridge.
- styles.css and assets: layout, font, icon and licences.
- app.bundle.js: prepackaged browser bundle loaded by index.html.
- resources/Practical-Test-Paper.pdf: revised student paper only.

After source changes, mechanically rebuild app.bundle.js by concatenating lesson-data.js, vendor/runner-bundle.js, map.js and app.js in that order, with a semicolon between files. No build is required for hosting the delivered files.

QA covered starter and repaired endpoints, separate drafts, refresh recovery, backup/.py downloads, errors, interruption, teacher storage, language help, desktop/tablet/phone layouts and direct-file startup. Before classroom use, test the final hosted URL on a school-managed iPad; confirm that the paper and app are the same version.
