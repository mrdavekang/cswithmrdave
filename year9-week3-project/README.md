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

## Permanent Classroom Mode

Student link (already shared in Teams):
https://mrdavekang.github.io/cswithmrdave/year9-week3-project/index.html?classId=c429701c-21c3-4e99-b84d-c2faadca7afb

Teacher: open that same link, choose **Teacher sign-in** in the Classroom bar, and sign in. This adds `&teacher=1` while preserving the class ID. Only the registered teacher account can start or control this class. The public teacher preview alone grants no classroom privileges.

- **Copy link** is available before starting, and always copies the same permanent student URL.
- Before the session, students enter their name/class for local reports and work normally. No student Supabase account is created. Name, class, lesson answers and Python code remain in their browser and are included in the local PDF/backup, not sent to Supabase.
- **Start classroom** automatically connects student pages already open at this class link, normally within 10 seconds. Returning/hidden tabs check on becoming visible. Sign-in alone does not start a new class; it resumes an active class if one exists.
- **Lock navigation** pauses page changes without stopping answers or Python use. **Bring Everyone Here** moves students to the teacher’s chosen stage. **Unlock / Self-Paced** lets students navigate while staying connected. There is no student Leave button.
- Students arriving during a session still complete the name/class form. Remote stage instructions wait until they open the lesson, then apply to their own notebook.
- **End classroom** releases navigation and deletes the temporary session. The same URL, name/class and local work remain. Students can export their PDF afterwards and automatically connect to the next session on this link. Closed tabs can reopen the named notebook later from this same link.
- Use **End classroom** when teaching is finished. Closing only the teacher tab does not end a session: it can be resumed and otherwise expires after two hours. Ending and starting creates a new internal session ID, but the student link never changes. Session IDs and anonymous Presence IDs are temporary; the permanent database row stores only the class ID, lesson ID and approved teacher ID.

The count estimates connected browsers, excluding the teacher. Multiple tabs share a temporary per-session ID when storage is available; different browsers/private windows may count separately. No student roster/history is stored. Provider operational logs have their own retention. Ordinary URLs without a valid `classId` remain self-paced and do not start Supabase connections. Invalid/unregistered class IDs cannot be claimed through the webpage. The page lock is a pacing aid, not a kiosk: a website cannot stop pupils closing tabs or deliberately opening a different URL.

### Setup and implementation

The Supabase project has steps 5–11 installed. Run `supabase/12-classroom-multiple-lessons.sql` once to let the existing class ID work independently on Week 3 and Week 5. The class ID identifies its teacher-owned class; session lookup also uses the lesson ID. Existing active sessions are preserved. Lock/Bring/Unlock/End affect only the chosen lesson. No new keys, accounts or links are needed. Do not rerun earlier single-lesson registration/correction scripts after this update.

Week 5 now has its own controls at its existing URL with this same class ID. The two lesson paths keep separate temporary sessions. Additional lesson types and a general registration dashboard are not implemented by this update.

`classroom-permanent.js`, `classroom.css`, `classroom-config.js` and locally bundled `vendor/supabase.js` handle the connection. The small app bridge exposes only page/language/navigation, never identity or work. Live controls use private channels and server-authorised RPCs. Session discovery uses a read-only RPC every 10 seconds and on reconnect/visibility; an inactive class returns null. A network failure while a class is known to be locked retains that lock until confirmed End or known expiry. Names/class are local report details, not Supabase identities.

### Checks

The migration passed 24 PostgreSQL RPC/permission checks plus assertions for permanent-link reuse, session expiry/cleanup, ownership, private-table denial, and isolation from Week 3 sessions. The lesson regression suite passed 156 page/route/language/view combinations and 22 Python cases. Additional checks confirm the name/class form is retained, remote navigation waits for entry, local report output retains identity, and the classroom bridge excludes it. Live Supabase checks from the Week 3 preview cover inactive self-study, automatic join, count, lock/bring/unlock and preservation of local name/class details. Deferred entry is covered by the app checks; End/restart behavior was also verified on the shared permanent controller during its initial Week 5 preview. Native browser PDF pagination has not been re-tested; the existing report generator is unchanged.


### Compatibility with older session links

`classroom.js` remains for older `#classroom=…` temporary links and the original teacher URL without a class ID. It does not run alongside the permanent controller. Older anonymous session notebooks remain available in their original tab storage. The new `?classId=…` link always uses the named local notebook and report form, even if old anonymous parameters are present. Use the permanent link above for all future sessions; the old session links still expire. The student Leave button has also been removed from the older controller.
