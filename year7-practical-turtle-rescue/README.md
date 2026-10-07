# Year 7 Turtle Rescue practical checkpoint

An English-first, touch-friendly static Python Turtle app matching the supplied 40-minute, 20-mark practical paper. It keeps the two core missions together in one workspace per mission. Predict, Run, Investigate, Modify and Make are a short strip, not a long worksheet. Three extra drawing challenges match paper pages 6–8.

## Use and host

Extract the ZIP. Upload the contents of this folder (including `assets`, `vendor` and `resources`) to a static web host. Open `index.html` through the hosted HTTPS link. No build, database, student account or paid service is required. Essential libraries and the question paper are local; there are no CDN requests or external editor links.

For a local preview, serve the folder with any static web server. Opening `index.html` directly can work in desktop Chrome, but local-file downloads, workers and browser storage vary between browsers. Use HTTPS hosting for school tablets. Do not assume that opening a ZIP on an iPad is equivalent to hosting it.

Pupils enter their name and class. Enter `teacher` (any case) with no class to preview everything. There is no visible teacher control panel. This is a convenience, NOT authenticated teacher access or a secure teacher dashboard. The app contains no teacher mark scheme. Pupils can review all stages without correctness locks; the visible participation tracker and unfinished-step links guide them back to work they have missed.

## Teaching sequence

- Mission 1 / paper pages 2–3: START (-120, -80) → A (-120, 20) → B (40, 20).
- Mission 2 / paper pages 4–5: B → (120, 20) → (120, 100) → EXIT (40, 100). The blocked room is x = 20–100, y = 40–80.
- Shape Studio / paper pages 6–8: rectangle, triangle, own house or robot-face design.
- Finish: review recorded work; hand in the paper. Code, JSON and PDF are available as backups, not additional required assessment evidence.

The initial code, wording, coordinates and line numbers follow the paper. Predict, Run and Investigate always show the original starter, read-only. Modify and Make have separate editable drafts. Make starts from the current Modify draft on its first visit; it is not overwritten when the pupil revisits an earlier stage. Core programs have no colour injection that could shift the printed line numbers. Extra drawings can add a real `t.color` command using colour buttons.

Partner/group discussion is permitted; every pupil records their own choices and final commands on their own paper. No driver/navigator roles, mandatory manual screenshots or long reflection forms are added. Run is disabled during Predict so the original prediction can be made first. A pupil may still navigate onwards without that prediction; an unfinished-step indicator remains. This is deliberate: a checker must not trap a pupil or award marks for guessing a required string.

## Progress and assessment

Progress measures participation, NOT accuracy and NOT marks. Choices are blue selections, not green correctness feedback. A run records the code, actual Turtle segments, result, time and run count. First and most recent runs are kept for each stage; first and recent choice history is retained. This avoids saving a large screenshot for every click.

Predict and Investigate need a choice (or a partner-discussion confirmation for extra challenges). Run needs a recorded run and, for core tasks, an observation choice. Modify needs a run of changed code. Make needs a run and the pupil's confirmation that they copied their commands to paper. Errors count as attempts; they are shown clearly, not treated as correct. This tracker does not judge whether a changed program meets the target. The teacher assesses the code and actual output using the paper and separate mark scheme.

Targets and endpoint labels provide visual feedback. A warning marks a route that touches the blocked room; it never blocks Next. Alternative valid programs are accepted because navigation does not depend on exact strings or a prescribed solution. The Next button follows PRIMM; the top journey and stage strip allow revisiting. Finish links directly back to each unfinished stage.

## Python environment

The bundled Skulpt Python 3 interpreter runs in an isolated Web Worker. A canvas-backed Turtle bridge supports this paper's `import turtle as t`, `goto`, `forward`, `backward`, `left`, `right`, `penup`, `pendown`, `done` and common drawing commands including `color`, `pensize`, `circle`, `home`, `clear` and `reset`. Each Run creates a fresh worker/Turtle, initially facing right. `done()` is safe in the browser. This is not desktop IDLE, full CPython or Tkinter; downloaded `.py` files run in a normal Python Turtle installation.

Real execution completes before drawing playback. The app animates the actual generated line segments, with Slow / Normal / Fast and Replay. Stop interrupts either the worker or playback. A loading timeout is separate from the execution watchdog. The bundled runtime has execution, drawing-count and coordinate limits. Reduced-motion preferences show output immediately. The worker cannot browse the device's filesystem or use normal networking modules; do not treat it as a general-purpose hostile-code sandbox.

No regular-expression-only pseudo-interpreter or exact-answer validator is used. Desktop Tab indents by four spaces, Enter keeps indentation, and Ctrl/Cmd+Enter runs. Touch helpers insert punctuation with an ASCII minus sign. Editor uploads accept `.py` files under 100 KB and do not run them automatically.

## Language and device support

Visible English / English + 中文 support adds Mandarin translations of goals and core stage instructions. Python commands and numerical targets remain unchanged. Technical vocabulary is retained with concise support. This is optional language scaffolding, not a translated mark scheme or a language-based gate.

Device help is always visible. No student screenshot is required: code and output are recorded from actual runs. Downloads cannot be forced into a particular folder on iPad/Safari or a browser embedded in another app. The PDF Share button uses native file sharing where supported; otherwise it downloads. Device help explains Share → Save to Files and teacher-directed Teams attachment. No nonexistent Teams assignment is assumed.

## Saving, privacy and backup

Work is saved in localStorage for this lesson, name and class on this browser/device. Teacher previews use a separate key. There is NO Supabase connection, central teacher monitor, public class roster or cross-device automatic sync in this app. A name is not authentication. Shared-browser users could access prior local work; follow school device/privacy policy. Do not include extra personal data in code.

Save backup (top right) downloads JSON containing code, answers and vector drawing data. Reopen a saved JSON backup on the landing page to continue on another device. Imports must match this lesson and be under 5 MB. Browser storage can be cleared or unavailable; a visible warning replaces “Saved” if a write fails. Keep the paper and a downloaded backup for assessment continuity.

Download `.py` exports the current program. Finish exports each mission's Make draft if present, otherwise the current available starter/draft; review it before handing it in. PDF backup contains the pupil's choices, code, run result and last output, including extra challenges only when attempted. PDF pages are rendered with legible Raleway/system-language fonts to preserve Unicode names and Mandarin text; their text is rasterised rather than selectable. Keep the JSON for editable data. The print paper included in `resources` is unchanged, and the teacher answers are intentionally excluded.

## Files and licences

`lesson-data.js` contains lesson goals, exact starters and PRIMM instructions. `map.js` provides the coordinate maps. `app.js` handles editor, progress, saving and animation. `report.js` creates the PDF backup. `vendor` contains the local Python runtime and jsPDF. Font licence and third-party notices are included. The delivered `app.bundle.js` combines these files for fewer startup requests; no build is required to host it. If a developer later edits the source, rebuild the bundle in this order: lesson-data, Python runtime, jsPDF, map, report, app.

Before classroom use, check the hosted link in the school-managed iPad/browser, confirm allowed downloads, and decide whether pupils should download code or simply show it and hand in their paper. This app does not publish or replace an existing lesson, alter another web app, or change any database.
