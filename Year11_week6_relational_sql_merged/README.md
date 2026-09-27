# Year 11 · Relational databases and SQL changes

Static, offline-capable lesson app for OxfordAQA International GCSE Computer Science 9210, Paper 2, sections 3.7.1 and 3.7.3. Open `index.html` locally or publish this folder to GitHub Pages. No student account is needed. The optional live Classroom Mode needs an internet connection to Supabase; the lesson itself and student notebook still work without it.

The lesson teaches primary/foreign keys, one-to-many relationships, redundancy/inconsistency, and whole-record `INSERT INTO`, `UPDATE`, `DELETE FROM` and precise `WHERE` conditions. The school-library tables remain beside the questions on a desktop screen. `Preview change` shows the data effect but does not award marks; teacher feedback remains part of both main tasks.

Students enter a name and class. Answers and the optional diagram photo save in this browser. `Full backup` downloads a JSON file for resuming work; `Save PDF` downloads a PDF to submit in Teams. Neither button uploads student data. The sample database resets for each SQL task. Paper extensions are deliberately not displayed in the website: students collect the two printed papers from the teacher and answer them by hand.

Teacher resources: the app's “Mark & improve” page reveals links to the original mark-scheme PDFs after entering the agreed passcode. The PDFs themselves are AES-256 password-protected. As with any static GitHub Pages app, a passcode gate is a convenience, not a secure user-authentication system. Do not publish confidential student information in this folder. Give the passcode to students only when you want to release the schemes.

Print the two question papers from the separate `output/pdf` folder before class. They are not included in this web folder. The original question wording, figures and answer lines are preserved as cropped page images. Teacher PDF links are in `teacher/`.

## Lesson sequence

Prepare/read (6 min); Do Now (5); Types of Learning (3); Main Task 1 (14); SQL reading and worked examples (7); Main Task 2 (16); Learning Pit Stop (3); Plenary (4); final PDF/backup (2). The two paper extensions are optional additional time or follow-up work.

## Classroom Mode

The permanent student link is the ordinary GitHub Pages lesson URL. Students enter their name and class only into their own browser so those details can appear in their PDF; names, class values, answers and SQL work are never sent to Supabase.

Open the lesson with `?teacher=1` to sign in with the approved Supabase teacher account. The fixed green teacher dock provides:

- anonymous connected-device count;
- Screens down, Show only, Let students answer and Self-paced modes;
- automatic following while navigation is locked;
- Bring here once and Return to own work;
- direct navigation to every lesson page and the hidden presentation pages;
- three relational-database fact slides with local student answer boxes;
- a live SQL workspace whose query, highlighted line and preview output appear read-only on student devices.

The teacher dock has Standard, Compact and Tiny display sizes. Select **Minimise controls** while projecting to collapse the entire dock into a small live-status pill; select **Show controls** to restore it. This setting lets the lesson content use most of the screen even when the browser is zoomed in.

The draggable circular clock uses Malaysia time and shows the 2:00–3:00 p.m. classroom cue. It suggests a page but never moves a learner automatically.

Before using this lesson for the first time, run [`supabase/24-year11-week6-relational-sql-latest.sql`](supabase/24-year11-week6-relational-sql-latest.sql) once in the existing Supabase project's SQL Editor. The final result should show `year11_week6_relational_sql_latest_ready = true`. This migration adds only the lesson's permitted page IDs and temporary live-SQL program IDs; it preserves the existing Classroom Mode lessons. Supabase stores control signals and temporary teacher demonstration text for the two-hour classroom session, then the normal cleanup removes the session.

## Original examination extracts

Extension A, 10 marks: November 2024 9210/2 Q05.3–05.4 (3); June 2024 9210/2 Q08.1 and Q08.3 (4); November 2023 9210/2 Q06.1 and Q06.4 (3).

Extension B, 10 marks: June 2025 9210/2 Q01.1–01.3 (5); November 2024 9210/2 Q01.4–01.6 (4); June 2025 9210/2 Q08.1 (1).

The material comes from the question papers and matching final mark schemes supplied by the teacher. The selected source context pages are reproduced where required; unselected subquestions are not included. No examination wording has been rewritten. Keep the PDFs for classroom use in line with your school's exam-material permissions.
