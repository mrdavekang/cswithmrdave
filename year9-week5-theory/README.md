# Year 9 Week 5 — Nested selection and validation

Built to the page order and card structure in `Year 9 Week 5 Theory.pdf`.

Serve this folder over HTTP (for example `python3 -m http.server 8777`). Open index.html through that server. Python workers do not reliably start from file://.

Teacher preview: `?teacher=1`. Supported teacher preview: `?teacher=1&guided=1`.

Languages: English, Bahasa Melayu, Simplified Chinese. The supported route activates for a full name containing Ng Jun Kai, ignoring case, punctuation and repeated spaces. It retains the same learning goals with bilingual prompts and completion starters.

Lesson order: landing; read first (5 MCQs); Do Now (2 Parsons + 6 checks); Types of Learning; nested reading (2 tutors + 3 MCQs); Main Task 1 Parsons (2); debugging (3 runnable repairs); full programming; validation reading (table, routine, 3 MCQs); Main Task 2 validation matching and scenarios; Learning Pit Stop; plenary (1 Parsons + 3 questions); competitive coding; PDF submission.

The interpreter is bundled Skulpt's Python 3 subset, not full CPython. Input appears inline in the console during execution. No account or server receives student code. Work saves per name in this browser; backups restore editable work. PDF uses the browser's Save as PDF option; Teams submission is manual.

The editor, notebook and report infrastructure is reused from the earlier helpdesk lesson. `week5-content.js` supplies this lesson's data; `lesson.js` supplies the sketch-specific pages. Teacher and student notebooks are separate. The previous lesson is not modified.
## Permanent Classroom Mode

Keep the existing Teams link:
https://mrdavekang.github.io/cswithmrdave/year9-week5-theory/index.html?classId=c429701c-21c3-4e99-b84d-c2faadca7afb

Open it and choose **Teacher sign-in**, or add `&teacher=1`. The approved teacher can Start classroom, Copy link, Lock navigation, Bring Everyone Here, Unlock / Self-Paced and End classroom. The permanent link is available before a session starts. Sign-in resumes this lesson’s active session; Start begins one if needed.

The class ID identifies the teacher-owned class. The lesson path identifies the lesson. Week 3 and Week 5 can use the same class ID in their existing URLs and have separate live sessions. Starting, moving, locking, unlocking or ending one does not alter the other. Internal session IDs and anonymous connection IDs remain temporary; the public lesson URLs stay fixed.

Students enter name/class for local notebooks and PDFs. These details, their answers, Python code and program inputs are not sent to Supabase. No student account is needed. Before a session starts, pupils can study normally. Their open page connects automatically when the teacher starts, usually within 10 seconds (hidden tabs check when visible again). Students arriving while locked still complete the landing form before any requested move. There is no student Leave button. Ending releases navigation and preserves their local work and the permanent URL. A later session on this link reconnects them automatically.

End classroom is a direct action with no browser confirmation; it ends only temporary live control and preserves all student work. Use End classroom to stop immediately; closing only the teacher tab leaves its session resumable until the two-hour expiry. The count estimates browsers, excludes the teacher, and deduplicates same-browser tabs when storage is available. A network interruption retains the last known lock until confirmed End or expiry. The website cannot prevent someone closing a tab or deliberately opening another URL. Ordinary URLs without classId stay self-paced without Supabase connections.

### Setup

The existing Supabase project already has setup steps 5–11. Run `supabase/12-classroom-multiple-lessons.sql` once. It updates the three permanent-class RPCs to identify sessions by **class ID plus lesson**, retains teacher ownership checks, and works without ending existing sessions. It does not change RLS, create student records, reassign IDs, or require new keys/accounts. Do not rerun the older single-lesson registration/correction scripts. After this upgrade the existing Week 3 and Week 5 lesson links can be started directly from their teacher panels without another lesson-assignment query.

The shared teacher dashboard for registering additional classes/lessons is not part of this update. Only the two existing lesson types are currently supported by server stage validation; new lesson types still need integration and authorised configuration.

### Implementation and verification

The lesson and Python runtime are unchanged. `classroom.js` handles private Realtime channels, anonymous Presence, discovery and controls. `classroom-config.js` contains only the public URL/publishable key; the SDK and licence are local under vendor/. Every command checks the approved teacher and session ownership in Supabase. The lesson bridge exposes only navigation and language, not names or work.

The restored classroom UI was previously checked across 156 lesson/language/view combinations and 18 Python cases, with additional named-entry and report checks. Step 12 passed 28 PostgreSQL RPC/permission checks, including simultaneous lesson isolation, preservation of an already active session, repeated installation, per-lesson stage validation, owner/student denial, End/restart and legacy-session compatibility. Published-site availability depends on publishing these restored website files.

Live preview verification against the configured Supabase project passed teacher recovery, permanent-link auto-join and count, Lock/Bring/Unlock for Week 5 while a Week 3 student stayed self-paced on its own page. Local name/class details were retained. These checks use the existing URLs’ class ID; the restored website files still require publishing.
