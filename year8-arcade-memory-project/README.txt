MEMORY CREW — YEAR 8 ARCADE PROJECT

Open index.html locally, or serve this folder using a static server.
No build, accounts, CDN dependencies or ChatGPT Site is required.
For GitHub Pages, keep both sibling folders:
  year8-arcade-memory-project/
  year8-arcade-memory-templates/
The app reuses the templates folder's original cartridges and five annotated
screenshots to avoid duplicated assets. Do not move or rename one folder alone.

60-MINUTE PLAN
Mission 3; Do Now 5; Types of Learning 3; Main Task 1 18; Main Task 2 16;
Learning Pit Stop 3; Go Further 7/remaining time; Plenary 4; Report 1.
This totals 60. Prioritise the core game; adjust extension time to preserve exit
ticket and saving. Building happens in a separate Arcade tab, not in this app.

ENTRY AND NAVIGATION
Students enter name and class. The same combination resumes that local profile.
Typing teacher as the name activates a separate teacher preview profile; class
may be blank. All stages are accessible. This is not secure authentication.
The demonstration and starter launch buttons are required for students. On
each of those cards the follow-up response is hidden and Next stays disabled
until its MakeCode launch link has been clicked at least once. This click is
saved per card and restored with backups; it does NOT verify that the editor
loaded, Edit Code was selected, or the project was renamed. Those actions are
student-reported afterwards. Teacher preview bypasses this launch requirement.
Forward navigation/help cannot skip an unclicked required launch; a resumed
older profile is directed to its first outstanding launch without losing answers.
Work tools launches count against the corresponding demo/starter requirement.
Later coding cards use the same existing project, not a fresh starter each time.
The starter card shows actual annotated Edit Code, rename and language-choice
screenshots BEFORE the launch button.
Every stage has sequential cards. Next moves only one card. Previous visited
stages remain accessible. Any response can be recorded as needs help to move
on. No free-text keywords or minimum sentence-length tests block students.
Go Further includes an explicit route to Plenary if the class is ending.
Report/PDF remains accessible at any point for unfinished work.

CONTENT / CHOICES
Blocks and Arcade Python use the same imported starter and engine.
Language choice changes the guide, code reference and instructions.
This is NOT micro:bit MakeCode Python or MicroPython. No micro:bit or pairing.
The original templates remain unchanged. Code runs in the external Arcade tab;
this static lesson does not inspect, save or auto-mark that separate code.
ENGINEER CHECK in the starter is deliberate until A reads route[answerIndex].
B must be pressed between rounds. The prepared engine supports 3–5 clues.
Students practise ordered list data, indexed retrieval and replacement. They
do not need to reproduce the prepared graphics/feedback engine.

EAL / ACCESSIBILITY
English stays visible. Optional Mandarin and Korean support offers concise
task summaries, vocabulary, and short action cues; it is not a complete
translation of all assessment options. Code identifiers stay unchanged.
Students can demonstrate practical outcomes rather than write long reflections.
Keyboard focus, semantic forms, labels, dialog close controls, reduced motion,
responsive layouts and visible status messages are included.
The original screenshot text is English; written task support does not depend
on reading every screenshot annotation. Screenshots enlarge in a dialog.

ASSESSMENT
Four short core MCQs plus the mission/demo checks give immediate explanations.
The current response and each recorded attempt are retained (up to 30/card).
Practical statuses are explicitly self-reported; teacher observation requests
are NOT marked as verified success. Use code screenshots and live demonstrations
to verify the student can create a list, retrieve a clue and replace one value.
Stretch: longer route; target a different index; swap ends without hard-coded
direction values. Each has a clear success state and a separate reference.

STORAGE AND EVIDENCE
Responses use localStorage; compressed evidence uses IndexedDB. Profiles are
separated by case-insensitive name/class (teacher has a separate key).
Autosave is browser/origin/device-specific. Private browsing/storage cleaning
may remove work. Browser file:// storage can differ between browsers; use the
same URL/origin and a JSON backup before moving devices or hosting.
At most 2 PNG/JPG/WebP screenshots, max 8 MB each before compression, resized
to <=1600 px and stored as JPEG. Paste screenshots on the evidence card, or use
Upload. Do not upload pupils' faces or private data. No evidence is transmitted
to a server by this lesson. External Arcade links open only when clicked.
JSON includes lesson responses and compressed evidence, NOT the Arcade code.
Students must separately save their editable Arcade PNG cartridge.
Import validates lesson/version/basic fields, asks before replacing a profile,
and restores evidence. Reset affects only the current local lesson profile.

PDF
Direct A4 PDF uses vendored html2canvas/jsPDF, with raster text so Mandarin and
Korean responses remain visible. Includes all stages, latest responses, check
feedback, attempt counts, self-reported tests, confidence and uploaded evidence.
Unfinished work is not hidden. Print / Save as PDF is the fallback.
After export a dialog explains Downloads/Files and Teams Attach → Turn in.
The submission confirmation is student-reported, not a Teams integration.

LOCAL DEPENDENCIES
Raleway variable font and its OFL license; jsPDF + license; html2canvas + license.
They are bundled locally and require no runtime CDN access. Official MakeCode
Arcade and share links need internet and may be restricted by school networks.

SOURCES
https://arcade.makecode.com/reference/arrays/get
https://arcade.makecode.com/reference/controller/button/on-event
https://arcade.makecode.com/courses/csintro2/arrays/intro
Demo https://makecode.com/_UjdPqP7m48LU
Starter https://makecode.com/_7dfe3vL0R51X

Saved locally only. No commit/push, Teams changes or hosted Site was performed.
ANSWER-RETRIEVAL GUIDE
The A-button repair card includes actual, annotated MakeCode screenshots of the
completed Blocks and Arcade Python assignment. Guidance follows the selected
Code view. Two real simulator screenshots show the expected YOUR TURN prompt
and ROUTE RECOVERED result. They are labelled as a demonstration route, not the
student's required route. The personal expected-result text uses the directions
recorded on the route card, without claiming to inspect the external editor.
No extra response fields or new progression gates are added by this guide.
Images are local assets, enlarge on click/tap, and have descriptive alternative text.
MAIN TASK 2 AND GO FURTHER VISUAL SUPPORT
Original guides, references and image assets are retained. Additional walkthroughs
on update, testing, evidence, longer-route, target-index and swap cards show where
to find the existing code/blocks, what to edit and what a real result looks like.
Blocks and Arcade Python have separate code screenshots, using the current Code
selector. Screenshots were captured in a separate editable demonstration copy;
the shared student starter and its cartridges were not changed.
Worked-example routes are labelled. Three-clue swap screenshots explicitly tell
students to adapt both last-index positions for four/five clues. Tests include
wrong-direction feedback and two consecutive swaps without a reset between them.
Saving an editable PNG and taking a code screenshot are distinguished. Evidence
remains optional when a teacher observation is requested. No new answer boxes,
launch gates or completion requirements are added. All new assets are local.

AFTER-PLENARY BLASTROOM CHALLENGE
The Save & submit card displays a fast-finisher panel after both exit tickets
have recorded responses (including a help request), or immediately in teacher
preview. Earlier partial-report exports remain available without exposing the
bonus panel. No new compulsory task or progress gate is added.
Published set: https://blastroom.net/sets/cf4c9d7a-700a-4240-9114-e9ffec15685c
15 four-option MCQs, 60 seconds each: lists/elements/indexes, retrieval, updates,
length, B-button changes, target indexes and tracing a faulty swap.
The after-plenary panel prominently displays Teacher: host the 15-question quiz
and View the 15 questions links without requiring teacher mode. Teacher sign-in
may still be required by BlastRoom. Students use https://blastroom.app/join
with the current code supplied by a teacher hosting the quiz. This is not a
permanent self-paced assignment. No live room has been started by this update.
Students save/submit lesson work first. BlastRoom scores are not imported into
the lesson or its PDF. Links are in lesson.js. Local changes are not pushed.
