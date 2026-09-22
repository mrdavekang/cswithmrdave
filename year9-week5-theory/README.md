# Year 9 Week 5 — Nested selection and validation

Built to the page order and card structure in `Year 9 Week 5 Theory.pdf`.

Serve this folder over HTTP (for example `python3 -m http.server 8777`). Open index.html through that server. Python workers do not reliably start from file://.

Teacher preview: `?teacher=1`. Supported teacher preview: `?teacher=1&guided=1`.

Languages: English, Bahasa Melayu, Simplified Chinese. The supported route activates for a full name containing Ng Jun Kai, ignoring case, punctuation and repeated spaces. It retains the same learning goals with bilingual prompts and completion starters.

Lesson order: landing; read first (5 MCQs); Do Now (2 Parsons + 6 checks); Types of Learning; nested reading (2 tutors + 3 MCQs); Main Task 1 Parsons (2); debugging (3 runnable repairs); full programming; validation reading (table, routine, 3 MCQs); Main Task 2 validation matching and scenarios; Learning Pit Stop; plenary (1 Parsons + 3 questions); competitive coding; PDF submission.

The interpreter is bundled Skulpt's Python 3 subset, not full CPython. Input appears inline in the console during execution. No account or server receives student code. Work saves per name in this browser; backups restore editable work. PDF uses the browser's Save as PDF option; Teams submission is manual.

The editor, notebook and report infrastructure is reused from the earlier helpdesk lesson. `week5-content.js` supplies this lesson's data; `lesson.js` supplies the sketch-specific pages. Teacher and student notebooks are separate. The previous lesson is not modified.

## Permanent Classroom Mode

Student link (already shared in Teams):
https://mrdavekang.github.io/cswithmrdave/year9-week5-theory/index.html?classId=c429701c-21c3-4e99-b84d-c2faadca7afb

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

Run `supabase/10-permanent-classroom.sql` after the existing Week 3 Supabase setup (steps 5–9). The migration preserves the previously shared class ID and its approved teacher, adds lesson-aware session routing, and keeps the older Week 3 session API separate. It is safe to rerun and refuses to reassign the permanent class to a different owner. Existing cleanup removes expired sessions but preserves the permanent class mapping. Publishing this folder activates the feature on the exact Teams URL above.

`classroom.js`, `classroom.css`, `classroom-config.js` and locally bundled `vendor/supabase.js` handle the connection. The small app bridge exposes only page/language/navigation, never identity or work. Live controls use private channels and server-authorised RPCs. Session discovery uses a read-only RPC every 10 seconds and on reconnect/visibility; an inactive class returns null. A network failure while a class is known to be locked retains that lock until confirmed End or known expiry. Names/class are local report details, not Supabase identities.

### Checks

The migration passed 24 PostgreSQL RPC/permission checks plus assertions for permanent-link reuse, session expiry/cleanup, ownership, private-table denial, and isolation from Week 3 sessions. The lesson regression suite passed 156 page/route/language/view combinations and 18 Python cases. Additional checks confirm the name/class form is retained, remote navigation waits for entry, local report output retains identity, and the classroom bridge excludes it. Live Supabase checks from the preview cover inactive self-study, automatic join, count, lock/bring, named late arrival and ending/restoring navigation. Native browser PDF pagination has not been re-tested; the existing report generator is unchanged.
