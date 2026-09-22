# Year 9 · Helpdesk Python Workshop

A static website redesigned from the supplied handwritten page concepts in **Year 9 Week 5 Project.pdf**, applied to the existing **Year 9 Week 3 helpdesk project**. The topic remains input, variables, constants, calculations, conditions and two advice paths. The filename of the sketch does not change the lesson's identity.

## Open

Serve this directory with HTTP/HTTPS; all runtime files, fonts and assets are local. Direct `file://` opening can prevent Python workers from starting.

```sh
python3 -m http.server 8775 --bind 127.0.0.1
```

- Student landing page: `/`
- Teacher notebook: `/?teacher=1`
- Supported teacher preview: `/?teacher=1&guided=1`

Teacher notebooks are separate from student notebooks. Teacher mode provides reference solutions and a button to switch between standard and supported previews. This is a teaching convenience, not authentication.

## Pages from the sketch

The landing page places the topic, WAGBA, knowledge, skills, understanding and a short definition of learning beside name/class entry and backup loading.

1. Read first: Sam's situation and connection to earlier input/rule/advice work.
2. Do Now: reading reminders beside six recall questions with feedback.
3. Types of Learning: six specific checks, two per K/S/U, then a practice choice.
4. Main Task 1: examples and reading.
5. Main Task 1: input and variables — two Parsons problems and three editable Python exercises.
6. Main Task 1: constants and variables — two Parsons problems and one Python exercise.
7. Main Task 1: conditions — two Parsons problems and one Python exercise.
8. Main Task 2: calculation reading, operator/function tables, a highlighted tutor and two if/else examples.
9. Main Task 2: calculations — two Parsons problems and three Python exercises.
10. Main Task 2: if/else — two Parsons problems and a complete helpdesk program. An assembly button joins the completed calculation and decision blocks; students can also write code directly.
11. Learning Pit Stop: choose a confidence/learning phase for each of six lesson topics.
12. Plenary: input/int recall, trace a completed program, distinguish constants/variables, and save/submit.
13. Further challenge: a busy-day version with a buffer and invalid-number guard, sample outputs and a separate editor.

The page order follows the sketch, including the further challenge after plenary. There are exactly two Main Task groups. Exercise tabs show one editor at a time while preserving each exercise's code. No fixed completion time is imposed on the larger set of practice pages.

## Supported learning route

The landing name field recognises the full name **Ng Jun Kai** case-insensitively, including surrounding text, punctuation separators and full-width characters. It does not match unrelated longer surnames or given names merely containing a partial fragment.

This route uses the same pages and goals with short instructions, English/Mandarin support, word/symbol banks and code with small gaps. It uses choices rather than paragraph responses. No reason for the adaptation or personal difficulty is displayed. Selecting English, Malay or Chinese remains possible; the supported route keeps Mandarin help (or English alongside Chinese).

Each normalised name has its own browser notebook; teacher and student storage are separate. This is local convenience, not a secure identity system. Lesson work is not uploaded and there is no analytics. The optional Classroom Mode exchanges only temporary connection/control information, as detailed below.

## Python editor

- Syntax-coloured code, line numbers, four-space Tab, Shift+Tab to remove four leading spaces, automatic indentation after a colon, Ctrl/Command+Enter to run.
- Code and console appear side by side on wide screens and stack on smaller screens. An expand control enlarges the editor.
- `input()` pauses the actual running program. Its prompt appears inside the console, after previous output. Students type at that prompt and press Enter. There is no separate input-preparation panel.
- Run, Stop, `.py` download, starter replacement with confirmation, console-display clearing, saved execution history and source snapshots.
- Main-program and exercise editors save separately. Moving pages or changing language stops an active run and saves its transcript.
- Test cards give sample inputs and expected outputs. Matching uses the current source code and exact input sequence; output checks ignore only leading/trailing whitespace. “Output differs” asks students to compare, rather than claiming that every differently worded solution is incorrect.
- The bundled worker runs Skulpt's Python 3 subset. It supports the lesson's input, arithmetic, comparison, control flow and ordinary print operations; it is not full CPython and does not install packages or access the filesystem.
- Input waits pause execution timing. The worker limits execution to four seconds of active time, while the page has a 6.5-second watchdog. Code, output, input count and run histories are bounded. Stop terminates a waiting or executing worker.

Core programs expect non-negative whole-number inputs. `int()` converts text but does not validate negative values. The extension adds a negative-number guard; arbitrary words still need additional conversion handling. The 4-minute service estimate is a fictional classroom model, not school policy or a guarantee of help.

## Reflection

Types of Learning displays the student's starter answers beside the six checks. Independent, supported, help-needed and untried are separate. Counts suggest the area with the most practice needs and distinguish ties and untried work. No paragraph is required.

Learning Pit Stop asks only for a learning phase for each of six topics: new learning, consolidating, treading water, or drowning / need help. Short descriptions explain the choices. Untried topics can be left blank. There are no current-ability checks, evidence-source questions, written explanations or next-action questions on this page. The summary counts phase choices, distinguishing a majority, the highest count and a tie. Correctness never automatically assigns a phase. Reports include phase-only responses even when no old ability/evidence fields exist; older fields remain in backups for compatibility.

## Saving and migration

- New notebooks use the `year9-helpdesk-sketch` namespace and version 2.
- Existing version-1 notebooks are not deleted. The welcome page offers “Continue my earlier notebook” when one exists on the same origin.
- Version-1 JSON backups can be imported. Existing code and run transcripts are retained, and the complete older notebook is embedded in the new backup.
- Loading a backup downloads the current notebook first. If a different existing named notebook will be replaced, that notebook is downloaded too.
- Reload returns through the name/class welcome page and resumes the named learner's saved page on entry.
- The primary submission action builds a printable report. Choose Save as PDF in the browser's print dialog, check it, then upload it to Teams. This app does not submit to Teams.
- Reports include attempted code, execution transcripts, ordered code, answers, reflection judgements, evidence choices and next steps. Earlier full data remains available in the editable JSON backup. A readable HTML report and `.py` downloads are also available.

## Validation

Automated checks cover all 156 page/route/language/view combinations, block-order validation, name matching, migration, report escaping and phase summaries. All 22 reference-program test cases passed in the bundled worker, including both advice paths, equality and negative-number handling. Additional checks cover zero, invalid text, empty input and delayed successive prompts.

Browser checks cover moving and checking Parsons blocks, assembling the final program, two sequential live inputs, Enter submission, expected-output matching, the supported name route, translated pages and highlighted tutor. Responsive layouts are inspected at desktop, tablet and phone widths. Browser report construction is verified; the native print dialog and PDF pagination depend on the browser and are not claimed as tested PDF exports.

## Files

`content.js` contains the multilingual curriculum and tasks; `app.js` provides navigation, exercises, storage and editor behaviour; `styles.css` provides the responsive card layout. `python-worker.js`, `vendor/` and `assets/` retain their bundled runtime/font licences. `build-steps.js` is superseded and is no longer loaded by this design.

## Supabase Classroom Mode

The original GitHub Pages path and lesson content are unchanged. Classroom Mode adds `classroom.js`, `classroom.css`, `classroom-config.js`, a locally bundled Supabase browser library (`vendor/supabase.js`, supabase-js 2.117.0, MIT licence in `vendor/supabase-LICENSE`), and a small navigation/anonymous-entry bridge in `app.js`. The library loads only when a classroom connection or teacher sign-in is needed. Ordinary self-paced study does not contact Supabase.

### Teacher workflow

1. Open this lesson with `?teacher=1`, then sign in in the Classroom panel using the approved Supabase teacher account. The URL's existing teacher preview does not authorise classroom commands.
2. Select **Start classroom** and **Copy link**. Share that session link with this class. The link grants anonymous student access; it does not grant teacher permissions. Use the published GitHub Pages page when sharing with students: a localhost preview link only works on the teacher's computer.
3. **Lock navigation** freezes lesson-page navigation while allowing answers, exercise tabs, Python editing and Python execution on the current page.
4. Navigate your own lesson, then select **Bring Everyone Here** to move connected students there once. This saves existing work and stops any running Python program before changing pages. Bring does not automatically lock navigation.
5. **Unlock / Self-Paced** restores student navigation. **End classroom** releases students and deletes the active session record. After ending, the teacher can sign out.

Sessions expire after two hours. The configured Supabase Cron job deletes expired session records every minute when the service is running. Students disconnect and regain navigation on known expiry/end. Lost messages are recovered from the server snapshot on reconnect, visibility changes and every ten seconds. During a network interruption the last known lock remains until the session expiry; work remains local. The count displays unavailable while its Presence connection is down.

### Anonymous students and privacy

Classroom links use `#classroom=<random-session-UUID>`. Students bypass name/class entry and can choose step-by-step Mandarin support without a name. No student Supabase Auth account is created. Existing named notebooks remain separate. Anonymous notebooks use tab session storage, so students should export a PDF or backup before closing the tab. Ending a classroom preserves their current local work for continued self-paced study. Loading a backup into an anonymous notebook removes its name/class/legacy fields; nothing is uploaded.

Only the session UUID, control state and temporary random Presence key are sent. Names, class labels, answers, Python code and program input/output are not sent to Supabase. The teacher count is an estimate of connected browsers, not a verified count of physical devices or people. Tabs in the same browser share a session-specific random ID where storage is available. Private windows, different browsers and blocked storage can count separately. IDs expire with that classroom, are never reused across classes, are cleared on confirmed End/expiry while open, and expired remnants are removed on the next classroom join. No student list or device history is stored in the database. Supabase's own operational logs/backups have their own retention; this feature does not promise zero provider logging.

### Security and setup

`classroom-config.js` contains the public project URL and publishable key, which are intended to ship to browsers. Never add a teacher password, service-role key or secret API key. Teacher authentication is stored in session storage for the teacher tab and is not reused by student clients. Other tabs and devices must sign in separately. User sign-ups and anonymous Auth sign-ins are disabled in Supabase.

Private Broadcast and Presence channels use the installed RLS rules. Students can receive control broadcasts and publish Presence; only the owning, allow-listed teacher can issue commands and read Presence. Every mutation RPC checks account approval, session ownership, expiry and revision. Supabase enforces those permissions even if someone modifies the webpage. The page-navigation lock itself is a classroom pacing feature on a static website, not a tamper-proof device lock.

The setup SQL is in `supabase/`: `06-session-permissions.sql`, `07-classroom-controls.sql`, `08-automatic-cleanup.sql`, and `09-presence-join-fix.sql`. It assumes the previously installed `classroom_private.teachers` allow-list. Rerunning these scripts updates the feature's own setup. Enable `pg_cron` before running step 8. Apply step 9 after step 6: it gives student clients the read permission required to join the Presence channel, while still denying them the Presence list and all Broadcast sends on that channel. Control snapshots use browser Broadcast after an authorised RPC; there are no database Broadcast triggers or student-data tables.

### Classroom verification

Local PostgreSQL tests cover channel permissions and teacher RPCs, including other-account denial, expiry, stale updates and cleanup. Browser integration tests with a simulated transport cover two-device counts, shared-browser tabs, lock/bring/unlock, missed and stale messages, anonymous support, code preservation, mobile layout, translations and real Python execution while locked. The original lesson regression suite passes 156 view combinations and 22 Python cases. Live anonymous checks against the configured Supabase project confirm snapshot access and rejection of teacher RPCs. Live teacher sign-in, session creation, anonymous student entry, Lock, Bring Everyone Here and Unlock have passed against the configured Supabase project. After applying step 9, the live teacher count correctly showed one anonymous browser, including when that browser had two student tabs open. Ending a locked session restored student navigation, and a subsequent server snapshot returned null, confirming that the temporary session was removed. These checks used the local preview; publication to GitHub Pages and a check on the published origin remain separate steps.
