# Year 7 Week 3 Project — My first working route

A self-contained 60-minute lesson aligned to: “Implement the first route/drawing section; save version 1 and capture code/output evidence.”

## Open and host

Extract the whole ZIP. Open `index.html`, or upload the complete folder to static school hosting, GitHub Pages, Netlify or equivalent. Keep filenames and folders together. No installation, build step, server-side code, accounts or paid services are required. All runtime dependencies are local.

The normal route is `index.html`. Enter a name and class. Re-entering the same name/class resumes work in that browser. The name `teacher` (case-insensitive) opens all lesson cards without requiring a class. This is a convenience for review, NOT secure authentication. It uses separate storage. No teacher controls are exposed in the student interface.

## Lesson and timing

- Starter: 6 minutes.
- Types of Learning: 3 minutes, after the starter.
- Main Activity 1: 14 minutes, read/type/run/change/pen control.
- Main Activity 2: 20 minutes, build a route, peer check, save v01 and evidence.
- Optional extension or supported finishing: 4 minutes.
- Learning Pitstop: 3 minutes, after extension and before plenary.
- Plenary and submission: 10 minutes.

One main task per card, with a blue reading area and amber action area. WAGBA and keywords remain visible; Knowledge, Skills and Understanding are visible on desktop and expandable on smaller screens. English + Simplified Chinese support, vocabulary explanations and device help remain available. “Focus on code + map” temporarily hides the reading after students have read it. It resets on a new lesson card.

## Map and Python

`assets/practice-school-picture.png` is the generated scenario illustration. The coding map is drawn deterministically by `map.js`; it is NOT the illustration stretched behind Turtle. Its plotting area is 800×600 with world origin at canvas (400,300), equal x/y scale and 50-unit grid spacing. Main Entrance (0,-200), corner (0,-100), Reception (-200,-100), Library (-200,100), Computer Room C1 (200,100).

The runtime uses real Python interpretation through bundled Skulpt (Python 3 mode) with a small canvas-backed Turtle module. It is not a full desktop IDLE or all of standard Python/Tkinter. Supported Turtle methods include goto/setpos, forward/backward, left/right, setheading, penup/pendown, pensize, color, position, xcor/ycor, heading, circle, home, clear and reset. speed, shape, done and visibility methods are safe no-ops. Third-party imports and interactive input are not part of this lesson.

After Python calculates a successful drawing, `animation.js` plays its actual movement segments progressively. The default Steady speed is 120 coordinate units per second; Slow is 65. Pen-up travel is twice as fast. Show immediately skips animation, and is the default for a browser with reduced-motion enabled unless a student chooses another speed. These preview controls, not Python's `t.speed`, determine animation speed. Replay shows the existing drawing without executing Python or adding another run. Stop, editing code, leaving a workspace or closing the page cancels playback. Stopping a new run does not mark the unfinished preview as successful; students run again before finishing. Saved evidence uses the completed drawing, never an intermediate animation frame. Execution time limits do not include visual playback time.

Execution runs in a fresh Blob Web Worker. A sandboxed iframe is a fallback. Each run has a fresh clock, a 1.5-second interpreter execution limit, a 5-second external run limit, a 20-second loading limit and a 2,000 drawing-command limit. Startup errors are distinguished from student-code errors. Stop terminates the runner. These limits are classroom safeguards, not a formal hardened untrusted-code hosting service.

The distributable `runner-bundle.js` includes the local interpreter and bridge source so file:// loading does not require cross-origin imports. If modifying `runtime.js`, regenerate the bundle as described in `BUILD-NOTES.md` before distribution.

Python downloads include a prepared map-drawing setup and the student's own commands at the bottom. They do not depend on an additional image file. Running a downloaded .py independently requires desktop Python with working Turtle/Tkinter. An iPad can save and submit the file without running desktop Python. The map setup is prepared code; students are not expected to type or understand all of it.

## Progression and support

Choose an answer and check feedback; a wrong first answer does not lock progression. Writing is accepted as a non-empty response, not matched to exact keywords. Missing work is listed with links to the relevant field. Run the current code before continuing from a coding card. A failed run can be recorded as needing help after an attempt; the report keeps the error and marks support rather than claiming success. Students must raise a hand — the app does not notify a teacher.

Version 1 preserves the code and drawing together. An incomplete or unsafe route can be saved as a clearly labelled support-needed draft. The route check tests the intended geometric path, not exact code text. Use teacher observation and students' explanations as the primary assessment; geometric checks are not a substitute.

Each extension uses a separate working copy, tracks attempts, and leaves the saved v01 intact. Route-extension downloads use v02. Extension participation is optional. The school's reflection phases describe current learning, not fixed ability or learning styles.

After the existing route extension, Optional extension 2 is **Draw Your Own with Python Turtle**. Students choose a square, rectangle, circle or combined picture. Each opens editable sample code on a blank coordinate grid at (0,0), facing right. They first run the sample, then follow a concrete application challenge: two waiting-area squares on opposite sides of the y-axis; a noticeboard above the x-axis; two bus wheels below it; or a welcome robot with a head, body and chosen detail. Each has a purpose, precise start positions, numbered steps, a starting-code hint, visible success checks and a tailored sentence starter. No loops are required. Students may return and try another, repeat an attempt, or skip this stage. Attempts, code, run records and output are included in the PDF. Drawing downloads use Drawing_<choice>.py, include Turtle setup and do not contain the school map. Desktop Python/Tkinter is required to run these downloads separately; the app runs them in its browser interpreter.

The new optional card does not add mandatory work to the 60 minutes. Use the existing extension time, or allow additional exploration when time permits. Saved profiles from the previous 14-card version retain their current stage through a one-time migration to 15 cards.

After students confirm that both files were uploaded to Teams and Turn in was selected, a large centered **Join Gimkit** link appears. It opens https://www.gimkit.com/join in a new tab and tells students to ask the teacher for the live game code. It does not automatically navigate away, verify submission, send lesson answers, or retrieve game scores. The teacher imports and hosts the quiz separately. Teacher-only CSVs are supplied separately, not in this student ZIP. Eight questions review the core lesson; two cover the optional square and circle examples.

## Evidence and submission

Capture code + drawing generates the evidence image automatically — no manual screenshot is needed. Editing/rerunning the route requires a fresh capture. Open the preview, save version 1 and download the Python file.

The review includes answers, feedback attempts, learning reflections, saved code/output, run history, extension attempts and a bounded interaction appendix. The PDF renders text through the browser canvas to preserve Mandarin characters. Its text is image-based rather than selectable; use the accessible HTML review or print fallback when selectable text is needed.

Students create the PDF and choose Download or Share / Save to Files. Upload both the PDF and v01 .py file to the Microsoft Teams assignment **Week 3 Project**, check the attachments and choose Turn in. The upload checkbox is student confirmation only; no Teams integration or automatic submission is provided. A generated PDF reflects status at generation time; generate it again if later changes should appear.

Safari/iPad controls its save destination. A website cannot force a silent save into a specific iPad folder. Share / Save to Files is offered where file sharing is supported, with explicit fallback instructions if the browser displays a PDF preview. Actual iPad Safari / Teams use still needs a teacher device check before deployment.

## Storage, privacy and recovery

Student details, answers and code are stored in localStorage under a separate lesson/name/class key. Evidence images are in IndexedDB. Teacher data is separate. There is no central monitoring, upload, analytics or external code execution. Local profiles are convenience separation, not authentication: someone with access to the same browser and name/class can resume a saved profile. Use school-managed devices and clear local data according to school policy after marking.

Student resets require confirmation. Download a JSON backup before changing browsers/devices or clearing site data. Restore a backup from the welcome page. Incognito/private mode, blocked storage, cleared browser data or changing the site origin can lose local work. The app warns if saving fails. Backups include the student's details, code and evidence: treat them as schoolwork, not public resources.

To bound storage, each workspace retains 60 detailed runs and counts older runs; the interaction appendix retains 1,000 events and counts omitted older events. File-size and storage limits mean this is not an unlimited forensic record of every keystroke. Answers and current code persist; edits are recorded when a field loses focus, and attempts/run snapshots are recorded explicitly.

## Before class

1. Open the hosted lesson on an actual iPad and a laptop.
2. Run `t.goto(80, 0)` and the two-command Reception route.
3. Test capture, Python download and PDF Share / Save to Files.
4. Confirm the Teams assignment name.
5. Ensure staff understand that the practice map is fictional and no students should leave the classroom to follow it.

No existing Week 2 app or student records were modified when creating this app.
