# Route Rescue · Year 8 lists practical

Local, buildless HTML/CSS/JavaScript lesson. This is an original interface inspired
by focused assessment-platform layouts, not a Wayground product or integration.
The original Arcade lesson is unchanged. No ChatGPT Site has been created.

## Open and teach

Serve the folder through a local static server, or publish the whole folder on
GitHub Pages when authorised. Example: `python3 -m http.server 8779`, then open
`http://127.0.0.1:8779/`. Double-clicking index.html uses the same interpreter
directly with an execution limit because browsers usually block file-URL workers.
HTTP/GitHub Pages is recommended for the strongest Stop/timeout isolation.

Enter a full name and class. Enter `teacher` for a separate local teacher-preview
profile; no class is required. This is not authentication or a class dashboard.
There are no locked pages, required accounts, leaderboards, timers or scoring races.

60 minutes: mission 4, Do Now 5, Types of Learning 3, Main Task 1 15,
Main Task 2 16, pit stop 3, further practice 8, plenary 4, submission 2.
The teacher may adjust pacing. The lesson does not automatically move students.

## Differentiation

18 coding tasks: three essentials and three deeper tasks in each main activity,
plus six further challenges. Default route shows the six essentials and all
further challenges. At the end of each essential set, the deeper-task button
offers further work before moving on. `Go deeper` includes all main tasks.
Existing code is preserved when changing support route. Guided support supplies
partial code only when a task is first opened; it does not overwrite a draft.
Each task has visible reading, an unrelated reference, expected output and a hint.
English + Simplified Mandarin and English + Korean explain each activity.
Technical terms and Python direction strings stay in English. Some surrounding
interface controls remain in English. Translations should be reviewed locally
for the pupils' preferred terminology before classroom use.

## Types of Learning and Learning Pitstop update

The starting-point page teaches Knowledge (remember), Skills (practise) and
Understanding (explain) with concrete examples. It shows an actual starter
response and asks what helped: remembering, the diagram, a demonstration, or
not yet worked out. The recorded choice produces a specific next action, not an
automatic ability label. It does not require rating unattempted coding skills.

The Pitstop has two short, freely navigable parts: review evidence, then describe
the learning phase. It shows the student's recorded code/output and a before/after
single-element update when available. A fallback is explicitly labelled as a
worked example, never presented as the student's work. One explanation choice
supports Understanding; mistakes never lock navigation or set a learning phase.
The phase remains self-reported and separate from correctness and speed.
Needing help instructs students to raise a hand; no notification is sent.

Legacy confidence selections, existing code, runs, reflections and backups are
preserved. Old confidence values are exported as legacy responses, not silently
reinterpreted. New reflection responses and the evidence shown at the time of
each response are saved locally, included in JSON backups and PDF/print reports.

## Python interpreter

Bundled Skulpt Python 3 interpreter runs in a terminable worker under HTTP, not a
handwritten subset evaluator. Direct-file mode uses an execution-limited fallback.
It supports the taught list syntax. It is not full desktop
CPython: installed packages and some modules are unavailable. No internet/CDN is
needed. A six-second wall limit, execution limit and output cap protect the page.
Run clears the console. Every run recreates variables from the first line.
Console input, if used, appears inline after its prompt; it is not required here.
Run/Stop, line numbers, tab indentation, automatic indentation, undo, text size,
starter restore and Ctrl/Command+Enter are provided.

Checks use actual output, final values and a parsed Python syntax tree. Comments
cannot pass. Printing fixed answers cannot replace retrieval/update operations.
These are task-specific formative checks, not a secure exam autograder. Unusual
valid approaches may require teacher judgement; navigation is never correctness-
locked. A changed draft must be rerun. Challenge 5 runs the same repair on a second
starting list automatically. Challenge 6 accepts a chosen valid target.

## Evidence, saving and privacy

Current drafts, answers, predictions, runs, console input, hints, goals and
reflections save to localStorage under a lesson/name/class key. Paused typing is
recorded as draft-edit history; it is not a keylogger. Separate student profiles
do not intentionally overwrite each other. Shared-browser users can access its
storage, so this is not secure private school storage. Clear profiles according
to school policy. No Supabase connection, class-wide tracking, external analytics
or real Teams submission verification is included.

Backups contain the full local record. Export before changing browser/device or
clearing storage. Imports validate lesson/version and ask before replacing a
same-name profile. Browser quota failures show a warning and require a backup;
there is no silent deletion of old attempts. Reset removes only this profile's
lesson data after confirmation. Private student backups must not go in GitHub.

The full PDF includes identity, learning goals, every task (including unfinished
ones), current code/output, all run attempts, choices, predictions, support use,
confidence and reflections. Paused code-edit versions remain in the JSON backup.
PDF pages are rasterised locally so Chinese/Korean text does not become missing
glyphs. Print/Save as PDF is a fallback. Students must attach the PDF to the
teacher-designated Teams assignment and select Turn in. The final checkbox is
explicitly a student self-confirmation, not verification from Microsoft.

No publishing, commits, GitHub pushes or Teams posts are performed by saving.

## Visual guides and typing practice

Eight core guide sets are embedded in the existing lesson: the mission story,
list anatomy, actual editor orientation, reading an element, a one-element update,
a sequential trace, source-to-destination copying, and PDF/Teams submission.
The eight sets use nine local image files in `assets/visuals/`; submission uses
both an app-control screenshot and a Microsoft sample. Code screenshots were
captured from the actual lesson editor using a separate colours example, not
student work. Numbered annotations are HTML/SVG overlays, so they remain sharp.
Every coding task also has a data-driven visual starting route and a target or
read-only instruction. The target updates when a student chooses a partner puzzle.
The original reference code, expected console text and 18 coding tasks remain.

Supplied examples, target outputs and diagrams are view-only for typing practice:
normal selection, copying, cutting and dragging are prevented in these areas.
Learners can still select, copy, cut and paste their own code and use keyboard
shortcuts normally. Pasting into the editor is not globally blocked. Explanatory
lesson text remains selectable. This is a classroom affordance, not DRM or an
anti-cheating/security guarantee; developer tools, OCR and external sources can
bypass it. Screen-reader descriptions and text alternatives are retained. Schools
should provide an alternative or accommodation where typing itself is a barrier.

The Teams mobile image is reused from this repository's Week 2 Theory lesson:
[Microsoft — Manage assignments on a mobile device](https://support.microsoft.com/en-us/education/assignments/manage-assignments-on-a-mobile-device).
Its class/assignment are examples, not the pupil's destination. Actual desktop
or iPad labels may differ. Students use the class assignment named by the teacher.

The story image was produced with the built-in image-generation tool. Full prompt:

> Use case: illustration-story. Asset type: wide mission illustration for the existing Route Rescue Year 8 Python lists practical website. Create a polished friendly 3D clay/voxel-inspired spaceship navigation-room illustration, landscape 16:9. One cute small astronaut route engineer with rounded limbs and a reflective visor is checking a navigation console; a compact spaceship can be seen outside the window, soft stars, calm bright lavender, mint, ivory and navy palette matching a purple educational website. On the console are three large separate equally sized tiles containing ONLY simple clearly recognisable direction arrows: UP arrow, LEFT arrow, DOWN arrow, arranged left to right, no text and no numerals. A subtle amber repair tool beside the middle tile suggests replacing one instruction; preserve calm visual hierarchy and spacious composition. This is a story illustration, not a screenshot of an app or a game interface. Soft studio lighting, attractive materials, age appropriate for 12–13 year olds, not babyish. No letters, code, logos, watermarks, extra UI, captions, speech bubbles or text. The Python teaching labels will be added separately as real accessible web text. Keep the astronaut and all three console tiles clearly visible, with no overlapping objects.

## Sources and licences

- Teaching approach: https://teachcomputing.org/pedagogy
- EAL: https://www.bell-foundation.org.uk/resources/guidance/classroom-guidance/effective-teaching-of-eal-learners/
- UI inspiration: https://help.wayground.com/support/solutions/articles/158000404955-accommodations-available-on-wayground
- Accessibility patterns: https://www.w3.org/WAI/WCAG2/supplemental/patterns/o1p04-clear-steps/
- Bundled Skulpt, jsPDF and Raleway licences accompany their files.
- html2canvas: https://github.com/niklasvh/html2canvas (MIT).
