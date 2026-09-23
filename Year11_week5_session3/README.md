# Year 11 · Week 5 Session 3

Open index.html in a modern browser, or upload this entire folder to GitHub Pages. All fonts and PDF dependencies are local; no build step is required. Student work is stored locally. Supabase supplies anonymous live classroom control; students do not need accounts.

## Teacher
Enter `teacher` as the name (class may be blank) to review the lesson. Navigation is open for all students so that they can revisit reading. On Review answers, use the passcode `Y11isawesome`. This is a classroom reveal control, NOT secure authentication: a static website cannot keep answers secret from someone inspecting its source. Do not use this for a secure assessment. Changing student locks the review again.

The timings total 60 minutes: reading 5, starter 4, types of learning 3, design 15, SQL reading 5, SQL task 18, pitstop 3, plenary 5, submission 2. Extension/review are within task time or follow-up.

## Save and resume
Full backup and Save PDF are pinned top-right throughout the lesson. On the landing page they are visible but disabled until a student starts/restores work. Backup includes answers, all saved SQL attempts, table design, example records and resized evidence photos. Restore validates the file and asks for confirmation before replacing a saved profile. Work is also saved locally in IndexedDB under name/class. Browser/device clearing removes local work: keep backups. The PDF reports every lesson section, not just the current screen. Review answers themselves are not exported; student corrections are.

Submit the PDF manually to Teams. Classroom Mode shows anonymous connected-device counts and navigation controls. Student names, answers and work are not uploaded to Supabase. Keep backups private. JPG/PNG/WebP photographs are supported; convert HEIC first.

## SQL practice
This is a restricted SELECT interpreter, not a full SQL engine. Supports Club, named fields or *, comparisons = > < >= <= <> !=, AND, quoted text and Boolean True/False. It rejects unsupported syntax rather than pretending to execute it. Text matching is case-sensitive in this simulator. Keywords and field names are case-insensitive. Feedback compares requested output fields (in requested order) and records, but does not prove a query is general for every future dataset. Ask students to explain their conditions.

The extension is paper-only: students collect the printed June 2023 9210/2 Questions 07.1 and 07.4 (5 original marks) from the teacher and return their completed paper for feedback. Separate question and original mark-scheme PDFs are supplied outside the website folder. There are no extension answer boxes, uploads or exam answers in the student app. Lesson readings are original explanations aligned to OxfordAQA 9210 3.7.2–3.7.3, not attributed textbook quotations.

## Dependencies
Raleway font: SIL Open Font License (assets/OFL.txt).
jsPDF: MIT license (license information in vendor file).

## Classroom Mode and teacher presentation
Open `index.html?teacher=1`, sign in with your approved Supabase teacher account, then use Start classroom, Lock, Bring Everyone Here, and Unlock / Self-Paced. Plain student URLs automatically use the permanent classroom for this lesson. Existing classId query links remain compatible. Navigation remains self-paced while no session is active. Student identity for PDF export remains local.

Run `17-year11-session3-shared-slides.sql` once in Supabase SQL Editor to register this lesson’s allowed stages. It preserves other lessons and uses the existing shared session functions and teacher permissions. Expect `session3_shared_slides_ready = true`. No new student table or new account setup is required. Publish the updated website folder to GitHub Pages separately.

After approved teacher sign-in, choose **Open teacher presentation**. Its 14 TTA-style slides include all lesson stages, extension/review guidance, and three fact discussions: primary keys; SELECT/FROM/WHERE; inclusive boundary conditions. Topic, WAGBA, knowledge/skills/understanding, keywords and challenge appear beside the instructions. Use Previous, Next or the slide selector to preview privately. Click **Bring everyone to this slide** to send that slide to connected students. Each send moves them once; changing your preview slide does not send it automatically. Close the presentation to return to normal lesson pages and use Bring Everyone Here as usual.

Students have no presentation menu or Previous/Next slide controls. They receive only slides selected by the teacher. On Facts 1–3, each student has a discussion answer box saved with their local lesson notebook, full backup and PDF. The teacher has a separate answer box stored locally; teacher answers are not sent to students, and no answers go to Supabase. Students who have not entered their name/class receive the slide after starting their notebook.

Lock prevents students from closing a shared slide, including with Escape. Unlock lets them return to their lesson. A teacher-directed normal page move closes the shared slide even while navigation is locked. Server permissions continue to restrict classroom commands to approved teachers. Static presentation assets remain publicly downloadable; student navigation is controlled through the interface, not confidential file storage.

Use migration 17 even if step 16 was not run. It includes the Session 3 normal stages as well as all 14 shared slides and preserves prior lessons. Do not rerun the older step 16 after step 17, as it would remove the shared slide destinations.

## Student lesson clock: 11:20–12:20
The circular Lesson clock starts at the bottom right and shows the current time, countdown and suggested activity. Drag the circle to snap it to any screen corner. Click it to expand the plan; the four corner buttons offer a keyboard-friendly alternative. Its corner is remembered on this device. Students may switch **Follow the lesson clock** on/off. It suggests the current activity and displays time remaining, the next activity and the full schedule. It never automatically changes pages. The student can explicitly open the suggested page, provided classroom navigation is unlocked.

The schedule uses the device clock in Asia/Kuala_Lumpur time, independently of whether a live classroom is running. Before 11:20 it counts down to the start; after 12:20 it shows that lesson time has ended. It repeats each day; it is not a teacher-started stopwatch.

| Time | Activity |
| --- | --- |
| 11:20–11:25 | Read first |
| 11:25–11:29 | Do Now |
| 11:29–11:32 | Types of Learning |
| 11:32–11:47 | Main Task 1: design a table |
| 11:47–11:52 | Read SQL |
| 11:52–12:10 | Main Task 2: query, test and improve |
| 12:10–12:13 | Learning Pitstop |
| 12:13–12:18 | Plenary |
| 12:18–12:20 | Save PDF and submit |

Facts, review and extra-time paper extension fit within the relevant task blocks.

## Verification
Run `node tests/classroom.test.cjs` for local bridge, navigation lock, pending classroom move, clock boundaries, optional clock following, shared-slide routing, local discussion responses and original SQL query checks. The migration was also checked in local PostgreSQL-compatible tests for all normal stages, all 14 permitted presentation stages and rejected unknown stages, teacher permissions and compatibility with existing lessons. Live Supabase operation requires the migration above and a signed-in teacher; it has not yet been verified for this lesson.
