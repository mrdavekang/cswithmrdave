# Coordinate Quest — Year 6 Term 1 Week 3

Static GitHub Pages lesson. Open index.html or serve this folder; no installation,
build, account, database or server-side application is required. Scratch Online
needs internet access; Scratch Desktop can load the bundled project offline.

## What changed

The lesson is a linear 19-card journey: Do Now → learning focus → code prediction
and tracing → a prominent Scratch handover → build/test/save checkpoints →
teacher practical check → learning pitstop → optional extensions → individual
plenary → PDF and Teams submission.

Students cannot select future tasks. Earlier cards remain available through
Previous. The progress trail describes location, not percentage attainment.
Prediction feedback waits for the pupil to continue; no timed auto-advance.
Opening a link never proves practical completion. Every practical observation
before the teacher check is explicitly a pupil self-report.

## Teacher preview and home learning

Enter teacher as the name to preview the lesson without a password. The teacher
observation dialog asks only for a name and the observed checks. There is no
authentication or automatic Scratch verification.

Pupils working at home can use “I tested and saved my work — continue” at the
practical checkpoint after recording a successful test and saved .sb3 filename.
Reports label this as pupil-confirmed, not teacher-checked. The linear practical
steps remain required. Existing saved progress is preserved.

## During the practical

Use the new **Year6_T1W3_Guided_Template.sb3**, not the older template.
The website gives three large steps: download → open Scratch → load the file.
Students run START → A, build/test A → B, then finish B → C → D → KEY.
They record actual test outcomes, including first-time success, and save .sb3.

At the checkpoint, keep Scratch visible and ask pupils to:

- Run the whole route without crossing a wall.
- Explain one coordinate or block (both pupils when paired).
- Show the saved Scratch project.

Use Teacher: check this project to record your observation without a password.
At home pupils can self-confirm instead; their report states that distinction.
Students can try extensions while waiting but return to the same checkpoint.

At lesson end use the teacher control beneath any card to move to reflection.
It records unfinished practical work honestly rather than marking it successful.
Extensions never block the plenary. A pupil can record needing help in the exit
question; this remains “understanding not yet demonstrated” in their report.

## Learning and accuracy

Position (x, y) is taught separately from changes in position. Three predictions
use a mathematical coordinate diagram beside genuine Scratch 3 Desktop block
screenshots. Select a screenshot to enlarge it in the lesson; Escape or Back to
my lesson closes the viewer. Step-through feedback names the current block;
expand Read the blocks as text for an accessible transcript. This is not an
embedded Scratch editor. The old question-mark prediction PNGs remain in
assets for reference but are no longer used.

Eight screenshots in assets/images/scratch-blocks/ cover the event, worked
example, three predictions, supplied starter script, A-to-B glide and plenary.
They were captured from Scratch 3.32.0, cropped without redrawing the blocks,
and visually checked against the question values and order. The full supplied
script includes its purple say block. The screenshot source project is
assets/scratch/Year6_T1W3_Example_Blocks.sb3 (one named sprite per example;
teacher/reference use, not the pupil maze template). No external image service
or network request is needed to display these images.

The original template/backdrop and old .sb3 files remain unchanged. The new
guided template uses a 55% Explorer so its whole costume fits the narrow corridor.
The portal extension now uses intermediate points:

KEY (170, 95) → (205, 95) → (205, -20) → (70, -20) →
(70, -140) → PORTAL (195, -140).

The backdrop walls do not implement collision detection; reaching the key does
not automatically collect/hide it. Students must visually test every segment.
The website says this explicitly. The space-key extension is a separate saved
version to avoid competing scripts.

Knowledge, Skills and Understanding have child-friendly descriptions and a
personal goal. The Learning Pitstop reuses the school's original colourful
poster with simple phase descriptions, task evidence and next-step advice.
Partner goals, reflections and exit answers are separate; practical work is
shared. Builder/checker roles swap when the build begins.

English + Simplified Mandarin supports lesson text. Code labels remain literal
English. Teacher administration and the report headings remain English. Review
translated classroom wording with a Mandarin-speaking teacher before first use.

## Evidence, storage and privacy

No screenshot, camera, clipboard or image-upload task is required.
English reports download using the bundled jsPDF. Bilingual mode or unsupported
Unicode text uses the browser's Print → Save as PDF to preserve characters.
Pupils attach the PDF **and their saved .sb3** to the teacher's Teams assignment.
The site does not submit or verify Teams work automatically.

V3 answers use coordinateQuestProfilesV3 in localStorage. V2 data, including old
screenshots, is untouched. Matching old profiles start the new practical path
fresh; old completion flags do not become a new teacher check. Save backup
exports the active profile and its matching legacy data as JSON. Keep that
backup if local storage fails. On the welcome page choose Load my backup (.json).
The importer validates V3 backups, preserves names, answers and progress, and
asks before replacing a same-name/class/partner record. Cancel preserves the
existing record. Invalid or wrong-type files do not replace saved work.
JSON contains website progress, not the Scratch project. Save and move .sb3
separately; load it inside Scratch. The visual file guide distinguishes PDF,
.sb3 and JSON. Teams requires PDF + .sb3 unless the teacher requests otherwise.
An unsaved-data warning stays visible if the browser cannot persist changes.
Use the same site origin/browser and names/class/partner to resume.

## Suggested 60 minutes

Setup 3 · Do Now 7 · learning focus 3 · Main 1 12 · Main 2 22
(including early-finisher extensions) · pitstop 3 · plenary 5 · submission 5.

## Developer verification

Runtime files: index.html, styles.css, lesson.js, app.js, assets/, vendor/.
No new runtime dependencies. Regression tests use Node with jsdom and jszip:

```sh
node --test tests/journey.test.cjs
```

If those test-only libraries live elsewhere, set CQ_TEST_MODULES to their
node_modules directory. Tests cover linear progression, actual teacher gate,
unfinished release, partner independence, resume, Unicode identity, draft
saving, optional extensions, all cards in both languages, real English PDF
generation, storage failure, untouched legacy data and route/costume geometry.
Browser visual QA was not completed: the local file preview was blocked by the
browser tool's URL policy. Check classroom display and print layout before use.

Home-learning update: isolated Chrome browser checks passed for malformed-file
rejection, backup restore, overwrite cancellation, JSON download/re-upload in a
fresh browser, home self-confirmation, password-free teacher preview, and mobile
width. The updated regression suite passes 20 of 21 tests; the pre-existing
backdrop rect/path geometry assertion described below remains unchanged.

Screenshot update verification: all eight captures were visually inspected in
Scratch and after cropping. The two added checks cover image files/dimensions,
transcripts against the source .sb3, the supplied script, enlargement controls
and current-block tracing. The current suite passes 18 of 19 tests. The existing
maze geometry test expects 12 SVG rect elements; the unchanged current backdrop
uses SVG paths instead, so that geometry assertion needs a separate review.
