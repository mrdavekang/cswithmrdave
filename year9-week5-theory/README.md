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

Open it and choose **Teacher sign-in**, or add `&teacher=1`. The approved teacher gets a fixed control dock at the bottom of every page. The classroom status always shows whether the session is live, the current teaching mode and the number of anonymous student devices. The permanent link is available before a session starts. Sign-in resumes this lesson’s active session; Start begins one if needed.

The four teaching modes have distinct purposes:

- **Screens down** displays a large attention screen. Students cannot navigate or type.
- **Show only** keeps every connected browser on the teacher’s current page. Students can read and scroll, but cannot type.
- **Let students answer** keeps the page together while enabling its answer boxes, editors and controls.
- **Self-paced** releases the class. **Return to own work** takes each browser back to the page and scroll position it had before teacher control.

While Screens down, Show only or Let students answer is active, moving to another lesson page or fact slide automatically moves the class too. **Bring here once** is available for a single move without changing the current mode. The dock includes direct lesson-page and fact-slide menus, so the teacher can return from a presentation to any working page without scrolling to the top.

Students see a single, discreet **Teacher sign-in** link on the landing page only. After they open the lesson, the student classroom status strip and teacher link are hidden. Classroom control continues in the background, while the full-screen Screens down and live-code views appear only when the teacher sends them. The teacher’s fixed control dock remains visible in teacher mode.

The circular lesson clock covers **10:20–11:20 a.m.** It shows the current activity, remaining time, the next activity and three short focus steps. Students may expand it, drag it and snap it to any corner. They may turn off activity guidance and keep the clock only. **Open suggested page** is always a choice: the timer never changes pages automatically and disables that button while the teacher controls navigation.

`green-theme.css` applies the school’s green palette across the landing page, navigation, cards, reflections, Python IDE, terminal, fact slides, classroom remote, live-code view and timer. White and pale-green surfaces keep long reading sections clear; dark green identifies teacher-led and code areas, with gold used only for focus and current-state emphasis.

The class ID identifies the teacher-owned class. The lesson path identifies the lesson. Week 3 and Week 5 can use the same class ID in their existing URLs and have separate live sessions. Starting, moving, locking, unlocking or ending one does not alter the other. Internal session IDs and anonymous connection IDs remain temporary; the public lesson URLs stay fixed.

Students enter name/class for local notebooks and PDFs. These details, their answers, Python code and program inputs are not sent to Supabase. No student account is needed. Before a session starts, pupils can study normally. Their open page connects automatically when the teacher starts, usually within 10 seconds (hidden tabs check when visible again). Students arriving while locked still complete the landing form before any requested move. There is no student Leave button. Ending releases navigation and preserves their local work and the permanent URL. A later session on this link reconnects them automatically.

End classroom is a direct action with no browser confirmation; it ends only temporary live control and preserves all student work. Use End classroom to stop immediately; closing only the teacher tab leaves its session resumable until the two-hour expiry. The count estimates browsers, excludes the teacher, and deduplicates same-browser tabs when storage is available. A network interruption retains the last known lock until confirmed End or expiry. The website cannot prevent someone closing a tab or deliberately opening another URL.

### Setup

For the current remote and live-code features, run `supabase/21-year9-week5-live-demonstration.sql` once in the existing Supabase project. It is a cumulative upgrade: it keeps the enabled lesson/stage list, adds the current presentation modes and adds temporary live demonstration state. Expect the final result `live_demo_ready = true`. It does not create student records, reassign the permanent class ID or require new keys/accounts.

The permanent Week 5 URL and existing Teams link continue to work. Future lesson types still need their lesson ID and permitted stages added to the server allowlist.

### Implementation and verification

`classroom.js` handles private Realtime channels, anonymous Presence, discovery, teaching modes and the fixed teacher dock. `classroom-config.js` contains only the public URL/publishable key; the SDK and licence are local under vendor/. Every command checks the approved teacher and session ownership in Supabase. The lesson bridge exposes navigation and the teacher’s selected demonstration only; student names, answers and code remain local.

The restored classroom UI was previously checked across 156 lesson/language/view combinations and 18 Python cases, with additional named-entry and report checks. Step 12 passed 28 PostgreSQL RPC/permission checks, including simultaneous lesson isolation, preservation of an already active session, repeated installation, per-lesson stage validation, owner/student denial, End/restart and legacy-session compatibility. Published-site availability depends on publishing these restored website files.

Live preview verification against the configured Supabase project passed teacher recovery, permanent-link auto-join and count, Lock/Bring/Unlock for Week 5 while a Week 3 student stayed self-paced on its own page. Local name/class details were retained. These checks use the existing URLs’ class ID; the restored website files still require publishing.

## Teacher-led presentation pages (three supplied fact slides)

The plain lesson URL now uses the configured shared permanent class, independent of Teams-added classId parameters. Choose Teacher sign-in and use the approved Supabase classroom account. Under Teacher-led fact slides, open Nested selection, Validation, or Boundary test data, then press Bring Everyone Here. Opening a slide alone does not move students. Lock keeps students on the displayed page while they answer. Unlock allows normal navigation, and Return to lesson returns to the previous lesson stage.

Facts are excluded from student menus and the normal Next sequence; students see them when the teacher brings the class there. A learner at the landing page completes local name/class entry first. The pages remain publicly downloadable static assets, not secret material. Teacher control permissions remain enforced by Supabase. Names, work and answers are never sent to Supabase.

Each page preserves the supplied PPT example, class question and challenge. English, Malay and Mandarin (including bilingual/supported reading) are available. Responses save in the existing notebook, survive backup/restore and appear in PDF/readable reports when answered. Hidden pages do not change saved lesson-page IDs. The original presentation is unchanged.

Activation: after shared setup through step 14, run `supabase/15-year9-week5-facts.sql` once. Expect `week5_facts_ready = true`. It adds only three allowed Year 9 Week 5 stage IDs and preserves all previously enabled lessons and teacher permissions. Publish the changed/new files in this folder, including fact-slides.js, fact-integration.js and fact-slides.css. The old Teams URL continues to work.

Checks: `node tests/facts.test.cjs` covers 156 existing page/language/view combinations, all three fact pages in all supported languages, answer backup/report retention, hidden menus, lock/return behavior and 18 Python examples with console input. SQL migration checked for idempotence, allowed fact stages and existing permission/isolation regressions. Browser layouts inspected for all three pages. Live Bring/Presence tests await running step 15 and signing in.

## Live Python teaching demonstration

In the teacher dock, choose one of the five built-in Python programs and press **Start live code**. The teacher is taken to that editor and the class enters Show only mode. Students see a separate full-screen, read-only mirror containing:

- the teacher’s current code;
- a highlighted current line that follows the teacher’s cursor;
- the latest program output; and
- a clear message that the demonstration does not replace their saved work.

Edits and cursor movement are broadcast quickly through the private Realtime channel. A small temporary snapshot is also saved in the active classroom session so a reconnecting or late-arriving device can recover the current demonstration. Press **Send latest code** to resend immediately and **Stop demonstration** to close it on every connected student browser. Releasing or ending the classroom also closes the mirror.

Students cannot edit or run the mirrored program. Their own editor remains unchanged underneath it. The demonstration code and output disappear with the temporary two-hour classroom session; student code, program input, answers, names and classes are never sent to Supabase. Because the teacher’s demonstration is shared to pupil devices, never type passwords, API keys or personal data in the live editor.

Verification: `node tests/classroom-live-demo.test.cjs` checks the read-only mirror, highlighted line, anonymous Presence, protection of student code, teacher broadcast and stop behavior. The SQL verification covers repeat installation, temporary recovery, size and program validation, teacher ownership, all teaching modes, return/end behavior and compatibility with the existing control call.

`node tests/lesson-clock.test.cjs` checks the complete 60-minute schedule, uninterrupted stage timing, valid lesson destinations, timer wording and the four draggable corner positions.
