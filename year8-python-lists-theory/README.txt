YEAR 8 PYTHON LISTS — RESCUE KIT
==============================

START
Breast Cancer Awareness Day theme: pink-theme.css supplies the blush/rose palette
and a small vector ribbon. It changes presentation only; tracking, activities,
saved work and feedback meanings are unchanged. Remove its stylesheet link and
the awareness labels in index.html when returning to the standard presentation.

Extract the complete ZIP. Open index.html in a modern browser, or upload this
folder unchanged to a static host such as GitHub Pages. No build step is needed.
Prefer a hosted link for a class: browser storage and workers are more reliable
on HTTPS/localhost than on direct file URLs. All essential libraries are local;
no student account or CDN is required.

Student entry: name + 8T or 8E. Choose English, Mandarin or Korean reading support.
School saving begins on Start/resume. Keep using the EXISTING GitHub Pages URL;
no new link, query parameter, Teams resource or student account is required.
Teacher preview: enter teacher as the name (class may be blank), or append
?teacher=1 to the address. This is a convenience testing route, NOT security.
Teacher and student progress use separate browser storage.

LESSON (60 MINUTES)
Mission 3; Do Now 5; Types of Learning 2; Main Task 1 16;
Main Task 2 18; Learning Pit Stop 3; Go Further 8; Plenary/report 5.
Timings are guidance, not locks. This is a 21-practice BANK, not 21 compulsory
activities: six coding practices per main task (three core + three stretch),
then nine extensions (three apply, three debug, three automate). Six core
practices form the supported route. After practice 3, students can move to the
next main stage. Extension cards can go to Plenary whenever the teacher calls
time. Never require students to finish the whole challenge bank in one lesson.

Core: create/print a list, elements, zero-based indexes, read/replace one element.
Prerequisites: strings, assignment, print; some students have learned while loops.
No core list append, search, functions or new iteration technique is required.

Every core card pairs a reading/example with one related response. Five visuals
support, rather than replace, the written explanations. Images 2–5 use a repair
kit; tasks use rescue equipment. Examples and tasks deliberately differ.

Visual update, 16 October 2026: the mission uses aligned text/illustration columns
and larger reading text. Main-task teaching illustrations use large, centred
rows rather than small side floats. Every coding card has a visible target
panel showing exact expected output (or clearly no output yet for data creation).
Challenge reference code is visible before the task, in a different scenario.
Swap/while challenges show changed-data test cases as well as their first target.
Prediction questions intentionally do not reveal their answer in advance.

REVISED PRACTICES (22 OCTOBER 2026)
Main 1: rescue inventory, map retrieval, two-item request; school-trip bag,
game loadout selected by a variable, repair a festival wristband scanner.
Main 2: one replacement, rainy-day kit, before/after evidence; camp checkpoints,
snack-stall arithmetic updates, scoreboard debugging.
Go Further level 1: DJ tracks, avatar upgrades, photo-booth pose swap.
Level 2: wrong loot slot, out-of-date playlist, last coach seat.
Level 3: lobby roll call, any-length playlist, read the game queue backwards.
Each has exact expected output, starting values with zero-based index tiles,
a worked example AND its output using different data, and progressive hints.
Changed-data cases are visible before running. These challenge memorised,
hard-coded answers. len() and temporary variables are introduced where needed.
Every program restarts from its own displayed starting data; no hidden setup.

CHECKING AND ASSESSMENT
Run & check executes real Python locally with Skulpt. Checkers compare values,
output and essential code patterns; they tolerate single/double quotes and spaces
after print. They are formative checks, not a secure assessment or AI detector.
Students may continue after a checked attempt even when wrong. Save as needs help
and continue is always available. Statuses distinguish checks met, attempted,
needs help and unfinished. Open reflections are not automatically graded.

Teacher evidence: inspect prediction answers, execution attempts and the final
independent rescue program. Use exit-ticket answers to decide who still confuses
position/index or replacement/addition. Ask students to explain their own code.
The pit stop describes a current learning experience, not fixed ability. The app
does not infer a learning phase from a tick count.

LANGUAGE AND ACCESSIBILITY
English remains visible. Mandarin/Korean translations appear beside readings,
questions and relevant options. Python keywords/data are not translated.
These are reading supports, not professionally certified translations. Ask a
fluent colleague to review terminology for your learners. All new task readings,
instructions, hints and checker messages have English/Mandarin/Korean support.
Some general navigation/storage controls remain in English. Short answers/oral explanation to the teacher are
acceptable; the help route prevents sentence fluency becoming a progress gate.
All choices use native keyboard controls. Tab indents code; Ctrl/Cmd+Enter runs.
No timed speed ranking, sound, drag-only question or motion requirement.
Choose Steps + starter gaps or Independent on entry, separately from language.
Guidance can change at any time; drafts are never overwritten by that change.
Load starter requires confirmation. The same challenges are available in either
mode. A previous-edition draft stays saved and is flagged for a new check.

PYTHON LAB
Skulpt executes the lesson's Python syntax in the browser. It is not CPython and
does not include all desktop modules. The web version uses a worker which can
be terminated; direct-file mode uses Skulpt's execution limit on the main page.
Input prompts appear inside the console, not in a separate answer box.
Long-running loops and excessive output are stopped. If a device stalls, reload;
recent code saves locally before running. Do not run untrusted code from others.

SCHOOL LEARNING RECORDS (SUPABASE)
cloud-config.js contains only the existing public browser connection key.
Apply supabase/01-learning-records.sql in the existing Supabase SQL Editor as
the database owner. It creates only this lesson's y8_lists_private schema and
four lesson-specific public RPC functions. It does not change other classrooms,
Auth users, global permissions or exposed schemas. The verified existing teacher
Auth account owns these records; no password/secret key belongs in this folder.

Captured after student entry: name/class, language/guidance, MCQ selections,
checkboxes, short responses, code drafts, checked attempts, Python output/errors,
published test results, hints, help requests, console input, navigation, evidence
and caption, exports and SELF-REPORTED Teams confirmation. Typing is coalesced
after a short pause, NOT recorded as individual keystrokes. There is no tracking
of other apps, browser tabs or teacher login fields. The lesson does not collect
IP addresses, although normal hosting/Supabase service logs may do so. Evidence is
private JSON image data, not a public Storage URL. Removing it removes the
current stored image; the evidence-removal action remains in the event history.

Each work session has an independent random UUID and 256-bit write key. Only its
hash is stored in the database; the key is sent over HTTPS for write verification.
Students can write with their own key but have NO
API for reading a roster or other pupils' work. The browser public key and the
teacher preview flag grant no access to private records. Name entry is NOT a
verified school login: do not treat these logs as proof of identity, authorship,
attendance, secure exam performance or AI detection. Duplicate names never merge.

Offline: IndexedDB queues edits and snapshots, retries on reconnection and
retains unacknowledged IDs. Retries are idempotent; stale snapshots cannot
overwrite newer state. The School save button shows pending/offline/synced
states and offers Retry. Synced means the database acknowledged receipt. Keep
this browser's data until queued work syncs. Clearing site data destroys any
unsynced queue; a JSON backup retains work but not private write credentials.
Restoring on another browser starts a separate trace under the entered name.
Exports and existing local saving continue when Supabase is unavailable.

Teacher: open ?teacher=1 or enter teacher, then select Learning records. Sign in
with the existing approved Supabase teacher email/password (not the Supabase
Studio/GitHub login unless it is also that teacher Auth account). The password
is cleared from the form; auth stays in memory only. Filter 8T/8E, View work,
inspect the latest answers/code and paginated timeline, or download a complete
private JSON trace. Sign out before leaving a shared device. Dashboard records
and downloaded pupil traces must never be committed to GitHub or shared publicly.

The first connection can include work already saved locally, but cannot recover
past input that no longer exists on a device. New events include client and
server-received times. The log is immutable through the student API; there is
no automatic deletion. The school/database owner must apply its own approved
retention policy. Limits: 300 new sessions/24 hours, 10,000 events per session,
40 events/batch, 4 MB state snapshot, 6 MB compressed evidence JSON. Limits and
errors remain visible rather than silently claiming success or dropping work.

Security references:
https://supabase.com/docs/guides/api/securing-your-api
https://supabase.com/docs/guides/database/functions

LOCAL SAVING AND PRIVACY
Responses, code, feedback and the latest 60 attempts per card are stored in
localStorage. One optional compressed screenshot and caption use IndexedDB.
Refresh reopens the current card. Private/incognito browsing, clearing storage,
school-managed settings or device changes can remove work. The app has no
automatic Teams access. Its separate teacher learning-record view uses the
private Supabase connection described above.
Use Work tools > Download progress backup before switching device or learner.
The JSON backup includes compressed image evidence; restore it with Import.
Import validates the lesson/schema, asks before replacing current work and
restores the image. Maximum backup 10 MB; maximum upload image 8 MB. Uploaded
images resize to max 1600 pixels and compress to JPEG. One image is retained;
replace/remove controls and screenshot paste are supported. Avoid pupil faces
and personal information. Keep exported work private. Reset removes current
browser progress, not previously downloaded backups or earlier school records.

PDF AND TEAMS
Export PDF is available throughout. Reports contain goals, question responses,
code/output, attempt history, hints/help and evidence. Unfinished stages stay
visible. Reports are A4 and image-rendered so Mandarin/Korean can use device
fonts; text is NOT selectable/searchable. Large histories may make large PDFs.
Use Work tools > Print / Save as PDF for a browser-native alternative.
After downloading, the submission guide explains Downloads/Files and Teams.
Students attach the PDF to the assignment you name and press Turn in. Their
confirmation is self-reported; this app cannot verify a Teams submission.
The filename includes the class and learner name, not an assumed week number.

HOSTING / FILES
index.html, styles.css, lesson.js, app.js: interface/content/state.
missions.js: revised task bank, targets, changed-data cases and references.
practice.js: shared access to those specifications (one source of truth).
runner.js + python-worker.js + vendor/: local Python execution.
checks.js: formative semantic checks. report.js: PDF/print report.
cloud.js + cloud-config.js: lesson-only outbox, school save and teacher records.
supabase/01-learning-records.sql: additive private tables and restricted RPCs.
assets/images/: five 4:3 teaching visuals. Select any visual to enlarge it.
assets/fonts/: locally bundled Raleway and OFL license.
Keep folder paths and case unchanged when hosting in a GitHub Pages subfolder.
This version is for local use and GitHub Pages only. No ChatGPT Sites creation,
synchronization or publication is part of this workflow. Saving this folder does
not commit or push it to GitHub. Do that only when the teacher requests it.

LICENSE NOTICES
Skulpt: bundled license in vendor/Skulpt-LICENSE.txt.
jsPDF: bundled license in vendor/jsPDF-LICENSE.txt and source header.
html2canvas 1.4.1: MIT; copyright 2022 Niklas von Hertzen; notice in source header.
Raleway: SIL Open Font License; see assets/fonts/Raleway-OFL.txt.
Teaching illustrations were generated for this lesson and checked against the
list definitions/output shown. Written examples remain the authoritative guide.
