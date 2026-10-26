YEAR 7 · WEEK 10 THEORY · BINARY ARCADE

OPEN THE LESSON
Use the public lesson link for school saving. Keep the whole dist folder together
when testing locally. No build, pupil account, installation or paid-plan change
is needed. A local file can be used for device-only work, but school saving needs
HTTPS hosting or a local HTTP preview. This lesson uses the existing cswithmrdave
GitHub Pages repository and its existing Supabase project.
Public route: https://mrdavekang.github.io/cswithmrdave/year7-week10-theory/
Teacher route: https://mrdavekang.github.io/cswithmrdave/year7-week10-theory/teacher.html
If your browser blocks direct local-file opening, use a local static server for
the dist folder. For example, run python3 -m http.server 8000 --bind 127.0.0.1
from dist, then open http://127.0.0.1:8000/. The managed preview browser was tested
using HTTP; it did not permit file:// navigation.

STUDENT ENTRY
Enter a name and class. Choose English or English + Mandarin and one of four
calm colour styles. Entering the same name and class in the same browser resumes
that local copy. This is a profile selector, NOT authentication or a unique
identity across devices. Two pupils must not share the same name/class profile.

PRIVATE TEACHER REVIEW
Open teacher.html separately; no teacher link is shown in the pupil lesson.
Use the existing approved classroom Auth account, not the Supabase dashboard's
GitHub sign-in. There is no signup and a typed pupil name never grants access.
Teacher authentication stays in tab memory only. Reloading or closing the tab
requires sign-in again. Sign out clears private responses from the view.
An authenticated lesson preview lets the teacher inspect all cards and answers.
The dashboard refreshes every five seconds while visible, unless paused.
Choose a class, search a name, use Support to check, then View responses.
Review drafts, first/current answers, checks, hints, corrections, KSU ratings,
pitstop phase, extra practice and recent meaningful actions. Flags are formative
conversation prompts, not diagnoses or formal grades. A heartbeat is not proof
of attention. Game-link launches are not proof of play or completion.

LESSON STRUCTURE · 60 MINUTES
0–2   Welcome: WAGBA, KSU and independent working routines.
2–7   Do now: retrieve four-bit 1001, the role of 0, and doubling 8.
7–10  Types of learning: school definition on its own card, then today's
      Knowledge, Skills and Understanding with meaningful confidence choices.
10–16 Read first: extend to eight places; bits/bytes; six-step model of 22.
16–30 Main task 1: seven conversion/comparison rounds (18, 19, 37, 45, 66, 90,
      then 31 versus 32). Support fades from a running total to independent work.
30–32 Read first: read -> compare -> change -> check, with an 8-to-9 example.
32–47 Main task 2: seven investigation steps. Read stored 36; repair to 38;
      find/correct a wrong label; compare leading zeros and bit length;
      explain why bit position matters.
47–51 Extra challenges: one-bit laboratory (41 to 57), largest unsigned eight-bit
      score, then repeatable Steady/Stretch/Expert build/decode/repair practice.
51–53 Teacher-controlled short external game break (Linguaholic, 8-bit).
53–56 Learning pitstop: current phase plus topic-specific next-step feedback.
56–60 Plenary: independent build 70, decode 129, distinguish value 0 from 8 bits.
After plenary: evidence review and Blooket / Gimkit / untimed practice links.

There are 37 focused cards, including 30 core steps. Fast pupils have repeatable
practice and external games; the teacher need not require every extra challenge.
All tasks are individual. A live partner/driver/navigator routine is not required.

PROGRESSION AND FEEDBACK
Core questions need a response and a check, not a perfect answer. Incorrect
answers receive amber explanatory feedback and may be revisited. They never
create a correctness lock. No keyword-based writing checks or checkbox gates.
There are no long compulsory explanations. Inputs are numbers, bit tiles,
choices and short self-assessment decisions. Full-width digits are accepted.
Future navigation names and redirects to the first unfinished CORE step.
Extra challenges and the short game break are not prerequisites for the pitstop.

VISUALS AND ACCESSIBILITY
Eight existing core visuals are placed at their intended teaching/investigation
points. The 22 worked example uses all six reveal frames with Replay controls.
The finished example is teaching material, not independent assessment.
Important instructions and questions are selectable text, not just image text.
Read-first panels are blue; questions are amber; correctness feedback uses
green for correct and amber for revisit. State is also conveyed in words.
Rainbow bit tiles can be selected in extra practice; they still display 0/1.
Raleway is bundled locally with its licence. Native Chinese-capable fonts provide
Mandarin glyphs. Keyboard focus, large touch targets and reduced motion supported.
Layout is responsive; browser-sized checks are not a physical iPad test.

SAVING AND BACKUPS
The device keeps a localStorage copy and a durable queue of pending changes.
Name/class, answers, checks, attempts, progress and learning reflections save to
restricted Week 10 records in the existing Supabase project after a short pause.
The school-save status says Saved to teacher only after the server acknowledges
the save. Offline work remains local; reconnecting retries. Saving trouble does
not block lesson progress. No screenshots or image uploads are collected.
There is no automatic Teams submission. External games are separate services.
Records include responses, check history, hint use, model steps, practice rounds,
self-reflections and game-link launches. Opening a game is NOT proof of completion.

Download backup is always visible at top right. It creates a JSON file. Restore a
JSON backup returns to that pupil's saved work. If storage is blocked or full,
the status warns that the work is not saved; the app remains usable in memory.
Each record uses a random 256-bit private device key; the server stores its hash.
A name alone cannot retrieve another device's record. The pupil JSON contains
the private key, so it must not be posted publicly or shared with classmates.
Restoring the pupil's own backup on another device preserves that record.
Without the backup, a second device creates a new record, even for the same name.
Names are self-entered, not verified school identities. The same name/class in
the same browser reopens that local profile: shared-device users must not open
another pupil's profile. No public pupil list is exposed.

SECURITY, RETENTION AND RECOVERY
Only the already-approved teacher account may read class responses. Unapproved
authenticated accounts and anonymous callers are denied by database functions.
Private tables have RLS enabled, no public table permissions, and are in an
unexposed schema. Only narrow capability-protected pupil functions are public.
The browser contains a publishable key only, never a service-role or secret key.
Snapshot/event limits, a registration cap and idempotent writes bound normal use.
Drafts are captured at save boundaries, not as a raw keystroke stream.
Another tab's newer revision causes a warning rather than silent overwriting:
download a backup, then Load saved class copy. Device-only work remains usable.
Archive duplicate/test records to hide them from the normal dashboard. Archived
responses remain recoverable and still occupy storage; this is not deletion.
No automatic retention/purge policy or billing/plan settings were changed.
The school should set its retention period and review Supabase usage as classes
accumulate. Text-only does not mean unlimited storage.

PDF IS A BACKUP, NOT A BARRIER
At the debrief, Review my evidence shows answers and check history.
Print / save PDF uses the device's print interface. The browser controls whether
this is a download, a PDF preview or a print dialog; the app does not claim that
Safari automatically saves a PDF. On iPad use Share -> Save to Files if needed.
Clear instructions for saving and attaching a requested file in Teams are in
iPad / laptop help. No screenshots, mandatory PDF or invented Teams assignment
name are required. Clearing browser data removes local work unless backed up.

GAMES · VERIFIED LINKS FROM THE PREVIOUS QUIZ SETUP
Gimkit Don't Look Down (same 15 questions; checkpoints enabled):
https://www.gimkit.com/join/6adee9d2e3d66465b02927fd
Due 2 November 2026, 11pm Malaysia time. Within the existing Pro trial.

Blooket Binary Arcade (15-correct goal):
https://play.blooket.com/play?hwId=6adee88207562e4a40801ef5
Due 9 November 2026, 1:41pm Malaysia time. Free-plan 14-day maximum.

Linguaholic Binary Game (untimed practice; choose 8-bit):
https://linguaholic.com/games/binary-game/

Assignment buttons show a closed notice after their deadline. Untimed practice
remains linked. Assignment game progress/results belong to those platforms, not
this app. No live host is needed for Blooket/Gimkit homework links.

TEACHING ALIGNMENT AND LIMITS
NCCE KS3 objectives: explain bits; measure bit length; represent natural numbers
as binary digits; convert denary/binary. NCCE publishes the referenced unit as
Year 8; these selected concepts are scaffolded here for Year 7 after four-bit work.
This is not a claim that NCCE specifies this exact Year 7 sequence. It is a
continuation of the school's planned eight-bit topic, not a new GCSE unit.
No Python, actual spreadsheet task, text encoding, binary arithmetic, signed
numbers, overflow arithmetic or pixel-art software is introduced in this theory.

Sources checked 26 October 2026:
https://teachcomputing.org/curriculum/key-stage-3/representations-from-clay-to-silicon/numbers-in-binary
https://teachcomputing.org/curriculum/key-stage-3/representations-from-clay-to-silicon/binary-digits
https://www.raspberrypi.org/blog/how-to-design-and-present-clear-computing-lessons-mayers-principles/

Pedagogical choices: retrieval, explicit modelling, stepwise worked example,
guided then independent practice, misconception-focused questions, corrective
feedback, topic-specific self-assessment and fresh exit questions. No timed
competition is required for the core lesson.

EDITING
lesson.js: content, WAGBA, KSU, vocabulary, stages and game links.
app.js: device saving, progression, interactions and pupil backup/report tools.
cloud-config.js: public project configuration and lesson permalink.
cloud.js / tracking-core.js: private-capability transport and formative summaries.
teacher.html / teacher.js / teacher.css: separate authenticated response review.
vendor/: locally bundled official Supabase browser library and licence.
The database migration and security-test scripts are outside dist and are not
copied to the public lesson folder. They affect only this Week 10 lesson.
styles.css: theme, responsive layouts and print styling.
assets/: pupil-facing images and local font only. Teacher QA answers/contact
sheets from the original visual pack are deliberately not copied here.
