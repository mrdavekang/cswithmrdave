YEAR 7 WEEK 11 THEORY — MESSAGE LAB

Student entry: index.html
Teacher presentation: teacher.html
Safe projector: projector.html?class=7T
Private pupil responses: responses.html?class=7T
Public destination: https://mrdavekang.github.io/cswithmrdave/year7-message-lab/

TEACHING SEQUENCE (60 minutes)
Welcome/Do now 4m; Types of learning 2m; private test reflection 12m;
character fact/discussion/model 4m; Message Lab including the remaining
facts/discussions 26m; twelve extra challenges 7m; pitstop 2m; plenary/save 3m.
The teacher sequence has 23 slides and 3600 seconds of allocated time.
Times can overrun. Navigation never advances automatically.

LEARNING
WAGBA: Represent, decode and check a digital message using an agreed
character-code table.
Knowledge: Characters have codes. Eight bits make one byte.
Skills: Encode, decode, repair and test a short message.
Understanding: The same bits can have different meanings under different rules.
The six supplied worked-example visuals are included. Challenge data differs.
Main Task 1: pupils read their own private Teams report and marked papers;
record a strength, an improvement and a next step in the app. A worked review
route is provided if feedback is unavailable. This app does not publish or
upload any marked papers, grades, reports or private Teams material.
Main Task 2: lookup, decode a notice, repair two faults, encode and test a
6–10-character digital sign, and compare number/character/pixel meanings.
Extra challenges have twelve activities across three levels and repeatable
variants. Original attempts are preserved in the private event history.

STARTING AND SUPPORT
Pupils enter their school name and Year 7 class. They do not create an account.
English + Mandarin, vocabulary and device help remain visible in the header.
Garden, Ocean, Coral and Paper colour preferences are available at entry.
No Python, external editor, screenshots or PDF submission is required.
Short phrases are accepted. A non-empty attempt plus Check/Run is sufficient
for progression; correctness is feedback, never an exact-keyword gate.
The sign setup uses a bounded character set and length to keep the task usable.
The table uses familiar character codes padded to eight bits. Original ASCII
is a seven-bit code; do not imply all languages use one byte per character.

TEACHER / PROJECTOR
Typing teacher at pupil entry opens CONTENT PREVIEW ONLY, not private records.
Use the existing approved Year 7 teacher account in Class settings. Approval
is checked on the server, not by a hidden button or the email text alone.
Open / resume a live class, then use Open safe projector. Projector displays
only shared TTA slides, public models and timers. Never project responses.html.
Student responses opens a separate private window with joining-order pupil
tiles, first/later answers, corrections, contextual support choices and history.
The response window may ask for the same teacher sign-in if a browser prevents
session transfer. It never uses a teacher password embedded in a file or URL.
Teacher auth is held in session storage, not a URL or public sync channel.
Numbered discussion shortcuts ONLY select a slide. Invite a discussion and
start Student response time explicitly. Model reveal is separate. Improvements
retain first responses. Reveal/Replay never resets either timer or pupil work.
The lesson timer and discussion response timer are separate. Pause/resume,
per-slide reset, revisits and refresh preserve timing as indicated on screen.
Same-browser projector sync uses a sanitized public state channel; other
devices poll the restricted public room endpoint approximately every 4 seconds.
Pupil records refresh approximately every 5 seconds. This is live polling, not
an instant streaming guarantee. If connectivity fails, local learning continues.

SAVING AND PRIVACY
Local progress is isolated per learner profile on this browser. Autosave also
sends text, attempts, progress and reflections to the separate approved
Supabase Message Lab area using a private random 256-bit device key.
The name is NOT a password or a globally unique identity. Names are self-entered.
No public pupil roster or class-response endpoint is exposed to anonymous users.
The database has RLS and no direct pupil-table grants; narrowly scoped RPCs
validate a pupil's key or the existing approved teacher owner for every call.
Optimistic revisions and idempotent write IDs protect against stale overwrites.
Pupil records from other lessons are not changed. No paid-plan setting changed.
Shared unlocked browser profiles can reveal local work to another person using
that device. Use school-managed personal profiles/devices, do not leave a
shared device unattended, and follow school retention/privacy policy.
Download backup creates a private JSON containing this pupil's work AND save
key. Keep it in the pupil's own school storage; never post it publicly.
Restore that backup to continue the same work on another device. Simply typing
the same name on a new device cannot reopen the old private record.
If versions conflict, both versions can be downloaded; no silent overwrite.
Cloud saved means the teacher can review the saved version. Saved on device
alone is not evidence that the cloud received it. Finish offers retry/backup.
Browser data clearing can erase the private key. Download a backup first.

HOSTING / MAINTENANCE
Static files, no build or paid API required. Essential fonts/images/library are
local. Serve over HTTP(S), not file://, for reliable browser storage and cloud.
Upload the whole folder unchanged, preserving subdirectories and filenames.
config.js contains only a public publishable key, not an admin/service secret.
Do not place assessment PDFs, private response exports, setup SQL, QA screenshots
or teacher credentials in this public folder. Backend setup is kept separately.
The app does not itself post to Teams. Private feedback files must already be
available in each pupil's own assessment channel, or pupils use worked review.
Actual iPad hardware testing is still recommended; layout/touch affordances
were checked at tablet-sized browser viewports, not a physical iPad.

Bundled fonts: Raleway, SIL Open Font License, included in assets/fonts.
Bundled browser library: Supabase JS (existing school app bundle), MIT licence.
