# Year 11 • Term 1 • Week 5 • Session 2

Database concepts: table, record, field, data type and suitable field lengths.

## Open or host
Open index.html in a modern browser. For consistent browser storage, serve the folder using GitHub Pages or a local web server. Upload the entire folder, including assets and vendor, to the repository. No build, server, account, analytics or remote AI service is used. No publishing has been performed.

## Teacher preview
Enter `teacher` as the name. Class may be left blank. There is no teacher selector on the student landing page. This is a navigation convenience, NOT authentication. Every stage is available to students too; there is no public mark scheme. Teachers do not receive live alerts or a central dashboard.

## Lesson route
Read first → 10-question Do Now → Types of Learning → data-type reading and 3 MCQs → Main Task 1 (8 questions, 18 marks) → database-creation reading → Main Task 2 simulator → Learning Pitstop → Plenary (4 AO1-style, 1 AO2-style) → optional extension → PDF submission.
The core timings total 60 minutes. Extension is optional and not additional compulsory work within those 60 minutes. For slower writers, accept brief starter answers and paper work. Pause the class at Main Task 1 Q4 and during the simulator explanations. The plenary can be completed on paper and photographed.

## Save and submit
IndexedDB stores separate profiles by name and class in the current browser. Use the same spelling to resume. Private browsing or school policies can prevent storage; a warning appears if saving fails. Download a backup to transfer devices. Restoring replaces that profile after confirmation. PDF includes all typed answers, KSU checks, photos, current schema/records and full test snapshots. It does not automatically submit to Teams. Students must inspect and turn in their PDF.
Shared devices retain profiles: use only approved devices and follow school data-retention arrangements. Clear this site's browser data when work no longer needs to be retained. PDFs/backups contain pupil data and should not be uploaded into a public GitHub repository.

## Simulator scope
This is a visual learning simulator, not a SQL engine or a DBMS examination requirement. It checks exactly the supplied club brief. Text length is characters, not storage bytes. Additional pattern and range checks are explicitly identified as requirements beyond data types. The editor permits invalid values to support prediction, testing and correction, and never silently truncates text. Maximum 12 fields / 20 records; this lesson requires six / at least three. All test snapshots are retained. Explanations need teacher review.

## Sources
- OxfordAQA 9210 specification 3.7.1–3.7.2 (database terminology and design); SQL introduced in 3.7.3, not practised in this lesson.
- OxfordAQA International GCSE Computer Science Student Book, printed pp. 254–257 (not PDF viewer numbers). Reading is lesson explanation, not a reproduced textbook chapter.
- November 2024 9210/2, printed page 10, Q05.1; full original page image, 1 mark.
- June 2025 9210/2, printed page 14, Q09.2; unchanged crops of context/Figure 5 and Q09.2, 1 mark.
Exam copyright remains with OxfordAQA. Retain attribution and check your school's permission before making past-paper extracts publicly accessible. No mark schemes or textbook scans are included in this student folder.

## Dependencies
Bundled jsPDF, Raleway font and embedded report fonts reused from the existing lesson assets. Raleway licence: assets/OFL.txt. No network is needed after loading, except external source/Teams links. Manual paper uploads support JPEG, PNG and WebP up to 15 MB each, resized for the report; HEIC should be converted to JPEG first.

## Live classroom and teacher-led fact pages

Use the existing plain lesson URL. Teams classId parameters do not choose separate rooms. One live session serves this lesson, isolated from Year 8 and Year 9. Student names, class labels, answers, photos and database designs stay in the existing IndexedDB notebook for the PDF; Supabase receives only anonymous presence and control state.

### One-time activation

After the shared setup through step 13, run `14-year11-week5-session2.sql` in Supabase SQL Editor. Expect `year11_classroom_ready = true`. This extends the private stage allowlist for `Year11_week5_session2`, keeping existing lessons and permissions. No new student accounts or class IDs are needed. Publish this folder's changed and new files to GitHub Pages.

### Teaching with the fact pages

1. Open the normal lesson URL and choose Teacher sign-in (`?teacher=1`). Use the approved classroom account. Typing Teacher in the notebook name field does not grant classroom controls.
2. Start classroom. Connected students join automatically, usually within 10 seconds. Lock navigation pauses page changes but allows answers and table editing.
3. In the signed-in teacher panel, select a page under **Teacher-led fact slides**: Table structure, Suitable data types, or Length and limits.
4. Click **Bring Everyone Here**. This sends the selected page to student browsers. Opening a fact page alone does not broadcast it. A student still on the name/class form sees it after entering the lesson.
5. Students type in the class-question boxes. Their responses save locally and appear in their PDF once answered. Responses are not collected centrally. The teacher can write a separate demonstration answer on the teacher device.
6. Select a normal lesson page after returning to the lesson, use Bring Everyone Here again, and Unlock / Self-Paced when ready. End classroom restores independent study and retains local work. The same link can be reused; sessions expire after two hours if not ended.

Fact pages are not in the normal student page list, Next/Back sequence or URL routing. They are opened from the authenticated teacher panel or an authorised live classroom signal. Reloading does not independently reopen them from a saved notebook. When a live teacher signal applies, they may reopen as intended. Their static HTML/JavaScript content is publicly downloadable on GitHub Pages: this is navigation hiding, not secrecy or secure exam storage. Deliberate browser modification/closing cannot be prevented by classroom pacing controls.

Fact content follows the supplied three-slide Teacher Notes presentation, using green headings, a topic/WAGBA/keywords sidebar, readable examples and class questions. The original PowerPoint was not modified. Completed fact answers are included in backup and PDF; unanswered hidden pages do not add blank report sections.

### Verification

Run `node tests/classroom.test.cjs` for hidden navigation, pending entry, student/teacher bridge behavior, lock/return, local answers and PDF inclusion. Database fixture tests passed 110 RPC checks including all Year 11 pages, anonymous/other-teacher denial, and Year 8/9 compatibility. Browser preview checked all three slide layouts, answer retention and the ordinary student navigation list. Live Supabase Year 11 Start/Presence/Bring/Lock/Unlock/End still requires activation and teacher sign-in.
